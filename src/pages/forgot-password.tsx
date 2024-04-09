import Link from "next/link";
import { ChevronLeft } from "react-feather";
import { Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import { Icon } from "@iconify/react";

//imports from files,components and constants
import { EMAIL_REQUIRED, EMAIL_VALID } from "@constants/ValidationConstants";
import { forgotPasswordApiCall } from "@redux/action/LoginAction";

import { type AnyAction } from "@reduxjs/toolkit";
import Head from "next/head";
import VisitorHeader from "@components/VisitorHeader/VisitorHeader";

const ForgotPassword = () => {
  //States
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  /* Set the initial value of the email field to an empty string. */
  const initialFormValues = {
    email: "",
  };

  /* A validation schema for the email field. */
  const forgotPasswordSchema = Yup.object({
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
  });

  const forgotPasswordHandler = async (value: typeof initialFormValues) => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-argument
    await dispatch(forgotPasswordApiCall(value) as unknown as AnyAction);
    setIsLoading(false);
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
          <div className="tw-text-left md:tw-mt-0 tw-mt-9 tw-mb-5 tw-flex tw-items-center">
            <Link href="/signin" className="primary tw-h-fit">
              <ChevronLeft className="rotate-rtl me-25" size={25} />
            </Link>

            <h2 className="tw-font-bold tw-text-primary md:tw-text-2xl tw-text-xl">
              Forgot your password?
            </h2>
          </div>

          <Formik
            initialValues={initialFormValues}
            validationSchema={forgotPasswordSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={forgotPasswordHandler}
          >
            {({ values, errors, touched }) => (
              <Form className="auth-login-form tw-mt-5 tw-w-11/12 tw-mx-auto">
                <div className="mb-1">
                  <label className="tw-font-bold tw-text-base">Email</label>

                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="input-group form-control"
                    placeholder="john@example.com"
                  />

                  {errors.email && touched.email ? (
                    <span className="text-danger error-msg">{errors?.email}</span>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="tw-bg-primary tw-rounded-md tw-w-full tw-block tw-py-2 tw-px-5 tw-font-normal tw-text-white"
                >
                  Reset password{" "}
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
                  Didn&apos;t receive email?{" "}
                  <span
                    className="cursor-pointer tw-font-medium"
                    onClick={() => values.email && forgotPasswordHandler(values)}
                  >
                    Resend here.
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
