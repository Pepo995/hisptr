import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Label, Row } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import { Field, Form, Formik } from "formik";
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

import { blogGetByIdApiCall, blogUpdateApiCall } from "@redux/action/BlogAction";
import { useDispatch } from "react-redux";
import MainImgUpload from "@components/Blog/MainImgUpload";
import ShimmerAddBlog from "@components/Shimmer/ShimmerAddBlog";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import Link from "next/link";

const EditBlog: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);

  /* Setting the initial value of the form. */
  const initialFormValues = {
    title: response?.title,
    auther_name: response?.auther_name,
    content: response?.content,
    main_image: "",
  };
  const FILE_SIZE = 10000000;
  const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];
  /* A validation schema for the formik form. */
  const validationSchema = Yup.object({
    title: Yup.string().max(25, TITLE_MAX_LENGTH).required(TITLE_REQUIRE),
    auther_name: Yup.string().max(25, AUTHOR_MAX_LENGTH).required(AUTHOR_REQUIRE),
    content: Yup.string().required(CONTENT_REQUIRE),
    main_image:
      imageData !== null &&
      Yup.mixed()
        .required(MAIN_IMAGE_REQUIRE)
        .test("fileSize", IMAGE_TOO_LARGE_TEN, (value) => value && value.size <= FILE_SIZE)
        .test("fileFormat", IMAGE_ONLY, (value) => value && SUPPORTED_FORMATS.includes(value.type)),
  });

  /**
   * It takes the values from the form, creates a new FormData object, appends the values to the formData
   * object, and then calls the blogUpdateApiCall action creator with the formData object as an argument
   * @param values - The values of the form.
   */
  const updateBlog = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", router.query.id);
    formData.append("title", values.title);
    formData.append("auther_name", values.auther_name);
    formData.append("content", values.content);
    /*eslint-disable-next-line */
    imageData !== null && formData.append("main_image", values.main_image);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(blogUpdateApiCall(formData, router) as unknown as AnyAction);
    setIsLoading(false);
  };
  /**
   * It's a function that gets the blog details by id and sets the response to the blog details
   * @param id - The id of the blog you want to fetch.
   */
  const getBlogDetails = async (id) => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(blogGetByIdApiCall(id) as unknown as AnyAction);
    setResponse(res?.data?.data?.blog);
    setIsLoading(false);
  };
  /* It's a react hook that runs when the component mounts. It checks if the location state is undefined,
  if it is, it redirects to the blog page, if not, it calls the getBlogDetails function with the id of
  the blog. */
  useEffect(() => {
    if (router.query === undefined) {
      router.replace("/blog");
    } else {
      getBlogDetails(router.query.id);
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Hipstr - Edit Blog</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Blogs"
          data={[{ title: "Blog List", link: "/admin/blog" }, { title: "Edit Blog" }]}
        />

        <Card className="bg-white">
          {!isLoading ? (
            <CardBody>
              <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={updateBlog}
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
                          defaultValue={values.content}
                        /> */}
                        {(errors.content && values.content) ||
                        (errors.content && touched.content) ? (
                          <span className="text-danger error-msg">{errors?.content}</span>
                        ) : null}
                      </Col>
                    </Row>
                    <div className="img-upload mt-sm-2 mt-1">
                      <MainImgUpload
                        name="main_image"
                        setImage={(e) => {
                          /*eslint-disable-next-line */
                          setFieldValue("main_image", e), setImageData(e);
                        }}
                        accept={SUPPORTED_FORMATS}
                        url={response?.main_image}
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

EditBlog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditBlog;
