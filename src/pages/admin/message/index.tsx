import { type ReactElement } from "react";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, MessageSquare } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { eventListingApiCall } from "@redux/action/EventAction";
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";
import Avatar from "@components/avatar";

import { FirstUpperCase, convertDate, perPageHandler, perPageOptions } from "@utils/Utils";
import { ShimmerTable } from "react-shimmer-effects";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { checkPermisson } from "@utils/platformUtils";

type RowType = {};
const columns: TableColumn<RowType>[] = [
  {
    name: "Event ID",
    selector: (row) => row?.event_number,
    minWidth: "150px",
    maxWidth: "150px",
    sortable: true,
    width: "100",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/message/message-detail/${row.id}`,
        }}
      >
        {" "}
        <span className="sy-tx-primary f-900">#{row?.event_number}</span>
      </Link>
    ),
  },
  {
    name: "Customer Name",
    /*eslint-disable-next-line */
    selector: (row) =>
      `${FirstUpperCase(row?.user?.first_name)}` + " " + `${FirstUpperCase(row?.user?.last_name)}`,
    minWidth: "250px",
    maxWidth: "250px",
    sortable: true,
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/message/message-detail/${row.id}`,
        }}
      >
        <div className="d-flex align-items-center">
          {row?.user?.picture !== null ? (
            <Avatar img={row?.user?.picture} i mgHeight="35" imgWidth="35" />
          ) : (
            <Avatar
              content={`${FirstUpperCase(row?.first_name)} ${FirstUpperCase(row?.last_name)}`}
              imgHeight="35"
              imgWidth="35"
              showOnlyInitials
            />
          )}
          <div className="user-info text-truncate ms-1">
            {/*eslint-disable-next-line */}
            <span className={"d-block fw-bold text-truncate sy-tx-modal"}>
              {`${FirstUpperCase(row?.first_name)}` + " " + `${FirstUpperCase(row?.last_name)}`}
            </span>
            <small className="post-name single-line-elipsis">{row?.user?.email}</small>
          </div>
        </div>
      </Link>
    ),
  },
  {
    name: "Event Date",
    selector: (row) => convertDate(row.event_date, 2),
    minWidth: "200px",
    maxWidth: "150px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/message/message-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{convertDate(row.event_date, 2)}</span>
      </Link>
    ),
  },
  {
    name: "Package Type",
    selector: (row) => row?.package?.title,
    minWidth: "200px",
    maxWidth: "200px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/message/message-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{row?.package?.title}</span>
      </Link>
    ),
  },
  {
    name: "Location",
    maxWidth: "200px",
    selector: (row) =>
      `${row?.venue?.address_line_1} ${row?.venue?.address_line_2}, ${row?.venue?.city},  ${row?.venue?.state?.name}`,
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/message/message-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400 single-line-elipsis">
          {row?.venue
            ? `${row?.venue?.address_line_1} ${row?.venue?.address_line_2}, ${row?.venue?.city},  ${row?.venue?.state?.name}`
            : "--"}
        </span>
      </Link>
    ),
  },
  {
    name: "Event Assign to",
    selector: (row) => row.event_assign_to,
    minWidth: "200px",
    maxWidth: "200px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/message/message-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-600">{`${FirstUpperCase(
          row?.partner?.first_name,
        )} ${FirstUpperCase(row?.partner?.last_name)}`}</span>
      </Link>
    ),
  },
  {
    name: "ACTIONS",
    selector: (row) => row.action,
    sortable: true,
    cell: (row) => (
      <span className="sy-tx-modal2 message">
        <Link
          href={{
            pathname: `/admin/message/message-detail/${row.id}`,
          }}
        >
          <MessageSquare size={16} className="sy-tx-white" />
        </Link>
      </span>
    ),
  },
];

const data = [
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    location: "Lorem Ipsum",
    event_assign_to: "Martha Barnes",
    action: "",
  },
];

const Message: NextPageWithLayout = () => {
  /*eslint-disable-next-line */
  const event = useSelector((state: any) => state?.eventReducer?.eventList);
  const totalEvent = useSelector((state: any) => state?.eventReducer?.totalEvent);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  /*eslint-disable-next-line */
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const totalPage = Math.ceil(totalEvent / perPage);
  const router = useRouter();
  /*eslint-disable */
  const startingValue = (page - 1) * perPage + 1;
  const endingValue =
    startingValue + perPage >= totalEvent
      ? ((startingValue + totalEvent) % perPage) - 2 + startingValue
      : startingValue + perPage - 1;
  const permission = checkPermisson(router.pathname);
  /*eslint-enable */

  const getEventList = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("page", page);
    formData.append("per_page", perPage);
    formData.append("sort_field", "id");
    formData.append("sort_order", "desc");
    formData.append("search", search);
    formData.append("is_today", 1);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(eventListingApiCall(formData) as unknown as AnyAction);
    setIsLoading(false);
  };

  useEffect(() => {
    getEventList();
  }, [page, perPage, search]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Messages</title>
      </Helmet>
      <div>
        <h2 className="mb-2">Messages</h2>

        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2 mb-1 filter-section">
            <CardTitle>Today’s Events</CardTitle>
          </CardHeader>

          <CardBody className="p-0">
            {!isLoading ? (
              <div className="react-dataTable">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  data={data}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={7} row={10} />
            )}

            {totalEvent !== 0 && (
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

Message.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Message;
