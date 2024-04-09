import * as React from "react";
import advancedFormat from "dayjs/plugin/advancedFormat";
import Flatpickr from "react-flatpickr";
import { Icon } from "@iconify/react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(advancedFormat);
dayjs.extend(utc);

export type DateRange = {
  from: Date | undefined;
  to?: Date;
};

type DatePickerWithRangeProps = {
  date?: DateRange;
  setDate: (date?: DateRange) => void;
  placeholder: string;
  isClearable?: boolean;
};

export const DatePickerWithRange = ({
  className,
  setDate,
  placeholder,
  isClearable = false,
}: React.HTMLAttributes<HTMLDivElement> & DatePickerWithRangeProps) => {
  const [innerDate, setInnerDate] = React.useState<DateRange | undefined>(undefined);

  const refComp = React.useRef<Flatpickr>(null);

  return (
    <div className={`tw-relative ${className}`}>
      <Flatpickr
        ref={refComp}
        name="event_date"
        placeholder={placeholder}
        id="event_date"
        className="form-control"
        onChange={(date) => {
          const [from, to] = date;
          setInnerDate({
            from,
            to,
          });
        }}
        options={{
          mode: "range",
          defaultDate: innerDate?.from,
          dateFormat: "m-d-Y",
        }}
        onClose={(date) => {
          const [from, to] = date;
          if (from && to) {
            setDate({
              from,
              to,
            });
          } else {
            setDate(undefined);
          }
        }}
      />

      {isClearable && innerDate?.from !== undefined && (
        <Icon
          icon="iconamoon:close"
          className="tw-absolute tw-cursor-pointer tw-top-3 tw-right-2.5"
          onClick={() => {
            setDate(undefined);
            setInnerDate(undefined);
            refComp?.current?.flatpickr?.clear();
          }}
          width={20}
          height={20}
        />
      )}
    </div>
  );
};
