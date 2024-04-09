import { useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { ChevronDown, FileText } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { Badge, Button, Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";

import Breadcrumbs from "@components/breadcrumbs";
import Link from "next/link";
import { convertDate, onSearchHandler, perPageHandler, setFilterDropdown } from "@utils/Utils";
import { OptionComponent, ticketStatusOption, checkIsReadTicket } from "@utils/platformUtils";
import { ShimmerTable } from "react-shimmer-effects";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { api } from "@utils/api";
import { tickets_status } from "@prisma/client";
import { TicketWithEventAndUser } from "@server/api/routers/customer/events";

const status = [
  { title: "Open", color: "light-success" },
  { title: "In progress", color: "light-warning" },
  { title: "Closed", color: "light-danger" },
];

const columns: TableColumn<TicketWithEventAndUser>[] = [
  {
    name: "Request ID",
    style: { cursor: "pointer" },
    selector: (row: TicketWithEventAndUser) => row.ticketNumber,
    minWidth: "200px",
    maxWidth: "200px",
    sortable: true,
    width: "100",
    cell: (row: TicketWithEventAndUser) => (
      <Link href={`/customer/support-request-listing/request-detail/${row.id}`}>
        <span className="sy-tx-primary f-900">#{row.ticketNumber}</span>
      </Link>
    ),
  },
  {
    name: "Subject",
    style: { cursor: "pointer" },
    selector: (row: TicketWithEventAndUser) => row.title ?? "Not defined",
    sortable: true,

    cell: (row: TicketWithEventAndUser) => (
      <Link className="link-color" href={`/support-request-listing/request-detail/${row.id}`}>
        <span>
          {row.title}&nbsp;
          {checkIsReadTicket(row) && <span className="partner-name">{checkIsReadTicket(row)}</span>}
        </span>
      </Link>
    ),
  },
  {
    name: "Created Date",
    style: { cursor: "pointer" },
    cell: (row: TicketWithEventAndUser) => (
      <Link className="link-color" href={`/support-request-listing/request-detail/${row.id}`}>
        {convertDate(row.createdAt, 1)}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "Status",
    style: { cursor: "pointer" },
    selector: (row: TicketWithEventAndUser) => row.status ?? "Not defined",
    sortable: true,
    minWidth: "176px",
    maxWidth: "176px",
    cell: (row: TicketWithEventAndUser) => {
      return (
        <>
          <Link href={`/support-request-listing/request-detail/${row.id}`}>
            <div>
              <Badge
                color={
                  row.status === "open" || row.status === "close"
                    ? row.status === "close"
                      ? status[2].color
                      : status[0].color
                    : status[1].color
                }
                pill
              >
                <FileText size={15} />
              </Badge>
              <Badge
                color={
                  row.status === "open" || row.status === "close"
                    ? row.status === "close"
                      ? status[2].color
                      : status[0].color
                    : status[1].color
                }
                className="remove-bg-badge"
                pill
              >
                {ticketStatusOption.filter((e) => e.value === row?.status)[0]?.label}
              </Badge>
            </div>
          </Link>
        </>
      );
    },
  },
];
const perPageOptions = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

const SupportRequestListing: NextPageWithLayout = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<tickets_status | undefined>(undefined);
  const { data, isLoading } = api.eventCustomerRouter.getTickets.useQuery({
    search: search,
    page: page,
    status: status,
    pageSize: perPage,
  });

  const tickets = data?.tickets;
  const router = useRouter();
  const onRowClicked = (row: TicketWithEventAndUser) => {
    void router.push(`/customer/support-request-listing/request-detail/${row.id}`);
  };

  const totalTicket = data?.total ?? 0;

  return (
    <>
      <Helmet>
        <title>Hipstr - Support Request</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs title="Support Request" data={[{ title: "Support Request" }]} />

        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="d-flex justify-content-between w-100 flex-wrap">
              <div>
                {totalTicket !== 0 && (
                  <label>
                    Showing {perPage * (page - 1) + 1} to{" "}
                    {totalTicket < perPage * page ? totalTicket : perPage * page} of {totalTicket}{" "}
                    entries
                  </label>
                )}
                <Link href="/customer/support-request-listing/create-support-request">
                  <Button className="custom-btn3 mx-2"> + Create Request</Button>
                </Link>
              </div>
              <div className="d-flex support-header mb-1">
                <Input
                  type="search"
                  isClearable={true}
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                  placeholder="Search"
                  className="me-sm-1"
                />

                <Select
                  isSearchable={false}
                  className="react-select  status-select mx-sm-2"
                  classNamePrefix="select"
                  options={ticketStatusOption}
                  placeholder="Select Status"
                  components={{
                    Option: OptionComponent,
                  }}
                  onChange={(e) => {
                    setFilterDropdown(setStatus, e?.value ?? undefined);
                  }}
                  isClearable={true}
                  getOptionLabel={(data) => data?.label ?? ""}
                  isMulti={false}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="react-dataTable">
              {!isLoading ? (
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  data={tickets || []}
                  highlightOnHover
                  onRowClicked={onRowClicked}
                />
              ) : (
                <ShimmerTable col={4} row={10} />
              )}
            </div>
            {totalTicket !== 0 && (
              <Row className="align-items-center mx-25">
                <Col sm="6">
                  <div className="d-flex align-items-center pagination-role">
                    <label htmlFor="rows-per-page">Show 1 To </label>
                    <Select
                      isSearchable={false}
                      id="rows-per-page"
                      className="react-select mx-1"
                      classNamePrefix="select"
                      defaultValue={perPageOptions[0]}
                      options={perPageOptions}
                      onChange={(e) => perPageHandler(e ?? { value: "0" }, setPerPage, setPage)}
                      isMulti={false}
                    />
                    <label htmlFor="rows-per-page"> Per Page</label>
                  </div>
                </Col>
                <Col sm="6" className="pagination-role-n mt-1 d-flex justify-content-end">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={page - 1}
                    onPageChange={(e) => setPage(e.selected + 1)}
                    pageCount={Math.ceil(totalTicket / perPage)}
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
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

SupportRequestListing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default SupportRequestListing;
