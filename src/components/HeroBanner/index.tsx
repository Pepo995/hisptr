"use client";
import HomeBanner from "@images/home/home-banner.webp";
import Image from "next/image";
import FastrLogo from "@images/home/fastr-logo.webp";
import FastrLogoWhite from "@images/home/fastr-logo-white.webp";
import BestWeddingBadge from "@images/home/best-weddings-badge.png";
import { useIsMobile } from "@hooks/useIsMobile";
import Link from "next/link";

import { Icon } from "@iconify/react";

const HeroBanner = ({ className }: { className: string }) => {
  const isMobile = useIsMobile();
  return (
    <div className="tw-relative tw-w-full tw-overflow-hidden md:tw-relative md:tw-overflow-hidden xl:tw-h-[38rem] xl:tw-max-h-[600px] 2xl:tw-h-[70rem] 2xl:tw-max-h-[746px]">
      <div className="tw-relative tw-left-0 tw-w-full tw-overflow-hidden md:tw-pt-[56.25%] md:tw-h-[56.25%]">
        <Image
          src={HomeBanner}
          alt="star"
          className="tw-absolute tw-top-0 tw-left-0 tw-w-auto tw-h-full xl:tw-w-auto tw-object-cover home-image-size"
        />
        <div className="md:tw-absolute md:tw-top-0 md:tw-right-0 md:tw-w-1/2 md:tw-h-full md:tw-bg-white"></div>
        <div className="md:tw-absolute md:tw-top-0 md:tw-right-1/2 md:tw-w-8 md:tw-h-full md:tw-bg-gradient-to-r md:tw-from-transparent md:tw-to-white"></div>
        <div className="md:tw-absolute md:tw-top-0 md:tw-bottom-0 md:tw-right-0 md:tw-w-1/2 tw-h-[550px] tw-flex md:tw-justify-center md:tw-mt-20 lg:tw-items-center md:tw-px-16 tw-ps-6 tw-pe-20">
          <div className="tw-relative md:tw-top-0 md:tw-static tw-flex tw-flex-col tw-justify-end md:tw-justify-start tw-mb-2 md:tw-mb-0">
            <h1 className="xl:tw-text-6xl md:tw-text-5xl tw-text-3xl md:tw-text-black tw-text-white tw-font-medium">
              Capture unforgettable moments with Hipstr
              <span className="tw-text-nowrap tw-inline-flex">
                <Icon icon="ri:registered-line" className="tw-inline tw-align-bottom" width={14} />
              </span>
            </h1>

            <p className="md:tw-text-black tw-text-white tw-mt-3 xl:tw-text-3xl lg:tw-text-2xl md:tw-text-xl tw-text-lg tw-font-normal">
              Elevate your events with our premium photo booth experiences
            </p>

            <div className="tw-flex tw-items-center tw-gap-3 lg:tw-mt-8 tw-mt-3">
              <Link
                className="custom-btn tw-w-auto tw-uppercase ubuntu tw-font-bold tw-rounded-lg tw-text-lg tw-h-full tw-px-10 tw-py-4 tw-mb-0"
                href="/book-now"
              >
                Get pricing
              </Link>

              <div>
                <Image src={isMobile ? FastrLogoWhite : FastrLogo} alt="fastr-logo" width={42} />

                <p
                  className={`${className} xl:tw-text-[10px] tw-text-[8px] tw-font-medium tw-font-GoodHeadlinePro tw-text-white md:tw-text-black`}
                >
                  Book in 2 minutes
                </p>
              </div>
            </div>

            <div className="lg:tw-flex tw-gap-9 xl:tw-mt-11 tw-mt-6 tw-hidden tw-justify-between">
              <div className="tw-flex tw-flex-col tw-items-center">
                <p
                  className={`${className} tw-font-GoodHeadlinePro tw-font-bold xl:tw-text-4xl tw-text-3xl`}
                >
                  1,000+
                </p>

                <p
                  className={`${className} tw-font-GoodHeadlinePro tw-font-medium xl:tw-text-lg tw-text-xs`}
                >
                  5-Star reviews
                </p>
              </div>

              <div className="tw-flex tw-flex-col tw-items-center">
                <p
                  className={`${className} tw-font-GoodHeadlinePro tw-font-bold xl:tw-text-4xl tw-text-3xl`}
                >
                  800K+
                </p>

                <p
                  className={`${className} tw-font-GoodHeadlinePro tw-font-medium xl:tw-text-lg tw-text-xs`}
                >
                  Delighted guests
                </p>
              </div>

              <div className="tw-flex tw-flex-col tw-items-center">
                <p
                  className={`${className} tw-font-GoodHeadlinePro tw-font-bold xl:tw-text-4xl tw-text-3xl`}
                >
                  3 MILLION
                </p>

                <p
                  className={`${className} tw-font-GoodHeadlinePro tw-font-medium xl:tw-text-lg tw-text-xs`}
                >
                  Moments captured
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Image
        src={BestWeddingBadge}
        alt="bestWeddingBadge"
        width={100}
        height={100}
        className="tw-absolute tw-top-0 lg:tw-left-[4%] md:tw-right-[52%] tw-right-[10%] lg:tw-w-24 lg:tw-h-24 md:tw-w-16 md:tw-h-16 sm:tw-w-24 sm:tw-h-24 tw-w-16 tw-h-16"
      />

      <p className="tw-hidden lg:tw-block tw-absolute tw-bottom-5 tw-left-44 tw-font-medium tw-text-xl tw-text-white">
        1 of our 5,626+ happy clients
      </p>

      <div className="tw-flex tw-gap-9 lg:tw-hidden tw-py-7 md:tw-px-24 tw-px-4 tw-justify-between">
        <div className="tw-flex tw-flex-col tw-items-center">
          <p
            className={`${className} tw-font-GoodHeadlinePro tw-font-bold md:tw-text-3xl tw-text-2xl`}
          >
            1,000+
          </p>

          <p
            className={`${className} tw-font-GoodHeadlinePro tw-font-medium md:tw-text-lg tw-text-xs`}
          >
            5-Star reviews
          </p>
        </div>

        <div className="tw-flex tw-flex-col tw-items-center">
          <p
            className={`${className} tw-font-GoodHeadlinePro tw-font-bold md:tw-text-3xl tw-text-2xl`}
          >
            800k+
          </p>

          <p
            className={`${className} tw-font-GoodHeadlinePro tw-font-medium md:tw-text-lg tw-text-xs`}
          >
            Delighted guests
          </p>
        </div>

        <div className="tw-flex tw-flex-col tw-items-center">
          <p
            className={`${className} tw-font-GoodHeadlinePro tw-font-bold md:tw-text-3xl tw-text-2xl`}
          >
            3 MILLION
          </p>

          <p
            className={`${className} tw-font-GoodHeadlinePro tw-font-medium md:tw-text-lg tw-text-xs`}
          >
            Moments captured
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
