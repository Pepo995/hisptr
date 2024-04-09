//imports from packages
import { type ReactElement, useEffect, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import Select from "react-select";
import { ArrowLeft, Eye } from "react-feather";
import makeAnimated from "react-select/animated";
import { Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
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
  InputGroupText,
  Label,
  Row,
  UncontrolledTooltip,
} from "reactstrap";

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

import { selectThemeColors } from "@utils/Utils";
import ShimmerEditparner from "@components/Shimmer/ShimmerEditpartner";
import { partnerGetByIdApiCall, partnerUpdateApiCall } from "@redux/action/PartnerAction";

import { useRouter } from "next/router";
import { preferenceApiCall } from "@redux/action/EventAction";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import { type NextPageWithLayout } from "@pages/_app";
import Link from "next/link";

const EditPartnerMember: NextPageWithLayout = () => {
  //States
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [countryOptions, setCountryOption] = useState([]);
  const [editData, setEditData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const router = useRouter();

  /* Setting the initial values of the form. */

  const initialFormValues = {
    first_name: editData?.first_name,
    last_name: editData?.last_name,
    email: editData?.email,
    address: editData?.detail?.address,
    partner_agreement: "",
    markets: selectedCountry,
    company: editData?.company ? editData?.company : "",
  };
  const FILE_SIZE = 5000000;
  const SUPPORTED_FORMATS = ["application/pdf"];
  /* A validation schema for the form. */
  const inviteValidationSchema = Yup.object({
    first_name: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    last_name: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    company: Yup.string(),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    markets: Yup.array().min(1, COUNTRY_REQUIRE).required(COUNTRY_REQUIRE),
    address: Yup.string().max(50, ADDRESS_LIMIT),
    company: Yup.string().max(50, MAX_COMPANY_NAME).required(COMPANY_REQUIRE),
    partner_agreement:
      /*eslint-disable*/
      editData?.detail?.partner_agreement === null
        ? Yup.mixed()
            .required(AGREEMENT_REQUIRE)
            .test("fileSize", FILE_TOO_LARGE, (value) => value && value.size <= FILE_SIZE)
            .test(
              "fileFormat",
              PDF_ONLY,
              (value) => value && SUPPORTED_FORMATS.includes(value.type),
            )
        : Yup.mixed(),
    /*eslint-enable*/
  });
  /**
   * It fetches the data from the API and sets the data in the state.
   */
  const getEditData = async (id) => {
    setIsLoading(true);
    /*eslint-disable-next-line */
    const data = { id: id, type: "partner" };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const responce = await dispatch(partnerGetByIdApiCall(data) as unknown as AnyAction);
    if (responce.status === 200) {
      setEditData(responce.data);

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
        const countryArray = [];
        responce?.data?.countries?.map((ele) => {
          res?.data?.data?.preferences?.find((r) => {
            if (ele.country_id === r.id) {
              countryArray.push({ label: r.name, value: ele.country_id });
            }
          });
        });
        setSelectedCountry(countryArray);
      }
      setCountryOption(tempArray);
    }
    setIsLoading(false);
  };
  /* The above code is using the useEffect hook to call the getEditData function when the component
  mounts. */
  useEffect(() => {
    if (router.query === undefined) {
      router.replace("/partner");
    } else if (router.query.id !== undefined) {
      getEditData(router.query.id);
    }
  }, [router.query.id]);
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
  /**
   * It takes in a value, creates a new FormData object, appends the value to the FormData object, and
   * then calls the partnerUpdateApiCall function with the FormData object as an argument
   * @param value - the form values
   */
  const editHandler = async (value) => {
    const data = new FormData();
    data.append("id", router.query.id);
    data.append("type", "partner");
    data.append("first_name", value.first_name);
    data.append("last_name", value.last_name);
    data.append("email", value.email);
    data.append("address", value.address);
    data.append("company", value.company);
    /*eslint-disable-next-line */
    value.markets.map((e) =>
      e.value ? data.append("markets[]", e.value) : data.append("markets[]", e),
    );
    data.append("type", "partner");
    data.append("partner_agreement", value.partner_agreement);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(partnerUpdateApiCall(data, "/admin", router) as unknown as AnyAction);
  };

  return (
    <>
      <Helmet>
        <title>Hipstr - Edit Partner Member</title>
      </Helmet>

      <div>
        <Breadcrumbs
          title="Partner Members"
          data={[
            { title: "Partner Member Listing", link: "/admin/partner" },
            { title: "Edit Partner Member" },
          ]}
        />
        <Card className="bg-white">
          <CardHeader>
            <CardTitle tag="h4" className="back-arrow-h cursor-pointer">
              <Link href="/admin/partner">
                <ArrowLeft className="sy-tx-primary" />
              </Link>
              Edit Partner Member
            </CardTitle>
          </CardHeader>

          <CardBody>
            {!isLoading ? (
              <Formik
                initialValues={initialFormValues}
                validationSchema={inviteValidationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={editHandler}
              >
                {({ errors, touched, setFieldValue, values }) => (
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
                          defaultValue={values.markets}
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
                          disabled
                        />
                        {errors.email && touched.email ? (
                          <span className="text-danger error-msg">{errors?.email}</span>
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
                      <Label sm="3" for="company" disabled className="add-form-header">
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
                      <Label sm="3" for="agreement" disabled className="add-form-header">
                        Agreement
                      </Label>
                      <Col sm="9">
                        <InputGroup>
                          <Input
                            type="file"
                            id="partner_agreement"
                            name="partner_agreement"
                            className="input-group form-control"
                            accept=".pdf"
                            onChange={(event) =>
                              setFieldValue("partner_agreement", event.currentTarget.files[0])
                            }
                          />
                          <InputGroupText className="cursor-pointer" id="view-agreement">
                            <a href={editData?.detail?.partner_agreement} target={"_blank"}>
                              <Eye className="sy-tx-primary" size={20} />
                            </a>
                          </InputGroupText>
                          <UncontrolledTooltip target={`view-agreement`}>
                            Click to view agreement
                          </UncontrolledTooltip>
                        </InputGroup>
                        {errors.partner_agreement && touched.partner_agreement ? (
                          <span className="text-danger error-msg">{errors?.partner_agreement}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                        <Button className="me-1 custom-btn3" color="primary" type="submit">
                          Update
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            ) : (
              <ShimmerEditparner />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

EditPartnerMember.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditPartnerMember;
