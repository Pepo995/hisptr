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
import Breadcrumbs from "@components/breadcrumbs";
import { ArrowLeft } from "react-feather";
import UploadFile from "@components/UploadFile/UploadFile";
import { useDispatch } from "react-redux";
import {
  mediaGetByIdApiCall,
  mediaUpdateApiCall,
} from "@redux/action/MediaAction";
import * as Yup from "yup";
import {
  DESCRIPTION_REQUIRED,
  TITLE_REQUIRE,
  VIDEO_ONLY,
  VIDEO_REQUIRE,
  VIDEO_TOO_LARGE,
} from "@constants/ValidationConstants";
import ShimmerAddVideo from "@components/Shimmer/ShimmerAdd";

function EditVideo({ open, callbackEdit, id, refresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const dispatch = useDispatch();
  const ID = id;
  //formik initial values
  const initialFormValues = {
    title: videoData?.title,
    description: videoData?.description,
    media: "",
  };
  const FILE_SIZE = 30000000;
  const SUPPORTED_FORMATS = ["video/mp4", "video/x-m4v", "video/*"];
  /* A validation schema for formik. */
  const validationSchema = Yup.object({
    title: Yup.string().required(TITLE_REQUIRE),
    description: Yup.string().required(DESCRIPTION_REQUIRED),
    media:
      videoUrl === null &&
      Yup.mixed()
        .required(VIDEO_REQUIRE)
        .test(
          "fileSize",
          VIDEO_TOO_LARGE,
          (value) => value && value.size <= FILE_SIZE,
        )
        .test(
          "fileFormat",
          VIDEO_ONLY,
          (value) => value && SUPPORTED_FORMATS.includes(value.type),
        ),
  });
  /**
   * A function that is called when the component is mounted. It makes an API call to get the details of
   * the video.
   */
  const getDetails = async () => {
    setIsLoading(true);
    const data = {
      id: ID,
      type: "video",
    };
    const responce = await dispatch(mediaGetByIdApiCall(data));
    setVideoData(responce.data.data.content);
    setVideoUrl(responce.data.data.content.media);
    setIsLoading(false);
  };
  /* A react hook that is called when the component is mounted. It makes an API call to get the details
  of the video. */
  useEffect(() => {
    getDetails();
  }, []);

  //on select video set field value
  const videoHandler = (e, setFieldValue) => {
    setFieldValue("media", e[0]);
  };
  /**
   * It takes the values from the form, creates a new FormData object, appends the values to the FormData
   * object, and then sends the FormData object to the API
   * @param values - The values of the form.
   */
  const editVideoHandler = async (values) => {
    setIsLoading(true);
    const data = new FormData();
    data.append("title", values.title);
    data.append("description", values.description);
    /*eslint-disable-next-line */
    values.media !== "" && data.append("media", values.media);
    data.append("type", "video");
    data.append("id", ID);
    const responce = await dispatch(mediaUpdateApiCall(data, "Video"));
    if (responce.status === 200) {
      callbackEdit();
      refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className={open ? "d-block" : "d-none"}>
      <div>
        <Breadcrumbs
          title="Edit Video"
          data={[
            { title: "Media" },
            { title: "Video" },
            { title: "Edit Video" },
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
              Edit Video
            </CardTitle>
          </CardHeader>
          <CardBody>
            {!isLoading ? (
              <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={editVideoHandler}
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
                          Upload Video
                        </Label>
                        <UploadFile
                          name="media"
                          setMediaFile={(e) => videoHandler(e, setFieldValue)}
                          acceptedFiles={SUPPORTED_FORMATS}
                          file={videoUrl}
                          setData={setVideoUrl}
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
      </div>
    </div>
  );
}
export default EditVideo;
