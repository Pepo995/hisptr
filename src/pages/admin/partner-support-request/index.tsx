import { type ReactElement } from "react";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, FileText } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { Badge, Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";
import Avatar from "@components/avatar";
import Breadcrumbs from "@components/breadcrumbs";

import { useDispatch, useSelector } from "react-redux";
import { partnerSupportAPICall } from "@redux/action/SupportAction";
import {
  FirstUpperCase,
  convertDate,
  onSearchHandler,
  perPageHandler,
  perPageOptions,
  setFilterDropdown,
} from "@utils/Utils";
import {
  NoOfEntries,
  OptionComponent,
  checkIsRead,
  ticketStatusOption,
} from "@utils/platformUtils";
import { ShimmerTable } from "react-shimmer-effects";
import { PARTNER } from "@constants/CommonConstants";
import Link from "next/link";
import { useRouter } from "next/router";

// ** Vars
const states = ["success", "danger", "warning", "info", "dark", "primary", "secondary"];

const status = [
  { title: "Open", color: "light-success" },
  { title: "In progress", color: "light-warning" },
  { title: "Closed", color: "light-danger" },
];
type RowType = {};
const columns: TableColumn<RowType>[] = [
  {
    name: "Request ID",
    style: { cursor: "pointer" },
    selector: (row) => row.ticket_number,
    minWidth: "200px",
    maxWidth: "200px",
    sortable: true,
    width: "100",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/partner-support-request/request-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-primary f-900">#{row.ticket_number}</span>
      </Link>
    ),
  },
  {
    name: "Name",
    style: { cursor: "pointer" },
    selector: (row) =>
      `${FirstUpperCase(row.user.first_name)} ${FirstUpperCase(row.user.last_name)}`,
    sortable: true,
    minWidth: "250px",
    maxWidth: "250px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/partner-support-request/request-detail/${row.id}`,
        }}
        className="link-color"
      >
        {" "}
        <div className="d-flex align-items-center">
          {row.user.picture !== null ? (
            <Avatar img={row.user.picture} />
          ) : (
            <Avatar
              color={`light-${states[row.status]}`}
              /*eslint-disable-next-line */
              content={
                `${FirstUpperCase(row.user.first_name)}` +
                " " +
                `${FirstUpperCase(row.user.last_name)}`
              }
              showOnlyInitials
              className="cu-avatar"
            />
          )}
          <div className="user-info text-truncate ms-1">
            <span className={"d-block fw-bold text-truncate"}>
              {/* <span className={checkIsRead(row) ? 'd-block fw-bold text-truncate partner-name' : 'd-block fw-bold text-truncate'}> */}
              {FirstUpperCase(row.user.first_name)} {FirstUpperCase(row.user.last_name)}
              &nbsp;
              {checkIsRead(row) && <span className="partner-name">{checkIsRead(row)}</span>}
            </span>
            <small className="post-name single-line-elipsis">{row.user.email}</small>
          </div>
        </div>
      </Link>
    ),
  },
  {
    name: "Subject",
    style: { cursor: "pointer" },
    selector: (row) => (
      <Link
        href={{
          pathname: `/admin/partner-support-request/request-detail/${row.id}`,
        }}
        className="link-color"
      >
        {row.title}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "Event Date",
    style: { cursor: "pointer" },
    selector: (row) => (
      <Link
        href={{
          pathname: `/admin/partner-support-request/request-detail/${row.id}`,
        }}
        className="link-color"
      >
        {convertDate(row.event.event_date, 2)}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "Category",
    style: { cursor: "pointer" },
    selector: (row) => (
      <Link
        href={{
          pathname: `/admin/partner-support-request/request-detail/${row.id}`,
        }}
        className="link-color"
      >
        {row.type.name}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "ISSUED DATE",
    style: { cursor: "pointer" },
    selector: (row) => (
      <Link
        href={{
          pathname: `/admin/partner-support-request/request-detail/${row.id}`,
        }}
        className="link-color"
      >
        {convertDate(row.created_at, 2)}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "Status",
    maxWidth: "150px",
    minWidth: "150px",
    style: { cursor: "pointer" },
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => {
      return (
        <>
          <Link
            href={{
              pathname: `/admin/partner-support-request/request-detail/${row.id}`,
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
                {ticketStatusOption[0]?.options?.filter((e) => e.value === row?.status)[0]?.label}
              </Badge>
            </div>
          </Link>
        </>
      );
    },
  },
];

const PartnerSupportRequest: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const partnerTicket = useSelector((state: any) => state?.supportReducer?.partnerTicket);
  const totalTicket = useSelector((state: any) => state?.supportReducer?.totalPartnerTicket);
  const totalPage = Math.ceil(totalTicket / perPage);

  /**
   * The below function is used to get the partner ticket.
   */
  const getPartnerTicket = async () => {
    setIsLoading(true);
    /*eslint-disable */
    const data = {
      type: PARTNER,
      page: page,
      per_page: perPage,
      search: search,
      status: status?.value,
    };
    /*eslint-enable */
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(partnerSupportAPICall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    getPartnerTicket();
  }, [search, page, perPage, status]);
  /**
   * It takes a row as an argument and pushes a new route to the router object
   * @param row - The row object that was clicked
   */
  const onRowClicked = (row) => {
    router.push({
      pathname: `/admin/partner-support-request/request-detail/${row.id}`,
    });
  };
  return (
    <>
      <Helmet>
        <title>Hipstr - Partner Support Request</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Support Request"
          data={[{ title: "Support Request" }, { title: "Partner Support Request" }]}
        />

        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="header-search-filter">
              <div>
                <label>{NoOfEntries(page, perPage, totalTicket)}</label>
              </div>
              <div className="d-flex support-header mb-1">
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search"
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                  className="me-sm-1"
                />
                <Select
                  className="react-select w-100 status-select"
                  classNamePrefix="select"
                  options={ticketStatusOption}
                  placeholder="Select Status"
                  components={{
                    Option: OptionComponent,
                  }}
                  isSearchable={false}
                  onChange={(e) => {
                    setFilterDropdown(setStatus, e);
                  }}
                  isClearable={true}
                  getOptionLabel={(data) => (
                    <div className="select-option">
                      <Badge color={data.color} className="me-50" pill>
                        <FileText size={14} />
                      </Badge>
                      <Badge color={data.color} pill>
                        {data.label}
                      </Badge>
                    </div>
                  )}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {!isLoading ? (
              <div className="react-dataTable-support">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable-support"
                  sortIcon={<ChevronDown size={10} />}
                  data={partnerTicket}
                  onRowClicked={onRowClicked}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={7} row={10} />
            )}
            {totalTicket !== 0 && (
              <Row className="align-items-center mx-25">
                <Col sm="6">
                  <div className="d-flex align-items-center pagination-role">
                    <label htmlFor="rows-per-page">Show 1 To </label>
                    <Select
                      id="rows-per-page"
                      className="react-select mx-1"
                      classNamePrefix="select"
                      defaultValue={perPageOptions[0]}
                      options={perPageOptions}
                      onChange={(e) => perPageHandler(e, setPerPage, setPage)}
                      isSearchable={false}
                    />
                    <label htmlFor="rows-per-page"> Per Page</label>
                  </div>
                </Col>
                <Col sm="6" className="pagination-role-n mt-1 d-flex justify-content-end">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={page - 1}
                    onPageChange={(e) => setPage(e.selected + 1)}
                    pageCount={totalPage || 1}
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

PartnerSupportRequest.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default PartnerSupportRequest;
