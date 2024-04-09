import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Label, Row } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRE,
} from "@constants/ValidationConstants";
import { editPartnerApi, getPartnerEmployeeApiCall } from "@redux/action/PartnerAction";

import EmployeeFormShimmer from "@components/Shimmer/EmployeeFormShimmer";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { type AnyAction } from "@reduxjs/toolkit";
import { type Partner } from "@types";

const EditEmployee: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [partnerData, setPartnerData] = useState<Partner | null>(null);
  const router = useRouter();
  const ID = router.query.id;
  //Formik initial values
  const initialFormValues = {
    firstName: partnerData?.first_name ?? "",
    lastName: partnerData?.last_name ?? "",
    email: partnerData?.email ?? "",
    designation: partnerData?.detail?.designation ?? "",
    status: partnerData?.is_active === 1 || partnerData?.is_active === "1",
  };
  //Validations
  const partnerSchema = Yup.object({
    firstName: Yup.string().max(25).required(FIRST_NAME_REQUIRED),
    lastName: Yup.string().max(25).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
  });
  //Function for edit partner api call
  const editPartner = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    designation: string;
    status: boolean;
  }) => {
    setIsLoading(true);
    const data = {
      id: ID,
      type: "partneruser",
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      designation: values.designation,
      is_active: values.status === false ? 0 : 1,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(editPartnerApi(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  //Function for get partner data api call for prefill data
  const preFillData = async () => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(
      getPartnerEmployeeApiCall({ id: ID, type: "partneruser" }) as unknown as AnyAction,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setPartnerData(response.data.user);
    setIsLoading(false);
  };
  //onload check id then load edit data
  useEffect(() => {
    setIsLoading(true);
    if (ID === null || ID === undefined) {
      void router.replace("/partner-employee");
    } else {
      void preFillData();
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-block">
      <Helmet>
        <title>Hipstr - Edit Employee</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs
          title="My Employees"
          data={[
            { title: "My Employees", link: "/partner/partner-employee" },
            { title: "Edit Employee" },
          ]}
        />
        <Card className="bg-white">
          <CardHeader>
            <CardTitle tag="h4">
              <Link href="/partner/partner-employee" className="primary">
                <ArrowLeft />
              </Link>{" "}
              Edit Employee
            </CardTitle>
          </CardHeader>

          <CardBody>
            {!isLoading ? (
              <Formik
                initialValues={initialFormValues}
                validationSchema={partnerSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={editPartner}
                enableReinitialize
              >
                {({ errors, touched, values }) => (
                  <Form>
                    <Row className="mb-1">
                      <Label sm="3" for="name" className="add-form-header">
                        First Name
                      </Label>
                      <Col sm="9">
                        <Field
                          type="text"
                          name="firstName"
                          className="input-group  form-control"
                          defaultvalue={values.firstName}
                          id="name"
                          placeholder="Enter First Name"
                        />
                        {errors.firstName && touched.firstName ? (
                          <span className="text-danger error-msg">{errors?.firstName}</span>
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
                          name="lastName"
                          className="input-group  form-control"
                          id="name"
                          placeholder="Enter Last Name"
                        />
                        {errors.lastName && touched.lastName ? (
                          <span className="text-danger error-msg">{errors?.lastName}</span>
                        ) : null}
                      </Col>
                    </Row>

                    <Row className="mb-1">
                      <Label sm="3" for="name" className="add-form-header">
                        Email
                      </Label>
                      <Col sm="9">
                        <Field
                          type="email"
                          name="email"
                          className="input-group  form-control"
                          id="email"
                          placeholder="Enter Email"
                        />
                        {errors.email && touched.email ? (
                          <span className="text-danger error-msg">{errors?.email}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Label sm="3" for="designetion" className="add-form-header">
                        Designation
                      </Label>
                      <Col sm="9">
                        <Field
                          type="text"
                          name="designetion"
                          className="input-group  form-control"
                          id="designetion"
                          placeholder="Enter Designetion"
                        />
                      </Col>
                    </Row>

                    <Row className="mb-1">
                      <Label sm="3" for="designetion" className="add-form-header">
                        Status
                      </Label>
                      <Col sm="9" className="mt-1">
                        <Field
                          type="radio"
                          id="ex1-active"
                          name="status"
                          value={true}
                          checked={values.status}
                        />
                        <Label className="form-check-label mx-1" for="ex1-active">
                          Active
                        </Label>
                        <Field
                          checked={!values.status}
                          type="radio"
                          value={false}
                          name="status"
                          id="ex1-inactive"
                        />
                        <Label className="form-check-label mx-1" for="ex1-inactive">
                          Inactive
                        </Label>
                      </Col>
                    </Row>

                    <Row>
                      <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                        <Button className="me-1" color="primary" type="submit">
                          Update
                        </Button>
                        <Button
                          outline
                          color="secondary"
                          type="reset"
                          onClick={() => router.back()}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            ) : (
              <EmployeeFormShimmer />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
EditEmployee.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditEmployee;
