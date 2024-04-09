import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";
import { Field, Formik, Form } from "formik";
import { ArrowLeft } from "react-feather";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Breadcrumbs from "@components/breadcrumbs";
import UploadFile from "@components/UploadFile/UploadFile";
import {
  DISCRIPTION_MAX_LENGTH,
  DISCRIPTION_REQUIRE,
  FILE_TOO_LARGE,
  PDF_ONLY,
  RESOURCE_FILE_REQUIRE,
  TITLE_MAX_LENGTH,
  TITLE_REQUIRE,
} from "@constants/ValidationConstants";
import { mediaAddApiCall } from "@redux/action/MediaAction";
import ShimmerAddVideo from "../Shimmer/ShimmerAdd";

function AddResources({ open, callbackAdd, refresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  /* Initializing the form values. */
  const initialFormValues = {
    title: "",
    description: "",
    media: "",
  };
  const FILE_SIZE = 5000000;
  const SUPPORTED_FORMATS = ["application/pdf"];
  /* A validation schema for the formik form. */
  const addResourceScema = Yup.object({
    title: Yup.string().max(25, TITLE_MAX_LENGTH).required(TITLE_REQUIRE),
    description: Yup.string()
      .max(25, DISCRIPTION_MAX_LENGTH)
      .required(DISCRIPTION_REQUIRE),
    media: Yup.mixed()
      .required(RESOURCE_FILE_REQUIRE)
      .test(
        "fileSize",
        FILE_TOO_LARGE,
        (value) => value && value.size <= FILE_SIZE,
      )
      .test(
        "fileFormat",
        PDF_ONLY,
        (value) => value && SUPPORTED_FORMATS.includes(value.type),
      ),
  });
  const resourcesHandler = (value, setFieldValue) => {
    setFieldValue("media", value[0]);
  };
  /**
   * It takes in a value object, creates a new FormData object, appends the value object to the FormData
   * object, and then dispatches the mediaAddApiCall function with the FormData object and the string
   * "Resources" as arguments
   * @param value - The form values
   */
  const addResourcesHandler = async (value) => {
    setIsLoading(true);
    const data = new FormData();
    data.append("title", value.title);
    data.append("description", value.description);
    data.append("media", value.media);
    data.append("type", "resources");
    const responce = await dispatch(mediaAddApiCall(data, "Resources"));
    if (responce.status === 200) {
      callbackAdd();
      refresh();
    }
    setIsLoading(false);
  };
  return (
    <div className={open ? "d-block" : "d-none"}>
      <div>
        <Breadcrumbs
          title="Add Resources"
          data={[
            { title: "Media" },
            { title: "Resources" },
            { title: "Add Resources" },
          ]}
        />
        <Card className="p-1 bg-white">
          <CardHeader>
            <CardTitle tag="h4" className="back-arrow-h">
              <ArrowLeft
                onClick={callbackAdd}
                className="sy-tx-primary me-50"
                role="button"
              />{" "}
              Add Resources
            </CardTitle>
          </CardHeader>
          <CardBody>
            {!isLoading ? (
              <Formik
                initialValues={initialFormValues}
                validationSchema={addResourceScema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={addResourcesHandler}
              >
                {({ errors, setFieldValue, touched }) => (
                  <Form>
                    <Row className="mb-1">
                      <Col sm="12" className="mb-1">
                        <Label className="form-label" for="title">
                          Title
                        </Label>
                        <Field
                          name="title"
                          id="title"
                          placeholder="Title"
                          className="input-group form-control"
                        />
                        {errors.title && touched.title ? (
                          <span className="text-danger error-msg">
                            {errors?.title}
                          </span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Col sm="12" className="mb-1">
                        <Label className="form-label" for="description">
                          Description
                        </Label>
                        <Field
                          type="textarea"
                          name="description"
                          id="description"
                          placeholder="Description"
                          className="input-group form-control"
                        />
                        {errors.description && touched.description ? (
                          <span className="text-danger error-msg">
                            {errors?.description}
                          </span>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mb-1">
                      <Col sm="12" className="mb-1">
                        <Label className="form-label" for="description">
                          Upload PDF
                        </Label>
                        <UploadFile
                          name="media"
                          setMediaFile={(e) =>
                            resourcesHandler(e, setFieldValue)
                          }
                          acceptedFiles={SUPPORTED_FORMATS}
                          file={null}
                        />
                        {errors.media && touched.media ? (
                          <span className="text-danger error-msg">
                            {errors?.media}
                          </span>
                        ) : null}
                      </Col>
                    </Row>
                    <Button
                      type="submit"
                      className="mb-75 me-75 custom-btn7"
                      color="primary"
                    >
                      Save
                    </Button>

                    <Button
                      className="mb-75 custom-btn9"
                      color="primary"
                      onClick={callbackAdd}
                    >
                      Cancel
                    </Button>
                  </Form>
                )}
              </Formik>
            ) : (
              <ShimmerAddVideo />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
export default AddResources;
