import Link from "next/link";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeft";

const BackButton = ({
  isPersonal,
  eventId,
  currentStep,
}: {
  isPersonal?: boolean;
  eventId?: string;
  currentStep: number;
}) => (
  <Link
    href={
      isPersonal && typeof eventId === "string" && currentStep > 1
        ? `/book-now/personal/step-${currentStep - 1}?event-id=${eventId}`
        : "/book-now"
    }
  >
    <ChevronLeftRoundedIcon className="tw-text-black" />
  </Link>
);

export default BackButton;
