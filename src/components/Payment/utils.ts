import { event_payment_plan } from "@prisma/client";
import type { PayOption } from "./type";
import { HOLD_PERCENTAGE } from "@constants/pricing";
import { type BoothInfo, boothsInfo } from "@constants/packages";

const subtotalPrice = (
  eventInfo: {
    totalPriceForFullInCents: number;
    travelFeeInCents: number;
    stripeFeeForFullInCents: number;
    totalPriceForPartialInCents: number;
    stripeFeeForPartialInCents: number;
  },
  isFull: boolean,
) =>
  (isFull
    ? eventInfo.totalPriceForFullInCents -
      eventInfo.travelFeeInCents -
      eventInfo.stripeFeeForFullInCents
    : eventInfo.totalPriceForPartialInCents -
      eventInfo.travelFeeInCents -
      eventInfo.stripeFeeForPartialInCents) / 100;

const calculateStripeFees = (
  eventInfo: {
    stripeFeeForFullInCents: number;
    stripeFeeForPartialInCents: number;
  },
  isFull: boolean,
) => (isFull ? eventInfo.stripeFeeForFullInCents : eventInfo.stripeFeeForPartialInCents) / 100;

const calculateAppliedDiscount = (
  payOption: event_payment_plan,
  discount: number,
  isInMoreThan60DaysFromNow: boolean,
) => (payOption === event_payment_plan.full.toString() && isInMoreThan60DaysFromNow ? discount : 0);

const priceInfo = (
  eventInfo: {
    totalPriceForFullInCents: number;
    totalPriceForPartialInCents: number;
    travelFeeInCents: number;
    discountInCents: number;
    stripeFeeForFullInCents: number;
    stripeFeeForPartialInCents: number;
  },
  payOption: event_payment_plan,
  isInMoreThan60DaysFromNow: boolean,
  promotionalCodeDiscountInCents: number,
) => {
  const isFull = payOption === event_payment_plan.full.toString();
  const travelFee = eventInfo.travelFeeInCents / 100;
  const discount = eventInfo.discountInCents / 100;
  const promotionalCodeDiscount = promotionalCodeDiscountInCents / 100;
  const subtotal = subtotalPrice(eventInfo, isFull);
  const stripeFees = calculateStripeFees(eventInfo, isFull);
  const appliedDiscount = calculateAppliedDiscount(payOption, discount, isInMoreThan60DaysFromNow);

  const total = stripeFees + travelFee + subtotal;
  const totalWithPromoCodeApplied = total - promotionalCodeDiscount;
  const totalWithPromoCodeAndDiscountApplied = totalWithPromoCodeApplied - appliedDiscount;
  const totalInCents = Math.round(total * 100); // Rounding to avoid floating point errors

  const firstPaymentInCents = Math.floor(totalInCents / 2) - promotionalCodeDiscountInCents;
  const secondPaymentInCents = Math.ceil(totalInCents / 2);

  return {
    travelFee,
    discount,
    subtotal,
    stripeFees,
    appliedDiscount,
    totalWithPromoCodeAndDiscountApplied,
    firstPayment: firstPaymentInCents / 100,
    secondPayment: secondPaymentInCents / 100,
  };
};

const getPayOptions = (
  isInMoreThan60DaysFromNow: boolean,
  isInMoreThan30DaysFromNow: boolean,
  subtotalPrice: number,
  appliedDiscount: number,
  discount: number,
  isSecondPaymentFix: boolean,
  rest: number,
  isForCorporateEvent?: boolean,
): PayOption[] => {
  if (isForCorporateEvent) {
    const payOptions: PayOption[] = [
      {
        title: "Pay in Full",
        subtitle: "The payment will be completed when paid.",
        alertText: "No extra fees.",
        value: event_payment_plan.full,
        price: subtotalPrice,
      },
    ];

    if (isInMoreThan30DaysFromNow) {
      payOptions.push({
        title: "Pay 50% Deposit Today",
        subtitle: `Pay 50% of total today & 50% 30 days before your event.`,
        alertText: "No extra fees.",
        value: event_payment_plan.partial_50_50,
        price: subtotalPrice,
      });
    }

    return payOptions;
  }

  if (isSecondPaymentFix) {
    return [
      {
        title: "Pay the rest",
        subtitle: "This represents the outstanding balance for your final payment.",
        value: event_payment_plan.partial_50_50,
        price: rest,
      },
    ];
  }

  if (isInMoreThan60DaysFromNow) {
    return [
      {
        title: "Pay in Full Today - Get a 5% Discount",
        value: event_payment_plan.full,
        price: subtotalPrice - discount,
      },
      {
        title: "Pay 50% Deposit Today",
        subtitle: `Pay 50% of total today & 50% 30 days before your event.`,
        alertText: "No extra fees.",
        value: event_payment_plan.partial_50_50,
        price: subtotalPrice,
      },
    ];
  }

  if (isInMoreThan30DaysFromNow) {
    return [
      {
        title: "Pay in Full",
        subtitle: `Choose to complete your payment today. Once we confirm our availability your card will be charged. If we are unavailable, the ${
          HOLD_PERCENTAGE * 100
        }% hold will be removed.`,
        alertText: "No extra fees.",
        value: event_payment_plan.full,
        price: subtotalPrice - appliedDiscount,
      },
      {
        title: "Pay 50% Deposit Today",
        subtitle: `Pay 50% of total today & 50% 30 days before your event.`,
        alertText: "No extra fees.",
        value: event_payment_plan.partial_50_50,
        price: subtotalPrice,
      },
    ];
  }

  return [
    {
      title: "Pay in Full",
      subtitle: `Since your event is less than 60 days away, while we confirm our availability, we will place a hold equivalent to ${
        HOLD_PERCENTAGE * 100
      }% of your total on your card. Once we confirm our availability your card will be charged. If we are unavailable for your event, the ${
        HOLD_PERCENTAGE * 100
      }% hold will be removed immediately.`,
      alertText: "No extra fees.",
      value: event_payment_plan.full,
      price: subtotalPrice - appliedDiscount,
    },
  ];
};

const getSelectedPayOptionForCorporate = (
  isFullPayment: boolean,
  subtotalPrice: number,
): PayOption[] =>
  isFullPayment
    ? [
        {
          title: "Pay in Full",
          subtitle: "The payment will be completed when paid.",
          alertText: "No extra fees.",
          value: event_payment_plan.full,
          price: subtotalPrice,
        },
      ]
    : [
        {
          title: "Pay 50% Deposit Today",
          subtitle: `Pay 50% of total today & 50% 30 days before your event.`,
          alertText: "No extra fees.",
          value: event_payment_plan.partial_50_50,
          price: subtotalPrice,
        },
      ];

const voidBoothInfo: BoothInfo = {
  boothName: "",
  boothDescription: "",
  imageSrc: "",
  invoiceImg: "",
  url: "",
  invoiceDescription: "",
};

const getBoothInfo = (packageId: number | null) => {
  if (!packageId) return voidBoothInfo;
  const boothInfo = boothsInfo.get(packageId);
  return boothInfo ?? voidBoothInfo;
};

export { priceInfo, getPayOptions, getBoothInfo, getSelectedPayOptionForCorporate };
