"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Menu as HamburguerMenu } from "react-feather";

type Items = {
  name: string;
  description: string;
  url: string;
};

const NavbarDropdown = ({ buttonText, items }: { buttonText: string; items: Items[] }) => (
  <Menu as="div" className="tw-relative tw-inline-block tw-text-left">
    <div>
      <Menu.Button className="tw-text-center tw-items-center tw-justify-center tw-flex tw-text-xl tw-not-italic tw-font-normal tw-text-white tw-border-white md:tw-border-[1px] tw-border-solid tw-rounded-lg">
        <div className="custom-btn8-primary tw-border-0 tw-border-transparent md:tw-text-xl tw-tw-text-sm tw-h-min tw-min-h-min md:tw-block tw-hidden tw-mb-0">
          {buttonText}
        </div>

        <HamburguerMenu className="md:tw-hidden tw-block" />
      </Menu.Button>
    </div>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="tw-absolute md:tw-right-0 -tw-right-11 md:-tw-mt-2 -tw-mt-3 md:tw-w-64 tw-w-52 tw-origin-top-right tw-rounded-md md:tw-shadow-lg focus:tw-outline-none tw-z-30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="232"
          height="37"
          viewBox="0 0 232 10"
          fill="none"
          className="tw-w-full"
        >
          <path d="M0 14.9625H162.553L174.954 0L187.355 14.9625H232V52H0V14.9625Z" fill="#FD6F6E" />
        </svg>

        <div className="tw-pt-1 tw-flex tw-flex-col tw-w-full -tw-mt-2">
          {items.map((item, index, array) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <a
                  href={item.url}
                  className={`${active ? "tw-bg-primary " : "md:tw-bg-black/70 tw-bg-black/80"} ${index !== array.length - 1 ? "tw-mb-px" : ""
                    } tw-block tw-w-full tw-px-4 tw-py-1 tw-font-light`}
                >
                  <p className="md:tw-text-lg tw-text-sm tw-text-white tw-uppercase">{item.name}</p>
                  <p className="md:tw-text-[11px] tw-text-[9px] tw-text-[#ffffff80] tw-m-0 tw-uppercase">
                    {item.description}
                  </p>
                </a>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);

export default NavbarDropdown;
