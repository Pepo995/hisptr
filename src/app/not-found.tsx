import Logo from "@images/logo/hipstr-logo.webp";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

const pageFont = localFont({
  src: [
    {
      path: "../fontface/good-headline-pro/goodheadlinepro-bold.ttf",
      weight: "600",
    },
    {
      path: "../fontface/good-headline-pro/goodheadlinepro-news.otf",
      weight: "500",
    },
    {
      path: "../fontface/good-headline-pro/goodheadlinepro.otf",
      weight: "400",
    },
    {
      path: "../fontface/good-headline-pro/goodheadlinepro-light.otf",
      weight: "200",
    },
  ],
});

const NotFound = () => (
  <div className={`${pageFont.className} tw-h-screen tw-bg-[#F26F65]`}>
    <div className="tw-w-5/6 tw-mx-auto tw-flex tw-flex-col tw-justify-center tw-text-white tw-h-full tw-relative">
      <div className="lg:tw-text-9xl md:tw-text-7xl tw-text-6xl sm:tw-mb-20 md:tw-mb-16 tw-mb-28 tw-font-thin">
        <h2>
          <span className="tw-font-black">Good</span> news
        </h2>
        <h2>
          and <span className="tw-font-black">bad</span> news...
        </h2>
      </div>

      <div className="tw-w-10/12 tw-flex md:tw-flex-row tw-flex-col tw-gap-x-3 tw-gap-y-11 md:tw-gap-y-0 tw-justify-between md:tw-items-center md:tw-text-4xl tw-text-xl">
        <div>
          <p className="tw-mb-11 md:tw-mb-2">
            The <strong>bad</strong> news is this page is unavailable...
          </p>
          <p>
            The <strong>good</strong> news is you look fabulous.
          </p>
        </div>

        <Link href="/">
          <button className="ubuntu custom-btn8 hover:tw-bg-white hover:tw-text-primary tw-w-fit tw-h-min tw-min-h-min">
            BACK TO HOME PAGE
          </button>
        </Link>
      </div>
      <Image
        src={Logo}
        alt="hipstr"
        className="md:tw-h-10 tw-h-5 tw-w-auto tw-absolute tw-bottom-10 tw-right-0 tw-inset-auto"
        fill
      />
    </div>
  </div>
);

export default NotFound;
