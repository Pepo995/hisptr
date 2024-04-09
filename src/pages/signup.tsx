import { useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  PASSWORD_NOT_MATCH,
  PASSWORD_REQUIRE,
  PASWORD_MAX,
  PASWORD_MIN,
  TERMS_REQUIRED,
} from "@constants/ValidationConstants";
import { signUpApiCall } from "@redux/action/CustomerAction";

import SignupShimmer from "@components/ShimmerCustomer/SignupShimmer";
import Head from "next/head";
import VisitorHeader from "@components/VisitorHeader/VisitorHeader";
import { Eye, EyeOff } from "react-feather";
import TermsAndPrivacyPolicyModal from "@components/Modal/TermsAndPrivacyPolicyModal";
import { useSearchParams } from "next/navigation";
import { api } from "@utils/api";
import Checkbox from "@components/Checkbox";
import { toast } from "react-toastify";
import { loginApiCall } from "@redux/action/LoginAction";
import { type AnyAction } from "@reduxjs/toolkit";
import { Icon } from "@iconify/react";
import FormInput from "@components/inputs/FormInput";

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShown] = useState(false);
  const [termsAndConditionsModalOpen, setTermsAndConditionsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const signUpToken = searchParams?.get("token");

  const { isLoading: isDataLoading, data: eventData } = api.authRouter.getEventByToken.useQuery({
    signUpToken: typeof signUpToken === "string" ? signUpToken : undefined,
  });

  const completeUserInvitation = api.authRouter.completeUserInvitation.useMutation();

  const initialFormValues = {
    first_name: eventData?.firstName ?? "",
    last_name: eventData?.lastName ?? "",
    email: eventData?.email ?? "",
    password: "",
    password_confirmation: "",
    acceptTerms: false,
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    last_name: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    password: Yup.string().required(PASSWORD_REQUIRE).min(8, PASWORD_MIN).max(32, PASWORD_MAX),
    password_confirmation: Yup.string()
      .required(PASSWORD_REQUIRE)
      .min(8, PASWORD_MIN)
      .max(32, PASWORD_MAX)
      .when("password", {
        is: (val: string) => val && val.length > 0,
        then: () => Yup.string().oneOf([Yup.ref("password")], PASSWORD_NOT_MATCH),
      }),
    acceptTerms: Yup.bool().isTrue(TERMS_REQUIRED),
  });

  const signUpHandler = async (value: typeof initialFormValues) => {
    if (typeof signUpToken !== "string" || !eventData) {
      toast.error("Signup token is not valid");
      return;
    }

    setIsLoading(true);

    const data = { ...value, type: "customer" };

    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(signUpApiCall(data) as unknown as AnyAction);

    if (response.status === 200 && eventData?.id) {
      completeUserInvitation.mutate({
        eventId: eventData?.id,
        signUpToken,
      });

      const loginData = {
        email: value.email,
        password: value.password,
      };

      dispatch(loginApiCall(loginData, false, router, setIsLoading) as unknown as AnyAction);
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPassword = () => setConfirmPasswordShown(!confirmPasswordShow);

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <VisitorHeader withAuth selectedPath="/signin" />

      <div className="auth-wrapper auth-cover tw-flex tw-justify-center">
        <div
          className="tw-flex md:tw-py-9 tw-py-5 lg:tw-px-20 md:tw-px-16 tw-px-5 tw-mt-10 lg:tw-w-2/3 md:tw-w-3/5 tw-w-11/12 tw-flex-col tw-bg-white tw-rounded-2xl"
          style={{ boxShadow: "0px 4px 4px 0px rgba(225, 225, 225, 0.25)" }}
        >
          <div>
            <div className="tw-text-center md:tw-mt-0 tw-mt-9 tw-mb-5">
              <h2 className="tw-text-primary tw-text-center tw-font-bold">Welcome!</h2>

              <p>
                We can’t wait to plan your event! Please fill out the details below to create your
                Hipstr account.
              </p>
            </div>
            {isDataLoading ? (
              <SignupShimmer />
            ) : (
              <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={signUpHandler}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                    <div className="right-side tw-mt-5 tw-w-11/12 tw-mx-auto">
                      <div className="mb-1">
                        <label className="tw-font-bold tw-text-base" htmlFor="first_name">
                          First Name
                        </label>

                        <FormInput
                          type="text"
                          name="first_name"
                          isTouched={!!touched.first_name}
                          placeholder="Maria"
                        />

                        {errors.first_name && touched.first_name && (
                          <span className="text-danger error-msg">
                            {String(errors?.first_name)}
                          </span>
                        )}
                      </div>

                      <div className="mb-1">
                        <label className="tw-font-bold tw-text-base" htmlFor="last_name">
                          Last Name
                        </label>

                        <FormInput
                          type="text"
                          name="last_name"
                          isTouched={!!touched.last_name}
                          placeholder="Doe"
                        />

                        {errors.last_name && touched.last_name && (
                          <span className="text-danger error-msg">{String(errors?.last_name)}</span>
                        )}
                      </div>

                      <div className="mb-1">
                        <label className="tw-font-bold tw-text-base" htmlFor="email">
                          Email
                        </label>

                        <FormInput
                          type="text"
                          name="email"
                          isTouched={!!touched.email}
                          placeholder="Enter your email address"
                        />

                        {errors.email && touched.email && (
                          <span className="text-danger error-msg">{String(errors?.email)}</span>
                        )}
                      </div>

                      <div className="mb-1">
                        <label className="tw-font-bold tw-text-base" htmlFor="password">
                          Password
                        </label>

                        <div className="tw-no-wrap tw-relative tw-flex tw-items-stretch tw-w-full">
                          <FormInput
                            name="password"
                            type={passwordShown ? "text" : "password"}
                            isTouched={!!touched.password}
                            placeholder="Password"
                            className="tw-w-full tw-border-r-transparent"
                          />

                          <div className="input-group-text">
                            {passwordShown ? (
                              <Eye onClick={togglePassword} size={14} className="cursor-pointer" />
                            ) : (
                              <EyeOff
                                onClick={togglePassword}
                                size={14}
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                        </div>

                        {errors.password && touched.password && (
                          <span className="text-danger error-msg">{errors?.password}</span>
                        )}
                      </div>

                      <div className="mb-1">
                        <label
                          className="tw-font-bold tw-text-base"
                          htmlFor="password_confirmation"
                        >
                          Confirm Password
                        </label>

                        <div className="tw-no-wrap tw-relative tw-flex tw-items-stretch tw-w-full">
                          <FormInput
                            name="password_confirmation"
                            type={confirmPasswordShow ? "text" : "password"}
                            isTouched={!!touched.password_confirmation}
                            placeholder="Repeat Password"
                            className="tw-w-full tw-border-r-transparent"
                          />

                          <div className="input-group-text">
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
                          </div>
                        </div>

                        {errors.password_confirmation && touched.password_confirmation && (
                          <span className="text-danger error-msg">
                            {errors?.password_confirmation}
                          </span>
                        )}
                      </div>

                      <div className="tw-mb-5 tw-pb-5 tw-border-b">
                        <Checkbox
                          onChange={(e) => setFieldValue("acceptTerms", e.target.checked)}
                          checked={values.acceptTerms}
                          id="acceptTermsAndConditions"
                          name="acceptTermsAndConditions"
                          inter={false}
                          black
                        >
                          I accept the{" "}
                          <button
                            onClick={() => setTermsAndConditionsModalOpen(true)}
                            className="tw-font-semibold tw-underline"
                            type="button"
                          >
                            Terms of Service & Privacy Policy
                          </button>
                        </Checkbox>

                        <TermsAndPrivacyPolicyModal
                          open={termsAndConditionsModalOpen}
                          setOpen={setTermsAndConditionsModalOpen}
                          onConfirm={() => setFieldValue("acceptTerms", true)}
                        />

                        {errors.acceptTerms && touched.acceptTerms && (
                          <p className="text-danger error-msg">{errors?.acceptTerms}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="tw-bg-primary tw-rounded-md tw-w-full tw-block tw-py-2 tw-px-5 tw-font-normal tw-text-white"
                      >
                        Sign Up &nbsp;{" "}
                        {!isLoading || isDataLoading ? null : (
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
                          Already have an account?{" "}
                          <Link
                            href="/signin"
                            className="tw-text-[#5e5873] tw-cursor-pointer tw-font-medium"
                          >
                            Sign in!
                          </Link>
                        </p>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
