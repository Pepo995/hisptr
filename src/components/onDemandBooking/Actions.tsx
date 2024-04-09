import Link from "next/link";
import { type ReactNode } from "react";

type OnDemandBookingActionsProps = {
  isSubmitting: boolean;
  eventId?: string;
  currentStep: number;
  isPersonal?: boolean;
  okButtonText?: string;
  customBackButon?: ReactNode;
  withGoBackButton?: boolean;
};

const OnDemandBookingActions = ({
  isSubmitting,
  eventId,
  currentStep,
  isPersonal = true,
  okButtonText = "Next step",
  customBackButon,
  withGoBackButton = true,
}: OnDemandBookingActionsProps) => (
  <div className="tw-flex md:tw-gap-6 tw-gap-3 md:tw-flex-row tw-flex-col-reverse sm:tw-mb-0 tw-mb-10">
    {withGoBackButton &&
      (customBackButon ? (
        customBackButon
      ) : (
        <div className="tw-w-full">
          <Link
            href={
              isPersonal && typeof eventId === "string" && currentStep > 1
                ? `/book-now/personal/step-${currentStep - 1}?event-id=${eventId}`
                : "/book-now"
            }
          >
            <button type="button" className="custom-btn4 tw-w-full tw-border-gray-300 tw-uppercase">
              Go back
            </button>
          </Link>
        </div>
      ))}

    <div className="tw-w-full">
      <button type="submit" className="custom-btn3 tw-w-full tw-uppercase" disabled={isSubmitting}>
        {okButtonText}
      </button>
    </div>
  </div>
);

export default OnDemandBookingActions;
