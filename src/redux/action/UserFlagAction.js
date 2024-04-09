import { toast } from "react-toastify";

import { api } from "~/api";
import { getFlag, updateFlag } from "@configs/ApiEndpoints";

export const getFlagAPICall = () => {
  return async () => {
    const response = await api(getFlag, {}, "get");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
export const updateFlagAPICall = () => {
  return async () => {
    const response = await api(updateFlag, {}, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
