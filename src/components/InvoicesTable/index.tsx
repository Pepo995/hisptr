import {
  type Event,
  type EventPreference,
  type InProcessEvent,
  type Invoice,
  type State,
} from "@prisma/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { generateReceiptNumber } from "@server/services/invoiceCreator";
import { encodeBase64, formatPrice, perPageOptions } from "@utils/Utils";
import dayjs from "dayjs";
import DataTable, { type TableColumn } from "react-data-table-component";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { env } from "~/env.mjs";
import InvoicePdf from "~/pdfs/invoicePdf";
import { Icon } from "@iconify/react";

import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { cellWithTitle, highlightWhen } from "./columnsStyles";

dayjs.extend(advancedFormat);
dayjs.extend(utc);

export type ExtendedInvoicesData = Invoice & {
  event: Event & {
    states: State | null;
  };
  inProcessEvent:
    | (InProcessEvent & {
        type: EventPreference | null;
      })
    | null;
};

type InvoicesTableProps = {
  invoices: ExtendedInvoicesData[];
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  page: number;
  setPage: (page: number) => void;
  totalInvoices: number;
  applyFilter: (filter?: string) => void;
  filter?: string;
};

const columns: TableColumn<ExtendedInvoicesData>[] = [
  {
    name: "Invoice Id",
    selector: (invoice) => `#${generateReceiptNumber(invoice.id)}`,
    width: "120px",
    sortable: true,
  },
  {
    name: "First Name",
    cell: ({ event }) => cellWithTitle(event.firstName),
    width: "120px",
    sortable: true,
    conditionalCellStyles: highlightWhen(({ event }) => !event.firstName),
  },
  {
    name: "Last Name",
    cell: ({ event }) => cellWithTitle(event.lastName),
    width: "120px",
    sortable: true,
    conditionalCellStyles: highlightWhen(({ event }) => !event.lastName),
  },
  {
    name: "Invoice Date",
    selector: (invoice) =>
      invoice.invoiceDate ? dayjs(invoice.invoiceDate).format("MMMM DD, YYYY") : "Not defined",
    width: "150px",
    sortable: true,
    conditionalCellStyles: highlightWhen((invoice) => !invoice.invoiceDate),
  },
  {
    name: "Total Invoice",
    width: "130px",
    selector: ({ event }) =>
      `$ ${formatPrice((event.totalPriceInCents - event.discountInCents) / 100)}`,
    sortable: true,

    conditionalCellStyles: [
      {
        when: ({ event }) => event?.amountPaidInCents === event.totalPriceInCents,
        style: {
          backgroundColor: "lawngreen",
        },
      },
    ],
  },
  {
    name: "Invoice Link",
    cell: ({ event }) => {
      const token = encodeBase64(event.id);
      return cellWithTitle(`${env.NEXT_PUBLIC_VERCEL_URL}/custom-invoice/${token}`, true);
    },
    width: "150px",
  },
  {
    name: "Type",
    selector: ({ inProcessEvent }) => (inProcessEvent?.isCorporateEvent ? "Corporate" : "Social"),
    width: "120px",
    sortable: true,
  },
  {
    name: "Status",
    selector: (invoice) => {
      const total = invoice.event.totalPriceInCents - invoice.event.discountInCents;
      const isPayed = invoice.event?.amountPaidInCents === total;
      const today = new Date();

      if (isPayed) {
        return "Pay to date";
      } else if (invoice?.pendingDueDate && invoice?.pendingDueDate < today) {
        return "Past due";
      } else return "Pending";
    },
    width: "130px",
    sortable: true,
    conditionalCellStyles: [
      {
        when: ({ event }) =>
          event?.amountPaidInCents === event.totalPriceInCents - event.discountInCents,
        style: {
          backgroundColor: "lawngreen",
        },
      },
      {
        when: (invoice) => {
          const today = new Date();

          return invoice.event?.amountPaidInCents !==
            invoice.event.totalPriceInCents - invoice.event.discountInCents &&
            invoice?.pendingDueDate
            ? invoice?.pendingDueDate > today
            : false;
        },
        style: {
          backgroundColor: "yellow",
        },
      },
      {
        when: (invoice) => {
          const today = new Date();

          return invoice.event?.amountPaidInCents !==
            invoice.event.totalPriceInCents - invoice.event.discountInCents &&
            invoice?.pendingDueDate
            ? today > invoice?.pendingDueDate
            : false;
        },
        style: {
          backgroundColor: "lightcoral",
        },
        classNames: ["tw-text-white"],
      },
    ],
  },
  {
    name: "Pay to Date",
    selector: ({ event }) => `$ ${formatPrice(event.amountPaidInCents / 100)}`,
    width: "150",
    sortable: true,
  },
  {
    name: "Remaining Balance",
    selector: ({ event }) =>
      event.totalPriceInCents - event.discountInCents - event.amountPaidInCents === 0
        ? "-"
        : `USD ${formatPrice(
            (event.totalPriceInCents - event.discountInCents - event.amountPaidInCents) / 100,
          )}`,
    width: "150",
    sortable: true,
  },
  {
    name: "Due Date",
    selector: (invoice) =>
      invoice.pendingDueDate
        ? dayjs(invoice.pendingDueDate).format("MMMM DD, YYYY")
        : "Not defined",
    width: "150px",
    sortable: true,
    conditionalCellStyles: highlightWhen((invoice) => !invoice.pendingDueDate),
  },
  {
    name: "PDF",
    width: "100px",
    cell: (invoice) => (
      <PDFDownloadLink
        document={
          <InvoicePdf
            {...invoice.event}
            receiptNumber={generateReceiptNumber(invoice.id)}
            state={invoice.event.states?.name ?? ""}
            eventDate={dayjs.utc(invoice.event.eventDate).format("dddd MMMM D, YYYY")}
            eventType={invoice.inProcessEvent?.type?.name ?? ""}
            subtotal={invoice.subtotalInCents / 100}
            retailPrice={invoice.event.retailPriceInCents / 100}
            total={(invoice.event.totalPriceInCents - invoice.event.discountInCents) / 100}
            promotionalCodeDiscount={invoice.event.promotionalCodeDiscountInCents ?? 0 / 100}
            pending={invoice.pendingInCents ?? 0 / 100}
            paidToDate={invoice.event.amountPaidInCents / 100}
            stripeFee={invoice.event.stripeFeeInCents / 100}
            travelFee={invoice.event.travelFeeInCents / 100}
            balanceStatusDescription={
              invoice.invoiceType === "final_balance" ? "Final Balance" : "Deposit"
            }
            specialDiscount={invoice.event.discountInCents / 100}
            dueDateAsString={dayjs.utc(invoice.pendingDueDate).format("MMMM D, YYYY")}
          />
        }
        fileName={`Hipstr Booth Invoice - #${generateReceiptNumber(invoice.id)}`}
      >
        {({ loading }) =>
          loading ? (
            "Loading document..."
          ) : (
            <Icon icon="prime:download" width="24" height="24" color="#6e6b7b" />
          )
        }
      </PDFDownloadLink>
    ),
  },
];

const InvoicesTable = ({
  invoices,
  pageSize,
  setPageSize,
  page,
  setPage,
  totalInvoices,
}: InvoicesTableProps) => {
  return (
    <div className="tw-rounded-md tw-bg-white tw-p-2 tw-shadow-lg">
      <DataTable
        selectableRows
        columns={columns}
        className="react-inProcessEventTable"
        sortIcon={<ChevronDown size={10} />}
        data={invoices}
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
            pageCount={Math.ceil(totalInvoices / pageSize)}
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

export default InvoicesTable;
