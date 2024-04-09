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
import OnSiteSetupShimmer from "@components/Shimmer/OnSiteSetupShimmer";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { type EventFromPhp } from "@types";
import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  LOCATION_REQUIRED,
  MAX_LOCATION,
  MAX_SETUP,
  NAME_MAX_LENGTH,
  NAME_REQUIRED,
  OPTION_REQUIRED,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
} from "@constants/ValidationConstants";
import { type UpdateEventOnSiteDetailsInput } from "@server/api/routers/admin/event";
import { api } from "@utils/api";

type OnSiteSetupProps = {
  event: EventFromPhp;
  isLoading: boolean;
};

const OnSiteSetupEdit = ({ event, isLoading }: OnSiteSetupProps) => {
  const setupDetails = {
    contactName: event.setup?.contact_name ?? "",
    phoneNumber: event.setup?.phone_number ?? "",
    email: event.setup?.email ?? "",
    location: event.setup?.location ?? "",
    parkingAvailability: event.setup?.is_parking_available ?? "",
    setupLocation: event.setup?.setup_location ?? "",
    availableForSetup: event.setup?.available_for_setup ?? "",
    setupDetails: event.setup?.setup_details ?? "",
    elevatorAvailability: event.setup?.is_elevator_available ?? "",
  };

  const validationSchema = Yup.object({
    contactName: Yup.string().max(25, NAME_MAX_LENGTH).required(NAME_REQUIRED),
    phoneNumber: Yup.string().matches(PHONE_NO_REGEX, PHONE_NO_VALID).required(PHONE_REQUIRED),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    location: Yup.string().max(1000, MAX_LOCATION).required(LOCATION_REQUIRED),
    parkingAvailability: Yup.string().oneOf(["yes", "no"], OPTION_REQUIRED),
    setupLocation: Yup.string().oneOf(["outdoor", "indoor"], OPTION_REQUIRED),
    availableForSetup: Yup.string().oneOf(["yes", "no"], OPTION_REQUIRED),
    elevatorAvailability: Yup.string().oneOf(["yes", "no", "not_needed"], OPTION_REQUIRED),
    setupDetails: Yup.string().max(1000, MAX_SETUP),
  });

  if (isLoading) {
    return <OnSiteSetupShimmer />;
  }

  const updateEventSetupDetailsMutation =
    api.eventAdminRouter.updateEventOnSiteDetails.useMutation();

  const handleSubmit = (
    values: typeof setupDetails,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: (nextState: { values: typeof setupDetails }) => void;
    },
  ) => {
    const data: UpdateEventOnSiteDetailsInput = {
      eventId: event.id,
      contactName: values.contactName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      location: values.location,
      parkingAvailability: values.parkingAvailability === "yes" ? "yes" : "no",
      setupLocation: values.setupLocation === "outdoor" ? "outdoor" : "indoor",
      availableForSetup: values.availableForSetup === "yes" ? "yes" : "no",
      setupDetails: values.availableForSetup === "yes" ? values.setupDetails : "",
      elevatorAvailability:
        values.elevatorAvailability === "yes"
          ? "yes"
          : values.elevatorAvailability === "no"
          ? "no"
          : "not_needed",
    };
    updateEventSetupDetailsMutation.mutate(data, {
      onSuccess: () => {
        resetForm({ values });
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <Formik
      initialValues={setupDetails}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, setFieldValue, values, initialValues, setSubmitting, resetForm }) => (
        <Form>
          <Card className="card-apply-job bg-white">
            <CardHeader className="p-0 mx-2 mt-2 mb-75">
              <CardTitle className="sy-tx-primary">Edit On Site Set Up Details</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="contactName">Onsite Point of Contact Name:</Label>
                    <Field
                      id="contactName"
                      name="contactName"
                      placeholder="Contact Name"
                      className={`form-control ${
                        touched.contactName && errors.contactName ? "is-invalid" : ""
                      }`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phoneNumber">Contact Number:</Label>
                    <Field
                      id="contactPhoneNumber"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      className={`form-control ${
                        touched.phoneNumber && errors.phoneNumber ? "is-invalid" : ""
                      }`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="email">Email Address:</Label>
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
                <Col md={12}>
                  <FormGroup>
                    <Label for="location">Where in the venue would the setup be located?</Label>
                    <Field
                      id="contactLocation"
                      name="location"
                      placeholder="Location"
                      className={`form-control ${
                        touched.location && errors.location ? "is-invalid" : ""
                      }`}
                      as={Input}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="parkingAvailability">Will there be parking available?</Label>
                    <div>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="parkingAvailability"
                          value="yes"
                          checked={values.parkingAvailability === "yes"}
                          onChange={() => setFieldValue("parkingAvailability", "yes")}
                        />
                        Yes
                      </Label>
                    </div>
                    <div>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="parkingAvailability"
                          value="no"
                          checked={values.parkingAvailability === "no"}
                          onChange={() => setFieldValue("parkingAvailability", "no")}
                        />
                        No
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="setupLocation">Will the setup be outdoors or indoors?</Label>
                    <div>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="setupLocation"
                          value="outdoors"
                          checked={values.setupLocation === "outdoor"}
                          onChange={() => setFieldValue("setupLocation", "outdoor")}
                        />
                        Outdoors
                      </Label>
                    </div>
                    <div>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="setupLocation"
                          value="indoors"
                          checked={values.setupLocation === "indoor"}
                          onChange={() => setFieldValue("setupLocation", "indoor")}
                        />
                        Indoors
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="availableForSetup">
                      Will the setup be available for setup 1.5 hours before the event?
                    </Label>
                    <div>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="availableForSetup"
                          value="yes"
                          checked={values.availableForSetup === "yes"}
                          onChange={() => setFieldValue("availableForSetup", "yes")}
                        />
                        Yes
                      </Label>
                    </div>
                    <div>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="availableForSetup"
                          value="no"
                          checked={values.availableForSetup === "no"}
                          onChange={() => setFieldValue("availableForSetup", "no")}
                        />
                        No
                      </Label>
                    </div>
                    {values.availableForSetup === "yes" && (
                      <>
                        <div className="d-flex align-items-center mt-1">
                          <Input
                            type="textarea"
                            name="setupDetails"
                            rows="5"
                            id="setupDetails"
                            defaultValue={setupDetails.setupDetails}
                            className="input-group form-control support-description custom-input"
                            placeholder="Setup details"
                            onChange={(e) => setFieldValue("setupDetails", e.target.value)}
                          />
                        </div>
                        {!!errors?.setupDetails || values?.setupDetails ? (
                          <span className="text-danger error-msg">{errors?.setupDetails}</span>
                        ) : null}
                      </>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="elevatorAvailability">Will there be an elevator available?</Label>
                    <div className="tw-flex-col tw-flex tw-gap-1">
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="elevatorAvailability"
                          value="yes"
                          checked={values.elevatorAvailability === "yes"}
                          onChange={() => setFieldValue("elevatorAvailability", "yes")}
                        />
                        Yes
                      </Label>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="elevatorAvailability"
                          value="no"
                          checked={values.elevatorAvailability === "no"}
                          onChange={() => setFieldValue("elevatorAvailability", "no")}
                        />
                        No
                      </Label>
                      <Label check className="tw-flex tw-gap-1 tw-items-center">
                        <Field
                          type="radio"
                          id="my-radio"
                          name="elevatorAvailability"
                          value="not_needed"
                          checked={values.elevatorAvailability === "not_needed"}
                          onChange={() => setFieldValue("elevatorAvailability", "not_needed")}
                        />
                        Not Needed
                      </Label>
                    </div>
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

export default OnSiteSetupEdit;
