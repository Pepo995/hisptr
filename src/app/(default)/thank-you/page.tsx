"use client";
import Footer from "@components/Footer";
import HomeHeader from "@components/HomeHeader";
import localFont from "next/font/local";
import { Icon } from "@iconify/react";

const pageFont = localFont({
  src: [
    {
      path: "../../../fontface/good-headline-pro/goodheadlinepro-bold.ttf",
      weight: "600",
    },
    {
      path: "../../../fontface/good-headline-pro/goodheadlinepro-news.otf",
      weight: "500",
    },
    {
      path: "../../../fontface/good-headline-pro/goodheadlinepro.otf",
      weight: "400",
    },
    {
      path: "../../../fontface/good-headline-pro/goodheadlinepro-light.otf",
      weight: "200",
    },
  ],
});

const ThankYou = () => {
  return (
    <div className="tw-bg-black ">
      <HomeHeader />

      <div
        className={`${pageFont.className} md:tw-py-28 tw-py-10 md:tw-h-min md:tw-mb-0 tw-mb-10 tw-flex tw-flex-col md:tw-justify-center tw-items-center tw-text-white tw-w-5/6 tw-mx-auto`}
      >
        <Icon
          icon="lucide:check-circle"
          color="#fd6f6e"
          width={150}
          height={150}
          className="tw-my-10 tw-hidden md:tw-block"
        />

        <Icon
          icon="lucide:check-circle"
          color="#fd6f6e"
          width={80}
          height={80}
          className="tw-my-5 tw-mt-10 tw-block md:tw-hidden"
        />

        <h3 className="md:tw-text-7xl tw-text-xl tw-font-bold tw-uppercase">Thank you!</h3>

        <div className="md:tw-my-10 tw-my-5 tw-text-center md:tw-text-2xl tw-text-sm md:tw-leading-loose md:tw-w-5/6 md:tw-mx-auto">
          <p>Your inquiry has been received; we’ll be in touch soon! </p>

          <p>
            Make sure to add{" "}
            <a href="mailto:info@bookhipstr.com">
              <span className="tw-text-primary">info@bookhipstr.com</span>
            </a>{" "}
            as a contact so we don’t end up in your Spam Folder!
          </p>

          <p>
            If you haven’t heard from us within 24 hours, please check your Spam Folder or schedule
            a call to connect with us.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThankYou;
