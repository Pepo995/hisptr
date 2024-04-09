import HomeHeader from "@components/HomeHeader";
import ServiceBanner from "@components/ServiceBanner";
import Footer from "@components/Footer";
import SocialPhotographerBanner from "@images/pages/social-photographer/social-photographer-banner.webp";
import SocialPhotographerTitle from "@images/pages/social-photographer/SOCIAL-PHOTOGRAPHER-title.webp";

import WhatsIncluded from "@components/WhatsIncluded";
import ServiceCard from "@components/ServiceCards";

import SocialPhotographer1 from "@images/pages/social-photographer/social-photographer1.webp";
import SocialPhotographer2 from "@images/pages/social-photographer/social-photographer2.webp";
import SocialPhotographer3 from "@images/pages/social-photographer/social-photographer3.webp";
import FAQSection from "@components/FAQSection";
import Link from "next/link";
import localFont from "next/font/local";
import type { Metadata } from "next/types";
import { BASE_URL } from "@constants/url";

const WhatsIncludedItems = [
  "HIPSTR PHOTOGRAPHER",
  "CUSTOM PHOTO OVERLAY",
  "4 HOURS EVENT TIME",
  "INSTANT PRINTING",
  "SOCIAL SHARING",
  "ACCESS TO YOUR ONLINE GALLERY",
  "PROFESSIONAL LIGHTING EQUIPMENT",
  "+ HIGH QUALITY CAMERA EQUIPMENT",
];

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Hipstr Social Photographer | Nationwide Photo Activations | Hipstr",
  description:
    "Hipstr Social Photographers roam your event and capture photos that integrate with all of Hipstr’s technology like instant printing, social sharing, and mosaic walls. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
  alternates: {
    canonical: `${BASE_URL}/social-photographer`,
  },
  openGraph: {
    title: "Hipstr Social Photographer | Nationwide Photo Activations | Hipstr",
    description:
      "Hipstr Social Photographers roam your event and capture photos that integrate with all of Hipstr’s technology like instant printing, social sharing, and mosaic walls. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    url: "https://bookhipstr.com/social-photographer",
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

const serviceList = [
  {
    image: SocialPhotographer1,
    title: "No space? No problem.",
    titleContent: (
      <div>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize">
          No space?
        </h3>

        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize">
          No problem.
        </h3>
      </div>
    ),
    description: (
      <p className="tw-mb-8">
        A solution that doesn’t take up any space, captures tons of photos and online exposure for
        your brand, and provides entertainment for your guests.
      </p>
    ),
  },
  {
    image: SocialPhotographer2,
    title: "Instant, unlimited printing.",
    titleContent: (
      <>
        <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize">
          Instant, Unlimited Printing.
        </h3>
      </>
    ),
    description: (
      <div>
        <p className="tw-mb-8">
          While your photographer roams through your event, all your prints will be instantly sent
          back to our printing station, mosaic wall, and gallery. No need to sit and wait for
          photos, just keep partying and we’ll keep printing and posting.
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
    image: SocialPhotographer3,
    title: "We like getting in on the action.",
    titleContent: (
      <h3 className="tw-text-black tw-font-normal md:tw-text-5xl tw-text-md tw-capitalize">
        We like getting in on the action.
      </h3>
    ),
    description: (
      <p className="tw-mb-8">
        Social photographers move through your event capturing candid moments, laughter, and making
        sure everyone has their time in front of the lens.
      </p>
    ),
  },
];

const FAQList = [
  {
    question: "How many photographers come in the Social Photography Package?",
    answer:
      "While the standard package comes with one photographer we know that some events require two, three, or more. You can upgrade your package to add additional photographers to suit your needs.",
  },
  {
    question: "How long does it take to get my photos?",
    answer:
      "Delayed gratification is so last decade. The social photographer package includes instant unlimited printing at your event’s printing station as well as instant upload to your gallery.",
  },
  {
    question: "Can social photographers be added to other packages?",
    answer:
      "Absolutely. Social photographers are the perfect compliment to any of our packages, adding a mobile element to your event only maximizes the memories, content, and fun.",
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

const SocialPhotographer = () => (
  <div className={pageFont.className}>
    <HomeHeader />

    <ServiceBanner
      imageSrc={SocialPhotographerBanner.src}
      title="SOCIAL
      PHOTOGRAPHER"
      titleSize="tw-text-7xl"
      titleImageSrc={SocialPhotographerTitle.src}
      descriptionTitle="Capture candid moments."
      content="Our Social Photographer package brings roaming photographers to your event, even though we love a good pose, there’s something special about snapping spontaneous smiles."
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

export default SocialPhotographer;
