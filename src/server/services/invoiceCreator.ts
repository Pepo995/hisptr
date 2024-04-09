import { type Event } from "@prisma/client";
import dayjs from "dayjs";

export const getSubtotalInCents = ({
  totalPriceInCents,
  stripeFeeInCents,
  travelFeeInCents,
}: Pick<Event, "totalPriceInCents" | "stripeFeeInCents" | "travelFeeInCents">) =>
  totalPriceInCents - stripeFeeInCents - travelFeeInCents;

export const getInvoiceInfo = (
  {
    eventDate,
    totalPriceInCents,
    stripeFeeInCents,
    travelFeeInCents,
  }: Pick<Event, "eventDate" | "totalPriceInCents" | "stripeFeeInCents" | "travelFeeInCents">,
  discountInCents: number,
  promotionalCodeDiscountInCents: number,
  priceToChargeInCents: number,
) => ({
  pendingDueDate: dayjs.utc(eventDate).subtract(30, "day"),
  pendingInCents:
    totalPriceInCents - discountInCents - promotionalCodeDiscountInCents - priceToChargeInCents,
  subtotalInCents: getSubtotalInCents({ totalPriceInCents, stripeFeeInCents, travelFeeInCents }),
});

export const generateReceiptNumber = (invoiceId: number) => invoiceId.toString().padStart(8, "0");
