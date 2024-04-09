import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
// import '@styles/react/pages/page-authentication.scss'
import { Eye, EyeOff } from "react-feather";
import { Formik, Form, Field } from "formik";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { changePasswordApi } from "@redux/action/LoginAction";
import {
  PASSWORD_REPEAT,
  CURRENT_PASSWORD_REQUIRE,
  NEW_PASSWORD_REQUIRE,
  PASSWORD_NOT_MATCH,
  PASWORD_MAX,
  PASWORD_MIN,
} from "@constants/ValidationConstants";
import ShimmerChangePass from "@components/Shimmer/ShimmerChangePass";
import { getUserType } from "@utils/Utils";
import { UserType } from "@types";
const ChangePassword = () => {
  const [oldPasswordShow, setoldPasswordShown] = useState(false);
  const [newPasswordShow, setNewPasswordShown] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  //Formik initial values
  const initialFormValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  // Yup validations
  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required(CURRENT_PASSWORD_REQUIRE)
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX),
    newPassword: Yup.string()
      .required(NEW_PASSWORD_REQUIRE)
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX),
    confirmPassword: Yup.string()
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX)
      .oneOf([Yup.ref("newPassword"), null], PASSWORD_NOT_MATCH)
      .required(PASSWORD_REPEAT),
  });

  //change password handler function
  const changePasswordHandler = async (values) => {
    setIsLoading(true);
    const data = {
      current_password: values.oldPassword,
      new_password: values.newPassword,
    };
    await dispatch(changePasswordApi(data));
    setIsLoading(false);
  };

  //toggle password eye buttons
  const toggleOldPassword = () => setoldPasswordShown(!oldPasswordShow);
  const toggleNewPassword = () => setNewPasswordShown(!newPasswordShow);
  const toggleConfirmPassword = () => setConfirmPasswordShown(!confirmPasswordShow);

  const isCustomer = getUserType() === UserType.CUSTOMER;

  return (
    <div className="main-role-ui">
      <div className="auth-wrapper auth-basic px-2 change-auth">
        <div className="auth-inner change-inner">
          <Card className="mb-0 bg-white">
            <CardBody>
              <CardTitle tag="h4" className="mb-1">
                Change Password
              </CardTitle>
              {!isLoading ? (
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={validationSchema}
                  validateOnBlur={true}
                  validateOnChange={true}
                  onSubmit={changePasswordHandler}
                >
                  {({ errors, touched, dirty }) => (
                    <Form className="tw-w-full mt-2">
                      <Row>
                        <Col xl={6}>
                          <div className="mb-1">
                            <Label
                              className={`form-label${isCustomer ? " cu-label" : ""}`}
                              for="register-password"
                            >
                              Old Password&nbsp;
                              <span className="text-danger error-msg">*</span>
                            </Label>
                            <InputGroup className={isCustomer ? "cu-input-group" : ""}>
                              <Field
                                name="oldPassword"
                                type={oldPasswordShow ? "text" : "password"}
                                className={`input-group field-border form-control ${
                                  isCustomer ? "mb-0 mt-0 border-bottom-n" : ""
                                }`}
                                id="oldPassword"
                              />
                              <InputGroupText className={isCustomer ? "border-bottom-n" : ""}>
                                {oldPasswordShow ? (
                                  <Eye
                                    onClick={toggleOldPassword}
                                    size={14}
                                    className="cursor-pointer"
                                  />
                                ) : (
                                  <EyeOff
                                    onClick={toggleOldPassword}
                                    size={14}
                                    className="cursor-pointer"
                                  />
                                )}
                              </InputGroupText>
                            </InputGroup>
                            {errors.oldPassword && touched.oldPassword && (
                              <span className="text-danger error-msg">{errors?.oldPassword}</span>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={6}>
                          <div className="mb-1">
                            <Label
                              className={`form-label${isCustomer ? " cu-label" : ""}`}
                              for="register-password"
                            >
                              New Password&nbsp;
                              <span className="text-danger error-msg">*</span>
                            </Label>
                            <InputGroup className={isCustomer ? "cu-input-group" : ""}>
                              <Field
                                name="newPassword"
                                type={newPasswordShow ? "text" : "password"}
                                className={`input-group field-border form-control ${
                                  isCustomer ? "mb-0 mt-0 border-bottom-n" : ""
                                }`}
                                id="newPassword"
                              />
                              <InputGroupText className={isCustomer ? "border-bottom-n" : ""}>
                                {newPasswordShow ? (
                                  <Eye
                                    onClick={toggleNewPassword}
                                    size={14}
                                    className="cursor-pointer"
                                  />
                                ) : (
                                  <EyeOff
                                    onClick={toggleNewPassword}
                                    size={14}
                                    className="cursor-pointer"
                                  />
                                )}
                              </InputGroupText>
                            </InputGroup>
                            {errors.newPassword && touched.newPassword && (
                              <span className="text-danger error-msg">{errors?.newPassword}</span>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col xl={6}>
                          <div className="mb-1">
                            <Label
                              className={`form-label${isCustomer ? " cu-label" : ""}`}
                              for="register-password"
                            >
                              Retype New Password&nbsp;
                              <span className="text-danger error-msg">*</span>
                            </Label>
                            <InputGroup className={isCustomer ? "cu-input-group" : ""}>
                              <Field
                                name="confirmPassword"
                                type={confirmPasswordShow ? "text" : "password"}
                                className={`input-group field-border form-control ${
                                  isCustomer ? "mb-0 mt-0 border-bottom-n" : ""
                                }`}
                                id="confirmPassword"
                              />
                              <InputGroupText className={isCustomer ? "border-bottom-n" : ""}>
                                {confirmPasswordShow ? (
                                  <Eye
                                    onClick={toggleConfirmPassword}
                                    size={14}
                                    className="cursor-pointer"
                                  />
                                ) : (
                                  <EyeOff
                                    onClick={toggleConfirmPassword}
                                    size={14}
                                    className="cursor-pointer"
                                  />
                                )}
                              </InputGroupText>
                            </InputGroup>
                            {errors.confirmPassword && touched.confirmPassword && (
                              <span className="text-danger error-msg">
                                {errors?.confirmPassword}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Button
                        type="save"
                        color="primary"
                        className="custom-btn7 mb-75 me-75"
                        disabled={!dirty}
                      >
                        Save
                      </Button>
                    </Form>
                  )}
                </Formik>
              ) : (
                <ShimmerChangePass />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
