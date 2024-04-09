import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Label,
  Row,
} from "reactstrap";
import { Field, Form, Formik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import {
  ADDRESS_LIMIT,
  ADDRESS_LINE1_REQUIRED,
  CITY_REQUIRED,
  COI_REQUIRED,
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
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import { ZIPCODE_REGEX } from "@constants/RegexConstants";
import { type EventFromPhp, type SelectNumericOption, eventVenueDetailsCOI } from "@types";
import AlertInfo from "@components/AlertInfo";
import { api } from "@utils/api";
import { toast } from "react-toastify";

type VenueDetailProps = {
  handlePre: () => void;
  handleNext: () => void;
  event: EventFromPhp;
  states?: SelectNumericOption[];
  id: number;
  isLoading: boolean;
};

const VenueDetail = ({ handlePre, handleNext, event, states, id, isLoading }: VenueDetailProps) => {
  const venueDetailsMutation = api.eventCustomerRouter.addVenueDetails.useMutation();
  const [ensuranceType, setEnsuranceType] = useState<eventVenueDetailsCOI | "">("");

  const initialFormValues = {
    firstName: event.venue?.first_name ?? "",
    lastName: event.venue?.last_name ?? "",
    email: event.venue?.email ?? "",
    name: event.venue?.name ?? "",
    city: event.venue?.city ?? "",
    addressLine1: event.venue?.address_line_1 ?? "",
    addressLine2: event.venue?.address_line_2 ?? "",
    zipcode: event.venue?.zipcode ?? "",
    COI: event.venue?.COI ?? "",
    stateId: event.venue?.state_id ?? 0,
  };

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
    stateId: Yup.number().required(STATE_REQUIRED),
    COI: Yup.string().oneOf(Object.values(eventVenueDetailsCOI)).required(COI_REQUIRED),
  });

  const updateHandler = (value: typeof initialFormValues) => {
    const data = {
      id: id.toString(),
      firstName: value?.firstName,
      lastName: value?.lastName,
      name: value?.name,
      email: value?.email,
      city: value?.city,
      stateId: value?.stateId,
      zipcode: value?.zipcode,
      addressLine1: value?.addressLine1,
      addressLine2: value?.addressLine2,
      COI: value?.COI as eventVenueDetailsCOI,
    };
    venueDetailsMutation.mutate(data, {
      onSuccess: () => {
        handleNext();
      },
      onError: () => {
        toast.error(
          "We had a problem saving the venue details. Please contact us to give you custom attention.",
        );
      },
    });
  };

  const HelpText = () => {
    switch (ensuranceType) {
      case eventVenueDetailsCOI.send:
        return (
          <AlertInfo
            title="Our team will contact you via Support Request to provide the generic COI. Please await further instructions in the Support Request tab."
            description="Thank you for your cooperation!"
          />
        );
      case eventVenueDetailsCOI.requireCustom:
        return (
          <AlertInfo
            title="Please upload your venue's custom COI request through our Support Request system. Follow these steps for seamless document exchange:"
            list={[
              "Select COI Option: Indicate whether your venue requires a custom COI.",
              "Initiate Support Request: If a custom COI is needed, you'll be prompted to start a conversation through the Support Request tab.",
              "Upload COI Document: In the Support Request, upload your COI document securely.",
            ]}
          />
        );
    }
  };

  return (
    <div className="main-role-ui mt-5">
      {!isLoading ? (
        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={updateHandler}
        >
          {({ errors, setFieldValue, touched, values }) => (
            <Form>
              <div>
                <Card className="fade-in bg-white">
                  <CardHeader>
                    <CardTitle tag="h4" className="sy-tx-primary  f-18">
                      Venue Details
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col lg="3" md="6" className="mb-1">
                        <Label className="form-label cu-label" for="nameMulti">
                          First Name of Venue Contact
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
                          Last Name of Venue Contact
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
                      <Col md="6" sm="12" className="">
                        <Label className="form-label cu-label " for="email">
                          Venue Contact E-mail
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter email address"
                          className="form-control custom-input sy-tx-black"
                        />
                        {errors.email && touched.email ? (
                          <span className="text-danger error-msg">{errors?.email}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="lastNameMulti">
                          Venue Name
                        </Label>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter venue name"
                          className="form-control custom-input"
                        />
                        {errors.name && touched.name ? (
                          <span className="text-danger error-msg">{errors?.name}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <CardHeader className="p-0 my-sm-1">
                      <CardTitle tag="h4" className="f-18">
                        Venue Address
                      </CardTitle>
                    </CardHeader>
                    <Row>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="addressLine1">
                          Street Address
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="addressLine1"
                          id="addressLine1"
                          placeholder="Enter street address"
                          className="form-control custom-input"
                        />
                        {errors.addressLine1 && touched.addressLine1 ? (
                          <span className="text-danger error-msg">{errors?.addressLine1}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="addressLine2">
                          Street Address Line 2<span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="addressLine2"
                          id="addressLine2"
                          placeholder="Enter street address line 2"
                          className="form-control custom-input"
                        />
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="city">
                          City
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="city"
                          id="city"
                          defaultValue={event.city}
                          placeholder="Enter city name"
                          className="form-control custom-input"
                        />
                        {errors.city && touched.city ? (
                          <span className="text-danger error-msg">{errors?.city}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="state">
                          State
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Select
                          className="react-select"
                          classNamePrefix="select"
                          options={states}
                          placeholder="Select state"
                          name="stateId"
                          id="stateId"
                          value={states?.[values?.stateId - 1]}
                          onChange={(e) => setFieldValue("stateId", (e ?? { value: "" }).value)}
                          isMulti={false}
                        />
                        {errors.stateId && touched.stateId ? (
                          <span className="text-danger error-msg">{errors?.stateId}</span>
                        ) : null}
                      </Col>
                      <Col md="6" sm="12" className="mb-1">
                        <Label className="form-label cu-label" for="addressLine2">
                          Zip Code
                          <span className="sy-tx-primary">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="zipcode"
                          id="zipcode"
                          placeholder="Enter zip code"
                          className="form-control custom-input"
                        />
                        {errors.zipcode && touched.zipcode ? (
                          <span className="text-danger error-msg">{errors?.zipcode}</span>
                        ) : null}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="fade-in bg-white">
                  <CardHeader>
                    <CardTitle tag="h4" className="sy-tx-primary f-18">
                      Certificate of Insurance
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <CardText>
                      Some venues require their vendors to provide a Certificate of Insurance (COI).
                      For those that require it, some accept a generic version whereas others have
                      specific requirements for the information that needs to be included (usually
                      their legal business name and address). We&apos;re happy to provide a COI for
                      any situation. IMPORTANT: COI requests are due 2 weeks prior to your event
                      date. If we do not receive a COI request via a Support Request within 2 weeks
                      of the event date, while we&apos;ll try our best and have proper insurance, we
                      cannot guarantee we will be able to produce the certificate.
                    </CardText>
                    <h6>
                      Please select from choices below <span className="sy-tx-primary">*</span>
                    </h6>
                    <Row>
                      <Col xl={5} lg={6} className="align-items-center d-flex radio">
                        <input
                          name="Insurance"
                          type="radio"
                          id="my-radio-1"
                          className="insurance-choices"
                          defaultChecked={event.venue?.COI === eventVenueDetailsCOI.send}
                          onChange={() => {
                            void setFieldValue("COI", eventVenueDetailsCOI.send);
                            setEnsuranceType(eventVenueDetailsCOI.send);
                          }}
                        />
                        <Label className="mb-0  radio-label" for="my-radio-1">
                          To my knowledge, you can send a generic COI
                        </Label>
                      </Col>
                      <Col xl={5} lg={6} className="radio">
                        <input
                          name="Insurance"
                          type="radio"
                          id="my-radio-2"
                          defaultChecked={event.venue?.COI === eventVenueDetailsCOI.notRequire}
                          className="insurance-choices"
                          onChange={() => {
                            void setFieldValue("COI", eventVenueDetailsCOI.notRequire);
                            setEnsuranceType(eventVenueDetailsCOI.notRequire);
                          }}
                        />
                        <Label className="mb-0  radio-label" for="my-radio-2">
                          My Venue does not require a COI
                        </Label>
                      </Col>
                      <Col xl={5} lg={6} className="mt-sm-1 radio">
                        <input
                          name="Insurance"
                          type="radio"
                          id="my-radio-3"
                          className="insurance-choices"
                          defaultChecked={event.venue?.COI === eventVenueDetailsCOI.requireCustom}
                          onChange={() => {
                            void setFieldValue("COI", eventVenueDetailsCOI.requireCustom);
                            setEnsuranceType(eventVenueDetailsCOI.requireCustom);
                          }}
                        />
                        <Label className="mb-0  radio-label" for="my-radio-3">
                          My venue requires a custom COI
                        </Label>
                      </Col>
                      <Col xl={5} lg={6} className="mt-sm-1 radio">
                        <input
                          name="Insurance"
                          type="radio"
                          id="my-radio-4"
                          className="insurance-choices"
                          defaultChecked={event.venue?.COI === eventVenueDetailsCOI.notSure}
                          onChange={() => {
                            void setFieldValue("COI", eventVenueDetailsCOI.notSure);
                            setEnsuranceType(eventVenueDetailsCOI.notSure);
                          }}
                        />
                        <Label className="mb-0  radio-label" for="my-radio-4">
                          I am not sure at this time
                        </Label>
                      </Col>
                    </Row>
                    {errors.COI && touched.COI ? (
                      <span className="text-danger error-msg">{errors?.COI}</span>
                    ) : null}
                    <div className="mt-sm-1 mt-1">
                      <HelpText />
                    </div>
                    <div className="mt-sm-3 mt-1">
                      <Button className="custom-btn4 me-75 mb-75" onClick={handlePre}>
                        Back
                      </Button>
                      <Button className="custom-btn3 mb-75" type="submit">
                        Save
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <ShimmerAddEvent />
      )}
    </div>
  );
};
export default VenueDetail;
