import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "danger" | "phantom" | "black";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  outline?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  type?: "button" | "submit";
};

const Button = ({
  children,
  variant,
  size = "lg",
  outline = false,
  onClick,
  disabled = false,
  loading = false,
  title,
  type = "button",
}: Props) => (
  <button
    className={clsx("tw-rounded-md focus:tw-ring-2 focus:tw-outline-none tw-shadow-sm", {
      "tw-bg-primary tw-rounded-md tw-font-semibold tw-text-white tw-border tw-border-transparent focus:tw-ring-offset-2 focus:tw-ring-primary":
        variant === "primary",
      "tw-bg-black tw-rounded-md tw-font-medium tw-text-white tw-border tw-border-transparent focus:tw-ring-offset-2 focus:tw-ring-primary":
        variant === "black",
      "tw-bg-white tw-text-primary tw-font-semibold tw-border tw-border-primary focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-primary":
        variant === "secondary",
      "tw-bg-white tw-text-red-600 tw-font-semibold tw-border tw-border-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-red-600":
        variant === "danger",
      "tw-border-gray-300 tw-text-gray-900": variant === "phantom",
      "tw-border-primary tw-text-primary": outline,
      "tw-text-xs tw-px-2 tw-py-1 ": size === "xs",
      "tw-text-sm tw-px-2 tw-py-1 ": size === "sm",
      "tw-text-sm tw-px-2.5 tw-py-1.5": size === "md",
      "tw-text-sm tw-px-3 tw-py-2": size === "lg",
      "tw-text-sm tw-px-3.5 tw-py-2.5": size === "xl",
      "tw-text-base tw-px-4 tw-py-2.5": size === "2xl",
    })}
    onClick={onClick}
    disabled={disabled || loading}
    title={title}
    type={type}
  >
    {children}
  </button>
);

export default Button;
