import Image from "next/image";
import { type packageOptions } from "@constants/packages";
import IncludedItems from "./IncludedItems";
import { useCallback, useEffect, useRef, useState } from "react";

import Glider from "react-glider";
import type GliderType from "glider-js";

import "glider-js/glider.min.css";
import Loading from "@components/Testimonial/Loading";
import LeftArrowIcon from "@components/ServiceCards/LeftArrowIcon";
import RightArrowIcon from "@components/ServiceCards/RightArrowIcon";

const BoothOptionsImages = ({
  value,
  options,
}: {
  value: number;
  options: typeof packageOptions;
}) => {
  const selectedOpt = options.find((elem) => elem.optValue === value);

  const MAX = selectedOpt ? selectedOpt.images.length - 1 : 0;
  const INTERVAL = 5000;

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotsElement = useRef<HTMLDivElement | null>(null);

  const prevButtonRef = useRef<HTMLElement | null>(null);
  const nextButtonRef = useRef<HTMLElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const leftArrowCallbackRef = useCallback((element: HTMLButtonElement) => {
    prevButtonRef.current = element;
    setIsReady(Boolean(prevButtonRef.current && nextButtonRef.current && dotsElement.current));
  }, []);

  const RightArrowCallbackRef = useCallback((element: HTMLButtonElement) => {
    nextButtonRef.current = element;
    setIsReady(Boolean(prevButtonRef.current && nextButtonRef.current && dotsElement.current));
  }, []);

  const dotsCallbackRef = useCallback((element: HTMLDivElement) => {
    dotsElement.current = element;
    setIsReady(Boolean(prevButtonRef.current && nextButtonRef.current && dotsElement.current));
  }, []);

  const gliderRef = useRef<GliderType | null>(null);

  const scrollToIndex = (index: number) => {
    gliderRef.current?.scrollItem(index, false);
    setActiveSlide(index);
  };

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const newIndex = activeSlide < MAX ? activeSlide + 1 : 0;
        scrollToIndex(newIndex);
      }, INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSlide, MAX]);

  const handleArrowClick = (isPrev: boolean) => {
    const newIndex = isPrev
      ? activeSlide > 0
        ? activeSlide - 1
        : MAX
      : activeSlide < MAX
      ? activeSlide + 1
      : 0;
    scrollToIndex(newIndex);
    setActiveSlide(newIndex);
  };

  return (
    <div className="tw-flex tw-flex-col tw-h-full lg:tw-gap-y-9 tw-gap-y-5 tw-pr-3">
      {selectedOpt ? (
        <div className="tw-relative tw-h-[360px]">
          {isReady ? (
            <Glider
              className="glider-container"
              draggable
              hasArrows
              hasDots={false}
              slidesToShow={1}
              ref={gliderRef}
              arrows={{
                prev: prevButtonRef.current,
                next: nextButtonRef.current,
              }}
            >
              {selectedOpt.images.map((image, index) => (
                <div
                  style={{
                    backgroundSize: "cover",
                    width: "full",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  key={index}
                >
                  <Image
                    key={index}
                    src={image.name.src}
                    alt={selectedOpt.name}
                    fill
                    className="tw-relative tw-w-[320px] tw-object-cover md:tw-h-[260px] tw-h-[300px]"
                  />
                </div>
              ))}
            </Glider>
          ) : (
            <Loading />
          )}

          <p className="tw-text-black tw-w-full tw-text-center tw-mt-2">
            {selectedOpt.images[activeSlide].title}
          </p>

          <div
            className="tw-absolute tw-bottom-0 tw-w-full tw-flex tw-justify-center tw-py-4 tw-gap-2"
            ref={dotsCallbackRef}
          >
            {selectedOpt.images.map((image, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                aria-label={`Slide ${index}`}
                type="button"
              >
                <Image
                  src={image.name.src}
                  alt={`Thumbnail ${index}`}
                  width={40}
                  height={45}
                  className={`${
                    index === activeSlide ? "tw-border-2 tw-border-primary" : ""
                  } tw-rounded-md tw-w-12 tw-h-12`}
                />
              </button>
            ))}
          </div>

          {/* <div className="glider-dots tw-absolute tw-bottom-0 tw-w-full" ref={dotsCallbackRef} /> */}

          <button
            disabled={activeSlide === 0}
            ref={leftArrowCallbackRef}
            className="ondemand-custom-glider-prev tw-flex tw-justify-center tw-items-center"
            type="button"
            aria-label="Previous"
            onClick={() => handleArrowClick(true)}
          >
            <LeftArrowIcon />
          </button>

          <button
            disabled={activeSlide === MAX}
            ref={RightArrowCallbackRef}
            className="ondemand-custom-glider-next tw-flex tw-justify-center tw-items-center"
            type="button"
            aria-label="Next"
            onClick={() => handleArrowClick(false)}
          >
            <RightArrowIcon />
          </button>
        </div>
      ) : (
        <div className="htw-mx-auto tw-max-h-[250px] tw-w-auto tw-h-1/2 tw-bg-transparent" />
      )}

      <div>
        <h3 className="tw-text-primary tw-text-2xl tw-font-bold tw-mb-9">
          Your {selectedOpt?.title} package includes:
        </h3>

        <IncludedItems items={selectedOpt?.included} />
      </div>
    </div>
  );
};

export default BoothOptionsImages;
