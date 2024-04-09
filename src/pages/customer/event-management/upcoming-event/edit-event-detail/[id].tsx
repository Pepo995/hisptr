import { useEffect, useMemo, useState } from "react";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";

import EventDetail from "@components/MyEvent/EventDetail";
import VenueDetail from "@components/MyEvent/VenueDetail";
import OnSiteSetup from "@components/MyEvent/OnSiteSetup";
import PhotoOverlay from "@components/MyEvent/PhotoOverlay";
import Breadcrumbs from "@components/breadcrumbs";
import { useDispatch } from "react-redux";
import { eventDetailsApiCall, preferenceApiCall } from "@redux/action/EventAction";
import { TabContent, TabPane } from "reactstrap";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import {
  type EventFromPhp,
  type GetEventsDetailsAction,
  type GetPreferencesAction,
  type Preference,
  type SelectNumericOption,
  type SelectOption,
} from "@types";
import { getEventTypesQuery, getStateQuery } from "@server/api/queries";
import ShimmerEventDetail from "@components/Shimmer/ShimmerEventDetail";
import { toast } from "react-toastify";
import {
  customerUpdateEvent as step1Schema,
  customerUpdateVenue as step2Schema,
  customerUpdateSetup as step3Schema,
  customerUpdatePersonalization as step4Schema,
} from "@schemas";
import { api } from "@utils/api";
import { type EventPhotosDetail, type EventSetupDetail } from "@prisma/client";

const getSteps = () => {
  return ["Event Details", "Venue Details", "On Site Set up", "Personalization"];
};

