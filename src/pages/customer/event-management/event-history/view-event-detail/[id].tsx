import { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import EventDetail from "@components/EventManagement/EventDetail";
import VenueDetail from "@components/EventManagement/VenueDetail";
import ViewOnSiteSetup from "@components/EventManagement/OnSiteSetup";
import PhotoOverlay from "@components/EventManagement/PhotoOverlay";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { eventDetailsApiCall, preferenceApiCall } from "@redux/action/EventAction";
import { ArrowLeft } from "react-feather";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import {
  type EventFromPhp,
  type GetEventsDetailsAction,
  type GetPreferencesAction,
  type Preference,
} from "@types";
import ShimmerEventDetail from "@components/Shimmer/ShimmerEventDetail";

const ViewEventDetails: NextPageWithLayout = () => {
  const router = useRouter();

  const eventId = typeof router.query.id === "string" ? parseInt(router.query.id) : 0;

  const [active, setActive] = useState<number>(1);
  const dispatch = useDispatch();
  const [event, setEvent] = useState<EventFromPhp>();
  const [filter, setFilter] = useState<Preference[]>();
  const [orientation, setOrientation] = useState<Preference[]>();
  const [design, setDesign] = useState<Preference[]>();
  const [backdrop, setBackDrop] = useState<Preference[]>();
  const [isLoading, setIsLoading] = useState(false);

  const toggleTab = (tab: number) => {
    setActive(tab);
  };

  const getEventDetails = async (id: number) => {
    setIsLoading(true);
    const res = await dispatch(eventDetailsApiCall({ id }) as unknown as GetEventsDetailsAction);
    setEvent(res?.data?.data?.event);
    setIsLoading(false);
  };

  const getEventType = async () => {
    setIsLoading(true);
    const data = {
      sort_field: "name",
      sort_order: "asc",
    };
    const filterResponse = await dispatch(
      preferenceApiCall({
        ...data,
        type: "filter",
        sort_field: "id",
      }) as unknown as GetPreferencesAction,
    );
    setFilter(filterResponse?.data?.data?.preferences);

    const orientationResponse = await dispatch(
      preferenceApiCall({
        ...data,
        type: "orientation",
        sort_field: "id",
      }) as unknown as GetPreferencesAction,
    );
    setOrientation(orientationResponse?.data?.data?.preferences);

    const designResponse = await dispatch(
      preferenceApiCall({
        ...data,
        type: "design",
        sort_field: "id",
      }) as unknown as GetPreferencesAction,
    );
    setDesign(designResponse?.data?.data?.preferences);

    const backdropResponse = await dispatch(
      preferenceApiCall({
        ...data,
        type: "backdrop",
        sort_field: "id",
      }) as unknown as GetPreferencesAction,
    );
    setBackDrop(backdropResponse?.data?.data?.preferences);
    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query === undefined) {
      router.back();
      return;
    }
    if (!eventId) return;

    void getEventDetails(eventId);
    void getEventType();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (!event) return <ShimmerEventDetail />;

  return (
    <div className="main-role-ui">
      <Helmet>
        <title>Hipstr - View Event Details</title>
      </Helmet>
      <Breadcrumbs
        title="Event Management"
        data={[
          {
            title: "Event History",
            link: "/customer/event-management/event-history",
          },
          { title: "View Event Details" },
        ]}
      />

      <Fragment>
        <Card className="bg-white">
          <CardBody className="p-0 mx-2 mt-1">
            <Nav pills className="">
              <Link
                href="/customer/event-management/event-history"
                className="align-items-center d-flex"
              >
                <ArrowLeft className="sy-tx-primary me-50" />
              </Link>
              <NavItem>
                <NavLink active={active === 1} onClick={() => toggleTab(1)} default>
                  <span className="fw-bold">Event Details</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={active === 2} onClick={() => toggleTab(2)}>
                  <span className="fw-bold">Venue Details</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={active === 3} onClick={() => toggleTab(3)}>
                  <span className="fw-bold">On Site Set Up</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={active === 4} onClick={() => toggleTab(4)}>
                  <span className="fw-bold">Photo Overlay</span>
                </NavLink>
              </NavItem>
            </Nav>
          </CardBody>
        </Card>
        <TabContent activeTab={active}>
          <TabPane tabId={1}>
            <EventDetail event={event} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={2}>
            <VenueDetail event={event} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={3}>
            <ViewOnSiteSetup event={event} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={4}>
            <PhotoOverlay
              event={event}
              filters={filter}
              orientation={orientation}
              design={design}
              backdrop={backdrop}
              isLoading={isLoading}
            />
          </TabPane>
        </TabContent>
      </Fragment>
    </div>
  );
};
ViewEventDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ViewEventDetails;
