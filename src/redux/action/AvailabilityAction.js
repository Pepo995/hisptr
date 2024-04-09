import { toast } from "react-toastify";
import { api } from "~/api";
import {
  AVAILABILITY_DETAIL_LIST,
  AVAILABILITY_DETAIL_TOTAL,
  AVAILABILITY_LIST,
  AVAILABILITY_TOTAL,
} from "@constants/ReducerConstants";
import { AVAILABILITY_CREATED, AVAILABILITY_UPDATE } from "@constants/ToastMsgConstants";
import {
  availabilityCreate,
  availabilityDetails,
  availabilityList,
  availabilityMyList,
  availabilityStatusUpdate,
} from "@configs/ApiEndpoints";

/**
 * It's an async function that takes in a dispatch function and a data object. It then makes an API
 * call to the endpoint specified in the apiEndPoints object in the Config file. If the response is
 * successful, it dispatches an action with the type AVAILABILITY_LIST and the payload of the response
 * data. If the response is unsuccessful, it displays an error message
 * @param data - The data object that you want to send to the API.
 */
export const AvailabilityListAPICall = (data) => {
  return async (dispatch) => {
    const response = await api(availabilityList, data, "post");

    if (response.status === 200) {
      dispatch({
        type: AVAILABILITY_LIST,
        payload: response.data.data.requests,
      });
      dispatch({
        type: AVAILABILITY_TOTAL,
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
 * It's an async function that takes in a data object and returns a response object
 * @param data - The data you want to send to the API.
 */
export const AvailabilityMyListAPICall = (data) => {
  return async (dispatch) => {
    const response = await api(availabilityMyList, data, "post");

    if (response.status === 200) {
      dispatch({
        type: AVAILABILITY_LIST,
        payload: response.data.data.requests,
      });
      dispatch({
        type: AVAILABILITY_TOTAL,
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
 * It makes an API call to the server, and if the response is successful, it dispatches an action to
 * the reducer
 * @param data - The data you want to send to the API.
 * @returns The response from the API call.
 */
export const AvailabilityRequestAPICall = (data) => {
  return async () => {
    const response = await api(availabilityCreate, data, "postMultipart");
    if (response.status === 200) {
      toast.success(AVAILABILITY_CREATED);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's an async function that takes in a dispatch function and a data object, makes an API call, and
 * then dispatches an action based on the response
 * @param data - The data object is the data that you want to send to the API.
 */
export const AvailabilityDetailAPICall = (data) => {
  return async (dispatch) => {
    const response = await api(availabilityDetails, data, "post");
    if (response.status === 200) {
      dispatch({
        type: AVAILABILITY_DETAIL_LIST,
        payload: response.data.data.availability_request,
      });
      dispatch({
        type: AVAILABILITY_DETAIL_TOTAL,
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
 * It makes an API call to the server and returns the response
 * @param data - The data to be sent to the API.
 * @returns A function that returns a promise.
 */
export const AvailabilityStatusUpdateAPICall = (data) => {
  return async () => {
    const response = await api(availabilityStatusUpdate, data, "post");
    if (response.status === 200) {
      toast.success(AVAILABILITY_UPDATE);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
