import { createTRPCRouter, publicProcedure } from "@server/api/trpc";
import {
  getEventPriceDetails,
  getMarketByName,
  getVenueClosestMarketDistance,
} from "@server/services/pricing";
import { z } from "zod";
import { PACKAGE_ID_360, PACKAGE_ID_ARRAY, PACKAGE_ID_HALO } from "@constants/packages";
import { getMarketNameFromCityAndState } from "@server/services/markets";

export const priceRouter = createTRPCRouter({
  getPricesForEventInfo: publicProcedure
    .input(
      z.object({
        eventDate: z.string(),
        city: z.string(),
        stateName: z.string(),
        budget: z.number(),
        marketName: z.string().optional(),
      }),
    )
    .query(async ({ input: { eventDate, city, stateName, budget, marketName } }) => {
      try {
        const { distance, market } = marketName
          ? await getMarketByName(marketName)
          : await getVenueClosestMarketDistance(getMarketNameFromCityAndState(city, stateName));

        const [haloPrice, threeSixtyPrice, arrayPrice] = await Promise.all([
          getEventPriceDetails(eventDate, budget, PACKAGE_ID_HALO, distance, market),
          getEventPriceDetails(eventDate, budget, PACKAGE_ID_360, distance, market),
          getEventPriceDetails(eventDate, budget, PACKAGE_ID_ARRAY, distance, market),
        ]);

        return {
          success: true,
          haloPrice,
          threeSixtyPrice,
          arrayPrice,
        };
      } catch (e) {
        console.error("Error getting prices for event info", e);
        return {
          success: false,
          error: (e as Error).message,
        };
      }
    }),
});
