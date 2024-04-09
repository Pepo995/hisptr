import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

import { useEffect, useState } from "react";
import {
  AGREEMENT_FILE_TOO_LARGE,
  AGREEMENT_REQUIRE,
  AVAILABILITY_ID_REQUIRE,
  CITY_REQUIRED,
  COMPANY_REQUIRE,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  EVENT_DATE_REQUIRED,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  MARKET_REQUIRED,
  OPTION_REQUIRED,
  PACKAGE_REQUIRED,
  PHONE_MAX_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
  STATE_REQUIRED,
} from "@constants/ValidationConstants";

import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { Field, Form, Formik } from "formik";
import Select from "react-select";
import Flatpickr from "react-flatpickr";

import { ArrowLeft, Calendar } from "react-feather";
import Breadcrumbs from "@components/breadcrumbs";
import * as Yup from "yup";
import {
  eventCreateApiCall,
  eventMarketApiCall,
  packageTypeApiCall,
} from "@redux/action/EventAction";
import { stateApiCall } from "@redux/action/CountryAction";

import { useDispatch } from "react-redux";
import { allPartnerListingApiCall } from "@redux/action/PartnerAction";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { Helmet } from "react-helmet";
import { AvailabilityListAPICall } from "@redux/action/AvailabilityAction";
import { convertDate } from "@utils/Utils";
import { AGREEMENT_SIZE, AGREEMENT_SUPPORTED_FORMATS } from "@constants/CommonConstants";
import Link from "next/link";
import { useRouter } from "next/router";
import { type AnyAction } from "@reduxjs/toolkit";
const AddEvent: NextPageWithLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(false);
  const [value1, setValue1] = useState(false);
  const [picker, setPicker] = useState();
  const [stateData, setstateData] = useState([]);
  const [eventMarket, seteventMarket] = useState([]);
  const [PacakageType, setPacakageType] = useState([[]]);
  const [PartnerData, setPartnerData] = useState([]);

  const [availabilityOption, setAvailabilityOption] = useState([]);
  const [market, setMarket] = useState(null);
  const dispatch = useDispatch();

  /**
   * It fetches data from the backend and populates the dropdown menus
   */
  const addevent = async () => {
    setIsLoading(true);
    // event market
    const dropdownData = {
      sort_order: "asc",
      sort_field: "name",
    };
    const eventArray = [];
    const res_market_event = await dispatch(
      eventMarketApiCall({ ...dropdownData, type: "market" }),
    );
    res_market_event.data.data.preferences.map((e) =>
      eventArray.push({ label: e.name, value: e.id }),
    );
    seteventMarket(eventArray);
    // packageType
    const res_pacakge_type = await dispatch(packageTypeApiCall({ ...dropdownData, type: "type" }));
    const packageArray = [];
    res_pacakge_type.data.data.packages.map((e) => {
      packageArray.push({ label: e.title, value: e.id });
    });
    setPacakageType(packageArray);
    // PartnerData
    const res_partner = await dispatch(
      allPartnerListingApiCall({
        type: "partner",
        sort_field: "company",
        sort_order: "asc",
      }),
    );
    const filterCompany = res_partner?.data?.data?.users?.filter((e) => e.company);
    const partnerArr = [];
    filterCompany?.map((e) => {
      partnerArr.push({ label: e.company, value: e.id });
    });
    setPartnerData(partnerArr);
    // state
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(stateApiCall(dropdownData) as unknown as AnyAction);
    const tempArray: RequestOption[] = [];
    if (res.status === 200) {
      res.data.data.states.map((c) => tempArray.push({ label: c.name, value: c.id }));
    }
    setstateData(tempArray);
    setIsLoading(false);
  };

  /* The above code is using the useEffect hook to add an event listener to the window. */
  useEffect(() => {
    addevent();
  }, []);
  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    date: "",
    state: "",
    PackageType: "",
    eventMarket: "",
    plannerFirstname: "",
    plannerLastname: "",
    plannerEmailid: "",
    plannerphone: "",
    plannerCname: "",
    is_event_planner: "",
    is_holder_on_reservation: "",
    availability_id: "",
    event_agreement: "",
  };
  /* A validation schema for the form. */
  const validationSchema = Yup.object({
    firstName: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    lastName: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    phoneNumber: Yup.string()
      .min(10, PHONE_MAX_LENGTH)
      .max(10, PHONE_MAX_LENGTH)
      .matches(PHONE_NO_REGEX, PHONE_NO_VALID)
      .required(PHONE_REQUIRED),
    date: Yup.string().required(EVENT_DATE_REQUIRED),
    city: Yup.string().required(CITY_REQUIRED),
    state: Yup.string().required(STATE_REQUIRED),
    eventMarket: Yup.string().required(MARKET_REQUIRED),
    PackageType: Yup.string().required(PACKAGE_REQUIRED),
    is_event_planner: Yup.string().required(OPTION_REQUIRED),
    is_holder_on_reservation: Yup.string().required(OPTION_REQUIRED),
    plannerFirstname: value === true && Yup.string().max(25).required(FIRST_NAME_REQUIRED),
    plannerLastname: value === true && Yup.string().max(25).required(LAST_NAME_REQUIRE),
    plannerEmailid: value === true && Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    plannerphone:
      value === true &&
      Yup.string().min(8).matches(PHONE_NO_REGEX, PHONE_NO_VALID).required(PHONE_REQUIRED),
    plannerCname: value === true && Yup.string().max(25).required(COMPANY_REQUIRE),
    availability_id: Yup.string().required(AVAILABILITY_ID_REQUIRE),
    event_agreement: Yup.mixed()
      .required(AGREEMENT_REQUIRE)
      .test("fileSize", AGREEMENT_FILE_TOO_LARGE, (value) => value && value.size <= AGREEMENT_SIZE)
      .test(
        "fileFormat",
        AGREEMENT_REQUIRE,
        (value) => value && AGREEMENT_SUPPORTED_FORMATS.includes(value.type),
      ),
  });

  /**
   * It's a function that takes in a value and returns a function that takes in a value and returns a
   * function that takes in a value and returns a function that takes in a value and returns a function
   * that takes in a value and returns a function that takes in a value and returns a function that
   * takes in a value and returns a function that takes in a value and returns a function that takes in
   * a value and returns a function that takes in a value and returns a function that takes in a value
   * and returns a function that takes in a value and returns a function that takes in a value and
   * returns a function that takes in a value and returns a function that takes in a value and returns
   * a function that takes in a value and returns a function that takes in a value and returns a
   * function that takes in a value and returns a function that takes in a value and returns a function
   * that takes in a value and returns a function that takes in a value and returns a function that
   * takes in a
   * @param values - The values of the form.
   */
  const addEventDetail = async (values) => {
    setIsLoading(true);
    if (value !== null) {
      if (value === true) {
        const formData = new FormData();
        formData.append("first_name", values.firstName);
        formData.append("last_name", values.lastName);
        formData.append("email", values.email);
        formData.append("phone_number", values.phoneNumber);
        formData.append(
          "event_date",
          flatpickr.formatDate(picker[0] ? picker[0] : picker, "Y-m-d"),
        );
        formData.append("city", values.city);
        formData.append("state_id", values.state);
        formData.append("market", values.eventMarket);
        formData.append("package_id", values.PackageType);
        formData.append("planner_first_name", values.plannerFirstname);
        formData.append("planner_last_name", values.plannerLastname);
        formData.append("planner_phone_number", values.plannerphone);
        formData.append("planner_email", values.plannerEmailid);
        formData.append("planner_company_name", values.plannerCname);
        formData.append("is_event_planner", value === true ? "yes" : "no");
        formData.append("is_holder_on_reservation", value1 === true ? "yes" : "no");
        formData.append("availability_id", values?.availability_id);
        formData.append("event_agreement", values?.event_agreement);
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await dispatch(eventCreateApiCall(formData, router) as unknown as AnyAction);
        setIsLoading(false);
      } else {
        const formData = new FormData();
        formData.append("first_name", values.firstName);
        formData.append("last_name", values.lastName);
        formData.append("email", values.email);
        formData.append("phone_number", values.phoneNumber);
        formData.append(
          "event_date",
          flatpickr.formatDate(picker[0] ? picker[0] : picker, "Y-m-d"),
        );
        formData.append("city", values.city);
        formData.append("state_id", values.state);
        formData.append("market", values.eventMarket);
        formData.append("package_id", values.PackageType);
        formData.append("is_event_planner", value === true ? "yes" : "no");
        formData.append("is_holder_on_reservation", value1 === true ? "yes" : "no");
        formData.append("availability_id", values?.availability_id);
        formData.append("agreement", values?.event_agreement);
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await dispatch(eventCreateApiCall(formData, router) as unknown as AnyAction);
        setIsLoading(false);
      }
    } else {
      toast.error("Please select at least one field");
    }
    setIsLoading(false);
  };

  /**
   * This function is used to get the availability list for a specific market and event date
   * @param market - the market id
   * @param picker - is the date picker value
   */
  const getMarket = async (market, picker) => {
    const data = {
      market_id: market,
      event_date: convertDate(picker?.[0], 3),
    };
    const tempArray: RequestOption[] = [];
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(AvailabilityListAPICall(data) as unknown as AnyAction);
    if (response?.status === 200) {
      response?.data?.data?.requests?.map(
        (r) =>
          tempArray?.push({
            label: `#${r?.availability_number} ${r?.location?.name} ${convertDate(
              r?.event_date,
              2,
            )}`,
            value: r?.id,
          }),
      );
    }
    setAvailabilityOption(tempArray);
  };

  /* The above code is using the useEffect hook to call the getMarket function when the market and picker
  state variables are not null. */
  useEffect(() => {
    if (market !== null && picker && picker?.length !== 0) {
      getMarket(market, picker);
    }
  }, [market, picker]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Add Event</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Event Management"
          data={[{ title: "Events List", link: "/admin/event" }, { title: "Add Event" }]}
        />

        {!isLoading ? (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle tag="h4" className="sy-tx-primary f-600">
                <Link href="/admin/event">
                  {" "}
                  <ArrowLeft className="sy-tx-primary me-50" />
                </Link>
                Event Details
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={addEventDetail}
                enableReinitialize
              >
                {({ errors, setFieldValue, touched, values }) => (
                  <Form>
                    <Row>
                      <Col lg="3" md="6" className="mb-1">
                        <Label className="form-label cu-label" for="nameMulti">
                          First Name on the Account
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="firstName"
                          id="nameMulti"
                          placeholder="Enter first name"
                          className="form-control custom-input"
                        />
                        {errors.firstName && touched.firstName ? (
                          <span className="text-danger error-msg">{errors?.firstName}</span>
                        ) : null}
                      </Col>
                      <Col lg="3" md="6" className="mb-1">
                        <Label className="form-label cu-label" for="lastNameMulti">
                          Last Name on the Account
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="lastName"
                          id="lastNameMulti"
                          placeholder="Enter last name"
                          className="form-control custom-input"
                        />
                        {errors.lastName && touched.lastName ? (
                          <span className="text-danger error-msg">{errors?.lastName}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="default-picker">
                          Date of the Event
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <InputGroup className="cu-input-group">
                          <Flatpickr
                            className="form-control  mb-0 mt-0 border-right"
                            value={picker}
                            placeholder="Select date"
                            options={{
                              dateFormat: "m/d/Y",
                              minDate: "today",
                              disableMobile: "true",
                            }}
                            onChange={(date) => {
                              /*eslint-disable-next-line */
                              setPicker(date),
                                setFieldValue("date", date.toString()),
                                setFieldValue("availability_id", "");
                            }}
                            id="default-picker"
                          />
                          <InputGroupText className="border-bottom-n">
                            <Calendar size={14} />
                          </InputGroupText>
                        </InputGroup>
                        {errors.date && touched.date ? (
                          <span className="text-danger error-msg">{errors?.date}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="email">
                          Email ID<span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter email address"
                          className="form-control"
                        />
                        {errors.email && touched.email ? (
                          <span className="text-danger error-msg">{errors?.email}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="phone">
                          Best Phone Number to Reach You
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="number"
                          name="phoneNumber"
                          id="phone"
                          placeholder="Enter phone number"
                          className="form-control"
                        />
                        {errors.phoneNumber && touched.phoneNumber ? (
                          <span className="text-danger error-msg">{errors?.phoneNumber}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="city">
                          Event City
                        </Label>
                        <Field
                          type="text"
                          name="city"
                          id="city"
                          placeholder="Enter city name"
                          className="form-control"
                        />
                        {errors?.city && touched?.city ? (
                          <span className="text-danger error-msg">{errors?.city}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="city">
                          Event State
                        </Label>
                        <Select
                          className="react-select "
                          classNamePrefix="select"
                          name="state"
                          options={stateData}
                          placeholder="Select state"
                          onChange={(e) => setFieldValue("state", e.value)}
                        />
                        {errors?.state && touched?.state ? (
                          <span className="text-danger error-msg">{errors?.state}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="city">
                          Event Market
                        </Label>
                        <Select
                          className="react-select "
                          classNamePrefix="select"
                          name="eventMarket"
                          options={eventMarket}
                          placeholder="Select market"
                          onChange={(e) => {
                            /*eslint-disable-next-line */
                            setFieldValue("eventMarket", e.value),
                              setMarket(e.value),
                              setFieldValue("availability_id", "");
                          }}
                        />
                        {errors?.eventMarket && touched?.eventMarket ? (
                          <span className="text-danger error-msg">{errors?.eventMarket}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="city">
                          Package Type
                        </Label>
                        <Select
                          className="react-select "
                          classNamePrefix="select"
                          name="PackageType"
                          options={PacakageType}
                          placeholder="Select package type"
                          onChange={(e) => setFieldValue("PackageType", e.value)}
                        />
                        {errors?.PackageType && touched?.PackageType ? (
                          <span className="text-danger error-msg">{errors?.PackageType}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="city">
                          Availability ID
                        </Label>
                        <Select
                          className="react-select "
                          classNamePrefix="select"
                          name="availability_id"
                          options={availabilityOption}
                          placeholder={
                            availabilityOption?.length === 0
                              ? "No option available"
                              : "Select availability ID"
                          }
                          value={
                            availabilityOption?.length !== 0
                              ? availabilityOption?.find((r) => r.value === values.availability_id)
                              : ""
                          }
                          isDisabled={availabilityOption?.length === 0}
                          onChange={(e) => setFieldValue("availability_id", e.value)}
                        />
                        {errors?.availability_id && touched?.availability_id ? (
                          <span className="text-danger error-msg">{errors?.availability_id}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <div className="event-planer">
                      <p tag="label">Is the Event Planner the account holder on the reservation?</p>
                      <div className="mb-1">
                        <input
                          name="Insurance1"
                          type="radio"
                          id="my-radio"
                          className="vertical-align"
                          value={true}
                          onChange={() => {
                            /*eslint-disable-next-line */
                            setValue1(true), setFieldValue("is_holder_on_reservation", "yes");
                          }}
                        />
                        <Label className="mb-0 mx-50 radio-label">Yes</Label>
                        <input
                          name="Insurance1"
                          type="radio"
                          id="my-radio"
                          className="vertical-align"
                          value={false}
                          onChange={() => {
                            /*eslint-disable-next-line */
                            setValue1(false), setFieldValue("is_holder_on_reservation", "no");
                          }}
                        />
                        <Label className="mb-0 mx-50 radio-label">No</Label>
                      </div>
                      {errors?.is_holder_on_reservation && touched?.is_holder_on_reservation ? (
                        <span className="text-danger error-msg">
                          {errors?.is_holder_on_reservation}
                        </span>
                      ) : null}
                      <p tag="label">Is this an Event Planner?</p>
                      <div className="mb-1">
                        <input
                          name="Insurance"
                          type="radio"
                          id="my-radio"
                          className="vertical-align"
                          value={true}
                          onChange={() => {
                            setValue(true);
                            void setFieldValue("is_event_planner", "yes");
                          }}
                        />
                        <Label className="mb-0 mx-50 radio-label">Yes</Label>
                        <input
                          name="Insurance"
                          type="radio"
                          id="my-radio"
                          className="vertical-align"
                          value={false}
                          onChange={() => {
                            setValue(false);
                            void setFieldValue("is_event_planner", "no");
                          }}
                        />
                        <Label className="mb-0 mx-50 radio-label">No</Label>
                      </div>
                      {errors?.is_event_planner && touched?.is_event_planner ? (
                        <span className="text-danger error-msg">{errors?.is_event_planner}</span>
                      ) : null}
                    </div>
                    {value === true && (
                      <div className="mt-sm-2 mt-1">
                        <Row>
                          <Col md="6" sm="12" className="mb-1">
                            <Label className="form-label cu-label" for="nameMulti">
                              Event Planner First Name
                              <span className="sy-tx-primary">*</span>
                            </Label>
                            <Field
                              type="text"
                              name="plannerFirstname"
                              id="nameMulti"
                              placeholder="Enter first name"
                              className="form-control custom-input"
                            />
                            {errors.plannerFirstname && touched.plannerFirstname ? (
                              <span className="text-danger error-msg">
                                {errors?.plannerFirstname}
                              </span>
                            ) : null}
                          </Col>
                          <Col md="6" sm="12" className="mb-1">
                            <Label className="form-label cu-label" for="nameMulti">
                              Event Planner Last Name
                              <span className="sy-tx-primary">*</span>
                            </Label>
                            <Field
                              type="text"
                              name="plannerLastname"
                              id="nameMulti"
                              placeholder="Enter last name"
                              className="form-control custom-input"
                            />
                            {errors.plannerLastname && touched.plannerLastname ? (
                              <span className="text-danger error-msg">
                                {errors?.plannerLastname}
                              </span>
                            ) : null}
                          </Col>
                          <Col md="6" sm="12" className="mb-1">
                            <Label className="form-label cu-label" for="Email">
                              Event Planner Email ID
                              <span className="sy-tx-primary">*</span>
                            </Label>
                            <Field
                              type="email"
                              name="plannerEmailid"
                              id="Emailid"
                              placeholder="Enter email address"
                              className="form-control custom-input"
                            />
                            {errors.plannerEmailid && touched.plannerEmailid ? (
                              <span className="text-danger error-msg">
                                {errors?.plannerEmailid}
                              </span>
                            ) : null}
                          </Col>
                          <Col md="6" sm="12" className="mb-1">
                            <Label className="form-label cu-label" for="phone">
                              Event Planner Phone Number
                              <span className="sy-tx-primary">*</span>
                            </Label>
                            <Field
                              type="phone"
                              name="plannerphone"
                              id="phone"
                              placeholder="Enter phone number"
                              className="form-control custom-input"
                            />
                            {errors.plannerphone && touched.plannerphone ? (
                              <span className="text-danger error-msg">{errors?.plannerphone}</span>
                            ) : null}
                          </Col>
                          <Col md="6" sm="12" className="mb-1">
                            <Label className="form-label cu-label" for="text">
                              What's the event planner's company name?
                            </Label>
                            <Field
                              type="text"
                              name="plannerCname"
                              id="planer"
                              placeholder="Enter company name"
                              className="form-control custom-input"
                            />
                          </Col>
                        </Row>
                      </div>
                    )}
                    <Row className="my-1 align-items-start">
                      <Col sm="3">
                        <Label for="agreement" disabled className="add-form-header pt-0">
                          Event Agreement
                        </Label>
                        <p className="text-danger error-msg">*Please upload only pdf file</p>
                      </Col>
                      <Col sm="9">
                        <InputGroup>
                          <Input
                            type="file"
                            id="event_agreement"
                            name="event_agreement"
                            accept=".pdf"
                            onChange={(event) =>
                              setFieldValue("event_agreement", event.currentTarget.files[0])
                            }
                          />
                        </InputGroup>

                        {errors.event_agreement || touched.event_agreement ? (
                          <span className="text-danger error-msg">{errors?.event_agreement}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <div className="mt-sm-3 mt-1">
                      <Button type="submit" className="custom-btn7 me-75 mb-75">
                        Invite{" "}
                      </Button>
                      <Link href="/admin/event">
                        <Button className="custom-btn9 mb-75">Cancel </Button>
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        ) : (
          <ShimmerAddEvent />
        )}
      </div>
    </>
  );
};
AddEvent.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AddEvent;
