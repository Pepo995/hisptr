import { toast } from "react-toastify";

import { api } from "@utils/api";

import { useState } from "react";

const usePromotionalCodeCreation = (eventId?: string) => {
  const applyPromotionalCodeMutation = api.eventRouter.applyPromotionalCode.useMutation();
  const [promotionalCodeDiscountInCents, setPromotionalCodeDiscountInCents] = useState(0);

  const [appliedPromotionalCode, setAppliedPromotionalCode] = useState<string>();

  const handleApplyPromotionalCode = (promotionalCode: string) => {
    if (!promotionalCode) {
      toast.error("Please enter a promotional code");
      return;
    }

    if (typeof eventId !== "string") {
      toast.error("Event id is not valid");
      return;
    }

    applyPromotionalCodeMutation.mutate(
      {
        eventId,
        promotionalCode,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setPromotionalCodeDiscountInCents(res.discountInCents);
            setAppliedPromotionalCode(promotionalCode);
            return;
          }

          toast.error("Error applying promotional code");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return {
    handleApplyPromotionalCode,
    promotionalCodeDiscountInCents,
    appliedPromotionalCode,
    isLoadingApplyPromotionalCode: applyPromotionalCodeMutation.isLoading,
  };
};

export default usePromotionalCodeCreation;
