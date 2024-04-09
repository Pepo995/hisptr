import HomeHeader from "@components/HomeHeader";
import ServiceBanner from "@components/ServiceBanner";
import Footer from "@components/Footer";
import MosaicBanner from "@images/pages/mosaic/mosaic-banner.webp";
import MosaicBannerTitle from "@images/pages/mosaic/MOSAIC.webp";
import Mosaic1 from "@images/pages/mosaic/mosaic1.webp";
import Mosaic2 from "@images/pages/mosaic/mosaic2.webp";

import WhatsIncluded from "@components/WhatsIncluded";
import ServiceCard from "@components/ServiceCards";

import FAQSection from "@components/FAQSection";
import Link from "next/link";
import localFont from "next/font/local";
import type { Metadata } from "next/types";
import { BASE_URL } from "@constants/url";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Hipstr Photo Mosaic Wall Experience | Hipstr",
  description:
    "Not your average event photo wall; we're an experience. Elevate your next event with an interactive photo wall rental and setup. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
  alternates: {
    canonical: `${BASE_URL}/mosaic`,
  },
  openGraph: {
    title: "Hipstr Photo Mosaic Wall Experience | Hipstr",
    description:
      "Not your average event photo wall; we're an experience. Elevate your next event with an interactive photo wall rental and setup. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    url: "https://bookhipstr.com/mosaic",
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
  "INSTANT SOCIAL SHARING",
  "ACCESS TO YOUR ONLINE GALLERY",
  "HIPSTR HOST",
  "CUSTOM PHOTO OVERLAY",
  "4 HOURS EVENT TIME. ALWAYS.",
  "SOCIAL MEDIA METRICS",
  "BEAUTIFUL DIGITAL OR PHYSICAL MOSAIC WALL",
];

const serviceList = [
  {
    image: Mosaic1,
    title: "The ultimate party favor.",
    titleContent: (
      <div>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize md:tw-block tw-inline">
          The ultimate{" "}
        </h3>

        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize md:tw-block tw-inline">
          party favor.
        </h3>
      </div>
    ),
    description: (
      <p className="tw-mb-8">
        Come for the memories, leave with Mosaic. Adding Mosaic to your event is not only the
        ultimate engagement booster, but it also creates a showstopping branded work of art that is
        perfect to hang in the office or post to your website.
      </p>
    ),
  },
  {
    image: Mosaic2,
    title: "Mosaic is perfect for the physical and digital worlds.",
    titleContent: (
      <>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize md:tw-block tw-inline">
          Perfect{" "}
        </h3>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize md:tw-block tw-inline">
          for the physical{" "}
        </h3>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize md:tw-block tw-inline">
          and digital worlds.
        </h3>
      </>
    ),
    description: (
      <div>
        <p className="tw-mb-8">
          Mosaic is available in both physical and digital formats. Give your guests an engaging
          tactile experience as they build the mosaic wall with their photos, or opt for a digital,
          live mosaic wall that sends the photos directly to a screen of any size. Perfect for
          conventions, large format events, and paired with our social photographers.
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
];

const FAQList = [
  {
    question: "How big is the mosaic wall?",
    answer:
      "Our standard Mosaic wall is 6’ x 4’ but that’s only the starting point, we can make your Mosaic wall MASSIVE (well, within reason). Mosaic can be as wide as you like but we’ve found that a max height of 5’ makes for the best user experience. Not big enough for you? Our digital mosaics are truly limitless and can be projected on theater screens, video walls, even jumbotrons.",
  },
  {
    question: "Do I need a photo booth to make a Mosaic?",
    answer:
      "Not at all. Mosaic works with any of our photo packages. Social Photographers make a perfect companion for mosaic in large settings like conventions, expos, and multi-day events. Watch your logo, design, or work of art come to life while your guests mingle.",
  },
  {
    question: "Do you provide a screen for the digital mosaic?",
    answer:
      "We certainly can. If you need a screen we can arrange it for you, we also can work with any existing screen in your venue.",
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

const Mosaic = () => (
  <div className={pageFont.className}>
    <HomeHeader />

    <ServiceBanner
      imageSrc={MosaicBanner.src}
      title="MOSAIC"
      titleSize="tw-text-9xl"
      titleImageSrc={MosaicBannerTitle.src}
      descriptionTitle="See the big picture."
      content="With mosaic, watch as individual moments come together to create a masterpiece of memories. As your celebration unfolds, our cutting-edge technology weaves all your photos into a stunning mosaic that captures the essence of your occasion."
    />

    <WhatsIncluded items={WhatsIncludedItems} showIcons />

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

export default Mosaic;
