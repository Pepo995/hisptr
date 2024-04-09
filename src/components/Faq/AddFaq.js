import { useState } from "react";
import { ArrowLeft } from "react-feather";
import Breadcrumbs from "@components/breadcrumbs";
import { addFaq } from "@redux/action/FaqsActions";
import { Field, Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Label,
} from "reactstrap";
import ShimmerAddFaq from "@components/Shimmer/ShimmerAddfaq";
import {
  ANSWER_REQUIRE,
  QUESTION_REQUITED,
} from "@constants/ValidationConstants";

function AddFaq({ open, callbackAdd, refresh }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  /* Set the initial values of the form. */
  const initialFormValues = {
    question: "",
    answer: "",
  };
  /* Validating the form. */
  const inviteValidationSchema = Yup.object({
    question: Yup.string().required(QUESTION_REQUITED),
    answer: Yup.string().required(ANSWER_REQUIRE),
  });

  /**
   * It takes in a value object, sets the loading state to true, creates a data object, dispatches the
   * addFaq action, and if the response status is 200, it calls the callbackAdd function and refreshes
   * the page
   * @param value - The value of the form
   */
  const createFaq = async (value) => {
    setIsLoading(true);
    const data = {
      title: value.question,
      description: value.answer,
      type: "faq",
    };
    const res = await dispatch(addFaq(data));
    if (res.status === 200) {
      callbackAdd();
      refresh();
    }
    setupdate(true);
    setIsLoading(false);
  };
  return (
    <div className={open ? "d-block" : "d-none"}>
      <Breadcrumbs
        title="Add FAQ"
        data={[{ title: "Media" }, { title: "Video" }, { title: "Add FAQ" }]}
      />
      <div className="margin-top">
        <Card className="bg-white">
          <CardHeader>
            <h4 className="card-title">
              <ArrowLeft
                onClick={callbackAdd}
                className="sy-tx-primary me-50"
                role="button"
              />
              FAQ
            </h4>
          </CardHeader>

          <CardBody>
            {!isLoading ? (
              <Formik
                initialValues={initialFormValues}
                validationSchema={inviteValidationSchema}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={createFaq}
              >
                {({ errors, touched, setFieldValue }) => (
                  <Form>
                    <Row className="justify-content-between align-items-center">
                      <Col md={10} className=" mb-2">
                        <Label className="form-label">Questions</Label>
                        <Field
                          type="text"
                          name="question"
                          className="input-group form-control"
                          placeholder="Enter your question"
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
                        <Label className="form-label">Answer</Label>
                        <Field
                          type="textarea"
                          className="input-group form-control"
                          name="answer"
                          placeholder="Enter answer here"
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
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            ) : (
              <ShimmerAddFaq />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
export default AddFaq;
