import { PaymentElement } from "@stripe/react-stripe-js";
import Title from "@components/Title/MainTitle";
import Checkbox from "@components/Checkbox";
import { event_payment_plan } from "@prisma/client";
import AlertIcon from "@components/icons/Alert";
import { type FormikErrors, type FormikTouched } from "formik";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import TermsAndConditionsModal from "./TermsAndConditionsModal";
import { useState } from "react";

type CheckoutFormProps = {
  clientSecret: string;
  values: {
    payOption: string;
    consent: boolean;
    acceptTermsAndConditions: boolean;
  };
  setFieldValue: (
    field: "consent" | "acceptTermsAndConditions",
    value: boolean,
  ) => Promise<void | FormikErrors<{
    consent: boolean;
    acceptTermsAndConditions: boolean;
  }>>;
  errors: FormikErrors<{
    consent: boolean;
    acceptTermsAndConditions: boolean;
  }>;
  touched: FormikTouched<{
    consent: boolean;
    acceptTermsAndConditions: boolean;
  }>;
  paymentElementAppearance?: {
    variables: {
      fontFamily: string;
      fontWeight: string;
      color: string;
    };
  };
  isSecondPaymentFix?: boolean;
};

const CheckoutForm = ({
  clientSecret,
  values,
  setFieldValue,
  errors,
  touched,
  paymentElementAppearance,
  isSecondPaymentFix = false,
}: CheckoutFormProps) => {
  const [termsAndConditionsModalOpen, setTermsAndConditionsModalOpen] = useState(false);

  return (
    <div className="tw-flex tw-flex-col tw-w-full lg:tw-border-b lg:tw-border-slate-light md:tw-pb-8">
      <div className="tw-border-b tw-border-slate-light md:tw-pb-5">
        <Title text="Payment Details" className="tw-hidden md:tw-block" textSize="3xl" />
      </div>
      <div className="tw-mt-10">
        {clientSecret && (
          <>
            <h2 className="tw-font-montserrat tw-font-semibold tw-text-black tw-text-xl tw-mb-4">
              Pay with
            </h2>
            <PaymentElement
              id="payment-element"
              options={{ terms: { card: "auto" }, ...(paymentElementAppearance ?? {}) }}
            />
          </>
        )}
      </div>

      <div className="tw-w-full tw-text-black tw-font-medium">
        {values.payOption === event_payment_plan.partial_50_50 && !isSecondPaymentFix && (
          <Checkbox
            onChange={(e) => setFieldValue("consent", e.target.checked)}
            checked={values.consent}
            label="Save card details"
            id="consent"
            name="consent"
            inter={false}
            black
          />
        )}

        {values.payOption === event_payment_plan.partial_50_50 && !isSecondPaymentFix && (
          <div className="tw-mb-6">
            <div className="tw-mt-4">
              I understand that my payment information will be saved solely for the purpose of
              completing the final balance payment due 30 days prior to the event date.
            </div>

            {errors.consent && touched.consent ? (
              <div className="tw-mt-2 tw-flex">
                <AlertIcon />
                <span className="tw-text-red-alert error-msg tw-ml-2 tw-text-sm">
                  {errors.consent}
                </span>
              </div>
            ) : null}
          </div>
        )}

        <TermsAndConditionsModal
          open={termsAndConditionsModalOpen}
          setOpen={setTermsAndConditionsModalOpen}
          onConfirm={() => setFieldValue("acceptTermsAndConditions", true)}
        />

        <Checkbox
          onChange={(e) => setFieldValue("acceptTermsAndConditions", e.target.checked)}
          checked={values.acceptTermsAndConditions}
          id="acceptTermsAndConditions"
          name="acceptTermsAndConditions"
          inter={false}
          black
        >
          By checking this box you are confirming that you have read, understood, and agree to
          Hipstr{" "}
          <button
            onClick={() => setTermsAndConditionsModalOpen(true)}
            className="tw-underline tw-font-semibold"
            type="button"
          >
            terms and conditions.
          </button>
        </Checkbox>

        {errors.acceptTermsAndConditions && touched.acceptTermsAndConditions ? (
          <div className="tw-mt-2 tw-flex">
            <AlertIcon />
            <span className="tw-text-red-alert error-msg tw-ml-2 tw-text-sm">
              {errors.acceptTermsAndConditions}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CheckoutForm;
