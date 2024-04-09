import React from "react";
import { Col, Row } from "reactstrap";
import Avatar from "@components/avatar";
import avatarPlaceholder from "@images/avatar-placeholder.png";
import classNames from "classnames";

const UserChatList = ({ selectedChat, onClickHandler, user }) => {
  return (
    <>
      {user.map((item) => {
        return (
          <>
            <Row
              className={classNames(
                "align-items-center p-1 rounded cursor-pointer border-bottom",
                {
                  bgActive: selectedChat === item.id,
                  bgInactive: selectedChat !== item.id,
                },
              )}
              onClick={() => onClickHandler(item)}
            >
              <Col xs={2}>
                <Avatar
                  img={item.img ? item.img : avatarPlaceholder}
                  imgHeight="35"
                  imgWidth="35"
                />
              </Col>
              <Col xs={7} className="p-0">
                <h5
                  className={classNames("mb-0", {
                    "text-dark": selectedChat === item.id,
                  })}
                >
                  {item.name}
                </h5>
                <p
                  className={classNames("mb-0 fs-6", {
                    "text-dark": selectedChat === item.id,
                    "text-muted": selectedChat !== item.id,
                  })}
                >
                  {item.shopName}
                </p>
              </Col>
              <Col xs={3} className="text-end">
                <p
                  className={classNames("date", {
                    "text-dark": selectedChat === item.id,
                    "text-muted": selectedChat !== item.id,
                  })}
                >
                  {item.date}
                </p>
                {item.chat.unseenMsgs >= 1 ? (
                  <span className="unread">{item.chat.unseenMsgs}</span>
                ) : (
                  <p></p>
                )}
              </Col>{" "}
            </Row>{" "}
          </>
        );
      })}
    </>
  );
};

export default UserChatList;
