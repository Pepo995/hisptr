import React from "react";
import LogoBlack from "@components/icons/LogoBlack";

import Link from "next/link";

const selectedClassName =
  "tw-py-1.5 tw-px-3.5 tw-cursor-pointer tw-bg-primary tw-w-fit tw-rounded-lg tw-h-min tw-min-h-min tw-mb-0 hover:tw-bg-primary md:tw-text-lg tw-tw-text-sm tw-text-white";

const VisitorHeader = ({
  withAuth,
  selectedPath = "/signup",
}: {
  withAuth?: boolean;
  selectedPath?: string;
}) => (
  <header>
    <nav className="tw-shadow-md tw-shadow-slate-shadow tw-p-5 tw-bg-white tw-flex tw-justify-between">
      <Link href="/">
        <LogoBlack />
      </Link>

      {withAuth && (
        <div className="tw-flex tw-gap-x-3 tw-items-center">
          <Link href="/signin" className="md:tw-text-lg tw-tw-text-sm">
            <button className={selectedPath === "/signin" ? selectedClassName : ""}>Sign In</button>
          </Link>
        </div>
      )}
    </nav>
  </header>
);

export default VisitorHeader;
