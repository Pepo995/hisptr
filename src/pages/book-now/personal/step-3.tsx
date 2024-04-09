"use client";
import React, { type ReactElement, useState } from "react";
import EventCreationStepper from "@components/Stepper/EventCreationStepper";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { BOOTH_TYPE_REQUIRED } from "@constants/ValidationConstants";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import MainTitle from "@components/Title/MainTitle";
import BoothOptions from "@components/onDemandBooking/BoothOptions";
import Actions from "@components/onDemandBooking/Actions";
import { PACKAGE_ID_HALO } from "@constants/packages";
import { useIsMobile } from "@hooks/useIsMobile";
import Head from "next/head";
import { sendGTMEvent } from "@next/third-parties/google";
import { formatPrice } from "@utils/Utils";

const CURRENT_STEP = 3;

const Step: NextPageWithLayout = () => {
  const saveEventMutation = api.eventRouter.saveEventStep3.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const eventId = router.query["event-id"];
  const isMobile = useIsMobile();

  const context = api.useContext();

  const {
    isFetching: isLoadingEvent,
    data: eventResult,
    error,
  } = api.eventRouter.getInProcessEvent.useQuery({
    id: typeof eventId === "string" ? eventId : undefined,
    requirePackagesPrices: true,
  });

  const desktopValue = isMobile ? 0 : PACKAGE_ID_HALO;

  const initialFormValues = {
    packageId: eventResult?.event?.packageId ?? desktopValue,
  };

  const validationSchema = Yup.object({
    packageId: Yup.number().required().min(1, BOOTH_TYPE_REQUIRED),
  });

  const submitHandler = async (values: { packageId: number }) => {
    if (typeof eventId !== "string") {
      toast.error("Event id is not valid");
      return;
    }

    setIsLoading(true);
    await saveEventMutation.mutateAsync(
      {
        ...values,
        eventId,
      },
      {
        onSuccess: (result) => {
          if (result.success && result.event) {
            sendGTMEvent({
              event: "personal_lead_step_3",
              value: {
                email: result.event.email,
                amount: formatPrice(result.event.totalPriceForPartialInCents / 100),
                experience: result.packageName,
              },
            });

            void context.eventRouter.getInProcessEvent.invalidate();
            void router.push(`/book-now/personal/step-${CURRENT_STEP + 1}?event-id=${eventId}`);
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

  if (isLoadingEvent) return <ShimmerAddEvent />;

  if (!eventResult?.packageOptions || !!error || !eventResult?.success || !eventResult.event) {
    toast.error(eventResult?.message ?? error?.message ?? "Error getting event data");
    void router.push(
      typeof eventId !== "string"
        ? "/book-now"
        : `/book-now/personal/step-${CURRENT_STEP - 1}?event-id=${eventId}`,
    );
    return;
  }

  const packagePrices = eventResult.packageOptions;

  return isLoading ? (
    <ShimmerAddEvent />
  ) : (
    <>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <div className="tw-flex tw-flex-col tw-gap-6">
        <EventCreationStepper activeStep={CURRENT_STEP - 1} />

        <MainTitle text="Select your Experience" textSize="2xl" />

        <p className="tw-text-black tw-font-montserrat tw-w-fit md:tw-text-base tw-text-sm md:tw-w-1/2">
          Click on the different packages to see which is right for your event! Once you&apos;ve
          made your selection click <span className="tw-font-semibold">Check Out</span> below to
          secure your reservation.
        </p>

        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={submitHandler}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="tw-w-full -tw-mt-5">
              <BoothOptions
                value={values.packageId}
                onChange={(packageId) => setFieldValue("packageId", packageId)}
                optionsPrices={packagePrices}
              />

              {/* ACTIONS */}
              <Actions
                isSubmitting={isSubmitting}
                okButtonText="Check Out"
                eventId={typeof eventId === "string" ? eventId : undefined}
                currentStep={CURRENT_STEP}
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
