import { type ReactElement, useMemo } from "react";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Calendar, ChevronDown, Eye } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { eventListingApiCall, eventMarketApiCall } from "@redux/action/EventAction";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";

import { useDispatch, useSelector } from "react-redux";

import { allPartnerListingApiCall } from "@redux/action/PartnerAction";
import Flatpickr from "react-flatpickr";
import {
  FirstUpperCase,
  formatPrice,
  onSearchHandler,
  perPageHandler,
  perPageOptions,
  setFilterDropdown,
} from "@utils/Utils";
import { checkPermisson, eventStatusOption } from "@utils/platformUtils";
import { ShimmerTable } from "react-shimmer-effects";
import { toast } from "react-toastify";
import { SELECT_FILTER } from "@constants/ToastMsgConstants";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { api } from "@utils/api";
import InProcessEventsTable, {
  type ExtendedInProcessEvent,
} from "@components/Table/InProcessEventsTable";
import type {
  AppState,
  BaseAction,
  EventFromPhp,
  GetPreferencesAction,
  GetUsersAction,
  SelectNumericOption,
  SelectOption,
} from "@types";
import flatpickr from "flatpickr";

const UPCOMING_EVENTS = 1;
const COMPLETED_EVENTS = 2;
const UNPAID_EVENTS = 3;

