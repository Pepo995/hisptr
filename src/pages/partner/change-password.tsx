import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Eye, EyeOff } from "react-feather";
import { Field, Form, Formik } from "formik";
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
  CURRENT_PASSWORD_REQUIRE,
  NEW_PASSWORD_REQUIRE,
  PASSWORD_NOT_MATCH,
  PASSWORD_REQUIRE,
  PASWORD_MAX,
  PASWORD_MIN,
} from "@constants/ValidationConstants";
import ShimmerChangePass from "@components/Shimmer/ShimmerChangePass";

const ChangePassword: NextPageWithLayout = () => {
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
  //Yup validations
  const validationSchema = Yup.object({
    oldPassword: Yup.string().required(CURRENT_PASSWORD_REQUIRE),
    newPassword: Yup.string()
      .required(NEW_PASSWORD_REQUIRE)
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX),
    confirmPassword: Yup.string()
      .required(PASSWORD_REQUIRE)
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX)
      .when("newPassword", {
        is: (val) => val && val.length > 0,
        then: Yup.string().oneOf([Yup.ref("newPassword")], PASSWORD_NOT_MATCH),
      }),
  });

  //change password handler function
  const changePasswordHandler = async (values) => {
    setIsLoading(true);
    const data = {
      current_password: values.oldPassword,
      new_password: values.newPassword,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(changePasswordApi(data) as unknown as AnyAction);
    setIsLoading(false);
  };

  //toggle password eye buttons
  const toggleOldPassword = () => setoldPasswordShown(!oldPasswordShow);
  const toggleNewPassword = () => setNewPasswordShown(!newPasswordShow);
  const toggleConfirmPassword = () => setConfirmPasswordShown(!confirmPasswordShow);

  return (
    <div className="auth-wrapper auth-basic px-2 change-auth">
      <div className="auth-inner change-inner">
        <Card className="mb-0">
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
                {({ errors, touched }) => (
                  <Form className="auth-register-form mt-2">
                    <Row>
                      <Col xl={6}>
                        <div className="mb-1">
                          <Label className="form-label" for="register-password">
                            Old Password
                          </Label>
                          <InputGroup>
                            <Field
                              name="oldPassword"
                              type={oldPasswordShow ? "text" : "password"}
                              className="input-group field-border form-control"
                              id="oldPassword"
                            />
                            <InputGroupText>
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
                          {errors.oldPassword && touched.oldPassword ? (
                            <span className="text-danger error-msg">{errors?.oldPassword}</span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6}>
                        <div className="mb-1">
                          <Label className="form-label" for="register-password">
                            New Password
                          </Label>
                          <InputGroup>
                            <Field
                              name="newPassword"
                              type={newPasswordShow ? "text" : "password"}
                              className="input-group field-border form-control"
                              id="newPassword"
                            />
                            <InputGroupText>
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
                          {errors.newPassword && touched.newPassword ? (
                            <span className="text-danger error-msg">{errors?.newPassword}</span>
                          ) : null}
                        </div>
                      </Col>
                      <Col xl={6}>
                        <div className="mb-1">
                          <Label className="form-label" for="register-password">
                            Retype New Password
                          </Label>
                          <InputGroup>
                            <Field
                              name="confirmPassword"
                              type={confirmPasswordShow ? "text" : "password"}
                              className="input-group field-border form-control"
                              id="confirmPassword"
                            />
                            <InputGroupText>
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
                          {errors.confirmPassword && touched.confirmPassword ? (
                            <span className="text-danger error-msg">{errors?.confirmPassword}</span>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Button type="save" color="primary" className="custom-btn7 mb-75 me-75">
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
  );
};

export default ChangePassword;
