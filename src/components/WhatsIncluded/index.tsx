"use client";
import Link from "next/link";
import Ratings1 from "@images/ratings/theknotbestofweddingshaloffame.webp";
import Ratings2 from "@images/ratings/theknotbestofweddings.webp";
import Ratings3 from "@images/ratings/threebestrated.webp";
import { Icon } from "@iconify/react";

import Image from "next/image";

const WhatsIncluded = ({
  items,
  customText,
  getPricingLink = "/contact-us",
  showIcons = false,
}: {
  items: string[];
  getPricingLink?: string;
  customText?: string;
  showIcons?: boolean;
}) => (
  <div className="tw-flex tw-items-center md:tw-flex-row tw-flex-col md:tw-max-h-[400px]">
    <div className="md:tw-w-3/4 tw-w-full tw-bg-primary tw-text-white md:tw-h-full">
      <div className="tw-w-11/12 tw-mx-auto md:tw-pl-5 md:tw-py-9 tw-py-6">
        <h3 className="tw-text-2xl md:tw-mb-7 tw-mb-3">WHAT’S INCLUDED</h3>

        {customText && <p className="tw-my-3 sm:tw-text-lg tw-text-xs -tw-mt-3">{customText}</p>}

        <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between md:tw-justify-start">
          {items.map((item, index) => (
            <div
              key={index}
              className="tw-w-[46%] tw-grow tw-shrink-0 tw-mr-3 tw-flex tw-items-start md:tw-gap-x-px tw-gap-x-1"
            >
              <Icon
                icon="material-symbols:check"
                color="white"
                width={22}
                height={22}
                className="tw-hidden md:tw-block"
              />

              <Icon
                icon="fa-solid:check"
                color="white"
                width={10}
                height={10}
                className="tw-block md:tw-hidden tw-mt-px"
              />

              <p className="md:tw-text-lg sm:tw-text-sm tw-text-xs tw-text-white">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Icon
      icon="teenyicons:right-solid"
      color="#fd6f6e"
      height={50}
      width={50}
      className="-tw-ml-5 md:tw-block tw-hidden"
    />

    <Icon
      icon="oi:caret-bottom"
      color="#fd6f6e"
      height={50}
      width={50}
      className="-tw-mt-5 md:tw-hidden tw-block tw-self-baseline tw-ml-10"
    />

    <div
      style={showIcons ? { marginTop: "auto" } : { marginTop: 0 }}
      className="md:tw-w-1/4 tw-w-full tw-bg-white tw-flex md:tw-flex-col tw-flex-row md:tw-justify-around md:tw-h-full tw-h-1/5 tw-items-center md:tw-px-5 md:tw-py-5 tw-pb-5 tw-px-3"
    >
      <Link href={getPricingLink}>
        <button
          className="custom-btn tw-mb-5"
          style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
        >
          {getPricingLink == "/contact-us" ? "CONTACT US" : "GET PRICING"}
        </button>
      </Link>

      {showIcons && (
        <div className="tw-flex tw-flex-col tw-items-center md:tw-ml-0 tw-ml-3 ">
          <p className="tw-text-black tw-text-center tw-text-sm tw-uppercase tw-mb-3">
            Trusted By Great Companies & Great People
          </p>

          <div className="tw-flex">
            <Image
              width={50}
              height={50}
              alt="the knot best of weddings hall of fame"
              src={Ratings1.src}
            />

            <Image
              width={50}
              height={50}
              alt="the knot best of weddings hall of fame"
              src={Ratings2.src}
            />

            <Image
              width={50}
              height={50}
              alt="the knot best of weddings hall of fame"
              src={Ratings3.src}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default WhatsIncluded;
