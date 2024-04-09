"use client";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import FastrLogo from "@images/home/fastr-logo.webp";
import { useIsMobile } from "@hooks/useIsMobile";

const ExperienceCard = ({
  imageSrc,
  title,
  url,
  description,
  isFastrBooking = false,
  isMostPopular = false,
  className,
}: {
  imageSrc: StaticImageData;
  title: string;
  url?: string;
  description: string[];
  isFastrBooking: boolean;
  isMostPopular: boolean;
  className: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <div>
      <Link href={url ?? "#"}>
        <div className="md:tw-h-min tw-overflow-hidden tw-flex tw-items-center tw-border-[1px] tw-shadow-md hover:tw-shadow-xl tw-relative tw-transition-all">
          <Image
            src={imageSrc}
            alt={title}
            style={{
              width: isMobile ? 150 : 208,
              height: isMobile ? "auto" : 208,
            }}
          />

          {isMostPopular && (
            <div
              className={`${className} tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-bg-yellow-500 ubuntu tw-text-xs tw-font-bold tw-py-1 tw-ps-4 tw-pe-8`}
              style={{
                clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)",
              }}
            >
              MOST POPULAR
            </div>
          )}

          <div className="tw-left-0 tw-h-full tw-w-full tw-flex tw-flex-col tw-gap-1 md:tw-gap-2 tw-content-center tw-px-2">
            <p
              className={`${className} ${
                title === "CUSTOM EVENTS" ? "tw-w-3/5" : ""
              } group-hover:tw-opacity-0 md:tw-text-[27px] tw-text-2xl tw-font-normal`}
            >
              {title}
            </p>

            <div>
              {description.map((value, index) => (
                <p
                  key={index}
                  className={`${className} xl:tw-leading-relaxed tw-font-GoodHeadlinePro tw-text-xs tw-font-normal tw-ps-1`}
                >
                  • {value}
                </p>
              ))}
            </div>

            {url && (
              <div className="tw-flex tw-items-center tw-gap-3">
                <button className="custom-btn tw-min-w-[50%] tw-w-auto ubuntu tw-py-2 tw-px-4 tw-font-bold tw-rounded-lg tw-text-base">
                  EXPLORE
                </button>

                {isFastrBooking && (
                  <div>
                    <Image src={FastrLogo} alt="fastr-logo" width={42} />

                    <p
                      className={`${className} xl:tw-text-[10px] tw-text-[8px] tw-font-medium tw-font-GoodHeadlinePro`}
                    >
                      Book in 2 minutes
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ExperienceCard;
