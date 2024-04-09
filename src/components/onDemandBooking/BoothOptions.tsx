import BoothOptionsImages from "./BoothOptionsImages";

import OptionBox from "./OptionBox";
import { Icon } from "@iconify/react";
import { useIsMobile } from "@hooks/useIsMobile";
import { packageOptions } from "@constants/packages";

export const DisclaimerPrice = ({
  className,
  withShadow = false,
}: {
  className?: string;
  withShadow?: boolean;
}) => (
  <div
    className={`${className} tw-flex tw-items-center tw-gap-x-3`}
    style={withShadow ? { boxShadow: "0px 4px 4px 0px rgba(144, 143, 143, 0.25)" } : {}}
  >
    <Icon icon="jam:alert-f" color="#fd6f6e" width={35} height={35} />

    <p className={`${withShadow ? "tw-text-[9px] tw-leading-3" : "tw-text-sm"} tw-m-0`}>
      Actual price may vary upon confirming final event details. The final price will be calculated
      and displayed in the next step.
    </p>
  </div>
);

type BoothOptionsProps = {
  value: number;
  onChange: (value: number) => void;
  optionsPrices: { id: number; price: number }[];
};

const BoothOptions = ({ value, onChange, optionsPrices }: BoothOptionsProps) => {
  const isMobile = useIsMobile();
  const emptyValue = 0;

  const selectBooth = (boothValue: number) => {
    const newValue = value === boothValue && isMobile ? emptyValue : boothValue;

    onChange(newValue);
  };

  return (
    <div className="tw-flex md:tw-flex-row tw-flex-col tw-gap-x-3 sm:tw-mb-11 tw-mb-5 tw-w-full">
      <div className="tw-w-1/2 tw-hidden md:tw-block">
        <BoothOptionsImages value={value} options={packageOptions} />
      </div>

      <div className="md:tw-w-1/2 tw-w-full tw-my-auto tw-relative">
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-y-3 md:tw-pb-0 tw-pb-16 md:tw-h-fit tw-h-full">
          {packageOptions.map(
            ({
              optValue,
              title,
              name,
              imageMobile,
              subtitle,
              boldText,
              included,
              isMostPopular,
            }) => (
              <OptionBox
                key={optValue}
                value={optValue}
                selected={value === optValue}
                title={title}
                name={name}
                images={imageMobile}
                isMostPopular={isMostPopular}
                prices={optionsPrices?.find((elem) => elem.id === optValue)}
                subtitle={subtitle}
                boldText={boldText}
                included={included}
                onChange={() => selectBooth(optValue)}
              />
            ),
          )}
          {/* DISCLAIMER DESKTOP */}
          <div className="md:tw-block tw-hidden">
            <DisclaimerPrice />
          </div>
        </div>

        {/* DISCLAIMER MOBILE */}
        <DisclaimerPrice
          className="md:tw-hidden tw-block tw-bg-white tw-absolute -tw-bottom-3 tw-py-4 tw-px-2 tw-rounded"
          withShadow
        />
      </div>
    </div>
  );
};
export default BoothOptions;
