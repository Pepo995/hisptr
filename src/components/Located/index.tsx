import LocatedMap from "@images/home/located-map.webp";
import Background from "@images/home/location-background.webp";

import Image from "next/image";

const Located = ({ className }: { className: string }) => (
  <div
    className="md:tw-pt-9"
    style={{
      backgroundImage: `url(${Background.src})`,
      boxShadow: " 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    }}
  >
    <div className="tw-flex md:tw-flex-row tw-flex-col tw-relative tw-w-full md:tw-w-[95%] md:tw-ml-auto tw-items-center">
      <div className="md:tw-w-4/6 tw-w-full md:tw-m-11 tw-m-5 tw-px-5 md:tw-m-0 tw-text-white md:tw-text-left tw-text-center">
        <h2
          className={`${className} md:tw-text-4xl tw-text-2xl tw-font-medium tw-capitalize md:tw-mb-5 tw-mb-3`}
        >
          Our Locations
        </h2>

        <p className="md:tw-text-xl tw-text-sm tw-font-thin tw-uppercase ubuntu">
          City to countryside, coast to coast, Hipstr brings the ultimate photo
          booth and event media experiences to you.
        </p>
      </div>

      <Image
        src={LocatedMap.src}
        fill
        alt="located map"
        className="tw-relative tw-px-5 md:tw-px-0"
      />
    </div>
  </div>
);

export default Located;
