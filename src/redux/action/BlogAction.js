import { toast } from "react-toastify";
import { api } from "~/api";
import { BLOG_CREATE, BLOG_DELETE, BLOG_UPDATE } from "@constants/ToastMsgConstants";

import { getRouterPrefix } from "@utils/platformUtils";
import { blogCreate, blogDelete, blogGetById, blogList, blogUpdate } from "@configs/ApiEndpoints";

/**
 * It makes an API call to the server and returns the response
 * @param data - The data you want to send to the API.
 */
export const blogListApiCall = (data) => {
  return async () => {
    const response = await api(blogList, data, "post");
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
 * the reducer
 * @param data - The data to be sent to the API.
 */
export const blogAddApiCall = (data, router) => {
  return async () => {
    const userType = decryptData(localStorage.getItem(USER_TYPE) ?? "");
    const response = await api(blogCreate, data, "postMultipart");
    if (response.status === 200) {
      toast.success(BLOG_CREATE);
      router.replace(`${getRouterPrefix(userType)}/blog`);
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
 * @param data - The data object that you want to send to the API.
 */
export const blogUpdateApiCall = (data, router) => {
  return async () => {
    const userType = decryptData(localStorage.getItem(USER_TYPE) ?? "");
    const response = await api(blogUpdate, data, "postMultipart");
    if (response.status === 200) {
      toast.success(BLOG_UPDATE);
      router.replace(`${getRouterPrefix(userType)}/blog`);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
/**
 * It makes an API call to the server to get a blog by id
 * @param id - The id of the blog you want to get.
 * @returns The response object.
 */
export const blogGetByIdApiCall = (id) => {
  return async () => {
    const response = await api(`${blogGetById}/${id}`, {}, "get");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
    }
  };
};
/**
 * It makes an API call to the backend to delete a blog post
 * @param id - The id of the blog you want to delete.
 */
export const blogDeleteApiCall = (id) => {
  return async () => {
    const response = await api(`${blogDelete}/${id}`, {}, "delete");
    if (response.status === 200) {
      toast.success(BLOG_DELETE);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
