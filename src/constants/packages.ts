import Hipstr360Mobile from "@images/boothOptions/threehundredsixtyoptmobile.webp";
import Hipstr360 from "@images/boothOptions/threehundredsixtyopt.webp";
import HipstrArray from "@images/boothOptions/array/arrayopt.webp";
import HipstrArray2 from "@images/boothOptions/array/arrayopt2.webp";
import HipstrArray3 from "@images/boothOptions/array/arrayopt3.webp";
import HipstrArray4 from "@images/boothOptions/array/arrayopt4.webp";
import HipstrArray5 from "@images/boothOptions/array/arrayopt5.webp";
import HipstrArray6 from "@images/boothOptions/array/arrayopt6.webp";
import HipstrArrayMobile from "@images/boothOptions/arrayoptmobile.webp";
import HipstrHalo from "@images/boothOptions/halo/haloopt.webp";
import HipstrHalo2 from "@images/boothOptions/halo/haloopt2.webp";
import HipstrHalo3 from "@images/boothOptions/halo/haloopt3.webp";
import HipstrHalo4 from "@images/boothOptions/halo/haloopt4.webp";
import HipstrHalo5 from "@images/boothOptions/halo/haloopt5.webp";
import HipstrHalo6 from "@images/boothOptions/halo/haloopt6.webp";
import HipstrHalo7 from "@images/boothOptions/halo/haloopt7.webp";
import HipstrHalo8 from "@images/boothOptions/halo/haloopt8.webp";
import HipstrHaloMobile from "@images/boothOptions/halooptmobile.webp";

export type BoothInfo = {
  boothName: string;
  boothDescription: string;
  imageSrc: string;
  invoiceImg: string;
  url: string;
  invoiceDescription: string;
};

export const PACKAGE_ID_HALO = 1;
export const PACKAGE_ID_ARRAY = 2;
export const PACKAGE_ID_SOCIAL_PHOTOGRAPHER = 3;
export const PACKAGE_ID_360 = 4;
export const PACKAGE_ID_MOSAIC = 5;
export const PACKAGE_ID_CUSTOM_EVENT = 6;

export const boothsInfo = new Map<number, BoothInfo>();

