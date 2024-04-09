import { useState } from "react";
import ReactPlayer from "react-player";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
const VideoModal = ({ url, setIsOpen, open }) => {
  const [centeredModal, setCenteredModal] = useState(false);
  const toggle = () => {
    /*eslint-disable-next-line */
    setCenteredModal(!centeredModal), setIsOpen(false);
  };

  return (
    <div className="vertically-centered-modal">
      <Modal
        size="lg"
        isOpen={open}
        toggle={toggle}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggle}>
          <h2>
            <b>Watch video</b>
          </h2>
        </ModalHeader>
        <ModalBody>
          <div className="text-center ">
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              className="modal-w-h"
              playing={false}
              controls={true}
              playIcon
            />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default VideoModal;
