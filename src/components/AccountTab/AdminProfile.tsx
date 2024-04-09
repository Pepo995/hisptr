import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { Button, Card, CardBody, CardHeader, CardTitle, Col, Label, Row } from "reactstrap";
import {
  ADDRESS_LIMIT,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  IMAGE_ONLY,
  IMAGE_TOO_LARGE,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  PHONE_MAX_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  ZIPCODE_MIN,
  ZIP_VALID,
} from "@constants/ValidationConstants";
import { deleteImgApiCall, profileApiCall } from "@redux/action/ProfileAction";
import ProfileImg from "@images/portrait/small/avatar.jpeg";
import { getMemberApiCall } from "@redux/action/MemberListingAction";
import { decryptData } from "@utils/Utils";
import { USER_ID, USER_TYPE } from "@constants/CommonConstants";
import { countryListApiCall } from "@redux/action/CountryAction";
import ShimmerProfile from "@components/Shimmer/ShimmerProfile";
import ProfileImageCrop from "./ProfileImageCrop";
import { toast } from "react-toastify";
import FormSelect from "@components/inputs/FormSelect";
import type { SelectItem } from "@types";

type MemberData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  detail: {
    address: string;
    country_id: string;
    city: string;
    state: string;
    zipcode: string;
  };
  picture: string;
};
type Values = {
  firstName: string;
  lastName: string;
  email?: string;
  PhoneNumber: string;
  Address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  profileImage: string;
};

const FILE_SIZE = 5000000;
const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];
/* The below code is a validation schema for the form. */
const validationSchema = Yup.object({
  firstName: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
  lastName: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
  email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
  PhoneNumber: Yup.string()
    .min(10, PHONE_MAX_LENGTH)
    .max(10, PHONE_MAX_LENGTH)
    .matches(PHONE_NO_REGEX, PHONE_NO_VALID),
  Address: Yup.string().max(50, ADDRESS_LIMIT),
  zipCode: Yup.string().min(4, ZIPCODE_MIN).max(15, ZIP_VALID),
  profileImage:
    Yup.mixed<File>()
      .test("fileSize", IMAGE_TOO_LARGE, (value) => !value || value.size <= FILE_SIZE)
      .test("fileFormat", IMAGE_ONLY, (value) => !value || SUPPORTED_FORMATS.includes(value.type)),
});

