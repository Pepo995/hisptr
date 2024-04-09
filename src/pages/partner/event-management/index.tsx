import { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Calendar, ChevronDown, Eye } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";

import Avatar from "@components/avatar";
import Breadcrumbs from "@components/breadcrumbs";
import Link from "next/link";
import { useRouter } from "next/router";

import Flatpickr from "react-flatpickr";
import {
  FirstUpperCase,
  LastChar,
  convertDate,
  onSearchHandler,
  perPageHandler,
  perPageOptions,
  setFilterDropdown,
} from "@utils/Utils";
import { ShimmerTable } from "react-shimmer-effects";
import { eventListingApiCall } from "@redux/action/EventAction";
import { useDispatch, useSelector } from "react-redux";
import { PreferenceListApiCall } from "@redux/action/PreferenceAction";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { type SelectNumericOption } from "@types";
import { type AnyAction } from "@reduxjs/toolkit";
import flatpickr from "flatpickr";

const statusOptions = [
  { label: "Initial", value: "initial" },
  { label: "In Planning", value: "in_planning" },
  { label: "Completed", value: "completed" },
];
type RowType = {
  host_id: number;
  id: string;
  event_number: string;
  first_name: string;
  last_name: string;
  email: string;
  event_date: string;
  package: { title: string };
  venue: { city: string };
  partner: { first_name: string; last_name: string };
  partner_id: number;
  host: { first_name: string; last_name: string };
  user: { picture: string };
};
const columns: TableColumn<RowType>[] = [
  {
    name: "Event ID",
    style: { cursor: "pointer" },
    selector: (row) => row?.event_number,
    minWidth: "150px",
    maxWidth: "150px",
    sortable: true,
    width: "100",
    cell: (row) => (
      <Link
        href={{
          pathname: `/event-management/view-event-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-primary f-900">#{row?.event_number}</span>
      </Link>
    ),
  },
  {
    name: "Customer Name",
    style: { cursor: "pointer" },
    selector: (row) => `${FirstUpperCase(row?.first_name)} ${LastChar(row?.last_name)}`,
    minWidth: "200px",
    maxWidth: "200px",
    sortable: true,
    cell: (row) => (
      <Link
        href={{
          pathname: `/event-management/view-event-detail/${row.id}`,
        }}
      >
        <div className="d-flex align-items-center">
          {row?.user?.picture !== null ? (
            <Avatar img={row?.user?.picture} />
          ) : (
            <Avatar
              /* eslint-disable-next-line */
              content={
                `${FirstUpperCase(row?.first_name)}` + " " + `${FirstUpperCase(row?.last_name)}`
              }
              showOnlyInitials
              className="cu-avatar"
            />
          )}
          <div className="user-info text-truncate ms-1">
            <span className="d-block fw-bold text-truncate sy-tx-modal">
              {FirstUpperCase(row?.first_name)} {LastChar(row?.last_name)}.
            </span>
            <small className="post-name single-line-elipsis">{row.email}</small>
          </div>
        </div>
      </Link>
    ),
  },
  {
    name: "Event Date",
    style: { cursor: "pointer" },
    selector: (row) => convertDate(row?.event_date, 1),
    minWidth: "200px",
    maxWidth: "200px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/event-management/view-event-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{convertDate(row?.event_date, 1)}</span>
      </Link>
    ),
  },
  {
    name: "Package Type",
    style: { cursor: "pointer" },
    selector: (row) => row?.package?.title,
    minWidth: "200px",
    maxWidth: "200px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/event-management/view-event-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{row?.package?.title}</span>
      </Link>
    ),
  },
  {
    name: "Event city",
    style: { cursor: "pointer" },
    selector: (row) => row?.venue?.city,
    cell: (row) => (
      <Link
        href={{
          pathname: `/event-management/view-event-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal2 f-400">{row?.venue?.city || "--"}</span>
      </Link>
    ),
  },
  {
    name: "Event Assign to",
    style: { cursor: "pointer" },
    /*eslint-disable-next-line */
    selector: (row) =>
      /*eslint-disable*/
      row?.partner_id === row?.host_id
        ? `${FirstUpperCase(row?.partner?.first_name)} ${FirstUpperCase(row?.partner?.last_name)}`
        : `${FirstUpperCase(row?.host?.first_name)} ${FirstUpperCase(row?.host?.last_name)}`,
    /*eslint-enable*/
    minWidth: "200px",
    maxWidth: "200px",
    cell: (row) => (
      <Link
        href={{
          pathname: `/event-management/view-event-detail/${row.id}`,
        }}
      >
        <span className="sy-tx-modal f-600">
          {
            /*eslint-disable */
            row?.partner_id !== null && row?.host_id !== null
              ? row?.partner_id === row?.host_id
                ? `${FirstUpperCase(row?.partner?.first_name)} ${FirstUpperCase(
                    row?.partner?.last_name,
                  )}`
                : `${FirstUpperCase(row?.host?.first_name)} ${FirstUpperCase(row?.host?.last_name)}`
              : "--"
            /*eslint-enable */
          }
        </span>
      </Link>
    ),
  },
  {
    name: "ACTIONS",
    style: { cursor: "pointer" },
    cell: (row) => (
      <>
        <Link
          href={{
            pathname: `/event-management/view-event-detail/${row.id}`,
          }}
        >
          <span className="sy-tx-modal2">
            <Eye size={20} />
          </span>
        </Link>
      </>
    ),
    sortable: false,
  },
];

const EventList: NextPageWithLayout = () => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  const event = useSelector((state: any) => state.eventReducer.event);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  const totalEvent = useSelector((state: any) => state.eventReducer.totalEvent);
  const [isLoading, setIsLoading] = useState(false);
  const [picker, setPicker] = useState<Date[]>();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState<{ value: string }>();
  const [status, setStatus] = useState<{ value: string }>();
  const [marketOptions, setMarketOptions] = useState<SelectNumericOption[]>();
  const [filter, setFilter] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const totalPage = Math.ceil(totalEvent / perPage);
  /*eslint-disable-next-line */
  const [host] = useState<{ value: string }>();

  const onRowClicked = (row: RowType) => {
    void router.push({
      pathname: `/event-management/view-event-detail/${row.id}`,
    });
  };
  /**
   * It calls the PreferenceListApiCall function and then sets the marketOptions state with the response
   * data.
   */
  const getMarkets = async () => {
    const tempArray: SelectNumericOption[] = [];
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(
      PreferenceListApiCall({
        type: "market",
        sort_field: "name",
        sort_order: "asc",
      }) as unknown as AnyAction,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response?.data?.data?.preferences?.map((e: { name: string; id: number }) => {
      tempArray.push({ label: e.name, value: e.id });
    });
    setMarketOptions(tempArray);
  };
  /**
   * It makes an API call to the backend to get a list of events
   */
  const getEvents = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("page", page.toString());
    formData.append("per_page", perPage.toString());
    formData.append("sort_field", "id");
    formData.append("sort_order", "desc");
    formData.append("search", search);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(eventListingApiCall(formData) as unknown as AnyAction);
    setIsLoading(false);
  };

  const filterHandler = async () => {
    if (picker !== null || !!market || !!status || !!host) {
      if (market) {
        setFilter(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const date1 = flatpickr.formatDate(picker?.[0] ?? new Date(), "Y-m-d");
        const date2 = flatpickr.formatDate(picker?.[1] ?? new Date(), "Y-m-d");
        setIsLoading(true);
        const formData = new FormData();
        formData.append("page", "1");
        formData.append("per_page", perPage.toString());
        formData.append("search", search);
        formData.append("market", market?.value ?? "");
        formData.append("host_id", host?.value ? host?.value : "");
        formData.append("status", status?.value ? status?.value : "");
        /*eslint-disable-next-line */
        picker !== null && formData.append("date_range[]", date1);
        /*eslint-disable-next-line */
        picker !== null && formData.append("date_range[]", date2);
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const response = await dispatch(eventListingApiCall(formData) as unknown as AnyAction);
        if (response?.status === 200) {
          setPage(1);
        }
        setIsLoading(false);
      }
    } else {
      toast.error("SELECT_FILTER");
    }
  };
  /**
   * It sets the state of the picker, market, status, filter, and isReset to null, [], [], false, and
   * !isReset respectively
   */
  const resetHandler = () => {
    setPicker([]);
    setMarket(undefined);
    setStatus(undefined);
    setFilter(false);
    setIsReset(!isReset);
  };

  useEffect(() => {
    void getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search, isReset]);

  useEffect(() => {
    void getMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Hipstr - Event Management</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs title="Event Management" data={[{ title: "Events List" }]} />
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2 mb-1 filter-section ">
            <div className="h-input margin-bottom">
              <Input
                type="search"
                isClearable={true}
                placeholder="Search"
                className="me-sm-1 event-search form-control"
                onChange={(e) => onSearchHandler(e, setSearch, setPage)}
              />
            </div>
            <div className="h-location d-flex">
              <Select
                className="react-select margin-bottom me-lg-1 select-market"
                classNamePrefix="select"
                options={marketOptions?.map((e) => ({ ...e, value: e.value.toString() }))}
                value={market}
                onChange={(e) => {
                  setFilterDropdown(setMarket, e ?? { value: "" });
                }}
                isDisabled={filter}
                isClearable={!filter}
                placeholder="Select market"
                isMulti={false}
              />
              <Select
                className="react-select margin-bottom me-lg-1 select-market"
                classNamePrefix="select"
                options={statusOptions}
                value={status}
                placeholder="Select status"
                isSearchable={false}
                isDisabled={filter}
                onChange={(e) => {
                  setFilterDropdown(setStatus, e ?? { value: "" });
                }}
                isClearable={!filter}
              />
              <InputGroup className="margin-bottom select-date me-lg-1">
                <Flatpickr
                  value={picker}
                  id="range-picker"
                  className="form-control border-right"
                  onChange={(date) => setPicker(date)}
                  placeholder="Select date"
                  options={{
                    mode: "range",
                  }}
                  disabled={filter}
                />
                <InputGroupText className="cursor-pointer">
                  <Calendar size={14} />
                </InputGroupText>
              </InputGroup>
              <div className="filter-btn ">
                {!filter ? (
                  <Button className="custom-btn12" onClick={filterHandler}>
                    Apply Filter
                  </Button>
                ) : (
                  <Button className="custom-btn12" onClick={resetHandler}>
                    Reset Filter
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {!isLoading ? (
              <div className="react-dataTable">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  data={event}
                  highlightOnHover
                  onRowClicked={onRowClicked}
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
                      onChange={(e) => perPageHandler(e ?? { value: "" }, setPerPage, setPage)}
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

EventList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EventList;
