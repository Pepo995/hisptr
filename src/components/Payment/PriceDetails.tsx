import { event_payment_plan } from "@prisma/client";
import { formatPrice } from "@utils/Utils";
import InformationIcon from "./InformationIcon";
import ToolTip from "@components/ToolTip";

type Props = {
  subtotalPrice: number;
  appliedDiscount: number;
  travelFee: number;
  promotionalCodeDiscountInCents: number;
  appliedPromotionalCode?: string;
  stripeFees: number;
  totalWithPromoCodeAndDiscountApplied: number;
  firstPayment: number;
  secondPayment: number;
  secondPayDate: string;
  payOption: string;
  isSecondPaymentFix: boolean;
};

const PriceDetails = ({
  subtotalPrice,
  appliedDiscount,
  travelFee,
  promotionalCodeDiscountInCents,
  appliedPromotionalCode,
  stripeFees,
  totalWithPromoCodeAndDiscountApplied,
  firstPayment,
  secondPayment,
  secondPayDate,
  payOption,
  isSecondPaymentFix,
}: Props) => (
  <>
    <div className="tw-border-b tw-border-slate-light tw-py-5 tw-flex tw-flex-col">
      <div className="tw-flex tw-justify-between tw-font-montserrat tw-mt-2 tw-text-black tw-font-semibold tw-text-base">
        <span>Subtotal</span>
        <span>${formatPrice(subtotalPrice - appliedDiscount)}</span>
      </div>

      {travelFee ? (
        <div className="tw-flex tw-justify-between tw-font-montserrat tw-mt-2 tw-text-black tw-font-semibold tw-text-base">
          <span>Travel Fee</span>
          <span>${formatPrice(travelFee)}</span>
        </div>
      ) : null}

      {!!promotionalCodeDiscountInCents && appliedPromotionalCode && (
        <div className="tw-flex tw-justify-between tw-font-montserrat tw-mt-2 tw-text-slate-light tw-font-medium tw-text-lg">
          <div className="tw-flex tw-flex-col">
            <span>Discount</span>
            <span className="tw-text-sm">({appliedPromotionalCode})</span>
          </div>
          <span>- ${formatPrice(promotionalCodeDiscountInCents / 100)}</span>
        </div>
      )}

      <div className="tw-flex tw-justify-between tw-font-montserrat tw-mt-2 tw-text-black tw-font-semibold tw-text-base">
        <div className="tw-flex tw-gap-1 tw-items-center">
          <span>Convenience Fees</span>

          <ToolTip tooltip="The convenience fee reflects the additional resources we allocate to accommodate the quick-turnaround requests. This fee helps us maintain the high level of service and reliability that our customers expect from us, even for last-minute bookings">
            <div>
              <InformationIcon />
            </div>
          </ToolTip>
        </div>

        <span>${formatPrice(stripeFees)}</span>
      </div>
    </div>

    {/* TOTAL PRICE */}
    <div className="tw-py-5">
      <div className="tw-flex tw-justify-between tw-font-montserrat tw-my-2 tw-text-black tw-font-bold tw-text-xl">
        <span>Total</span>
        <span className="tw-text-black tw-text-xl">
          ${formatPrice(totalWithPromoCodeAndDiscountApplied)}
        </span>
      </div>
    </div>

    {/* PAYMENTS DETAILS */}
    {payOption === event_payment_plan.partial_50_50 && !isSecondPaymentFix && (
      <div className="tw-border-t tw-border-slate-light tw-py-5 tw-flex tw-flex-col">
        <div className="tw-flex tw-justify-between tw-font-montserrat tw-mt-2 tw-text-black tw-font-bold tw-text-lg">
          <span>Due now</span>
          <span>${formatPrice(firstPayment)}</span>
        </div>

        <div className="tw-flex tw-justify-between tw-font-montserrat tw-mt-2 tw-text-slate-light tw-font-bold tw-text-lg">
          <span>Due on {secondPayDate}</span>
          <span>${formatPrice(secondPayment)}</span>
        </div>
      </div>
    )}
  </>
);

export default PriceDetails;
