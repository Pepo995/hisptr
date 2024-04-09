import { PACKAGE_ID_ARRAY, PACKAGE_ID_HALO } from "@constants/packages";
import dayjs from "dayjs";
import { prisma } from "~/server/db";
import { env } from "~/env.mjs";
import { getMarketNameFromCityAndState, listMarkets } from "./markets";
import type { AirTableMarket, MarketArray, PromotionalField, RetailField } from "@types";
import { FULL_PRICE_PAYMENT_DISCOUNT_WHEN_MORE_THAN_60_DAYS } from "@constants/pricing";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { addStripeFeesToSubtotal } from "@utils/price";

const PRISMA_DUPLICATE_KEY_ERROR_CODE = "P2002";

type DistanceElement = {
  distance: undefined | { value: number; text: string };
};

type DistanceRow = {
  elements: DistanceElement[];
};

type DistanceMatrix = {
  origin_addresses: string[];
  rows: DistanceRow[];
};

const MAX_TRAVEL_MILES_SERVICE = 150;

const priceKey = (holiday: boolean, packageId: number, eventDate: string) => {
  const isBefore2025 = dayjs(eventDate).isBefore(dayjs("2025-01-01"));

  const packagePrefix =
    packageId === PACKAGE_ID_HALO ? "" : packageId === PACKAGE_ID_ARRAY ? "Array " : "360 ";

  let prefix:
    | ""
    | "Array "
    | "360 "
    | "2025 "
    | "Holiday "
    | "Array Holiday "
    | "360 Holiday "
    | "2025 Holiday "
    | "2025 Array "
    | "2025 Array Holiday "
    | "2025 360 "
    | "2025 360 Holiday " = `${!isBefore2025 && !holiday ? "2025 " : ""}${packagePrefix}${
    holiday ? "Holiday " : ""
  }`;

  // Removing 2025 prefix if it's holiday.
  if (prefix === "2025 Holiday ") prefix = "Holiday ";
  else if (prefix === "2025 Array Holiday ") prefix = "Array Holiday ";
  else if (prefix === "2025 360 Holiday ") prefix = "360 Holiday ";

  const promotionalField: keyof PromotionalField = `${prefix}Promotional Price`;

  const retailField: keyof RetailField = `${prefix}Retail Price`;

  return {
    promotionalField,
    retailField,
  };
};

const getDate = (year: number, month: number, week: number, day: number) => {
  const firstDay = 1;
  if (week < 0) {
    month++;
  }
  const date = new Date(year, month, week * 7 + firstDay);
  if (day < date.getDay()) {
    day += 7;
  }
  date.setDate(date.getDate() - date.getDay() + day);
  return date;
};

const getHoliday = (month: number, week: number, day: number) => {
  const floatingHolidays = new Map<string, string>();
  floatingHolidays.set("10,3,4", "Thanksgiving Day");

  return floatingHolidays.get(`${month},${week},${day}`);
};

const getDateString = (year: number, month: number, week: number, day: number) => {
  const date = getDate(year, month, week, day);
  const holiday = getHoliday(month, week, day);
  let dateString = date.toLocaleDateString();
  if (holiday) {
    dateString += " \xa0\xa0\xa0" + holiday;
  }
  return dateString;
};

const calculateTravelAdjustment = (miles: number) => {
  if (miles <= 50) return 0;
  if (miles <= 100) return 100;
  return 200;
};

const calculateExpeditedAdjustment = (/*date: string*/) => {
  // const diffInDays = moment(date).diff(moment(new Date()), "days");
  // return diffInDays < 60 ? EXPEDITED_EVENT_FEE_IN_CENTS / 100 : 0; // NOT USED IN THE FIRST LAUNCH BUT WE WILL USE IT LATER.
  return 0;
};

const isHoliday = (dateString: string) => {
  const floatingHolidayCheck = getDateString(2022, 9, 3, 4); // yyyy, m, w, d

  if (floatingHolidayCheck.includes(" ")) {
    //TODO: This is a hacky way to check if the date is a holiday. It should be refactored.
    return true;
  }

  switch (dayjs(dateString).format("MMM DD")) {
    // Must use the first three letters of the month name and a two digit day of the month (ie. Jan 01 for New Year's Day)
    case "Jul 04": // Independence Day
    case "Dec 24": // Christmas Eve
    case "Dec 25": // Christmas Day
    case "Dec 31": // New Year's Eve
      return true;
    default:
  }

  const eventDateWithYear = dayjs(dateString).format("MMM DD YYYY");
  // Adding specific years' holidays.
  switch (eventDateWithYear) {
    case "Dec 30 2023":
      return true;
    default:
  }

  return false;
};

