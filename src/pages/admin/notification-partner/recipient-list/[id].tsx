import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ArrowLeft, ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@components/avatar";
import Breadcrumbs from "@components/breadcrumbs";

import { notificationDetailApiCall } from "@redux/action/NotificationAction";
import { ShimmerTable } from "react-shimmer-effects";
import { FirstUpperCase, onSearchHandler, perPageHandler, perPageOptions } from "@utils/Utils";
import { NoOfEntries } from "@utils/platformUtils";
import { Helmet } from "react-helmet";

import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import Link from "next/link";

type RowType = {};
const columns: TableColumn<RowType>[] = [
  {
    name: "Recipients",
    selector: (row) => row?.user?.picture,
    minWidth: "250px",
    maxWidth: "250px",
    sortable: true,
    cell: (row) => (
      <>
        {row?.user?.picture ? (
          <Avatar img={row?.user?.picture} withBackground={false} />
        ) : (
          <Avatar
            className="cu-avatar me-1"
            /*eslint-disable-next-line */
            content={
              `${FirstUpperCase(row.user?.first_name)}` +
              " " +
              `${FirstUpperCase(row.user?.last_name)}`
            }
            imgHeight={42}
            imgWidth={42}
            showOnlyInitials
            withBackground={false}
          />
        )}
      </>
    ),
  },
  {
    name: "First name",
    selector: (row) => row?.user?.first_name,
    minWidth: "250px",
    maxWidth: "250px",
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.user?.first_name}</span>,
  },
  {
    name: "Last Name",
    minWidth: "250px",
    maxWidth: "250px",
    selector: (row) => row?.user?.last_name,
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.user?.last_name}</span>,
  },
  {
    name: "Partner Information",
    minWidth: "250px",
    maxWidth: "250px",
    selector: (row) => row?.user?.company,
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.user?.company || "--"}</span>,
    sortable: true,
  },
  {
    name: "Email Address",
    minWidth: "250px",
    maxWidth: "250px",
    selector: (row) => row?.user?.email,
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.user?.email}</span>,
    sortable: true,
  },
  {
    name: "Phone",
    minWidth: "150px",
    maxWidth: "150px",
    /*eslint-disable-next-line */
    selector: (row) => (row?.user?.phone_number ? row?.user?.phone_number : "-"),
    cell: (row) => (
      <span className="sy-tx-modal2 f-400">
        {row?.user?.phone_number ? row?.user?.phone_number : "-"}
      </span>
    ),
    sortable: true,
  },
];

const ReceipientsList: NextPageWithLayout = () => {
  const router = useRouter();
  const recipient = useSelector((state: any) => state?.notificationReducer?.recipient);
  const totalRecipient = useSelector((state: any) => state?.notificationReducer?.totalRecipient);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const totalPage = Math.ceil(totalRecipient / perPage);
  const dispatch = useDispatch();
  /**
   * This function is used to get the notification list.
   * @param page - The current page number.
   * @param perPage - The number of items per page.
   * @param search - The search string to filter the results.
   */
  const getNotificationlist = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("notification_id", router.query.id);
    formData.append("search", search);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(notificationDetailApiCall(formData) as unknown as AnyAction);
    setIsLoading(false);
  };

  /* This is a react hook that is used to run a function when a component is mounted. */
  useEffect(() => {
    if (router.query === undefined) {
      router.replace("/admin/notification-partner");
    } else if (router.query.id !== undefined) {
      getNotificationlist();
    }
  }, [page, perPage, search, router.query.id]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Recipients List</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Partner Notifications"
          data={[
            {
              title: "Partner Notifications",
              link: "/admin/notification-partner",
            },
            { title: "Receipients List" },
          ]}
        />
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="header-search-filter">
              <div>
                <Link href="/admin/notification-partner">
                  {" "}
                  <ArrowLeft className="sy-tx-primary me-50" />
                </Link>
                <label>{NoOfEntries(page, perPage, totalRecipient)}</label>
              </div>
              <div className=" support-header mb-1">
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search"
                  className="me-sm-1"
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {!IsLoading ? (
              <div className="react-dataTable">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  data={recipient}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={5} row={3} />
            )}

            {recipient?.length !== 0 && (
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
                    breakLabel="..."
                    pageCount={totalPage || 1}
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

ReceipientsList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ReceipientsList;
