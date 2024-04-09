import { useState } from "react";
import { Trash } from "react-feather";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { DeletePartnerUserApiCall } from "@redux/action/PartnerAction";

const DeleteModal = ({ description, id, type, refresh }) => {
  const [centeredModal, setCenteredModal] = useState(false);
  const toggle_btn = () => setCenteredModal(!centeredModal);
  const dispatch = useDispatch();

  /**
   * It takes an id and a type, and then calls the DeletePartnerUserApiCall function, which is an async
   * function that makes an API call to delete the partner
   * @param id - The id of the partner you want to delete
   */
  const deletePartner = async (id) => {
    await dispatch(DeletePartnerUserApiCall(id, type));
    setCenteredModal(!centeredModal);
    refresh();
  };
  return (
    <div className="vertically-centered-modal">
      <a class="btn-theme-del" onClick={toggle_btn}>
        <span class="iconify">
          <Trash />
        </span>
      </a>
      <Modal
        isOpen={centeredModal}
        toggle={toggle_btn}
        className="modal-dialog-centered"
      >
        {/* <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
                    <h2>
                        <b>Confirm Employee Deletion</b>
                    </h2>
                </ModalHeader> */}
        <ModalBody>
          <div className="text-center">
            <h3>Confirm Employee Deletion</h3>
            <br />
            <p>
              Are you sure you want to delete {description} as an employee ?
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <div class="text-center mt-2 col-12">
            <Button
              type="submit"
              class="me-1 btn btn-primary"
              className="custom-btn4"
              onClick={() => deletePartner(id)}
            >
              Yes
            </Button>
            <Button
              type="reset"
              class="btn btn-outline-secondary"
              className="custom-btn3 mx-1"
              onClick={() => toggle_btn()}
            >
              No
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default DeleteModal;
