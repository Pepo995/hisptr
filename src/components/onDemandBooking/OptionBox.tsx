import { Field } from "formik";
import { Icon } from "@iconify/react";
import IncludedItems from "./IncludedItems";
import { formatPrice } from "@utils/Utils";

import { useCallback, useEffect, useRef, useState } from "react";
import Glider from "react-glider";
import type GliderType from "glider-js";

import "glider-js/glider.min.css";
import Loading from "@components/Testimonial/Loading";
import Image, { type StaticImageData } from "next/image";
import LeftArrowIcon from "@components/ServiceCards/LeftArrowIcon";
import RightArrowIcon from "@components/ServiceCards/RightArrowIcon";

const OptionBox = ({
  value,
  title,
  name,
  images,
  prices,
  subtitle,
  boldText,
  included,
  selected,
  onChange,
  isMostPopular = false,
}: {
  value: number;
  title: string;
  name: string;
  images: { name: StaticImageData; title: string }[];
  prices?: { id: number; price: number };
  subtitle: string;
  boldText: string;
  included: string[];
  selected: boolean;
  onChange: () => void;
  isMostPopular?: boolean;
}) => {
  {
    /* Glider functions */
  }
  const MAX = images ? images.length - 1 : 0;
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

  if (!prices?.price) {
    return (
      <div>
        <p>Error calculating price</p>
      </div>
    );
  }

  const subTotalPrice = prices.price;

  return (
    <label
      className={`tw-relative tw-w-full tw-h-auto tw-group tw-transition-all tw-duration-300 tw-cursor-pointer tw-rounded-md ${
        selected ? "tw-border-primary tw-bg-[#fd6f6e33]" : "tw-border-black"
      } tw-border-2 md:tw-pb-5 tw-p-3 tw-pb-2 tw-justify-between`}
      htmlFor={value.toString()}
    >
      <Field
        type="radio"
        name={title}
        id={value}
        value={value}
        className="tw-hidden"
        onChange={onChange}
      />

      <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-gap-x-5 tw-justify-between tw-w-full">
        <div className={`tw-flex tw-flex-col ${selected ? "md:tw-w-2/3 tw-1/2" : "md:tw-w-2/3"}`}>
          {isMostPopular && (
            <div
              className={`${
                selected ? "tw-bg-primary" : "tw-bg-black"
              } tw-absolute tw-top-0 tw-right-0 md:tw-right-1/2 tw-z-2 md:tw-translate-x-1/2  tw-rounded-es-md md:tw-rounded-b-md tw-text-white ubuntu tw-text-xs tw-font-semibold tw-py-1 tw-px-4`}
            >
              MOST POPULAR
            </div>
          )}
          <p className="xs:tw-text-3xl md:tw-text-2xl tw-text-2xl tw-font-montserrat tw-text-primary tw-font-black md:tw-mb-3 md:tw-mt-6 tw-mt-0">
            {title}
          </p>

          <div className="tw-w-full tw-font-montserrat tw-text-black">
            <p className=" -tw-mb-px xs:tw-text-xl md:tw-text-base">{subtitle}</p>

            {boldText && (
              <p className="tw-font-extrabold tw-uppercase xs:tw-text-xl md:tw-text-base">
                {boldText}
              </p>
            )}
          </div>

          {isMostPopular && (
            <div className="tw-flex tw-items-center tw-h-7 tw-w-64 tw-justify-center tw-text-black tw-rounded-full tw-bg-yellow-400 tw-font-montserrat tw-text-xs tw-font-bold tw-px-0">
              <span className="tw-font-normal">
                <span className="tw-font-bold">5,000+ booked</span> and loved this package
              </span>
            </div>
          )}

          {/* PRICE BUTTON MOBILE */}
          {selected && (
            <button
              type="button"
              className={`md:tw-hidden tw-block tw-w-1/2 sm:tw-w-1/3 tw-whitespace-nowrap tw-font-bold tw-py-2 tw-rounded-md tw-mt-4 ${
                selected
                  ? "tw-bg-primary tw-text-white tw-border-2 tw-border-[#FFBABA] tw-mb-4 tw-text-lg"
                  : "tw-bg-transparent tw-text-black tw-border-2 tw-border-black sm:text-xl md:tw-text-base tw-text-lg"
              }`}
              onClick={onChange}
            >
              ${formatPrice(subTotalPrice)}
            </button>
          )}
        </div>

        {/* MOBILE IMAGE */}
        {selected && (
          <div className="tw-w-full tw-flex tw-items-center tw-justify-center md:tw-hidden">
            <div className="tw-relative tw-h-[380px] tw-w-[95%]">
              {isReady ? (
                <Glider
                  className="glider-container tw-overflow-hidden"
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
                        width: "full",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={index}
                    >
                      <Image
                        key={index}
                        src={image.name.src}
                        alt={image.title}
                        fill
                        className="tw-relative tw-w-[320px] tw-object-cover md:tw-h-[260px] tw-h-[300px]"
                      />
                      <p className="tw-text-black tw-w-full tw-text-center tw-mt-2">
                        {image.title}
                      </p>
                    </div>
                  ))}
                </Glider>
              ) : (
                <Loading />
              )}

              <div
                className="glider-dots tw-absolute tw-bottom-0 tw-w-full"
                ref={dotsCallbackRef}
              />

              <button
                ref={prevButtonRef}
                className="ondemand-custom-glider-prev tw-flex tw-justify-center tw-items-center"
                type="button"
                aria-label="Previous"
              >
                <LeftArrowIcon />
              </button>

              <button
                ref={nextButtonRef}
                className="ondemand-custom-glider-next tw-flex tw-justify-center tw-items-center"
                type="button"
                aria-label="Next"
              >
                <RightArrowIcon />
              </button>
            </div>
          </div>
        )}

        {/* PRICE BUTTON DESKTOP */}
        <div
          className={`tw-flex tw-w-2/6 tw-items-start ${
            selected ? "md:tw-block tw-hidden" : "md:tw-block tw-block"
          }`}
        >
          <button
            type="button"
            className={`tw-w-full tw-whitespace-nowrap tw-font-bold tw-py-3 lg:tw-px-8 md:tw-px-4 tw-h-[50px] tw-rounded-lg ${
              selected
                ? "tw-bg-primary tw-text-white tw-border-2 tw-border-[#FFBABA] tw-mt-6 md:tw-text-lg tw-text-sm"
                : "tw-bg-transparent tw-text-black tw-border-2 tw-border-black md:tw-mt-6 tw-mt-0 xs:tw-text-xl md:tw-text-lg tw-text-sm mt-2 md:mt-0"
            }`}
            onClick={onChange}
          >
            ${formatPrice(subTotalPrice)}
          </button>
        </div>
      </div>

      {selected && (
        <div className="md:tw-hidden tw-block tw-my-3">
          <>
            <h3 className="tw-text-primary tw-text-2xl tw-font-bold tw-mb-9">
              Your {name} package includes:
            </h3>

            <IncludedItems items={included} />
          </>
        </div>
      )}

      {/* ICONS MOBILE */}
      <div className="tw-relative tw-block md:tw-hidden">
        {selected ? (
          <Icon
            icon="lets-icons:check-fill"
            width={18}
            height={18}
            color="#FD6F6E"
            className="tw-absolute tw-bottom-0 tw-right-0"
          />
        ) : (
          <Icon
            icon="ei:check"
            width={18}
            height={18}
            color="#CBD5E1"
            className="w-p-3 tw-ml-auto tw-w-fit"
          />
        )}
      </div>

      {/* ICONS DESKTOP */}
      <div className="md:tw-block tw-hidden md:w-p-3 tw-ml-auto tw-w-fit">
        {selected ? (
          <Icon icon="lets-icons:check-fill" width={18} height={18} color="#FD6F6E" />
        ) : (
          <Icon icon="ei:check" width={18} height={18} color="#CBD5E1" />
        )}
      </div>
    </label>
  );
};

export default OptionBox;
