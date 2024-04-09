import { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Nav, NavItem, NavLink } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft } from "react-feather";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const ViewEventDetails: NextPageWithLayout = () => {
  const [active, setActive] = useState(1);
  const router = useRouter();
  const toggleTab = (tab: number) => {
    setActive(tab);
  };

  useEffect(() => {
    if (router.query === undefined) {
      void router.replace("/event-management");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-role-ui">
      <Helmet>
        <title>Hipstr - View Event Details</title>
      </Helmet>
      <Breadcrumbs
        title="Event Management"
        data={[
          { title: "Events List", link: "/partner/event-management" },
          { title: "View Event Details" },
        ]}
      />

      <Fragment>
        <Card className="bg-white">
          <CardBody className="p-0 mx-2 mt-1">
            <Nav pills className="">
              <Link
                href="/partner/event-management"
                className="primary me-50 align-items-center d-flex"
              >
                <ArrowLeft />
              </Link>{" "}
              <NavItem>
                <NavLink active={active === 1} onClick={() => toggleTab(1)}>
                  <span className="fw-bold">Event Details</span>
                </NavLink>
              </NavItem>
            </Nav>
          </CardBody>
        </Card>
        {/* <TabContent activeTab={active}>
          <TabPane tabId={1}>
            <EventDetail />
          </TabPane>
        </TabContent> */}
      </Fragment>
    </div>
  );
};
ViewEventDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ViewEventDetails;
