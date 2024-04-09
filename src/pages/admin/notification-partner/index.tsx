import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Eye } from "react-feather";
import ReactPaginate from "react-paginate";

import Select from "react-select";
import { Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";

import AvatarGroup from "@components/avatar-group";
import Avatar from "@components/avatar";
import { notificationListApiCall } from "@redux/action/NotificationAction";

import { ShimmerTable } from "react-shimmer-effects";

import OffCanvas2 from "@components/Common/OffCanvas2";
import { useDispatch, useSelector } from "react-redux";
import {
  FirstUpperCase,
  convertDate,
  onSearchHandler,
  perPageHandler,
  perPageOptions,
} from "@utils/Utils";
import { Helmet } from "react-helmet";
import { NoOfEntries, checkPermisson } from "@utils/platformUtils";

import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnyAction } from "@reduxjs/toolkit";

export const photoSort = (arr) => {
  return arr.sort(
    (a, b) =>
      (b?.user?.picture !== null) - (a?.user?.picture !== null) ||
      a?.user?.picture - b?.user?.picture,
  );
};

/**
 * It takes an array of objects and returns an array of objects with the same properties but with a
 * different value
 * @param row - The row data
 * @returns An array of objects
 */
const imgrvc = (row) => {
  const avatarArray = [];
  if (row?.length > 3) {
    const tempArray = [row?.[0], row?.[1], row?.[2]];
    tempArray?.map((e) => {
      if (e?.user?.picture !== null) {
        avatarArray.push({
          img: e?.user?.picture,
          title: `${FirstUpperCase(e?.user?.first_name)} ${FirstUpperCase(e?.user?.last_name)}`,
        });
      } else {
        avatarArray.push({
          title: `${FirstUpperCase(e?.user?.first_name)} ${FirstUpperCase(e?.user?.last_name)}`,
          icon: (
            <Avatar
              className="cu-avatar"
              content={`${FirstUpperCase(e?.user?.first_name)} ${FirstUpperCase(
                e?.user?.last_name,
              )}`}
              showOnlyInitials
              withBackground={false}
            />
          ),
        });
      }
    });
    avatarArray.push({
      icon: (
        <Avatar
          content={`+ ${row?.length - 3}`}
          color="light-danger"
          showOnlyInitials
          withBackground={false}
        />
      ),
    });
  } else {
    row?.map((e) => {
      if (e?.user?.picture !== null) {
        avatarArray.push({
          img: e?.user?.picture,
          title: `${FirstUpperCase(e?.user?.first_name)} ${FirstUpperCase(e?.user?.last_name)}`,
        });
      } else {
        avatarArray.push({
          title: `${FirstUpperCase(e?.user?.first_name)} ${FirstUpperCase(e?.user?.last_name)}`,
          icon: (
            <Avatar
              className="cu-avatar"
              content={`${FirstUpperCase(e?.user?.first_name)} ${FirstUpperCase(
                e?.user?.last_name,
              )}`}
              showOnlyInitials
              withBackground={false}
            />
          ),
        });
      }
    });
  }

  return avatarArray;
};

/**
 * It takes a row object as an argument and pushes a new route to the router object
 * @param row - The row data object
 */
const onRowClicked = (row, router) => {
  router.push({
    pathname: `/admin/notification-partner/recipient-list/${row.id}`,
  });
};

type RowType = {};
const columns: TableColumn<RowType>[] = [
  {
    name: "Title",
    selector: (row) => row?.title,
    minWidth: "250px",
    maxWidth: "250px",
    sortable: true,
    width: "100",
    style: { cursor: "pointer" },
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/notification-partner/recipient-list/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400 single-line-elipsis3">{row?.title}</span>
      </Link>
    ),
  },
  {
    name: "Description",
    style: { cursor: "pointer" },
    selector: (row) => row?.description,
    minWidth: "450px",
    maxWidth: "450px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/notification-partner/recipient-list/${row.id}`,
        }}
      >
        {" "}
        <span className="sy-tx-modal2 f-400 single-line-elipsis2">{row?.description}</span>
      </Link>
    ),
  },
  {
    name: "Recipients",
    minWidth: "250px",
    maxWidth: "250px",
    style: { cursor: "pointer" },
    selector: (row) => row?.user_list,
    cell: (row) => (
      <>
        <Link
          href={{
            pathname: `/admin/notification-partner/recipient-list/${row.id}`,
          }}
        >
          <div div className="d-flex">
            {" "}
            <AvatarGroup data={imgrvc(photoSort(row?.user_list))} withBackground={false} />
          </div>
        </Link>
      </>
    ),
  },
  {
    name: "Date",
    minWidth: "150px",
    maxWidth: "150px",
    style: { cursor: "pointer" },
    selector: (row) => row?.created_at,
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/notification-partner/recipient-list/${row.id}`,
        }}
      >
        {" "}
        <span className="sy-tx-modal2 f-400">{convertDate(row?.created_at, 2)}</span>
      </Link>
    ),
    sortable: true,
  },
  {
    name: "ACTIONS",
    minWidth: "110px",
    maxWidth: "110px",
    style: { cursor: "pointer" },
    selector: (row) => (
      <>
        <Link
          href={{
            pathname: `/admin/notification-partner/recipient-list/${row.id}`,
          }}
        >
          <span className="sy-tx-modal2">
            <Eye size={20} />
          </span>
        </Link>
      </>
    ),
  },
];

const PartnerNotification: NextPageWithLayout = () => {
  const router = useRouter();
  const notification = useSelector((state: any) => state?.notificationReducer?.notification);
  const totalNotification = useSelector(
    (state: any) => state?.notificationReducer?.totalNotification,
  );
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const totalPage = Math.ceil(totalNotification / perPage);
  const permission = checkPermisson(router.pathname);

  /**
   * This function is used to get the list of notifications.
   * @param page - The page number of the paginated list.
   * @param perPage - The number of items per page.
   * @param search - search string
   */
  const getNotificationlist = async (page, perPage, search) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("page", page);
    formData.append("per_page", perPage);
    formData.append("search", search);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(notificationListApiCall(formData) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* A react hook that is used for data fetching, setting up a subscription, and manually changing the
  DOM in React components. */
  useEffect(() => {
    getNotificationlist(page, perPage, search);
  }, [page, perPage, search, isUpdate]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Partner Notifications</title>
      </Helmet>
      <div>
        <div className="d-flex justify-content-between mb-2 flex-wrap">
          <h3>Partner Notifications</h3>
          {permission?.add_access === 1 && <OffCanvas2 updateData={() => setIsUpdate(!isUpdate)} />}
        </div>
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="header-search-filter">
              <div>{NoOfEntries(page, perPage, totalNotification)}</div>
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
              <div className="react-dataTable-partner-notification">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable-partner-notification"
                  sortIcon={<ChevronDown size={10} />}
                  data={notification}
                  highlightOnHover
                  onRowClicked={(row) => onRowClicked(row, router)}
                />
              </div>
            ) : (
              <ShimmerTable col={5} row={10} />
            )}

            {totalNotification !== 0 && (
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

PartnerNotification.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default PartnerNotification;
