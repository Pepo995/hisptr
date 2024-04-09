import Image from "next/image";
import Link from "next/link";

const BannerContent = ({
  title,
  titleSize,
  descriptionTitle,
  content,
  showButton,
  titleImageSrc,
}: {
  title: string;
  titleSize?: string;
  titleImageSrc: string;
  descriptionTitle: string;
  content: string;
  showButton?: boolean;
}) => (
  <div className="md:tw-absolute tw-relative md:tw-bottom-0 tw-w-full md:tw-bg-black/70 tw-bg-black md:tw-py-6 tw-py-3 tw-overflow-hidden">
    <div className="tw-flex md:tw-flex-row tw-flex-col tw-items-center tw-gap-x-7 tw-w-11/12 tw-mx-auto tw-text-white">
      <h1
        className={`${
          titleSize?.length ? titleSize : "tw-text-7xl"
        } tw-uppercase tw-text-white tw-font-medium md:tw-block tw-hidden`}
      >
        {title}
      </h1>

      <div>
        <h2 className="md:tw-text-7xl tw-text-xl tw-font-thin tw-capitalize">{descriptionTitle}</h2>

        <p className="md:tw-text-xl tw-text-sm tw-font-thin md:tw-w-11/12">{content}</p>
      </div>

      {showButton && (
        <Link href="/contact-us" className="tw-mb-auto md:tw-mt-0 tw-mt-5 tw-z-10">
          <button
            style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            className="custom-btn md:tw-text-xl tw-text-sm tw-min-h-fit tw-h-fit"
          >
            GET IN TOUCH
          </button>
        </Link>
      )}
    </div>

    <Image
      src={titleImageSrc}
      alt={title}
      className="tw-absolute md:tw-hidden tw-bottom-1 tw-mx-2 tw-opacity-20 tw-mt-5 tw-h-5/6"
      fill
    />
  </div>
);

export default BannerContent;
