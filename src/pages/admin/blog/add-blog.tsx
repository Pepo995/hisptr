import React, { type ReactElement, useState } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import { Field, Form, Formik } from "formik";
import MainImgUpload from "@components/Blog/MainImgUpload";
import {
  AUTHOR_MAX_LENGTH,
  AUTHOR_REQUIRE,
  CONTENT_REQUIRE,
  IMAGE_ONLY,
  IMAGE_TOO_LARGE_TEN,
  MAIN_IMAGE_REQUIRE,
  TITLE_MAX_LENGTH,
  TITLE_REQUIRE,
} from "@constants/ValidationConstants";

import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { blogAddApiCall } from "@redux/action/BlogAction";
import ShimmerAddBlog from "@components/Shimmer/ShimmerAddBlog";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";

const AddBlog: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  /* The initial values of the form. */
  const initialFormValues = {
    title: "",
    auther_name: "",
    content: "",
    main_image: "",
  };
  const FILE_SIZE = 10000000;
  const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

  /* A validation schema for the formik form. */
  const validationSchema = Yup.object({
    title: Yup.string().max(25, TITLE_MAX_LENGTH).required(TITLE_REQUIRE),
    auther_name: Yup.string().max(25, AUTHOR_MAX_LENGTH).required(AUTHOR_REQUIRE),
    content: Yup.string().required(CONTENT_REQUIRE),
    main_image: Yup.mixed()
      .required(MAIN_IMAGE_REQUIRE)
      .test("fileSize", IMAGE_TOO_LARGE_TEN, (value) => value && value.size <= FILE_SIZE)
      .test("fileFormat", IMAGE_ONLY, (value) => value && SUPPORTED_FORMATS.includes(value.type)),
  });

  /**
   * It takes the values from the form, creates a new FormData object, appends the values to the formData
   * object, and then dispatches the blogAddApiCall action
   * @param values - The values of the form.
   */
  const createBlog = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("auther_name", values.auther_name);
    formData.append("content", values.content);
    formData.append("main_image", values.main_image);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(blogAddApiCall(formData, router) as unknown as AnyAction);
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Hipstr - Add Blogs</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Blogs"
          data={[{ title: "Blog List", link: "/admin/blog" }, { title: "Add Blog" }]}
        />

        <Card className="bg-white">
          {!isLoading ? (
            <CardBody>
              <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={createBlog}
              >
                {({ errors, setFieldValue, touched, values }) => (
                  <Form>
                    <Row>
                      <Col sm={6}>
                        <Label className="form-label " for="title">
                          Title
                        </Label>
                        <Field
                          id="title"
                          name="title"
                          className="input-group form-control"
                          placeholder="Enter title"
                        />
                        {errors.title && touched.title ? (
                          <span className="text-danger error-msg">{errors?.title}</span>
                        ) : null}
                      </Col>
                      <Col sm={6}>
                        <Label className="form-label " for="firstName">
                          Author name
                        </Label>
                        <Field
                          id="name"
                          name="auther_name"
                          className="input-group form-control"
                          placeholder="Enter"
                        />
                        {errors.auther_name && touched.auther_name ? (
                          <span className="text-danger error-msg">{errors?.auther_name}</span>
                        ) : null}
                      </Col>

                      <Col sm={12} className="mt-sm-2">
                        <Label className="form-label " for="firstName">
                          Content
                        </Label>
                        {/* <CustomeEditer
                          name="content"
                          setContent={(e) => setFieldValue("content", e)}
                        /> */}
                        {errors.content && touched.content ? (
                          <span className="text-danger error-msg">{errors?.content}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <div className="img-upload mt-sm-2 mt-1">
                      <MainImgUpload
                        name="main_image"
                        setImage={(e) => setFieldValue("main_image", e)}
                        accept={SUPPORTED_FORMATS}
                        // title={"Main image"}
                      />
                      {(errors.main_image && values.main_image) ||
                      (errors.main_image && touched.main_image) ? (
                        <span className="text-danger error-msg">{errors?.main_image}</span>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      <Button className="custom-btn7 me-75 mb-75" type="submit">
                        Upload
                      </Button>
                      <Link href="/admin/blog">
                        <Button className="custom-btn9  mb-75">Cancel</Button>
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          ) : (
            <ShimmerAddBlog />
          )}
        </Card>
      </div>
    </>
  );
};

AddBlog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AddBlog;
