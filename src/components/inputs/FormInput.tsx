import { Field, type FormikValues, useFormikContext } from "formik";
import AlertIcon from "@components/icons/Alert";
import { type ReactNode } from "react";
import { NumericFormat, PatternFormat } from "react-number-format";

type FormInputProps = {
  label?: string;
  name: string;
  error?: string;
  isTouched: boolean;
  placeholder?: string;
  secondLabel?: string;
  type?: "text" | "number" | "textarea" | "password";
  className?: string;
  inputStyles?: string;
  mask?: string;
  numericMaskInfo?: { defaultValue: number };
  errorStyles?: string;
  customSecondLabel?: ReactNode;
  enabled?: boolean;
};

const FormInput = <T extends FormikValues>({
  label,
  name,
  error,
  isTouched,
  placeholder,
  secondLabel,
  type = "text",
  className,
  inputStyles,
  mask,
  numericMaskInfo,
  errorStyles,
  customSecondLabel,
  enabled = true,
}: FormInputProps) => {
  const { setFieldValue } = useFormikContext<T>();

  const fieldClassName = `input-group form-control ${inputStyles}${
    error && isTouched
      ? " tw-bg-red-100 tw-text-red-alert tw-placeholder-red-alert tw-border-red-alert"
      : ""
  }`;

  return (
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
        {mask ? (
          <PatternFormat
            format={mask}
            data-cy="phone"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue(name, e.target.value)
            }
            id={name}
            placeholder={placeholder}
            className={fieldClassName}
          />
        ) : !!numericMaskInfo ? (
          <NumericFormat
            value={numericMaskInfo.defaultValue}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              void setFieldValue(
                name,
                e.target.value
                  ? parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""))
                  : 0,
              )
            }
            id={name}
            placeholder={placeholder}
            className={fieldClassName}
          />
        ) : (
          <Field
            name={name}
            id={name}
            placeholder={placeholder}
            className={fieldClassName}
            type={type}
            as={type === "textarea" ? "textarea" : "input"}
            disabled={!enabled}
          />
        )}

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

        {customSecondLabel && customSecondLabel}
      </div>

      <div className="tw-relative">
        {error && isTouched ? (
          <div className="tw-mt-2 tw-flex tw-absolute tw-top-0">
            <AlertIcon />
            <span
              className={`${
                errorStyles ? errorStyles : "tw-text-red-alert"
              }  tw-whitespace-nowrap error-msg tw-ml-2 tw-text-sm`}
            >
              {error}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FormInput;
