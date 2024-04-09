import ReactDOM from "react-dom";
import { useEffect, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import Avatar from "@components/avatar";
import classNames from "classnames";
import one from "@images/portrait/small/avatar-s-1.jpg";
import moment from "moment";
import { PROFILE_PARTNER_IMAGE } from "@constants/CommonConstants";

const Chat = ({ selectedUserChat, handlesidebar }) => {
  const userDataList = localStorage?.getItem(PROFILE_PARTNER_IMAGE);
  /*eslint-disable-next-line */
  const userDataListInJson = userDataList ? userDataList : null;
  const chatArea = useRef(null);

  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current);
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
  };

  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUserChat).length;

    if (selectedUserLen) {
      scrollToBottom();
    }
  }, [selectedUserChat]);

  const ChatWrapper =
    Object.keys(selectedUserChat).length && selectedUserChat.chat ? PerfectScrollbar : "div";

  const formattedChatData = () => {
    let chatLog = [];
    if (selectedUserChat.chat) {
      chatLog = selectedUserChat.chat.chat;
    }

    const formattedChatLog = [];
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined;
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: [],
    };

    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          msg: msg.message,
          img: msg.img,
        });
      } else {
        chatMessageSenderId = msg.senderId;
        formattedChatLog.push(msgGroup);
        msgGroup = {
          senderId: msg.senderId,
          messages: [{ msg: msg.message }],
          img: msg.img,
        };
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
    });

    return formattedChatLog;
  };

  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classNames("chat", {
            "chat-left": item.senderId !== 11,
          })}
        >
          <div className="chat-avatar">
            <Avatar
              imgHeight={36}
              imgWidth={36}
              img={item.img || one}
              className="box-shadow-1 cursor-pointer"
              // status="online"
            />
          </div>

          <div className="chat-body">
            {item.messages.map((chat) => (
              <div key={chat.msg} className="chat-content">
                <p
                  className={classNames({
                    "text-white": item.senderId === 11,
                    "text-secondary": item.senderId !== 11,
                  })}
                >
                  {chat.msg}
                </p>
                <p
                  className={classNames({
                    "time-stamp-light": item.senderId === 11,
                    "time-stamp-dark": item.senderId !== 11,
                  })}
                >
                  {moment().format("h:mm a")}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <ChatWrapper ref={chatArea} className="user-chats p-1" options={{ wheelPropagation: false }}>
      {selectedUserChat.chat.chat.length ? (
        <div className="chats" onClick={handlesidebar}>
          {renderChats()}
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center h-full"
          style={{ height: "100%" }}
        >
          <p className="mb-0 fs-4 fw-bolder lh-base text-center">
            Only the Shop Owner can Initiate the Chat
          </p>
        </div>
      )}
    </ChatWrapper>
  );
};

export default Chat;
