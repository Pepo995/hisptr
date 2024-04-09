import { useEffect, useState } from "react";
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
import UploadFile from "../UploadFile/UploadFile";
import {
  DISCRIPTION_MAX_LENGTH,
  DISCRIPTION_REQUIRE,
  FILE_TOO_LARGE,
  PDF_ONLY,
  RESOURCE_FILE_REQUIRE,
  TITLE_MAX_LENGTH,
  TITLE_REQUIRE,
} from "@constants/ValidationConstants";
import {
  mediaGetByIdApiCall,
  mediaUpdateApiCall,
} from "@redux/action/MediaAction";
import ShimmerAddVideo from "../Shimmer/ShimmerAdd";

function EditResources({ open, callbackEdit, id, refresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [resourceData, setResourceData] = useState(null);
  const [resourceUrl, setResourceUrl] = useState(null);
  const dispatch = useDispatch();
  /* Initializing the form values. */
  const initialFormValues = {
    title: resourceData?.title,
    description: resourceData?.description,
    media: "",
  };
  const FILE_SIZE = 5000000;
  const SUPPORTED_FORMATS = ["application/pdf"];
  /* This is a validation schema for the formik form. */
  const editResourceScema = Yup.object({
    title: Yup.string().max(25, TITLE_MAX_LENGTH).required(TITLE_REQUIRE),
    description: Yup.string()
      .max(25, DISCRIPTION_MAX_LENGTH)
      .required(DISCRIPTION_REQUIRE),
    media:
      resourceUrl === null &&
      Yup.mixed()
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
   * It takes in a value object, creates a new FormData object, appends the id, title, description, type,
   * and media to the FormData object, and then calls the mediaUpdateApiCall function with the FormData
   * object and the string "Resource" as arguments
   * @param value - The form values
   */
  const editResourcesHandler = async (value) => {
    const data = new FormData();
    data.append("id", id);
    data.append("title", value.title);
    data.append("description", value.description);
    data.append("type", "resources");
    /*eslint-disable-next-line */
    value?.media !== "" && data.append("media", value?.media);
    const responce = await dispatch(mediaUpdateApiCall(data, "Resource"));
    if (responce.status === 200) {
      callbackEdit();
      refresh();
    }
  };
  /**
   * It's a function that makes an API call to the backend to get the data of a resource by its id
   */
  const preFillData = async () => {
    setIsLoading(true);
    const response = await dispatch(
      mediaGetByIdApiCall({ id, type: "resources" }),
    );
    if (response.status === 200) {
      setResourceData(response.data.data.content);
      setResourceUrl(response.data.data.content.media);
    }
    setIsLoading(false);
  };

  /* It's a react hook that is called when the component is mounted. */
  useEffect(() => {
    if (id) preFillData();
  }, [id]);

  return (
    <>
      <div className={open ? "d-block" : "d-none"}>
        <divs>
          <Breadcrumbs
            title="Edit Resources"
            data={[
              { title: "Media" },
              { title: "Resources" },
              { title: "Edit Resources" },
            ]}
          />
          <Card className="p-1 bg-white">
            <CardHeader>
              <CardTitle tag="h4" className="back-arrow-h">
                <ArrowLeft
                  onClick={callbackEdit}
                  className="sy-tx-primary me-50"
                  role="button"
                />{" "}
                Edit Resources
              </CardTitle>
            </CardHeader>
            <CardBody>
              {!isLoading ? (
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={editResourceScema}
                  validateOnBlur={true}
                  validateOnChange={true}
                  onSubmit={editResourcesHandler}
                >
                  {({ errors, setFieldValue, touched, values }) => (
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
                            file={resourceUrl}
                            setData={setResourceUrl}
                          />

                          {errors.media || values.media ? (
                            <span className="text-danger error-msg">
                              {errors?.media}
                            </span>
                          ) : null}
                        </Col>
                      </Row>
                      <Button
                        type="submit"
                        className="mb-75 me-75  custom-btn7"
                        color="primary"
                      >
                        Save
                      </Button>

                      <Button
                        className="mb-75 custom-btn9"
                        color="primary"
                        onClick={callbackEdit}
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
        </divs>
      </div>
    </>
  );
}
export default EditResources;
