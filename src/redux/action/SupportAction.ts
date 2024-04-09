import { toast } from "react-toastify";
import { api } from "~/api";
import {
  CLIENT_SUPPORT_LIST,
  CLIENT_SUPPORT_TOTAL,
  PARTNER_SUPPORT_LIST,
  PARTNER_SUPPORT_TOTAL,
  SUPPORT_LIST,
  SUPPORT_TOTAL,
} from "@constants/ReducerConstants";
import { STATUS_UPDATED } from "@constants/ToastMsgConstants";
import { TICKET_CREATE } from "@constants/ToastMsgConstants";
import {
  adminTicketRead,
  adminTicketReply,
  customerTicketGetById,
  customerTicketRead,
  customerTicketReply,
  getEventDetails,
  requestTypeGet,
  ticketCreate,
  ticketEventList,
  ticketGetById,
  ticketList,
  ticketStatusUpdate,
} from "@configs/ApiEndpoints";
import { type NextRouter } from "next/router";
import { z } from "zod";
import { type AnyAction, type Dispatch } from "@reduxjs/toolkit";

type ResponseWithMessage = {
  status: number;
  data: {
    message: string;
  };
};

/**
 * It's a function that takes in data as a parameter, and returns a function that takes in dispatch as
 * a parameter, and returns a promise that resolves to a function that takes in response as a parameter
 * @param data - The data object is the data that you want to send to the API.
 */
export const supportTicketAPICall = (data: object) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: Dispatch<AnyAction>) => {
    const response: {
      status: number;
      data: {
        data: {
          tickets: object;
          count: number;
        };
        message: string;
      };
    } = await api(ticketList, data, "post");
    if (response.status === 200) {
      dispatch({
        type: SUPPORT_LIST,
        payload: response.data.data.tickets,
      });
      dispatch({
        type: SUPPORT_TOTAL,
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
 * It's an async function that takes in an id, makes a get request to the api, and returns the response
 * @param id - The id of the ticket you want to get.
 * @returns The response from the API call.
 */
export const ticketGetByIdApiCall = (id: number) => {
  return async () => {
    const response: ResponseWithMessage = await api(`${ticketGetById}/${id}`, {}, "get");
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
 * @param data - The data to be sent to the API.
 * @returns The response from the API call.
 */
export const ticketReplyApiCall = (data: object) => {
  return async () => {
    const response: ResponseWithMessage = await api(adminTicketReply, data, "postMultipart");
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
 * @param data - The data to be sent to the API.
 * @returns The response from the API call.
 */
export const customerTicketReplyApiCall = (data: object) => {
  return async () => {
    const response: ResponseWithMessage = await api(customerTicketReply, data, "postMultipart");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

//get support request type api call
export const requestTypeAPiCall = (data: object) => {
  return async () => {
    const response: ResponseWithMessage = await api(requestTypeGet, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//event listing api call
export const eventListAPiCall = (data: object) => {
  return async () => {
    const response: ResponseWithMessage = await api(ticketEventList, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//create ticket api call
export const createTicket = (data: object, router: NextRouter) => {
  return async () => {
    const response: ResponseWithMessage & {
      data: {
        data: {
          ticket: {
            id: number;
          };
        };
      };
    } = await api(ticketCreate, data, "postMultipart");
    const { id } = z.object({ id: z.number() }).parse(response.data.data.ticket);
    if (response.status === 200) {
      toast.success(TICKET_CREATE);
      void router.push(`/customer/support-request-listing/request-detail/${id}`);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data to be sent to the API.
 * @returns The response from the api call.
 */
export const adminTicketReadApiCall = (data: object) => {
  return async () => {
    const response: ResponseWithMessage = await api(adminTicketRead, data, "post");
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
 * @param data - The data to be sent to the API.
 * @returns The response from the api call.
 */
export const customerTicketReadApiCall = (data: object) => {
  return async () => {
    const response: ResponseWithMessage = await api(customerTicketRead, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's a function that takes in data as a parameter, and returns a function that takes in dispatch as
 * a parameter, and returns a promise that resolves to a function that takes in response as a parameter
 * @param data - The data object is the data that you want to send to the API.
 */
export const partnerSupportAPICall = (data: { type: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: Dispatch<AnyAction>) => {
    const response: {
      status: number;
      data: {
        data: {
          tickets: object;
          count: number;
        };
        message: string;
      };
    } = await api(ticketList, data, "post");
    if (response.status === 200) {
      if (data.type === "partner") {
        dispatch({
          type: PARTNER_SUPPORT_LIST,
          payload: response.data.data.tickets,
        });
        dispatch({
          type: PARTNER_SUPPORT_TOTAL,
          payload: response.data.data.count,
        });
      } else {
        dispatch({
          type: CLIENT_SUPPORT_LIST,
          payload: response.data.data.tickets,
        });
        dispatch({
          type: CLIENT_SUPPORT_TOTAL,
          payload: response.data.data.count,
        });
      }
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
 * @param data - The data to be sent to the API.
 * @returns The response from the api call.
 */
export const ticketStatusUpdateApiCall = (data: object) => {
  return async () => {
    const response: ResponseWithMessage = await api(ticketStatusUpdate, data, "post");
    if (response.status === 200) {
      toast.success(STATUS_UPDATED);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's an async function that takes in an id, makes a get request to the api, and returns the response
 * @param id - The id of the ticket you want to get.
 * @returns The response from the API call.
 */
export const customerTicketGetByIdApiCall = (id: number) => {
  return async () => {
    const response: ResponseWithMessage = await api(`${customerTicketGetById}/${id}`, {}, "get");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
    }
  };
};

export const getEventDetailsApiCall = () => {
  return async () => {
    const response: ResponseWithMessage = await api(getEventDetails, {}, "get");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
    }
  };
};
