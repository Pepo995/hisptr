"use client";

import Glider from "react-glider";
import StarRatings from "./StartsRating";

import { useCallback, useEffect, useRef, useState } from "react";

import type GliderType from "glider-js";

import "glider-js/glider.min.css";

import "./styles.css";
import Loading from "./Loading";
import { useIsMobile } from "@hooks/useIsMobile";
import QuoteIcon from "./QuoteIcon";

const TestimonialList = [
  {
    content:
      "“Hipstr were super easy to work with, very responsive, and overall did a great job with our photo booth. Very happy we went with them and definitely would recommend to anyone who wants a photo booth at their wedding.”",
    owner: "Jason W.",
  },
  {
    content:
      "“We are SO happy with how everything from our photobooth turned out. The Hipstr team was easy to contact and the photos/gifs all turned out beautifully! The team was awesome and I would highly recommend using them.”",
    owner: "Rayann A.",
  },
  {
    content:
      "“Probably the best thing I had at my wedding. Professional and fun. Would definitely hire again ❤️”",
    owner: "Candis V.",
  },
  {
    content:
      "“I had to scramble to find a substitute at the last minute for a Photobooth and this was the first company that I contacted and the last! The deal, professionalism and ease working with them was great. Very organized and worked seamlessly with our venue. Even had a surprise album of photos of our guests that they had them sign! Couldn’t have been happier!”",
    owner: "Emilee C.",
  },
  {
    content:
      "“The photo booth was such a hit at our wedding! The staff were very professional, on time, and very helpful throughout the evening! We loved all the photos and would definitely recommend using Hipstr in the future.”",
    owner: "Julie S.",
  },
  {
    content:
      "“Customer service, quality and variety definitely exceeded our expectations. Great value vendor! Glad we worked with Hipstr for our wedding.”",
    owner: "Shoshana H",
  },
  {
    content:
      "“Everything was amazing! This is the second time we have used them for our Sweetheart Dance. I appreciate all the hard work they put in! Great job!”",
    owner: "Lindsy P.",
  },
  {
    content:
      "“Hipstr did a marvelous job in the Photo Booth for my daughter’s wedding. The host engaged all the guests throughout. Everyone was going up multiple times to take photos. It was a huge hit. Our host made sure people posted a double of the photos in a little book with a written message from each guest for the bride and groom. So wonderful. I highly recommend Hipstr for any event!!”",
    owner: "Gail L.",
  },
  {
    content:
      "“I always knew I wanted a big photo booth with props and printed photos to go into a book for my wedding, and I found that and more with Hipstr. The photo booth was so fun and colorful, all of our guests loved it. The operator was very kind and the space was super organized. I would definitely recommend!”",
    owner: "Kasey P.",
  },
  {
    content:
      "“Hipstr made the planning process so easy for my husband and I!! Everyone raved about how much fun they had with the photobooth at our wedding. Hipstr team was also very professional and so friendly during the event and also throughout the back and forth emailing during the months leading up to the wedding. I would book Hipstr again in a heartbeat. So much fun!”",
    owner: "Elisa A.",
  },
  {
    content:
      "“The team was so amazing from start to finish. We remained in communication throughout the design process right up until the day of our event. Everyone was so kind and would definitely book again for future events!”",
    owner: "Sydney B.",
  },
];

const MAX = TestimonialList.length - 1;
const INTERVAL = 5000;

const Testimonial = ({ className }: { className?: string }) => {
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotsElement = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState(false);

  const isMobile = useIsMobile();

  const callbackRef = useCallback((glider: GliderType) => {
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
      }
    }
  }, []);

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
    <div className={`${className} md:tw-mt-20 tw-mt-5`}>
      <h3 className={`${className} tw-text-center tw-text-4xl md:tw-text-6xl tw-font-medium`}>
        Happy customers all over the country
      </h3>

      <div className={`${className} tw-px-3 tw-relative tw-mb-6`}>
        {isReady ? (
          <Glider
            className="glider-container"
            draggable
            hasArrows={isMobile ? false : true}
            dots={dotsElement.current}
            slidesToShow={isMobile ? 1 : 3}
            scrollLock
            ref={callbackRef}
          >
            {TestimonialList.map(({ content, owner }, index) => (
              <div
                style={{
                  backgroundSize: "cover",
                }}
                className="tw-flex tw-flex-col tw-mt-10 md:tw-mb-28 tw-mb-12 lg:tw-px-6 md:tw-px-2 tw-max-h-96"
                key={index}
              >
                <div className="tw-border-2 tw-border-gray-200 tw-h-full">
                  <div className="tw-flex tw-flex-col tw-p-4 tw-h-full">
                    <div className="tw-shrink tw-flex tw-flex-col">
                      <div className="tw-hidden md:tw-block">
                        <QuoteIcon />
                      </div>

                      <div className="md:tw-overflow-auto md:tw-h-64 tw-overflow-hidden tw-h-36 tw-w-full tw-flex tw-items-center">
                        <p className="md:tw-line-clamp-none md:tw-p-0 md:tw-mt-2 tw-text-xl tw-font-normal tw-line-clamp-5 tw-p-4">
                          {content}
                        </p>
                      </div>
                    </div>

                    <div className="tw-grow tw-w-full"></div>

                    <div className="tw-flex-none tw-flex md:tw-flex-col lg:tw-flex-row tw-justify-between tw-items-center tw-mt-auto">
                      <p className="tw-text-lg tw-mt-5">{owner}</p>

                      <div className="tw-mt-2">
                        <StarRatings />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Glider>
        ) : (
          <Loading />
        )}
        <div
          className="glider-dots tw-absolute tw-bottom-0 md:tw-pb-16 tw-pb-2 tw-w-full"
          ref={dotsCallbackRef}
        />
      </div>
    </div>
  );
};

export default Testimonial;