const Profile = () => {
  // ** States
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countryOptions, setCountryOption] = useState<SelectItem[]>([]);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const dispatch = useDispatch();
  const ID = decryptData(localStorage.getItem(USER_ID) ?? "");
  const userType = decryptData(localStorage.getItem(USER_TYPE) ?? "");
  const [isReset, setIsReset] = useState(false);

  /* Set the initial values of the form. */

  const initialFormValues = {
    firstName: memberData?.first_name ? memberData?.first_name : "",
    lastName: memberData?.last_name ? memberData?.last_name : "",
    email: memberData?.email,
    PhoneNumber: memberData?.phone_number ? memberData?.phone_number : "",
    Address: memberData?.detail?.address ? memberData?.detail?.address : "",
    country: memberData?.detail?.country_id ? memberData?.detail?.country_id : "",
    state: memberData?.detail?.state ? memberData?.detail?.state : "",
    city: memberData?.detail?.city ? memberData?.detail?.city : "",
    zipCode: memberData?.detail?.zipcode ? memberData?.detail?.zipcode : "",
    profileImage: "",
  };

  const onChange = (e: File) => {
    if (e?.size > 5000000) {
      toast.error(IMAGE_TOO_LARGE(5));
    }
  };

  const preFillData = useCallback(async () => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const response = await dispatch(getMemberApiCall({ id: ID, type: userType }) as any);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setMemberData(response.data.user);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setAvatar(response.data.user.picture);
      // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const res = await dispatch(countryListApiCall() as any);
      const tempArray: SelectItem[] = [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (res.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        res.data.data.countries.map((c: { name: string; id: string }) => tempArray.push({ label: c.name, value: c.id }));
      }
      setCountryOption(tempArray);
    }
    setIsLoading(false);
  }, [ID, dispatch, userType]);

  const profileHandler = async (value?: Values) => {
    /*eslint-disable-next-line */
    isReset === true && avatar === null && (await dispatch(deleteImgApiCall() as any));
    setIsLoading(true);
    const data = new FormData();
    if (value) {
      data.append("first_name", value.firstName);
      data.append("last_name", value.lastName);
      value.email && data.append("email", value.email);
      data.append("phone_number", value.PhoneNumber);
      data.append("address", value.Address);
      data.append("country_id", value.country);
      data.append("city", value.city);
      data.append("state", value.state);
      data.append("zipcode", value.zipCode);
      value.profileImage !== "" && data.append("picture", value.profileImage);
    }
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    await dispatch(profileApiCall(data) as any);
    setIsLoading(false);
  };

  useEffect(() => {
    void preFillData();
  }, [preFillData]);

  return (
    <Fragment>
      <Card className="bg-white">
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Profile Details</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          {!isLoading ? (
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={profileHandler}
              enableReinitialize
            >
              {({ errors, setFieldValue, dirty, touched, values }) => (
                <Form>
                  <Row>
                    <Col sm="6" className="mb-1">
                      <div className="d-flex">
                        <div className="me-25">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className=" me-50 rounded"
                            src={avatar ?? ProfileImg.src}
                            alt="Generic placeholder image"
                            height="100"
                            width="100"
                          />
                        </div>
                        <div className="d-flex align-items-end mt-75 ms-1">
                          <div>
                            {avatar === null ? (
                              <ProfileImageCrop
                                name="profile_image"
                                setImage={(e: File) => {
                                  void setFieldValue("profileImage", e);
                                  onChange(e);
                                }}
                                croppedImage={(e: string) => {
                                  setAvatar(e);
                                }}
                                accept={SUPPORTED_FORMATS}
                              />
                            ) : (
                              <Button
                                className="mb-75 custom-btn3"
                                color="secondary"
                                size="sm"
                                outline
                                onClick={() => {
                                  /*eslint-disable-next-line */
                                  setAvatar(null), setIsReset(true);
                                }}
                              >
                                Reset
                              </Button>
                            )}
                            <p className="mb-0">Allowed JPG, JPEG or PNG. Max size of 5MB</p>
                            {errors.profileImage && values.profileImage ? (
                              <span className="text-danger error-msg">
                                {" "}
                                {errors?.profileImage}{" "}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="firstName">
                        First Name&nbsp;
                        <span className="text-danger error-msg">*</span>
                      </Label>
                      <Field
                        name="firstName"
                        id="firstName"
                        placeholder="John"
                        className="input-group form-control"
                      />
                      {errors.firstName && touched.firstName ? (
                        <span className="text-danger error-msg">{errors?.firstName}</span>
                      ) : null}
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="lastName">
                        Last Name&nbsp;
                        <span className="text-danger error-msg">*</span>
                      </Label>
                      <Field
                        name="lastName"
                        id="lastName"
                        placeholder="John"
                        className="input-group form-control"
                      />
                      {errors.lastName && touched.lastName ? (
                        <span className="text-danger error-msg">{errors?.lastName}</span>
                      ) : null}
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="emailInput">
                        E-mail
                      </Label>
                      <Field
                        name="email"
                        id="email"
                        placeholder="john@gmail.com"
                        className="input-group form-control"
                        disabled
                      />
                      {errors.email && touched.email ? (
                        <span className="text-danger error-msg">{errors?.email}</span>
                      ) : null}
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="firstName">
                        Phone number
                      </Label>
                      <Field
                        name="PhoneNumber"
                        type="number"
                        id="PhoneNumber"
                        placeholder="1234567890"
                        className="input-group form-control"
                      />
                      {errors.PhoneNumber && touched.PhoneNumber ? (
                        <span className="text-danger error-msg">{errors?.PhoneNumber}</span>
                      ) : null}
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="firstName">
                        Address
                      </Label>
                      <Field
                        name="Address"
                        id="Address"
                        placeholder="Enter your address"
                        className="input-group form-control"
                      />
                      {errors.Address && touched.Address ? (
                        <span className="text-danger error-msg">{errors?.Address}</span>
                      ) : null}
                    </Col>
                    <Col sm="6">
                      <Label className="form-label" for="firstName">
                        Country
                      </Label>
                      <FormSelect
                        name="country"
                        error={errors.country}
                        options={countryOptions}
                        isTouched={touched.country ?? false}
                        onChange={(e) => setFieldValue("country", e)}
                        inputStyles="react-select"
                        errorStyles="text-danger error-msg"
                      />
                      {errors.country && touched.country ? (
                        <span className="text-danger error-msg">{errors?.country}</span>
                      ) : null}
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="firstName">
                        State
                      </Label>
                      <Field
                        name="state"
                        id="state"
                        placeholder="Enter your state"
                        className="input-group form-control"
                      />
                      {errors.state && touched.state ? (
                        <span className="text-danger error-msg">{errors?.state}</span>
                      ) : null}
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="firstName">
                        City
                      </Label>
                      <Field
                        name="city"
                        id="city"
                        placeholder="Enter your city"
                        className="input-group form-control"
                      />
                      {errors.city && touched.city ? (
                        <span className="text-danger error-msg">{errors?.city}</span>
                      ) : null}
                    </Col>
                    <Col sm="6" className="mb-1">
                      <Label className="form-label" for="firstName">
                        Zip Code
                      </Label>
                      <Field
                        name="zipCode"
                        id="zipCode"
                        placeholder="123456"
                        className="input-group form-control"
                      />
                      {errors.zipCode && touched.zipCode ? (
                        <span className="text-danger error-msg">{errors?.zipCode}</span>
                      ) : null}
                    </Col>
                    <Col className="mt-2" sm="12">
                      <Button
                        type="submit"
                        className="me-1 custom-btn3"
                        color="primary"
                        disabled={!dirty}
                      >
                        Save changes
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          ) : (
            <ShimmerProfile />
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default Profile;
