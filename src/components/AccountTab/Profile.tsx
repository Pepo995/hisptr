import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";

import { toast } from "react-toastify";
import ProfileImg from "@images/portrait/small/avatar.jpeg";
import {
  getPartnerApiCall,
  getPartnerEmployeeApiCall,
  resetProRest,
  updatePartnerDataApi,
} from "@redux/action/ProfileAction";
import { countryListApiCall } from "@redux/action/CountryAction";
import { decryptData } from "@utils/Utils";
import { USER, USER_TYPE } from "@constants/CommonConstants";
import {
  ADDRESS_CHECK,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  IMAGE_ONLY,
  IMAGE_TOO_LARGE,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  PHONE_MAX_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  ZIPCODE,
} from "@constants/ValidationConstants";
import { useDispatch } from "react-redux";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Label, Row } from "reactstrap";
import ShimmerProfile from "@components/Shimmer/ShimmerProfile";
import ProfileImageCrop from "./ProfileImageCrop";
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
  firstName?: string;
  lastName?: string;
  email?: string;
  PhoneNumber?: string;
  Address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  profileImage?: string;
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryOptions, setCountryOption] = useState<SelectItem[]>([]);
  const [data, setData] = useState<MemberData | null>(null);
  const [avatarImg, setAvatarImg] = useState<string | null>(null);
  const [isReset, setIsReset] = useState(false);
  const dispatch = useDispatch();
  /**
   * If the image is larger than 5MB, display an error message
   * @param e - the event object
   */
  const onChange = (e: File) => {
    if (e?.size > 5000000) {
      toast.error(IMAGE_TOO_LARGE(5));
    }
  };
  // get data from localstorage
  const ID = decryptData(localStorage.getItem(USER) ?? "");
  const type = decryptData(localStorage.getItem(USER_TYPE) ?? "");

  const setCountryData = useCallback(async () => {
    const tempArray: SelectItem[] = [];
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const res = await dispatch(countryListApiCall() as any);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (res.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      res.data.data.countries.map((c: { name: string; id: string }) =>
        tempArray.push({ label: c.name, value: c.id }),
      );
    }
    setCountryOption(tempArray);
  }, [dispatch]);

  const preFillData = useCallback(async () => {
    setIsLoading(true);

    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const response = type === "partner" ? await dispatch(getPartnerApiCall({ id: ID, type: type }) as any) : await dispatch(getPartnerEmployeeApiCall({ id: ID, type: type }) as any);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setData(response.data.user);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setAvatarImg(response.data.user.picture);
    }

    setIsLoading(false);
  }, [dispatch, ID, type]);

  useEffect(() => {
    void preFillData();
    void setCountryData();
  }, [preFillData, setCountryData]);

  const initialFormValues = {
    firstName: data?.first_name ? data?.first_name : "",
    lastName: data?.last_name ? data?.last_name : "",
    email: data?.email,
    PhoneNumber: data?.phone_number ? data?.phone_number : "",
    Address: data?.detail?.address ? data?.detail?.address : "",
    country: data?.detail?.country_id
      ? data?.detail?.country_id
      : "",
    state: data?.detail?.state ? data?.detail?.state : "",
    city: data?.detail?.city ? data?.detail?.city : "",
    zipCode: data?.detail?.zipcode ? data?.detail?.zipcode : "",
    profileImage: "",
  };

  const profileHandler = async (value: Values) => {
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    isReset === true && avatarImg === null && (await dispatch(resetProRest() as any));
    setIsLoading(true);
    const data = new FormData();
    value?.firstName && data.append("first_name", value?.firstName);
    value?.lastName && data.append("last_name", value?.lastName);
    value?.email && data.append("email", value?.email);
    value?.PhoneNumber && data.append("phone_number", value?.PhoneNumber);
    value?.Address && data.append("address", value?.Address);
    value?.country && data.append("country_id", value?.country);
    value?.city && data.append("city", value?.city);
    value?.state && data.append("state", value?.state);
    value?.zipCode && data.append("zipcode", value?.zipCode);
    /*eslint-disable-next-line */
    value?.profileImage && value?.profileImage !== "" && data.append("picture", value?.profileImage);
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const response = await dispatch(updatePartnerDataApi(data) as any);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response?.status === 200) {
      void preFillData();
    }
    setIsLoading(false);
  };

  const FILE_SIZE = 5000000;
  const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

  const validationSchema = Yup.object({
    firstName: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    lastName: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    phNumber: Yup.string()
      .min(10, PHONE_MAX_LENGTH)
      .max(10, PHONE_MAX_LENGTH)
      .matches(PHONE_NO_REGEX, PHONE_NO_VALID),
    zipcode: Yup.string()
      .matches(/^[0-9]+$/, ZIPCODE)
      .min(4, ZIPCODE)
      .max(14, ZIPCODE),
    state: Yup.string(),
    address: Yup.string().max(50, ADDRESS_CHECK),
    city: Yup.string(),
    profileImage:
      Yup.mixed<File>()
        .test("fileSize", IMAGE_TOO_LARGE, (value) => !value || value.size <= FILE_SIZE)
        .test("fileFormat", IMAGE_ONLY, (value) => !value || SUPPORTED_FORMATS.includes(value.type)),
  });

  const handleImgReset = () => {
    setIsReset(true);
    setAvatarImg(null);
  };

  return (
    <Card className="sy-bg-white">
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">Profile Details</CardTitle>
      </CardHeader>

      {!isLoading ? (
        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={profileHandler}
          enableReinitialize
        >
          {({ setFieldValue, values, errors, touched, dirty }) => (
            <CardBody className="py-2 my-25">
              <div className="d-flex">
                <div className="me-25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="rounded me-50"
                    src={avatarImg ?? ProfileImg.src}
                    alt="Generic placeholder image"
                    height="100"
                    width="100" />
                </div>
                <div className="d-flex align-items-end mt-75 ms-1">
                  <div>
                    {avatarImg === null ? (
                      <ProfileImageCrop
                        name="profile_image"
                        setImage={(e: File) => {
                          void setFieldValue("profileImage", e);
                          onChange(e);
                        }}
                        croppedImage={(e: string) => {
                          setAvatarImg(e);
                        }}
                        accept={SUPPORTED_FORMATS} />
                    ) : (
                      <Button
                        className="mb-75 custom-btn3"
                        color="secondary"
                        size="sm"
                        outline
                        onClick={handleImgReset}
                      >
                        Reset
                      </Button>
                    )}
                    <p className="mb-0">Allowed JPG, JPEG or PNG. Max size of 5MB</p>
                    {errors.profileImage && values.profileImage ? (
                      <span className="text-danger error-msg"> {errors?.profileImage} </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <Form className="mt-2 pt-50">
                <Row>
                  <Col sm="6" className="mb-1 required">
                    <Label className="form-label" for="firstName">
                      First Name <span className="text-danger">*</span>
                    </Label>

                    <Field
                      type="text"
                      name="firstName"
                      id="firstname"
                      className="input-group form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        void setFieldValue("firstName", e.target.value);
                      }} />
                    {errors.firstName && touched.firstName ? (
                      <span className="text-danger error-msg">{errors.firstName}</span>
                    ) : null}
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="lastName">
                      Last Name <span className="text-danger">*</span>
                    </Label>

                    <Field
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="input-group form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        void setFieldValue("lastName", e.target.value);
                      }} />
                    {errors.lastName && touched.lastName ? (
                      <span className="text-danger error-msg">{errors.lastName}</span>
                    ) : null}
                  </Col>

                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="emailInput">
                      E-mail
                    </Label>
                    <Field
                      id="emailInput"
                      type="email"
                      name="email"
                      className="input-group form-control"
                      disabled />
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="company">
                      Company
                    </Label>
                    <Field
                      id="company"
                      type="text"
                      name="company"
                      className="input-group form-control"
                      disabled />
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="phNumber">
                      Phone Number
                    </Label>
                    <Field
                      id="phNumber"
                      type="number"
                      name="phNumber"
                      maxLength="11"
                      className="input-group form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        void setFieldValue("phNumber", e.target.value);
                      }} />
                    {errors.PhoneNumber && touched.PhoneNumber ? (
                      <span className="text-danger error-msg">{errors.PhoneNumber}</span>
                    ) : null}
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="address">
                      Address
                    </Label>
                    <Field
                      id="address"
                      name="address"
                      className="input-group form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        void setFieldValue("address", e.target.value);
                      }} />
                    {errors.Address && touched.Address ? (
                      <span className="text-danger error-msg">{errors.Address}</span>
                    ) : null}
                  </Col>

                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="country">
                      Country
                    </Label>
                    <FormSelect
                      name="country"
                      error={errors.country}
                      options={countryOptions}
                      isTouched={touched.country ?? false}
                      onChange={(e) => setFieldValue("country", e)}
                      inputStyles="react-select"
                      errorStyles="text-danger error-msg" />
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="accountState">
                      State
                    </Label>
                    <Field
                      id="accountState"
                      name="state"
                      className="input-group form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        void setFieldValue("state", e.target.value);
                      }} />
                    {errors.state && touched.state ? (
                      <span className="text-danger error-msg">{errors.state}</span>
                    ) : null}
                  </Col>

                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="accountState">
                      City
                    </Label>
                    <Field
                      id="accountCity"
                      name="city"
                      className="input-group form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        void setFieldValue("city", e.target.value);
                      }} />
                    {errors.city && touched.city ? (
                      <span className="text-danger error-msg">{errors.city}</span>
                    ) : null}
                  </Col>

                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="zipCode">
                      Zip Code
                    </Label>
                    <Field
                      id="zipCode"
                      name="zipcode"
                      placeholder="123456"
                      minLength="4"
                      maxLength="14"
                      className="input-group form-control"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        void setFieldValue("zipcode", e.target.value);
                      }} />
                    {errors.zipCode && touched.zipCode ? (
                      <span className="text-danger error-msg">{errors.zipCode}</span>
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
            </CardBody>
          )}
        </Formik>
      ) : (
        <ShimmerProfile />
      )}
    </Card>
  );
};

export default Profile;
