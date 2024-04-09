import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

type ConfirmationModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
};

const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
}: ConfirmationModalProps) => (
  <div className="vertically-centered-modal">
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)}>
        <h2>{title}</h2>
      </ModalHeader>
      <ModalBody className="bg-white">
        <h3 className="text-center">{description}</h3>
      </ModalBody>
      <ModalFooter className="bg-white">
        <div className="text-center mt-2 col-12">
          <button
            type="button"
            className="custom-btn7"
            onClick={() => {
              setIsOpen(false);
              onConfirm();
            }}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="custom-btn9 mx-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {cancelText}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  </div>
);

export default ConfirmationModal;
