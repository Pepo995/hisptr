import Flatpickr from "react-flatpickr";
import { type Hook } from "flatpickr/dist/types/options";
import AlertIcon from "@components/icons/Alert";

type FormDateProps = {
  label?: string;
  name: string;
  error?: string;
  defaultValue?: string;
  isTouched: boolean;
  placeholder?: string;
  onChange?: Hook;
  minDate?: string;
  inputStyles?: string;
  errorStyles?: string;
};

const FormDateInput = ({
  label,
  name,
  error,
  defaultValue,
  isTouched,
  placeholder,
  onChange,
  minDate = "today",
  inputStyles,
  errorStyles,
}: FormDateProps) => {
  const errorClassName =
    "tw-bg-red-100 tw-text-red-alert tw-placeholder-red-alert tw-border-red-alert";

  return (
    <>
      <label
        className={`tw-text-black tw-font-bold tw-mb-2${
          error && isTouched ? " tw-text-red-alert tw-placeholder-red-alert" : ""
        }`}
        htmlFor={name}
      >
        {label}
      </label>

      <div className="tw-relative">
        <Flatpickr
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          id={name}
          className={`form-control tw-cursor-pointer  tw-focus:z-10 tw-disabled:pointer-events-none ${
            inputStyles
              ? inputStyles
              : "tw-py-3 tw-px-4 tw-block tw-w-full tw-rounded-md tw-opacity-100"
          } ${error && isTouched ? errorClassName : ""}`}
          onChange={onChange}
          options={{
            minDate,
          }}
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

export default FormDateInput;
