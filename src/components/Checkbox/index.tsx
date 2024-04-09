import clsx from "clsx";

type Props = {
  id: string;
  name: string;
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  light?: boolean;
  white?: boolean;
  inter?: boolean;
  black?: boolean;
};

const Checkbox = ({
  id,
  name,
  label,
  onChange,
  children,
  checked,
  light = false,
  white = false,
  inter = true,
  black = false,
}: Props) => {
  return (
    <div
      className={`${white ? "tw-items-center tw-h-min" : "tw-items-start"}
      ${inter ? "tw-font-inter" : ""} tw-relative tw-flex`}
    >
      <div className="tw-flex tw-h-6 tw-items-center tw-text-white">
        <input
          id={id}
          name={name}
          onChange={onChange}
          checked={checked}
          type="checkbox"
          className={`tw-relative tw-peer tw-shrink-0 tw-appearance-none tw-w-6 tw-h-6 tw-border-2 ${
            white
              ? "tw-border-white tw-bg-transparent "
              : "tw-border-primary checked:tw-bg-primary tw-bg-white focus:tw-ring-primary checked:tw-border-0 tw-rounded-sm"
          } tw-mt-1 focus:tw-outline-none focus:tw-ring-offset-1 focus:tw-ring-2 disabled:tw-border-steel-400 disabled:tw-bg-steel-400`}
        />

        <svg
          className="tw-absolute tw-w-6 tw-h-6 tw-mt-1 tw-hidden peer-checked:tw-block tw-pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div className="tw-ml-3 tw-leading-6">
        {label !== undefined ? (
          <label
            htmlFor={id}
            className={clsx({
              "tw-text-black tw-font-medium": black,
              "tw-text-gray-900 tw-font-medium": !light && !black,
              "tw-text-gray-600": light,
              "tw-text-white": white,
            })}
          >
            {label}
          </label>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Checkbox;
