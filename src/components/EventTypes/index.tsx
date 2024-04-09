import EventCard from "@components/EventCard";
import Activations from "@images/home/home1.webp";
import Corporate from "@images/home/home2.webp";
import Installments from "@images/home/home3.webp";

import Social from "@images/home/home4.webp";

const eventList = [
  {
    image: Social,
    title: "SOCIAL",
    description:
      "Weddings, birthdays, mitzvahs, sweet 16s, quinceaneras, anniversaries, engagements - you name the place, we’ll bring the party!",
  },
  {
    image: Activations,
    title: "ACTIVATIONS",
    description:
      "Short-term, long-term, multi-city, or multi-country, there’s no limit to how we can boost your brand together.",
  },
  {
    image: Corporate,
    title: "CORPORATE",
    description:
      "Whether celebrating achievements or engaging with your audience. We’d love to be a part of your next holiday party, expo, or conference.",
  },
  {
    image: Installments,
    title: "INSTALLMENTS",
    description:
      "Looking for something a little more permanent? We’d love to take your space to the next level.",
  },
];

const EventTypes = ({ className }: { className: string }) => (
  <div className="ubuntu md:tw-mt-9 tw-mt-5">
    <h3
      className={`${className} tw-text-black tw-text-center tw-text-3xl md:tw-text-6xl tw-font-medium`}
    >
      Types of Events
    </h3>

    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-mt-px tw-mt-5 tw-w-full md:tw-w-11/12 tw-flex-wrap tw-mx-auto">
      {eventList.map(({ image, title, description }, index) => (
        <EventCard
          imageSrc={image}
          key={index}
          title={title}
          description={description}
          positionRight={index % 2 !== 0}
          className={className}
        />
      ))}
    </div>
  </div>
);

export default EventTypes;
