import { useState } from "react";
import { Plus } from "react-feather";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const DescriptionModal = ({ description }) => {
  // ** States
  const [centeredModal, setCenteredModal] = useState(false);
  const toggle = () => setCenteredModal(!centeredModal);
  return (
    <div className="vertically-centered-modal">
      <a class="btn-theme-del" onClick={toggle}>
        <span class="iconify">
          <Plus size={15} className="sy-tx-primary" />
        </span>
      </a>
      <Modal
        isOpen={centeredModal}
        toggle={toggle}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggle}>
          <h2>
            <b>Reason Description</b>
          </h2>
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <p>{description}</p>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default DescriptionModal;
