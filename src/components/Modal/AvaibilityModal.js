/*eslint-disable */
import { useState } from "react";
import * as Yup from "yup";

const reason = [
  { label: "Unavailable staff", value: "unavailable_staff" },
  { label: "Out of service area", value: "out_of_service_area" },
  { label: "Unavailable equipment", value: "unavailable_equipment" },
  { label: "Other", value: "other" },
];
import { Badge, Button, Input, Label, Modal, ModalBody } from "reactstrap";
import Select from "react-select";
import { Form, Formik } from "formik";
import {
  REASON_REQUIRE,
  REASON_TYPE_REQUIRE,
} from "@constants/ValidationConstants";
import { useDispatch } from "react-redux";
import { AvailabilityStatusUpdateAPICall } from "@redux/action/AvailabilityAction";
import AvailabilityModalShimmer from "@components/ShimmerPartner/AvailabilityModalShimmer";
const AvailabilityModal = ({
  id,
  refresh,
  centeredModal,
  setCenteredModal,
}) => {
  // const [centeredModal, setCenteredModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  // const [reasonOther, setReasonOther] = useState(false)
  // const [reasonText, setReasonText] = useState('')
  const dispatch = useDispatch();
  const initialFormValues = {
    reason_type: "",
    reason: "",
  };
  const validationSchema = Yup.object({
    reason_type: Yup.string().required(REASON_TYPE_REQUIRE),
    // reason: Yup.string().required(REASON_REQUIRE)

    reason: Yup.string().when("reason_type", {
      is: "other",
      then: () => Yup.string().required(REASON_REQUIRE),
    }),
  });
  const UpdateStatus = async (values) => {
    // if (reasonOther && reasonText.length === 0) {
    //     return
    // }
    setIsLoading(true);
    const data = {
      ...values,
      availability_id: id,
      status: "unavailable",
    };
    const response = await dispatch(AvailabilityStatusUpdateAPICall(data));
    if (response?.status === 200) {
      refresh();
      setCenteredModal(!centeredModal);
    }
    setIsLoading(false);
  };
  return (
    <>
      {/* <div className="vertically-centered-modal">
                <Badge pill color="light-danger" className="me-1" outline onClick={() => setCenteredModal(!centeredModal)}>
                    Unavailable
                </Badge> */}
      <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        className="modal-dialog-centered"
      >
        {/* <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Please select Unavailable reason</ModalHeader> */}
        <h3 className="mx-2 mt-1">Please select Unavailable reason</h3>
        {!isLoading ? (
          <ModalBody>
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              validateOnBlur={true}
              validateOnChange={true}
              onSubmit={UpdateStatus}
            >
              {({ setFieldValue, errors, touched, values }) => (
                <Form>
                  <Label className="form-label" for="country">
                    Select the reason
                  </Label>
                  <Select
                    id="reason_type"
                    name="reason_type"
                    placeholder="Select reason type"
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={reason}
                    onChange={(e) => setFieldValue("reason_type", e.value)}
                  />
                  {errors.reason_type && touched.reason_type ? (
                    <span className="text-danger error-msg">
                      {errors.reason_type}
                    </span>
                  ) : null}
                  {values?.reason_type === "other" && (
                    <div className="mt-1">
                      <Label className="form-label  mb-75" for="email">
                        Enter your reason
                      </Label>
                      <Input
                        id="reason"
                        name="reason"
                        type="textarea"
                        rows="5"
                        className="input-group form-control support-description"
                        placeholder="Enter "
                        onChange={(e) => {
                          setFieldValue("reason", e.target.value);
                          // setReasonText(e.target.value)
                          // if (e.target.value === 'other') {
                          //     setReasonOther(true)
                          // } else {
                          //     setReasonOther(false)
                          // }
                        }}
                      />

                      {errors.reason && touched.reason ? (
                        <span className="text-danger error-msg">
                          {errors.reason}
                        </span>
                      ) : null}
                    </div>
                  )}
                  <div className="mt-2">
                    <Button
                      color="primary"
                      type="submit"
                      className="custom-btn7 me-75 mb-75"
                    >
                      Submit
                    </Button>{" "}
                    <Button
                      color="primary"
                      onClick={() => setCenteredModal(!centeredModal)}
                      className="custom-btn9 me-75 mb-75"
                    >
                      Cancel
                    </Button>{" "}
                  </div>
                </Form>
              )}
            </Formik>
          </ModalBody>
        ) : (
          <AvailabilityModalShimmer />
        )}
      </Modal>
      {/* </div> */}
    </>
  );
};
export default AvailabilityModal;
