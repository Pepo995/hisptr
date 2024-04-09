import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";

export const authRouter = createTRPCRouter({
  getEventByToken: publicProcedure
    .input(
      z.object({
        signUpToken: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input: { signUpToken } }) => {
      if (signUpToken) {
        const event = await ctx.prisma.event.findUnique({
          where: {
            signUpToken: signUpToken,
            acceptedAt: null,
          },
        });

        return event;
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Signup Token not found",
        });
      }
    }),

  completeUserInvitation: publicProcedure
    .input(
      z.object({
        eventId: z.bigint(),
        signUpToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { eventId, signUpToken } }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
          acceptedAt: null,
          signUpToken,
        },
      });

      if (!event)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event does not exists",
        });

      await ctx.prisma.event.update({
        where: {
          id: eventId,
          acceptedAt: null,
          signUpToken,
        },
        data: {
          acceptedAt: dayjs.utc().toDate(),
        },
      });
    }),
});
