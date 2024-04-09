import { useState } from "react";
import { ArrowLeft } from "react-feather";
import Link from "next/link";
import { Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Label, Row } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import {
  DESIGNATION_MAX,
  DESIGNATION_REQUIRE,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
} from "@constants/ValidationConstants";

// import { useRouter } from "next/router";
import EmployeeFormShimmer from "@components/Shimmer/EmployeeFormShimmer";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { addPartnerApi } from "@redux/action/PartnerAction";

const AddEmployee: NextPageWithLayout = (callbackAdd) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  //Formik initial values
  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    designetion: "",
    status: true,
  };
  //Validations
  const partnerSchema = Yup.object({
    firstName: Yup.string().max(25, FIRST_NAME_MAX_LENGTH).required(FIRST_NAME_REQUIRED),
    lastName: Yup.string().max(25, LAST_NAME_MAX_LENGTH).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    designetion: Yup.string().max(25, DESIGNATION_MAX).required(DESIGNATION_REQUIRE),
  });
  // function for Add partner api call
  const addPartner = async (values) => {
    setIsLoading(true);
    const data = {
      type: "partneruser",
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      designation: values.designetion,
      is_active: values.status === (false || "false") ? 0 : 1,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(addPartnerApi(data) as unknown as AnyAction);
    setIsLoading(false);
  };

  return (
    <div className={open ? "d-block" : "d-none"}>
      <Helmet>
        <title>Hipstr - Add Employee</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs
          title="My Employees"
          data={[
            { title: "My Employees", link: "/partner/partner-employee" },
            { title: "Add Employee" },
          ]}
        />
        <Card className="bg-white">
          <CardHeader>
            <CardTitle tag="h4">
              <Link href="/partner/partner-employee" className="primary">
                <ArrowLeft onClick={callbackAdd} />
              </Link>{" "}
              Add Employee
            </CardTitle>
          </CardHeader>

          <CardBody>
            {!isLoading ? (
              <Formik
                initialValues={initialFormValues}
                validationSchema={partnerSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={addPartner}
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
                          placeholder="Enter Designation"
                        />
                        {errors.designetion && touched.designetion ? (
                          <span className="text-danger error-msg">{errors?.designetion}</span>
                        ) : null}
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
                          checked={values.status === true || values.status === "true"}
                        />
                        <Label className="form-check-label mx-1" for="ex1-active">
                          Active
                        </Label>
                        <Field
                          checked={values.status === false || values.status === "false"}
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
                          Create
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
AddEmployee.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default AddEmployee;
