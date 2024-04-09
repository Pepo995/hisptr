import { createTRPCRouter, customerProtectedProcedure } from "@server/api/trpc";

import {
  customerUpdateEvent,
  customerUpdatePersonalization,
  customerUpdateSetup,
  customerUpdateVenue,
} from "@schemas";

import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import { type Prisma, tickets_status } from "@prisma/client";
import { prisma } from "@server/db";
import { z } from "zod";
import { type RouterOutputs } from "@utils/api";
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

const ticketStatusEnum = z.nativeEnum(tickets_status);

export type DashboardInformation = RouterOutputs["eventCustomerRouter"]["getDashboard"];
export type DashboardInformationEvent = DashboardInformation["event"];
export type DashboardInformationTickets = DashboardInformation["tickets"];

export const eventCustomerRouter = createTRPCRouter({
  addDetails: customerProtectedProcedure
    .input(customerUpdateEvent)
    .mutation(async ({ ctx, input: payload }) => {
      const {
        id,
        eventDate,
        firstName,
        lastName,
        phoneNumber,
        isEventPlanner,
        typeId,
        categoryId,
        reachVia,
        guestCount,
        startTime,
        endTime,
        email,
      } = payload;
      const eventId = BigInt(id);

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const today = dayjs().format("YYYY-MM-DD");
      const currentTime = dayjs().format("HH:mm");
      const startTimeDate = dayjs.utc(`${eventDate}T${startTime}`);
      const endTimeDate = dayjs.utc(`${eventDate}T${endTime}`);
      if (
        dayjs(eventDate).isSame(today) &&
        (dayjs(endTimeDate).isSameOrBefore(startTimeDate) || startTime < currentTime)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please check your start time.",
        });
      }

      await ctx.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          eventDate: dayjs(eventDate).toDate(),
          firstName,
          lastName,
          phoneNumber: String(phoneNumber),
          isEventPlanner,
          typeId,
          categoryId,
          reachVia: Number(reachVia),
          guestCount,
          startTime: startTimeDate.toDate(),
          endTime: endTimeDate.toDate(),
          email: email,
        },
      });

      return {
        success: true,
        status: 200,
        eventId: event.id,
      };
    }),
  getDashboard: customerProtectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    let nextEvent = null;
    if (user.type === "customer") {
      const now = dayjs().startOf("day");
      nextEvent = await ctx.prisma.event.findFirst({
        where: {
          userId: user.id,
          OR: [
            { eventDate: { gte: now.toDate() } },
            { eventDate: now.toDate(), startTime: { gte: now.toDate() } },
          ],
        },
        orderBy: [{ eventDate: "asc" }, { startTime: "asc" }],
        select: {
          id: true,
          userId: true,
          market: true,
          packageId: true,
          stateId: true,
          typeId: true,
          categoryId: true,
          eventVenueDetails: true,
          eventSetupDetails: true,
          eventPhotosDetails: true,
          partnerId: true,
          hostId: true,
          availabilityId: true,
          startTime: true,
          eventDate: true,
          adminStatus: true,
          packages: {
            select: {
              title: true,
              picture: true,
              description: true,
              id: true,
            },
          },
        },
      });
    }
    const tickets = await getUserTickets(user.id, { page: 1, pageSize: 5 });
    return {
      event: nextEvent,
      tickets,
    };
  }),
  getTickets: customerProtectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().optional(),
        status: ticketStatusEnum.optional(),
        pageSize: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      const tickets = await getUserTickets(user.id, {
        search: input.search,
        page: input.page ?? 1,
        status: input.status ? [input.status] : undefined,
        pageSize: input.pageSize ?? 5,
      });
      return tickets;
    }),

  addVenueDetails: customerProtectedProcedure
    .input(customerUpdateVenue)
    .mutation(async ({ ctx, input: payload }) => {
      const { id, ...data } = payload;
      const eventId = BigInt(id);

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventVenueDetails: true,
        },
      });
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const venueDetails = event.eventVenueDetails.shift();
      if (venueDetails) {
        await ctx.prisma.eventVenueDetail.update({
          where: {
            id: venueDetails.id,
          },
          data,
        });
      } else {
        await ctx.prisma.eventVenueDetail.create({
          data: {
            eventId,
            ...data,
          },
        });
      }

      return {
        success: true,
        status: 200,
        eventId: event.id,
      };
    }),

  addSetupDetails: customerProtectedProcedure
    .input(customerUpdateSetup)
    .mutation(async ({ ctx, input: payload }) => {
      const { id, ...data } = payload;
      const eventId = BigInt(id);

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventSetupDetails: true,
        },
      });
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const setupDetails = event.eventSetupDetails.shift();
      if (setupDetails) {
        await ctx.prisma.eventSetupDetail.update({
          where: {
            id: setupDetails.id,
          },
          data,
        });
      } else {
        await ctx.prisma.eventSetupDetail.create({
          data: {
            eventId,
            ...data,
          },
        });
      }

      return {
        success: true,
        status: 200,
        eventId: event.id,
      };
    }),

  getSetupDetailsByEventId: customerProtectedProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input: { eventId } }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventSetupDetails: true,
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const eventSetupDetails = event.eventSetupDetails.shift();

      return {
        status: 200,
        success: true,
        eventSetupDetails,
      };
    }),

  addPersonalization: customerProtectedProcedure
    .input(customerUpdatePersonalization)
    .mutation(async ({ ctx, input: payload }) => {
      const { id, ...data } = payload;
      const eventId = BigInt(id);

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventPhotosDetails: true,
        },
      });
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const personalizationDetails = event.eventPhotosDetails.shift();
      if (personalizationDetails) {
        await ctx.prisma.eventPhotosDetail.update({
          where: {
            id: personalizationDetails.id,
          },
          data,
        });
      } else {
        await ctx.prisma.eventPhotosDetail.create({
          data: {
            eventId,
            ...data,
          },
        });
      }

      return {
        success: true,
        status: 200,
        eventId: event.id,
      };
    }),

  getPersonalizationByEventId: customerProtectedProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input: { eventId } }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventPhotosDetails: true,
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const personalizationDetails = event.eventPhotosDetails.shift();

      return {
        status: 200,
        success: true,
        personalizationDetails,
      };
    }),
});

const getUserTickets = async (
  userId: bigint,
  options: { search?: string; page: number; status?: tickets_status[]; pageSize: number },
) => {
  const statuses = options.status;
  const query = {
    where: {
      userId,
      ticketType: "customer",
      status: statuses ? { in: statuses } : undefined,
      title: { contains: options.search ?? "" },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: options.pageSize,
    skip: options.pageSize * (options.page - 1),
    include: {
      ticketImages: true,
      ticketTrails: true,
      events: true,
      users: true,
    },
  } satisfies Prisma.TicketFindManyArgs;

  const [tickets, total] = await prisma.$transaction([
    prisma.ticket.findMany(query),
    prisma.ticket.count({ where: query.where }),
  ]);

  return {
    tickets,
    total,
    page: options.page,
    pageSize: options.pageSize,
  };
};

export type TicketWithEventAndUser = Prisma.PromiseReturnType<typeof getUserTickets>["tickets"][0];
