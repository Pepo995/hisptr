// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Bell } from "react-feather";

// ** Reactstrap Imports
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { NOTIFICATION_LIMIT } from "@constants/CommonConstants";
import {
  getNotificationApiCall,
  readNotificationApiCall,
} from "@redux/action/EventAction";
import { useRouter } from "next/router";

const NotificationDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [notificationList, setNotificationList] = useState([]);
  const [totalNotification, setTotalNotification] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  /**
   * It fetches the notification list from the API and sets the notification list and notification
   * count in the state
   * @param [limitSend=false] - If you want to get all the notifications, then pass false. If you want
   * to get only the unread notifications, then pass true.
   */
  const getNotificationList = async (limitSend = false) => {
    let dataToSend = {
      page: 1,
      per_page: NOTIFICATION_LIMIT,
    };
    if (limitSend) {
      dataToSend = {};
    }

    const res = await dispatch(getNotificationApiCall(dataToSend));
    if (!res?.data.error) {
      if (res?.data.data?.notifications) {
        setNotificationList([...res.data.data.notifications]);
        setNotificationCount(res.data.data.notifications.length);
      }
      setTotalNotification(res?.data?.data?.unread_count);
    }
  };

  useEffect(() => {
    getNotificationList();
  }, []);

  /**
   * It makes an API call to the backend to mark the notification as read, then redirects the user to
   * the event detail page
   * @param id - The id of the notification
   * @param eventId - The id of the event that the notification is about.
   */
  const readNotificationHandler = async (id, eventId) => {
    const res = await dispatch(
      readNotificationApiCall({ notification_id: id }),
    );
    router.push({
      pathname: `/customer/event-management/upcoming-event/edit-event-detail/${eventId}`,
    });
    getNotificationList();
  };

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false,
        }}
      >
        {notificationList.map((item, index) => {
          return (
            <DropdownItem
              key={index}
              tag="a"
              className="d-flex p-0"
              onClick={(e) => {
                readNotificationHandler(item.id, item.event_id);
              }}
            >
              <div className={classnames("list-item d-flex align-items-start")}>
                <Fragment>
                  <div className="list-item-body flex-grow-1">
                    {/* {item.description} */}
                    <small className="notification-text">
                      {item.description}
                    </small>
                  </div>
                </Fragment>
              </div>
            </DropdownItem>
          );
        })}
      </PerfectScrollbar>
    );
  };
  /*eslint-enable */

  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <Bell size={21} />
        <Badge pill color="danger" className="badge-up">
          {totalNotification}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0 bg-white">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Notifications</h4>
            <Badge tag="div" color="light-primary" pill>
              {totalNotification} New
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className="dropdown-menu-footer">
          {totalNotification > NOTIFICATION_LIMIT ? (
            <Button
              color="primary"
              onClick={() =>
                getNotificationList(notificationCount <= NOTIFICATION_LIMIT)
              }
              block
            >
              {totalNotification > notificationCount ? "See More" : "See Less"}
            </Button>
          ) : (
            ""
          )}
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default NotificationDropdown;
