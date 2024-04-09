import { useEffect, type ReactElement } from "react";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

import FaqDashboard from "@components/DashboardCustomer/FaqDashboard";
import { Col, Row } from "reactstrap";
import EventCountdown from "@components/DashboardCustomer/EventCountdown";
import PlanningTracker from "@components/DashboardCustomer/PlanningTracker";
import HomeShimmer from "@components/ShimmerCustomer/HomeShimmer";
import SupportRequestDashboard from "@components/DashboardCustomer/SupportRequestDashboard";
import { api } from "@utils/api";
import PackageCard from "@components/DashboardCustomer/PackageCard";
import { toast } from "react-toastify";

const Home: NextPageWithLayout = () => {
  const { data, isLoading, error } = api.eventCustomerRouter.getDashboard.useQuery();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Dashboard</title>
      </Helmet>
      {isLoading || data == null ? (
        <HomeShimmer />
      ) : (
        <>
          <Row className="match-height">
            <Col lg={6} md={12}>
              <EventCountdown event={data.event} />
            </Col>
            <Col lg={6} md={12}>
              <PlanningTracker event={data.event} />
            </Col>
          </Row>
          <Row className="match-height">
            {/* <Col lg={6} md={6}>
              <ActionDashboard event={data.event} />
            </Col> */}
            <Col lg={12} md={12}>
              <PackageCard event={data?.event} />
            </Col>
            {/* <Col lg={4} md={6}>
                          <AwaitingApprovalDashboard />
                        </Col> */}
          </Row>
          <SupportRequestDashboard tickets={data?.tickets.tickets} />
          <Row>
            <Col lg={12} md={12}>
              <FaqDashboard />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Home;
