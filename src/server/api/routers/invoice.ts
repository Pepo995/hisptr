import { createTRPCRouter, publicProcedure } from "@server/api/trpc";

import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import dayjs from "dayjs";
import { encodeBase64 } from "@utils/Utils";

import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { createInvoiceSchema } from "@schemas";
import { getPricesForEventLineItems } from "@utils/price";
import { z } from "zod";
import { getWhereForInvoices } from "@utils/invoiceUtils";

dayjs.extend(advancedFormat);
dayjs.extend(utc);

export const invoiceRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        tab: z.enum(["all", "paid", "unpaid"]),
        page: z.number().default(1),
        pageSize: z.number().default(10),
        filter: z.string().optional(),
        market: z.string().optional(),
        dateRange: z
          .object({
            from: z.date().optional(),
            to: z.date().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input: { tab, page, pageSize, filter, market, dateRange } }) => {
      const where = getWhereForInvoices(filter, market, dateRange?.from, dateRange?.to);

      const invoicesQuery = ctx.prisma.invoice.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          id: "desc",
        },
        include: {
          event: {
            include: {
              states: true,
            },
          },
          inProcessEvent: {
            include: {
              type: true,
            },
          },
        },
      });

      const totalResultsQuery = ctx.prisma.invoice.count({
        where,
      });

      const [invoices, total] = await Promise.all([invoicesQuery, totalResultsQuery]);

      if (tab === "paid") {
        const filteredInvoices = invoices.filter(
          ({ event }) =>
            event && event?.amountPaidInCents === event.totalPriceInCents - event.discountInCents,
        );

        return {
          invoices: filteredInvoices,
          total: filteredInvoices.length,
        };
      }

      if (tab === "unpaid") {
        const filteredInvoices = invoices.filter(
          ({ event }) =>
            event && event?.amountPaidInCents !== event?.totalPriceInCents - event?.discountInCents,
        );

        return {
          invoices: filteredInvoices,
          total: filteredInvoices.length,
        };
      }

      return {
        invoices,
        total,
      };
    }),

  createInvoice: publicProcedure
    .input(createInvoiceSchema)
    .mutation(
      async ({
        ctx,
        input: {
          inProcessEventId,
          firstName,
          lastName,
          city,
          stateId,
          invoiceDate,
          dueDate,
          eventDate,
          phoneNumber,
          marketName,
          eventLineItems,
        },
      }) => {
        // 1st Get the inProcessEvent info.
        const inProcessEvent = await ctx.prisma.inProcessEvent.findUnique({
          where: {
            id: inProcessEventId,
          },
        });

        if (!inProcessEvent)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "In process event not found",
          });

        if (!inProcessEvent.email)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing email in event",
          });
        if (!inProcessEvent.eventDate)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing eventDate in event",
          });
        if (inProcessEvent.phoneNumber === null)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing phoneNumber in event",
          });

        const mainPackage = eventLineItems.find((item) => item.type === "package");

        if (!mainPackage)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing main package in eventLineItems",
          });

        const {
          travelFeeInCents,
          subtotalAmountInCents,
          stripeFeeForPartialInCents: stripeFeeForPartialInCents,
          totalPriceForPartialInCents,
          stripeFeeForFullInCents: stripeFeeForFullInCents,
          totalForFullInCents: totalPriceForFullInCents,
        } = getPricesForEventLineItems(eventLineItems);

        // 2nd Create or update event.
        // 3rd Update inProcessEvent.

        const [event] = await Promise.all([
          ctx.prisma.event.upsert({
            where: {
              inProcessEventId,
            },
            update: {
              firstName,
              lastName,
              city,
              stateId,
              eventDate: dayjs(eventDate).utc().toDate(),
              phoneNumber,
              packageId: mainPackage.id,
              stripeFeeInCents: stripeFeeForPartialInCents,
              totalPriceInCents: totalPriceForPartialInCents,
              travelFeeInCents,
              inProcessEventId,
              paymentPlan: "partial_50_50",
            },
            create: {
              eventNumber: Math.round(Math.random() * 999999 + 100000).toString(),
              email: inProcessEvent.email,
              firstName,
              lastName,
              city,
              stateId,
              eventDate: dayjs(eventDate).utc().toDate(),
              phoneNumber,
              packageId: mainPackage.id,
              stripeFeeInCents: stripeFeeForPartialInCents,
              totalPriceInCents: totalPriceForPartialInCents,
              travelFeeInCents,
              inProcessEventId,
              paymentPlan: "partial_50_50",
            },
          }),

          ctx.prisma.inProcessEvent.update({
            where: {
              id: inProcessEventId,
            },
            data: {
              firstName,
              lastName,
              city,
              stateId,
              eventDate: dayjs(eventDate).utc().toDate(),
              phoneNumber,
              marketName,
              packageId: mainPackage.id,
              packageQty: mainPackage.quantity,
              packageDescription: mainPackage.description,
              packageRetailPriceInCents: mainPackage.retailPriceInCents,
              stripeFeeForFullInCents,
              stripeFeeForPartialInCents,
              totalPriceForFullInCents,
              totalPriceForPartialInCents,
              travelFeeInCents,
              paymentPlan: "partial_50_50",
            },
          }),
        ]);

        // 4th Create add ons and extra packages.
        const addOns = eventLineItems.filter((item) => item.type === "add-on");
        const extraPackages = eventLineItems.filter(
          (item) => item.type === "package" && item.id !== mainPackage.id,
        );

        await Promise.all([
          ctx.prisma.eventAddOn.createMany({
            data: addOns.map((addOn) => ({
              eventId: event.id,
              addOnId: addOn.id,
              quantity: addOn.quantity,
              unitPriceInCents: addOn.retailPriceInCents,
              description: addOn.description,
            })),
          }),
          ctx.prisma.eventPackages.createMany({
            data: extraPackages.map((extraPackage) => ({
              eventId: event.id,
              packageId: extraPackage.id,
              packageDescription: extraPackage.description,
              packageRetailPriceInCents: extraPackage.retailPriceInCents,
              packageQty: extraPackage.quantity,
            })),
          }),
        ]);

        // 5th Create new invoice.
        const invoice = await ctx.prisma.invoice.create({
          data: {
            invoiceDate: dayjs(invoiceDate).utc().toDate(),
            pendingDueDate: dayjs(dueDate).utc().toDate(),
            eventId: event.id,
            invoiceType: "deposit",
            subtotalInCents: subtotalAmountInCents,
            inProcessEventId,
            pendingInCents: totalPriceForPartialInCents,
          },
        });

        // 6th Generate the token and return the non public link to the checkout.
        const token = encodeBase64(invoice.id);

        return {
          success: true,
          linkToCheckout: `${env.NEXT_PUBLIC_VERCEL_URL}/custom-invoice/${token}`,
        };
      },
    ),
});
