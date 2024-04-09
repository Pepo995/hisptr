type OnDemandBookingPriceTagProps = { price: number; text?: string };

const OnDemandBookingPriceTag = ({
  price,
  text,
}: OnDemandBookingPriceTagProps) => (
  <div className="tw-text-primary tw-border-primary tw-rounded-lg tw-flex tw-flex-col sm:tw-w-80 tw-w-full tw-py-2 tw-gap-2 tw-border">
    <span className="tw-font-semibold tw-text-4xl tw-mx-auto">
      ${price.toLocaleString()}
    </span>
    {text && <span className="tw-mx-auto">{text}</span>}
  </div>
);

export default OnDemandBookingPriceTag;
