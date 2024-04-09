import FormInput from "@components/inputs/FormInput";
import type { LineItem } from "@types";
import { formatPrice } from "@utils/Utils";
import { Trash } from "react-feather";
import Select from "react-select";

type EventLineItemProps = {
  index: number;
  lineItem: LineItem;
  lineItemOptions: LineItem[];
  setLineItem: (lineItem: LineItem, index: number) => void;
  name: string;
  onRemove?: () => void;
};

const cellClassName = "tw-border tw-border-black tw-p-1";

const EventLineItem = ({
  index,
  lineItem,
  lineItemOptions,
  setLineItem,
  name,
  onRemove,
}: EventLineItemProps) => (
  <div className="tw-flex tw-w-full">
    <div className={`${cellClassName} tw-w-1/12 tw-flex`}>
      <span className="tw-my-auto">{lineItem.id}</span>
    </div>
    <div className={`${cellClassName} tw-w-1/4`}>
      <Select
        className="react-select "
        classNamePrefix="select"
        options={lineItemOptions.map((item) => ({ ...item, label: item.name, value: item.id }))}
        placeholder="Select product"
        onChange={(e) => setLineItem(e ?? lineItemOptions[0], index)}
        isMulti={false}
        defaultValue={{ ...lineItem, label: lineItem.name, value: lineItem.id }}
      />
    </div>
    <div className={`${cellClassName} tw-w-1/4`}>
      <FormInput isTouched={false} name={`${name}.description`} type="textarea" />
    </div>
    <div className={`${cellClassName} tw-w-1/12`}>
      <FormInput isTouched={false} name={`${name}.quantity`} type="number" />
    </div>
    <div className={`${cellClassName} tw-w-1/6`}>
      <FormInput
        isTouched={false}
        name={`${name}.retailPriceInCents`}
        numericMaskInfo={{ defaultValue: lineItem.retailPriceInCents / 100 }}
      />
    </div>
    <div className={`${cellClassName} tw-w-1/8 tw-flex`}>
      <span className="tw-my-auto">
        $ {formatPrice((lineItem.retailPriceInCents * lineItem.quantity) / 100)}
      </span>
    </div>
    <div className={`${cellClassName} tw-w-1/12 tw-flex`}>
      {onRemove && (
        <button type="button" onClick={onRemove} className="tw-m-auto">
          <Trash />
        </button>
      )}
    </div>
  </div>
);

export default EventLineItem;
