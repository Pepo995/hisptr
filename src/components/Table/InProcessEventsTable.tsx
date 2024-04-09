import DebouncedInput from "@components/inputs/DebouncedInput";
import { BEARER_TOKEN } from "@constants/CommonConstants";
import { type Event, type InProcessEvent, type UtmParams } from "@prisma/client";
import { decryptData, formatPrice, perPageOptions } from "@utils/Utils";
import dayjs from "dayjs";
import DataTable, { type TableColumn } from "react-data-table-component";
import { ChevronDown, Copy } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { toast } from "react-toastify";
import { env } from "~/env.mjs";

export type ExtendedInProcessEvent = InProcessEvent & {
  states?: { name: string };
  type: { name: string } | null;
  packages: { title: string } | null;
  utmParams: UtmParams;
  Event: Event;
};

type InProcessEventsTableProps = {
  events: ExtendedInProcessEvent[];
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  page: number;
  setPage: (page: number) => void;
  totalEvents: number;
  applyFilter: (filter?: string) => void;
  filter?: string;
};

const InProcessEventsTable = ({
  events,
  pageSize,
  setPageSize,
  page,
  setPage,
  totalEvents,
  applyFilter,
  filter,
}: InProcessEventsTableProps) => {
  const highlightWhen = (when: (event: ExtendedInProcessEvent) => boolean) => [
    {
      when,
      style: {
        backgroundColor: "lightcoral",
      },
      classNames: ["tw-text-white"],
    },
  ];

  const cellWithTitle = (text?: string | null, includeCopyButton?: boolean) =>
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

  const columns: TableColumn<ExtendedInProcessEvent>[] = [
    {
      name: "Name",
      cell: (event) => cellWithTitle(`${event.firstName} ${event.lastName}`),
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.firstName || !event.lastName),
    },
    {
      name: "Phone",
      selector: (event) => event.phoneNumber ?? "Not defined",
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.phoneNumber),
    },
    {
      name: "Email",
      cell: (event) => cellWithTitle(event.email, true),
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.email),
    },
    {
      name: "Event Date",
      selector: (event) =>
        event.eventDate ? dayjs(event.eventDate).format("MMMM DD, YYYY") : "Not defined",
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.eventDate),
    },
    {
      name: "Location",
      cell: (event) =>
        cellWithTitle(event.states ? `${event.city}, ${event.states?.name}` : undefined),
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.city || !event.states),
    },
    {
      name: "Type",
      cell: (event) => cellWithTitle(event.type?.name),
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.type?.name),
    },
    {
      name: "Package",
      cell: (event) => cellWithTitle(event.packages?.title),
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.packages?.title),
    },
    {
      name: "Budget",
      selector: (event) =>
        event.approximateBudget ? `$${formatPrice(event.approximateBudget)}` : "Not defined",
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.approximateBudget),
    },
    {
      name: "Message",
      cell: (event) => cellWithTitle(event.message),
      width: "150px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.message),
    },
    {
      name: "Created At",
      selector: (event) => dayjs(event.createdAt).format("MM/DD/YYYY HH:mm:ss"),
      width: "160px",
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (event) => dayjs(event.updatedAt).format("MM/DD/YYYY HH:mm:ss"),
      width: "160px",
      sortable: true,
    },
    {
      name: "Source",
      selector: (event) => event.utmParams?.utmSource ?? "Not defined",
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.utmParams?.utmSource),
    },
    {
      name: "Medium",
      selector: (event) => event.utmParams?.utmMedium ?? "Not defined",
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.utmParams?.utmMedium),
    },
    {
      name: "Campaign",
      selector: (event) => event.utmParams?.utmCampaign ?? "Not defined",
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.utmParams?.utmCampaign),
    },
    {
      name: "Term",
      selector: (event) => event.utmParams?.utmTerm ?? "Not defined",
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.utmParams?.utmTerm),
    },
    {
      name: "Content",
      selector: (event) => event.utmParams?.utmContent ?? "Not defined",
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.utmParams?.utmContent),
    },
    {
      name: "Campaign Id",
      selector: (event) => event.utmParams?.utmId ?? "Not defined",
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.utmParams?.utmId),
    },
    {
      name: "Converted?",
      selector: (event) => (event.Event?.id ? "Yes" : "No"),
      width: "140px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.Event?.id),
    },
    {
      name: "Market",
      selector: (event) => event.marketName ?? "Not defined",
      width: "160px",
      sortable: true,
      conditionalCellStyles: highlightWhen((event) => !event.marketName),
    },
  ];

  const token = decryptData(localStorage.getItem(BEARER_TOKEN) ?? "");

  return (
    <div className="tw-rounded-md tw-bg-white tw-p-2 tw-shadow-lg">
      <div className="tw-w-full tw-m-2 tw-flex">
        <DebouncedInput
          placeholder="Search"
          text={filter}
          className="input-group form-control tw-w-full    sm:tw-w-1/2"
          onDebounce={(text: string) => applyFilter(text)}
          autofocus
        />

        <a
          type="button"
          className="custom-btn3 tw-uppercase tw-ml-auto tw-mr-2"
          href={`${env.NEXT_PUBLIC_VERCEL_URL}/api/utils/export-in-process-events-to-csv?filter=${filter}&token=${token}`}
          download
        >
          Export CSV
        </a>
      </div>
      <DataTable
        selectableRows
        columns={columns}
        className="react-inProcessEventTable"
        sortIcon={<ChevronDown size={10} />}
        data={events}
        highlightOnHover
      />
      <div className="align-items-center mx-25">
        <div>
          <div className="d-flex align-items-center pagination-role">
            <label htmlFor="rows-per-page">Show 1 To </label>
            <Select
              id="rows-per-page"
              className="react-select mx-1"
              classNamePrefix="select"
              defaultValue={
                perPageOptions.find((option) => option.value === pageSize.toString()) ??
                perPageOptions[0]
              }
              options={perPageOptions}
              onChange={(e) => setPageSize(parseInt(e?.value ?? "1"))}
              isSearchable={false}
            />
            <label htmlFor="rows-per-page"> Per Page</label>
          </div>
        </div>
        <div className="pagination-role-n mt-1 d-flex justify-content-end">
          <ReactPaginate
            nextLabel=""
            forcePage={page - 1}
            onPageChange={(e) => setPage(e.selected + 1)}
            pageCount={Math.ceil(totalEvents / pageSize)}
            breakLabel="..."
            previousLabel=""
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            activeClassName="active"
            pageClassName="page-item"
            breakClassName="page-item"
            nextLinkClassName="page-link"
            pageLinkClassName="page-link"
            nextClassName="page-item next"
            breakLinkClassName="page-link"
            previousLinkClassName="page-link"
            previousClassName="page-item prev"
            containerClassName="pagination react-paginate"
          />
        </div>
      </div>
    </div>
  );
};

export default InProcessEventsTable;
