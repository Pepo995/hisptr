import HeroBanner from "@components/HeroBanner";
import HomeHeader from "@components/HomeHeader";
import Experience from "@components/Experience";
import Footer from "@components/Footer";
import Testimonial from "@components/Testimonial";
import Trusted from "@components/Trusted";
import Located from "@components/Located";
import EventTypes from "@components/EventTypes";
import localFont from "next/font/local";

import type { Metadata } from "next/types";
import BannerBar from "@components/BannerBar";

const pageFont = localFont({
  src: [
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-bold.ttf",
      weight: "600",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-news.otf",
      weight: "500",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro.otf",
      weight: "400",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-light.otf",
      weight: "200",
    },
  ],
});

const BASE_URL = "https://bookhipstr.com";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Hipstr | Nationwide Video and Photo Booth Company for Parties and Brand Activations",
  description:
    "Not an average photo booth rental; Hipstr is an experience. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
  alternates: {
    canonical: `${BASE_URL}/`,
  },
  openGraph: {
    title: "Hipstr | Nationwide Video and Photo Booth Company for Parties and Brand Activations",
    description:
      "Not an average photo booth rental; Hipstr is an experience. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    url: "https://bookhipstr.com",
    siteName: "Hipstr",
    images: [
      {
        url: `/we-bring-the-party.png`,
        width: 2210,
        height: 1244,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Hipstr | Nationwide Video and Photo Booth Company for Parties and Brand Activations",
    description:
      "Not an average photo booth rental; Hipstr is an experience. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    card: "summary",
  },
};

const Home = () => (
  <div className={`${pageFont.className}`}>
    <BannerBar className={pageFont.className} />
    <HomeHeader />
    <div className="tw-overflow-x-hidden">
      <HeroBanner className={pageFont.className} />
      <Trusted className={pageFont.className} />
      <div className="tw-block tw-relative tw-top-[-70px]" id="experience"></div>
      <Experience className={pageFont.className} />
      <Testimonial className={pageFont.className} />
      <Located className={pageFont.className} />
      <EventTypes className={pageFont.className} />
      <Footer />
    </div>
  </div>
);

export default Home;
