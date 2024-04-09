import HomeHeader from "@components/HomeHeader";
import ServiceBanner from "@components/ServiceBanner";
import Footer from "@components/Footer";
import CustomBanner from "@images/pages/custom-events/custom-events-banner.webp";
import CustomEventsTitle from "@images/pages/custom-events/CUSTOM-EVENTS-title.webp";
import Custom1 from "@images/pages/custom-events/custom1.webp";
import Custom2 from "@images/pages/custom-events/custom2.webp";
import Custom3 from "@images/pages/custom-events/custom3.webp";

import ServiceCard from "@components/ServiceCards";

import FAQSection from "@components/FAQSection";
import Link from "next/link";
import localFont from "next/font/local";

import type { Metadata } from "next/types";
import WhatsIncluded from "@components/WhatsIncluded";
import { BASE_URL } from "@constants/url";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Hipstr Custom Events | Activations | Event Marketing",
  description:
    "Unique needs require unique solutions, our custom packages cater to any and all levels of event customization.",
  alternates: {
    canonical: `${BASE_URL}/custom-events`,
  },
  openGraph: {
    title: "Hipstr Custom Events | Activations | Event Marketing",
    description:
      "Unique needs require unique solutions, our custom packages cater to any and all levels of event customization.",
    url: "https://bookhipstr.com/custom-events",
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
  "CUSTOM BOOTH FITTINGS",
  "MULTIPLE LOCATIONS",
  "HIPSTR HOST",
  "INSTANT SOCIAL SHARING",
  "CUSTOM GIF OVERLAYS",
  "ONLINE GALLERY ACCESS",
  "BACKDROPS THAT BOGGLE THE MIND",
  "POST-EVENT METRICS",
  "RAINBOWS, UNICORNS, TRULY ANYTHING!",
];

const serviceList = [
  {
    image: Custom1,
    title: "Branded. Everything.",
    titleContent: (
      <div>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md md:tw-block tw-inline tw-capitalize">
          Branded.{" "}
        </h3>

        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md md:tw-block tw-inline tw-capitalize">
          Everything.
        </h3>
      </div>
    ),
    description: (
      <div>
        <p className="tw-mb-8">
          Your logo, your colors, your brand on everything. We create custom microsites, start
          screens, social media analytics, and of course photo overlays.
        </p>

        <Link href="/contact-us" className="tw-mb-auto md:tw-mt-0 tw-mt-5 tw-z-10">
          <button
            style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            className="custom-btn tw-min-h-fit tw-h-fit tw-w-fit"
          >
            CONTACT US
          </button>
        </Link>
      </div>
    ),
  },
  {
    image: Custom2,
    title: "Get crazy creative.",
    titleContent: (
      <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize">
        Get crazy creative.
      </h3>
    ),
    description: (
      <div>
        <p className="tw-mb-8">
          #nofilter is so overrated. We love fabulous filters, dynamic digital props, and outrageous
          overlays. Why compromise when you can customize?
        </p>

        <Link href="/contact-us">
          <button
            style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            className="custom-btn tw-min-h-fit tw-h-fit tw-w-fit tw-rounded-lg"
          >
            CONTACT US
          </button>
        </Link>
      </div>
    ),
  },
  {
    image: Custom3,
    title: "We hate limits, don’t you?",
    titleContent: (
      <div>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md md:tw-block tw-inline tw-capitalize">
          We hate limits,{" "}
        </h3>

        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md md:tw-block tw-inline tw-capitalize">
          don’t you?
        </h3>
      </div>
    ),
    description: (
      <p className="tw-mb-8">
        We specialize in the unique, outrageous, and insane. Whether you have an incredible idea
        already, or want to work with our world-class creative team to design something for you,
        we’ll showcase your brand in a way that will have everyone talking.
      </p>
    ),
  },
];

const FAQList = [
  {
    question: "I have a really wild idea, are you sure you can do it?",
    answer:
      "Wild is our middle name. (actually, it’s George)... anyway... Times Square billboards, custom fabrications, mountains of flowers, parking lot pillow fights, champagne showers, and tunnels of light... been there, done that, can’t wait to do it again.",
  },
  {
    question: "How much do custom events cost?",
    answer:
      "Much like snowflakes, no two custom events are alike. Schedule a call with one of our event experts so we can get a sense of your idea, budget, and timeline.",
  },
  {
    question: "Can I get multiple booths in multiple cities for the same date?",
    answer:
      "Pitbull isn’t the only Mr. Worldwide. We’ve done multi-city, multi-day activations before and we’re experts in massive activations.",
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

const CustomEvents = () => (
  <div className={pageFont.className}>
    <HomeHeader />

    <ServiceBanner
      imageSrc={CustomBanner.src}
      title="CUSTOM EVENTS"
      titleSize="tw-text-7xl"
      titleImageSrc={CustomEventsTitle.src}
      descriptionTitle="Luxury Lies in the Details."
      content="You have specialized needs, we have specialized solutions, our custom packages cater to any and all levels of event customization. Whether you need custom booths, backdrops, animations, or printouts, we’ll make your dreams a reality"
    />

    <WhatsIncluded
      items={WhatsIncludedItems}
      customText="All our custom event packages are completely bespoke, but here are some things that we've done in the past:"
      showIcons
    />

    <div className="tw-flex tw-flex-col md:tw-flex-row tw-w-full tw-flex-wrap tw-mx-auto ">
      {serviceList.map(({ image, title, titleContent, description }, index) => (
        <ServiceCard
          images={[image]}
          key={index}
          title={title}
          titleContent={titleContent}
          description={description}
          positionRight={index % 2 === 0}
        />
      ))}
    </div>

    <FAQSection questions={FAQList} />
    <Footer />
  </div>
);

export default CustomEvents;