export const generateMarketArray = async () => {
  if (!env.AIR_TABLE_API_KEY) throw new Error("Missing AIR_TABLE_API_KEY");

  if (!env.AIR_TABLE_MARKETS_URL) throw new Error("Missing AIR_TABLE_MARKETS_URL");

  // Use Airtable API to list all markets
  const originStringsResp = await fetch(env.AIR_TABLE_MARKETS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.AIR_TABLE_API_KEY}`,
    },
  });
  const marketArrayString = await originStringsResp.text();
  const marketArray = (JSON.parse(marketArrayString) as MarketArray).records;
  return marketArray;
};

export const getVenueClosestMarketDistance = async (venue: string) => {
  // Validating keys and venue before starting.
  if (!env.GOOGLE_MAPS_API_KEY) throw new Error("Missing GOOGLE_MAPS_API_KEY");
  const marketArray = await generateMarketArray();
  // Loop through the list of markets and concatenate them as a bar separated list to variable originStrings
  const originStrings = [];
  const maxDimension = 25;
  for (let i = 0; i < marketArray.length; i++) {
    if (i % maxDimension == 0) {
      originStrings[Math.floor(i / maxDimension)] = "";
    }
    originStrings[Math.floor(i / maxDimension)] += `${getMarketNameFromCityAndState(
      marketArray[i].fields.Name,
      marketArray[i].fields.State,
    )}|`;
  }

  // Considering "New York" as special case.
  const venueAddress = venue === "New York" ? "New York, NY" : venue;

  let distance = 10000000;
  let miles = "";
  let milesNumber: number | undefined;
  let marketArrPosition = -1;

  if (!venueAddress) throw new Error("Missing venue");
  // Check database for miles to venue before using Google Maps API
  const milesToVenue = await prisma.venueClosestMarket.findUnique({
    where: {
      venue: venueAddress,
    },
  });
  if (milesToVenue) {
    marketArrPosition = marketArray.findIndex((market) => market.id === milesToVenue?.marketId);
    milesNumber = milesToVenue.distance;
  }
  if (marketArrPosition == -1) {
    const distanceMatrices = await Promise.all(
      originStrings.map(async (origins) => {
        const distMatrixQuery = new URLSearchParams({
          destinations: venueAddress,
          origins,
          units: "imperial",
          key: env.GOOGLE_MAPS_API_KEY,
        }).toString();

        // Use Google Maps API to determine the closest market to the venue.
        const distMatrixResp = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?${distMatrixQuery}`,
        );

        const distMatrixData = await distMatrixResp.text();
        const distMatrix = JSON.parse(distMatrixData) as DistanceMatrix;
        return distMatrix;
      }),
    );
    distanceMatrices.forEach(({ rows }, i) => {
      // Iterate through the originStrings array to determine the closest market and return the name of the market and the distance in miles.
      rows.forEach((row, index) => {
        const distanceElement = row.elements[0].distance;
        if (distanceElement) {
          const tempDist = distanceElement.value;
          const tempMiles = distanceElement.text;
          if (tempDist < distance) {
            distance = tempDist;
            miles = tempMiles;
            marketArrPosition = i * maxDimension + index;
            // TODO we can break the loop when the distance is in the minimum range since we will not find a closer market then.
          }
        }
      });
    });

    if (!miles.includes("ft")) {
      milesNumber = Number(miles.split(" mi")[0].replace(",", "").trim());
    } else {
      milesNumber = 0;
    }
    if (milesNumber !== undefined && !isNaN(milesNumber) && marketArrPosition !== -1) {
      try {
        await prisma.venueClosestMarket.create({
          data: {
            marketId: marketArray[marketArrPosition].id,
            distance: milesNumber,
            venue: venueAddress,
          },
        });
      } catch (e) {
        if (
          !(e instanceof PrismaClientKnownRequestError && e.code == PRISMA_DUPLICATE_KEY_ERROR_CODE)
        ) {
          throw e;
        }
      }
    }
  }
  if (
    milesNumber === undefined ||
    isNaN(milesNumber) ||
    milesNumber > MAX_TRAVEL_MILES_SERVICE ||
    marketArrPosition === -1
  )
    throw new Error(
      "We're sorry we do not service your location at this time. We hope to service your area soon! You can see the markets we currently service on our home page.",
    );
  return { distance: milesNumber, market: marketArray[marketArrPosition] };
};

