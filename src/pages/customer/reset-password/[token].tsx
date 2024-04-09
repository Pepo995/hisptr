/*eslint-disable */
import { useState } from "react";
import { Row, Col, Label, InputGroup, Button, InputGroupText, Spinner } from "reactstrap";
import LeftArrow from "@images/left-side.svg";
import PasswordIcon from "@images/password-icon.svg";
import PasswordShow from "@images/passwordshow.svg";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Link from "next/link";
import { useRouter } from "next/router";

import {
  CONFIRM_PASSWORD_REQUIRE,
  PASSWORD_NOT_MATCH,
  PASSWORD_REQUIRE,
  PASWORD_MAX,
  PASWORD_MIN,
} from "@constants/ValidationConstants";
// import TextField from "@material-ui/core/TextField";
import { useDispatch } from "react-redux";
import { resetPasswordApiCall } from "@redux/action/CustomerAction";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const ResetPassword: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const dispatch = useDispatch();
  const { token } = useParams();
  const initialFormValues = {
    password: "",
    password_confirmation: "",
  };
  const resetPasswordSchema = Yup.object({
    password: Yup.string()
      .required(PASSWORD_REQUIRE)
      .max(32)
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX),
    password_confirmation: Yup.string()
      .required(CONFIRM_PASSWORD_REQUIRE)
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX)
      .when("password", {
        is: (val) => val && val.length > 0,
        then: Yup.string().oneOf([Yup.ref("password")], PASSWORD_NOT_MATCH),
      }),
  });

  //reset password api call
  const resetPasswordHandler = async (values) => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(resetPasswordApiCall({ ...values, token: token }) as unknown as AnyAction);
    setIsLoading(false);
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const [passwordShown2, setPasswordShown2] = useState(false);
  const togglePassword2 = () => {
    setPasswordShown2(!passwordShown2);
  };
  return (
    <>
      <div className="container-fluid">
        <Row>
          <Col md={6} className="left-outer px-0">
            <div className="left-side d-flex  align-items-center">
              <div className="left-content text-start mx-5">
                <p className="font-42px sy-tx-white">Let’s Connect To</p>
                <p className="font-150px sy-tx-primary">hipstr</p>
                <p className="sy-tx-white h1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                  elit, sed do eiusmod.
                </p>
              </div>
            </div>
          </Col>

          <Col md={6} className="m-auto">
            <div className="right-side ">
              <div className="right-content text-start">
                <div className="upper-content d-flex mb-5" onClick={() => router.back()}>
                  <span className="me-1">
                    <img src={LeftArrow} role="button" />
                  </span>
                  <h5 className="mb-0 sy-tx-black f-600">Back To Home</h5>
                </div>
                <Row className="mt-3 mb-3">
                  <p className="font-56px sy-tx-black">Reset Password</p>
                  <p className="sy-tx-black">
                    Please enter the email address you’d like your password reset information sent
                    to
                  </p>
                </Row>
              </div>

              <Row>
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={resetPasswordSchema}
                  validateOnBlur={true}
                  validateOnChange={true}
                  onSubmit={resetPasswordHandler}
                >
                  {({ errors, touched }) => (
                    <Form className="text-sm-start text-start ">
                      <div>
                        <Label for="name" className="mt-3 h5">
                          New Password
                        </Label>
                        <InputGroup className="no-wrap">
                          <Field
                            type={passwordShown2 ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Password"
                            className="text-field-input mb-0 input-ff"
                          />
                          <InputGroupText>
                            {passwordShown2 ? (
                              <img
                                src={PasswordShow}
                                className="cursor-pointer"
                                onClick={togglePassword2}
                              />
                            ) : (
                              <img
                                src={PasswordIcon}
                                className="cursor-pointer"
                                onClick={togglePassword2}
                              />
                            )}
                          </InputGroupText>
                        </InputGroup>

                        {errors.password && touched.password ? (
                          <span className="text-danger error-msg">{errors?.password}</span>
                        ) : null}
                      </div>
                      <div>
                        <Label for="name" className="mt-3 h5">
                          Confirm Password
                        </Label>
                        <InputGroup className="no-wrap">
                          <Field
                            type={passwordShown ? "text" : "password"}
                            name="password_confirmation"
                            id="password_confirmation"
                            placeholder="Password"
                            className="text-field-input mb-0 input-ff"
                          />
                          <InputGroupText>
                            {passwordShown ? (
                              <img
                                src={PasswordShow}
                                className="cursor-pointer"
                                onClick={togglePassword}
                              />
                            ) : (
                              <img
                                src={PasswordIcon}
                                className="cursor-pointer"
                                onClick={togglePassword}
                              />
                            )}
                          </InputGroupText>
                        </InputGroup>
                        {errors.password_confirmation && touched.password_confirmation ? (
                          <span className="text-danger error-msg">
                            {errors?.password_confirmation}
                          </span>
                        ) : null}
                      </div>
                      <div className="d-flex justify-content-center mt-3">
                        <Button className="custom-btn3">
                          Reset password
                          {!isLoading ? null : <Spinner size="sm" className="mx-2" />}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="sign-in-link mt-3 text-center sy-tx-black">
                  <span>
                    Remember Password ?{" "}
                    <Link href="/customer/signin" className="sy-tx-primary f-600">
                      Sign In
                    </Link>
                  </span>
                </div>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ResetPassword;
