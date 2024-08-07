import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import { ArrowLeft } from "react-feather";
import Link from "next/link";
import Select from "react-select";
import { Field, Form, Formik } from "formik";
import CustomeUploadImage from "@components/SupportRequest/CustomeUploadImage";

import { useDispatch } from "react-redux";
import { CUSTOMER } from "@constants/CommonConstants";
import { createTicket, eventListAPiCall, requestTypeAPiCall } from "@redux/action/SupportAction";
import * as Yup from "yup";
import {
  EVENT_REQUIRE,
  REQUEST_DESCRIPTION_REQUIRE,
  REQUEST_REQUIRE,
  REQUEST_TITLE_REQUIRE,
} from "@constants/ValidationConstants";
import { TwoUpperCase, convertDate } from "@utils/Utils";
import ShimmerCreateTicket from "@components/ShimmerCustomer/ShimmerCreateTicket";
import autosize from "autosize";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { Accept } from "react-dropzone";
import { AnyAction } from "@reduxjs/toolkit";
import { useRouter } from "next/router";

type RequestOption = {
  label: string;
  value: string;
};

const CreateSupportRequest: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requestOptions, setRequestOptions] = useState<RequestOption[]>([]);
  const [eventOptions, setEventOptions] = useState<RequestOption[]>([]);
  const SUPPORTED_FORMATS: Accept = { ["image/png"]: [".png"], ["image/jpg"]: [".jpg"] };
  const FILE_SIZE = 5000000;

  const getDropdownData = async () => {
    setIsLoading(true);
    const data = {
      type: CUSTOMER,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const requestResponse = await dispatch(requestTypeAPiCall(data) as unknown as AnyAction);
    const eventResponse = await dispatch(
      eventListAPiCall({ sort_field: "id", sort_order: "desc" }) as unknown as AnyAction,
    );
    if (requestResponse.status === 200) {
      const tempArray: RequestOption[] = [];
      requestResponse?.data?.data?.types?.map((e = { name: "", id: "" }) =>
        tempArray.push({ label: e.name, value: e.id }),
      );
      setRequestOptions(tempArray);
    }
    if (eventResponse.status === 200) {
      const tempData: RequestOption[] = [];
      eventResponse?.data?.data?.events?.map(
        (e = { event_date: "", event_number: "", city: "", state: { name: "" }, id: "" }) =>
          /*eslint-disable-next-line */
          tempData.push({
            label: `${convertDate(
              e?.event_date,
              2,
            )} - #${e?.event_number} - ${e?.city}, ${TwoUpperCase(e?.state?.name)}`,
            value: e?.id,
          }),
      );
      setEventOptions(tempData);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getDropdownData();
  }, []);
  const initialFormValues = {
    event_id: "",
    type_id: "",
    title: "",
    description: "",
    images: [],
  };
  const validationSchema = Yup.object({
    event_id: Yup.string().required(EVENT_REQUIRE),
    type_id: Yup.string().required(REQUEST_REQUIRE),
    title: Yup.string().required(REQUEST_TITLE_REQUIRE),
    description: Yup.string().required(REQUEST_DESCRIPTION_REQUIRE),
    images: Yup.mixed(),
  });
  const createRequest = async (values = initialFormValues) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("ticket_type", CUSTOMER);
    formData.append("type_id", values.type_id);
    formData.append("event_id", values.event_id);
    formData.append("title", values.title);
    formData.append("description", values.description);
    /*eslint-disable-next-line */
    values.images.length !== 0 &&
      values.images.map((ele: File) => formData.append("images[]", ele));
    dispatch(createTicket(formData, router) as unknown as AnyAction);
    setIsLoading(false);
  };
  useEffect(() => {
    autosize(document.querySelectorAll("textarea"));
  }, [document.querySelectorAll("textarea")]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Create Support Request</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs
          title="Support Request"
          data={[
            {
              title: "Support Request",
              link: "/customer/support-request-listing",
            },
            { title: "Create Support Request" },
          ]}
        />
        <Card className="bg-white">
          <CardHeader>
            <CardTitle tag="h4">
              <Link href="/customer/support-request-listing" className="sy-tx-primary">
                <ArrowLeft />
              </Link>{" "}
              Create Request
            </CardTitle>
          </CardHeader>
          {!isLoading ? (
            <CardBody>
              <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={createRequest}
              >
                {({ errors, setFieldValue, touched }) => (
                  <Form>
                    <Row>
                      <Col sm={6}>
                        <Label className="form-label cu-label" for="firstName">
                          Event
                        </Label>
                        <Select
                          id="request"
                          name="event_id"
                          className="react-select"
                          classNamePrefix="select"
                          options={eventOptions}
                          onChange={(e) => setFieldValue("event_id", e?.value)}
                        />
                        {errors.event_id && touched.event_id ? (
                          <span className="text-danger error-msg">{errors?.event_id}</span>
                        ) : null}
                      </Col>
                      <Col sm={6}>
                        <Label className="form-label cu-label" for="firstName">
                          Support Request Category
                        </Label>
                        <Select
                          id="request"
                          name="type_id"
                          className="react-select"
                          classNamePrefix="select"
                          options={requestOptions}
                          onChange={(e) => setFieldValue("type_id", e?.value)}
                        />
                        {errors.type_id && touched.type_id ? (
                          <span className="text-danger error-msg">{errors?.type_id}</span>
                        ) : null}
                      </Col>
                      <Col sm={12} className="mt-sm-2">
                        <Label className="form-label cu-label" for="firstName">
                          Support Request Title
                        </Label>
                        <Field
                          id="title"
                          name="title"
                          className="input-group form-control"
                          placeholder="Enter"
                        />
                        {errors.title && touched.title ? (
                          <span className="text-danger error-msg">{errors?.title}</span>
                        ) : null}
                      </Col>
                      <Col sm={12} className="mt-sm-2">
                        <Label className="form-label cu-label" for="firstName">
                          Support Request Description
                        </Label>
                        <div className="support-img-select">
                          <Input
                            id="description"
                            name="description"
                            type="textarea"
                            rows="10"
                            className="input-group form-control support-description"
                            placeholder="Write description "
                            onChange={(e) => setFieldValue("description", e.target.value)}
                          />

                          <div className=" mt-75 mx-1 mb-1">
                            <div>
                              <CustomeUploadImage
                                acceptedFiles={SUPPORTED_FORMATS}
                                fileSize={FILE_SIZE}
                                setMediaFile={(e) => setFieldValue("images", e)}
                              />
                            </div>
                          </div>
                        </div>
                        {errors.images && touched.images ? (
                          <span className="text-danger error-msg">{errors?.images}</span>
                        ) : null}
                        {errors.description && touched.description ? (
                          <span className="text-danger error-msg">{errors?.description}</span>
                        ) : null}
                      </Col>
                    </Row>

                    <div className="mt-3">
                      <Button className="custom-btn12 me-75 mb-75" color="primary" type="submit">
                        Submit Request
                      </Button>
                      <Link href="/customer/support-request-listing">
                        <Button type="reset" className="custom-btn9  mb-75">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          ) : (
            <ShimmerCreateTicket />
          )}
        </Card>
      </div>
    </>
  );
};

CreateSupportRequest.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default CreateSupportRequest;
