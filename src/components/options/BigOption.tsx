import Link from "next/link";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import { useRouter } from "next/router";

type BigOptionProps = {
  font?: string;
  image: StaticImageData;
  imageMobile: StaticImageData;
  text: string;
  url: string;
  alt: string;
  bgTextBlack?: boolean;
  description: string;
};

const BigOption = ({
  image,
  imageMobile,
  text,
  url,
  alt,
  bgTextBlack,
  description,
}: BigOptionProps) => {
  const [showingText, setShowingText] = useState(false);
  const router = useRouter();

  const onCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    setShowingText(!showingText);

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      void router.push(url);
    }
  };

  return (
    <div
      className="tw-flex tw-flex-col tw-rounded-md tw-w-full tw-gap-8 tw-relative tw-h-1/2 sm:tw-h-full"
      onClick={onCardClick}
    >
      <div className="tw-group tw-w-full tw-h-full">
        <div className="tw-relative tw-w-full tw-h-full tw-items-center">
          <div className="tw-flex tw-flex-col tw-z-10 tw-absolute tw-w-full sm:tw-top-[45%] tw-top-[30%] tw-px-12">
            <h2
              className={`tw-font-bold tw-text-center tw-py-3 tw-w-full tw-z-10 tw-text-white ${
                bgTextBlack ? "tw-bg-black" : "tw-bg-primary"
              } tw-text-lg tw-mx-auto xs:tw-text-xl sm:tw-text-2xl md:tw-text-4xl xl:tw-text-5xl tw-mb-0`}
            >
              {text}
            </h2>

            <div className="tw-backdrop-blur-md tw-p-6 xs:tw-p-4 tw-w-full tw-flex tw-flex-col xl:tw-gap-5 sm:tw-gap-8 tw-gap-2 tw-items-center tw-opacity-200 tw-backdrop-brightness-50">
              <h2 className="tw-font-medium tw-text-center tw-text-white tw-text-sm md:tw-text-lg xl:tw-text-xl tw-font-montserrat md:tw-h-20 lg:tw-h-14 xl:tw-h-auto">
                {description}
              </h2>

              <Link
                href={url}
                type="button"
                className="custom-btn3 tw-text-black tw-w-auto tw-uppercase tw-font-ubuntu tw-font-bold tw-rounded-lg tw-text-xl tw-h-full tw-px-10 tw-py-4 tw-mb-0"
              >
                START HERE!
              </Link>
            </div>
          </div>

          <Image
            fill
            priority
            placeholder="blur"
            src={image}
            quality={100}
            alt={alt}
            className="tw-flex tw-w-full tw-h-full tw-object-cover tw-object-top md:tw-block"
            sizes="(min-width: 639px) 50vw, 639px"
          />

          <Image
            fill
            priority
            placeholder="blur"
            src={imageMobile}
            quality={100}
            alt={alt}
            className="tw-flex tw-w-full tw-h-full tw-object-cover tw-object-top md:tw-hidden"
            sizes="(max-width: 639px) 100vw, 639px"
          />
        </div>
      </div>
    </div>
  );
};

export default BigOption;
