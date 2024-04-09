import React, { type ReactElement, useMemo, useState } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import MainTitle from "@components/Title/MainTitle";
import OnDemandBookingActions from "@components/onDemandBooking/Actions";
import { Form, Formik } from "formik";
import FormInput from "@components/inputs/FormInput";
import BudgetSlider from "@components/Sliders/BudgetSlider";
import Checkbox from "@components/Checkbox";
import FormSelect from "@components/inputs/FormSelect";
import FormDateInput from "@components/inputs/FormDate";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import {
  BUDGET_REQUIRED,
  CITY_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  EVENT_DATE_REQUIRED,
  EVENT_TYPE_REQUIRED,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  PHONE_MAX_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
  STATE_REQUIRED,
} from "@constants/ValidationConstants";
import { getEventTypesQuery, getStateQuery } from "@server/api/queries";
import { type SelectOption } from "@types";

import { toast } from "react-toastify";

import { z } from "zod";

import { toFormikValidationSchema } from "zod-formik-adapter";
import Head from "next/head";
import RecaptchaComponent from "@components/RecaptchaComponent";
import { sendGTMEvent } from "@next/third-parties/google";
import { EMAIL_REGEX } from "@constants/RegexConstants";
import UTMSetter from "@components/UTMSetter";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { env } from "~/env.mjs";

const recaptchaKey = env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
import { getGaClientid } from "@utils/getGaClientid";

dayjs.extend(utc);

const CURRENT_STEP = 1;

