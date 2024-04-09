import Image, { type StaticImageData } from "next/image";

const EventCard = ({
  imageSrc,
  title,
  description,
  positionRight,
  className,
}: {
  imageSrc: StaticImageData;
  title: string;
  description: string;
  positionRight: boolean;
  className: string;
}) => (
  <div className="md:tw-w-3/12 tw-w-full md:tw-px-3 md:tw-py-8">
    <div className="tw-relative tw-group md:tw-w-full tw-w-1/2">
      <Image
        src={imageSrc}
        alt={title}
        sizes="20vw"
        style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
        className="tw-relative tw-brightness-50 md:tw-w-full md:tw-h-full md:tw-block tw-hidden"
      />

      <div className="tw-absolute tw-top-0 tw-left-0 tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-brightness-100">
        <p
          className={`${className} tw-text-white tw-text-center tw-text-3xl tw-font-normal md:tw-block tw-hidden`}
        >
          {title}
        </p>
      </div>
    </div>
    <div
      className={`${
        positionRight ? "tw-flex-row-reverse" : "tw-flex-row"
      } md:tw-mt-5 tw-flex tw-justify-center tw-items-center md:tw-my-0`}
    >
      <Image
        src={imageSrc}
        alt={title}
        sizes="50vw"
        className="tw-w-[50%] md:tw-hidden tw-block tw-object-cover tw-h-auto"
      />

      <div className="md:tw-w-full tw-w-1/2 md:tw-px-0 tw-p-3 tw-h-full">
        <p
          className={`${className} tw-text-black tw-text-left tw-font-normal md:tw-text-2xl tw-text-[24px] tw-leading-6 md:tw-hidden tw-block tw-mb-3`}
        >
          {title}
        </p>
        <p
          className={`${className} md:tw-leading-relaxed tw-text-black md:tw-text-xl tw-text-sm tw-font-normal tw-font-GoodHeadlinePro`}
        >
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default EventCard;
