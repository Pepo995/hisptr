import PriceOptions from "@components/onDemandBooking/PriceOptions";
import MainTitle from "@components/Title/MainTitle";
import Image from "next/image";
import { getBoothInfo, getSelectedPayOptionForCorporate } from "./utils";
import { formatPrice } from "@utils/Utils";
import PromotionalCodeInput from "./PromotionalCodeInput";
import PriceDetails from "./PriceDetails";
import Disclaimer from "@components/onDemandBooking/Disclaimer";
import DisclaimerIcon from "@components/icons/DisclaimerIcon";

import { getPayOptions, priceInfo } from "./utils";
import { HOLD_PERCENTAGE } from "@constants/pricing";
import { type InProcessEvent, event_payment_plan } from "@prisma/client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from "react-toastify";
import { packageOptions } from "@constants/packages";
import RayIcon from "./RayIcon";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col } from "reactstrap";
import NoDataFound from "@components/Common/NoDataFound";
import { useState } from "react";
import TickIcon from "./TickIcon";
dayjs.extend(utc);

type OrderSummaryProps = {
  isMobile: boolean;
  checkoutPart: number;
  payOption: event_payment_plan;
  event: Pick<
    InProcessEvent,
    | "packageId"
    | "eventDate"
    | "totalPriceForFullInCents"
    | "totalPriceForPartialInCents"
    | "travelFeeInCents"
    | "discountInCents"
    | "stripeFeeForFullInCents"
    | "stripeFeeForPartialInCents"
    | "paymentPlan"
  >;

  promotionalCodeInfo?: {
    errorPromotionalCode?: string;
    touchedPromotionalCode?: boolean;
    promotionalCode: string;
    handleApplyPromotionalCode: (promotionalCode: string) => void;
    isLoadingApplyPromotionalCode: boolean;
    appliedPromotionalCode?: string;
    promotionalCodeDiscountInCents: number;
  };
  isCorporateEvent?: boolean;
  isSecondPaymentFix?: boolean;
  restInCents?: number;
};

