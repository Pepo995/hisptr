import React, { type ReactElement } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { api } from "@utils/api";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { toast } from "react-toastify";
import Image from "next/image";
import { events_admin_status } from "@prisma/client";
import Head from "next/head";
import { env } from "~/env.mjs";

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
  const isEventConfirmed = event.adminStatus !== events_admin_status.awaiting;

  let subtitle: string;
  let description: JSX.Element;
  let image: JSX.Element;

  if (isEventConfirmed) {
    image = (
      <Image
        src="/images/on-demand/confirmation-image.webp"
        alt="Event Image"
        width={482}
        height={282}
        className="tw-rounded-sm sm:tw-rounded-none"
      />
    );
    subtitle = "Thank You For Your Purchase";
    description = (
      <>
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-flex tw-items-center">
            Event ID
            <span className="tw-font-bold">&nbsp;#{event.eventNumber}</span>
          </div>
          <div>
            We’re excited for your event! Within 24 hours you will receive two emails with the
            following subjects from<span className="tw-font-bold">&nbsp;info@bookhipstr.com</span>{" "}
            at the email you booked with:
          </div>
        </div>
        {env.NEXT_PUBLIC_INVOICES_ENABLED === "true" ? (
          <>
            <ul>
              <li>- [Action Required] Hipstr Event Confirmation + Next Steps</li>
              <li>- Hipstr Booth Invoice</li>
            </ul>
            <div>
              For the next steps, please click the <span className="tw-font-bold">SIGN UP</span>{" "}
              button below to create your Hipstr account and start planning your event!
            </div>
            <button
              className="tw-w-full tw-border-gray-300 tw-uppercase tw-bg-primary tw-rounded-md tw-block tw-py-2 tw-px-5 tw-font-normal tw-text-white"
              onClick={() => router.push(`/signup?token=${result.event.signUpToken}`)}
            >
              Sign Up
            </button>
            <div>
              *If you do not receive the emails above, please check your Spam folder. If you require
              any assistance with your event going forward, please log in to the Hipstr portal and
              contact us there. We’ll be happy to assist.
            </div>
          </>
        ) : (
          <>
            <div>
              If you do not receive it in that timeframe, please
              <span className="tw-font-bold">&nbsp;check your spam</span> folder and mark it as not
              spam and add us to your safe senders list so you will receive our communications going
              forward.
            </div>
            <div>
              If you still don’t see the email please reach out to
              <span className="tw-font-bold">&nbsp;admin@bookhipstr.com&nbsp;</span>and let us know
              your
              <span className="tw-font-bold">&nbsp;Event ID&nbsp;</span>and we will be happy to
              assist you.
            </div>
          </>
        )}
      </>
    );
  } else {
    image = (
      <Image
        src="/images/on-demand/almost-there.webp"
        alt="Event Image"
        width={482}
        height={282}
        className="tw-rounded-sm sm:tw-rounded-none"
      />
    );
    subtitle = "Almost there!";
    description = (
      <div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-flex tw-items-center">
          We have all the information needed for your Booth.
        </div>
        <div>
          <span className="tw-font-bold">We&apos;ll confirm your booth within 48 hours.&nbsp;</span>
          Please check your email inbox to receive more information.
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <div className="tw-flex tw-pb-9 sm:tw-min-h-[600px]">
        <div className="tw-flex tw-flex-col tw-items-center tw-mx-auto tw-mt-3    sm:tw-m-auto">
          <div className="tw-flex">{image}</div>
          <h2 className="tw-font-montserrat tw-font-extrabold tw-text-primary tw-mt-8 tw-mb-3 tw-text-2xl    sm:tw-text-3xl sm:tw-font-bold">
            {subtitle}
          </h2>
          <div className="tw-flex tw-flex-col tw-gap-6 tw-items-center tw-max-w-[558px] tw-text-center tw-font-light    sm:tw-font-normal">
            {description}
          </div>
        </div>
      </div>
    </>
  );
};

Confirmation.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default Confirmation;
