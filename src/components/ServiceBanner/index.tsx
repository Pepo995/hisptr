import BannerContent from "@components/BannerContent";
import Image from "next/image";
import { type ReactNode } from "react";

const ServiceBanner = ({
  imageSrc,
  backgroundVideo,
  title,
  titleSize,
  titleImageSrc,
  descriptionTitle,
  content,
  showButton = false,
}: {
  imageSrc?: string;
  backgroundVideo?: ReactNode;
  title: string;
  titleSize: string;
  titleImageSrc: string;
  descriptionTitle: string;
  content: string;
  showButton?: boolean;
}) => (
  <div
    className={`${
      imageSrc ? "md:tw-h-[700px] tw-min-h-[230px]" : ""
    } tw-w-full tw-relative`}
  >
    {imageSrc ? (
      <Image
        src={imageSrc}
        alt="first-bannr"
        fill
        className="tw-relative tw-top-0 tw-left-0 tw-object-cover"
      />
    ) : (
      backgroundVideo
    )}

    <div className={`${imageSrc ? "tw-block" : "md:tw-block tw-hidden"}`}>
      <BannerContent
        title={title}
        titleSize={titleSize}
        descriptionTitle={descriptionTitle}
        content={content}
        showButton={showButton}
        titleImageSrc={titleImageSrc}
      />
    </div>
  </div>
);

export default ServiceBanner;
