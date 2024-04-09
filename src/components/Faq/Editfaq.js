import { useState, useEffect } from "react";
import Repeater from "@components/repeater";
import Breadcrumbs from "@components/breadcrumbs";
import { ArrowLeft } from "react-feather";
import { Field, Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { faqGet, editFaqApiCall } from "@redux/action/FaqsActions";
import * as Yup from "yup";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Label,
  Button,
} from "reactstrap";
import ShimmerAddFaq from "@components/Shimmer/ShimmerAddfaq";
import {
  ANSWER_REQUIRE,
  QUESTION_REQUITED,
} from "@constants/ValidationConstants";

const EditFaq = ({ open, callbackEdit, id, refresh }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const count = 1;
  const [question, setquestion] = useState();
  const [answer, setanswer] = useState();
  /**
   * We're using the `faqGet` action to get the data from the API
   */
  const getData = async () => {
    setIsLoading(true);
    const data = {
      type: "faq",
      /*eslint-disable-next-line */
      id: id,
    };
    const res = await dispatch(faqGet(data));
    setquestion(res.data.data.content.title);
    setanswer(res.data.data.content.description);
    setIsLoading(false);
  };

  /* This is a React Hook that is used to run a function when the component is mounted. */
  useEffect(() => {
    getData();
  }, []);

  /**
   * It takes in the values from the form and sends a request to the backend to edit the data
   * @param values - The values of the form
   */
  const editData = async (values) => {
    const data = {
      /*eslint-disable-next-line */
      id: id,
      title: values.question,
      description: values.answer,
      type: "faq",
    };
    const res = await dispatch(editFaqApiCall(data));
    if (res.status === 200) {
      callbackEdit();
      refresh();
    }
  };
  /* It's set the initial values of the form. */
  const initialFormValues = {
    /*eslint-disable-next-line */
    question: question,
    /*eslint-disable-next-line */
    answer: answer,
  };

  /* It's a validation schema for the form. */
  const inviteValidationSchema = Yup.object({
    question: Yup.string().required(QUESTION_REQUITED),
    answer: Yup.string().required(ANSWER_REQUIRE),
  });

  return (
    <>
      <div className={open ? "d-block" : "d-none"}>
        <Breadcrumbs
          title="Edit FAQ"
          data={[{ title: "Media" }, { title: "Video" }, { title: "Edit FAQ" }]}
        />
        <div className="margin-top">
          <Card className="bg-white">
            <CardHeader className="back-arrow-h">
              <h4 className="card-title">
                <ArrowLeft
                  onClick={callbackEdit}
                  className="sy-tx-primary me-50"
                  role="button"
                />{" "}
                Edit FAQ
              </h4>
            </CardHeader>
            {!isLoading ? (
              <CardBody>
                <Repeater count={count}>
                  {(i) => (
                    <Formik
                      initialValues={initialFormValues}
                      validationSchema={inviteValidationSchema}
                      validateOnBlur={true}
                      validateOnChange={true}
                      onSubmit={editData}
                    >
                      {({ errors, touched, setFieldValue }) => (
                        <Form key={i}>
                          <Row className="justify-content-between align-items-center">
                            <Col md={10} className=" mb-2">
                              <Label
                                className="form-label"
                                for={`item-name-${i}`}
                              >
                                Questions
                              </Label>
                              <Field
                                type="text"
                                name="question"
                                className="input-group form-control"
                                onChange={(e) => {
                                  setFieldValue("question", e.target.value);
                                }}
                              />
                              {errors.question && touched.question ? (
                                <span className="text-danger error-msg">
                                  {errors?.question}
                                </span>
                              ) : null}
                            </Col>

                            <Col md={10} className=" mb-2">
                              <Label className="form-label" for={`cost-${i}`}>
                                Answer
                              </Label>
                              <Field
                                type="textarea"
                                name="answer"
                                className="input-group form-control"
                                onChange={(e) => {
                                  setFieldValue("answer", e.target.value);
                                }}
                              />
                              {errors.answer && touched.answer ? (
                                <span className="text-danger error-msg">
                                  {errors?.answer}
                                </span>
                              ) : null}
                            </Col>

                            <Col sm={12}>
                              <hr />
                            </Col>
                          </Row>
                          <Button className="custom-btn3 mb-50" type="submit">
                            Save
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  )}
                </Repeater>
              </CardBody>
            ) : (
              <ShimmerAddFaq />
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditFaq;
