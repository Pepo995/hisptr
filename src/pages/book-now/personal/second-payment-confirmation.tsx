import React, { type ReactElement } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { toast } from "react-toastify";
import Image from "next/image";

const Confirmation: NextPageWithLayout = () => {
  const router = useRouter();
  const eventId = router.query["event-id"];

  const { isLoading: isLoadingEvent, data: result } =
    typeof eventId === "string"
      ? api.eventRouter.getEvent.useQuery({
          id: parseInt(eventId),
        })
      : { isLoading: true, data: undefined };

  if (isLoadingEvent) return <ShimmerAddEvent />;

  if (!result?.success || !result.event) {
    toast.error("Error getting event data");
    void router.push(
      typeof eventId === "string" ? `/book-now/personal/step-1?event-id=${eventId}` : "/book-now",
    );
    return;
  }

  const { event } = result;

  return (
    <div className="tw-flex tw-min-h-[600px]">
      <div className="tw-flex tw-flex-col tw-items-center tw-mx-auto tw-mt-3    sm:tw-m-auto">
        <div className="tw-flex">
          <Image
            src="/images/on-demand/confirmation-ready-small.webp"
            alt="Event Image"
            width={482}
            height={282}
            className="sm:tw-hidden tw-rounded-sm"
          />
          <Image
            src="/images/on-demand/confirmation-ready.webp"
            alt="Event Image"
            width={482}
            height={282}
            className="tw-hidden sm:tw-block"
          />
        </div>
        <h2 className="tw-font-montserrat tw-font-extrabold tw-text-primary tw-mt-8 tw-mb-3 tw-text-2xl    sm:tw-text-3xl sm:tw-font-bold">
          Your Final Payment Has Been Completed
        </h2>
        <div className="tw-flex tw-flex-col tw-gap-6 tw-items-center tw-max-w-[558px] tw-text-center tw-font-light    sm:tw-font-normal">
          <div className="tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-items-center">
              Event ID
              <span className="tw-font-bold">&nbsp;#{event.eventNumber}</span>
            </div>
          </div>
          <div className="tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-items-center">
              Thanks for completing your final balance payment. We can&apos;t wait for your event!
            </div>
          </div>
          <div>
            If you still have any outstanding questions, please email{" "}
            <span className="tw-font-bold">&nbsp;admin@bookhipstr.com</span> and let us know your
            <b>&nbsp;Event ID&nbsp;</b>and we will be happy to assist you.
          </div>
        </div>
      </div>
    </div>
  );
};

Confirmation.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default Confirmation;
