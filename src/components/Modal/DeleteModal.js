import { useState } from "react";
import { Trash } from "react-feather";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  BLOG,
  FAQ,
  MEMBER,
  PARTNER,
  RESOURCES,
  ROLE,
  VIDEO,
} from "@constants/CommonConstants";
import { blogDeleteApiCall } from "@redux/action/BlogAction";
import { mediaDeleteByIdApiCall } from "@redux/action/MediaAction";
import { deleteMemberApiCall } from "@redux/action/MemberListingAction";
import { roleDeleteByIdApiCall } from "@redux/action/RoleAction";
import { partnerDeleteByIdApiCall } from "@redux/action/PartnerAction";

const DeleteModal = ({ description, id, code, refresh }) => {
  // ** States
  const [centeredModal, setCenteredModal] = useState(false);
  const dispatch = useDispatch();
  const toggle = () => setCenteredModal(!centeredModal);

  //delete function with switch cases
  const deleteHandler = async (id) => {
    switch (code) {
      case ROLE:
        await dispatch(roleDeleteByIdApiCall(id));
        toggle();
        refresh();
        break;
      case MEMBER:
        await dispatch(deleteMemberApiCall(id));
        toggle();
        refresh();
        break;
      case PARTNER:
        await dispatch(partnerDeleteByIdApiCall(id));
        toggle();
        refresh();
        break;
      case VIDEO:
        await dispatch(mediaDeleteByIdApiCall(id));
        toggle();
        refresh();
        break;
      case RESOURCES:
        await dispatch(mediaDeleteByIdApiCall(id));
        toggle();
        refresh();
        break;
      case FAQ:
        await dispatch(mediaDeleteByIdApiCall(id));
        toggle();
        refresh();
        break;
      case BLOG:
        await dispatch(blogDeleteApiCall(id));
        toggle();
        refresh();
      default:
        break;
    }
  };

  return (
    <div className="vertically-centered-modal">
      <a class="btn-theme-del" onClick={toggle}>
        <span class="iconify">
          <Trash />
        </span>
      </a>
      <Modal
        isOpen={centeredModal}
        toggle={toggle}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={toggle}>
          <h2>
            <b>Delete {code}</b>
          </h2>
        </ModalHeader>
        <ModalBody className="bg-white">
          <div className="text-center">
            <h3>Confirm to Delete</h3>
            <br />
            <p>
              Are you sure you want to delete {description} as a {code} ?
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="bg-white">
          <div class="text-center mt-2 col-12">
            <Button
              type="submit"
              class="me-1 btn btn-primary"
              className="custom-btn7"
              onClick={() => {
                deleteHandler(id);
              }}
            >
              Yes
            </Button>
            <Button
              // type="reset"
              class="btn btn-outline-secondary"
              className="custom-btn9 mx-1"
              onClick={() => toggle()}
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
