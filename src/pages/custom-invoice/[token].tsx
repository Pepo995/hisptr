import { type ReactElement, useMemo, useState } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { type StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { toast } from "react-toastify";
import { useIsMobile } from "@hooks/useIsMobile";
import { decodeBase64 } from "@utils/Utils";
import CorporateEventSummaryAndCheckout from "@components/Payment/CorporateEventSummaryAndCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { stripeCheckoutAppearance, stripeCheckoutFonts } from "@constants/OnDemandConstants";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

const CustomInvoice: NextPageWithLayout = () => {
  const router = useRouter();
  const token = router.query.token;
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

  const eventId = typeof token === "string" ? parseInt(decodeBase64(token)) : undefined;

  const { data: result } = api.eventRouter.getEvent.useQuery(
    {
      id: eventId ?? 0,
    },
    { enabled: !!eventId },
  );

  if (isLoadingSetupIntent) return <ShimmerAddEvent />;

  if (typeof token !== "string") {
    toast.error("Error getting event data, please try with another event id");
    void router.push("/");
    return;
  }

  if (
    !result?.success ||
    !result.event ||
    !setupIntentResult?.success ||
    !setupIntentResult.clientSecret
  ) {
    toast.error("Error getting event data");

    void router.push("/");
    return;
  }

  // Preventing two payments in the same event.
  if (result.event.amountPaidInCents > 0) {
    toast.info("This event was already paid, we're redirecting you to the home page");

    setTimeout(() => void router.push("/"), 1500);
    return;
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-10">
      <Elements options={options} stripe={stripePromise}>
        <CorporateEventSummaryAndCheckout
          event={result.event}
          checkoutPart={checkoutPart}
          setCheckoutPart={setCheckoutPart}
          isMobile={!!isMobile}
          clientSecret={setupIntentResult.clientSecret}
        />
      </Elements>
    </div>
  );
};

CustomInvoice.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default CustomInvoice;
