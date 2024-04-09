import { toast } from "react-toastify";
import { api } from "~/api";
import { PARTNER_ADD, PARTNER_DELETE, PARTNER_EDIT } from "@constants/ToastMsgConstants";
import {
  PARTNER_LIST,
  PARTNER_TOTAL,
  PARTNER_USER_LIST,
  TOTAL_PARTNER_USER,
} from "@constants/ReducerConstants";
import {
  addPartnerEmployee,
  editPartnerEmployee,
  getPartnerEmployee,
  partnerDelete,
  partnerList,
} from "@configs/ApiEndpoints";

//add partner api call
export const addPartnerApi = (data, router) => {
  return async () => {
    const response = await api(addPartnerEmployee, data, "post");
    if (response.status === 200) {
      toast.success(PARTNER_ADD);
      router.replace("/partner-employee");
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//edit partner api call
export const editPartnerApi = (data, router) => {
  return async () => {
    const response = await api(editPartnerEmployee, data, "post");
    if (response.status === 200) {
      toast.success(PARTNER_EDIT);
      router.replace("/partner-employee");
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//get partner employee list api call
export const getPartnerEmployeeApiCall = (data) => {
  return async () => {
    const response = await api(`${getPartnerEmployee}`, data, "post");
    let responseData = { status: null, data: null };
    responseData = { status: response.status, data: response.data.data };
    if (response.status === 200) {
      return responseData;
    } else {
      toast.error(response?.data?.message);
      return responseData;
    }
  };
};
//partner user listing api call
export const partnerUserListing = (data) => {
  return async (dispatch) => {
    const response = await api(partnerList, data, "post");
    if (response?.status === 200) {
      dispatch({
        type: PARTNER_USER_LIST,
        payload: response.data.data.users,
      });
      dispatch({
        type: TOTAL_PARTNER_USER,
        payload: response.data.data.count,
      });
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//delete partner user api call
export const DeletePartnerUserApiCall = (id, type) => {
  return async () => {
    const response = await api(`${partnerDelete}`, { type, id }, "post");
    if (response.status === 200) {
      toast.success(PARTNER_DELETE);
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };
};
//Partner listing api call
export const partnerListApiCall = (data) => {
  return async () => {
    const response = await api(partnerList, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };
};

/**
 * It's an async function that takes in a dispatch function and returns a function that calls an api
 * function with the given parameters and dispatches the response to the reducer
 * @param data - The data object that you want to send to the API.
 */
export const partnerListingApiCall = (data) => {
  return async (dispatch) => {
    const response = await api(partnerList, data, "post");
    if (response.status === 200) {
      dispatch({
        type: PARTNER_LIST,
        payload: response.data.data.users,
      });
      dispatch({
        type: PARTNER_TOTAL,
        payload: response.data.data.count,
      });
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend, and if the response is successful, it dispatches an action to
 * the reducer
 * @param data - The data to be sent to the API.
 * @returns A function that takes dispatch as an argument.
 */
export const partnerDeleteByIdApiCall = (data) => {
  return async () => {
    const response = await api(partnerDelete, data, "post");
    if (response.status === 200) {
      toast.success("Partner deleted successfully");
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It's a function that returns a function that returns a promise that returns an object
 * @param data - The data you want to send to the API.
 */
export const partnerGetByIdApiCall = (data) => {
  return async () => {
    let responceData = { data: null, status: null };
    const response = await api(partnerById, data, "post");
    if (response.status === 200) {
      responceData = { data: response.data.data.user, status: response.status };
      return responceData;
    } else {
      toast.error(response.data.message);
      return responceData;
    }
  };
};

/**
 * It's an async function that takes in a dispatch function and returns a response from the API
 * @param data - The data you want to send to the API.
 * @returns The response from the API call.
 */
export const allPartnerListingApiCall = (data) => {
  return async () => {
    const response = await api(partnerList, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
/**
 * It's an async function that takes a data object as an argument, and returns a function that takes a
 * dispatch function as an argument
 * @param data - The data you want to send to the server.
 */
export const partnerAddApiCall = (data) => {
  return async () => {
    let responceData = { data: null, status: null };
    const response = await api(partnerAdd, data, "postMultipart");
    if (response.status === 200) {
      toast.success("Partner Invited Successfully");
      responceData = { data: response.data.data.user, status: response.status };
      router.push("/partner");
      return responceData;
    } else {
      toast.error(response.data.message);
      return responceData;
    }
  };
};

/**
 * It makes an API call to the endpoint `partnerMemberList` with the data passed to it and returns the
 * response
 * @param data - The data you want to send to the API.
 * @returns The response from the API call.
 */
export const partnerMemberListApiCall = (data) => {
  return async () => {
    const response = await api(partnerMemberList, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the server, and if the response is successful, it redirects the user to the
 * partner page and displays a success message
 * @param data - The data to be sent to the API.
 */
export const partnerUpdateApiCall = (data, prefix, router) => {
  return async () => {
    const response = await api(partnerUpdate, data, "postMultipart");
    if (response.status === 200) {
      router.replace(`${prefix}/partner`);
      toast.success("Partner Updated Successfully");
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
