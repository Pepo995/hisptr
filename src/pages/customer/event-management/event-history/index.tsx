import Avatar from "@components/avatar";
import Breadcrumbs from "@components/breadcrumbs";
import Select from "react-select";
import ReactPaginate from "react-paginate";

import { Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { eventHistoryListApiCall } from "@redux/action/EventAction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  FirstUpperCase,
  cardPerPageOptions,
  convertDate,
  onSearchHandler,
  perPageHandler,
} from "@utils/Utils";
import NoDataFound from "@components/Common/NoDataFound";
import EventShimmer from "@components/ShimmerCustomer/EventShimmer";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

import { NoOfEntries } from "@utils/platformUtils";
import { type AppState, type BaseAction, type EventFromPhp } from "@types";

const EventHistory: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const events = useSelector(
    (state: AppState) => state?.eventReducer?.historyEvent,
  ) as EventFromPhp[];
  const totalEvents = useSelector(
    (state: AppState) => state?.eventReducer?.totalHistoryEvent,
  ) as number;
  const [perPage, setPerPage] = useState(9);
  const [search, setSearch] = useState("");
  const totalPage = Math.ceil(totalEvents / perPage);
  /**
   * A function that is called when the page is loaded. It is used to get the list of events from the
   * database.
   */
  const getEvent = async () => {
    setIsLoading(true);
    const data = {
      page: page,
      per_page: perPage,
      search: search,
      sort_field: "id",
      sort_order: "desc",
      duration: "past",
    };

    await dispatch(eventHistoryListApiCall(data) as unknown as BaseAction);
    setIsLoading(false);
  };

  /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    void getEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, perPage]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Event History</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs title="Event Management" data={[{ title: "Event History" }]} />
        <Card className="bg-white">
          <CardHeader>
            <div>
              <label>{NoOfEntries(page, perPage, totalEvents)}</label>
            </div>
            <div className="event-filter">
              <Input
                type="search"
                isClearable={true}
                placeholder="Search"
                className="me-sm-1 my-0  custom-input"
                onChange={(e) => onSearchHandler(e, setSearch, setPage)}
              />
            </div>
          </CardHeader>
        </Card>
        {!isLoading ? (
          <>
            <Row className="match-height">
              {events && events?.length !== 0 ? (
                events?.map((item, i) => {
                  return (
                    <Col xxl={4} xl={6} md={6} sm={6} key={i} className="h-100">
                      <Link
                        href={{
                          pathname: `/customer/event-management/event-history/view-event-detail/${item.id}`,
                        }}
                      >
                        <Card className="cu-height">
                          <CardHeader className="p-0 mx-2 mt-2">
                            <div className="ticket sy-tx-primary f-900">
                              <span className="sy-tx-modal">Event ID:</span> #{item?.event_number}{" "}
                            </div>
                            <div className="sy-tx-modal">{convertDate(item?.event_date, 1)}</div>
                          </CardHeader>
                          <CardBody className="pe-0">
                            <div className="ticket sy-tx-primary f-900 mb-1">
                              <span className="sy-tx-modal">Event Status:</span>{" "}
                              {item?.customer_status || "--"}{" "}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="d-flex align-items-center">
                                {item?.user?.picture ? (
                                  <Avatar
                                    className="me-1"
                                    img={item?.user?.picture}
                                    content={
                                      `${FirstUpperCase(item?.first_name)}` +
                                      " " +
                                      `${FirstUpperCase(item?.last_name)}`
                                    }
                                    imgHeight={42}
                                    imgWidth={42}
                                    showOnlyInitials
                                  />
                                ) : (
                                  <Avatar
                                    className="me-1 cu-avatar"
                                    content={
                                      `${FirstUpperCase(item?.first_name)}` +
                                      " " +
                                      `${FirstUpperCase(item?.last_name)}`
                                    }
                                    imgHeight={42}
                                    imgWidth={42}
                                    showOnlyInitials
                                  />
                                )}
                                <div>
                                  <h5 className="mb-0 f-600">
                                    {`${FirstUpperCase(item?.first_name)}` +
                                      " " +
                                      `${FirstUpperCase(item?.last_name)}`}
                                  </h5>
                                  <small className="text-muted">{item?.email}</small>
                                </div>
                              </div>
                            </div>
                            <div className="event-content-customer">
                              <h6 className="sy-tx-grey">
                                Event City: <small className="sy-tx-modal">{item?.city}</small>
                              </h6>{" "}
                              <span className="border-left2 mx-1"></span>
                              <h6 className="sy-tx-grey">
                                Event State:{" "}
                                <small className="sy-tx-modal">{item?.state?.name}</small>
                              </h6>
                            </div>
                            <h6 className="sy-tx-grey">
                              Country: <small className="sy-tx-modal">{item?.market?.name}</small>
                            </h6>
                            <h6 className="sy-tx-grey">
                              Package: <small className="sy-tx-modal">{item?.package?.title}</small>
                            </h6>
                            <h6 className="sy-tx-grey">
                              Event Type: <small className="sy-tx-modal">{item?.type?.name}</small>
                            </h6>
                          </CardBody>
                        </Card>
                      </Link>
                    </Col>
                  );
                })
              ) : (
                <div className="no-data-found">
                  <NoDataFound message="event" />
                </div>
              )}
            </Row>
          </>
        ) : (
          <EventShimmer />
        )}
        {totalEvents !== 0 && (
          <div className="mr-b-120">
            <div className="align-items-center d-flex justify-content-between flex-wrap">
              <div className="p-0">
                <div className="d-flex align-items-center pagination-role">
                  <label htmlFor="rows-per-page">Show 1 To </label>
                  <Select
                    id="rows-per-page"
                    className="react-select mx-1"
                    classNamePrefix="select"
                    defaultValue={cardPerPageOptions[0]}
                    options={cardPerPageOptions}
                    onChange={(e) => perPageHandler(e ?? { value: "" }, setPerPage, setPage)}
                    isMulti={false}
                  />
                  <label htmlFor="rows-per-page"> Per Page</label>
                </div>
              </div>
              <div className="pagination-role-n mt-1 d-flex justify-content-end">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

EventHistory.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EventHistory;