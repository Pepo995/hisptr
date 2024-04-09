import React, { type ReactElement, useMemo, useState } from "react";
import EventCreationStepper from "@components/Stepper/EventCreationStepper";
import VisitorLayout from "@components/layouts/VisitorLayout";
import type { NextPageWithLayout } from "@pages/_app";
import { Form, Formik } from "formik";
import { z } from "zod";

import { toFormikValidationSchema } from "zod-formik-adapter";

import {
  CITY_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  EVENT_TYPE_REQUIRED,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  STATE_REQUIRED,
} from "@constants/ValidationConstants";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { useRouter } from "next/router";
import type { SelectOption } from "@types";
import type { InProcessEvent } from "@prisma/client";

import FormInput from "@components/inputs/FormInput";

import FormSelect from "@components/inputs/FormSelect";

import MainTitle from "@components/Title/MainTitle";
import { getEventTypesQuery, getStateQuery } from "@server/api/queries";

import Checkbox from "@components/Checkbox";

import Actions from "@components/onDemandBooking/Actions";
import { toast } from "react-toastify";
import Head from "next/head";
import RecaptchaComponent from "@components/RecaptchaComponent";
import { sendGTMEvent } from "@next/third-parties/google";
import { EMAIL_REGEX } from "@constants/RegexConstants";
import { env } from "~/env.mjs";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { getGaClientid } from "@utils/getGaClientid";
import UTMSetter from "@components/UTMSetter";
import Image from "next/image";
import FastrLogo from "@images/home/fastr-logo.webp";
import { usableOptions } from "@constants/LeadsConstants";

const eventTypeOrder = [
  "Wedding",
  "Wedding Anniversary/Celebration",
  "Banquet",
  "Bar Mitzvah",
  "Bat Mitzvah",
  "Birthday Party",
  "Charity Event",
  "Class Reunion",
  "Family Reunion",
  "Fundraiser",
  "Graduation",
  "Holiday Party",
  "Other",
  "Private Party",
  "Prom",
  "Quinceanera",
  "School Dance",
];

const recaptchaKey = env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const CURRENT_STEP = 1;

