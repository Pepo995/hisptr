import { type ReactElement, useMemo, useState } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import SecondPaymentFix from "@components/Payment/SecondPaymentFix";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { toast } from "react-toastify";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeft";

import { useIsMobile } from "@hooks/useIsMobile";
import { stripeCheckoutAppearance, stripeCheckoutFonts } from "@constants/OnDemandConstants";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

const RetryPayment: NextPageWithLayout = () => {
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

    void router.push("/");
    return;
  }

  const clientSecret = setupIntentResult?.clientSecret;

  if (typeof eventId !== "string" || Number.isNaN(parseInt(eventId))) {
    toast("Invalid event id");
    void router.push("/");
    return;
  }

  const numberEventId = parseInt(eventId);

  return (
    <div className="tw-flex tw-flex-col tw-gap-10">
      <div className="lg:tw-hidden tw-block tw-mt-1">
        {!isMobile || checkoutPart !== 1 ? (
          <button className="lg:tw-hidden tw-block tw-mt-1" onClick={() => setCheckoutPart(1)}>
            <ChevronLeftRoundedIcon className="tw-text-black" />
          </button>
        ) : null}
      </div>

      <Elements options={options} stripe={stripePromise}>
        <SecondPaymentFix
          eventId={numberEventId}
          checkoutPart={checkoutPart}
          setCheckoutPart={setCheckoutPart}
          isMobile={!!isMobile}
          clientSecret={clientSecret}
        />
      </Elements>
    </div>
  );
};

RetryPayment.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default RetryPayment;
