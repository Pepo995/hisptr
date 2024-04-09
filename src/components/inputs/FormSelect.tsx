"use client";
import AlertIcon from "@components/icons/Alert";
import type { SelectNumericOption, SelectOption } from "@types";

import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Field, type FieldProps } from "formik";

import { ChevronUp } from "react-feather";

type FormSelectProps = {
  label?: string;
  name: string;
  error?: string;
  isTouched: boolean;
  placeholder?: string;
  onChange?: (newValue: string | number) => void;
  options?: (SelectOption | SelectNumericOption)[];
  secondLabel?: string;
  className?: string;
  inputStyles?: string;
  errorStyles?: string;
};

const FormSelect = ({
  label,
  name,
  error,
  isTouched,
  placeholder,
  options,
  secondLabel,
  onChange,
  className,
  inputStyles,
  errorStyles,
}: FormSelectProps) => (
  <div className={className}>
    {label && (
      <label
        className={`tw-text-black tw-font-bold tw-mb-2${
          error && isTouched ? " tw-text-red-alert tw-placeholder-red-alert" : ""
        }`}
        htmlFor={name}
      >
        {label}
      </label>
    )}

    <div>
      <Field name={name} id={name}>
        {({ field }: FieldProps<string | number>) => (
          <Listbox name={name} value={field.value} onChange={(v) => onChange?.(v)}>
            <div className="tw-relative">
              <Listbox.Button
                className={`input-group form-control ${inputStyles} ${
                  error && isTouched
                    ? " tw-bg-red-100 tw-text-red-alert tw-placeholder-red-alert tw-border-red-alert"
                    : ""
                }`}
              >
                {({ open }) => (
                  <>
                    <span className="tw-block tw-truncate">
                      {field.value
                        ? options?.find((option) => option.value === field.value)?.label
                        : placeholder}
                    </span>
                    <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                      <ChevronUp
                        className={`transition-all tw-h-5 tw-w-5 tw-text-gray-400 ${
                          open ? "" : "tw-rotate-180"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </>
                )}
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="tw-transition tw-ease-in tw-duration-100"
                leaveFrom="tw-opacity-100"
                leaveTo="tw-opacity-0"
              >
                <Listbox.Options className="tw-pl-0 tw-z-10 tw-absolute tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black/5 focus:tw-outline-none sm:tw-text-sm">
                  {options?.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `tw-relative tw-cursor-default tw-select-none tw-p-4 ${
                          active ? "tw-bg-primary tw-text-white" : "tw-text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span
                          className={`tw-block tw-truncate ${
                            selected ? "tw-font-medium" : "tw-font-normal"
                          }`}
                        >
                          {option.label}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        )}
      </Field>

      {secondLabel && (
        <label
          className={`tw-text-black tw-text-base tw-mt-2${
            error && isTouched ? " tw-text-red-alert tw-placeholder-red-alert" : ""
          }`}
          htmlFor={name}
        >
          {secondLabel}
        </label>
      )}
    </div>

    <div className="tw-relative">
      {error && isTouched ? (
        <div className="tw-mt-2 tw-flex tw-absolute tw-top-0">
          <AlertIcon />
          <span
            className={`${
              errorStyles ? errorStyles : "tw-text-red-alert"
            }  error-msg tw-ml-2 tw-text-sm`}
          >
            {error}
          </span>
        </div>
      ) : null}
    </div>
  </div>
);

export default FormSelect;
