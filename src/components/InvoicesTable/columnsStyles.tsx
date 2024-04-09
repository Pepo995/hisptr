import { type ExtendedInvoicesData } from ".";
import { toast } from "react-toastify";
import { Copy } from "react-feather";

export const highlightWhen = (when: (invoice: ExtendedInvoicesData) => boolean) => [
  {
    when,
    style: {
      backgroundColor: "lightcoral",
    },
    classNames: ["tw-text-white"],
  },
];

export const cellWithTitle = (text?: string | null, includeCopyButton?: boolean) =>
  text ? (
    <>
      <div title={text} className="tw-truncate tw-mr-1">
        {text}
      </div>
      {includeCopyButton && (
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
          }}
          title="Copy to clipboard"
        >
          <Copy />
        </button>
      )}
    </>
  ) : (
    "Not defined"
  );
