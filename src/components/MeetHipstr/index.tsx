import Logo from "@images/logo/hipstr-logo.webp";
import Image from "next/image";

const MeetHipstr = () => (
  <div className="tw-bg-black tw-w-full md:tw-px-11 tw-p-3 md:tw-py-9">
    <div className="tw-flex md:tw-w-5/6 tw-w-11/12 tw-items-center tw-justify-center md:tw-gap-x-11 tw-gap-x-3 tw-mx-auto">
      <div className="tw-min-w-fit tw-flex tw-text-white tw-font-thin tw-justify-end tw-items-center">
        <h1 className="md:tw-text-5xl tw-text-md tw-font-thin md:tw-mr-3 tw-mr-1">
          Meet
          <span className="tw-sr-only">Hipstr</span>
        </h1>
        <Image
          src={Logo.src}
          alt="hipstr"
          width={148}
          height={48}
          className="tw-hidden md:tw-block"
        />
        <Image src={Logo.src} alt="hipstr" width={62} height={20} className="tw-block md:tw-hidden" />
      </div>

      <div className="tw-w-auto tw-border-l tw-border-white md:tw-pl-11 tw-pl-3">
        <p className="tw-text-white md:tw-text-xl tw-text-xs tw-font-thin tw-mb-0">
          Tired of tacky, under-developed and over-priced photo booths, we came up with a better way
          to bring the party. Hipstr specializes in delivering the most interactive and engaging
          photo & video activations across&nbsp;the&nbsp;US.
        </p>
      </div>
    </div>
  </div>
);

export default MeetHipstr;
