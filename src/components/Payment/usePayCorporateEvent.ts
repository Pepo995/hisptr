import { useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { api } from "@utils/api";

import { useRouter } from "next/router";

import type { PayCorporateFormValues } from "./type";

const usePayCorporateEvent = (eventId: number) => {
  const payCorporateEventMutation = api.eventRouter.payCorporateEvent.useMutation();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const submitHandler = async (values: PayCorporateFormValues) => {
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

      payCorporateEventMutation.mutate(
        {
          id: eventId,
          setupIntentId: result.setupIntent?.id,
          saveCardDetails: values.consent,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              void router.push(`/book-now/corporate/pay-confirmation?event-id=${data.eventId}`);
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
      toast.error((error as { message: string })?.message ?? "Error making payment");
      console.error(error);
    }
  };

  return {
    loadingEventCreation: payCorporateEventMutation.isLoading,
    submitHandler,
  };
};

export default usePayCorporateEvent;
