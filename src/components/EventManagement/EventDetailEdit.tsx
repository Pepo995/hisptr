import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import Avatar from "@components/avatar";
import { FirstUpperCase } from "@utils/Utils";
import ShimmerEventDetail from "@components/Shimmer/ShimmerEventDetail";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { type EventFromPhp, type SelectNumericOption } from "@types";
import { getEventCategoriesQuery, getEventTypesQuery, getReachViaQuery } from "@server/api/queries";
import Select from "react-select";
import dayjs from "dayjs";
import { Calendar } from "react-feather";
import { api } from "@utils/api";
import { type UpdateEventBasicDetailsInput } from "@server/api/routers/admin/event";
import {
  CATEGORY_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  END_TIME_REQUIRED,
  EVENT_TYPE_REQUIRED,
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
import { toast } from "react-toastify";

type EventDetailProps = {
  event: EventFromPhp;
  isLoading: boolean;
};

const EventDetailEdit = ({ event, isLoading }: EventDetailProps) => {
  const { data: eventTypes } = getEventTypesQuery({});
  const { data: eventCategories } = getEventCategoriesQuery({});
  const { data: reachData } = getReachViaQuery();
  const types: SelectNumericOption[] = useMemo<SelectNumericOption[]>(
    () => eventTypes?.map((e) => ({ label: e.name, value: e.id })) ?? [],
    [eventTypes],
  );

  const categories: SelectNumericOption[] = useMemo<SelectNumericOption[]>(
    () => eventCategories?.map((e) => ({ label: e.name, value: e.id })) ?? [],
    [eventCategories],
  );

  const reach: SelectNumericOption[] = useMemo<SelectNumericOption[]>(
    () => reachData?.map((e) => ({ label: e.name, value: e.id })) ?? [],
    [reachData],
  );

  const eventDetails = useMemo(() => {
    return {
      firstName: FirstUpperCase(event.first_name) ?? "",
      lastName: FirstUpperCase(event.last_name) ?? "",
      location: `${event.city}, ${event.state?.name}`,
      eventType: types.find((e) => e.value === event.type_id) ?? undefined,
      eventDate: event.event_date ?? "",
      startTime: event.start_time ?? "",
      endTime: event.end_time ?? "",
      phoneNumber: event.phone_number ?? "",
      email: event.email ?? "",
      guest_count: event.guest_count ?? 0,
      category: categories.find((e) => e.value === event.category_id) ?? undefined,
      howDidYouHearAboutUs: event.reach_via ?? undefined,
    };
  }, [event, types, categories]);

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
    eventType: Yup.object({
      label: Yup.string().required(SINGLE_VALUE),
      value: Yup.number().required(SINGLE_VALUE),
    }).required(SINGLE_VALUE),
    category: Yup.object({
      label: Yup.string().required(SINGLE_VALUE),
      value: Yup.number().required(SINGLE_VALUE),
    }).required(SINGLE_VALUE),
  });

  const [picker, setPicker] = useState(new Date());

  const updateEventMutation = api.eventAdminRouter.updateEventBasicDetails.useMutation();
  const handleSubmit = (
    values: typeof eventDetails,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: (nextState: { values: typeof eventDetails }) => void;
    },
  ) => {
    if (!values.eventType) {
      toast.error(EVENT_TYPE_REQUIRED);
      return;
    }
    if (!values.category) {
      toast.error(CATEGORY_REQUIRED);
      return;
    }

    const data: UpdateEventBasicDetailsInput = {
      id: event.id,
      typeId: values.eventType?.value,
      startTime: values.startTime,
      endTime: values.endTime,
      guestCount: values.guest_count,
      categoryId: values.category.value,
    };
    updateEventMutation.mutate(data, {
      onSuccess: () => {
        resetForm({
          values,
        });
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  if (isLoading || categories.length == 0 || types.length == 0 || reach.length == 0) {
    return <ShimmerEventDetail />;
  }

  return (
    <Formik
      initialValues={eventDetails}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, errors, touched, initialValues, values, resetForm, setSubmitting }) => (
        <Form>
          <Card className="card-apply-job bg-white">
            <CardHeader className="p-0 mx-2 mt-2 mb-75">
              <CardTitle className="sy-tx-primary">Event Details</CardTitle>
              <p className="sy-tx-modal f-500">
                Event ID: <span className="sy-tx-primary f-600">#{event.event_number}</span>
              </p>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6" className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                  <FormGroup className="tw-flex tw-gap-2 mt-2">
                    <Avatar
                      className="me-1 cu-avatar grid tw-items-center"
                      img={event.user?.picture ?? ""}
                      imgHeight={42}
                      imgWidth={42}
                      showOnlyInitials
                      content={eventDetails.firstName + " " + eventDetails.lastName}
                    />
                    <Field
                      name="firstName"
                      className="form-control"
                      placeholder="First Name"
                      as={Input}
                      invalid={touched.firstName && !!errors.firstName}
                      disabled
                    />
                    <Field
                      name="lastName"
                      className="form-control"
                      placeholder="Last Name"
                      as={Input}
                      invalid={touched.lastName && !!errors.lastName}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md="6" className="text-md-right">
                  <Label for="category">Category:</Label>
                  <Select
                    className="react-select"
                    classNamePrefix="select"
                    options={categories}
                    placeholder="Select category"
                    name="category"
                    id="category"
                    value={values.category}
                    onChange={(e) => setFieldValue("category", e)}
                    isMulti={false}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label className="form-label cu-label" for="default-picker">
                      Date of the Event
                    </Label>
                    <InputGroup className="cu-input-group">
                      <Flatpickr
                        className="form-control mb-0 mt-0 border-bottom-n tw-bg-[var(--bs-secondary-bg)]"
                        onChange={(date) => {
                          void setFieldValue("defaultPicker", date[0]);
                          setPicker(date[0]);
                        }}
                        id="defaultPicker"
                        name="defaultPicker"
                        defaultValue={dayjs(event.event_date ?? picker).format("MM/DD/YYYY")}
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
                    {errors.eventDate && touched.eventDate ? (
                      <span className="text-danger error-msg">{errors?.eventDate}</span>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="eventType">Type of event:</Label>
                    <Select
                      className="react-select "
                      classNamePrefix="select"
                      options={types}
                      placeholder="Select type of event"
                      name="eventType"
                      id="eventType"
                      value={values.eventType}
                      onChange={(e) => setFieldValue("eventType", e)}
                      isMulti={false}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email:</Label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="Email"
                      invalid={touched.email && !!errors.email}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phoneNumber">Phone Number:</Label>
                    <Field
                      as={Input}
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      invalid={touched.phoneNumber && !!errors.phoneNumber}
                      disabled
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="location">Location:</Label>
                    <Field
                      as={Input}
                      type="text"
                      name="location"
                      placeholder="Location"
                      invalid={touched.location && !!errors.location}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="guest_count">Approximate Guest Count:</Label>
                    <Field
                      as={Input}
                      type="number"
                      name="guest_count"
                      placeholder="Guest Count"
                      invalid={touched.guest_count && !!errors.guest_count}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="tw-flex tw-w-full tw-flex-col sm:tw-flex-row tw-justify-between">
                    <div className="tw-flex tw-flex-col">
                      <Label className="form-label cu-label" for="email">
                        Start Time
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
                        }}
                        onChange={(date) =>
                          setFieldValue("startTime", dayjs(date[0]).format("HH:mm"))
                        }
                      />
                      {errors.startTime && touched.startTime ? (
                        <span className="text-danger error-msg">{errors?.startTime}</span>
                      ) : null}
                    </div>

                    <div className="tw-flex tw-flex-col">
                      <Label className="form-label cu-label" for="email">
                        End Time
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
                        }}
                        onChange={(date) =>
                          setFieldValue("endTime", dayjs(date[0]).format("HH:mm"))
                        }
                      />
                      {errors.endTime && touched.endTime ? (
                        <span className="text-danger error-msg">{errors?.endTime}</span>
                      ) : null}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <Label className="form-label cu-label" for="email">
                    How Did You Hear About Hipstr?
                    <span className="sy-tx-primary">*</span>
                  </Label>
                  <Select
                    className="react-select "
                    classNamePrefix="select"
                    options={reach}
                    value={
                      event.reach_via
                        ? reach?.filter((e) => e.value === values.howDidYouHearAboutUs)
                        : null
                    }
                    placeholder="Select how did you hear about hipstr"
                    name="reachVia"
                    id="reachVia"
                    isDisabled={true}
                  />
                </Col>
              </Row>

              {JSON.stringify(values) !== JSON.stringify(initialValues) && (
                <Row>
                  <Col md="12" className="flex tw-justify-end tw-mt-2">
                    <Button onClick={() => resetForm()} className="me-1" color="secondary" outline>
                      Reset
                    </Button>
                    <Button onClick={() => handleSubmit(values, { setSubmitting, resetForm })}>
                      Save
                    </Button>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default EventDetailEdit;
