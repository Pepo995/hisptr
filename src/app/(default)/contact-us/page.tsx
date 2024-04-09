import localFont from "next/font/local";
import type { Metadata } from "next/types";
import ContactUsLayout from "@components/ContactUsLayout";
import { BASE_URL } from "@constants/url";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookhipstr.com"),
  title: "Contact Hipstr | Nationwide Photo Booth Rental Company",
  description:
    "Contact Hipstr, a photo booth rental company serving major cities including New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
  alternates: {
    canonical: `${BASE_URL}/contact-us`,
  },
  openGraph: {
    title: "Contact Hipstr | Nationwide Photo Booth Rental Company",
    description:
      "Contact Hipstr, a photo booth rental company serving major cities including New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
    url: "https://bookhipstr.com/contact-us",
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
};

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

const ContactUs = () => <ContactUsLayout className={pageFont.className} />;
export default ContactUs;
