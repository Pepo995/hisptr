import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import Avatar from "@components/avatar";
import avatarPlaceholder from "@images/avatar-placeholder.png";
import { Camera, FileText, Menu, MessageSquare, Send } from "react-feather";
import Chat from "./Chat";

const SidebarRight = ({
  selectedUserChat,
  setSelectUserChat,
  handleSidebar,
}) => {
  const [msg, setMsg] = useState("");

  const handleSendMsg = (e) => {
    e.preventDefault();
    const addUpdatedUserChat = {
      message: msg,
      time: Date.now(),
      senderId: 11,
    };
    setSelectUserChat([
      {
        ...selectedUserChat[0],
        chat: {
          chat: [...selectedUserChat[0].chat.chat, addUpdatedUserChat],
        },
      },
    ]);

    setMsg("");
  };

  return (
    <Col className="bg-white p-0">
      {Object.keys(selectedUserChat).length ? (
        <>
          <Row className="align-items-center my-75">
            <Col xs={1} lg={0} className="d-block d-lg-none">
              <Menu
                size={21}
                className="cursor-pointer mx-1"
                onClick={handleSidebar}
              />
            </Col>
            <Col xs={2} sm={1} className="mx-1">
              <Avatar
                img={
                  selectedUserChat[0].img
                    ? selectedUserChat[0].img
                    : avatarPlaceholder
                }
                imgHeight="45"
                imgWidth="45"
                status="online"
              />
            </Col>
            <Col xs={8} lg={10} className="p-0">
              <h4 className="mb-0 fw-bolder">{selectedUserChat[0].name}</h4>
            </Col>
          </Row>

          <Chat
            selectedUserChat={selectedUserChat[0]}
            handleSidebar={handleSidebar}
          />

          <Form
            className="chat-app-form mb-1 mx-1"
            onSubmit={(e) => handleSendMsg(e)}
          >
            <InputGroup className="input-group-merge me-1">
              <Input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your message"
                disabled={selectedUserChat[0].chat.chat.length <= 0}
              />
              <InputGroupText>
                <Label className="mb-0" for="attach-doc">
                  <Camera className="cursor-pointer text-secondary" size={14} />
                  <input
                    type="file"
                    id="attach-doc"
                    hidden
                    disabled={selectedUserChat[0].chat.chat.length <= 0}
                  />
                </Label>
              </InputGroupText>
            </InputGroup>
            <Button
              className="send"
              color="dark"
              //   disabled={
              //     selectedUserChat[0].chat.chat.length <= 0 || msg.length <= 0
              //   }
            >
              <Send size={14} className="d-lg-none" />
              <span className="d-none d-lg-block">Send</span>
            </Button>
          </Form>
        </>
      ) : (
        <Row className="start-conversation" onClick={() => handleSidebar()}>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="start-icon">
              <MessageSquare size={70} color="#919191" />
            </div>
            <h4
              className="mb-0 fw-bolder text-center cursor-pointer"
              onClick={handleSidebar}
            >
              Start Conversation
            </h4>
          </div>
        </Row>
      )}
    </Col>
  );
};

export default SidebarRight;