const EventStep: NextPageWithLayout = () => {
  const router = useRouter();

  const eventId = typeof router.query.id === "string" ? parseInt(router.query.id) : 0;

  const [activeStep, setActiveStep] = useState(
    parseInt(localStorage.getItem(`steps${eventId}`) ?? "0") || 0,
  );
  const steps = getSteps();
  const dispatch = useDispatch();
  const [event, setEvent] = useState<EventFromPhp>();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<SelectNumericOption[]>();
  const [reach, setReach] = useState<SelectOption[]>();
  const [filter, setFilter] = useState<Preference[]>();
  const [orientation, setOrientation] = useState<Preference[]>();
  const [design, setDesign] = useState<Preference[]>();
  const [backdrop, setBackDrop] = useState<Preference[]>();
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [setupDetails, setSetupDetails] = useState<EventSetupDetail>();
  const [personalizationDetails, setPersonalizationDetails] = useState<EventPhotosDetail>();

  const { data: getSetupDetailsByEventId } =
    api.eventCustomerRouter.getSetupDetailsByEventId.useQuery({ eventId });

  const { data: getPersonalizationByEventId } =
    api.eventCustomerRouter.getPersonalizationByEventId.useQuery({ eventId });

  /**
   * It fetches the event details, categories, types and reach via from the backend and sets them in
   * the state
   * @param id - The id of the event you want to fetch
   */
  const getEventDetails = async (id: number) => {
    setIsLoading(true);

    // TODO: Refactor to get all 4 steps of the event using node app
    const res = await dispatch(eventDetailsApiCall({ id }) as unknown as GetEventsDetailsAction);
    setEvent(res?.data?.data?.event);

    const data = {
      sort_field: "name",
      sort_order: "asc",
    };

    /* Fetching the categories from the backend and setting them in the state. */
    const categoryArray: SelectNumericOption[] = [];
    const eventCategory = await dispatch(
      preferenceApiCall({ ...data, type: "category" }) as unknown as GetPreferencesAction,
    );
    eventCategory?.data?.data?.preferences.map((e) => {
      categoryArray.push({ label: e.name, value: e.id });
    });
    setCategory(categoryArray);

    /* Fetching the reach via from the backend and setting it in the state. */
    const reachViaArray: SelectOption[] = [];
    const eventReach = await dispatch(
      preferenceApiCall({ ...data, type: "reach_via" }) as unknown as GetPreferencesAction,
    );
    eventReach?.data?.data?.preferences.map((e) => {
      reachViaArray.push({ label: e.name, value: e.id.toString() });
    });
    setReach(reachViaArray);

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

    setActiveStep(parseInt(localStorage.getItem(`steps${eventId}`) ?? "0"));
    void getEventDetails(eventId);

    if (getSetupDetailsByEventId?.eventSetupDetails) {
      setSetupDetails(getSetupDetailsByEventId.eventSetupDetails);
    }

    if (getPersonalizationByEventId?.personalizationDetails) {
      setPersonalizationDetails(getPersonalizationByEventId?.personalizationDetails);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, getSetupDetailsByEventId, getPersonalizationByEventId]);

  useEffect(() => {
    setCompleted({
      0: step1Schema
        .omit({
          id: true,
        })
        .safeParse({
          firstName: event?.first_name,
          lastName: event?.last_name,
          email: event?.user?.email,
          phoneNumber: event?.phone_number,
          guestCount: event?.guest_count,
          eventDate: event?.event_date,
          categoryId: event?.category_id,
          typeId: event?.type_id,
          reachVia: event?.reach_via?.toString(),
          isEventPlanner: event?.is_event_planner,
          startTime: event?.start_time,
          endTime: event?.end_time,
        }).success,
      1: step2Schema.omit({ id: true }).safeParse({
        firstName: event?.venue?.first_name,
        lastName: event?.venue?.last_name,
        email: event?.venue?.email,
        name: event?.venue?.name,
        city: event?.venue?.city,
        addressLine1: event?.venue?.address_line_1,
        addressLine2: event?.venue?.address_line_2,
        zipcode: event?.venue?.zipcode,
        COI: event?.venue?.COI,
        stateId: event?.venue?.state_id,
      }).success,
      2: step3Schema.omit({ id: true }).safeParse({
        contactName: setupDetails?.contactName,
        phoneNumber: setupDetails?.phoneNumber,
        email: setupDetails?.email,
        location: setupDetails?.location,
        isParkingAvailable: setupDetails?.isParkingAvailable,
        setupLocation: setupDetails?.setupLocation,
        availableForSetup: setupDetails?.availableForSetup,
        isElevatorAvailable: setupDetails?.isElevatorAvailable,
        setupDetails: setupDetails?.setupDetails,
        allocationSpaceVerified: setupDetails?.allocationSpaceVerified,
      }).success,
      3: step4Schema.omit({ id: true }).safeParse({
        filterType: personalizationDetails?.filterType,
        orientationType: personalizationDetails?.orientationType,
        designType: personalizationDetails?.designType,
        firstLine: personalizationDetails?.firstLine,
        secondLine: personalizationDetails?.secondLine,
        primaryColor: personalizationDetails?.primaryColor,
        secondaryColor: personalizationDetails?.secondaryColor,
        vision: personalizationDetails?.vision,
        logo: personalizationDetails?.logo,
        backdropType: personalizationDetails?.backdropType,
      }).success,
    });
  }, [event, setupDetails, personalizationDetails]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    localStorage.setItem(`steps${eventId}`, (activeStep + 1).toString());
    completed[activeStep] = true;
    setCompleted(completed);
  };
  const handlePre = () => {
    setActiveStep(activeStep - 1);
    localStorage.setItem(`steps${eventId}`, (activeStep - 1).toString());
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const { isLoading: isLoadingEventTypes, data: eventResponse } = getEventTypesQuery({});

  const { isLoading: isLoadingEventStates, data: stateResponse } = getStateQuery({});

  const states: SelectNumericOption[] | undefined = useMemo(
    () => stateResponse?.map((e) => ({ label: e.name, value: e.id })),
    [stateResponse],
  );

  const types: SelectNumericOption[] | undefined = useMemo(
    () => eventResponse?.map((e) => ({ label: e.name, value: e.id })),
    [eventResponse],
  );

  if (isLoadingEventTypes || isLoadingEventStates || !event) return <ShimmerEventDetail />;

  if (typeof router.query.id !== "string") {
    toast.error("Invalid Event Id");
    void router.push("/customer/event-management/upcoming-event");
    return null;
  }

  return (
    <div className="main-role-ui">
      <Helmet>
        <title>Hipstr - Edit Event Details</title>
      </Helmet>
      <Breadcrumbs
        title="Event Management"
        data={[
          {
            title: "Event List",
            link: "/customer/event-management/upcoming-event",
          },
          { title: "Edit Event Details" },
        ]}
      />
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton onClick={handleStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <>
        <TabContent activeTab={activeStep}>
          <TabPane tabId={0}>
            <EventDetail
              handleNext={handleNext}
              event={event}
              category={category}
              types={types}
              reach={reach}
              id={eventId}
              isLoading={isLoading}
            />
          </TabPane>
          <TabPane tabId={1}>
            <VenueDetail
              handleNext={handleNext}
              handlePre={handlePre}
              event={event}
              states={states}
              id={eventId}
              isLoading={isLoading}
            />
          </TabPane>
          <TabPane tabId={2}>
            <OnSiteSetup
              handleNext={handleNext}
              handlePre={handlePre}
              id={eventId}
              isLoading={isLoading}
              setupData={setupDetails}
            />
          </TabPane>
          <TabPane tabId={3}>
            <PhotoOverlay
              handlePre={handlePre}
              personalizationDetails={personalizationDetails}
              event={event}
              filter={filter}
              orientation={orientation}
              design={design}
              backdrop={backdrop}
              id={eventId}
              isLoading={isLoading}
            />
          </TabPane>
        </TabContent>
        <div></div>
      </>
    </div>
  );
};

EventStep.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EventStep;
