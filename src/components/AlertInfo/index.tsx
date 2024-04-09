import InfoIcon from "@components/icons/Info";

const AlertInfo = (data: { title: string; description?: string; list?: string[] }) => {
  const { title, description, list } = data;
  return (
    <div
      className="tw-border-t-4 tw-border-gray-200 tw-rounded-b tw-text-gray-600 tw-px-4 tw-py-3 tw-shadow-md"
      role="alert"
    >
      <div className="tw-flex">
        <div className="tw-py-1">
          <InfoIcon />
        </div>
        <div>
          <p className="tw-font-bold">{title}</p>
          {description && <p className="tw-text-sm">{description}</p>}
          {list && (
            <ul className="tw-list-outside tw-list-disc">
              {list.map((val, idx) => (
                <li key={idx}>{val}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertInfo;
