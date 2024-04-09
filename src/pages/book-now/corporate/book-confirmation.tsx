import React, { type ReactElement } from "react";
import VisitorLayout from "@components/layouts/VisitorLayout";
import { type NextPageWithLayout } from "@pages/_app";
import Image from "next/image";

import { PopupButton } from "react-calendly";
import Head from "next/head";

const Confirmation: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className="tw-flex tw-pb-9 sm:tw-min-h-[600px]">
        <div className="tw-flex tw-flex-col tw-items-center tw-mx-auto tw-mt-3    sm:tw-m-auto">
          <Image
            src="/images/on-demand/confirmation-corporate.webp"
            alt="Confirmation Image"
            fill={true}
            className="tw-object-cover tw-h-[348px] tw-w-[344px] tw-flex tw-static tw-rounded-lg    sm:tw-h-[282px] sm:tw-w-[482px] sm:tw-mx-12"
          />

          <h2 className="tw-font-montserrat tw-font-bold tw-text-primary tw-text-center tw-mt-8 tw-mb-3 tw-text-3xl tw-mx-6    sm:tw-text-[28px]">
            Thank you for reaching out to us!
          </h2>

          <div className="tw-flex tw-flex-col tw-gap-6 tw-items-center tw-max-w-[558px] tw-text-center tw-font-light tw-mb-12    sm:tw-font-normal">
            <div className="tw-flex tw-flex-col tw-items-center">
              <div>
                We&apos;re excited to help
                <span className="tw-font-bold">&nbsp;bring your dream experience&nbsp;</span>
                to life. We&apos;ll reach out to you via email shortly with more details. In the
                meantime, please click the button below to choose a convenient time for a call.
              </div>
            </div>
          </div>

          <div className="tw-w-full sm:tw-mb-0 tw-mb-10">
            {document && document.getElementById("__next") !== undefined && (
              <PopupButton
                url="https://calendly.com/bookhipstr/let-s-chat-about-your-corporate-event"
                /*
                 * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
                 * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
                 */
                rootElement={document.getElementById("__next")!}
                text="Schedule a call"
                className="custom-btn3 tw-w-full"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Confirmation.getLayout = (page: ReactElement) => <VisitorLayout>{page}</VisitorLayout>;

export default Confirmation;
