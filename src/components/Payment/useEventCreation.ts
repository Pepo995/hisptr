import { useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { api } from "@utils/api";
import { type event_payment_plan } from "@prisma/client";
import { useRouter } from "next/router";

import type { FormValues } from "./type";
import { sendGTMEvent } from "@next/third-parties/google";
import { formatPrice } from "@utils/Utils";

const useEventCreation = (eventId?: string, appliedPromotionalCode?: string) => {
  const finishEventCreationMutation = api.eventRouter.finishEventCreation.useMutation();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const submitHandler = async (values: FormValues) => {
    if (!eventId) {
      toast.error("Event ID not found");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Error communicating with Stripe");
      return;
    }

    try {
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {},
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message);
        console.error(result.error);
        return;
      }

      finishEventCreationMutation.mutate(
        {
          id: eventId,
          paymentPlan: values.payOption as event_payment_plan,
          setupIntentId: result.setupIntent?.id,
          saveCardDetails: values.consent,
          promotionalCode: appliedPromotionalCode,
        },
        {
          onSuccess: (result) => {
            if (result.success && result.event) {
              sendGTMEvent({
                event: "personal_lead",
                value: {
                  email: result.event.email,
                  phoneNumber: result.event.phoneNumber,
                  amount: formatPrice(result.event.totalPriceInCents / 100),
                  couponCode: result.event.promotionalCodeCode,
                  experience: result.packageName,
                  type: result.typeName,
                  approximateBudget: result.approximateBudget,
                },
              });

              void router.push(`/book-now/personal/book-confirmation?event-id=${result.eventId}`);
              return;
            }

            toast.error("Event creation failed");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loadingEventCreation: finishEventCreationMutation.isLoading,
    submitHandler,
  };
};

export default useEventCreation;
