import { type ReactNode } from "react";

type DisclaimerProps = { image: ReactNode; text: string };

const Disclaimer = ({ image, text }: DisclaimerProps) => (
  <div className="tw-rounded-md tw-flex tw-py-5 tw-bg-slate-50 tw-gap-3 tw-pl-3 tw-pr-4 lg:tw-gap-7 lg:tw-pl-6 lg:tw-pr-12">
    <div className="tw-flex tw-min-w-[48px] tw-my-auto">{image}</div>
    <span className="tw-font-thin tw-font-montserrat tw-my-auto tw-text-slate-600 tw-text-base sm:tw-text-sm lg:tw-text-base">
      {text}
    </span>
  </div>
);

export default Disclaimer;
