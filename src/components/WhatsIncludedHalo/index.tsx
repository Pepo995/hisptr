"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FastrLogoWhite from "@images/home/fastr-logo-white.webp";

import Image from "next/image";
import { useRef, useState } from "react";
import PlayIcon from "./PlayIcon";

const WhatsIncludedHalo = ({
  items,
  customText,
}: {
  items: string[];
  getPricingLink?: string;
  customText?: string;
  showIcons?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        await videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="tw-flex min-[1100px]:tw-flex-row tw-flex-col min-[1100px]:tw-items-center tw-w-full tw-bg-primary tw-text-white min-[1100px]:tw-h-full 2xl:tw-ps-64 md:tw-px-16 min-[1300px]:tw-px-24 tw-px-4 min-[1100px]:tw-py-8 tw-py-6">
      <h3 className="tw-order-1 min-[1100px]:tw-hidden tw-inline-block tw-text-4xl tw-font-medium min-[1100px]:tw-mb-7 tw-mb-3">
        What&apos;s included
      </h3>

      <div className="tw-order-3 min-[1100px]:tw-order-1 min-[1100px]:tw-w-1/2">
        <h3 className="tw-hidden min-[1100px]:tw-inline-block tw-text-6xl tw-font-medium min-[1100px]:tw-mb-7 tw-mb-3">
          What&apos;s included
        </h3>

        {customText && <p className="tw-my-3 sm:tw-text-lg tw-text-xs -tw-mt-3">{customText}</p>}

        <div className="min-[1100px]:tw-grid min-[1100px]:tw-grid-cols-2 tw-flex tw-flex-col tw-gap-3 tw-items-start tw-justify-between min-[1100px]:tw-justify-start">
          {items.map((item, index) => (
            <div
              key={index}
              className="tw-flex tw-gap-3 tw-grow tw-shrink-0 tw-mr-3 tw-items-center"
            >
              <Icon
                icon="icon-park-outline:check-one"
                color="white"
                width={18}
                height={18}
                className="min-[1100px]:tw-w-5 min-[1100px]:tw-h-5 tw-w-6 tw-h-6"
              />

              <p className="tw-text-lg tw-text-white">{item}</p>
            </div>
          ))}
        </div>

        <div className="tw-flex tw-items-center tw-gap-5 lg:tw-mt-8 min-[1100px]:tw-mt-10 tw-mt-10 tw-px-3 md:tw-px-0">
          <Link
            className="custom-btn9 tw-w-auto tw-uppercase ubuntu tw-font-bold tw-rounded-lg tw-text-lg tw-h-full tw-px-10 tw-py-4 tw-mb-0"
            href="/book-now"
          >
            <p className="tw-text-primary">Get pricing</p>
          </Link>

          <div>
            <Image src={FastrLogoWhite} alt="fastr-logo" width={42} height={20} />

            <p className="min-[1100px]:tw-text-[10px] tw-text-[8px] tw-font-GoodHeadlinePro tw-text-white">
              Book in 2 minutes
            </p>
          </div>
        </div>
      </div>

      <div className="tw-order-2 min-[1100px]:tw-pl-5 min-[1100px]:tw-py-9 tw-py-6 min-[1100px]:tw-w-1/2 tw-flex tw-justify-center tw-items-center">
        <div className="tw-relative">
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            className="tw-relative z-0"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls
            poster="/video-image.webp"
          >
            <source src="/hipstr-halo.webm" type="video/webm" />
            <source src="/hipstr-halo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <>
              <div className="tw-absolute tw-top-0 tw-right-0 tw-bottom-0 tw-left-0 tw-bg-black tw-opacity-50" />

              <button
                onClick={togglePlayPause}
                className="custom-btn9 tw-flex tw-gap-2 tw-items-center tw-absolute tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-uppercase ubuntu tw-font-bold tw-rounded-full tw-text-lg tw-w-auto tw-h-auto"
                style={{ zIndex: 10 }}
              >
                <div className="tw-w-8 tw-h-8">
                  <PlayIcon />
                </div>
                <p>See what&apos;s included</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsIncludedHalo;
