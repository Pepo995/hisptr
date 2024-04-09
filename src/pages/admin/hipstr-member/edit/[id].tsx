import { Button, Card, CardBody, CardHeader, CardTitle, Col, Label, Row } from "reactstrap";
import { ArrowLeft } from "react-feather";
import { useDispatch } from "react-redux";
import { Field, Form, Formik } from "formik";
import Select from "react-select";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRE,
  ROLE_VALID,
} from "@constants/ValidationConstants";
import Breadcrumbs from "@components/breadcrumbs";
import { editMemberApiCall, getMemberApiCall } from "@redux/action/MemberListingAction";
import { roleListingApiCall } from "@redux/action/RoleAction";
import ShimmerEditmember from "@components/Shimmer/ShimmerEditmember";

import { Helmet } from "react-helmet";
import { useRouter } from "next/router";

import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import Link from "next/link";
const EditMember: NextPageWithLayout = () => {
  //States
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  /**
   * It makes an API call to get a list of roles, and then it sets the state of the roleOptions array
   * to the list of roles
   */
  const getRolls = async () => {
    const data = {
      page: 1,
      per_page: 10,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(roleListingApiCall(data) as unknown as AnyAction);
    const tempArray: RequestOption[] = [];
    if (res.status === 200) {
      res.data.data.roles?.map((e) => {
        tempArray.push({ label: e.name, value: e.id });
      });
    }
    setRoleOptions(tempArray);
  };
  /* Setting the initial values of the form. */
  const initialFormValues = {
    firstName: memberData?.first_name,
    lastName: memberData?.last_name ? memberData?.last_name : "",
    email: memberData?.email,
    role: memberData?.role_id,
  };
  /* A validation schema for the formik form. */
  const validationSchema = Yup.object({
    firstName: Yup.string().max(25).required(FIRST_NAME_REQUIRED),
    lastName: Yup.string().max(25).required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    role: Yup.string().required(ROLE_VALID),
  });
  /**
   * This function is used to edit the details of a member
   * @param values - The values of the form
   */
  const editMemberDetailsHandler = async (values) => {
    setIsLoading(true);
    const data = {
      id: router.query.id,
      first_name: values?.firstName,
      last_name: values?.lastName,
      email: values?.email,
      type: "member",
      role_id: values?.role,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(editMemberApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /**
   * It's a function that calls the getMemberApiCall action creator, which makes an API call to the
   * backend, and then sets the memberData state to the response.data.user
   */
  const preFillData = async (id) => {
    const response = await dispatch(
      /*eslint-disable-next-line */
      getMemberApiCall({ id, type: "member" }),
    );
    setMemberData(response.data.user);
  };

  /* It's a useEffect hook that calls the getRolls and preFillData functions. */
  useEffect(() => {
    if (router.query === undefined) {
      router.replace("/admin/hipstr-member");
    } else if (router.query.id !== undefined) {
      setIsLoading(true);
      getRolls();
      preFillData(router.query.id);
      setIsLoading(false);
    }
  }, [router.query.id]);
  return (
    <div>
      <Helmet>
        <title>Hipstr - Edit Member</title>
      </Helmet>
      <Breadcrumbs
        title="Hipstr Member"
        data={[{ title: "Hipstr Member", link: "/admin/hipstr-member" }, { title: "Edit Member" }]}
      />
      <Card className="p-1 bg-white">
        <CardHeader>
          <CardTitle tag="h4" className="back-arrow-h cursor-pointer">
            <Link href="/admin/hipstr-member">
              <ArrowLeft className="sy-tx-primary" />
            </Link>{" "}
            Edit Member
          </CardTitle>
        </CardHeader>
        <CardBody>
          {!isLoading ? (
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              enableReinitialize
              onSubmit={editMemberDetailsHandler}
            >
              {({ errors, setFieldValue, values, touched }) => (
                <Form>
                  <Row className="mb-1">
                    <Label sm="3" for="name" className="add-form-header">
                      First Name
                    </Label>
                    <Col sm="9">
                      <Field
                        className="input-group form-control"
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter first Name"
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
                        className="input-group form-control"
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter last Name"
                      />
                      {errors.lastName && touched.lastName ? (
                        <span className="text-danger error-msg">{errors?.lastName}</span>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Label sm="3" for="Email" className="add-form-header">
                      Email
                    </Label>
                    <Col sm="9">
                      <Field
                        className="input-group form-control"
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                      />
                      {errors.email && touched.email ? (
                        <span className="text-danger error-msg">{errors?.email}</span>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Label sm="3" for="password" className="add-form-header">
                      Role
                    </Label>
                    <Col sm="9">
                      <Select
                        className="react-select"
                        classNamePrefix="select"
                        options={roleOptions}
                        name="role"
                        id="role"
                        value={roleOptions?.find((r) => r.value === values.role)}
                        onChange={(e) => setFieldValue("role", e.value)}
                      />
                      {errors.role && touched.role ? (
                        <span className="text-danger error-msg">{errors?.role}</span>
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                      <Button className="me-1 custom-btn7" color="primary" type="submit">
                        Update
                      </Button>
                      <Link href="/admin/hipstr-member">
                        {" "}
                        <Button outline className="custom-btn9" type="button">
                          Cancel
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          ) : (
            <ShimmerEditmember />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
EditMember.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditMember;
