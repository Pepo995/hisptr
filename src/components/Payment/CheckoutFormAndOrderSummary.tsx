import { Form, Formik } from "formik";
import { api } from "@utils/api";
import { toast } from "react-toastify";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { useRouter } from "next/router";

import { event_payment_plan } from "@prisma/client";

import Actions from "@components/onDemandBooking/Actions";
import { type Dispatch, type SetStateAction } from "react";

import useEventCreation from "./useEventCreation";
import usePromotionalCodeCreation from "./usePromotionalCodeCreation";
import validationSchema from "./schema";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import Link from "next/link";
import SecurePaymentIcon from "./SecurePaymentIcon";
import ClockIcon from "./ClockIcon";

type CheckoutFormAndOrderSummaryProps = {
  eventId?: string;
  currentStep: number;
  checkoutPart: number;
  setCheckoutPart: Dispatch<SetStateAction<number>>;
  isMobile: boolean;
  // TODO: Receive clientSecret from parent instead of getting it from the API here again.
};

const CheckoutFormAndOrderSummary = ({
  eventId,
  currentStep,
  checkoutPart,
  isMobile, // TODO: Receive clientSecret from parent instead of getting it from the API here again.
}: CheckoutFormAndOrderSummaryProps) => {
  const router = useRouter();
  const {
    handleApplyPromotionalCode,
    promotionalCodeDiscountInCents,
    appliedPromotionalCode,
    isLoadingApplyPromotionalCode,
  } = usePromotionalCodeCreation(eventId);
  const { submitHandler, loadingEventCreation } = useEventCreation(eventId, appliedPromotionalCode);

  const { isLoading: isLoadingSetupIntent, data: setupIntentResult } =
    api.paymentRouter.getSetupIntent.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    });

  const { isLoading: isLoadingEvent, data: result } = api.eventRouter.getInProcessEvent.useQuery({
    id: typeof eventId === "string" ? eventId : undefined,
    requirePrice: true,
  });

  if (isLoadingEvent || isLoadingSetupIntent || loadingEventCreation) return <ShimmerAddEvent />;

  if (
    !result?.success ||
    !result.event ||
    !setupIntentResult?.success ||
    !setupIntentResult.clientSecret
  ) {
    toast.error("Error getting event data");

    void router.push(
      typeof eventId === "string" ? `/book-now/personal/step-1?event-id=${eventId}` : "/book-now",
    );
    return;
  }

  const clientSecret = setupIntentResult.clientSecret;

  const { event } = result;

  const initialFormValues = {
    payOption: event_payment_plan.full,
    consent: true,
    promotionalCode: "",
    acceptTermsAndConditions: false,
  };

  const paymentElementAppearance = {
    variables: {
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "500",
      color: "black",
    },
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={submitHandler}
    >
      {({ values, isSubmitting, setFieldValue, errors, touched }) => (
        <Form className="tw-flex tw-flex-col tw-gap-10">
          <div className="tw-flex md:tw-flex-row tw-flex-col">
            {/* ORDER SUMMARY */}
            <OrderSummary
              isMobile={isMobile}
              checkoutPart={checkoutPart}
              promotionalCodeInfo={{
                errorPromotionalCode: errors.promotionalCode,
                touchedPromotionalCode: touched.promotionalCode,
                handleApplyPromotionalCode: handleApplyPromotionalCode,
                isLoadingApplyPromotionalCode,
                promotionalCode: values.promotionalCode,
                appliedPromotionalCode: appliedPromotionalCode,
                promotionalCodeDiscountInCents: promotionalCodeDiscountInCents,
              }}
              payOption={values.payOption}
              event={event}
            />

            {/* CHECKOUT FORM */}
            <div className="tw-flex tw-flex-col tw-gap-10 lg:tw-px-10 lg:tw-w-1/2 lg:tw-pt-8 tw-w-full sm:tw-px-2">
              <CheckoutForm
                clientSecret={clientSecret}
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                paymentElementAppearance={paymentElementAppearance}
              />

              {/* ACTIONS */}
              <div className="tw-flex tw-flex-col tw-text-center tw-gap-5">
                <Actions
                  isSubmitting={isSubmitting}
                  eventId={typeof eventId === "string" ? eventId : undefined}
                  currentStep={currentStep}
                  okButtonText="Confirm and Pay"
                  withGoBackButton={false}
                />

                <div className="tw-order-2">
                  <div className="tw-flex tw-gap-2 tw-text-center tw-justify-center">
                    <SecurePaymentIcon />

                    <p className="tw-uppercase tw-text-black tw-font-montserrat tw-text-base tw-font-medium">
                      100% Secure Checkout
                    </p>
                  </div>

                  <div className="tw-flex tw-gap-2 tw-text-center tw-justify-center">
                    <ClockIcon />

                    <p className="tw-uppercase tw-text-black tw-font-montserrat tw-text-base tw-font-medium">
                      24 HR Risk-Free Cancellation
                    </p>
                  </div>
                </div>

                <div className="tw-flex md:tw-flex-row tw-flex-col tw-justify-center tw-items-center tw-gap-8 tw-mb-3 tw-order-4 md:tw-order-3">
                  <span className="tw-text-black tw-font-montserrat tw-font-bold tw-text-xs">
                    Still need to chat with someone?{" "}
                  </span>

                  <Link href={"/"}>
                    <button
                      type="button"
                      className="tw-w-full tw-font-montserrat tw-font-bold tw-text-xs tw-text-primary tw-border-[1px] tw-border-primary tw-underline tw-rounded-md tw-px-6 tw-py-4"
                    >
                      Schedule a Call Today
                    </button>
                  </Link>
                </div>

                <div className="tw-w-full sm:tw-mb-0 tw-mb-10 tw-order-3 md:tw-order-4">
                  <Link
                    href={
                      typeof eventId === "string" && currentStep > 1
                        ? `/book-now/personal/step-${currentStep - 1}?event-id=${eventId}`
                        : "/book-now"
                    }
                  >
                    <button
                      type="button"
                      className="tw-w-full tw-font-medium tw-cursor-pointer tw-text-base md:tw-text-sm tw-text-black tw-underline"
                    >
                      Go back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutFormAndOrderSummary;
