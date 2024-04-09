import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import ToolTip from "@components/ToolTip";
import { Field, Form, Formik } from "formik";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";
import CustomeSwitch from "@components/Switch/CustomSwitch";
import * as Yup from "yup";
import {
  DEFAULT_PICKER,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  END_TIME_REQUIRED,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  GUEST_COUNT,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  MAX_GUEST_COUNT,
  MIN_GUEST_COUNT,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
  SINGLE_VALUE,
  START_TIME_REQUIRED,
} from "@constants/ValidationConstants";
import moment from "moment";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import Link from "next/link";
import { type EventFromPhp, type SelectNumericOption, type SelectOption } from "@types";
import { api } from "@utils/api";
import { toast } from "react-toastify";

type EventDetailProps = {
  handleNext: () => void;
  event: EventFromPhp;
  category?: SelectNumericOption[];
  types?: SelectNumericOption[];
  reach?: SelectOption[];
  id: number;
  isLoading: boolean;
};

const EventDetail = ({
  handleNext,
  event,
  category,
  types: type,
  reach,
  id,
  isLoading,
}: EventDetailProps) => {
  const eventDetailsMutation = api.eventCustomerRouter.addDetails.useMutation();
  const [picker, setPicker] = useState(new Date());

  const initialFormValues = {
    firstName: event.first_name,
    lastName: event.last_name,
    email: event.user?.email,
    phoneNumber: event.phone_number,
    guestCount: event.guest_count ?? 0,
    defaultPicker: event.event_date,
    categoryEvent: event.category_id ?? "",
    typeEvent: event.type_id ?? "",
    reachVia: event.reach_via?.toString() ?? "",
    isEventPlanner: event.is_event_planner,
    startTime: event.start_time ? moment(event.start_time, "hh:mm:ss").format("HH:mm") : "",
    endTime: event.end_time ? moment(event.end_time, "hh:mm:ss").format("HH:mm") : "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    lastName: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    phoneNumber: Yup.string().matches(PHONE_NO_REGEX, PHONE_NO_VALID).required(PHONE_REQUIRED),
    startTime: Yup.string().required(START_TIME_REQUIRED),
    endTime: Yup.string().required(END_TIME_REQUIRED),
    guestCount: Yup.number()
      .min(1, MIN_GUEST_COUNT)
      .max(10000, MAX_GUEST_COUNT)
      .required(GUEST_COUNT),
    defaultPicker: Yup.string().required(DEFAULT_PICKER),
    categoryEvent: Yup.string().required(SINGLE_VALUE),
    typeEvent: Yup.string().required(SINGLE_VALUE),
    reachVia: Yup.string().required(SINGLE_VALUE),
    isEventPlanner: Yup.string().required(SINGLE_VALUE),
  });

  const updateHandler = (value: typeof initialFormValues) => {
    const data = {
      id: id.toString(),
      eventDate: moment(value?.defaultPicker).format("YYYY-MM-DD"),
      firstName: value?.firstName,
      lastName: value?.lastName,
      phoneNumber: value?.phoneNumber,
      isEventPlanner: value?.isEventPlanner,
      typeId: value?.typeEvent,
      categoryId: value?.categoryEvent,
      reachVia: value?.reachVia,
      guestCount: value?.guestCount,
      startTime: value?.startTime,
      endTime: value?.endTime,
      email: value?.email ?? "",
    };

    eventDetailsMutation.mutate(data, {
      onSuccess: () => {
        handleNext();
      },
      onError: (error) => {
        const errorMessage =
          error?.data?.httpStatus === 400
            ? error.message
            : "We had a problem saving your event details. Please contact us to give you custom attention.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="main-role-ui mt-5">
      {!isLoading ? (
        <Card className="fade-in bg-white">
          <CardHeader>
            <CardTitle tag="h4" className="sy-tx-primary f-18">
              Event Details
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={updateHandler}
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
                        id="firstName"
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
                        id="lastName"
                        placeholder="Enter last name"
                        className="form-control custom-input"
                      />
                      {errors.lastName && touched.lastName ? (
                        <span className="text-danger error-msg">{errors?.lastName}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label" for="CountryMulti">
                        Please select the category of event you are planning:
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Select
                        className="react-select"
                        classNamePrefix="select"
                        options={category}
                        defaultValue={
                          event.category_id
                            ? category?.filter((e) => e?.value === event.category_id)
                            : null
                        }
                        placeholder="Select event category"
                        name="categoryEvent"
                        id="categoryEvent"
                        onChange={(e) => setFieldValue("categoryEvent", (e ?? { value: "" }).value)}
                        isMulti={false}
                      />
                      {errors.categoryEvent && touched.categoryEvent ? (
                        <span className="text-danger error-msg">{errors?.categoryEvent}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <ToolTip
                        tooltip={
                          "For updates, contact our support\nteam via the support request tab."
                        }
                      >
                        <Label className="form-label cu-label" for="default-picker">
                          Date of the Event
                          <span className="sy-tx-primary">*</span>
                        </Label>
                      </ToolTip>
                      <InputGroup className="cu-input-group">
                        <Flatpickr
                          className="form-control mb-0 mt-0 border-bottom-n"
                          onChange={(date) => {
                            void setFieldValue("defaultPicker", date[0]);
                            setPicker(date[0]);
                          }}
                          id="defaultPicker"
                          name="defaultPicker"
                          defaultValue={moment(event.event_date ?? picker).format("MM/DD/YYYY")}
                          options={{
                            minDate: "today",
                            dateFormat: "m/d/Y",
                            disableMobile: true,
                          }}
                          disabled
                        />
                        <InputGroupText className="border-bottom-n">
                          <Calendar size={14} />
                        </InputGroupText>
                      </InputGroup>
                      {errors.defaultPicker && touched.defaultPicker ? (
                        <span className="text-danger error-msg">{errors?.defaultPicker}</span>
                      ) : null}
                    </Col>

                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label" for="event">
                        Please select the type of event you are planning:
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Select
                        className="react-select "
                        classNamePrefix="select"
                        options={type}
                        placeholder="Select type of event"
                        name="typeEvent"
                        id="typeEvent"
                        defaultValue={
                          event.type_id ? type?.filter((e) => e?.value === event.type_id) : null
                        }
                        onChange={(e) => setFieldValue("typeEvent", (e ?? { value: "" }).value)}
                        isMulti={false}
                      />
                      {errors.typeEvent && touched.typeEvent ? (
                        <span className="text-danger error-msg">{errors?.typeEvent}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label" for="phoneNumber">
                        Best Phone Number to Reach You
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Field
                        type="number"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Enter phone number"
                        className="form-control custom-input"
                      />
                      {errors.phoneNumber && touched.phoneNumber ? (
                        <span className="text-danger error-msg">{errors?.phoneNumber}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <ToolTip tooltip="Please provide an estimate for Guest Count.">
                        <Label className="form-label cu-label" for="count">
                          Approximate Guest Count
                          <span className="sy-tx-primary">*</span>
                        </Label>
                      </ToolTip>
                      <Field
                        type="number"
                        name="guestCount"
                        id="guestCount"
                        placeholder="Enter guest count"
                        className="form-control custom-input"
                      />
                      {errors.guestCount && touched.guestCount ? (
                        <span className="text-danger error-msg">{errors?.guestCount}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label" for="email">
                        Email ID
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email address"
                        className="form-control custom-input"
                        disabled
                      />
                      {errors.email && touched.email ? (
                        <span className="text-danger error-msg">{errors?.email}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label" for="email">
                        How Did You Hear About Hipstr?
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Select
                        className="react-select "
                        classNamePrefix="select"
                        options={reach}
                        defaultValue={
                          event.reach_via
                            ? reach?.filter((e) => e.value === event.reach_via?.toString())
                            : null
                        }
                        placeholder="Select how did you hear about hipstr"
                        name="reachVia"
                        id="reachVia"
                        onChange={(e) => setFieldValue("reachVia", (e ?? { value: "" }).value)}
                      />
                      {errors.reachVia && touched.reachVia ? (
                        <span className="text-danger error-msg">{errors?.reachVia}</span>
                      ) : null}
                    </Col>
                    <Col lg={6}>
                      <div className="tw-flex tw-w-full tw-flex-col    sm:tw-flex-row">
                        <div className="tw-flex tw-flex-col">
                          <div className="tw-flex tw-gap-1">
                            <div className="tw-flex tw-flex-col tw-w-1/2">
                              <Label className="form-label cu-label" for="email">
                                Start Time
                                <span className="sy-tx-primary">*</span>
                              </Label>
                              <Flatpickr
                                className="form-control custom-input"
                                id="startTime"
                                name="startTime"
                                value={values?.startTime}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "h:i K",
                                  // pickDate: false,
                                  // pickSeconds: false,
                                  // pick12HourFormat: true,
                                }}
                                onChange={(date) =>
                                  setFieldValue("startTime", moment(date[0]).format("HH:mm"))
                                }
                              />
                            </div>
                            <div className="tw-mt-auto">
                              <CustomeSwitch
                                hour={moment(values?.startTime, "HH:mm").format("A")}
                              />
                            </div>
                          </div>
                          {errors.startTime && touched.startTime ? (
                            <span className="text-danger error-msg">{errors?.startTime}</span>
                          ) : null}
                        </div>

                        <div className="tw-flex tw-flex-col">
                          <div className="tw-flex tw-gap-1">
                            <div className="tw-flex tw-flex-col tw-w-1/2">
                              <Label className="form-label cu-label" for="email">
                                End Time
                                <span className="sy-tx-primary">*</span>
                              </Label>
                              <Flatpickr
                                className="form-control custom-input"
                                id="endTime"
                                name="endTime"
                                value={values?.endTime}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "h:i K",
                                  // pickDate: false,
                                  // pickSeconds: false,
                                  // pick12HourFormat: true,
                                }}
                                onChange={(date) =>
                                  setFieldValue("endTime", moment(date[0]).format("HH:mm"))
                                }
                              />
                            </div>
                            <div className="tw-mt-auto">
                              <CustomeSwitch hour={moment(values?.endTime, "HH:mm").format("A")} />
                            </div>
                          </div>
                          {errors.endTime && touched.endTime ? (
                            <span className="text-danger error-msg">{errors?.endTime}</span>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Col md="6" sm="12" className="mb-1">
                    <div className="note">
                      <span className="sy-tx-primary">Note :</span>
                      This is the start time and end time that you would like your photo booth
                      experience to begin and end.
                    </div>
                  </Col>
                  <Link href="/customer/event-management/upcoming-event">
                    <Button className="custom-btn4 me-75 mb-75">Back</Button>
                  </Link>
                  <Button className="custom-btn3 mb-75" type="submit">
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      ) : (
        <ShimmerAddEvent />
      )}
    </div>
  );
};
export default EventDetail;
