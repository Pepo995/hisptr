import { toast } from "react-toastify";
import { api } from "~/api";
import {
  NOTIFICATION_LIST,
  NOTIFICATION_TOTAL,
  RECIPIENT_LIST,
  RECIPIENT_TOTAL,
} from "@constants/ReducerConstants";
import {
  notificationDetail,
  notificationList,
  notificationMyList,
  notificationRead,
  notificationSend,
} from "@configs/ApiEndpoints";

/**
 * It's a function that returns a function that returns a promise
 * @param data - The data you want to send to the API.
 */
export const notificationListApiCall = (data) => {
  return async (dispatch) => {
    const response = await api(notificationList, data, "postMultipart");
    if (response?.status === 200) {
      dispatch({
        type: NOTIFICATION_LIST,
        payload: response.data.data.notifications,
      });
      dispatch({
        type: NOTIFICATION_TOTAL,
        payload: response.data.data.count,
      });
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's an async function that takes in a data object, makes an API call to the backend, and returns a
 * response object
 * @param data - The data to be sent to the API.
 */
export const sendNotificationApiCall = (data) => {
  return async () => {
    const response = await api(notificationSend, data, "postMultipart");
    if (response?.status === 200) {
      toast.success(response.data.message);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
/**
 * It's an async function that takes in a dispatch function and returns a response from an API call
 * @param data - The data you want to send to the API.
 */
export const notificationDetailApiCall = (data) => {
  return async (dispatch) => {
    const response = await api(notificationDetail, data, "postMultipart");
    if (response?.status === 200) {
      dispatch({
        type: RECIPIENT_LIST,
        payload: response.data.data.notification,
      });
      dispatch({
        type: RECIPIENT_TOTAL,
        payload: response.data.data.count,
      });
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

export const partnerNotificationListing = (data) => {
  return async (dispatch) => {
    const response = await api(notificationMyList, data, "postMultipart");
    if (response.status === 200) {
      dispatch({
        type: "PARTNER_NOTIFICATION_LIST",
        payload: response.data.data.notifications,
      });
      dispatch({
        type: "TOTAL_PARTNER_NOTIFICATION",
        payload: response.data.data,
      });
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//Notification read api call
export const NotificationReadAction = (data) => {
  return async () => {
    const response = await api(notificationRead, data, "postMultipart");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
