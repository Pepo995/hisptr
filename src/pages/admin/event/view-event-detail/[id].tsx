import { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import { useDispatch } from "react-redux";
import { eventDetailApiCall, preferenceApiCall } from "@redux/action/EventAction";
import { ArrowLeft } from "react-feather";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  type EventFromPhp,
  type GetEventsDetailsAction,
  type GetPreferencesAction,
  type Preference,
} from "@types";
import PaymentsOverlay from "@components/EventManagement/PaymentsOverlay";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { api } from "@utils/api";
import { toast } from "react-toastify";
import EventDetailEdit from "@components/EventManagement/EventDetailEdit";
import VenueDetailEdit from "@components/EventManagement/VenueDetailEdit";
import OnSiteSetupEdit from "@components/EventManagement/OnSiteSetupEdit";
import EventAdminEdit from "@components/EventManagement/EventAdminEdit";
import PhotoOverlayEdit from "@components/EventManagement/PhotoOverlayEdit";

const EVENT_DETAIL_TAB_INDEX = 1;
const VENUE_DETAIL_TAB_INDEX = 2;
const ON_SITE_SETUP_TAB_INDEX = 3;
const PHOTO_OVERLAY_TAB_INDEX = 4;
const ADMIN_TAB_INDEX = 5;
const PAYMENT_TAB_INDEX = 6;

const ViewEventDetails: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(EVENT_DETAIL_TAB_INDEX);
  const [eventDetails, setEventDetails] = useState<EventFromPhp>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [filter, setFilter] = useState<Preference[]>();
  const toggleTab = (tab: number) => {
    setActive(tab);
  };
  const router = useRouter();
  const eventId = typeof router.query.id === "string" ? parseInt(router.query.id) : 0;

  const { data: payments, isLoading: isLoadingPayments } =
    api.paymentRouter.getEventPayments.useQuery(eventId, {
      enabled: router.query.id !== undefined,
    });

  const { data: result, isLoading: isLoadingEvent } = api.eventRouter.getEvent.useQuery(
    { id: parseInt(router.query.id! as string) },
    {
      enabled: router.query.id !== undefined,
    },
  );

  const getEventDetails = async (id: number) => {
    setIsLoading(true);

    const data = {
      sort_field: "name",
      sort_order: "asc",
    };

    const [eventDetailResponse, filterResponse] = await Promise.all([
      dispatch(eventDetailApiCall(id) as unknown as GetEventsDetailsAction),
      dispatch(
        preferenceApiCall({
          ...data,
          type: "filter",
          sort_field: "id",
        }) as unknown as GetPreferencesAction,
      ),
    ]);

    setEventDetails(eventDetailResponse.data?.data?.event);
    if (
      eventDetailResponse.data?.data?.event === undefined ||
      eventDetailResponse.data?.data?.event === null
    ) {
      setIsError(true);
      return;
    }
    setFilter(filterResponse?.data?.data?.preferences);
    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query === undefined) {
      router.back();
      return;
    }
    if (!eventId) return;

    void getEventDetails(eventId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (isLoadingPayments || isLoadingEvent || isLoading) return <ShimmerAddEvent />;
  if (!eventDetails) {
    if (isError) {
      toast.error("Error getting event data");
      void router.push("/");
      return;
    } else {
      return <ShimmerAddEvent />;
    }
  }

  if (!payments) {
    toast.error("Error getting event payments");
    void router.push("/");
    return;
  }

  if (!result?.success || !result.event) {
    toast.error("Error getting event data");
    void router.push("/");
    return;
  }

  return (
    <div>
      <Helmet>
        <title>Hipstr - View Event Details</title>
      </Helmet>
      <Breadcrumbs
        title="Event Management"
        data={[{ title: "Event List", link: "/admin/event" }, { title: "View Event Details" }]}
      />

      <Fragment>
        <Card className="bg-white">
          <CardBody className="p-0 mx-2 mt-1">
            <Nav pills className="">
              <Link href="/admin/event" className="align-items-center d-flex">
                {" "}
                <ArrowLeft className="sy-tx-primary me-50" />
              </Link>
              <NavItem>
                <NavLink
                  active={active === EVENT_DETAIL_TAB_INDEX}
                  onClick={() => toggleTab(EVENT_DETAIL_TAB_INDEX)}
                >
                  <span className="fw-bold">Event Details</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === VENUE_DETAIL_TAB_INDEX}
                  onClick={() => toggleTab(VENUE_DETAIL_TAB_INDEX)}
                >
                  <span className="fw-bold">Venue Details</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === ON_SITE_SETUP_TAB_INDEX}
                  onClick={() => toggleTab(ON_SITE_SETUP_TAB_INDEX)}
                >
                  <span className="fw-bold">On Site Set Up</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === PHOTO_OVERLAY_TAB_INDEX}
                  onClick={() => toggleTab(PHOTO_OVERLAY_TAB_INDEX)}
                >
                  <span className="fw-bold">Photo Overlay</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === ADMIN_TAB_INDEX}
                  onClick={() => toggleTab(ADMIN_TAB_INDEX)}
                >
                  <span className="fw-bold">Admin</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === PAYMENT_TAB_INDEX}
                  onClick={() => toggleTab(PAYMENT_TAB_INDEX)}
                >
                  <span className="fw-bold">Payments</span>
                </NavLink>
              </NavItem>
            </Nav>
          </CardBody>
        </Card>
        <TabContent activeTab={active}>
          <TabPane tabId={EVENT_DETAIL_TAB_INDEX}>
            <EventDetailEdit event={eventDetails} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={VENUE_DETAIL_TAB_INDEX}>
            <VenueDetailEdit event={eventDetails} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={ON_SITE_SETUP_TAB_INDEX}>
            <OnSiteSetupEdit event={eventDetails} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={PHOTO_OVERLAY_TAB_INDEX}>
            <PhotoOverlayEdit event={eventDetails} filters={filter} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={ADMIN_TAB_INDEX}>
            <EventAdminEdit event={result.event} isLoading={isLoading} />
          </TabPane>
          <TabPane tabId={PAYMENT_TAB_INDEX}>
            <PaymentsOverlay payments={payments} event={result.event} isLoading={isLoading} />
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
