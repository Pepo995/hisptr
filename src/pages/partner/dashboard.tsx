import { type ReactElement } from "react";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import AvailabilityCheckDashboard from "@components/DashboardPartner/AvailabilityCheckDashboard";
import UpcomingEvent from "@components/DashboardPartner/UpcomingEvent";

import calenderIcon from "@images/dashboard/calendar.png";
import locationIcon from "@images/dashboard/location.png";
import timeIcon from "@images/dashboard/time.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AvailabilityListAPICall, UpcomingEventAPICall } from "@redux/action/DashboardAction";
import { convertDate } from "@utils/Utils";
import moment from "moment";
import DashboardShimmer from "@components/ShimmerPartner/DashboardShimmer";
import Link from "next/link";

const Home: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [upcomingEvent, setUpcomingEvent] = useState({});
  const [availabilityList, setAvailabilityList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getUpcomingEvent = async () => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(UpcomingEventAPICall() as unknown as AnyAction);
    if (response) {
      setUpcomingEvent({ ...response?.data?.data });
      setIsLoading(false);
    }
  };
  const getAvailabilityList = async () => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(AvailabilityListAPICall() as unknown as AnyAction);
    if (response) {
      setAvailabilityList([...(response?.data?.data?.requests ?? [])]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUpcomingEvent();
    getAvailabilityList();
  }, []);
  return (
    <>
      <Helmet>
        <title>Hipstr - Dashboard</title>
      </Helmet>
      <h2 className="dashboard-title mb-2 f-500">Dashboard</h2>
      {!isLoading ? (
        <div>
          <Row className="match-height">
            <Col lg="6" md="12">
              <Card className="next-event-card bg-white">
                {upcomingEvent?.next_event?.id ? (
                  <Link
                    href={{
                      pathname: `/event-management/view-event-detail/${upcomingEvent?.next_event?.id}`,
                    }}
                  >
                    <CardBody>
                      <CardTitle className="sy-tx-modal font2024 f-600">
                        Your Next Hipstr Event
                      </CardTitle>
                      <CardBody className="inner-event-card-body">
                        <Row className="g-1">
                          <Col sm={6}>
                            <div className="item-center gap-1 justify-start">
                              <img className="next-event-icon" src={calenderIcon.src} alt="" />
                              <p className="mb-0 sy-text-dark f-500">
                                {convertDate(upcomingEvent?.next_event?.event_date, 3) || "--"}
                              </p>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="item-center gap-1 justify-content-sm-end justify-content-start">
                              <img className="next-event-icon" src={timeIcon.src} alt="" />
                              {/* <p className="mb-0 sy-text-dark f-500">09:00 PM - 11:00 PM</p> */}
                              <p className="mb-0 sy-text-dark f-500">
                                {upcomingEvent?.next_event?.start_time !== null
                                  ? moment(
                                      upcomingEvent?.next_event?.start_time,
                                      "hh:mm:ss",
                                    )?.format("hh:mm A")
                                  : "--"}{" "}
                                -{" "}
                                {upcomingEvent?.next_event?.end_time !== null
                                  ? moment(upcomingEvent?.next_event?.end_time, "hh:mm:ss")?.format(
                                      "hh:mm A",
                                    )
                                  : "--"}
                              </p>
                            </div>
                          </Col>
                          <Col sm={12}>
                            <div className="item-center gap-1 justify-start">
                              <img className="location-icon" src={locationIcon.src} alt="" />
                              <p className="mb-0 sy-text-dark f-500">
                                {upcomingEvent?.next_event?.venue?.address_line_1}
                                {", "}
                                {upcomingEvent?.next_event?.venue?.address_line_2}
                                {", "}
                                {upcomingEvent?.next_event?.venue?.city}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </CardBody>
                  </Link>
                ) : (
                  // <img src={NoDataCover} alt="" />
                  // <p>No Data Found</p>
                  <CardBody>
                    <CardTitle className="sy-tx-modal font2024 f-600">
                      Your Next Hipstr Event
                    </CardTitle>
                    {/* <div className="item-center">
                                          <BsDatabaseExclamation size={80} />
                                      </div> */}
                    <p className="text-center sy-tx-modal  f-500 mb-0 mt-1">
                      There are currently no Hipstr Events assigned to you. Respond to Availability
                      Checks in your area to be assigned events.
                    </p>
                  </CardBody>
                )}
              </Card>
            </Col>
            <Col lg="6" md="12">
              <Card className="event-status-card bg-white">
                <CardBody className="event-status-card-body">
                  <CardTitle className="sy-tx-modal font2024 f-600">Event Statistics</CardTitle>
                  <CardBody className="p-0">
                    <Row className="match-height g-0 inner-box">
                      <Col sm={9}>
                        <Card className="left-box mb-0">
                          <p className="sy-tx-modal mb-0">Future</p>
                          <div className="three-box">
                            <Row>
                              <Col sm={4}>
                                <div className="each-box item-center justify-start">
                                  <div className="common-count-box count-box item-center">
                                    {upcomingEvent?.this_week}
                                  </div>
                                  <p className="sy-text-dark mb-0 ">This Week</p>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="each-box item-center justify-start">
                                  <div className="common-count-box count-box item-center">
                                    {upcomingEvent?.this_month}
                                  </div>
                                  <p className="sy-text-dark mb-0 ">This Month</p>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="each-box item-center justify-start">
                                  <div className="common-count-box count-box item-center">
                                    {upcomingEvent?.this_year}
                                  </div>
                                  <p className="sy-text-dark mb-0 ">This Year</p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={3}>
                        <Card className="right-box mb-0">
                          <p className="sy-tx-white">Past</p>
                          <div className="item-center">
                            <div className="common-count-box count-box d-flex justify-content-center">
                              {upcomingEvent?.last_year}
                            </div>
                            <p className="sy-tx-white mb-0 ">Last Year</p>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </CardBody>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="match-height">
            <Col lg="6" md="12">
              <UpcomingEvent eventList={upcomingEvent?.upcoming_events} />
            </Col>
            <Col lg="6" md="12">
              <AvailabilityCheckDashboard list={availabilityList} setList={setAvailabilityList} />
            </Col>
          </Row>
        </div>
      ) : (
        <DashboardShimmer />
      )}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Home;
