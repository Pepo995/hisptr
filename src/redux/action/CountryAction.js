import { toast } from "react-toastify";
import { Config } from "../../configs/Config";
import { api } from "~/api";
import { COUNTRY_LIST, COUNTRY_TOTAL } from "@constants/ReducerConstants";
import { countryList, stateList } from "@configs/ApiEndpoints";

/**
 * It's an async function that takes a dispatch function as an argument, makes an API call for country list, and
 * dispatches an action with the response data
 */
export const countryListApiCall = () => {
  return async (dispatch) => {
    const response = await api(countryList, {}, "post");
    if (response.status === 200) {
      dispatch({
        type: COUNTRY_LIST,
        payload: response.data.data.countries,
      });
      dispatch({
        type: COUNTRY_TOTAL,
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
 * @param data - The data you want to send to the API.
 */
export const stateApiCall = (data) => {
  return async () => {
    const response = await api(stateList, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
