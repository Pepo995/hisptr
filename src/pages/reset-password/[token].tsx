import Link from "next/link";
import { Field, Form, Formik } from "formik";
import { ChevronLeft, Eye, EyeOff } from "react-feather";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  Button,
  CardText,
  CardTitle,
  Col,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  Spinner,
} from "reactstrap";

import { useSkin } from "@hooks/useSkin";
import { resetPasswordSchema } from "@components/validation";
import { resetPasswordApiCall } from "@redux/action/LoginAction";
import Logo from "@components/icons/HipsterLogo";
import { useRouter } from "next/router";
import errorDark from "@images/pages/error-dark.svg";
import error from "@images/pages/error.svg";
import { Skin, type SvgImage } from "@types";
import { type AnyAction } from "@reduxjs/toolkit";
import Image from "next/image";

const ResetPasswordCover = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const dispatch = useDispatch();
  const { skin } = useSkin();
  const router = useRouter();
  const { token } = router.query;

  const illustration = (skin === Skin.Dark ? errorDark : error) as SvgImage;
  const source = illustration.src;

  const initialFormValues = {
    password: "",
    password_confirmation: "",
  };
  //reset password api call
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resetPasswordHandler = async (values: any) => {
    setIsLoading(true);
    /*eslint-disable-next-line */
    await dispatch(resetPasswordApiCall({ ...values, token: token }) as unknown as AnyAction);
    setIsLoading(false);
  };

  //onclick show password function
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPassword = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };
  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link
          className="brand-logo"
          href="/"
          // onClick={(e) => e.preventDefault()}
        >
          <Logo />
          <h2 className="brand-text sy-tx-black ms-1 mb-0">hipstr</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <Image
              className="img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static"
              src={source}
              alt="Login Cover"
              fill
            />
          </div>
        </Col>
        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>
            <Formik
              initialValues={initialFormValues}
              validationSchema={resetPasswordSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={resetPasswordHandler}
            >
              {({ errors, touched }) => (
                <Form className="auth-reset-password-form mt-2">
                  <div className="mb-1">
                    <Label className="form-label" for="new-password">
                      New Password
                    </Label>
                    <InputGroup>
                      <Field
                        name="password"
                        type={passwordShown ? "text" : "password"}
                        className="input-group field-border form-control"
                        id="password"
                      />
                      <InputGroupText>
                        {passwordShown ? (
                          <Eye onClick={togglePassword} size={14} className="cursor-pointer" />
                        ) : (
                          <EyeOff onClick={togglePassword} size={14} className="cursor-pointer" />
                        )}
                      </InputGroupText>
                    </InputGroup>
                  </div>
                  {errors.password && touched.password ? (
                    <span className="text-danger error-msg">{errors?.password}</span>
                  ) : null}
                  <div className="mb-1">
                    <Label className="form-label" for="confirm-password">
                      Confirm Password
                    </Label>
                    <InputGroup>
                      <Field
                        name="password_confirmation"
                        type={confirmPasswordShown ? "text" : "password"}
                        className="input-group field-border form-control"
                        id="password_confirmation"
                      />
                      <InputGroupText>
                        {confirmPasswordShown ? (
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
                    {errors.password_confirmation && touched.password_confirmation ? (
                      <span className="text-danger error-msg">{errors?.password_confirmation}</span>
                    ) : null}
                  </div>
                  <Button color="primary" type="submit" block>
                    Set New Password &nbsp;
                    {!isLoading ? null : <Spinner size="sm" />}
                  </Button>
                </Form>
              )}
            </Formik>
            <p className="text-center mt-2">
              <Link href="/signin" className="primary">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPasswordCover;
