import { useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Label, Row } from "reactstrap";
import { Field, Form, Formik } from "formik";
import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  IMAGE_FILE_SIZE,
  IMAGE_ONLY,
  IMAGE_TOO_LARGE,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  PHONE_MAX_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
  SUPPORTED_IMAGE_FORMATS,
} from "@constants/ValidationConstants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ProfileImg from "@images/portrait/small/avatar.jpeg";
import ShimmerProfile from "@components/Shimmer/ShimmerProfile";
import ProfileImageCrop from "@components/AccountTab/ProfileImageCrop";
import { Icon } from "@iconify/react";

import { useProfileUpdate } from "~/queries/customer/update";
import { useDeleteImage } from "~/queries/customer/deleteImage";
import { type RouterOutputs, api } from "@utils/api";
import { userImageUrl } from "@utils/userImageUrl";

const validationSchema = Yup.object({
  firstName: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
  lastName: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
  email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
  phoneNumber: Yup.string()
    .max(10, PHONE_MAX_LENGTH)
    .matches(PHONE_NO_REGEX, PHONE_NO_VALID)
    .required(PHONE_REQUIRED),
  picture: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      IMAGE_TOO_LARGE,
      (value) => !value || typeof value === "string" || value.size <= IMAGE_FILE_SIZE,
    )
    .test(
      "fileFormat",
      IMAGE_ONLY,
      (value) =>
        !value || typeof value === "string" || SUPPORTED_IMAGE_FORMATS.includes(value.type),
    ),
});

const Profile = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isReset, setIsReset] = useState(false);

  const { data: userData, isLoading: customerLoading } = api.usersRouter.getUser.useQuery();

  const { updateProfileAsync } = useProfileUpdate();
  const { deleteImageAsync } = useDeleteImage();

  const updateHandler = async (value: RouterOutputs["usersRouter"]["getUser"]) => {
    setSubmitLoading(true);
    isReset === true && (await deleteImageAsync());
    const data = new FormData();
    data.append("first_name", value.firstName);
    data.append("last_name", value.lastName);
    data.append("email", value.email);
    data.append("phone_number", value.phoneNumber ?? "");
    avatar !== null && data.append("picture", value.picture ?? "");

    await updateProfileAsync(data);
    setSubmitLoading(false);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="border-bottom">
        <CardTitle tag="h4">My Account</CardTitle>
      </CardHeader>
      <CardBody className="py-2 my-25">
        {!customerLoading && userData ? (
          <Formik
            initialValues={userData}
            validationSchema={validationSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={updateHandler}
          >
            {({ errors, setFieldValue, dirty, touched, values }) => (
              <Form>
                <Row>
                  <Col sm="6" className="mb-1">
                    <div className="d-flex">
                      <div className="me-25 tw-w-fit">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="me-50 rounded"
                          src={avatar ?? userImageUrl(values.picture) ?? ProfileImg.src}
                          alt="Generic placeholder image"
                          height="100"
                          width="100"
                        />
                      </div>
                      <div className="d-flex align-items-end mt-75 ms-1 tw-w-1/2">
                        <div className="tw-w-full">
                          {avatar === null ? (
                            <ProfileImageCrop
                              name="profile_image"
                              setImage={(e: File) => {
                                if (e?.size > 5000000) {
                                  return toast.error(IMAGE_TOO_LARGE(5));
                                } else {
                                  void setFieldValue("picture", e);
                                }
                              }}
                              croppedImage={(e: string) => {
                                setAvatar(e);
                              }}
                              accept={SUPPORTED_IMAGE_FORMATS}
                            />
                          ) : (
                            <Button
                              className="mb-75 custom-btn3"
                              color="secondary"
                              size="sm"
                              outline
                              onClick={() => {
                                setAvatar(null), setIsReset(true);
                              }}
                              type="button"
                            >
                              Reset
                            </Button>
                          )}
                          <p className="mb-0">Allowed JPG, JPEG or PNG. Max size of 3MB</p>
                          {errors.picture && values.picture && (
                            <span className="text-danger error-msg">
                              {" "}
                              {String(errors?.picture)}{" "}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label cu-label" htmlFor="firstName">
                      First Name &nbsp;
                      <span className="text-danger error-msg">*</span>
                    </Label>
                    <Field
                      name="firstName"
                      id="firstName"
                      placeholder="John"
                      className="input-group form-control"
                    />
                    {errors.firstName && touched.firstName && (
                      <span className="text-danger error-msg">{String(errors?.firstName)}</span>
                    )}
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label cu-label" for="lastName">
                      Last Name&nbsp;
                      <span className="text-danger error-msg">*</span>
                    </Label>
                    <Field
                      name="lastName"
                      id="lastName"
                      placeholder="John"
                      className="input-group form-control"
                    />
                    {errors.lastName && touched.lastName && (
                      <span className="text-danger error-msg">{String(errors?.lastName)}</span>
                    )}
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label cu-label" for="email">
                      E-mail&nbsp;
                      <span className="text-danger error-msg">*</span>
                    </Label>
                    <Field
                      name="email"
                      id="email"
                      placeholder="john@gmail.com"
                      className="input-group form-control"
                      disabled
                    />
                    {errors.email && touched.email && (
                      <span className="text-danger error-msg">{String(errors?.email)}</span>
                    )}
                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label cu-label" for="phoneNumber">
                      Phone number&nbsp;
                      <span className="text-danger error-msg">*</span>
                    </Label>
                    <Field
                      name="phoneNumber"
                      type="text"
                      id="phoneNumber"
                      placeholder="1234567890"
                      className="input-group form-control"
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <span className="text-danger error-msg">{String(errors?.phoneNumber)}</span>
                    )}
                  </Col>
                  <Col className="mt-2" sm="12">
                    <Button
                      type="submit"
                      className="mb-75 custom-btn3 tw-flex tw-items-center tw-justify-center"
                      color="primary"
                      disabled={!dirty}
                    >
                      {!submitLoading ? (
                        "Save changes"
                      ) : (
                        <Icon icon="svg-spinners:180-ring" width="24" height="24" />
                      )}
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
  );
};

export default Profile;
