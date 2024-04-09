import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Label,
  Row,
} from "reactstrap";
import { ArrowLeft } from "react-feather";
import Select from "react-select";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ShimmerAddmember from "@components/Shimmer/ShimmerAddmember";
import Breadcrumbs from "@components/breadcrumbs";
import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  FIRST_NAME_MAX_LIMIT,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LIMIT,
  LAST_NAME_REQUIRE,
  ROLE_VALID,
} from "@constants/ValidationConstants";
import { addMemberApiCall } from "@redux/action/MemberListingAction";
import { roleListingApiCall } from "@redux/action/RoleAction";
import { DEFAULT_PASSWORD } from "@constants/CommonConstants";

import { Helmet } from "react-helmet";
const AddMember = ({ callbackAdd }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  /**
   * It makes an API call to get a list of roles, and then it sets the state of the roleOptions array to
   * the list of roles
   */
  const getRolls = async () => {
    const data = {
      page: 1,
      per_page: 10,
    };
    const res = await dispatch(roleListingApiCall(data));
    const tempArray = [];
    if (res.status === 200) {
      res.data.data.roles?.map((e) => {
        tempArray.push({ label: e.name, value: e.id });
      });
    }
    setRoleOptions(tempArray);
  };
  /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    getRolls();
  }, []);
  /* Setting the initial values of the form. */
  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  };
  /* A validation schema for the form. */
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(25, FIRST_NAME_MAX_LIMIT)
      .required(FIRST_NAME_REQUIRED),
    lastName: Yup.string()
      .max(25, LAST_NAME_MAX_LIMIT)
      .required(LAST_NAME_REQUIRE),
    email: Yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    role: Yup.string().required(ROLE_VALID),
  });
  /**
   * It takes in the values from the form, and then makes an API call to the backend to add a new
   * member to the database
   * @param values - The values of the form
   */
  const addMemberDetailsHandler = async (values) => {
    setIsLoading(true);
    const data = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      type: "member",
      role_id: values.role,
      password: DEFAULT_PASSWORD,
      password_confirmation: DEFAULT_PASSWORD,
    };
    await dispatch(addMemberApiCall(data));
    setIsLoading(false);
  };

  return (
    <div>
      <Helmet>
        <title>Hipstr - Add Member</title>
      </Helmet>
      <Breadcrumbs
        title="Hipstr Member"
        data={[
          { title: "Hipstr Member", link: "/admin/hipstr-member" },
          { title: "Add Member" },
        ]}
      />
      <Card className="p-1">
        <CardHeader>
          <CardTitle tag="h4" className="back-arrow-h cursor-pointer">
            <Link href="/admin/hipstr-member">
              <ArrowLeft onClick={callbackAdd} className="sy-tx-primary" />
            </Link>{" "}
            Add Member
          </CardTitle>
        </CardHeader>

        <CardBody>
          {!isLoading ? (
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={addMemberDetailsHandler}
            >
              {({ errors, setFieldValue, touched }) => (
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
                        onChange={(e) => {
                          setFieldValue("firstName", e.target.value);
                        }}
                      />
                      {errors.firstName && touched.firstName ? (
                        <span className="text-danger error-msg">
                          {errors?.firstName}
                        </span>
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
                        onChange={(e) => {
                          setFieldValue("lastName", e.target.value);
                        }}
                      />
                      {errors.lastName && touched.lastName ? (
                        <span className="text-danger error-msg">
                          {errors?.lastName}
                        </span>
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
                        <span className="text-danger error-msg">
                          {errors?.email}
                        </span>
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
                        onChange={(e) => setFieldValue("role", e.value)}
                      />
                      {errors.role && touched.role ? (
                        <span className="text-danger error-msg">
                          {errors?.role}
                        </span>
                      ) : null}
                    </Col>
                  </Row>

                  <Row>
                    <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                      <Button
                        className="me-1 custom-btn"
                        color="primary"
                        type="submit"
                      >
                        Submit
                      </Button>
                      <Link href="/admin/hipstr-member">
                        <Button outline className="custom-btn2" type="button">
                          Cancel
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          ) : (
            <ShimmerAddmember />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
export default AddMember;
