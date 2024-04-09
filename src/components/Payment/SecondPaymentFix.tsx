import { Form, Formik } from "formik";
import { api } from "@utils/api";
import { toast } from "react-toastify";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction } from "react";
import validationSchema from "./schema";
import CheckoutForm from "./CheckoutForm";
import useSecondPaymentFix from "./useSecondPaymentFix";
import OrderSummary from "./OrderSummary";
import { event_payment_plan } from "@prisma/client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type SecondPaymentFixProps = {
  eventId: number;
  checkoutPart: number;
  setCheckoutPart: Dispatch<SetStateAction<number>>;
  isMobile: boolean;
  clientSecret: string;
};

const SecondPaymentFix = ({
  eventId,
  checkoutPart,
  setCheckoutPart,
  isMobile,
  clientSecret,
}: SecondPaymentFixProps) => {
  const router = useRouter();
  const { submitHandler, isLoadingSecondPaymentFix } = useSecondPaymentFix(eventId);

  const { isLoading: isLoadingEvent, data: result } = api.eventRouter.getEvent.useQuery({
    id: eventId,
  });

  if (isLoadingEvent || isLoadingSecondPaymentFix) return <ShimmerAddEvent />;

  if (!result?.success || !result.event) {
    toast.error("Error getting event data");

    void router.push("/");
    return;
  }

  const { event } = result;

  const initialFormValues = {
    consent: true,
    payOption: event.paymentPlan.toString(),
    acceptTermsAndConditions: false,
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={submitHandler}
    >
      {({ isSubmitting, setFieldValue, errors, touched, values }) => (
        <Form className="tw-flex tw-flex-col tw-gap-10">
          <div className="tw-flex">
            {/* CHECKOUT FORM */}
            {(!isMobile || checkoutPart === 2) && (
              <CheckoutForm
                clientSecret={clientSecret}
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                isSecondPaymentFix
              />
            )}

            {/* ORDER SUMMARY */}
            <OrderSummary
              isMobile={isMobile}
              checkoutPart={checkoutPart}
              event={{
                ...event,
                totalPriceForFullInCents: event.totalPriceInCents,
                totalPriceForPartialInCents: event.totalPriceInCents,
                stripeFeeForFullInCents: event.stripeFeeInCents,
                stripeFeeForPartialInCents: event.stripeFeeInCents,
              }}
              payOption={event_payment_plan.partial_50_50}
              isSecondPaymentFix
              restInCents={event.totalPriceInCents - event.amountPaidInCents}
            />
          </div>

          {/* ACTIONS */}
          {isMobile && checkoutPart === 1 ? (
            <button
              className="custom-btn3 tw-w-full tw-my-10 lg:tw-hidden tw-block"
              disabled={isSubmitting}
              onClick={() => setCheckoutPart(2)}
            >
              Continue
            </button>
          ) : (
            <div className="tw-w-full tw-mb-10    sm:tw-mb-0 sm:tw-px-2    md:tw-w-1/2     lg:tw-px-10">
              <button
                type="submit"
                className="custom-btn3 tw-w-full tw-uppercase"
                disabled={isSubmitting}
              >
                Confirm and Pay
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default SecondPaymentFix;
