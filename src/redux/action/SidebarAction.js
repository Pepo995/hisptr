import { toast } from "react-toastify";
import { api } from "~/api";
import { SIDEBAR_LIST, SIDEBAR_TOTAL } from "@constants/ReducerConstants";
import { moduleList } from "@configs/ApiEndpoints";

/**
 * It's an async function that takes in a dispatch function as a parameter, makes an API call, and then
 * dispatches an action with the response data
 * @returns An object with a type and a payload.
 */
export const getSidebarList = () => {
  return async (dispatch) => {
    const response = await api(moduleList, {}, "post");
    if (response.status === 200) {
      dispatch({
        type: SIDEBAR_LIST,
        payload: response.data.data.modules,
      });
      dispatch({
        type: SIDEBAR_TOTAL,
        payload: response.data.data.count,
      });
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