export const getMarketByName = async (marketName: string) => {
  const marketArray = await listMarkets();

  const market = marketArray.find(
    (market) =>
      getMarketNameFromCityAndState(market.fields.Name, market.fields.State) === marketName,
  );

  if (!market) throw new Error("Market not found");

  return { market, distance: 0 };
};

export const getEventPriceDetails = (
  eventDate: string,
  approximateBudget: number,
  packageId: number, //TODO: ALLOW MULTIPLE PACKAGES ID IN OUR DATABASE INSTEAD OF AIRTABLE
  distance: number,
  market: AirTableMarket,
) => {
  // Set promotional and retail prices depending on the booth type (packageId) selected.
  const holiday = isHoliday(eventDate);

  // Use the following assignments to get the price when the airtable is updated.
  const { promotionalField, retailField } = priceKey(holiday, packageId, eventDate);

  const promotionalPrice = market.fields[promotionalField];
  const retailPrice = market.fields[retailField];

  const travelAdjustment = calculateTravelAdjustment(distance);

  const expeditedEventAdjustment = calculateExpeditedAdjustment(/*date*/);

  /**
   * If budget * .85 > (promotionalPrice + expeditedEventAdjustment + travelAdjustment)
   * Then: the price quoted should be adjusted to .85 * Budget up to (retailPrice + travelAdjustment + expeditedEventAdjustment)
   */
  const subtotalWithAdjustments =
    promotionalPrice + travelAdjustment + expeditedEventAdjustment < approximateBudget * 0.85
      ? Math.min(
          approximateBudget * 0.85,
          retailPrice + travelAdjustment + expeditedEventAdjustment,
        )
      : promotionalPrice + travelAdjustment + expeditedEventAdjustment;

  return {
    ...getEventPriceDetailsFromSubtotalAndAdjustments(
      subtotalWithAdjustments,
      travelAdjustment,
      expeditedEventAdjustment,
      Math.round(retailPrice * 100), // Preventing floating point issues.
      getMarketNameFromCityAndState(market.fields.Name, market.fields.State),
      market.id,
    ),
    promotionalPriceInCents: Math.round(promotionalPrice * 100),
  };
};

export const getEventPriceDetailsFromSubtotalAndAdjustments = (
  subtotalWithAdjustments: number,
  travelAdjustment: number,
  expeditedEventAdjustment: number,
  retailPriceInCents: number,
  marketName?: string,
  marketId?: string,
) => {
  // Calculating every possible/showable price related to the event date.
  const subtotalWithAdjustmentsInCents = subtotalWithAdjustments * 100;
  // Full payment
  const totalForFullPaymentInCents = addStripeFeesToSubtotal(subtotalWithAdjustmentsInCents, 1);

  const stripeFeeForFullPaymentInCents =
    totalForFullPaymentInCents - subtotalWithAdjustmentsInCents;
  // Partial payment
  const totalForPartialPaymentInCents = addStripeFeesToSubtotal(subtotalWithAdjustmentsInCents, 2);

  const stripeFeeForPartialPaymentInCents =
    totalForPartialPaymentInCents - subtotalWithAdjustmentsInCents;
  const travelFeeInCents = travelAdjustment * 100;
  const expeditedEventFeeInCents = expeditedEventAdjustment * 100;
  return {
    subtotalInCents: subtotalWithAdjustmentsInCents - travelFeeInCents - expeditedEventFeeInCents,
    totalForFullPaymentInCents,
    totalForPartialPaymentInCents,
    stripeFeeForFullPaymentInCents,
    stripeFeeForPartialPaymentInCents,
    travelFeeInCents,
    expeditedEventFeeInCents,
    discountInFullPriceAndMoreThan60Days: Math.ceil(
      FULL_PRICE_PAYMENT_DISCOUNT_WHEN_MORE_THAN_60_DAYS * subtotalWithAdjustmentsInCents,
    ),
    retailPriceInCents,
    marketName,
    marketId,
  };
};