boothsInfo.set(PACKAGE_ID_HALO, {
  boothName: "Halo",
  boothDescription: "The ultimate photo booth package.",
  imageSrc: "/images/on-demand/halo-invoice.webp",
  invoiceImg: "/images/on-demand/halo-invoice.png",
  url: "/halo",
  invoiceDescription: `With a halo ring light and touchscreen interface, this intuitive console is perfect for guest-facing media experiences.
  The Halo Package includes Halo Media Station Console, On-site Studio Backdrop, Wide Array of Props, Unlimited Physical Printing, Instant Digital Sharing, GIFs + Boomerang Capabilities, Custom Overlay for all media, A Private, Password-Protected Online Gallery via Company Cloud, a curated photo album, A Hipstr Host who will interact with your guests and handle set-up and breakdown, and Up to 4 hours of pure event time! Clients can choose 1 of the following backdrops for their event:  White, Black, Gold or Silver.`,
});
boothsInfo.set(PACKAGE_ID_ARRAY, {
  boothName: "Array",
  boothDescription: "Break the boundaries of traditional photos.",
  imageSrc: "/images/on-demand/array.webp",
  invoiceImg: "/images/on-demand/array-small.png",
  url: "/array",
  invoiceDescription: `Hipstr Array Plus is a masterpiece of creative technology. We’re able to capture multiple angles of a single moment from up to 8 separate cameras. Once taken, the photos are instantly stitched together to create buttery smooth GIFs that viewers can’t help but watch on repeat. The glorious GIFs are then instantly accessible and shareable via on-site social sharing.
  The Array Plus Package includes:
  The Array Plus Equipment + Tech
  Custom Branding / Design on Created Content
  On-Site Social Sharing accessible from the console
  An On-Site Hipstr Host who oversees Travel, Setup, Teardown and Full Operation, as well as interacting with your guests and ensuring a good time is had by all!
  An online gallery containing all created content (delivered within 7 business days of your event). Up to to 4 hours of event time.`,
});
boothsInfo.set(PACKAGE_ID_360, {
  boothName: "360",
  boothDescription: "Immersive 360° videos that will engage and amaze.",
  imageSrc: "/images/on-demand/360-small.webp",
  invoiceImg: "/images/on-demand/360-small.png",
  url: "/360",
  invoiceDescription:
    "The Hipstr 360 Package includes our 360 Camera Platform & Technology, Unlimited Digital Photos, Unlimited Digital 360 GIFs and Boomerangs, 360 Slow-Motion Video, Digital Overlays for all Output Media, Instant On-Site Social Sharing, Access to Online Gallery for Media, A Hipstr Host who will set up, interact with your guests and tear down once event is completed, and up to four hours of pure event time.",
});
boothsInfo.set(PACKAGE_ID_SOCIAL_PHOTOGRAPHER, {
  boothName: "Social Photographer",
  boothDescription:
    "Event Photography that allows instant printing and sharing all with quality and style.",
  imageSrc: "/images/on-demand/social-photographer-small.webp",
  invoiceImg: "/images/on-demand/social-photographer-small.png",
  url: "/social-photographer",
  invoiceDescription: `Hipstr’s Social Photographer deploys a professional photographer into your event, snapping photos and sending them wirelessly for instant social sharing.
  The Hipstr Social Photographer Package includes a professional Hipstr  Photographer + High Quality Camera Equipment, Professional Lighting Equipment, Instant Printing, Photo Overlay, Two Social Kiosks, Online Gallery and Data Capture. This package is active for up to 4 hours of event time.
  CANCELLATIONS:
  The usage of the Provider Equipment may be cancelled at any time by submitted written notice of cancellation to info@bookhipstr.com.
  No refund will be provided for any equipment reservation cancelled, for any reason including event cancellation, less than six months prior to the date of Client’s scheduled reservation and event.`,
});
boothsInfo.set(PACKAGE_ID_MOSAIC, {
  boothName: "Mosaic",
  boothDescription:
    "An Interactive mosaic wall that will turn your event moments to a work of art.",
  imageSrc: "/images/on-demand/mosaic-small.webp",
  invoiceImg: "/images/on-demand/mosaic-small.png",
  url: "/mosaic",
  invoiceDescription: `The Hipstr Mosaic Wall includes a Hipstr Photographer or Kiosk, a customized microsite, a 4x6ft Digital or physical wall, Custom branded Overlay, Access to Event Photo Gallery, An On-Site Host who will oversee travel, setup, breakdown, and who will be interactive with guest to ensure a world class experience. Also Up to 4 hours of Event time.
  CANCELLATIONS:
  The usage of the Provider Equipment may be cancelled at any time by submitted written notice of cancellation to info@bookhipstr.com.
  No refund will be provided for any equipment reservation cancelled, for any reason including event cancellation, less than six months prior to the date of Client’s scheduled reservation and event.`,
});
boothsInfo.set(PACKAGE_ID_CUSTOM_EVENT, {
  boothName: "Custom Event",
  boothDescription: "...", // TODO: Update when received from the client.
  imageSrc: "/images/on-demand/custom-events-small.webp",
  invoiceImg: "/images/on-demand/custom-events-small.png",
  url: "/custom-events",
  invoiceDescription: "...", // TODO: Update when received from the client.
});

const getPackageType = (packageId: number) => ({
  name: boothsInfo.get(packageId)?.boothName ?? "",
  id: packageId,
});

export const packageTypes = [
  getPackageType(PACKAGE_ID_HALO),
  getPackageType(PACKAGE_ID_ARRAY),
  getPackageType(PACKAGE_ID_SOCIAL_PHOTOGRAPHER),
  getPackageType(PACKAGE_ID_360),
  getPackageType(PACKAGE_ID_MOSAIC),
  getPackageType(PACKAGE_ID_CUSTOM_EVENT),
];