const Step: NextPageWithLayout = () => {
  const router = useRouter();
  const createCorporateEventMutation = api.eventRouter.createCorporateInProcessEvent.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const clientId = getGaClientid();

  const context = api.useContext();

  const requestInfo = { sortField: "name" as const, sortOrder: "asc" as const };

  const { isLoading: isLoadingStates, data: states } = getStateQuery(requestInfo);

  const stateOptions: SelectOption[] | undefined = useMemo(
    () =>
      states?.map((state) => ({
        value: state.id.toString(),
        label: state.name,
      })),
    [states],
  );

  const { isLoading: isLoadingEventTypes, data: eventTypes } = getEventTypesQuery(requestInfo);

  const typeOptions: SelectOption[] | undefined = useMemo(
    () =>
      eventTypes?.map((eventType) => ({
        value: eventType.id.toString(),
        label: eventType.name,
      })),
    [eventTypes],
  );

  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    typeId: "",
    city: "",
    stateId: "",
    consent: false,
    eventDate: "",
    phoneNumber: "",
    approximateBudget: 0,
  };

  const validationSchema = z.object({
    firstName: z.string({ required_error: FIRST_NAME_REQUIRED }).max(25, FIRST_NAME_MAX_LENGTH),
    lastName: z.string({ required_error: LAST_NAME_REQUIRE }).max(25, LAST_NAME_MAX_LENGTH),
    email: z
      .string({ required_error: EMAIL_REQUIRED })
      .email({ message: EMAIL_VALID })
      .refine((v) => EMAIL_REGEX.test(v), EMAIL_VALID),
    typeId: z.string({ required_error: EVENT_TYPE_REQUIRED }),
    city: z.string({ required_error: CITY_REQUIRED }),
    stateId: z.string({ required_error: STATE_REQUIRED }),
    consent: z.boolean().optional(),
    eventDate: z.string({ required_error: EVENT_DATE_REQUIRED }),
    phoneNumber: z
      .string({ required_error: PHONE_REQUIRED })
      .min(10, PHONE_MAX_LENGTH)
      .max(10, PHONE_MAX_LENGTH)
      .refine((v) => PHONE_NO_REGEX.test(v), PHONE_NO_VALID),
    approximateBudget: z.number({
      required_error: BUDGET_REQUIRED,
    }),
  });

  const submitHandler = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    typeId: string;
    city: string;
    stateId: string;
    consent: boolean;
    eventDate: string;
    phoneNumber: string;
    approximateBudget: number;
  }) => {
    setIsLoading(true);

    if (!token) {
      console.error("Recaptcha has not been loaded");
      return;
    }

    await createCorporateEventMutation.mutateAsync(
      {
        ...values,
        captchaToken: token,
        typeId: parseInt(values.typeId),
        stateId: parseInt(values.stateId),
        approximateBudget: values.approximateBudget,
        eventDate: dayjs(values.eventDate).toDate(),
        clientId,
      },
      {
        onSuccess: (result) => {
          if (result.success && !!result.event) {
            sendGTMEvent({
              event: "corporate_lead",
              value: {
                email: result.event.email,
                phoneNumber: result.event.phoneNumber,
                type: result.typeName,
                approximateBudget: result.event.approximateBudget,
              },
            });
            void context.eventRouter.getInProcessEvent.invalidate();
            void router.push(`/book-now/corporate/book-confirmation`);
            return;
          }

          toast.error("Error saving event, please try again later");
          setIsLoading(false);
        },
        onError: () => {
          toast.error("Error saving event, please try again later");
          setIsLoading(false);
        },
      },
    );
  };

  const textClassName = "tw-text-black tw-font-bold tw-mb-2";
  const fieldContainerClassName = "tw-flex-col tw-w-full";

  return isLoadingStates || isLoadingEventTypes || isLoading ? (
    <ShimmerAddEvent />
  ) : (
    <div>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <UTMSetter />

      <div className="tw-flex tw-flex-col tw-gap-10">
        <MainTitle className="md:tw-mt-0 tw-mt-3" />
        <Formik
          initialValues={initialFormValues}
          validationSchema={toFormikValidationSchema(validationSchema)}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={submitHandler}
        >
          {({ isSubmitting, errors, setFieldValue, touched, values }) => (
            <Form className="tw-flex tw-flex-col tw-gap-10">
              {/* NAMES */}
              <div className="tw-flex sm:tw-flex-row tw-flex-col sm:tw-gap-4 tw-gap-10">
                <div className="tw-w-full">
                  <FormInput
                    label="First Name*"
                    name="firstName"
                    error={errors.firstName}
                    isTouched={!!touched.firstName}
                    placeholder="Insert first name"
                  />
                </div>
                <div className="tw-w-full">
                  <FormInput
                    label="Last Name*"
                    name="lastName"
                    error={errors.lastName}
                    isTouched={!!touched.lastName}
                    placeholder="Insert last name"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className={fieldContainerClassName}>
                <FormInput
                  label="Email*"
                  name="email"
                  error={errors.email}
                  isTouched={!!touched.email}
                  placeholder="Insert email"
                />
              </div>

              {/* PHONE NUMBER */}
              <div className={fieldContainerClassName}>
                <FormInput
                  label="Mobile Phone*"
                  name="phoneNumber"
                  error={errors.phoneNumber}
                  isTouched={!!touched.phoneNumber}
                  placeholder="Insert number"
                />
              </div>

              {/* EVENT LOCATION */}
              <div className={fieldContainerClassName}>
                <div className="tw-flex">
                  <label className={textClassName} htmlFor="city">
                    Where will your event be held?*
                  </label>
                </div>
                <div className="tw-flex tw-gap-4">
                  <div className="tw-w-full">
                    <FormInput
                      name="city"
                      error={errors.city}
                      isTouched={!!touched.city}
                      placeholder="Insert city"
                      secondLabel="City"
                    />
                  </div>
                  <div className="tw-w-full">
                    <FormSelect
                      secondLabel="State"
                      name="stateId"
                      error={errors.stateId}
                      isTouched={!!touched.stateId}
                      placeholder="Select state"
                      onChange={(v) => setFieldValue("stateId", v ?? "")}
                      options={stateOptions}
                    />
                  </div>
                </div>
              </div>

              {/* EVENT DATE */}
              <div>
                <FormDateInput
                  label="Event Date*"
                  name="eventDate"
                  error={errors.eventDate}
                  isTouched={!!touched.eventDate}
                  placeholder="Select event date"
                  defaultValue=""
                  onChange={(eventDate) =>
                    setFieldValue(
                      "eventDate",
                      eventDate?.[0]
                        ? dayjs.utc(eventDate?.[0].toUTCString())?.format("YYYY-MM-DD")
                        : "",
                    )
                  }
                />
              </div>

              {/* EVENT TYPE */}
              <div className={fieldContainerClassName}>
                <FormSelect
                  label="Type Of Event*"
                  name="typeId"
                  error={errors.typeId}
                  isTouched={!!touched.typeId}
                  onChange={(v) => setFieldValue("typeId", v ?? "")}
                  placeholder="Select type"
                  options={typeOptions}
                />
              </div>

              {/* BUDGET */}
              <div className={fieldContainerClassName}>
                <label className={textClassName} htmlFor="approximateBudget">
                  Approximate Budget*
                </label>
                <BudgetSlider
                  defaultValue={0}
                  onChange={(e, value) => setFieldValue("approximateBudget", value)}
                />
                {errors.approximateBudget && touched.approximateBudget ? (
                  <span className="text-danger error-msg">{errors?.approximateBudget}</span>
                ) : null}
              </div>

              {/* CONSENT */}
              <div className={fieldContainerClassName}>
                <Checkbox
                  onChange={(e) => setFieldValue("consent", e.target.checked)}
                  checked={values.consent}
                  label="I would like to receive future event updates and promotion communications via email/phone/SMS."
                  id="consent"
                  name="consent"
                  light
                />
              </div>

              {/* ACTIONS */}
              <RecaptchaComponent validate={setToken} action="booking/corporate">
                <OnDemandBookingActions
                  isSubmitting={isSubmitting}
                  currentStep={CURRENT_STEP}
                  okButtonText="Confirm"
                />
              </RecaptchaComponent>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

Step.getLayout = (page: ReactElement) => (
  <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey ?? ""}>
    <VisitorLayout>{page}</VisitorLayout>
  </GoogleReCaptchaProvider>
);

export default Step;
