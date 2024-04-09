import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

import { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { ChevronDown, Eye } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { Button, Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";

import {
  convertDate,
  onSearchHandler,
  perPageHandler,
  perPageOptions,
  setFilterDropdown,
} from "@utils/Utils";
import { NoOfEntries, checkPermisson, eventDateSortOption } from "@utils/platformUtils";

import OffCanvasPlacement from "@components/Common/OffCanvas";
import { useDispatch, useSelector } from "react-redux";
import { AvailabilityListAPICall } from "@redux/action/AvailabilityAction";
import { ShimmerTable } from "react-shimmer-effects";

import { Helmet } from "react-helmet";

import { SELECT_FILTER } from "@constants/ToastMsgConstants";
import { useRouter } from "next/router";
import Link from "next/link";
import { type AnyAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

type RowType = {
  package: { title: string };
  type: { name: string };
  event_date: string;
  state: { name: string };
  city: string;
  location: { name: string };
  id: number;
  availability_number: number;
};
const columns: TableColumn<RowType>[] = [
  {
    name: "Availability ID",
    selector: (row) => row?.availability_number,
    minWidth: "180px",
    maxWidth: "180px",
    sortable: true,
    style: { cursor: "pointer" },
    width: "100",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/availability-check/view-availability/${row.id}`,
        }}
      >
        <span className="sy-tx-primary f-900">
          {row?.availability_number ? `#${row?.availability_number}` : "--"}
        </span>
      </Link>
    ),
  },
  {
    name: "Market",
    style: { cursor: "pointer" },
    selector: (row) => row?.location?.name,
    minWidth: "250px",
    maxWidth: "250px",
    sortable: true,
    width: "100",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/availability-check/view-availability/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{row?.location?.name}</span>
      </Link>
    ),
  },

  {
    name: "Event City",
    style: { cursor: "pointer" },
    selector: (row) => row?.city,
    minWidth: "250px",
    maxWidth: "250px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/availability-check/view-availability/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{row?.city}</span>
      </Link>
    ),
  },
  {
    name: "Event State",
    style: { cursor: "pointer" },
    selector: (row) => row?.state?.name,
    minWidth: "250px",
    maxWidth: "250px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/availability-check/view-availability/${row.id}`,
        }}
      >
        {" "}
        <span className="sy-tx-modal2 f-400">{row?.state?.name}</span>
      </Link>
    ),
  },
  {
    name: "Event Date",
    style: { cursor: "pointer" },
    selector: (row) => convertDate(row?.event_date, 2),
    minWidth: "250px",
    maxWidth: "250px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/availability-check/view-availability/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{convertDate(row?.event_date, 2)}</span>
      </Link>
    ),
  },
  {
    name: " Event type",
    minWidth: "250px",
    maxWidth: "250px",
    selector: (row) => row?.type?.name,
    style: { cursor: "pointer" },
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/availability-check/view-availability/${row.id}`,
        }}
      >
        {" "}
        <span className="sy-tx-modal2 f-400">{row?.type?.name}</span>
      </Link>
    ),
  },
  {
    name: "PACKAGE TYPE",
    minWidth: "250px",
    maxWidth: "250px",
    style: { cursor: "pointer" },
    selector: (row) => row?.package?.title,
    cell: (row) => (
      <Link
        href={{
          pathname: `/admin/availability-check/view-availability/${row.id}`,
        }}
      >
        {" "}
        <span className="sy-tx-modal2 f-400">{row?.package?.title}</span>
      </Link>
    ),
  },
  {
    name: "ACTIONS",
    style: { cursor: "pointer" },
    minWidth: "100px",
    maxWidth: "100px",
    cell: (row) => (
      <>
        <Link
          href={{
            pathname: `/admin/availability-check/view-availability/${row.id}`,
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

const AvailabilityCheck: NextPageWithLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const availability = useSelector((state: any) => state?.availabilityReducer?.availabilityRequest);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const totalAvailability: number = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (state: any) => state?.availabilityReducer?.totalAvailabilityRequest,
  );
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const totalPage = Math.ceil(totalAvailability / perPage);
  const router = useRouter();
  const permission = checkPermisson(router.pathname);
  const [sortDate, setSortDate] = useState<{ value: string }>();

  const [filter, setfilter] = useState(false);

  /**
   * It's a function that gets the availability list from the API
   */
  const getAvailabilityList = async () => {
    setIsLoading(true);
    const data = {
      /*eslint-disable-next-line */
      page: page,
      per_page: perPage,
      sort_field: "event_date",
      sort_order: sortDate?.value ?? "desc",
      /*eslint-disable-next-line */
      search: search,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(AvailabilityListAPICall(data) as unknown as AnyAction);
    setIsLoading(false);
  };

  const FilterData = async () => {
    if (sortDate?.value) {
      setfilter(true);

      setIsLoading(true);
      const data = {
        /*eslint-disable-next-line */
        page: page,
        per_page: perPage,
        sort_field: "event_date",
        sort_order: sortDate?.value ? sortDate?.value : "",
        /*eslint-disable-next-line */
        search: search,
      };

      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(AvailabilityListAPICall(data) as unknown as AnyAction);
      setPage(1);
      setIsLoading(false);
    } else {
      toast.error(SELECT_FILTER);
      setIsLoading(false);
    }
  };
  /**
   * It resets the data to the initial state.
   */
  const resetData = () => {
    setSortDate(undefined);
    setfilter(false);
    void getAvailabilityList();
    setPage(1);
  };
  /* It's a react hook that runs whenever the page, perPage, or search state changes. */
  useEffect(() => {
    void getAvailabilityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search]);

  /**
   * It calls the getAvailabilityList() function
   */
  const refresh = () => getAvailabilityList();

  /**
   * It takes a row as an argument and pushes a new route to the router object
   * @param row - The row object that was clicked
   */
  const onRowClicked = (row: RowType) => {
    void router.push({
      pathname: `/admin/availability-check/view-availability/${row.id}`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Hipstr - Availability Check</title>
      </Helmet>
      <div>
        <div className="d-flex justify-content-between mb-2 flex-wrap">
          <h3>Availability Check</h3>
          {permission?.add_access === 1 && <OffCanvasPlacement refresh={() => refresh()} />}
        </div>
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="header-search-filter">
              <div>
                <label> {NoOfEntries(page, perPage, totalAvailability)} </label>
              </div>
              <div className="d-flex support-header mb-1">
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search"
                  className="me-sm-1"
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                />
                <Select
                  className="react-select margin-bottom me-lg-1 select-date-sort"
                  classNamePrefix="select"
                  options={eventDateSortOption}
                  value={sortDate}
                  placeholder="Select Sorting"
                  isSearchable={false}
                  isDisabled={filter}
                  onChange={(e) => {
                    setFilterDropdown(setSortDate, e ?? { value: "" });
                  }}
                  isMulti={false}
                  // isClearable={!filter}
                />
                <div className="filter-btn2">
                  {!filter ? (
                    <Button className="custom-btn12" onClick={FilterData}>
                      Apply Filter
                    </Button>
                  ) : (
                    <Button className="custom-btn12" onClick={resetData}>
                      Reset Filter
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {!isLoading ? (
              <div className="react-dataTable-availability">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable-availability"
                  sortIcon={<ChevronDown size={10} />}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  data={availability}
                  onRowClicked={onRowClicked}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={7} row={10} />
            )}

            {totalAvailability !== 0 && (
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
                      onChange={(e) => perPageHandler(e ?? { value: "" }, setPerPage, setPage)}
                      isSearchable={false}
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

AvailabilityCheck.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default AvailabilityCheck;
