import { createTRPCRouter, publicProcedure } from "@server/api/trpc";
import { createPromotionalCodeSchema } from "@schemas";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { PrismaErrorCodes } from "@server/errors";
import { TRPCError } from "@trpc/server";
dayjs.extend(utc);

export const promotionalCodeRouter = createTRPCRouter({
  list: publicProcedure.query(
    async ({ ctx }) => await ctx.prisma.promotionalCode.findMany(),
  ),

  update: publicProcedure.input(createPromotionalCodeSchema).mutation(
    async ({
      ctx,
      input: { code, discount, isPercentage, isOneTime, expiresAt },
    }) =>
      await ctx.prisma.promotionalCode.update({
        where: { code },
        data: {
          discount,
          isPercentage,
          isOneTime,
          expiresAt,
        },
      }),
  ),

  create: publicProcedure
    .input(createPromotionalCodeSchema)
    .mutation(
      async ({
        ctx,
        input: { code, discount, isPercentage, isOneTime, expiresAt },
      }) => {
        try {
          await ctx.prisma.promotionalCode.create({
            data: {
              code,
              discount,
              isPercentage,
              isOneTime,
              expiresAt,
            },
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCodes.UniqueConstraintFailed) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                  "The inserted promotional code already exists, please use another text",
                cause: error,
              });
            }
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unrecognized error",
            cause: error,
          });
        }

        return {
          success: true,
          message: "Promotional code created successfully",
        };
      },
    ),

  delete: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { code } }) => {
      try {
        await ctx.prisma.promotionalCode.delete({
          where: {
            code,
          },
        });
      } catch (error) {
        console.error("[Error deleting promotional code]", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.FKConstraintFailed) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message:
                "The promotional code cannot be deleted because it was used by an event",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unrecognized error",
          cause: error,
        });
      }

      return {
        success: true,
        message: "Promotional code deleted successfully",
      };
    }),
});
