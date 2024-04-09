import { PACKAGE_ID_HALO } from "@constants/packages";
import { prisma } from "@server/db";
import {
  generateMarketArray,
  getEventPriceDetails,
  getVenueClosestMarketDistance,
} from "@server/services/pricing";
import { type NextRequest } from "next/server";
import { z } from "zod";

const queryParamSchema = z.object({
  aproxBudget: z.string().default("0"),
  venue: z.string().optional(),
  packageName: z.string().optional(),
  eventDate: z.string(),
});

const MAX_DISTANCE = 500;

export async function GET(request: NextRequest) {
  let queryParams: z.infer<typeof queryParamSchema>;
  try {
    queryParams = queryParamSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error parsing query parameters." }), {
      status: 400,
    });
  }

  const { eventDate, venue, packageName, aproxBudget } = queryParams;
  const budgetInt = parseInt(aproxBudget);
  if (isNaN(budgetInt)) {
    return new Response(JSON.stringify({ error: "Invalid budget provided." }), {
      status: 400,
    });
  }
  let packageId;
  if (packageName) {
    try {
      const { id } = await prisma.package.findFirstOrThrow({
        where: { title: packageName },
        select: { id: true },
      });
      packageId = id;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Package not found." }), {
        status: 404,
      });
    }
  } else {
    packageId = PACKAGE_ID_HALO;
  }

  if (!venue) {
    const marketArray = await generateMarketArray();
    const everyThingElseMarket = marketArray.find(
      (market) => market.fields.Name === "Everything Else",
    );
    if (!everyThingElseMarket) {
      return new Response(JSON.stringify({ error: "Market not found." }), {
        status: 404,
      });
    }
    const pricing = getEventPriceDetails(
      eventDate,
      budgetInt,
      packageId,
      MAX_DISTANCE,
      everyThingElseMarket,
    );
    return new Response(
      JSON.stringify({
        price: pricing.totalForPartialPaymentInCents / 100,
        package: packageName,
        retailPrice: pricing.retailPriceInCents / 100,
        promotionalPrice: pricing.promotionalPriceInCents / 100,
        distance: MAX_DISTANCE,
        market: "Everything Else",
        travelAdjustment: pricing.travelFeeInCents / 100,
        expeditedAdjustment: pricing.expeditedEventFeeInCents / 100,
      }),
    );
  }

  try {
    const { distance, market } = await getVenueClosestMarketDistance(venue);
    const pricing = getEventPriceDetails(eventDate, budgetInt, packageId, distance, market);
    return new Response(
      JSON.stringify({
        price: pricing.totalForPartialPaymentInCents / 100,
        package: packageName,
        retailPrice: pricing.retailPriceInCents / 100,
        promotionalPrice: pricing.promotionalPriceInCents / 100,
        distance,
        market: `${market.fields.Name}, ${market.fields.State}`,
        travelAdjustment: pricing.travelFeeInCents / 100,
        expeditedAdjustment: pricing.expeditedEventFeeInCents / 100,
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Error getting pricing details." }), {
      status: 500,
    });
  }
}
