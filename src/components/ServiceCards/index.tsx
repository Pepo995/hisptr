"use client";
import Image, { type StaticImageData } from "next/image";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Glider from "react-glider";
import type GliderType from "glider-js";

import "glider-js/glider.min.css";
import Loading from "@components/Testimonial/Loading";
import RightArrowIcon from "./RightArrowIcon";
import LeftArrowIcon from "./LeftArrowIcon";

const ServiceCard = ({
  images,
  title,
  titleContent,
  description,
  positionRight,
}: {
  images: StaticImageData[];
  title: string;
  titleContent: ReactNode;
  description: ReactNode;
  positionRight: boolean;
}) => {
  const MAX = images.length - 1;
  const INTERVAL = 5000;

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotsElement = useRef<HTMLDivElement | null>(null);

  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  const callbackRef = useCallback(
    (glider: GliderType) => {
      if (glider) {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            let index = glider.page;
            if (index < MAX) {
              index += 1;
            } else {
              index = 0;
            }
            glider.scrollItem(index, false);
          }, INTERVAL);
          glider.arrows.next;
        }
      }
    },
    [MAX],
  );

  const dotsCallbackRef = useCallback((element: HTMLDivElement) => {
    dotsElement.current = element;
    setIsReady(true);
  }, []);

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    [],
  );

  return (
    <div>
      <div
        className={`${
          positionRight
            ? "md:tw-flex-row-reverse tw-justify-end"
            : "md:tw-flex-row tw-justify-right"
        } tw-flex tw-flex-col ${
          images.length === 1 ? "tw-justify-center tw-h-full" : ""
        } tw-items-center md:tw-gap-16`}
      >
        {images.length > 1 ? (
          <div className="tw-relative tw-w-[100vw] md:tw-w-[50vw] min-[980px]:tw-h-[700px] md:tw-h-full tw-h-[300px]">
            {isReady ? (
              <Glider
                className="glider-container"
                draggable
                hasArrows
                hasDots
                dots={dotsElement.current}
                slidesToShow={1}
                ref={callbackRef}
                arrows={{
                  prev: prevButtonRef.current,
                  next: nextButtonRef.current,
                }}
              >
                {images.map((image, index) => (
                  <div
                    style={{
                      backgroundSize: "cover",
                    }}
                    key={index}
                  >
                    <Image
                      key={index}
                      src={image.src}
                      alt={title}
                      fill
                      className="tw-relative tw-w-full tw-object-cover md:tw-h-[700px] tw-h-[300px]"
                    />
                  </div>
                ))}
              </Glider>
            ) : (
              <Loading />
            )}
            <div className="glider-dots tw-absolute tw-bottom-0 tw-w-full" ref={dotsCallbackRef} />

            <button ref={prevButtonRef} className="custom-glider-prev">
              <LeftArrowIcon />
            </button>
            <button ref={nextButtonRef} className="custom-glider-next">
              <RightArrowIcon />
            </button>
          </div>
        ) : (
          <Image
            src={images[0].src}
            alt={title}
            fill
            className="tw-relative tw-w-[100vw] md:tw-w-[50vw] tw-object-cover md:tw-h-[700px] tw-h-[300px]"
          />
        )}

        <div
          className={`${
            positionRight
              ? "2xl:tw-ps-64 lg:tw-ps-24 md:tw-ps-16 tw-px-4"
              : "2xl:tw-pe-64 lg:tw-pe-24 md:tw-pe-16 tw-px-4"
          } md:tw-w-1/2 tw-w-full  md:tw-py-18 tw-py-10 tw-h-full`}
        >
          <div className="tw-text-black tw-text-left tw-font-normal md:tw-text-2xl tw-text-xl tw-mb-8">
            {titleContent}
          </div>

          <div className="tw-text-black tw-text-sm md:tw-text-xl tw-font-normal">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
