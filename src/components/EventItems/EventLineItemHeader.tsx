const cellClassName = "tw-border tw-border-black tw-p-1";

const EventLineItemHeader = () => (
  <div className="tw-flex tw-w-full tw-font-bold">
    <div className={`${cellClassName} tw-w-1/12`}>Id</div>
    <div className={`${cellClassName} tw-w-1/4`}>Type</div>
    <div className={`${cellClassName} tw-w-1/4`}>Description</div>
    <div className={`${cellClassName} tw-w-1/12`}>Qty</div>
    <div className={`${cellClassName} tw-w-1/6`}>Retail Price</div>
    <div className={`${cellClassName} tw-w-1/8`}>Amount</div>
    <div className={`${cellClassName} tw-w-1/12`} />
  </div>
);

export default EventLineItemHeader;
