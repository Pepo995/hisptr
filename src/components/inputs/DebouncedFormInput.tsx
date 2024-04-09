import AlertIcon from "@components/icons/Alert";
import DebouncedInput from "./DebouncedInput";

type DebouncedFormInputProps = {
  name: string;
  error?: string;
  isTouched: boolean;
  placeholder?: string;
  secondLabel?: string;
  text?: string;
  onDebounce: (text: string) => void;
};

const DebouncedFormInput = ({
  name,
  error,
  isTouched,
  placeholder,
  secondLabel,
  text,
  onDebounce,
}: DebouncedFormInputProps) => (
  <>
    <div>
      <DebouncedInput
        id={name}
        placeholder={placeholder}
        className={`input-group form-control ${
          error && isTouched
            ? " tw-bg-red-100 tw-text-red-alert tw-placeholder-red-alert tw-border-red-alert"
            : ""
        }`}
        text={text}
        onDebounce={onDebounce}
      />

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
          <span className="tw-text-red-alert tw-whitespace-nowrap error-msg tw-ml-2 tw-text-sm">
            {error}
          </span>
        </div>
      ) : null}
    </div>
  </>
);

export default DebouncedFormInput;
