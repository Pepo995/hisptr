import { toast } from "react-toastify";

import { api } from "~/api";
import { ROLE_LIST, ROLE_TOTAL } from "@constants/ReducerConstants";
import { ROLE_ADD, ROLE_DELETE, ROLE_UPDATE } from "@constants/ToastMsgConstants";

import {
  roleAdd,
  roleById,
  roleDelete,
  roleList,
  roleUpdate,
  roleWiseUserList,
} from "@configs/ApiEndpoints";

/**
 * It's an async function that takes in a data object, makes an API call, and dispatches an action with
 * the response data
 * @param data - The data object that you want to send to the API.
 */
export const roleListingApiCall = (data) => {
  return async (dispatch) => {
    const response = await api(roleList, data, "post");
    if (response.status === 200) {
      dispatch({
        type: ROLE_LIST,
        payload: response.data.data.roles,
      });
      dispatch({
        type: ROLE_TOTAL,
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
 * It's a function that returns a function that returns a promise
 * @param data - The data to be sent to the API.
 */
export const roleAddApiCall = (data, router) => {
  return async () => {
    const response = await api(roleAdd, data, "post");
    if (response.status === 200) {
      toast.success(ROLE_ADD);
      router.replace("/role");
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns a response
 * @param data - The data to be sent to the API.
 */
export const roleEditApiCall = (data, router) => {
  return async () => {
    const response = await api(roleUpdate, data, "post");
    if (response.status === 200) {
      toast.success(ROLE_UPDATE);
      router.replace("/role");
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
/**
 * It makes an API call to the backend to get a role by id
 * @param id - The id of the role you want to get.
 */
export const roleGetByIdApiCall = (data) => {
  return async () => {
    let responceData = { data: null, status: null };
    const response = await api(roleById, data, "post");
    if (response.status === 200) {
      responceData = { data: response.data.data.role, status: response.status };
      return responceData;
    } else {
      toast.error(response.data.message);
      return responceData;
    }
  };
};

/**
 * It makes an API call to the backend to delete a role by id
 * @param id - The id of the role you want to delete.
 */
export const roleDeleteByIdApiCall = (id) => {
  return async () => {
    const response = await api(`${roleDelete}/${id}`, {}, "delete");
    if (response.status === 200) {
      toast.success(ROLE_DELETE);
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

export const specificRoleUserListingApiCall = (data) => {
  return async () => {
    const response = await api(roleWiseUserList, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
