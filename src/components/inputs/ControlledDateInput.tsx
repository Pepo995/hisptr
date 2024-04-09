import AlertIcon from "@components/icons/Alert";
import { type ChangeEventHandler } from "react";

type ControlledDateProps = {
  label?: string;
  name: string;
  error?: string;
  defaultValue?: string;
  isTouched: boolean;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  inputStyles?: string;
  errorStyles?: string;
};

const ControlledDateInput = ({
  label,
  name,
  error,
  defaultValue,
  isTouched,
  placeholder,
  onChange,
  inputStyles,
  errorStyles,
}: ControlledDateProps) => {
  const errorClassName =
    "tw-bg-red-100 tw-text-red-alert tw-placeholder-red-alert tw-border-red-alert";

  return (
    <>
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

      <div className="tw-relative">
        <input
          name={name}
          type="date"
          defaultValue={defaultValue}
          placeholder={placeholder}
          id={name}
          className={`form-control tw-focus:z-10 tw-disabled:pointer-events-none tw-opacity-100 tw-w-full ${
            inputStyles ? inputStyles : "tw-cursor-pointer tw-py-3 tw-px-4 tw-rounded-md"
          } ${error && isTouched ? errorClassName : ""}`}
          onChange={onChange}
        />
        <div className="tw-absolute tw-inset-y-0 tw-end-0 tw-flex tw-items-center tw-pointer-events-none tw-z-20 tw-pe-4">
          <span className={`cursor-pointer${error && isTouched ? errorClassName : ""}`}></span>
        </div>
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
    </>
  );
};

export default ControlledDateInput;
