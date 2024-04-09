import BigOption from "@components/options/BigOption";
import { type NextPageWithLayout } from "@pages/_app";
import React, { type ReactElement } from "react";

import PersonalEvent from "@images/personal-event.webp";
import CorporateEvent from "@images/corp-mobile.webp";
import CorporateEventDesktop from "@images/corp-desktop.webp";

import localFont from "next/font/local";
import VisitorHeader from "@components/VisitorHeader/VisitorHeader";
import clsx from "clsx";
import Head from "next/head";

const pageFont = localFont({
  src: [
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-bold.ttf",
      weight: "600",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-news.otf",
      weight: "500",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro.otf",
      weight: "400",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-light.otf",
      weight: "200",
    },
  ],
});

const BookNow: NextPageWithLayout = () => (
  <div>
    <Head>
      <meta name="robots" content="noindex,follow" />
    </Head>

    <VisitorHeader />

    <div
      className={clsx(
        "tw-flex tw-flex-col tw-h-[calc(100vh_-_73px)] sm:tw-flex-row",
        pageFont.className,
      )}
    >
      <BigOption
        image={PersonalEvent}
        imageMobile={PersonalEvent}
        text="PLANNING A PERSONAL EVENT?"
        url="/book-now/personal/step-1"
        alt="Image of a personal event"
        description="If you're planning your upcoming wedding, birthday, or any other private party."
      />

      <BigOption
        image={CorporateEventDesktop}
        imageMobile={CorporateEvent}
        text="PLANNING A CORPORATE EVENT?"
        url="/book-now/corporate"
        alt="Image of a corporate event"
        bgTextBlack
        description="If you're planning your next brand activation, marketing event, company party, holiday party , or convention..."
      />
    </div>
  </div>
);

BookNow.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default BookNow;
