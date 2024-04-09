import { useStripe } from "@stripe/react-stripe-js";
import { useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { api } from "@utils/api";
import { useRouter } from "next/router";

const useSecondPaymentFix = (eventId: number) => {
  const secondPaymentFixMutation = api.eventRouter.secondPaymentFix.useMutation();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const submitHandler = async () => {
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

      secondPaymentFixMutation.mutate(
        {
          eventId,
          setupIntentId: result.setupIntent?.id,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              void router.push(
                `/book-now/personal/second-payment-confirmation?event-id=${data.eventId}`,
              );
              return;
            }

            toast.error("Second payment fix failed");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } catch (error) {
      toast.error("Second payment fix failed");
      console.error(error);
    }
  };

  return {
    isLoadingSecondPaymentFix: secondPaymentFixMutation.isLoading,
    submitHandler,
  };
};

export default useSecondPaymentFix;
