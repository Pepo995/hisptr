import type { MarketArray } from "@types";
import { env } from "~/env.mjs";

export const listMarkets = async () => {
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

export const getMarketNameFromCityAndState = (cityName: string, stateName: string) => {
  if (cityName === "Everything Else") {
    return "Everything Else";
  } else {
    return `${cityName}, ${stateName}`;
  }
};
