import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import makeAnimated from "react-select/animated";
import { Field, Form, Formik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import ShimmerInvitemember from "@components/Shimmer/ShimmerInvitemember";

import Breadcrumbs from "@components/breadcrumbs";

import Link from "next/link";
import {
  ADDRESS_LIMIT,
  AGREEMENT_REQUIRE,
  COMPANY_REQUIRE,
  COUNTRY_REQUIRE,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FILE_TOO_LARGE,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  MAX_COMPANY_NAME,
  PDF_ONLY,
} from "@constants/ValidationConstants";
import { useDispatch } from "react-redux";

import { selectThemeColors } from "@utils/Utils";

import { preferenceApiCall } from "@redux/action/EventAction";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { partnerAddApiCall } from "@redux/action/PartnerAction";

const InvitePartnerMember: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [countryOptions, setCountryOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  /* Initializing the form values. */
  const initialFormValues = {
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    partner_agreement: "",
    markets: [],
    company: "",
  };
  const FILE_SIZE = 5000000;
  const SUPPORTED_FORMATS = ["application/pdf"];
  /* This is a validation schema for the formik form. */
  const inviteValidationSchema = Yup.object({
    first_name: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    last_name: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    markets: Yup.array().min(1, COUNTRY_REQUIRE).required(COUNTRY_REQUIRE),
    address: Yup.string().max(50, ADDRESS_LIMIT),
    company: Yup.string().max(50, MAX_COMPANY_NAME).required(COMPANY_REQUIRE),
    partner_agreement: Yup.mixed()
      .required(AGREEMENT_REQUIRE)
      .test("fileSize", FILE_TOO_LARGE, (value) => value && value.size <= FILE_SIZE)
      .test("fileFormat", PDF_ONLY, (value) => value && SUPPORTED_FORMATS.includes(value.type)),
  });
  /**
   * It takes a value object, creates a new FormData object, appends the value object's properties to
   * the FormData object, and then dispatches the partnerAddApiCall action creator with the FormData
   * object as an argument
   * @param value - the form values
   */
  const inviteHandler = async (value) => {
    setIsLoading(true);
    const data = new FormData();
    data.append("first_name", value.first_name);
    data.append("last_name", value.last_name);
    data.append("email", value.email);
    data.append("address", value.address);
    data.append("company", value.company);
    value.markets.map((e) => data.append("markets[]", e));
    data.append("type", "partner");
    data.append("partner_agreement", value.partner_agreement);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(partnerAddApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /**
   * It makes an API call to get a list of countries, then it maps over the response and pushes the
   * country name and id into an array
   */
  const getCountry = async () => {
    const res = await dispatch(
      preferenceApiCall({
        sort_field: "name",
        sort_order: "asc",
        type: "market",
      }),
    );
    const tempArray: RequestOption[] = [];
    if (res.status === 200) {
      res?.data?.data?.preferences?.map((c) => tempArray.push({ label: c.name, value: c.id }));
    }
    setCountryOption(tempArray);
  };
  /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    getCountry();
  }, []);

  /**
   * It takes in the value of the select field, and the setFieldValue function from Formik, and then sets
   * the value of the markets field to the value of the select field
   * @param value - The value of the select field
   * @param setFieldValue - This is a function that is passed to the component by the formik library. It
   * is used to set the value of a field in the form.
   */
  const selectCountry = async (value, setFieldValue) => {
    let tempCountryArray = [];
    value.map((ele) => {
      tempCountryArray = tempCountryArray.concat(ele.value);
    });
    setFieldValue("markets", tempCountryArray);
  };
  return (
    <>
      <Helmet>
        <title>Hipstr - Invite Member</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Partner Members"
          data={[
            { title: "Partner Member Listing", link: "/admin/partner" },
            { title: "Invite Member" },
          ]}
        />
        <Card className="bg-white">
          <CardHeader>
            <CardTitle tag="h4" className="back-arrow-h cursor-pointer">
              <Link href="/admin/partner">
                <ArrowLeft className="sy-tx-primary" />
              </Link>
              Invite Partner Member
            </CardTitle>
          </CardHeader>

          <CardBody>
            {!isLoading ? (
              <Formik
                initialValues={initialFormValues}
                validationSchema={inviteValidationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={inviteHandler}
              >
                {({ errors, touched, setFieldValue }) => (
                  <Form>
                    <Row className="mb-1">
                      <Label sm="3" for="name" className="add-form-header">
                        First Name
                      </Label>
                      <Col sm="9">
                        <Field
                          type="text"
                          name="first_name"
                          id="first_name"
                          placeholder="Enter First Name"
                          className="input-group form-control"
                        />
                        {errors.first_name && touched.first_name ? (
                          <span className="text-danger error-msg">{errors?.first_name}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Label sm="3" for="name" className="add-form-header">
                        Last Name
                      </Label>
                      <Col sm="9">
                        <Field
                          type="text"
                          name="last_name"
                          id="last_name"
                          placeholder="Enter Last Name"
                          className="input-group form-control"
                        />
                        {errors.last_name && touched.last_name ? (
                          <span className="text-danger error-msg">{errors?.last_name}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Label sm="3" for="market" className="add-form-header">
                        Market
                      </Label>
                      <Col sm="9">
                        <Select
                          isClearable={false}
                          theme={selectThemeColors}
                          closeMenuOnSelect={false}
                          components={makeAnimated()}
                          placeholder="Select market"
                          isMulti
                          options={countryOptions}
                          className="react-select"
                          classNamePrefix="select"
                          name="markets"
                          onChange={(e) => selectCountry(e, setFieldValue)}
                        />
                        {errors.markets && touched.markets ? (
                          <span className="text-danger error-msg">{errors?.markets}</span>
                        ) : null}
                      </Col>
                    </Row>

                    <Row className="mb-1">
                      <Label sm="3" for="Email" disabled className="add-form-header">
                        Email
                      </Label>
                      <Col sm="9">
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          placeholder="xyz123@gmail.com"
                          className="input-group form-control"
                        />
                        {errors.email && touched.email ? (
                          <span className="text-danger error-msg">{errors?.email}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Label sm="3" for="company" className="add-form-header">
                        Company
                      </Label>
                      <Col sm="9">
                        <Field
                          type="company"
                          name="company"
                          id="company"
                          placeholder="company"
                          className="input-group form-control"
                        />
                        {errors.company && touched.company ? (
                          <span className="text-danger error-msg">{errors?.company}</span>
                        ) : null}
                      </Col>
                    </Row>

                    <Row className="mb-1">
                      <Label sm="3" for="address" className="add-form-header">
                        Address
                      </Label>
                      <Col sm="9">
                        <Field
                          type="textarea"
                          name="address"
                          id="address"
                          placeholder="Enter Address"
                          className="input-group form-control"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Label sm="3" for="agreement" disabled className="add-form-header">
                        Agreement
                      </Label>
                      <Col sm="9">
                        <InputGroup>
                          <Input
                            type="file"
                            id="partner_agreement"
                            name="partner_agreement"
                            accept=".pdf"
                            onChange={(event) =>
                              setFieldValue("partner_agreement", event.currentTarget.files[0])
                            }
                          />
                        </InputGroup>
                        {errors.partner_agreement && touched.partner_agreement ? (
                          <span className="text-danger error-msg">{errors?.partner_agreement}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                        <Button className="me-1 custom-btn3" color="primary" type="submit">
                          Send Invite
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            ) : (
              <ShimmerInvitemember />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

InvitePartnerMember.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default InvitePartnerMember;
