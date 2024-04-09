import { type FC, type ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  tooltip?: string;
}

const visibility =
  "tw-invisible group-hover:tw-visible opacity-0 group-hover:tw-opacity-100 tw-transition";
const presentation = "tw-bg-black text-white p-0.5 tw-rounded tw-px-1 tw-text-sm";
const position = "tw-absolute tw-top-full tw-mt-2 tw-whitespace-pre-wrap tw-z-10 tw-text-center";
const toolTipWidth = "tw-w-72 tw-min-w-24";
const padding = "tw-p-3";

const ToolTip: FC<Props> = ({ children, tooltip }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={container}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !container.current) return;
        const { left } = container.current.getBoundingClientRect();
        tooltipRef.current.style.left = clientX - left + "px";
      }}
      className="tw-group tw-relative tw-inline-block"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className={`${visibility} ${presentation} ${position} ${toolTipWidth} ${padding}`}
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
};

export default ToolTip;
