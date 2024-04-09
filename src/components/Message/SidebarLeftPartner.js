import { Col, Input, InputGroup, InputGroupText, Row } from "reactstrap";
import Avatar from "@components/avatar";
import avatarPlaceholder from "@images/portrait/small/avatar-s-1.jpg";
import { Search } from "react-feather";
import UserChatList from "@components/Message/UserChatList";
import classNames from "classnames";

const SidebarLeft = ({
  selectRadio,
  userList,
  selectedChat,
  setSelectedChat,
  setSelectUserChat,
  sidebar,
  handleSidebar,
  setUserList,
  clientList,
}) => {
  const userSelectHandler = (user) => {
    const modifiedUser = { ...user, chat: { ...user.chat, unseenMsgs: 0 } };
    setSelectUserChat(Array(modifiedUser));

    setSelectedChat(user.id);

    /*eslint-disable-next-line */
    readMsg(user);

    if (sidebar === true) {
      handleSidebar();
    }
  };

  const readMsg = (user) => {
    const updatedUserList = userList.map((item) => {
      if (item.chat.unseenMsgs >= 1 && item.id === user.id) {
        return { ...item, chat: { ...item.chat, unseenMsgs: 0 } };
      } else {
        return item;
      }
    });

    setUserList(updatedUserList);
  };

  return (
    <Col
      lg={4}
      xl={4}
      className={classNames("sidebar-left pt-xl-1 p-0", {
        show: sidebar === true,
      })}
    >
      <Row className="align-items-center chat-search-bar mx-0">
        <Col xs={2}>
          <Avatar
            img={avatarPlaceholder}
            imgHeight="35"
            imgWidth="35"
            status="online"
          />
        </Col>
        <Col xs={10} className="ps-0">
          <InputGroup>
            <InputGroupText className="br-20 chat-search-border">
              <Search size={14} />
            </InputGroupText>
            <Input
              placeholder="Search or start a new chat"
              className="br-20 border-left"
            />
          </InputGroup>
          {/* <InputGroup className="input-group-merge me-1">
           <InputGroupText className="br-20 chat-search-border">
                <Label className="mb-0" for="attach-doc">
                  <Search className="cursor-pointer text-secondary" size={14} />
                </Label>
              </InputGroupText>
              <Input
                placeholder="Search or start a new chat"
                className="br-20 border-left"
              />

            </InputGroup> */}
        </Col>
      </Row>

      <h4 className="mt-2 mx-1 sy-tx-primary">Admin’s Messages</h4>
      <div
        options={{ wheelPropagation: false }}
        className="fixed-height-top-chat-list"
      >
        {selectRadio === "Shop Owners" ? (
          userList.map((user, key) => (
            <UserChatList
              key={key}
              user={user}
              data={user}
              selectedChat={selectedChat}
              onClickHandler={(e) => userSelectHandler(e)}
            />
          ))
        ) : (
          <UserChatList
            user={userList}
            data={userList[0]}
            selectedChat={selectedChat}
            onClickHandler={(e) => userSelectHandler(e)}
          />
        )}

        <h4 className="mt-2 mx-1 sy-tx-primary">Client Message</h4>
        {selectRadio === "Shop Owners" ? (
          clientList.map((user, key) => (
            <UserChatList
              key={key}
              user={user}
              data={user}
              selectedChat={selectedChat}
              onClickHandler={(e) => userSelectHandler(e)}
            />
          ))
        ) : (
          <UserChatList
            user={clientList}
            data={clientList[0]}
            selectedChat={selectedChat}
            onClickHandler={(e) => userSelectHandler(e)}
          />
        )}
      </div>
    </Col>
  );
};

export default SidebarLeft;
