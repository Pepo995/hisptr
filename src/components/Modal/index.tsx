import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@components/Button";

import clsx from "clsx";

type Props = {
  title: string;
  open: boolean;
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  acceptText?: string;
  cancelText?: string;
  size?: "sm" | "md" | "lg";
};

const Modal = ({
  title,
  children,
  onConfirm,
  onCancel,
  acceptText,
  cancelText,
  open,
  setOpen,
  size = "md",
}: Props) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="tw-relative tw-z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="tw-ease-out tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leave="tw-ease-in tw-duration-200"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-fixed tw-inset-0 tw-bg-gray-500 tw-bg-opacity-75 tw-transition-opacity" />
        </Transition.Child>

        <div className="tw-fixed tw-inset-0 tw-z-10 tw-w-screen tw-overflow-y-auto">
          <div className="tw-flex tw-min-h-full tw-items-end tw-justify-center tw-p-4 tw-text-center sm:tw-items-center sm:tw-p-0">
            <Transition.Child
              as={Fragment}
              enter="tw-ease-out tw-duration-300"
              enterFrom="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
              enterTo="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leave="tw-ease-in tw-duration-200"
              leaveFrom="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leaveTo="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-bg-white tw-px-4 tw-pb-4 tw-pt-5 tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8 sm:tw-p-6",
                  {
                    "sm:tw-w-full sm:tw-max-w-lg": size === "sm",
                    "sm:tw-w-full sm:tw-max-w-2xl": size === "md",
                    "sm:tw-w-full sm:tw-max-w-4xl": size === "lg",
                  },
                )}
              >
                <div>
                  <div className="tw-text-center sm:tw-mt-5">
                    <Dialog.Title
                      as="h3"
                      className="tw-text-base tw-font-semibold tw-leading-6 tw-text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="tw-mt-2">{children}</div>
                  </div>
                </div>
                <div className="tw-flex tw-mt-5 sm:tw-mt-6 sm:tw-grid sm:tw-grid-flow-row-dense sm:tw-grid-cols-2 tw-gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel?.();
                      setOpen(false);
                    }}
                  >
                    {cancelText ?? "Cancel"}
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirm?.();
                      setOpen(false);
                    }}
                  >
                    {acceptText ?? "Accept"}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
