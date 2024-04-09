import HomeHeader from "@components/HomeHeader";
import ServiceBanner from "@components/ServiceBanner";
import Footer from "@components/Footer";
import ArrayBanner from "@images/pages/array/array-banner.webp";
import ArrayTitle from "@images/pages/array/ARRAY.webp";

import WhatsIncluded from "@components/WhatsIncluded";
import ServiceCard from "@components/ServiceCards";

import Array1 from "@images/pages/array/array-1.webp";
import Array2 from "@images/pages/array/array-2.webp";
import FAQSection from "@components/FAQSection";
import Link from "next/link";
import localFont from "next/font/local";

import type { Metadata } from "next/types";
import { BASE_URL } from "@constants/url";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Hipstr Array Experience | 3D Photo Booth | Hipstr",
  description:
    "Hipstr Array is a multi-camera setup that takes a single, frozen moment and creates 3D animation for instant social media sharing. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
  alternates: {
    canonical: `${BASE_URL}/array`,
  },
  openGraph: {
    title: "Hipstr Array Experience | 3D Photo Booth | Hipstr",
    description:
      "Hipstr Array is a multi-camera setup that takes a single, frozen moment and creates 3D animation for instant social media sharing. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    url: "https://bookhipstr.com/array",
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
  "A DEDICATED HIPSTR HOST",
  "GIF + BOOMERANG CREATION",
  "CUSTOM PHOTO + GIF OVERLAY",
  "FILTERS",
  "4 HOURS EVENT TIME. ALWAYS.",
  "INSTANT SOCIAL SHARING",
  "SOCIAL MEDIA METRICS",
  "ACCESS TO YOUR ONLINE GALLERY",
];

const serviceList = [
  {
    image: Array2,
    title: "Up to 11 High Res DSLR Cameras",
    titleContent: (
      <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md">
        Up to 11 High Res DSLR Cameras.
      </h3>
    ),
    description: (
      <p className="tw-mb-8">
        All the flash of the paparazzi without the... you know... paparazzi. Step into the world of
        dynamic memories with Hipstr Array, our 3D photo booth package. Using up to 11 cameras, we
        stitch together gifs that capture your good side, your gorgeous side, and your goofy side.
      </p>
    ),
  },
  {
    image: Array1,
    title: "The Ultimate in Engagement",
    titleContent: (
      <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md">
        The Ultimate in Engagement.
      </h3>
    ),
    description: (
      <div>
        <p className="tw-mb-8">
          Bring the jaw-dropping booth that will have your guests raving for days. Array delivers a
          unique experience that your guests can’t stop posting, liking and sharing.
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
    question: "How much space do I need for the Array package?",
    answer:
      "The array package takes up a slightly larger space than our other booths, a 10’ x 12’ space is required to comfortably accommodate all that high-res, 3D goodness.",
  },
  {
    question: "Can I have a backdrop with the Array package?",
    answer:
      "Of course! Some of our most incredible Array events have had custom backdrops. Choose one of our standard backdrops or talk to our team about upgrading to a custom backdrop.",
  },
  {
    question: "Are the gifs from the Array booth postable to Instagram?",
    answer:
      "Yes! All of our outputs are instantly sharable on all social platforms. After all, if it’s not on the gram did it even happen?",
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

const Array = () => (
  <div className={pageFont.className}>
    <HomeHeader />

    <ServiceBanner
      imageSrc={ArrayBanner.src}
      title="ARRAY"
      titleSize="tw-text-9xl"
      titleImageSrc={ArrayTitle.src}
      descriptionTitle="Why Choose a side?"
      content="Capture your beautiful self from every angle. Our array package lets you re-experience your memories the way you remember them - in vibrant, dynamic, 3D."
    />

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

export default Array;
