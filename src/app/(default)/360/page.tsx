import HomeHeader from "@components/HomeHeader";
import ServiceBanner from "@components/ServiceBanner";
import Footer from "@components/Footer";
import ThreeHundredSixtyTitle from "@images/pages/ThreeHundredSixty/360-title.webp";
import WhatsIncluded from "@components/WhatsIncluded";
import ServiceCard from "@components/ServiceCards";
import FAQSection from "@components/FAQSection";

import ThreeHundredSixty1 from "@images/pages/ThreeHundredSixty/360-1.webp";
import ThreeHundredSixty2 from "@images/pages/ThreeHundredSixty/360-2.webp";
import Link from "next/link";
import localFont from "next/font/local";
import BannerContent from "@components/BannerContent";

import type { Metadata } from "next/types";
import { BASE_URL } from "@constants/url";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Hipstr 360 Photo Booth Experience | 360 Video Booth | Hipstr",
  description:
    "Hipstr 360 is an immersive 360-degree video experience that creates stunning videos in real-time or slow motion. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
  alternates: {
    canonical: `${BASE_URL}/360`,
  },
  openGraph: {
    title: "Hipstr 360 Photo Booth Experience | 360 Video Booth | Hipstr",
    description:
      "Hipstr 360 is an immersive 360-degree video experience that creates stunning videos in real-time or slow motion. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    url: "https://bookhipstr.com/360",
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
  "FILTERS",
  "INSTANT SOCIAL SHARING",
  "ACCESS TO YOUR ONLINE GALLERY",
  "A DEDICATED HIPSTR HOST",
  "CUSTOM OVERLAY",
  "4 HOURS EVENT TIME",
  "SOCIAL MEDIA METRICS",
];

const serviceList = [
  {
    image: ThreeHundredSixty1,
    title: "A Show-Stopping Video Experience",
    titleContent: (
      <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md">
        A Show-Stopping Video Experience
      </h3>
    ),
    description: (
      <p className="tw-mb-8">
        Unleash your imagination and capture moments like never before as our state-of-the-art booth
        spins around you. Magical to use, and mesmerizing to watch.
      </p>
    ),
  },
  {
    image: ThreeHundredSixty2,
    title: "You can’t stop time... but we can slow it",
    titleContent: (
      <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md">
        You can’t stop time... but we can slow it
      </h3>
    ),
    description: (
      <div>
        <p className="tw-mb-8">
          Who doesn’t love a good slow-mo video? Our 360° experience offers high-definition
          slow-motion videos that let you linger in the moment for a little bit longer, and then
          save it forever.
        </p>

        <Link href="/book-now">
          <button
            style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            className="custom-btn tw-min-h-fit tw-h-fit tw-w-fit tw-rounded-lg"
          >
            GET PRICING
          </button>
        </Link>
      </div>
    ),
  },
];

const FAQList = [
  {
    question: "Does the 360 booth capture videos or GIFs?",
    answer:
      "We would never make you choose! Our 360 booth outputs both stunning video and high-res gifs, all of which will look fabulous on your feed.",
  },
  {
    question: "How much space does the 360 booth require?",
    answer:
      "Our 360 booth is a big spectacle but only requires a small space. An 8’ x 8’ space is sufficient for our 360 booths, however, we recommend more space for all the guests who will gather around to gawk.",
  },
  {
    question: "Is the booth safe for kids/elderly, does the booth itself spin?",
    answer:
      "360 is dizzyingly fun... but no, don’t worry. Our 360 booth features a camera that spins around the subject while they remain stationary, smiling, and safe.",
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

const ThreeHundredSixty = () => (
  <div className={pageFont.className}>
    <HomeHeader />

    <ServiceBanner
      backgroundVideo={
        <div
          className="tw-pt-[48.25%] tw-h-[48.25%]"
          style={{
            backgroundImage: `url(${ThreeHundredSixty1.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <iframe
            title="https://player.vimeo.com/video/895519766?background=1"
            src="https://player.vimeo.com/video/895519766?background=1"
            allowFullScreen
            style={{
              border: 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></iframe>
        </div>
      }
      title="360°"
      titleSize="tw-text-9xl"
      titleImageSrc={ThreeHundredSixtyTitle.src}
      descriptionTitle="Don’t be one-dimensional."
      content="Whether you’re striking a pose, dancing like nobody’s watching, or putting on an Oscar-worthy performance – our 360° video booth records everything, everywhere, all at once."
    />

    <div className="md:tw-hidden tw-block">
      <BannerContent
        title="360°"
        titleSize=""
        titleImageSrc={ThreeHundredSixtyTitle.src}
        descriptionTitle="Don’t be one-dimensional."
        content="Whether you’re striking a pose, dancing like nobody’s watching, or putting on an Oscar-worthy performance – our 360° video booth records everything, everywhere, all at once."
      />
    </div>

    <WhatsIncluded getPricingLink="/book-now" items={WhatsIncludedItems} showIcons />

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

export default ThreeHundredSixty;
