import { Icon } from "@iconify/react";

const IncludedItems = ({ items }: { items?: string[] }) => (
  <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-flex-wrap tw-items-start tw-justify-between md:tw-justify-start tw-gap-2">
    {items?.map((item, index) => (
      <div
        key={index}
        className="md:tw-w-[46%] lg:tw-mr-3 tw-flex tw-items-start lg:tw-gap-x-px tw-gap-x-1 tw-gap-y-2"
      >
        <Icon icon="material-symbols:check" color="#fd6f6e" width={18} height={18} />

        <p
          className={`${
            index === 0 ? "tw-font-extrabold" : "tw-font-semibold"
          } tw-text-sm tw-leading-normal tw-m-0 tw-text-black`}
        >
          {item}
        </p>
      </div>
    ))}
  </div>
);

export default IncludedItems;
