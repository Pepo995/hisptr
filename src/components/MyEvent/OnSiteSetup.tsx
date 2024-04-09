import { useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";

import {
  ALLOCATION_SPACE_VERIFIED,
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
  SETUP_REQUIRE,
} from "@constants/ValidationConstants";
import OnSiteSetupShimmer from "@components/Shimmer/OnSiteSetupShimmer";
import { api } from "@utils/api";
import { toast } from "react-toastify";
import { type EventSetupDetail } from "@prisma/client";
import { customerUpdateSetup } from "@schemas";

type OnSiteSetupProps = {
  handlePre: () => void;
  handleNext: () => void;
  setupData: EventSetupDetail | undefined;
  id: number;
  isLoading: boolean;
};

const OnSiteSetup = ({ handleNext, handlePre, id, setupData, isLoading }: OnSiteSetupProps) => {
  const setupDetailsMutation = api.eventCustomerRouter.addSetupDetails.useMutation();
  const [setup, setSetup] = useState(setupData?.availableForSetup === "no" || false);

  const initialFormValues = {
    contactName: setupData?.contactName ?? "",
    phoneNumber: setupData?.phoneNumber ?? "",
    email: setupData?.email ?? "",
    location: setupData?.location ?? "",
    isParkingAvailable: setupData?.isParkingAvailable ?? "",
    setupLocation: setupData?.setupLocation ?? "",
    availableForSetup: setupData?.availableForSetup ?? "",
    isElevatorAvailable: setupData?.isElevatorAvailable ?? "",
    setupDetails: setupData?.setupDetails ?? "",
    allocationSpaceVerified: setupData?.allocationSpaceVerified,
  };
  const validationSchema = Yup.object({
    contactName: Yup.string().max(25, NAME_MAX_LENGTH).required(NAME_REQUIRED),
    phoneNumber: Yup.string().matches(PHONE_NO_REGEX, PHONE_NO_VALID).required(PHONE_REQUIRED),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    location: Yup.string().max(1000, MAX_LOCATION).required(LOCATION_REQUIRED),
    isParkingAvailable: Yup.string().required(OPTION_REQUIRED),
    setupLocation: Yup.string().required(OPTION_REQUIRED),
    availableForSetup: Yup.string().required(OPTION_REQUIRED),
    isElevatorAvailable: Yup.string().required(OPTION_REQUIRED),
    setupDetails:
      setup === true ? Yup.string().max(1000, MAX_SETUP).required(SETUP_REQUIRE) : Yup.string(),
    allocationSpaceVerified: Yup.bool().isTrue(ALLOCATION_SPACE_VERIFIED).required(),
  });
  const updateHandler = (data: typeof initialFormValues) => {
    const validated = customerUpdateSetup.safeParse({ id: id.toString(), ...data });
    if (validated.success) {
      const validatedValues = validated.data;
      setupDetailsMutation.mutate(
        {
          id: id.toString(),
          contactName: validatedValues.contactName,
          phoneNumber: validatedValues.phoneNumber,
          email: validatedValues.email,
          location: validatedValues.location,
          isParkingAvailable: validatedValues.isParkingAvailable,
          setupLocation: validatedValues.setupLocation,
          availableForSetup: validatedValues.availableForSetup,
          isElevatorAvailable: validatedValues.isElevatorAvailable,
          setupDetails: validatedValues.setupDetails,
          allocationSpaceVerified: validatedValues.allocationSpaceVerified,
        },
        {
          onSuccess: () => {
            handleNext();
          },
          onError: (error) => {
            const errorMessage =
              error?.data?.httpStatus === 400
                ? error.message
                : "We had a problem saving your event setup details. Please contact us to give you custom attention.";
            toast.error(errorMessage);
          },
        },
      );
    } else {
      toast.error("Please check the form and fill missing values.");
    }
  };
  return (
    <div className="main-role-ui mt-5">
      {!isLoading ? (
        <Card className="fade-in bg-white">
          <CardHeader>
            <CardTitle tag="h4" className="sy-tx-primary  f-18">
              On Site Set Up Details
            </CardTitle>
          </CardHeader>

          <CardBody>
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={updateHandler}
            >
              {({ errors, setFieldValue, touched, values }) => (
                <Form>
                  <Row>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label" for="contactName">
                        Onsite Point of Contact Name
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Field
                        type="text"
                        name="contactName"
                        id="contactName"
                        placeholder="Enter name"
                        className="form-control custom-input"
                      />
                      {errors?.contactName && touched?.contactName ? (
                        <span className="text-danger error-msg">{errors?.contactName}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label" for="phoneNumber">
                        Onsite Point of Contact Phone Number
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Field
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Enter phone number "
                        className="form-control custom-input"
                      />
                      {errors?.phoneNumber && touched?.phoneNumber ? (
                        <span className="text-danger error-msg">{errors?.phoneNumber}</span>
                      ) : null}
                    </Col>
                    <Col md="6" sm="12" className="mb-1">
                      <Label className="form-label cu-label mb-75" for="email">
                        Onsite Point of Contact&apos;s Email
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email address"
                        className="form-control custom-input"
                      />
                      {errors?.email && touched?.email ? (
                        <span className="text-danger error-msg">{errors?.email}</span>
                      ) : null}
                    </Col>
                    <Col lg="12">
                      <Label className="form-label cu-label mb-75" for="location">
                        Where in the venue would you like the experience to be located?
                        <span className="sy-tx-primary">*</span>
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        type="textarea"
                        rows="5"
                        defaultValue={values?.location}
                        className="input-group form-control support-description custom-input"
                        placeholder="Type here "
                        onChange={(e) => setFieldValue("location", e.target.value)}
                      />
                      {!!errors?.location || values?.location ? (
                        <span className="text-danger error-msg">{errors?.location}</span>
                      ) : null}
                    </Col>
                  </Row>
                  <div className="mt-2">
                    <Label className="form-label cu-label mb-50" for="isParkingAvailable">
                      Is parking available at your venue? (I understand that I will either provide
                      Hipstr with a parking voucher for my event or I may be subject to a $75
                      parking fee.)
                      <span className="sy-tx-primary">*</span>
                    </Label>
                    <div className="d-flex flex-wrap">
                      <div className="radio m-0">
                        <input
                          name="isParkingAvailable"
                          type="radio"
                          id="isParkingAvailable"
                          defaultChecked={values?.isParkingAvailable === "yes"}
                          className="vertical-align"
                          onChange={() => setFieldValue("isParkingAvailable", "yes")}
                        />
                        <Label className="mb-0 radio-label me-1">Yes</Label>
                      </div>

                      <div className="radio m-0">
                        <input
                          name="isParkingAvailable"
                          type="radio"
                          id="isParkingAvailable"
                          defaultChecked={values?.isParkingAvailable === "no"}
                          className="vertical-align"
                          onChange={() => setFieldValue("isParkingAvailable", "no")}
                        />
                        <Label className="mb-0  radio-label">No</Label>
                      </div>
                    </div>
                    {errors?.isParkingAvailable && touched?.isParkingAvailable ? (
                      <span className="text-danger error-msg">{errors?.isParkingAvailable}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Label className="form-label cu-label mb-50" for="setupLocation">
                      Will We Be Setting Up Outdoors?
                      <span className="sy-tx-primary">*</span>
                    </Label>
                    <div className="d-flex flex-wrap ">
                      <div className="radio m-0 ">
                        <input
                          name="setupLocation"
                          type="radio"
                          id="setupLocationIndoor"
                          className="vertical-align"
                          defaultChecked={setupData?.setupLocation === "indoor"}
                          onChange={() => setFieldValue("setupLocation", "indoor")}
                        />
                        <Label className="mb-0 radio-label me-1">No, you&apos;ll be inside</Label>
                      </div>
                      <div className="radio m-0">
                        <input
                          name="setupLocation"
                          type="radio"
                          id="setupLocationOutdoor"
                          className="vertical-align"
                          defaultChecked={setupData?.setupLocation === "outdoor"}
                          onChange={() => setFieldValue("setupLocation", "outdoor")}
                        />
                        <Label className="mb-0 radio-label">Yes, you&apos;ll be outdoors</Label>
                      </div>
                    </div>
                    {errors?.setupLocation && touched?.setupLocation ? (
                      <span className="text-danger error-msg">{errors?.setupLocation}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Label className="form-label cu-label mb-50">Please Select:</Label>
                  </div>
                  <div className="mt-2">
                    <Label className="form-label cu-label mb-50" for="availableForSetup">
                      In order for us to have a smooth set up, we require 1 - 1.5 hours of setup
                      time. Could you confirm this is available for us?
                      <span className="sy-tx-primary">*</span>
                    </Label>
                    <div className="mb-50 d-flex align-items-center radio m-0">
                      <input
                        name="availableForSetup"
                        type="radio"
                        id="availableForSetupYes"
                        className="vertical-align"
                        defaultChecked={setupData?.availableForSetup === "yes"}
                        onChange={() => {
                          void setFieldValue("availableForSetup", "yes");
                          setSetup(false);
                        }}
                      />
                      <Label className="mb-0  radio-label">
                        We&apos;ll have full access to the final setup space 1 - 1.5 hours ahead of
                        time
                      </Label>
                    </div>
                    <div className="d-flex align-items-center radio m-0">
                      <input
                        name="availableForSetup"
                        type="radio"
                        id="availableForSetupNo"
                        className="vertical-align"
                        defaultChecked={setupData?.availableForSetup === "no"}
                        onChange={() => {
                          void setFieldValue("availableForSetup", "no");
                          setSetup(true);
                        }}
                      />
                      <Label className="mb-0 radio-label">
                        A 1 - 1.5 hour setup window will NOT be available
                      </Label>
                    </div>
                    {errors?.availableForSetup && touched?.availableForSetup ? (
                      <span className="text-danger error-msg">{errors?.availableForSetup}</span>
                    ) : null}
                    {setup === true && (
                      <>
                        <div className="d-flex align-items-center mt-1">
                          <Input
                            type="textarea"
                            name="setupDetails"
                            rows="5"
                            id="setupDetails"
                            defaultValue={setupData?.setupDetails ?? ""}
                            className="input-group form-control support-description custom-input"
                            placeholder="Type here "
                            onChange={(e) => setFieldValue("setupDetails", e.target.value)}
                          />
                        </div>
                        {!!errors?.setupDetails || values?.setupDetails ? (
                          <span className="text-danger error-msg">{errors?.setupDetails}</span>
                        ) : null}
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <Label className="form-label cu-label mb-50" for="isElevatorAvailable">
                      We have a lot of stuff to carry. Will an elevator be available? (if needed)
                      <span className="sy-tx-primary">*</span>
                    </Label>
                    <div className="mb-50 radio m-0">
                      <input
                        name="isElevatorAvailable"
                        type="radio"
                        id="isElevatorAvailableYes"
                        className="vertical-align"
                        defaultChecked={setupData?.isElevatorAvailable === "yes"}
                        onChange={() => setFieldValue("isElevatorAvailable", "yes")}
                      />
                      <Label className="mb-0  radio-label">Yes - your back will rest easy</Label>
                    </div>
                    <div className="mb-50 d-flex align-items-center radio m-0">
                      <input
                        name="isElevatorAvailable"
                        type="radio"
                        id="isElevatorAvailableNo"
                        className="vertical-align"
                        defaultChecked={setupData?.isElevatorAvailable === "no"}
                        onChange={() => setFieldValue("isElevatorAvailable", "no")}
                      />
                      <Label className="mb-0 radio-label">
                        Nope - you&apos;ll need to load equipment up stairs, by hand
                      </Label>
                    </div>
                    <div className="d-flex align-items-center radio m-0">
                      <input
                        name="isElevatorAvailable"
                        type="radio"
                        id="isElevatorAvailableNotNeeded"
                        className="vertical-align"
                        defaultChecked={setupData?.isElevatorAvailable === "not_needed"}
                        onChange={() => setFieldValue("isElevatorAvailable", "not_needed")}
                      />
                      <Label className="mb-0  radio-label">
                        All at ground level - no need for an elevator
                      </Label>
                    </div>
                    {errors?.isElevatorAvailable && touched?.isElevatorAvailable ? (
                      <span className="text-danger error-msg">{errors?.isElevatorAvailable}</span>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <Label className="form-label cu-label mb-50" for="allocationSpaceVerified">
                      Please Select
                      <span className="sy-tx-primary">*</span>
                    </Label>
                    <div className="mb-50 radio m-0">
                      <input
                        name="allocationSpaceVerified"
                        type="radio"
                        id="allocationSpaceVerified"
                        className="vertical-align"
                        defaultChecked={Boolean(setupData?.allocationSpaceVerified)}
                        onChange={() => setFieldValue("allocationSpaceVerified", true)}
                      />
                      <Label className="mb-0  radio-label">
                        I verify that sufficient space is allocated for the activation setup at my
                        venue.
                      </Label>
                    </div>
                    {errors?.allocationSpaceVerified && touched?.allocationSpaceVerified ? (
                      <span className="text-danger error-msg">
                        {errors?.allocationSpaceVerified}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-sm-3 mt-1">
                    <Button className="custom-btn4 me-75 mb-75" onClick={handlePre}>
                      Back
                    </Button>
                    <Button className="custom-btn3 mb-75" type="submit">
                      Save{" "}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      ) : (
        <OnSiteSetupShimmer />
      )}
    </div>
  );
};
export default OnSiteSetup;