const OrderSummary = ({
  isMobile,
  checkoutPart,
  payOption,
  event,
  promotionalCodeInfo,
  isCorporateEvent = false,
  isSecondPaymentFix = false,
  restInCents,
}: OrderSummaryProps) => {
  const { boothName, boothDescription, imageSrc } = getBoothInfo(event.packageId);

  const boothPackageData = packageOptions.find((e) => e.name === boothName);

  const isInMoreThan60DaysFromNow = dayjs.utc(event.eventDate).isAfter(dayjs.utc().add(60, "days"));

  const isInMoreThan30DaysFromNow = dayjs.utc(event.eventDate).isAfter(dayjs.utc().add(30, "days"));

  const {
    subtotal: subtotalPrice,
    travelFee,
    appliedDiscount,
    discount,
    stripeFees,
    totalWithPromoCodeAndDiscountApplied,
    firstPayment,
    secondPayment,
  } = priceInfo(
    event,
    payOption,
    isInMoreThan60DaysFromNow,
    promotionalCodeInfo?.promotionalCodeDiscountInCents ?? 0,
  );

  const secondPayDate = dayjs.utc(event.eventDate).subtract(30, "days").format("MMMM DD, YYYY");

  const payOptions = isCorporateEvent
    ? getSelectedPayOptionForCorporate(event.paymentPlan === event_payment_plan.full, subtotalPrice)
    : getPayOptions(
        isInMoreThan60DaysFromNow,
        isInMoreThan30DaysFromNow,
        subtotalPrice,
        appliedDiscount,
        discount,
        isSecondPaymentFix,
        (restInCents ?? 0) / 100,
      );

  const [open, setOpen] = useState<string>();
  const toggle = (id: string) => {
    open === id ? setOpen(undefined) : setOpen(id);
  };

  if (!boothName || !imageSrc) {
    toast.error("Error loading booth information");
    return;
  }

  return (
    (!isMobile || checkoutPart === 1) && (
      <div className="tw-flex tw-flex-col tw-w-full sm:tw-px-2 lg:tw-px-10 lg:tw-w-1/2 lg:tw-pt-10">
        <div className="tw-flex tw-flex-col tw-gap-4 md:tw-border-b md:tw-border-slate-light md:tw-pb-5 tw-mb-5">
          <MainTitle text="Instant Booking ⚡" textSize="3xl" />

          <p className="tw-text-black tw-w-[93%] min-[600px]:tw-w-auto">
            Your reservation is <span className="tw-font-bold">one final step away</span> from being
            confirmed! Fill out your payment details and{" "}
            <span className="tw-font-bold">secure your spot today.</span> You will receive an email
            confirmation within <span className="tw-font-bold">24 hours</span> with the rest of the
            details.
          </p>
        </div>

        <div className="tw-border-b tw-border-slate-light tw-pb-5">
          <MainTitle text="Order Summary" textSize="3xl" />
        </div>

        <div className="tw-mt-10">
          {/* BOOTH SUMMARY */}
          <div className="xl:tw-border-b xl:tw-border-slate-light xl:tw-pb-5 tw-flex tw-items-center tw-gap-5">
            <Image
              src={imageSrc}
              className="tw-object-cover tw-rounded-md tw-flex-none"
              width={70}
              height={70}
              alt="Booth type"
            />

            <div className="tw-flex tw-flex-col tw-text-black">
              <div className="tw-font-montserrat tw-font-semibold tw-text-lg">
                Hipstr {boothName}
              </div>

              <div className="tw-font-montserrat tw-text-sm tw-mt-2">{boothDescription}</div>

              {boothPackageData && (
                <p className="tw-font-extrabold tw-uppercase xs:tw-text-xl md:tw-text-base">
                  {boothPackageData.boldText}
                </p>
              )}

              {boothPackageData?.isMostPopular && (
                <div className="tw-hidden xl:tw-flex tw-items-center tw-h-7 tw-justify-center tw-text-black tw-bg-green-200 tw-italic tw-font-montserrat tw-text-xs tw-font-bold tw-px-2">
                  <span className="tw-font-normal tw-flex tw-gap-1 tw-items-center">
                    <span className="tw-font-bold tw-flex tw-items-center tw-gap-1">
                      <RayIcon /> 10 booked
                    </span>{" "}
                    this package in the past 48 hours
                  </span>
                </div>
              )}

              <Accordion open={open ?? ""} toggle={toggle} className="tw-hidden xl:tw-block mt-1">
                <AccordionItem>
                  <AccordionHeader targetId={"value"} className="tw-flex tw-items-center">
                    <p className="tw-underline tw-font-montserrat tw-text-sm tw-font-normal">
                      Included
                    </p>
                    <div className="edit-btn"></div>
                  </AccordionHeader>
                  <AccordionBody accordionId={"value"}>
                    {boothPackageData && boothPackageData?.included.length !== 0 ? (
                      boothPackageData?.included.map((value) => {
                        return (
                          <p className="tw-flex tw-items-center tw-gap-1" key={value}>
                            <TickIcon />
                            <span className="tw-text-xs tw-font-montserrat">{value}</span>
                          </p>
                        );
                      })
                    ) : (
                      <Col>
                        {" "}
                        <NoDataFound message={"No data found"} />
                      </Col>
                    )}
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="tw-hidden tw-flex-col tw-ml-auto lg:tw-flex">
              <div className="tw-font-montserrat tw-font-semibold tw-text-black tw-text-lg">
                ${formatPrice(subtotalPrice)}
              </div>
              {/* TODO: change hardocded qty for packageQty once we have this attribute in schema */}
              <div className="tw-font-montserrat tw-font-thin tw-text-slate-light tw-mt-2">
                Qty: 1
              </div>
            </div>
          </div>

          <div className="xl:tw-hidden tw-block tw-pt-2 tw-border-b tw-border-slate-light tw-pb-5">
            {boothPackageData?.isMostPopular && (
              <div className="tw-flex tw-items-center tw-h-7 tw-w-[85%] sm:tw-w-[70%] md:tw-w-[95%] lg:tw-w-[85%] tw-justify-center tw-text-black tw-bg-green-200 tw-italic tw-font-montserrat tw-text-xs tw-font-bold tw-px-2">
                <span className="tw-font-normal tw-flex tw-gap-1 tw-items-center">
                  <span className="tw-font-bold tw-flex tw-items-center tw-gap-1">
                    <RayIcon /> 10 booked
                  </span>{" "}
                  this package in the past 48 hours
                </span>
              </div>
            )}

            <Accordion open={open ?? ""} toggle={toggle} className="mt-1">
              <AccordionItem>
                <AccordionHeader targetId={"value"} className="tw-flex tw-items-center">
                  <p className="tw-underline tw-font-montserrat tw-text-sm tw-font-normal">
                    Included
                  </p>
                  <div className="edit-btn"></div>
                </AccordionHeader>
                <AccordionBody accordionId={"value"}>
                  {boothPackageData && boothPackageData?.included.length !== 0 ? (
                    boothPackageData?.included.map((value) => {
                      return (
                        <p className="tw-flex tw-items-center tw-gap-1" key={value}>
                          <TickIcon />
                          <span className="tw-text-xs tw-font-montserrat">{value}</span>
                        </p>
                      );
                    })
                  ) : (
                    <Col>
                      {" "}
                      <NoDataFound message={"No data found"} />
                    </Col>
                  )}
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>

          <PriceOptions
            discount={discount}
            options={payOptions}
            name="payOption"
            value={payOption}
            isInMoreThan60DaysFromNow={isInMoreThan60DaysFromNow}
            isInMoreThan30DaysFromNow={isInMoreThan30DaysFromNow}
          />

          {!!promotionalCodeInfo && (
            <PromotionalCodeInput
              error={promotionalCodeInfo.errorPromotionalCode}
              isTouched={!!promotionalCodeInfo.touchedPromotionalCode}
              onClick={() =>
                promotionalCodeInfo.handleApplyPromotionalCode(promotionalCodeInfo.promotionalCode)
              }
              loading={promotionalCodeInfo.isLoadingApplyPromotionalCode}
            />
          )}

          <PriceDetails
            subtotalPrice={subtotalPrice}
            appliedDiscount={appliedDiscount}
            travelFee={travelFee}
            promotionalCodeDiscountInCents={
              promotionalCodeInfo?.promotionalCodeDiscountInCents ?? 0
            }
            appliedPromotionalCode={promotionalCodeInfo?.appliedPromotionalCode}
            stripeFees={stripeFees}
            totalWithPromoCodeAndDiscountApplied={totalWithPromoCodeAndDiscountApplied}
            firstPayment={firstPayment}
            secondPayment={secondPayment}
            secondPayDate={secondPayDate}
            payOption={payOption}
            isSecondPaymentFix={isSecondPaymentFix}
          />

          {/* DISCLAIMER */}
          {!isInMoreThan60DaysFromNow && !isSecondPaymentFix && (
            <Disclaimer
              image={<DisclaimerIcon />}
              text={`Since your event is less than 60 days away, while we confirm our availability, we will place a hold equivalent to ${
                HOLD_PERCENTAGE * 100
              }% of your total on your card. Once we confirm our availability your card will be charged based on your selection above. If we are unavailable for your event, the ${
                HOLD_PERCENTAGE * 100
              }% hold will be removed immediately.`}
            />
          )}
        </div>
      </div>
    )
  );
};

export default OrderSummary;
