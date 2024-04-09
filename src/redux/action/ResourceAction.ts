import { toast } from "react-toastify";
import { api } from "~/api";
import { customerFaqList, resourceList, videoList } from "@configs/ApiEndpoints";
import { type BaseAction, type FilterAndPagination, type ResourceListAction } from "@types";

/**
 * It makes an API call to the server and returns the response
 * @param data - The data you want to send to the API.
 */
export const videoListApiCall = (data: FilterAndPagination) => {
  return async () => {
    const response = await (api(videoList, data, "post") as unknown as BaseAction);
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
export const resourceListingApiCall = (data: FilterAndPagination) => {
  return async () => {
    const response = await (api(resourceList, data, "post") as unknown as ResourceListAction);
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
export const faqListingApiCall = (data: FilterAndPagination) => {
  return async () => {
    const response = await (api(customerFaqList, data, "post") as unknown as BaseAction);

    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
