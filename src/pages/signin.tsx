import { Eye, EyeOff } from "react-feather";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";

import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  PASSWORD_REQUIRE,
  PASWORD_MAX,
  PASWORD_MIN,
} from "@constants/ValidationConstants";
import { loginApiCall } from "@redux/action/LoginAction";
import { REMEMBER } from "@constants/CommonConstants";
import { decryptData } from "@utils/Utils";
import { useRouter } from "next/router";

import { type AnyAction } from "@reduxjs/toolkit";
import Head from "next/head";
import VisitorHeader from "@components/VisitorHeader/VisitorHeader";
import Link from "next/link";
import { Icon } from "@iconify/react";

type Remember = {
  isChecked?: boolean;
  email?: string;
  password?: string;
};

const Login = () => {
  //States
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const rememberString = localStorage.getItem(REMEMBER) ?? "";

  const decryptedData = !!rememberString ? decryptData(rememberString) : null;

  const remember: Remember = !!decryptedData ? (JSON.parse(decryptedData) as Remember) : {};

  const [rememberMe, setRememberMe] = useState(remember && remember?.isChecked);
  const [passwordShown, setPasswordShown] = useState(false);

  /* Set the initial value for the formik form */
  const initialFormValues = {
    email: remember && remember.isChecked && remember.email ? remember.email : "",
    password: remember && remember.isChecked && remember.password ? remember.password : "",
  };

  /* A validation schema for the formik form. */
  const loginSchema = Yup.object({
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    password: Yup.string().required(PASSWORD_REQUIRE).min(8, PASWORD_MIN).max(15, PASWORD_MAX),
  });

  const loginHandler = (value: { email: string; password: string }) => {
    setIsLoading(true);
    const data = { ...value };
    dispatch(loginApiCall(data, !!rememberMe, router, setIsLoading) as unknown as AnyAction);
  };

  //onclick show password function
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <VisitorHeader withAuth />

      <div className="auth-wrapper auth-cover tw-flex tw-justify-center">
        <div
          className="tw-flex md:tw-py-9 tw-py-5 lg:tw-px-20 md:tw-px-16 tw-px-5 tw-mt-10 lg:tw-w-2/3 md:tw-w-3/5 tw-w-11/12 tw-flex-col tw-bg-white tw-rounded-2xl"
          style={{ boxShadow: "0px 4px 4px 0px rgba(225, 225, 225, 0.25)" }}
        >
          <div className="tw-text-center md:tw-mt-0 tw-mt-9 tw-mb-5">
            <h2 className="tw-font-bold tw-text-primary">Welcome back!</h2>

            <p className="tw-text-lg tw-m-0">
              Please enter your login details below to access your Hipstr account.
            </p>
          </div>

          <Formik
            initialValues={initialFormValues}
            validationSchema={loginSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={loginHandler}
          >
            {({ errors, touched }) => (
              <Form className="auth-login-form tw-mt-5 tw-w-11/12 tw-mx-auto">
                <div className="mb-1">
                  <label className="tw-font-bold tw-text-base" htmlFor="email">
                    Email
                  </label>

                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="input-group form-control tw-rounded-md"
                    placeholder="john@example.com"
                  />

                  {errors.email && touched.email ? (
                    <span className="text-danger error-msg">{errors?.email}</span>
                  ) : null}
                </div>

                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <label className="tw-font-bold tw-text-base" htmlFor="password">
                      Password
                    </label>
                  </div>

                  <InputGroup>
                    <Field
                      name="password"
                      type={passwordShown ? "text" : "password"}
                      className="input-group field-border form-control tw-rounded-md"
                      id="password"
                      placeholder="Password"
                    />

                    <InputGroupText>
                      {passwordShown ? (
                        <Eye onClick={togglePassword} size={14} className="cursor-pointer" />
                      ) : (
                        <EyeOff onClick={togglePassword} size={14} className="cursor-pointer" />
                      )}
                    </InputGroupText>
                  </InputGroup>

                  {errors.password && touched.password ? (
                    <span className="text-danger error-msg">{errors?.password}</span>
                  ) : null}
                </div>

                <div className="form-check tw-mb-5">
                  <Input
                    type="checkbox"
                    id="remember-me"
                    name="remember-me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />

                  <label className="form-check-label tw-text-black" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="tw-bg-primary tw-rounded-md tw-w-full tw-block tw-py-2 tw-px-5 tw-font-normal tw-text-white"
                >
                  Log In &nbsp;{" "}
                  {!isLoading ? null : (
                    <Icon
                      icon="svg-spinners:180-ring"
                      width="24"
                      height="24"
                      className="tw-inline"
                    />
                  )}
                </button>

                <div className="tw-pt-5 tw-border-t tw-mt-5 tw-text-base">
                  <p>
                    First time logging in?{" "}
                    <Link
                      href="/signup"
                      className="tw-text-[#5e5873] tw-font-medium tw-cursor-pointer"
                    >
                      Click Here.
                    </Link>
                  </p>

                  <p className="cursor-pointer" onClick={() => router.push("/forgot-password")}>
                    Reset your password.
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
