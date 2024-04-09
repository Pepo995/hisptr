import { type ReactElement, useMemo, useState } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import EventCreationStepper from "@components/Stepper/EventCreationStepper";
import CheckoutFormAndOrderSummary from "@components/Payment/CheckoutFormAndOrderSummary";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { toast } from "react-toastify";

import { useIsMobile } from "@hooks/useIsMobile";
import { stripeCheckoutAppearance, stripeCheckoutFonts } from "@constants/OnDemandConstants";
import Head from "next/head";

const CURRENT_STEP = 4;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

const Step: NextPageWithLayout = () => {
  const router = useRouter();
  const eventId = router.query["event-id"];
  const isMobile = useIsMobile();

  const [checkoutPart, setCheckoutPart] = useState(1);

  const { isLoading: isLoadingSetupIntent, data: setupIntentResult } =
    api.paymentRouter.getSetupIntent.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    });

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!setupIntentResult?.clientSecret) return;

    return {
      clientSecret: setupIntentResult?.clientSecret,
      appearance: stripeCheckoutAppearance,
      fonts: stripeCheckoutFonts,
    };
  }, [setupIntentResult?.clientSecret]);

  if (isLoadingSetupIntent) return <ShimmerAddEvent />;

  if (!setupIntentResult?.success || !setupIntentResult.clientSecret) {
    toast.error("Error getting event data");

    void router.push(
      typeof eventId === "string" ? `/book-now/personal/step-1?event-id=${eventId}` : "/book-now",
    );
    return;
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <div className="tw-flex tw-flex-col tw-gap-10">
        <EventCreationStepper activeStep={CURRENT_STEP - 1} />

        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormAndOrderSummary
            eventId={typeof eventId === "string" ? eventId : undefined}
            currentStep={CURRENT_STEP}
            checkoutPart={checkoutPart}
            setCheckoutPart={setCheckoutPart}
            isMobile={!!isMobile}
            // TODO: Send clientSecret instead of getting it from the API again in the CheckoutFormAndOrderSummary.
          />
        </Elements>
      </div>
    </>
  );
};

Step.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default Step;
