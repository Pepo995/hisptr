import React, { type ReactElement, useState } from "react";
import EventCreationStepper from "@components/Stepper/EventCreationStepper";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  BUDGET_REQUIRED,
  EVENT_DATE_REQUIRED,
  PHONE_MAX_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
} from "@constants/ValidationConstants";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import BudgetSlider from "@components/Sliders/BudgetSlider";
import { type InProcessEvent } from "@prisma/client";

import FormInput from "@components/inputs/FormInput";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import MainTitle from "@components/Title/MainTitle";
import FormDateInput from "@components/inputs/FormDate";
import Actions from "@components/onDemandBooking/Actions";
import Head from "next/head";
import { sendGTMEvent } from "@next/third-parties/google";

dayjs.extend(utc);

const CURRENT_STEP = 2;

const Step: NextPageWithLayout = () => {
  const saveEventMutation = api.eventRouter.saveEventStep2.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const eventId = router.query["event-id"];
  let event: InProcessEvent | undefined;

  const context = api.useContext();

  const { isLoading: isLoadingEvent, data: result } = api.eventRouter.getInProcessEvent.useQuery({
    id: typeof eventId === "string" ? eventId : undefined,
  });

  if (result?.event) event = result.event;

  const initialFormValues = {
    eventDate: event?.eventDate ? dayjs.utc(event?.eventDate).format("YYYY-MM-DD") : "",
    phoneNumber: event?.phoneNumber ?? "",
    approximateBudget: event?.approximateBudget?.toString() ?? "",
    message: event?.message ?? undefined,
  };

  const validationSchema = Yup.object({
    eventDate: Yup.date()
      .required(EVENT_DATE_REQUIRED)
      .min(
        dayjs.utc(new Date()).add(2, "day").format("YYYY-MM-DD"),
        "Date must be at least 2 days from now",
      ),
    phoneNumber: Yup.string()
      .min(10, PHONE_MAX_LENGTH)
      .max(10, PHONE_MAX_LENGTH)
      .matches(PHONE_NO_REGEX, PHONE_NO_VALID)
      .required(PHONE_REQUIRED),
    approximateBudget: Yup.string().required(BUDGET_REQUIRED),
    message: Yup.string().optional(),
  });

  const submitHandler = async (values: {
    eventDate: string;
    phoneNumber: string;
    approximateBudget: string;
    message?: string;
  }) => {
    if (typeof eventId !== "string") {
      toast.error("Event id is not valid");
      return;
    }

    setIsLoading(true);

    await saveEventMutation.mutateAsync(
      {
        ...values,
        eventDate: dayjs(values.eventDate).toDate(),
        approximateBudget: parseInt(values.approximateBudget),
        eventId,
      },
      {
        onSuccess: (result) => {
          if (result.success && result.event) {
            sendGTMEvent({
              event: "personal_lead_step_2",
              value: {
                email: result.event.email,
                phoneNumber: values.phoneNumber,
                approximateBudget: values.approximateBudget,
              },
            });
            void context.eventRouter.getInProcessEvent.invalidate();
            void router.push(`/book-now/personal/step-${CURRENT_STEP + 1}?event-id=${eventId}`);
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

  const textClassName = "tw-text-black tw-font-bold tw-mb-2";

  return isLoading || isLoadingEvent ? (
    <ShimmerAddEvent />
  ) : (
    <>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <div className="tw-flex tw-flex-col md:tw-gap-6 tw-gap-2">
        <EventCreationStepper activeStep={CURRENT_STEP - 1} />

        <MainTitle text="Fill out a Few Event Details" />

        <p className="tw-text-black tw-font-montserrat tw-w-fit md:tw-text-base tw-text-sm">
          Fill out the fields below and click <span className="tw-font-semibold">See Pricing</span>{" "}
          to see your <span className="tw-font-semibold">actual quote in the next step!</span>
        </p>

        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={submitHandler}
        >
          {({ errors, setFieldValue, touched, isSubmitting }) => (
            <Form className="tw-flex tw-flex-col tw-gap-10">
              {/* PHONE NUMBER */}
              <div className="tw-flex-col tw-w-full">
                <FormInput
                  label="Mobile Phone*"
                  name="phoneNumber"
                  error={errors.phoneNumber}
                  isTouched={!!touched.phoneNumber}
                  placeholder="Insert number"
                />
              </div>

              {/* EVENT DATE */}
              <div>
                <FormDateInput
                  label="Event Date*"
                  name="eventDate"
                  error={errors.eventDate}
                  isTouched={!!touched.eventDate}
                  placeholder="Select event date"
                  defaultValue={
                    event?.eventDate ? dayjs.utc(event?.eventDate).format("YYYY-MM-DD") : ""
                  }
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

              {/* BUDGET */}
              <div className="tw-flex-col tw-w-full">
                <label className={textClassName} htmlFor="approximateBudget">
                  Approximate Budget*
                </label>
                <BudgetSlider
                  defaultValue={event?.approximateBudget ?? 0}
                  onChange={(e, value) => setFieldValue("approximateBudget", value)}
                />
                {errors.approximateBudget && touched.approximateBudget ? (
                  <span className="text-danger error-msg">{errors?.approximateBudget}</span>
                ) : null}
              </div>

              {/* MESSAGE */}
              <div className="tw-flex-col tw-w-full">
                <label className={textClassName} htmlFor="message">
                  Your Message
                </label>

                <Field
                  name="message"
                  id="message"
                  placeholder="Insert message"
                  className="input-group form-control"
                />

                {errors.message && touched.message ? (
                  <span className="text-danger error-msg">{errors?.message}</span>
                ) : null}
              </div>

              {/* ACTIONS */}
              <Actions
                isSubmitting={isSubmitting}
                eventId={typeof eventId === "string" ? eventId : undefined}
                currentStep={CURRENT_STEP}
                okButtonText="SEE PRICING"
              />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

Step.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default Step;
