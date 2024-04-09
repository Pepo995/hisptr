import { toast } from "react-toastify";
import { api } from "~/api";
import {
  DELETE_MEMBER,
  MEMBER_ADD,
  MEMBER_EDIT,
  USER_STATUS_UPDATED,
} from "@constants/ToastMsgConstants";
import {
  addMember,
  deleteMember,
  editMember,
  getMember,
  listMembers,
  memberStatusUpdate,
} from "@configs/ApiEndpoints";

/**
 * It's an async function that makes an API call to the backend, and if the response is successful, it
 * dispatches an action to the reducer
 * @param data - The data object that you want to send to the API.
 * @returns An object with a type and a payload.
 */
export const memberListingApiCall = (data) => {
  return async (dispatch) => {
    const response = await api(listMembers, data, "post");

    if (response.status === 200) {
      dispatch({
        type: "MEMBER_LIST",
        payload: response.data.data.users,
      });
      dispatch({
        type: "MEMBER_TOTAL",
        payload: response.data.data.count,
      });
    } else {
      toast.error(response.data.message);
    }
  };
};

/**
 * It makes an API call to delete a member
 * @param data - The data to be sent to the API.
 * @returns A function that returns a function that returns a promise.
 */
export const deleteMemberApiCall = (data) => {
  return async () => {
    const response = await api(deleteMember, data, "post");
    if (response.status === 200) {
      toast.success(DELETE_MEMBER);
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data to be sent to the API.
 * @returns A function that returns a promise.
 */
export const addMemberApiCall = (data) => {
  return async () => {
    const response = await api(addMember, data, "post");
    if (response.status === 200) {
      toast.success(MEMBER_ADD);
      router.replace("/admin/hipstr-member");
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
/**
 * It makes an API call to the backend to edit a member
 * @param data - The data to be sent to the API.
 * @returns A function that returns a promise.
 */
export const editMemberApiCall = (data) => {
  return async () => {
    const response = await api(editMember, data, "post");
    if (response.status === 200) {
      toast.success(MEMBER_EDIT);
      router.replace("/admin/hipstr-member");
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
export const getMemberApiCall = (data) => {
  return async () => {
    const response = await api(`${getMember}`, data, "post");
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
export const statusUpdateAPiCall = (data) => {
  return async () => {
    const response = await api(memberStatusUpdate, data, "post");
    if (response.status === 200) {
      toast.success(USER_STATUS_UPDATED);
      return response;
    } else {
      toast.error(response?.data?.message);
      return response;
    }
  };
};
