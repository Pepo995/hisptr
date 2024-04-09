"use client";
import Image from "next/image";
import Link from "next/link";
import BestWeddingBadge from "@images/home/best-weddings-badge.png";
import GoogleReviews from "@images/home/google-reviews-grayscale.webp";
import ThreeBestRated from "@images/home/three-best-rated.webp";

import HaloBanner from "@images/pages/halo/halo-banner.webp";

import FastrLogo from "@images/home/fastr-logo.webp";

const ServiceBannerHalo = () => (
  <div className="md:tw-w-full md:tw-relative md:tw-overflow-hidden md:tw-h-[25rem] md:tw-max-h-[480px] lg:tw-h-[30rem] lg:tw-max-h-[550px] xl:tw-h-[34rem] xl:tw-max-h-[580px] 2xl:tw-h-[50rem] 2xl:tw-max-h-[650px]">
    <div className="md:tw-relative md:tw-left-0 md:tw-w-full md:tw-overflow-hidden md:tw-pt-[56.25%] md:tw-h-[56.25%]">
      <div className="tw-relative md:tw-static tw-overflow-hidden sm:tw-h-[400px] tw-h-[284px]">
        <Image
          src={HaloBanner}
          alt="Halo Banner"
          fill
          className="tw-absolute -tw-top-10 xl:tw-left-[55%] md:tw-left-[50%] tw-w-full sm:tw-w-auto md:tw-h-auto xl:tw-h-[82%] md:tw-h-full tw-object-cover md:home-image-size"
        />
      </div>
      <div className="md:tw-absolute md:tw-top-0 md:tw-left-0 md:tw-w-1/2 md:tw-h-full md:tw-bg-white"></div>
      <div className="md:tw-absolute md:tw-top-0 md:tw-bottom-0 md:tw-left-0 md:tw-w-1/2 md:tw-h-[550px] tw-flex md:tw-justify-center md:tw-mt-3 xl:tw-items-center tw-py-8 md:tw-pt-2 2xl:tw-pt-20 lg:tw-pt-8 2xl:tw-ps-64 md:tw-px-16 lg:tw-px-24 tw-px-4">
        <div className=" md:tw-top-0 md:tw-static tw-flex tw-flex-col tw-justify-end md:tw-justify-start tw-mb-2 md:tw-mb-0">
          <div className="tw-flex tw-gap-2 tw-flex-col">
            <h1 className="tw-uppercase lg:tw-text-5xl tw-text-3xl tw-font-medium tw-text-primary">
              halo
            </h1>
            <h1 className="xl:tw-text-6xl lg:tw-text-5xl md:tw-text-4xl tw-text-[44px] tw-leading-none tw-text-black tw-font-medium">
              The ultimate photo booth package.
            </h1>
          </div>

          <p className="tw-text-black tw-mt-3 xl:tw-text-xl lg:tw-text-lg tw-text-base tw-font-normal">
            Our most popular option. The halo package boasts a sleek design, unlimited prints, 4
            hours of event time, gifs, boomerangs, and instant sharing, all in one low-cost package.
          </p>

          <div className="tw-flex tw-items-center tw-gap-3 lg:tw-mt-8 md:tw-mt-3 tw-mt-8">
            <Link
              className="custom-btn tw-w-auto tw-uppercase ubuntu tw-font-bold tw-rounded-lg tw-text-lg tw-h-full tw-px-10 tw-py-4 tw-mb-0"
              href="/book-now"
            >
              Get pricing
            </Link>

            <div>
              <Image src={FastrLogo} alt="fastr-logo" width={42} />

              <p className="xl:tw-text-[10px] tw-text-[8px] tw-font-bold tw-font-GoodHeadlinePro tw-text-black">
                Book in 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="tw-hidden lg:tw-flex tw-justify-between tw-items-center tw-gap-3 tw-px-6 tw-py-3 tw-absolute tw-bottom-0 md:tw-right-0 tw-bg-white tw-w-auto">
      <Image src={GoogleReviews} alt="googleReviews" className="tw-w-[124px] tw-h-[70px]" />

      <Image src={ThreeBestRated} alt="threeBestRated" width={85} height={85} />

      <Image src={BestWeddingBadge} alt="bestWeddingBadge" width={85} height={85} />
    </div>
  </div>
);

export default ServiceBannerHalo;
