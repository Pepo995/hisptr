import { TRAVEL_FEE_ADD_ON_NAME } from "@constants/add-ons";
import { STRIPE_FIXED_FEE_IN_CENTS, STRIPE_PERCENTAGE_FEE } from "@constants/pricing";
import type { LineItem } from "@types";

export const addStripeFeesToSubtotal = (subtotalInCents: number, numberOfPayments: number) =>
  Math.ceil(
    ((subtotalInCents + numberOfPayments * STRIPE_FIXED_FEE_IN_CENTS) /
      (1 - STRIPE_PERCENTAGE_FEE) /
      100) *
      100,
  );

export const getPricesForEventLineItems = (eventLineItems: LineItem[]) => {
  const travelFeeInCents =
    eventLineItems.find((item) => item.name === TRAVEL_FEE_ADD_ON_NAME)?.retailPriceInCents ?? 0;

  const subtotalAmountInCents =
    eventLineItems.reduce((acc, item) => acc + item.retailPriceInCents * item.quantity, 0) -
    travelFeeInCents;

  const stripeFeeForPartialInCents =
    addStripeFeesToSubtotal(subtotalAmountInCents, 2) - subtotalAmountInCents;

  const totalPriceForPartialInCents =
    subtotalAmountInCents + travelFeeInCents + stripeFeeForPartialInCents;

  const stripeFeeForFullInCents =
    addStripeFeesToSubtotal(subtotalAmountInCents, 1) - subtotalAmountInCents;

  const totalForFullInCents = subtotalAmountInCents + travelFeeInCents + stripeFeeForFullInCents;

  return {
    subtotalAmountInCents,
    travelFeeInCents,
    stripeFeeForPartialInCents,
    totalPriceForPartialInCents,
    stripeFeeForFullInCents,
    totalForFullInCents,
  };
};
