import { useEffect, useState } from "react";
import {
  Button,
  Col,
  InputGroup,
  InputGroupText,
  Label,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
} from "reactstrap";
import Select from "react-select";

import Flatpickr from "react-flatpickr";

import { Calendar } from "react-feather";

import CustomeSwitch from "../Switch/CustomSwitch";
import moment from "moment";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { stateApiCall } from "@redux/action/CountryAction";
import { allPartnerListingApiCall } from "@redux/action/PartnerAction";
import { packageTypeApiCall, preferenceApiCall } from "@redux/action/EventAction";
import {
  CITY_REQUIRED,
  END_TIME_REQUIRED,
  EVENT_DATE_REQUIRED,
  EVENT_TYPE_REQUIRED,
  MARKET_REQUIRED,
  PACKAGE_REQUIRED,
  SELECT_PARTNER,
  START_TIME_REQUIRED,
  STATE_REQUIRED,
} from "@constants/ValidationConstants";
import { AvailabilityRequestAPICall } from "@redux/action/AvailabilityAction";
import OffCanvasShimmer from "@components/Shimmer/OffCanvasShimmer";
import MultiSelectAll from "./MultiSelectAll";

const OffCanvasPlacement = ({ refresh }) => {
  const dispatch = useDispatch();
  const [canvasPlacement, setCanvasPlacement] = useState("start");
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [countryOption, setCountryOption] = useState(null);
  const [partnerOption, setPartnerOption] = useState([]);
  const [packageOption, setPackageOption] = useState(null);
  const [eventOption, setEventOption] = useState(null);
  const [stateOption, setStateOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [market, setMarket] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const toggleCanvasStart = () => {
    setCanvasPlacement("start");
    setCanvasOpen(!canvasOpen);
  };

  const toggleCanvasEnd = () => {
    setCanvasPlacement("end");
    setCanvasOpen(!canvasOpen);
  };

  /**
   * It fetches data from the API and stores it in the state
   */
  const getDropdownData = async () => {
    setIsLoading(true);
    const data = { sort_field: "name", sort_order: "asc" };
    const countryArray = [];
    const country = await dispatch(preferenceApiCall({ ...data, type: "market" }));
    country?.data?.data?.preferences?.map((e) => {
      countryArray.push({ label: e?.name, value: e?.id });
    });
    setCountryOption(countryArray);

    const packageArray = [];
    const packageList = await dispatch(packageTypeApiCall({ ...data, sort_field: "title" }));
    packageList?.data?.data?.packages?.map((e) => {
      packageArray.push({ label: e?.title, value: e?.id });
    });
    setPackageOption(packageArray);

    const eventArray = [];
    const eventType = await dispatch(preferenceApiCall({ ...data, type: "type" }));
    eventType?.data?.data?.preferences?.map((e) => {
      eventArray.push({ label: e?.name, value: e?.id });
    });
    setEventOption(eventArray);

    const stateArray = [];
    const stateList = await dispatch(stateApiCall(data));
    stateList?.data?.data?.states?.map((e) => {
      stateArray.push({ label: e?.name, value: e?.id });
    });
    setStateOption(stateArray);
    setIsLoading(false);
  };
  /* The above code is using the useEffect hook to call the getDropdownData function when the component
  mounts. */
  useEffect(() => {
    getDropdownData();
  }, []);

  /* Setting the initial values of the form to empty strings. */
  const initialFormValues = {
    event_date: "",
    event_type: "",
    start_time: "",
    end_time: "",
    market_id: "",
    city: "",
    state_id: "",
    package_id: "",
    partners: [],
  };
  /* A validation schema for the form. */
  const validationSchema = Yup.object({
    event_date: Yup.string().required(EVENT_DATE_REQUIRED),
    event_type: Yup.string().required(EVENT_TYPE_REQUIRED),
    start_time: Yup.string().required(START_TIME_REQUIRED),
    end_time: Yup.string().required(END_TIME_REQUIRED),
    market_id: Yup.string().required(MARKET_REQUIRED),
    city: Yup.string().required(CITY_REQUIRED),
    state_id: Yup.string().required(STATE_REQUIRED),
    package_id: Yup.string().required(PACKAGE_REQUIRED),
    partners: Yup.array().min(1, SELECT_PARTNER).required(SELECT_PARTNER),
  });
  /**
   * It takes the values from the form, creates a new FormData object, and appends the values to the
   * formData object. Then it dispatches the AvailabilityRequestAPICall action with the formData object
   * as the payload
   * @param values - The values of the form
   */
  const submitHandler = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    /*eslint-disable */
    values?.event_date && formData.append("event_date", values?.event_date);
    values?.event_type && formData.append("event_type", values?.event_type);
    values?.start_time && formData.append("start_time", values?.start_time);
    values?.end_time && formData.append("end_time", values?.end_time);
    values?.market_id && formData.append("market_id", values?.market_id);
    values?.city && formData.append("city", values?.city);
    values?.state_id && formData.append("state_id", values?.state_id);
    values?.package_id && formData.append("package_id", values?.package_id);
    values?.partners && values?.partners?.map((p) => formData.append("partners[]", p?.value));
    /*eslint-enable */
    const response = await dispatch(AvailabilityRequestAPICall(formData));
    if (response?.status === 200) {
      toggleCanvasStart();
      refresh();
    }
    setIsLoading(false);
  };
  /**
   * It takes a market object as an argument, and then makes an API call to get all the partners in that
   * market. It then takes the response and creates an array of objects that can be used in a dropdown
   * menu
   * @param market - The market that the user selects.
   */
  const getPartner = async (market) => {
    if (market !== null) {
      const res = await dispatch(
        allPartnerListingApiCall({
          type: "partner",
          sort_field: "company",
          sort_order: "asc",
          market_id: market?.value,
        }),
      );
      const partnerArr = [];
      res?.data?.data?.users?.map((e) => {
        partnerArr.push({ label: e.company, value: e.id });
      });
      setPartnerOption(partnerArr);
    }
  };
  /* The above code is using the useEffect hook to call the getPartner function when the isUpdate state
  is changed. */
  useEffect(() => {
    getPartner(market);
  }, [isUpdate]);

  return (
    <>
      <Button color="primary" className="custom-btn3 m-0" onClick={toggleCanvasEnd}>
        New Request
      </Button>

      <Offcanvas
        direction={canvasPlacement}
        isOpen={canvasOpen}
        toggle={toggleCanvasStart}
        className="offcanvas-cu-width"
      >
        <OffcanvasHeader toggle={toggleCanvasStart}>New Availability Request</OffcanvasHeader>
        {!isLoading ? (
          <OffcanvasBody className="bg-white">
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={submitHandler}
            >
              {({ errors, setFieldValue, touched, values }) => (
                <Form>
                  <div className="mt-1">
                    <Label for="status-select">
                      Market<span className="sy-tx-primary">*</span>
                    </Label>
                    <Select
                      name="market_id"
                      id="market_id"
                      className="react-select"
                      classNamePrefix="select"
                      options={countryOption}
                      placeholder="Select"
                      onChange={(e) => {
                        /*eslint-disable-next-line */
                        setFieldValue("market_id", e?.value),
                          setMarket(e),
                          setIsUpdate(!isUpdate),
                          setFieldValue("partners", []);
                      }}
                    />
                    {errors.market_id && touched.market_id ? (
                      <span className="text-danger error-msg">{errors?.market_id}</span>
                    ) : null}
                  </div>
                  {market && values?.market_id && (
                    <>
                      <div className="mt-1">
                        <Label className="form-label">Select Partner</Label>
                        <MultiSelectAll
                          isUpdate={isUpdate}
                          options={partnerOption}
                          setValue={(e) => {
                            setFieldValue("partners", e);
                          }}
                          name="partners"
                        />
                        {errors.partners && touched.partners ? (
                          <span className="text-danger error-msg">{errors?.partners}</span>
                        ) : null}
                      </div>
                    </>
                  )}
                  <div className="mt-2">
                    <Label for="status-select">
                      Package Type<span className="sy-tx-primary">*</span>
                    </Label>
                    <Select
                      name="package_id"
                      id="package_id"
                      className="react-select"
                      classNamePrefix="select"
                      options={packageOption}
                      placeholder="Select"
                      onChange={(e) => setFieldValue("package_id", e?.value)}
                    />
                    {errors.package_id && touched.package_id ? (
                      <span className="text-danger error-msg">{errors?.package_id}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Label for="status-select">
                      Event Date<span className="sy-tx-primary">*</span>
                    </Label>
                    <InputGroup className="me-1 h-100 margin-bottom">
                      <Flatpickr
                        name="event_date"
                        value={values?.event_date}
                        placeholder="Select event date"
                        id="event_date"
                        className="form-control border-right"
                        onChange={(date) => {
                          setFieldValue("event_date", moment(date?.[0])?.format("YYYY-MM-DD"));
                        }}
                        options={{
                          minDate: "today",
                        }}
                      />
                      <InputGroupText className="cursor-pointer">
                        <Calendar size={14} />
                      </InputGroupText>
                    </InputGroup>
                    {errors.event_date && touched.event_date ? (
                      <span className="text-danger error-msg">{errors?.event_date}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Label for="status-select">
                      Event Type<span className="sy-tx-primary">*</span>
                    </Label>
                    <Select
                      name="event_type"
                      id="event_type"
                      className="react-select"
                      classNamePrefix="select"
                      options={eventOption}
                      placeholder="Select"
                      onChange={(e) => setFieldValue("event_type", e?.value)}
                    />
                    {errors.event_type && touched.event_type ? (
                      <span className="text-danger error-msg">{errors?.event_type}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Label for="status-select">
                      City<span className="sy-tx-primary">*</span>
                    </Label>
                    <Field
                      type="text"
                      name="city"
                      id="city"
                      placeholder="Enter city"
                      className="form-control custom-input"
                    />
                    {errors.city && touched.city ? (
                      <span className="text-danger error-msg">{errors?.city}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Label for="status-select">
                      State<span className="sy-tx-primary">*</span>
                    </Label>
                    <Select
                      name="state_id"
                      id="state_id"
                      className="react-select"
                      classNamePrefix="select"
                      options={stateOption}
                      placeholder="Select"
                      onChange={(e) => setFieldValue("state_id", e?.value)}
                    />
                    {errors.state_id && touched.state_id ? (
                      <span className="text-danger error-msg">{errors?.state_id}</span>
                    ) : null}
                  </div>
                  <Row className="mt-2">
                    <Col md="8" sm="8" className="">
                      <Label className="form-label cu-label" for="email">
                        Event Start Time
                      </Label>
                      <Flatpickr
                        className="form-control custom-input border-right1"
                        value={values?.start_time}
                        id="start_time"
                        name="start_time"
                        placeholder="Select start time"
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          dateFormat: "h:i K",
                          pickDate: false,
                          pickSeconds: false,
                          pick12HourFormat: true,
                        }}
                        onChange={(date) => {
                          setFieldValue("start_time", moment(date[0]).format("HH:mm"));
                        }}
                      />
                      {errors?.start_time && touched?.start_time ? (
                        <span className="text-danger error-msg">{errors?.start_time}</span>
                      ) : null}
                    </Col>
                    <Col lg={4} sm={4} className=" mt-2 time-switch">
                      <CustomeSwitch hour={moment(values?.start_time, "HH:mm")?.format("A")} />
                    </Col>
                    <Col md="8" sm="8" className="">
                      <Label className="form-label cu-label" for="email">
                        Event End Time
                      </Label>
                      <Flatpickr
                        className="form-control custom-input border-right1"
                        value={values?.end_time}
                        id="end_time"
                        name="end_time"
                        placeholder="Select end time"
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          dateFormat: "h:i K",
                          pickDate: false,
                          pickSeconds: false,
                          pick12HourFormat: true,
                        }}
                        onChange={(date) => {
                          setFieldValue("end_time", moment(date[0]).format("HH:mm"));
                        }}
                      />
                      {errors?.end_time && touched?.end_time ? (
                        <span className="text-danger error-msg">{errors?.end_time}</span>
                      ) : null}
                    </Col>
                    <Col lg={4} sm={4} className="mt-2 time-switch">
                      <CustomeSwitch hour={moment(values?.end_time, "HH:mm")?.format("A")} />
                    </Col>
                  </Row>

                  <div className="mt-2">
                    <Button className="mb-75 me-75 custom-btn3" type="submit">
                      Send Availability Request
                    </Button>
                    <Button className="mb-75 custom-btn10" onClick={toggleCanvasStart}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </OffcanvasBody>
        ) : (
          <OffCanvasShimmer />
        )}
      </Offcanvas>
    </>
  );
};

export default OffCanvasPlacement;
