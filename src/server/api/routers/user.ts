import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),
});
