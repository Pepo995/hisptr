import Circle from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircle from "@mui/icons-material/CheckCircleOutline";
import { Field } from "formik";
import { formatPrice } from "@utils/Utils";
import { type PayOption } from "@components/Payment/type";

type PriceOptionsProps = {
  options: PayOption[];
  name: string;
  value: string;
  discount?: number;
  isInMoreThan60DaysFromNow?: boolean;
  isInMoreThan30DaysFromNow?: boolean;
};

const PriceOptions = ({
  options,
  name,
  value,
  discount,
  isInMoreThan60DaysFromNow = false,
}: PriceOptionsProps) => (
  <div className="tw-border-b tw-border-slate-light tw-py-5 tw-flex tw-flex-col tw-gap-6">
    {options.map((option, index) => {
      const isSelected = option.value === value;

      return (
        <label
          key={`price-option-${index}`}
          className={`${
            isSelected
              ? "tw-border-primary tw-bg-primary"
              : "tw-border-slate-light tw-bg-slate-light"
          } tw-bg-opacity-5 tw-border-2 tw-rounded-md tw-flex tw-py-2 tw-gap-2 tw-pr-5 tw-pl-2 tw-min-h-[60px] tw-cursor-pointer`}
          htmlFor={option.value}
        >
          <Field
            type="radio"
            name={name}
            id={option.value}
            value={option.value}
            className="tw-hidden"
          />
          {isSelected ? (
            <CheckCircle className="tw-text-primary" />
          ) : (
            <Circle className="tw-text-slate-light" />
          )}

          <div className="tw-flex tw-flex-col">
            <span className="tw-font-montserrat tw-text-black tw-font-semibold tw-text-lg">
              {option.title}
            </span>

            <span className="tw-text-slate-light tw-font-montserrat tw-text-[9px] tw-max-w-[250px] tw-my-auto">
              {option.subtitle}
            </span>

            {option.alertText && (
              <span className="tw-font-montserrat tw-text-[9px] tw-text-primary">
                {option.alertText}
              </span>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-items-center tw-text-center tw-gap-1 tw-font-montserrat tw-font-semibold tw-text-[13px] tw-w-[40%] 2xl:tw-w-auto 2xl:tw-pl-16">
            {option.value === "full" && isInMoreThan60DaysFromNow ? (
              <>
                <span className="tw-text-red-alert tw-line-through">
                  ${formatPrice(option.price + (discount ?? 0))}
                </span>

                <span className="tw-text-black">${formatPrice(option.price)} Today</span>
              </>
            ) : (
              <span className="tw-text-black">
                {option.value === "partial_50_50"
                  ? `$${formatPrice(option.price / 2)} Today`
                  : `$${formatPrice(option.price)}`}
              </span>
            )}

            {option.value === "partial_50_50" && (
              <div className="tw-text-slate-light tw-text-[10px] tw-flex tw-flex-col">
                <span>${formatPrice(option.price / 2)} 30 days prior to event</span>

                <span>Total: ${formatPrice(option.price)}</span>
              </div>
            )}
          </div>
        </label>
      );
    })}
  </div>
);

export default PriceOptions;