const EventList: NextPageWithLayout = () => {
  const event = useSelector((state: AppState) => state?.eventReducer?.eventList) as EventFromPhp[];
  const totalEvent = useSelector(
    (state: AppState) => state?.eventReducer?.totalEvent ?? 0,
  ) as number;
  const [isLoading, setIsLoading] = useState(false);
  const [picker, setPicker] = useState<Date[]>();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState<SelectNumericOption>();
  const [status, setStatus] = useState<(typeof eventStatusOption)[0]>();
  const [marketOptions, setMarketOptions] = useState<SelectNumericOption[]>([]);
  const [filter, setFilter] = useState(false);
  const totalPage = Math.ceil(totalEvent / perPage);
  const dispatch = useDispatch();
  const [host, setHost] = useState<SelectOption>();
  const [partnerOption, setPartnerOption] = useState<SelectOption[]>([]);
  const [showTab, setShowTab] = useState(UPCOMING_EVENTS);
  const router = useRouter();
  const permisson = checkPermisson(router.pathname);

  const [inProcessEvents, setInProcessEvents] = useState<ExtendedInProcessEvent[]>([]);
  const [totalInProcessEvents, setTotalInProcessEvents] = useState(0);
  const [inProcessEventsQueryInfo, setInProcessEventsQueryInfo] = useState<{
    enabled: boolean;
    page: number;
    pageSize: number;
    filter?: string;
  }>({
    enabled: false,
    page: 1,
    pageSize: 10,
    filter: undefined,
  });

  const getEventRealPriceInCents = (event: EventFromPhp) => {
    const initialPrice = event.total_price_in_cents ?? 0;
    const discount = event.discount_in_cents ?? 0;
    return initialPrice - discount;
  };

  api.eventRouter.getInProcessEvents.useQuery(inProcessEventsQueryInfo, {
    onSuccess: (data) => {
      if (data.success && data.events) {
        const { events, total } = data;
        setInProcessEvents(events);
        setTotalInProcessEvents(total);
        setInProcessEventsQueryInfo({
          ...inProcessEventsQueryInfo,
          enabled: false,
        });
        return;
      }
      toast.error("Error loading unpaid events");
    },
    enabled: inProcessEventsQueryInfo.enabled,
  });

  const cellPadding = { "padding-left": "12px", "padding-right": "12px" };

  const columns: TableColumn<EventFromPhp>[] = [
    {
      name: "Event ID",
      width: "120px",
      selector: (row) => row.event_number,
      sortable: true,
      style: { ...cellPadding },
    },
    {
      name: "Status",
      grow: 1,
      width: "250px",
      style: { cursor: "pointer", ...cellPadding },
      selector: (row) => row.admin_status,
      sortable: true,
      cell: (row) => (
        <span
          className={clsx("f-400 tw-rounded-md tw-p-2 tw-text-white", {
            "tw-bg-red-700": row.admin_status === "Awaiting Admin Confirmation",
            "tw-bg-blue-600": row.admin_status !== "Awaiting Admin Confirmation",
          })}
        >
          {row?.admin_status === "Awaiting Admin Confirmation"
            ? "Awaiting Confirmation"
            : row?.admin_status}
        </span>
      ),
    },
    {
      name: "Customer Name",
      selector: (row) => `${FirstUpperCase(row?.first_name)} ${FirstUpperCase(row?.last_name)}`,
      style: { ...cellPadding },
      sortable: true,
    },
    {
      name: "Event Date",
      style: { ...cellPadding },
      sortable: true,
      selector: (row) => row.event_date,
    },
    {
      name: "Package Type",
      style: { ...cellPadding },
      selector: (row) => row.package?.title ?? "Not defined",
    },
    {
      name: "Paid / Total",
      style: { ...cellPadding },
      selector: (row) =>
        `${formatPrice((row?.amount_paid_in_cents ?? 0) / 100)} /
         ${
           //formatPrice((row?.total_price_in_cents ?? 0) / 100, "USD")
           formatPrice(getEventRealPriceInCents(row) / 100)
         }`,
      conditionalCellStyles: [
        {
          when: (row) => row?.amount_paid_in_cents === getEventRealPriceInCents(row),
          style: {
            backgroundColor: "lawngreen",
          },
        },
      ],
    },
    {
      name: "ACTIONS",
      center: true,
      style: {
        cursor: "pointer",
        "justify-content": "center",
        ...cellPadding,
      },
      cell: (row) => (
        <div className="tw-flex tw-gap-4">
          {checkPermisson("event")?.edit_access === 1 && (
            <Link
              href={`/admin/event/view-event-detail/${row.id}`}
              className="tw-flex tw-items-center"
            >
              <span className="sy-tx-modal2">
                <Eye size={20} />
              </span>
            </Link>
          )}
        </div>
      ),
    },
  ];

  /**
   * FilterData() is a function that filters the data based on the selected filters
   */
  const FilterData = async () => {
    if (!!picker || !!market || !!status || host) {
      setFilter(true);
      const date1 = picker && flatpickr?.formatDate(picker[0] ?? new Date(), "Y-m-d");
      const date2 = picker && flatpickr?.formatDate(picker[1] ?? new Date(), "Y-m-d");
      setIsLoading(true);
      const formData = new FormData();
      formData.append("page", "1");
      formData.append("per_page", perPage.toString());
      formData.append("search", search);
      formData.append("market", market?.value.toString() ?? "");
      formData.append("status", status?.value ?? "");
      formData.append("host_id", host?.value ?? "");

      if (picker) {
        formData.append("date_range[]", date1 ?? "");
        formData.append("date_range[]", date2 ?? "");
      }

      await dispatch(eventListingApiCall(formData) as unknown as BaseAction);
      setPage(1);
      setIsLoading(false);
    } else {
      toast.error(SELECT_FILTER);
      setIsLoading(false);
    }
  };

  /**
   * It fetches the market and partner data from the API and stores it in the state.
   */
  const getMarket = async () => {
    setIsLoading(true);
    const marketOptions: SelectNumericOption[] = [];
    const response = await dispatch(
      eventMarketApiCall({
        type: "market",
        sort_field: "name",
        sort_order: "asc",
      }) as unknown as GetPreferencesAction,
    );
    response?.data?.data?.preferences?.map((ele) => {
      marketOptions.push({ label: ele.name, value: ele.id });
    });
    setMarketOptions(marketOptions);
    setIsLoading(false);
  };

  /**
   * It makes an API call to the backend and fetches the data based on the parameters passed to it
   * @param page - The page number of the data you want to fetch.
   * @param perPage - The number of items to show per page.
   * @param search - The search string
   */
  const getEvent = async (
    page: number,
    perPage: number,
    search: string,
    inProcessEvents = false,
  ) => {
    if (inProcessEvents) {
      setInProcessEventsQueryInfo({
        page,
        pageSize: perPage,
        enabled: true,
      });
      return;
    }

    setIsLoading(true);
    const date1 = picker && flatpickr?.formatDate(picker[0] ?? new Date(), "Y-m-d");
    const date2 = picker && flatpickr?.formatDate(picker[1] ?? new Date(), "Y-m-d");
    const formData = new FormData();
    formData.append("page", page.toString());
    formData.append("per_page", perPage.toString());
    formData.append("search", search);

    if (market) formData.append("market", market.value.toString() ?? "");

    if (status) formData.append("status", status?.value ?? "");

    if (picker) {
      formData.append("date_range[]", date1 ?? "");
      formData.append("date_range[]", date2 ?? "");
    }

    formData.append("market", market?.value.toString() ?? "");
    formData.append("status", status?.value ?? "");
    formData.append("host_id", host?.value ?? "");
    formData.append("sort_field", "event_date");
    formData.append("sort_order", "asc");
    if (showTab === UPCOMING_EVENTS) formData.append("is_upcoming", true.toString());

    await dispatch(eventListingApiCall(formData) as unknown as BaseAction);
    setIsLoading(false);
  };

  /**
   * It resets the data to the initial state.
   */
  const resetData = async (tabChange = false, tabNum = UPCOMING_EVENTS) => {
    setIsLoading(true);
    setPicker(undefined);
    setMarket(undefined);
    setStatus(undefined);
    setHost(undefined);
    setFilter(false);

    if (tabChange && tabNum === UNPAID_EVENTS) {
      await getEvent(1, 10, "", true);
      return;
    }

    const formData = new FormData();
    if (tabChange && tabNum === COMPLETED_EVENTS) {
      formData.append("status", "serviced");
    } else {
      formData.append("is_upcoming", true.toString());
    }
    formData.append("page", "1");
    formData.append("per_page", perPage.toString());
    formData.append("sort_field", "event_date");
    formData.append("sort_order", "asc");
    formData.append("search", search);

    await dispatch(eventListingApiCall(formData) as unknown as BaseAction);
    setPage(1);
    setIsLoading(false);
  };

  useEffect(() => {
    void getEvent(page, perPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, perPage]);

  useEffect(() => {
    void getMarket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getPartner = async () => {
      if (market) {
        const res = await dispatch(
          allPartnerListingApiCall({
            type: "partner",
            sort_field: "company",
            sort_order: "asc",
            market_id: market?.value,
          }) as unknown as GetUsersAction,
        );
        const partnerArr: SelectOption[] = res?.data?.data?.users?.map((e) => ({
          label: e.company,
          value: e.id,
        }));
        setPartnerOption(partnerArr);
      }
    };

    void getPartner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market, dispatch]);

  const tabChangeHandler = (tab: number) => {
    void resetData(true, tab);
    setShowTab(tab);
  };

  const renderInProcessEventsTable = useMemo(
    () =>
      inProcessEventsQueryInfo.enabled ? (
        <ShimmerTable />
      ) : (
        <InProcessEventsTable
          events={inProcessEvents}
          pageSize={inProcessEventsQueryInfo.pageSize}
          setPageSize={(pageSize: number) =>
            setInProcessEventsQueryInfo({
              ...inProcessEventsQueryInfo,
              enabled: true,
              page: 1,
              pageSize,
            })
          }
          page={inProcessEventsQueryInfo.page}
          setPage={(page: number) =>
            setInProcessEventsQueryInfo({ ...inProcessEventsQueryInfo, enabled: true, page })
          }
          totalEvents={totalInProcessEvents}
          applyFilter={(filter?: string) => {
            setInProcessEventsQueryInfo({
              ...inProcessEventsQueryInfo,
              enabled: true,
              page: 1,
              filter,
            });
          }}
          filter={inProcessEventsQueryInfo.filter}
        />
      ),
    [inProcessEvents, inProcessEventsQueryInfo, totalInProcessEvents],
  );

  return (
    <>
      <Helmet>
        <title>Hipstr - Event Management</title>
      </Helmet>
      <div>
        <Row className="mb-sm-2">
          <Col lg={10}>
            <Breadcrumbs title="Event Management" data={[{ title: "Events List" }]} />
          </Col>
          {permisson?.add_access === 1 && (
            <Col lg={2} className="text-end">
              <Link href="/admin/event/add-event">
                <Button className="custom-btn12 mb-75">Add Event</Button>
              </Link>
            </Col>
          )}
        </Row>
        <Row>
          <div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={`${showTab === UPCOMING_EVENTS ? "active" : ""}`}
                  onClick={() => tabChangeHandler(UPCOMING_EVENTS)}
                >
                  Upcoming event
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={`${showTab === COMPLETED_EVENTS ? "active" : ""}`}
                  onClick={() => tabChangeHandler(COMPLETED_EVENTS)}
                >
                  Completed event
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={`${showTab === UNPAID_EVENTS ? "active" : ""}`}
                  onClick={() => tabChangeHandler(UNPAID_EVENTS)}
                >
                  Leads
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </Row>
        {showTab === UNPAID_EVENTS ? (
          renderInProcessEventsTable
        ) : (
          <Card className="bg-white">
            <CardHeader className="p-0 mx-1 mt-2 mb-1 filter-section">
              <div className="h-input margin-bottom">
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search"
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                  className="me-sm-1 event-search"
                />
              </div>
              <div className="h-location d-flex">
                <Select
                  className="react-select margin-bottom me-lg-1 select-market"
                  classNamePrefix="select"
                  options={marketOptions}
                  value={market ?? null}
                  onChange={(e) => {
                    setFilterDropdown(setMarket, e ?? undefined);
                    setMarket(e ?? undefined);
                    setHost(undefined);
                  }}
                  isDisabled={filter}
                  isClearable={!filter}
                  placeholder="Select Market"
                  isMulti={false}
                />
                {market && (
                  <Select
                    className="react-select margin-bottom me-lg-1 select-market"
                    classNamePrefix="select"
                    options={partnerOption}
                    value={host ?? null}
                    onChange={(e) => {
                      setFilterDropdown(setHost, e ?? undefined);
                    }}
                    isDisabled={filter}
                    isClearable={!filter}
                    placeholder="Select Partner"
                    isMulti={false}
                  />
                )}
                {showTab === UPCOMING_EVENTS && (
                  <Select
                    className="react-select  margin-bottom me-lg-1 select-market"
                    classNamePrefix="select"
                    options={eventStatusOption}
                    value={status ?? null}
                    placeholder="Select Status"
                    isSearchable={false}
                    isDisabled={filter}
                    onChange={(e) => {
                      setFilterDropdown(setStatus, e ?? undefined);
                    }}
                    isClearable={!filter}
                  />
                )}

                <InputGroup className="me-lg-1  margin-bottom select-date">
                  <Flatpickr
                    value={picker}
                    id="range-picker"
                    className="form-control border-right"
                    onChange={setPicker}
                    placeholder="Select date range"
                    options={{
                      mode: "range",
                    }}
                    disabled={filter}
                  />
                  <InputGroupText className="cursor-pointer">
                    <Calendar size={14} />
                  </InputGroupText>
                </InputGroup>
                <div className="filter-btn2">
                  {!filter ? (
                    <Button className="custom-btn12" onClick={FilterData}>
                      Apply Filter
                    </Button>
                  ) : (
                    <Button className="custom-btn12" onClick={() => resetData()}>
                      Reset Filter
                    </Button>
                  )}
                </div>
              </div>
              <div className="filter-btn">
                {!filter ? (
                  <Button className="custom-btn12" onClick={FilterData}>
                    Apply Filter
                  </Button>
                ) : (
                  <Button className="custom-btn12" onClick={() => resetData()}>
                    Reset Filter
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardBody className="p-0">
              {!isLoading ? (
                <div className="react-dataTable-event">
                  <DataTable
                    selectableRows
                    columns={columns}
                    className="react-dataTable-event"
                    sortIcon={<ChevronDown size={10} />}
                    data={event}
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
                        onChange={(e) =>
                          perPageHandler({ value: e?.value ?? "" }, setPerPage, setPage)
                        }
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
        )}
      </div>
    </>
  );
};

EventList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EventList;
