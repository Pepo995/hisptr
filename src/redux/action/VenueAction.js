import { toast } from "react-toastify";

import { api } from "~/api";
import { VENUE_LIST, VENUE_TOTAL } from "@constants/ReducerConstants";
import { venueList } from "@configs/ApiEndpoints";
/**
 * It's an async function that takes in a data object, makes an API call, and returns the response
 * @param data - The data you want to send to the API.
 */
export const venueListApiCalls = (data) => {
  return async (dispatch) => {
    const response = await api(venueList, data, "postMultipart");
    if (response?.status === 200) {
      dispatch({
        type: VENUE_LIST,
        payload: response.data.data.venues,
      });
      dispatch({
        type: VENUE_TOTAL,
        payload: response.data.data.count,
      });
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
