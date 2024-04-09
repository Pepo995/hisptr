import { listMarkets } from "@server/services/markets";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const marketRouter = createTRPCRouter({
  listMarkets: publicProcedure.query(listMarkets),
});
