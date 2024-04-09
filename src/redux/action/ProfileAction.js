import { toast } from "react-toastify";
import { api } from "~/api";
import { PARTNER_UPDATE } from "@constants/ToastMsgConstants";
import {
  FIRST_NAME,
  LAST_NAME,
  PROFILE_ADMIN_IMAGE,
  PROFILE_PARTNER_IMAGE,
} from "@constants/CommonConstants";
import { encryptData } from "@utils/Utils";
import {
  getPartner,
  getPartnerEmployee,
  profileImageDelete,
  profileImgReset,
  profileUpdate,
  updatePartnerUser,
} from "@configs/ApiEndpoints";

import { PROFILE_UPDATE } from "@constants/ToastMsgConstants";

//Partner employee listing api call
export const getPartnerEmployeeApiCall = (data) => {
  return async () => {
    const response = await api(getPartnerEmployee, data, "post");
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
//get partner details api call
export const getPartnerApiCall = (data) => {
  return async () => {
    let responseData = { status: null, data: null };
    const response = await api(`${getPartner}`, data, "post");
    responseData = { status: response.status, data: response.data.data };
    if (response.status === 200) {
      return responseData;
    } else {
      toast.error(response?.data?.message);
      return responseData;
    }
  };
};
//update partner data api call
export const updatePartnerDataApi = (data) => {
  return async () => {
    const response = await api(updatePartnerUser, data, "postMultipart");
    if (response.status === 200) {
      localStorage.setItem(FIRST_NAME, encryptData(response?.data?.data?.user?.first_name));
      localStorage.setItem(LAST_NAME, encryptData(response?.data?.data?.user?.last_name));
      localStorage.setItem(PROFILE_PARTNER_IMAGE, encryptData(response?.data?.data?.user?.picture));
      window.location.reload(false);
      toast.success(PARTNER_UPDATE);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

export const resetProRest = () => {
  return async () => {
    const response = await api(profileImgReset, {}, "delete");
    if (response.status === 200) {
      return response;
    } else {
      return response;
    }
  };
};

/**
 * It's a function that takes in a data object, and returns a function that takes in a dispatch
 * function, and returns an async function that makes an API call, and if the response is successful,
 * it updates the local storage with the new data, and if the response is unsuccessful, it shows an
 * error message
 * @param data - The data you want to send to the server.
 * @returns An object with a function as a property.
 */
export const profileApiCall = (data) => {
  return async () => {
    const response = await api(profileUpdate, data, "postMultipart");
    if (response.status === 200) {
      localStorage.setItem(PROFILE_ADMIN_IMAGE, encryptData(response.data.data.user.picture));
      localStorage.setItem(FIRST_NAME, encryptData(response.data.data.user.first_name));
      localStorage.setItem(LAST_NAME, encryptData(response.data.data.user.last_name));
      window.location.reload(false);
      toast.success(PROFILE_UPDATE);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to delete an image
 * @returns A function that returns a function that returns a function.
 */
export const deleteImgApiCall = () => {
  return async () => {
    const response = await api(profileImageDelete, {}, "delete");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
