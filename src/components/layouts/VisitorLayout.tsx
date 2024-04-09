import VisitorHeader from "@components/VisitorHeader/VisitorHeader";
import ZendeskClient from "@components/ZendeskClient";
import { type ReactElement } from "react";

type LayoutProps = {
  children: ReactElement;
};

const VisitorLayout = ({ children, ...props }: LayoutProps) => (
  <div
    {...props}
    className="sm:tw-bg-slate-custom sm:tw-h-screen h-full tw-bg-white tw-font-montserrat"
  >
    <VisitorHeader />
    <div className="tw-w-5/6 tw-bg-white tw-mx-auto tw-mt-2    sm:tw-rounded-2xl sm:tw-p-12 sm:tw-shadow-sm sm:tw-mt-20">
      {children}
    </div>

    <ZendeskClient />
  </div>
);

export default VisitorLayout;
