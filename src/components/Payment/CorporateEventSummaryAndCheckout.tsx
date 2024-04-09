import { Form, Formik } from "formik";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";

import { type Dispatch, type SetStateAction } from "react";

import { payCorporateEventSchema } from "./schema";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

import usePayCorporateEvent from "./usePayCorporateEvent";
import { type EventForFrontend } from "@server/services/parsers";

type CorporateEventSummaryAndCheckoutProps = {
  event: EventForFrontend;
  checkoutPart: number;
  setCheckoutPart: Dispatch<SetStateAction<number>>;
  isMobile: boolean;
  clientSecret: string;
};

const CorporateEventSummaryAndCheckout = ({
  event,
  checkoutPart,
  setCheckoutPart,
  isMobile,
  clientSecret,
}: CorporateEventSummaryAndCheckoutProps) => {
  const { submitHandler, loadingEventCreation } = usePayCorporateEvent(event.id);

  if (loadingEventCreation) return <ShimmerAddEvent />;

  const initialFormValues = {
    consent: true,
    acceptTermsAndConditions: false,
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={payCorporateEventSchema}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={submitHandler}
    >
      {({ values, isSubmitting, setFieldValue, errors, touched }) => (
        <Form className="tw-flex tw-flex-col tw-gap-10">
          <div className="tw-flex">
            {/* CHECKOUT FORM */}
            {(!isMobile || checkoutPart === 2) && (
              <CheckoutForm
                clientSecret={clientSecret}
                values={{ ...values, payOption: event.paymentPlan }}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
              />
            )}

            {/* ORDER SUMMARY */}
            <OrderSummary
              isMobile={isMobile}
              checkoutPart={checkoutPart}
              payOption={event.paymentPlan}
              event={{
                ...event,
                totalPriceForFullInCents: event.totalPriceInCents,
                totalPriceForPartialInCents: event.totalPriceInCents,
                stripeFeeForFullInCents: event.stripeFeeInCents,
                stripeFeeForPartialInCents: event.stripeFeeInCents,
              }}
              isCorporateEvent={true}
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
            <div className="tw-w-full sm:tw-mb-0 tw-mb-10">
              <button
                type="submit"
                className="custom-btn3 tw-w-full tw-uppercase"
                disabled={isSubmitting}
              >
                Confirm and pay
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default CorporateEventSummaryAndCheckout;
