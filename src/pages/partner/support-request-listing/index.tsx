import { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { ChevronDown, FileText } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { Badge, Button, Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";

import Breadcrumbs from "@components/breadcrumbs";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { supportTicketAPICall } from "@redux/action/SupportAction";
import {
  convertDate,
  decryptData,
  onSearchHandler,
  perPageHandler,
  setFilterDropdown,
} from "@utils/Utils";
import {
  type CheckIsReadElement,
  OptionComponent,
  checkIsRead,
  ticketStatusOption,
} from "@utils/platformUtils";
import { ShimmerTable } from "react-shimmer-effects";
import { USER_TYPE } from "@constants/CommonConstants";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { type AnyAction } from "@reduxjs/toolkit";
import { useRouter } from "next/router";

const status = [
  { title: "Open", color: "light-success" },
  { title: "In progress", color: "light-warning" },
  { title: "Closed", color: "light-danger" },
];

const columns: TableColumn<CheckIsReadElement>[] = [
  {
    name: "Request ID",
    style: { cursor: "pointer" },
    selector: (row: CheckIsReadElement) => row.ticket_number,
    minWidth: "200px",
    maxWidth: "200px",
    sortable: true,
    width: "100",
    cell: (row: CheckIsReadElement) => (
      <Link
        href={{
          pathname: `/support-request-listing/request-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-primary f-900">#{row.ticket_number}</span>
      </Link>
    ),
  },
  {
    name: "Subject",
    style: { cursor: "pointer" },
    selector: (row: CheckIsReadElement) => row.title ?? "Not defined",
    sortable: true,

    cell: (row: CheckIsReadElement) => (
      <Link
        className="link-color"
        href={{
          pathname: `/support-request-listing/request-detail/${row.id}`,
        }}
      >
        <span>
          {row.title}&nbsp;
          {checkIsRead(row) && <span className="partner-name">{checkIsRead(row)}</span>}
        </span>
      </Link>
    ),
  },
  {
    name: "Created Date",
    style: { cursor: "pointer" },
    cell: (row: CheckIsReadElement) => (
      <Link
        className="link-color"
        href={{
          pathname: `/support-request-listing/request-detail/${row.id}`,
        }}
      >
        {convertDate(row.created_at, 1)}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "Status",
    style: { cursor: "pointer" },
    selector: (row: CheckIsReadElement) => row.status ?? "Not defined",
    sortable: true,
    minWidth: "176px",
    maxWidth: "176px",
    cell: (row: CheckIsReadElement) => {
      return (
        <>
          <Link
            href={{
              pathname: `/support-request-listing/request-detail/${row.id}`,
            }}
          >
            {" "}
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
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  const ticket = useSelector((state: any) => state.supportReducer.ticket);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  const totalTicket = useSelector((state: any) => state.supportReducer.totalTicket);
  const totalPage = Math.ceil(totalTicket / perPage);
  /*eslint-disable-next-line */
  const startingValue = (page - 1) * perPage + 1;
  const endingValue =
    startingValue + perPage - 2 >= totalTicket
      ? ((startingValue + totalTicket) % perPage) - 2 + startingValue
      : startingValue + perPage - 1;
  const type = decryptData(localStorage.getItem(USER_TYPE) ?? "");
  const getSupportRequest = async () => {
    /**
     * A function that gets the support request list.
     */
    setIsLoading(true);
    /*eslint-disable*/
    const data = {
      page,
      per_page: perPage,
      search,
      status,
      type,
    };
    /*eslint-enable */
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(supportTicketAPICall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* A react hook that is used to perform side effects in function components. */
  useEffect(() => {
    void getSupportRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, perPage, status]);
  /**
   * It takes a row object as an argument and pushes a new route to the router object
   * @param row - The row object that was clicked
   */
  const onRowClicked = (row: CheckIsReadElement) => {
    void router.push({
      pathname: `/support-request-listing/request-detail/${row.id}`,
    });
  };
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
                    {" "}
                    Showing {startingValue} to {endingValue} of {totalTicket} entries
                  </label>
                )}
                <Link href="/partner/support-request-listing/create-support-request">
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
                    // setFilterDropdown(setStatus, e?.value.toString() ?? null);
                    setFilterDropdown(setStatus, e?.value.toString() ?? null);
                  }}
                  isClearable={true}
                  // getOptionValue={(data) => (
                  //   <div className=" m-0">
                  //     <Badge color={data.options?.[0]?.color} className="me-50" pill>
                  //       <FileText size={14} />
                  //     </Badge>
                  //     <Badge color={data.options?.[0]?.color} pill>
                  //       {data.options?.[0]?.label}
                  //     </Badge>
                  //   </div>
                  // )}
                  getOptionLabel={(data) => data.label}
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
                  data={ticket}
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
                    pageCount={totalPage}
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
