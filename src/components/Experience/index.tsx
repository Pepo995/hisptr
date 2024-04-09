import Halo from "@images/home/halo-hipstr.webp";
import Array from "@images/home/array-hipstr.webp";
import ThreeHundredSixty from "@images/home/Threehundredsixty.webp";
import SocialPhotographer from "@images/home/social-photographer.webp";
import Mosaic from "@images/home/mosaic-hipstr.webp";
import CustomEvents from "@images/home/custom-events.webp";

import ExperienceCard from "@components/ExperienceCard";

const experienceItems = [
  {
    image: Halo,
    title: "HALO",
    url: "/halo",
    description: ["Sleek photo booth", "Unlimited prints", "Endless customization"],
    isFastrBooking: true,
    isMostPopular: true,
  },
  {
    image: Array,
    title: "ARRAY",
    url: "/array",
    description: ["Stunning 3D gifs", "8 simultaneous snaps", "Uniquely engaging"],
    isFastrBooking: true,
    isMostPopular: false,
  },
  {
    image: ThreeHundredSixty,
    title: "360°",
    url: "/360",
    description: ["Immersive 360* video", "Slow motion", "Turn heads and drop jaws"],
    isFastrBooking: true,
    isMostPopular: false,
  },
  {
    image: SocialPhotographer,
    title: "SOCIAL PHOTOGRAPHER",
    url: "/social-photographer",
    description: [
      "Get an actual photographer ",
      "Instant sharing/printing",
      "Captures candid moments",
    ],
    isFastrBooking: false,
    isMostPopular: false,
  },
  {
    image: Mosaic,
    title: "MOSAIC",
    url: "/mosaic",
    description: ["Weaves photos into a mosaic", "Gorgeous art to keep", "Interactive sharing"],
    isFastrBooking: false,
    isMostPopular: false,
  },
  {
    image: CustomEvents,
    title: "CUSTOM EVENTS",
    url: "/custom-events",
    description: ["Bespoke needs? Great.", "Absurd ideas? Amazing", "Make your dreams reality"],
    isFastrBooking: false,
    isMostPopular: false,
  },
];

const Experience = ({ className }: { className: string }) => (
  <div className="md:tw-mt-9 tw-mt-5 tw-px-5 2xl:tw-max-w-[1800px] 2xl:tw-px-20 tw-mx-auto">
    <div className="flex flex-col tw-items-center tw-text-center md:tw-px-28">
      <h2
        className={`${className} tw-text-black tw-text-center tw-text-4xl md:tw-text-6xl tw-font-medium`}
      >
        Choose Your Experience
      </h2>

      <p
        className={`${className} tw-text-center tw-font-GoodHeadlinePro tw-font-normal tw-text-base md:tw-text-lg tw-mt-6`}
      >
        Tired of tacky, under-developed and over-priced photo booths, we came up with a better way
        to bring the party. Hipstr specializes in delivering the most interactive and engaging photo
        & video activations across&nbsp;the&nbsp;US.
      </p>
    </div>

    <div className="tw-grid xl:tw-grid-cols-3 md:tw-grid-cols-2 tw-grid-cols-1 ubuntu tw-mt-5 tw-w-full xl:tw-py-8 tw-gap-y-8 tw-gap-x-2">
      {experienceItems.map(
        ({ image, title, url, description, isFastrBooking, isMostPopular }, index) => (
          <ExperienceCard
            imageSrc={image}
            key={index}
            title={title}
            url={url}
            description={description}
            isFastrBooking={isFastrBooking}
            isMostPopular={isMostPopular}
            className={className}
          />
        ),
      )}
    </div>
  </div>
);

export default Experience;
