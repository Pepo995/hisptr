"use client";

const Reviews = ({ className }: { className: string }) => (
  <div className="tw-flex tw-items-center md:tw-flex-row tw-flex-col md:tw-max-h-[400px]">
    <div className="tw-flex tw-gap-y-6 md:tw-flex-row md:tw-justify-between tw-flex-col tw-w-full 2xl:tw-px-56 lg:tw-px-24 md:tw-px-16 tw-px-4 tw-py-8 tw-bg-primary tw-text-white md:tw-h-full">
      <p
        className={`${className} tw-font-medium xl:tw-text-4xl lg:tw-text-3xl md:tw-text-2xl tw-text-3xl md:tw-w-[50%]`}
      >
        Hipstr has been making lasting memories for 11+ years.{" "}
      </p>

      <div className="tw-flex lg:tw-gap-9 tw-gap-4 tw-px-3 lg:tw-px-0 tw-justify-between md:tw-w-[50%] lg:tw-w-[45%]">
        <div className="tw-flex tw-flex-col tw-items-center">
          <p className="tw-font-GoodHeadlinePro tw-font-bold xl:tw-text-4xl lg:tw-text-3xl tw-text-2xl">
            1,000+
          </p>

          <p className="tw-font-GoodHeadlinePro tw-font-medium xl:tw-text-lg tw-text-xs">
            5-Star reviews
          </p>
        </div>

        <div className="tw-flex tw-flex-col tw-items-center">
          <p className="tw-font-GoodHeadlinePro tw-font-bold xl:tw-text-4xl lg:tw-text-3xl tw-text-2xl">
            800K+
          </p>

          <p className="tw-font-GoodHeadlinePro tw-font-medium xl:tw-text-lg tw-text-xs">
            Delighted guests
          </p>
        </div>

        <div className="tw-flex tw-flex-col tw-items-center">
          <p className="tw-font-GoodHeadlinePro tw-font-bold xl:tw-text-4xl lg:tw-text-3xl tw-text-2xl">
            3 MILLION
          </p>

          <p className="tw-font-GoodHeadlinePro tw-font-medium xl:tw-text-lg tw-text-xs">
            Moments captured
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Reviews;
