"use client";
import Link from "next/link";
import Logo from "@images/logo/hipstr-logo.webp";
import SocialIcons from "@components/SocialIcons";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import Image from "next/image";

const pageFont = localFont({
  src: [
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-bold.ttf",
      weight: "600",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-news.otf",
      weight: "500",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro.otf",
      weight: "400",
    },
    {
      path: "../../fontface/good-headline-pro/goodheadlinepro-light.otf",
      weight: "200",
    },
  ],
});

const scrolltoHash = function(element_id: string) {
  const element = document.getElementById(element_id);
  element?.scrollIntoView({
    behavior: "instant",
    block: "start",
    inline: "nearest",
  });
};

const Footer = () => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    if (isMounted && window.location.hash.toLowerCase() === "#experience") {
      setTimeout(() => {
        scrolltoHash("experience");
      }, 100);
    } else {
      setMounted(true);
    }
  }, [isMounted]);

  return (
    <div className={`${pageFont.className} tw-w-full tw-bg-black md:tw-h-[500px] tw-text-white`}>
      <footer className="md:tw-py-12 tw-py-3 tw-px-5 tw-h-full tw-flex tw-flex-col">
        <div className="tw-flex md:tw-flex-row tw-flex-col tw-justify-between tw-h-fit md:tw-w-11/12 tw-w-full tw-mx-auto">
          <div className="tw-flex">
            <div className="tw-w-full md:tw-px-5">
              <Link href="/" className="tw-justify-self-start tw-items-self-start tw-h-9">
                <Image
                  src={Logo.src}
                  alt="hipstr"
                  width={110}
                  height={36}
                  className="tw-hidden md:tw-block"
                />
                <Image
                  src={Logo.src}
                  alt="hipstr"
                  width={60}
                  height={19}
                  className="tw-block md:tw-hidden"
                />
              </Link>

              <Link href="https://calendly.com/bookhipstr">
                <button className="custom-btn9 tw-h-fit tw-min-h-min tw-p-1 tw-w-fit md:tw-mt-6 tw-mt-3">
                  SCHEDULE A CALL
                </button>
              </Link>
            </div>

            <div className="md:tw-hidden tw-block">
              <SocialIcons isMobile />
            </div>
          </div>

          <div className="md:tw-w-2/5 md:tw-mt-0 tw-mt-5 tw-w-5/6 tw-text-xs md:tw-text-lg tw-max-w-full md:tw-px-5 tw-flex tw-justify-between tw-font-thin tw-gap-x-3">
            <div className="tw-flex tw-flex-col md:tw-gap-y-0 tw-gap-y-3">
              {!isMounted ? (
                <p>EXPERIENCES</p>
              ) : (
                <a
                  className="tw-text-white tw-cursor-pointer"
                  href={`${window.location.origin}/#experience`}
                >
                  EXPERIENCES
                </a>
              )}

              <a href="mailto:press@bookhipstr.com" className="tw-text-white">
                PRESS
              </a>

              {/*
            <Link href="/faq" className="tw-text-white">
              FAQs
            </Link> */}

              <a
                href="https://gallery.bookhipstr.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-white"
              >
                GALLERY
              </a>

              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-white"
              >
                BLOG
              </a>
            </div>

            <div className="tw-flex tw-flex-col md:tw-gap-y-0 tw-gap-y-3">
              <Link href="/contact-us" className="tw-text-white">
                CONTACT US
              </Link>

              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://bookhipstr.com/franchise"
                className="tw-text-white"
              >
                FRANCHISING
              </a>

              <a href="mailto:careers@bookhipstr.com" className="tw-text-white">
                CAREERS
              </a>

              <a href="mailto:operations@bookhipstr.com" className="tw-text-white">
                BECOME A HIPSTR PARTNER
              </a>
            </div>
          </div>
        </div>

        <div className="tw-justify-self-end tw-flex tw-flex-col tw-items-center tw-h-fit md:tw-mt-auto tw-mt-7">
          <p className="tw-uppercase tw-text-center tw-font-thin tw-text-[10px] md:tw-text-base tw-py-5 tw-border-b tw-border-white tw-w-full">
            Atlanta · Austin · Boston · Charleston · Chicago · Cincinnati · Columbus · Dallas ·
            Denver · Detroit · Grand Rapids · Houston · Indianapolis · Kansas City · Las Vegas ·
            Louisville · Miami · Milwaukee · Minneapolis · Nashville · New Haven · New Orleans · New
            York City · Orlando · Philadelphia · Phoenix · Portland · Raleigh · Salt Lake
            City&nbsp;·&nbsp;San
            Francisco&nbsp;·&nbsp;Seattle&nbsp;·&nbsp;Tampa&nbsp;·&nbsp;Washington DC
          </p>

          <p className="md:tw-text-sm tw-text-[8px] tw-p-5 tw-text-center">
            © 2024 Hipstr Inc. All rights reserved.
          </p>

          <div className="md:tw-block tw-hidden">
            <SocialIcons />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
