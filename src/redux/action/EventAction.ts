import { toast } from "react-toastify";
import { api } from "~/api";

import {
  EVENT,
  EVENT_HISTORY_LIST,
  EVENT_HISTORY_TOTAL,
  EVENT_LIST,
  EVENT_TOTAL,
} from "@constants/ReducerConstants";
import { EVENT_DETAILS_ADDED, SOMETHING_WENT_WRONG } from "@constants/ToastMsgConstants";
import { getUserType } from "@utils/Utils";
import {
  type BaseAction,
  type EventFromPhp,
  type FilterAndPagination,
  type GetEventsAction,
  UserType,
} from "@types";
import { type Dispatch } from "react";
import { type NextRouter } from "next/router";
import { type AnyAction } from "@reduxjs/toolkit";
import {
  customerEventNotification,
  eventCreate,
  eventDetail,
  eventList,
  eventManagementAddDetails,
  eventManagementDetails,
  eventManagementPhoto,
  eventManagementSetup,
  eventManagementVenue,
  eventNotification,
  eventReadNotification,
  eventUpdate,
  marketEvent,
  packageList,
  preferenceList,
} from "@configs/ApiEndpoints";

/**
 * It's an async function that takes in a dispatch function and returns a response from the api call
 * @param data - The data you want to send to the API.
 */
