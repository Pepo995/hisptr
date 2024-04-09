import { useState } from "react";
import { Row } from "reactstrap";
import SidebarLeft from "@components/Message/SidebarLeft";
import SidebarRight from "@components/Message/SidebarRight";
import Breadcrumbs from "@components/breadcrumbs";

import one from "@images/portrait/small/avatar-s-1.jpg";
import two from "@images/portrait/small/avatar-s-2.jpg";
import three from "@images/portrait/small/avatar-s-3.jpg";
import four from "@images/portrait/small/avatar-s-4.jpg";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const userListData = [
  {
    id: 1,
    img: one,
    name: "Super Admin",
    shopName: "Super Administrator",
    status: "online",
    date: "Aug 6",
    chat: {
      id: 2,
      userId: 2,
      unseenMsgs: 1,
      chat: [
        {
          message: "How can we help? We're here for you!",
          time: "Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message:
            "Hey John, I am looking for the best admin template. Could you please help me to find it out?",
          time: "Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "It should be Bootstrap 5 compatible.",
          time: "Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "Absolutely!",
          time: "Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message:
            "Modern admin is the responsive bootstrap 5 admin template.!",
          time: "Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message: "Looks clean and fresh UI.",
          time: "Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "It's perfect for my next project.",
          time: "Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "How can I purchase it?",
          time: "Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "Thanks, from ThemeForest.",
          time: "Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
      ],
    },
  },
  {
    id: 2,
    img: one,
    name: "client Admin",
    shopName: "A Starter Guide To Self",
    status: "online",
    date: "Aug 6",
    chat: {
      id: 2,
      userId: 2,
      unseenMsgs: 1,
      chat: [
        {
          message: "good morning ",
          time: "Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message:
            "Hey John, I am looking for the best admin template. Could you please help me to find it out?",
          time: "Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "It should be Bootstrap 5 compatible.",
          time: "Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "Absolutely!",
          time: "Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message:
            "Modern admin is the responsive bootstrap 5 admin template.!",
          time: "Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message: "Looks clean and fresh UI.",
          time: "Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "It's perfect for my next project.",
          time: "Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "How can I purchase it?",
          time: "Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)",
          senderId: 2,
          img: two,
        },
        {
          message: "Thanks, from ThemeForest.",
          time: "Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
      ],
    },
  },
];
const ClientListData = [
  {
    id: 3,
    img: three,
    name: "Super Admin",
    shopName: "Super Administrator",
    status: "online",
    date: "Aug 6",
    chat: {
      id: 2,
      userId: 2,
      unseenMsgs: 1,
      chat: [
        {
          message: "How can we help? We're here for you!",
          time: "Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)",
          senderId: 11,
          img: four,
        },
        {
          message:
            "Hey John, I am looking for the best admin template. Could you please help me to find it out?",
          time: "Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "It should be Bootstrap 5 compatible.",
          time: "Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "Absolutely!",
          time: "Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)",
          senderId: 11,
          img: four,
        },
        {
          message:
            "Modern admin is the responsive bootstrap 5 admin template.!",
          time: "Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)",
          senderId: 11,
          img: four,
        },
        {
          message: "Looks clean and fresh UI.",
          time: "Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "It's perfect for my next project.",
          time: "Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "How can I purchase it?",
          time: "Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "Thanks, from ThemeForest.",
          time: "Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)",
          senderId: 11,
          img: four,
        },
      ],
    },
  },
  {
    id: 5,
    img: one,
    name: "client Admin",
    shopName: "A Starter Guide To Self",
    status: "online",
    date: "Aug 6",
    chat: {
      id: 2,
      userId: 2,
      unseenMsgs: 1,
      chat: [
        {
          message: "good morning ",
          time: "Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message:
            "Hey John, I am looking for the best admin template. Could you please help me to find it out?",
          time: "Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "It should be Bootstrap 5 compatible.",
          time: "Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "Absolutely!",
          time: "Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message:
            "Modern admin is the responsive bootstrap 5 admin template.!",
          time: "Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
        {
          message: "Looks clean and fresh UI.",
          time: "Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "It's perfect for my next project.",
          time: "Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "How can I purchase it?",
          time: "Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)",
          senderId: 2,
          img: three,
        },
        {
          message: "Thanks, from ThemeForest.",
          time: "Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)",
          senderId: 11,
          img: one,
        },
      ],
    },
  },
];

const MessageDetails: NextPageWithLayout = () => {
  const [userList, setUserList] = useState(userListData);
  /*eslint-disable-next-line */
  const [clientList, setClientList] = useState(ClientListData);
  const [sidebar, setSidebar] = useState(false);
  const [selectedUserChat, setSelectUserChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState();

  const handleSidebar = () => setSidebar(!sidebar);
  return (
    <div className="main-role-ui">
      <Helmet>
        <title>Hipstr - Message Details</title>
      </Helmet>
      <Breadcrumbs
        title="Messages"
        data={[
          { title: "Today’s Events", link: "/customer/message" },
          { title: "Message Details" },
        ]}
      />
      <Row className="mt-1 chat-body">
        <SidebarLeft
          selectRadio={"Super Admin"}
          userList={userList}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setSelectUserChat={setSelectUserChat}
          sidebar={sidebar}
          handleSidebar={handleSidebar}
          setUserList={setUserList}
          clientList={clientList}
        />
        <SidebarRight
          selectedUserChat={selectedUserChat}
          setSelectUserChat={setSelectUserChat}
          handleSidebar={handleSidebar}
          sidebar={sidebar}
        />
      </Row>
    </div>
  );
};

MessageDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default MessageDetails;