const Step: NextPageWithLayout = () => {
  const saveEventMutation = api.eventRouter.saveEventStep1.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>();
  const clientId = getGaClientid();

  const eventId = router.query["event-id"];
  let event: InProcessEvent | undefined;

  const context = api.useContext();

  const { isLoading: isLoadingEvent, data: result } = api.eventRouter.getInProcessEvent.useQuery({
    id: typeof eventId === "string" ? eventId : undefined,
  });

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
      eventTypes
        ?.filter((eventType) => usableOptions.some((option) => option === eventType.name))
        .map((eventType) => ({
          value: eventType.id.toString(),
          label: eventType.name,
        }))
        .sort((a, b) => eventTypeOrder.indexOf(a.label) - eventTypeOrder.indexOf(b.label)),
    [eventTypes],
  );

  if (result?.event) event = result.event;

  const initialFormValues = {
    firstName: event?.firstName ?? "",
    lastName: event?.lastName ?? "",
    email: event?.email ?? "",
    typeId: event?.typeId?.toString() ?? "",
    city: event?.city ?? "",
    stateId: event?.stateId?.toString() ?? "",
    consent: event?.receiveCommunicationsAccepted ?? false,
  };

  const validationSchema = z.object({
    firstName: z
      .string({
        required_error: FIRST_NAME_REQUIRED,
      })
      .max(25, FIRST_NAME_MAX_LENGTH),
    lastName: z.string({ required_error: LAST_NAME_REQUIRE }).max(25, LAST_NAME_MAX_LENGTH),
    email: z
      .string({ required_error: EMAIL_REQUIRED })
      .email({ message: EMAIL_VALID })
      .refine((v) => EMAIL_REGEX.test(v), EMAIL_VALID),
    typeId: z.string({ required_error: EVENT_TYPE_REQUIRED }),
    city: z.string({ required_error: CITY_REQUIRED }),
    stateId: z.string({ required_error: STATE_REQUIRED }),
    consent: z.boolean().optional(),
  });

  const submitHandler = async (values: typeof initialFormValues) => {
    setIsLoading(true);

    if (!token) {
      console.error("Recaptcha has not been loaded");
      return;
    }

    await saveEventMutation.mutateAsync(
      {
        ...values,
        captchaToken: token,
        typeId: parseInt(values.typeId),
        stateId: parseInt(values.stateId),
        eventId: typeof eventId === "string" ? eventId : undefined,
        clientId,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            sendGTMEvent({
              event: "personal_lead_step_1",
              value: {
                email: values.email,
                type: result.typeName,
              },
            });

            void context.eventRouter.getInProcessEvent.invalidate();
            void router.push(
              `/book-now/personal/step-${CURRENT_STEP + 1}?event-id=${result.eventId}`,
            );
            return;
          }

          setIsLoading(false);
        },
        onError: () => {
          toast.error("Error saving event, please try again later");
          setIsLoading(false);
        },
      },
    );
  };

  return saveEventMutation.isLoading ||
    isLoadingEvent ||
    isLoadingEventTypes ||
    isLoadingStates ||
    isLoading ? (
    <ShimmerAddEvent />
  ) : (
    <div>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <UTMSetter />

      <div className="tw-flex tw-flex-col tw-gap-6">
        <EventCreationStepper activeStep={0} />
        <MainTitle />

        <div className="tw-flex xl:tw-flex-row tw-flex-col xl:tw-items-center lg:tw-gap-y-6 sm:tw-gap-y-3 tw-gap-y-5 tw-gap-x-1">
          <p className="md:tw-py-2 tw-text-black tw-py-0.5 tw-font-montserrat md:-tw-my-5 -tw-my-2 tw-w-fit md:tw-text-base tw-text-sm">
            Fill out this form in <span className="tw-font-semibold">2 minutes</span> to see your
            actual <span className="tw-font-semibold">quote</span> and you can even
            <span className="tw-font-semibold"> book your photo booth.</span>
          </p>
          <div className="tw-flex tw-gap-2 tw-items-center tw-content-center tw-border-2 tw-w-52 tw-rounded-md tw-h-9 tw-justify-center lg:tw-place-self-start tw-place-self-end">
            <Image src={FastrLogo} alt="fastr-logo" width={45} />

            <p className="tw-text-[10px] tw-font-semibold tw-font-GoodHeadlinePro tw-pt-5">
              Book in 2 minutes
            </p>
          </div>
        </div>

        <Formik
          initialValues={initialFormValues}
          validationSchema={toFormikValidationSchema(validationSchema)}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={submitHandler}
        >
          {({ errors, setFieldValue, touched, values, isSubmitting }) => (
            <Form className="tw-flex tw-flex-col tw-gap-10 tw-w-full">
              {/* NAMES */}
              <div className="tw-flex sm:tw-flex-row tw-flex-col sm:tw-gap-4 tw-gap-10 tw-w-full">
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

              <div className="tw-flex sm:tw-flex-row tw-flex-col sm:tw-gap-4 tw-gap-10 tw-w-full">
                {/* EMAIL */}
                <div className="tw-flex-col tw-w-full">
                  <div className="tw-w-full">
                    <FormInput
                      label="Email*"
                      name="email"
                      error={errors.email}
                      isTouched={!!touched.email}
                      placeholder="Insert email"
                    />
                  </div>
                </div>

                {/* EVENT TYPE */}
                <div className="tw-flex-col tw-w-full">
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
              </div>

              {/* EVENT LOCATION */}
              <div className="tw-flex-col tw-w-full">
                <div className="tw-flex">
                  <label className="tw-text-black tw-font-bold tw-mb-2" htmlFor="city">
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

              {/* CONSENT */}
              <div className="tw-flex-col tw-w-full">
                <div className="tw-w-full">
                  <Checkbox
                    onChange={(e) => setFieldValue("consent", e.target.checked)}
                    checked={values.consent}
                    label="I consent to receiving communications via email/phone/SMS for future updates and promotions."
                    id="consent"
                    name="consent"
                    light
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <RecaptchaComponent validate={setToken} action="booking/personal">
                <Actions
                  isSubmitting={isSubmitting}
                  eventId={typeof eventId === "string" ? eventId : undefined}
                  currentStep={CURRENT_STEP}
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