export const eventListingApiCall = (data: FormData) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const response = await (api(eventList, data, "postMultipart") as unknown as GetEventsAction);
    if (response.status === 200) {
      dispatch({
        type: EVENT_LIST,
        payload: response.data.data.events,
      });
      dispatch({
        type: EVENT_TOTAL,
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
 * It's an async function that takes in a dispatch function and returns a response object
 * @param data - The data you want to send to the API.
 */
export const eventCreateApiCall = (data: object, router: NextRouter) => {
  return async () => {
    const response = await (api(eventCreate, data, "postMultipart") as unknown as BaseAction);
    if (response.status === 200) {
      void router.push("/admin/event");
      toast.success(response.data.message);
      return response;
    } else {
      toast.error(response.data.message || SOMETHING_WENT_WRONG);
      return response;
    }
  };
};
/**
 * It takes an id as a parameter and returns a function that dispatches an async api call to the server
 * and returns the response
 * @param id - The id of the event you want to get the details of.
 */
export const eventDetailApiCall = (id: number) => {
  return async () => {
    const response = await (api(eventDetail, { id }, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the server, and if the response is successful, it dispatches an action to
 * the reducer, and if the response is unsuccessful, it dispatches an action to the reducer
 * @param data - The data you want to send to the API.
 */
export const eventUpdateApiCall = (data: FormData, router: NextRouter) => {
  return async () => {
    const response = await (api(eventUpdate, data, "postMultipart") as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(response.data.message);
      void router.push("/admin/event");
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's an async function that takes in a dispatch function and a data object, and returns a response
 * object
 * @param data - The data you want to send to the API.
 */
export const eventMarketApiCall = (data: {
  type: string;
  sort_field: string;
  sort_order: string;
}) => {
  return async () => {
    const response = await (api(marketEvent, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's an async function that takes in a dispatch function and a data object, and returns a response
 * object
 * @param data - The data you want to send to the API.
 */
export const packageTypeApiCall = (data: {
  type: string;
  sort_field: string;
  sort_order: string;
}) => {
  return async () => {
    const response = await (api(packageList, data, "get") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data you want to send to the API.
 */
export const preferenceApiCall = (data: {
  type: string;
  sort_field: string;
  sort_order: string;
}) => {
  return async () => {
    const response = await (api(preferenceList, data, "post") as unknown as BaseAction);
    if (response?.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's an async function that takes in a data object and returns a function that takes in a dispatch
 * function
 * @param data - The data object that you want to send to the API.
 */
export const eventListApiCall = (data: FilterAndPagination) => {
  return async (dispatch: Dispatch<{ type: string; payload: number | EventFromPhp[] }>) => {
    const response = await (api(eventList, data, "post") as unknown as GetEventsAction);

    if (response.status === 200) {
      dispatch({
        type: EVENT,
        payload: response.data.data.events,
      });
      dispatch({
        type: EVENT_TOTAL,
        payload: response.data.data.count,
      });

      return response;
    } else {
      toast.error(response.data.message);
    }
  };
};

/**
 * It's an async function that takes in a data object, makes an API call, and dispatches an action to
 * the reducer
 * @param data - The data object is the payload that you want to send to the API.
 */
export const eventHistoryListApiCall = (data: {
  page: number;
  per_page: number;
  search: string;
  sort_field: string;
  sort_order: string;
  duration: string;
}) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const response = await (api(eventList, data, "post") as unknown as GetEventsAction);

    if (response?.status === 200) {
      dispatch({
        type: EVENT_HISTORY_LIST,
        payload: response.data.data.events,
      });
      dispatch({
        type: EVENT_HISTORY_TOTAL,
        payload: response.data.data.count,
      });

      return response;
    } else {
      toast.error(response.data.message);
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data you want to send to the API.
 * @returns A function that returns a promise.
 */
export const getNotificationApiCall = (data: { page: number; per_page: number }) => {
  const endpoint =
    getUserType() === UserType.CUSTOMER ? customerEventNotification : eventNotification;
  return async () => {
    const response = await (api(endpoint, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      // toast.error(response.data.message)
    }
  };
};

/**
 * It makes an API call to the backend to read a notification
 * @param data - The data to be sent to the API.
 */
export const readNotificationApiCall = (data: { notification_id: number }) => {
  return async () => {
    const response = await (api(eventReadNotification, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data you want to send to the API.
 */
export const eventDetailsApiCall = (data: { id: number }) => {
  return async () => {
    const response = await (api(eventManagementDetails, data, "post") as unknown as BaseAction);
    if (response?.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data that you want to send to the API.
 */
export const setupDetailsApiCall = (data: {
  contact_name: string;
  phone_number: string;
  email: string;
  location: string;
  is_parking_available: string;
  setup_location: string;
  available_for_setup: string;
  is_elevator_available: string;
  setup_details: string;
  event_id: number;
}) => {
  return async () => {
    const response = await (api(eventManagementSetup, data, "post") as unknown as BaseAction);
    if (response?.status === 200) {
      return response;
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data that you want to send to the API.
 */
export const addDetailsApiCall = (data: {
  id: string;
  event_date: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  is_event_planner: string;
  type_id: number;
  category_id: number;
  reach_via: string;
  guest_count: number;
  start_time: string;
  end_time: string;
  email: string;
  planner_first_name?: string;
  planner_last_name?: string;
  planner_email?: string;
  planner_phone_number?: string;
  planner_company_name?: string;
  is_agree: boolean;
}) => {
  return async () => {
    const response = await (api(eventManagementAddDetails, data, "post") as unknown as BaseAction);

    if (response?.status === 200) {
      return response;
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data to be sent to the API.
 */
export const photoDetailsApiCall =
  (photoDetails: {
    event_id: string;
    filter_type: string;
    orientation_type: string;
    design_type: string;
    first_line: string;
    second_line: string;
    primary_color: string;
    secondary_color: string;
    vision: string;
    backdrop_type: string;
    logo: string | null | undefined;
  }) =>
  async () => {
    const response = await (api(
      eventManagementPhoto,
      photoDetails,
      "post",
    ) as unknown as BaseAction);
    if (response?.status === 200) {
      toast.success(EVENT_DETAILS_ADDED);
      return response;
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data you want to send to the API.
 */
export const venueDetailsApiCall = (data: FormData) => {
  return async () => {
    const response = await (api(
      eventManagementVenue,
      data,
      "postMultipart",
    ) as unknown as BaseAction);
    if (response?.status === 200) {
      return response;
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };
};
