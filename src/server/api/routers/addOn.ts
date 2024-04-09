import { createTRPCRouter, publicProcedure } from "../trpc";

export const addOnRouter = createTRPCRouter({
  listAddOns: publicProcedure.query(async ({ ctx }) => await ctx.prisma.addOn.findMany()),
});
