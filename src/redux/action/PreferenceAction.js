import { toast } from "react-toastify";
import { api } from "~/api";
import { preferenceList } from "@configs/ApiEndpoints";
//preference listing  api call
export const PreferenceListApiCall = (data) => {
  return async () => {
    const response = await api(preferenceList, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
