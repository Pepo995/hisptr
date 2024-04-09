import React, { type ReactElement } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { toast } from "react-toastify";
import Image from "next/image";

const PayConfirmation: NextPageWithLayout = () => {
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
    void router.push("/");
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
          Thank You For Your Purchase
        </h2>
        <div className="tw-flex tw-flex-col tw-gap-6 tw-items-center tw-max-w-[558px] tw-text-center tw-font-light    sm:tw-font-normal">
          <div className="tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-items-center">
              Event ID
              <span className="tw-font-bold">&nbsp;#{event.eventNumber}</span>
            </div>
            <div>
              We’re excited for your event! You will receive an email confirmation from
              <span className="tw-font-bold">&nbsp;admin@bookhipstr.com</span> at the email you
              booked with within 24 hours.
            </div>
          </div>
          <div>
            If you do not receive it in that timeframe, please
            <span className="tw-font-bold">&nbsp;check your spam</span> folder and mark it as not
            spam and add us to your safe senders list so you will receive our communications going
            forward.
          </div>
          <div>
            If you still don’t see the email please reach out to
            <span className="tw-font-bold">&nbsp;admin@bookhipstr.com</span> and let us know your
            <span className="tw-font-bold">&nbsp;Event ID&nbsp;</span>and we will be happy to assist
            you.
          </div>
        </div>
      </div>
    </div>
  );
};

PayConfirmation.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default PayConfirmation;
