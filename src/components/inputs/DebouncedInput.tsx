import { type ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

type DebouncedInputProps = {
  id?: string;
  onDebounce: (text: string) => void;
  text?: string;
  className?: string;
  placeholder?: string;
  autofocus?: boolean;
};

const DebouncedInput = ({
  id,
  onDebounce,
  text,
  className,
  placeholder,
  autofocus = false,
}: DebouncedInputProps) => {
  const [value, setValue] = useState(text ?? "");
  const debouncedValue = useDebounce(value, 500);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  useEffect(() => {
    if (debouncedValue !== (text ?? "")) onDebounce(debouncedValue);
  }, [debouncedValue, text, onDebounce]);

  return (
    <input
      id={id}
      defaultValue={text}
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      className={className}
      autoFocus={autofocus}
    />
  );
};

export default DebouncedInput;
