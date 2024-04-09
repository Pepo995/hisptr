import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Icon } from "@iconify/react";

type ClearableDebouncedInputProps = {
  id?: string;
  onDebounce: (text: string) => void;
  text?: string;
  inputClassName?: string;
  containerClassName?: string;
  placeholder?: string;
  autofocus?: boolean;
};

const ClearableDebouncedInput = ({
  id,
  onDebounce,
  text,
  inputClassName,
  containerClassName,
  placeholder,
  autofocus = false,
}: ClearableDebouncedInputProps) => {
  const [value, setValue] = useState(text ?? "");

  const debouncedValue = useDebounce(value, 500);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  useEffect(() => {
    if (debouncedValue !== (text ?? "")) onDebounce(debouncedValue);
  }, [debouncedValue, text, onDebounce]);

  useEffect(() => {
    if (text === "") {
      setValue("");
    }
  }, [text]);

  return (
    <div className={`tw-relative ${containerClassName}`}>
      <input
        id={id}
        value={value}
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className={inputClassName}
        autoFocus={autofocus}
      />

      {debouncedValue !== "" && (
        <Icon
          icon="iconamoon:close"
          className="tw-absolute tw-cursor-pointer tw-top-3 tw-right-2.5"
          onClick={() => {
            setValue("");
          }}
          width={20}
          height={20}
        />
      )}
    </div>
  );
};

export default ClearableDebouncedInput;
