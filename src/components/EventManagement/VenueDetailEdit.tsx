import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import ShimmerVenueDetail from "@components/Shimmer/ShimmerVenueDetail";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { type EventFromPhp, eventVenueDetailsCOI } from "@types";
import Select from "react-select";
import { ZIPCODE_REGEX } from "@constants/RegexConstants";
import {
  ADDRESS_LIMIT,
  ADDRESS_LINE1_REQUIRED,
  CITY_REQUIRED,
  COI_REQUIRED,
  ELEVATOR_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  STATE_REQUIRED,
  VENUE_NAME,
  VENUE_NAME_REQUIRE,
  ZIPCODE,
  ZIPCODE_NUMBER,
  ZIPCODE_REQUIRE,
} from "@constants/ValidationConstants";
import { getStateQuery } from "@server/api/queries";
import { useMemo } from "react";
import { COILabels } from "@constants/CommonConstants";
import { toast } from "react-toastify";
import type { UpdateEventVenueDetailsInput } from "@server/api/routers/admin/event";
import { api } from "@utils/api";

type VenueDetailProps = {
  event: EventFromPhp;
  isLoading: boolean;
};

const VenueDetailEdit = ({ event, isLoading }: VenueDetailProps) => {
  const { isLoading: isLoadingEventStates, data: stateResponse } = getStateQuery({});

  const stateOptions = useMemo(() => {
    if (stateResponse) {
      return stateResponse.map((state) => ({
        value: state.id,
        label: state.name,
      }));
    }
    return [];
  }, [stateResponse]);

  const optionsCOI = Object.values(eventVenueDetailsCOI).map((value) => ({
    value,
    label: COILabels.get(value),
  }));

  const venueDetails = useMemo(
    () => ({
      firstName: event.venue?.first_name ?? "",
      lastName: event.venue?.last_name ?? "",
      email: event.venue?.email ?? "",
      name: event.venue?.name ?? "",
      city: event.venue?.city ?? "",
      addressLine1: event.venue?.address_line_1 ?? "",
      addressLine2: event.venue?.address_line_2 ?? "",
      zipcode: event.venue?.zipcode ?? "",
      COI: optionsCOI.find((coi) => coi.value === event.venue?.COI),
      state: stateOptions.find((state) => state.value === event.venue?.state_id),
    }),
    [event, stateOptions, optionsCOI],
  );

  const validationSchema = Yup.object({
    firstName: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    lastName: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    name: Yup.string().max(25, VENUE_NAME).required(VENUE_NAME_REQUIRE),
    addressLine1: Yup.string().max(50, ADDRESS_LIMIT).required(ADDRESS_LINE1_REQUIRED),
    zipcode: Yup.string()
      .matches(ZIPCODE_REGEX, ZIPCODE_NUMBER)
      .min(5, ZIPCODE)
      .max(5, ZIPCODE)
      .required(ZIPCODE_REQUIRE),
    city: Yup.string().required(CITY_REQUIRED),
    stateId: Yup.object({ value: Yup.string(), label: Yup.string() }).required(STATE_REQUIRED),
    COI: Yup.object({
      value: Yup.string().oneOf(Object.values(eventVenueDetailsCOI)),
      label: Yup.string(),
    }).required(COI_REQUIRED),
    isElevatorAvailable: Yup.object({
      value: Yup.string(),
      label: Yup.string(),
    }).required(ELEVATOR_REQUIRED),
  });

  const updateEventVenueDetailsMutation =
    api.eventAdminRouter.updateEventVenueDetails.useMutation();

  const handleSubmit = (
    values: typeof venueDetails,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: (nextState: { values: typeof venueDetails }) => void;
    },
  ) => {
    if (!values.state) {
      toast.error(STATE_REQUIRED);
      return;
    }
    if (!values.COI) {
      toast.error(COI_REQUIRED);
      return;
    }

    const data: UpdateEventVenueDetailsInput = {
      id: event.id,
      contactFirstName: values.firstName,
      contactLastName: values.lastName,
      contactEmail: values.email,
      venueName: values.name,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      stateId: values.state.value,
      zipcode: values.zipcode,
      COI: values.COI.value,
    };

    updateEventVenueDetailsMutation.mutate(data, {
      onSuccess: () => {
        resetForm({ values });
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  if (isLoading || isLoadingEventStates) {
    return <ShimmerVenueDetail />;
  }

  return (
    <Formik
      initialValues={venueDetails}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
      }}
    >
      {({ errors, touched, setFieldValue, values, initialValues, resetForm, setSubmitting }) => (
        <Form>
          <Card className="card-apply-job bg-white">
            <CardHeader className="p-0 mx-2 mt-2 mb-75">
              <CardTitle className="sy-tx-primary">Edit Venue Details</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label for="firstName">First name of venue contact:</Label>
                    <Field
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="lastName">Last name of venue contact:</Label>
                    <Field
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email:</Label>
                    <Field
                      id="contactEmail"
                      name="email"
                      placeholder="Email"
                      className={`form-control ${
                        touched.email && errors.email ? "is-invalid" : ""
                      }`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Venue Name:</Label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Venue Name"
                      className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <CardHeader className="p-0 my-sm-1">
                <CardTitle tag="h4" className="f-18">
                  Venue Address
                </CardTitle>
              </CardHeader>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="addressLine1">Address Line 1:</Label>
                    <Field
                      id="addressLine1"
                      name="addressLine1"
                      placeholder="Address Line 1"
                      className={`form-control ${
                        touched.addressLine1 && errors.addressLine1 ? "is-invalid" : ""
                      }`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="addressLine2">Address Line 2:</Label>
                    <Field
                      id="addressLine2"
                      name="addressLine2"
                      placeholder="Address Line 2"
                      className="form-control"
                      as={Input}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City:</Label>
                    <Field
                      id="city"
                      name="city"
                      placeholder="City"
                      className={`form-control ${touched.city && errors.city ? "is-invalid" : ""}`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="stateId">State:</Label>
                    <Select
                      name="stateId"
                      id="stateId"
                      className="react-select"
                      classNamePrefix="select"
                      value={values.state}
                      options={stateOptions}
                      onChange={(e) => setFieldValue("state", e)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="zipcode">Zip Code:</Label>
                    <Field
                      id="zipcode"
                      name="zipcode"
                      placeholder="Zip Code"
                      className={`form-control ${
                        touched.zipcode && errors.zipcode ? "is-invalid" : ""
                      }`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="COI">COI:</Label>
                    <Select
                      name="COI"
                      id="COI"
                      className="react-select"
                      classNamePrefix="select"
                      value={values.COI}
                      options={optionsCOI}
                      onChange={(e) => setFieldValue("COI", e)}
                      isSearchable={false}
                    />
                  </FormGroup>
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

export default VenueDetailEdit;
