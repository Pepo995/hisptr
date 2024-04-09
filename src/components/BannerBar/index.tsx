import Image from "next/image";
import FastrLogo from "@images/home/fastr-logo.webp";

const BannerBar = ({ className }: { className?: string }) => (
  <div className="ubuntu tw-z-20 banner-bar tw-py-3 tw-w-full tw-top-0 tw-left-0">
    <div
      className={`${className} tw-flex md:tw-flex-row tw-flex-col tw-h-full tw-items-center tw-justify-center tw-font-GoodHeadlinePro tw-gap-1 tw-w-[95%] lg:tw-text-base tw-text-xs tw-font-medium`}
    >
      <p>
        <span className="tw-font-bold">BIG NEWS! </span>
        <span>Instant booking is now available for our most popular</span>
      </p>

      <div className="tw-flex tw-gap-1 tw-items-center">
        <span>packages. Look for the</span>
        <div className="tw-flex tw-relative tw-w-[40px] md:tw-w-[50px] tw-h-[12px] md:tw-h-[15px]">
          <Image src={FastrLogo} alt="fastr-logo" fill sizes="(max-width: 639px) 40px, 50px" />
        </div>

        <p>
          badge to <span className="tw-font-bold">book in 2 minutes!</span>
        </p>
      </div>
    </div>
  </div>
);

export default BannerBar;