export const packageOptions = [
  {
    optValue: PACKAGE_ID_HALO,
    name: "Halo",
    title: "Hipstr Halo",
    subtitle: "The ultimate photo booth package.",
    boldText: "Simple, elegant, unlimited.",
    isMostPopular: true,
    images: [
      { name: HipstrHalo, title: "Halo Space Requirements" },
      { name: HipstrHalo2, title: "Unlimited Prints and Instant Sharing" },
      { name: HipstrHalo3, title: "High quality photos both printed and posted." },
      { name: HipstrHalo4, title: "Our most popular backdrops come standard." },
      {
        name: HipstrHalo5,
        title: "Print in 2x6 strips for a nostalgic feel, or in 4x6 cards for larger photos",
      },
      { name: HipstrHalo6, title: "Photo album with your photos and messages from your guests." },
      { name: HipstrHalo7, title: "A dedicated Hipstr Host to make your experience seamless." },
      { name: HipstrHalo8, title: "See all your photos in one place both on desktop and mobile" },
    ],
    imageMobile: [
      { name: HipstrHaloMobile, title: "Halo Space Requirements" },
      { name: HipstrHalo2, title: "Unlimited Prints and Instant Sharing" },
      { name: HipstrHalo3, title: "High quality photos both printed and posted." },
      { name: HipstrHalo4, title: "Our most popular backdrops come standard." },
      {
        name: HipstrHalo5,
        title: "Print in 2x6 strips for a nostalgic feel, or in 4x6 cards for larger photos",
      },
      { name: HipstrHalo6, title: "Photo album with your photos and messages from your guests." },
      { name: HipstrHalo7, title: "A dedicated Hipstr Host to make your experience seamless." },
      { name: HipstrHalo8, title: "See all your photos in one place both on desktop and mobile" },
    ],
    included: [
      "Sleek Photo Booth",
      "Instant Social Sharing",
      "Open Air Photo Booth Setup",
      "Your Choice Of Print Size",
      "Up To 4 Hours Of Event Time",
      "Gif + Boomerang Creation",
      "A Dedicated Hipstr Host",
      "Custom Photo + Gif Overlay",
      "Your Choice of Backdrop",
      "Access To Your Online Gallery",
      "Unlimited Prints",
    ],
  },
  {
    optValue: PACKAGE_ID_360,
    name: "360°",
    title: "Hipstr 360",
    subtitle: "Immersive 360° videos that will engage and amaze.",
    boldText: "Capture every angle.",
    images: [{ name: Hipstr360, title: "" }],
    imageMobile: [{ name: Hipstr360Mobile, title: "" }],
    included: [
      "Immersive 360° Videos",
      "Gif + Boomerang Creation",
      "Open Air Photo Booth Setup",
      "Filters",
      "Up To 4 Hours Of Event Time",
      "Custom Overlay",
      "A Dedicated Hipstr Host",
      "Access To Your Online Gallery",
      "Instant Social Sharing",
    ],
  },
  {
    optValue: PACKAGE_ID_ARRAY,
    name: "Array",
    title: "Hipstr Array",
    subtitle: "Stunning 3D GIFs.",
    boldText: "Break the boundaries of traditional photos.",
    images: [
      { name: HipstrArray, title: "Array Space Requirements" },
      { name: HipstrArray2, title: "Share instantly to social media" },
      { name: HipstrArray3, title: "3D gifs that will set your event apart" },
      { name: HipstrArray4, title: "Boost engagement with amazing content" },
      { name: HipstrArray5, title: "Hipstr Array (Custom set pieces not included)" },
      { name: HipstrArray6, title: "A dedicated Hipstr Host to make your experience seamless." },
    ],
    imageMobile: [
      { name: HipstrArrayMobile, title: "Array Space Requirements" },
      { name: HipstrArray2, title: "Share instantly to social media" },
      { name: HipstrArray3, title: "3D gifs that will set your event apart" },
      { name: HipstrArray4, title: "Boost engagement with amazing content" },
      { name: HipstrArray5, title: "Hipstr Array (Custom set pieces not included)" },
      { name: HipstrArray6, title: "A dedicated Hipstr Host to make your experience seamless." },
    ],
    included: [
      "Stunning 3D GIFs",
      "Custom Photo + Gif Overlay",
      "Open Air Photo Booth Setup",
      "Instant Social Sharing",
      "Up To 4 Hours Of Event Time",
      "Filters",
      "A Dedicated Hipstr Host",
      "Access To Your Online Gallery",
      "Gif + Boomerang Creation",
    ],
  },
];
