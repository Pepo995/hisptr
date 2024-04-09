import { toast } from "react-toastify";
import { api } from "~/api";
import {
  contentAdd,
  contentDelete,
  contentGet,
  contentList,
  contentUpdate,
} from "@configs/ApiEndpoints";
import { type BaseAction, type FilterAndPagination } from "@types";
//media list api call
export const videoListingApiCall = (data: FilterAndPagination) => {
  return async () => {
    const response = await (api(contentList, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//media delete api call
export const mediaDeleteByIdApiCall = (data: { id: number; type: string }) => {
  return async () => {
    const response = await (api(
      `${contentDelete}/${data?.id}`,
      {},
      "delete",
    ) as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(`${data?.type} deleted successfully`);
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//media get by id
export const mediaGetByIdApiCall = (data: { id: number; type: string }) => {
  return async () => {
    const response = await (api(contentGet, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

//add media pai call
export const mediaAddApiCall = (data: FormData, type: string) => {
  return async () => {
    const response = await (api(contentAdd, data, "postMultipart") as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(`${type} added successfully`);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};

//update media pai call
export const mediaUpdateApiCall = (data: FormData, type: string) => {
  return async () => {
    const response = await (api(contentUpdate, data, "postMultipart") as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(`${type} updated successfully`);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//resource list api
export const contentListingApiCall = (data: FilterAndPagination) => {
  return async () => {
    const response = await (api(contentList, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
