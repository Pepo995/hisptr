"use client";

import HomeHeader from "@components/HomeHeader";
import ContactUsBanner from "@images/pages/contact-us/contact-us-banner.webp";
import Link from "next/link";
import Image from "next/image";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import ContactUsForm from "@components/ContactUsForm";
import { ToastContainer } from "react-toastify";
import { env } from "~/env.mjs";
import TrpcProvider from "@components/TrpcProvider";

const recaptchaKey = env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const ContactUsLayout = ({ className }: { className: string }) => {
  return (
    <div className="tw-bg-black">
      <HomeHeader />

      <div className="md:tw-h-[500px] tw-min-h-[230px] tw-w-full tw-relative">
        <Image
          src={ContactUsBanner.src}
          alt="first-bannr"
          fill
          className="tw-relative tw-top-0 tw-left-0 tw-object-cover"
        />

        <div className="md:tw-absolute tw-relative md:tw-bottom-0 tw-w-full md:tw-bg-black/50 tw-bg-black md:tw-py-6 tw-py-3">
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-gap-x-7 md:tw-w-5/6 tw-w-11/12 tw-mx-auto tw-text-white">
            <div className={className}>
              <h5 className="md:tw-text-5xl tw-text-2xl">Ready to talk Now?</h5>

              <p className="md:tw-text-xl tw-text-[10px] tw-font-thin">
                <Link
                  href="https://calendly.com/bookhipstr"
                  className="md:tw-text-primary md:tw-font-bold md:tw-underline"
                >
                  Schedule a call
                </Link>{" "}
                with us to start your event planning process.
              </p>
            </div>

            <Link href="https://calendly.com/bookhipstr" className="tw-z-10">
              <button
                style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
                className="custom-btn md:tw-text-xl tw-text-xs ubuntu tw-min-h-fit tw-h-fit tw-rounded-lg tw-font-bold"
              >
                SCHEDULE A CALL
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className={`${className} tw-w-11/12 tw-mx-auto tw-py-11`}>
        <h3 className="tw-text-3xl tw-text-white tw-text-center tw-font-thin tw-mb-9">
          Contact Us
        </h3>
        <TrpcProvider>
          <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey ?? ""}>
            <ContactUsForm className={className} />

            <ToastContainer newestOnTop />
          </GoogleReCaptchaProvider>
        </TrpcProvider>
      </div>
    </div>
  );
};

export default ContactUsLayout;
