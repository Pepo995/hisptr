import HomeHeader from "@components/HomeHeader";
import Footer from "@components/Footer";
import Reviews from "@components/Reviews";
import ServiceCard from "@components/ServiceCards";

import Halo1 from "@images/pages/halo/Halo-1.webp";
import Halo12 from "@images/pages/halo/Halo-1-2.webp";
import Halo13 from "@images/pages/halo/Halo-1-3.webp";
import Halo14 from "@images/pages/halo/Halo-1-4.webp";
import Halo2 from "@images/pages/halo/Halo-2.webp";
import Halo22 from "@images/pages/halo/Halo-2-2.webp";
import Halo23 from "@images/pages/halo/Halo-2-3.webp";
import Halo3 from "@images/pages/halo/Halo-3.webp";
import Halo32 from "@images/pages/halo/Halo-3-2.webp";
import Halo33 from "@images/pages/halo/Halo-3-3.webp";
import FastrLogo from "@images/home/fastr-logo.webp";
import BestWeddingBadge from "@images/home/best-weddings-badge.png";
import GoogleReviews from "@images/home/google-reviews-grayscale.webp";
import ThreeBestRated from "@images/home/three-best-rated.webp";
import Link from "next/link";
import localFont from "next/font/local";

import type { Metadata } from "next/types";
import { BASE_URL } from "@constants/url";
import ServiceBannerHalo from "@components/ServiceBannerHalo";
import BannerBar from "@components/BannerBar";
import Image from "next/image";
import FAQSectionHalo from "@components/FAQSectionHalo";
import WhatsIncludedHalo from "@components/WhatsIncludedHalo";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Hipstr Halo Experience | Photo Booth Bundle | Hipstr",
  description:
    "Not your average photo booth rental, it’s an experience. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
  alternates: {
    canonical: `${BASE_URL}/halo`,
  },
  openGraph: {
    title: "Hipstr Halo Experience | Photo Booth Bundle | Hipstr",
    description:
      "Not your average photo booth rental, it’s an experience. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    url: "https://bookhipstr.com/halo",
    siteName: "Hipstr",
    images: [
      {
        url: `${process.env.VERCEL_URL}/we-bring-the-party.png`,
        width: 2210,
        height: 1244,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const WhatsIncludedItems = [
  "OPEN-AIR PHOTO BOOTH SETUP",
  "GIF + BOOMERANG CREATION",
  "INSTANT SOCIAL SHARING",
  "HIPSTR HOST",
  "UNLIMITED PRINTS",
  "YOUR CHOICE OF PRINT SIZE",
  "YOUR CHOICE OF BACKDROP",
  "ACCESS TO YOUR ONLINE GALLERY",
  "CUSTOM PHOTO + GIF OVERLAY",
  "UP TO 4 HOURS OF EVENT TIME",
  "PHOTO ALBUM",
];

const serviceList = [
  {
    images: [Halo1, Halo12, Halo13, Halo14],
    title: "Create unforgettable memories with your friends and family",
    titleContent: (
      <>
        <h3 className="tw-font-medium xl:tw-text-[56px] lg:tw-text-5xl md:tw-text-4xl tw-text-[44px] tw-leading-none md:tw-leading-[50px] tw-inline">
          Create unforgettable memories with your friends and family
        </h3>
      </>
    ),
    description: (
      <div>
        <p className="tw-mb-8 tw-text-lg md:tw-text-xl">
          We’re here for a good time <strong>and</strong> a long time. All our packages come
          standard with <strong>4 hours</strong> of event time. That’s 4 hours of you and your
          guests in front of the booth, no set-up, no breakdown, no travel time.
        </p>

        <p className="tw-text-lg md:tw-text-xl">
          We offer <strong>unlimited</strong> prints, enough for everyone... you, your mom, even
          your best friend’s last-minute plus one.
        </p>

        <div className="tw-flex tw-items-center tw-gap-3 lg:tw-mt-8 tw-mt-5">
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
    ),
  },
  {
    images: [Halo2, Halo22, Halo23],
    title: "Big, big fun.",
    titleContent: (
      <div className="tw-flex tw-flex-col tw-gap-3">
        <h3 className="tw-font-medium xl:tw-text-[56px] lg:tw-text-5xl md:tw-text-4xl tw-text-[44px] tw-leading-none md:tw-leading-[50px] tw-inline">
          Big, big fun.{" "}
        </h3>
        <h4 className="tw-text-2xl tw-text-md">Itty-bitty footprint.</h4>
      </div>
    ),
    description: (
      <div>
        <div className="tw-mb-8">
          <p className="md:tw-mb-8 md:tw-block tw-inline tw-text-lg md:tw-text-xl">
            A massive party packed into a small space (8’ x 8’). Our Halo package blows traditional
            photo booth companies out of the water.{" "}
          </p>

          <p className="tw-mb-8 md:tw-block tw-inline tw-text-lg md:tw-text-xl">
            Our open set-up can fit up to 10 people at once so you can cheese it up with the whole
            squad.
          </p>
        </div>

        <div className="tw-flex tw-items-center tw-gap-3 lg:tw-mt-8 tw-mt-5">
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
    ),
  },
  {
    images: [Halo3, Halo32, Halo33],
    title: "Model, make a face, or macarena",
    titleContent: (
      <div>
        <h3 className="tw-font-medium xl:tw-text-[56px] lg:tw-text-5xl md:tw-text-4xl tw-text-[44px] tw-leading-none md:tw-leading-[50px] tw-inline">
          Model, make a face, or macarena. You do you boo-boo.
        </h3>
      </div>
    ),
    description: (
      <div>
        <p className="tw-text-lg md:tw-text-xl">
          Photos are classic, but with the Hipstr Halo Package you get it all. Jump in front of your
          choice of backdrop and snap a pic, gif, or boomerang, and share <strong>instantly</strong>
          .
        </p>

        <div className="tw-flex tw-items-center tw-gap-3 lg:tw-mt-8 tw-mt-5">
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
    ),
  },
];

const FAQList = [
  {
    question: "How much does the Halo Package cost?",
    answer:
      "The halo package is our most cost-effective package. While prices will vary based on date/location it still includes unlimited prints, custom backdrop, instant social sharing, and 4 hours of event time. There’s a reason we call it the ultimate photo booth rental.",
  },
  {
    question: "What can I customize on my photo printout?",
    answer:
      "The sky is the limit! well... not really but you can customize almost everything. Choose one of our layout templates and then the rest is up to you. Frame, colors, text, image overlays, we’ll even match your invitation, theme, or company branding.",
  },
  {
    question: "Is 4 hours the maximum amount of time available?",
    answer:
      "Up to 4 hours come standard with all our packages, but you can always extend that amount of time for an additional fee. Party on garth!",
  },
];

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

const Halo = () => {
  return (
    <div className={pageFont.className}>
      <BannerBar />

      <HomeHeader />

      <ServiceBannerHalo />

      <Reviews className={pageFont.className} />

      <div className="tw-flex tw-flex-col md:tw-flex-row tw-w-full tw-flex-wrap tw-mx-auto">
        <div>
          <ServiceCard
            images={serviceList[0].images}
            title={serviceList[0].title}
            titleContent={serviceList[0].titleContent}
            description={serviceList[0].description}
            positionRight={false}
          />

          <div className="tw-flex md:tw-hidden tw-px-20 tw-py-3 tw-bg-white tw-w-full tw-justify-center tw-gap-8">
            <Image src={GoogleReviews} alt="googleReviews" width={125} height={61} />

            <Image src={ThreeBestRated} alt="threeBestRated" width={70} height={70} />

            <Image src={BestWeddingBadge} alt="bestWeddingBadge" width={80} height={80} />
          </div>
        </div>

        <WhatsIncludedHalo getPricingLink="/book-now" items={WhatsIncludedItems} showIcons />

        <ServiceCard
          images={serviceList[1].images}
          title={serviceList[1].title}
          titleContent={serviceList[1].titleContent}
          description={serviceList[1].description}
          positionRight={true}
        />

        <ServiceCard
          images={serviceList[2].images}
          title={serviceList[2].title}
          titleContent={serviceList[2].titleContent}
          description={serviceList[2].description}
          positionRight={false}
        />
      </div>

      <FAQSectionHalo questions={FAQList} className={pageFont.className} />

      <Footer />
    </div>
  );
};

export default Halo;
