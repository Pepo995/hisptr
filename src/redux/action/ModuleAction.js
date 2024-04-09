import { toast } from "react-toastify";
import { api } from "~/api";
import {
  MODULE_ACCESS_LIST,
  MODULE_ACCESS_TOTAL,
  MODULE_LIST,
  MODULE_TOTAL,
} from "@constants/ReducerConstants";
import { moduleAccess, moduleList } from "@configs/ApiEndpoints";

/**
 * It's an async function that takes a dispatch function as an argument, makes an API call, and
 * dispatches an action with the response data
 */
export const moduleFetchApiCall = () => {
  return async (dispatch) => {
    const response = await api(moduleList, {}, "post");
    if (response.status === 200) {
      const sortedModule = [];
      /* Filtering the response data and pushing the filtered data into a new array. */
      response.data.data.modules.map((e) => e.parent_code === null && sortedModule.push(e));
      /* Sorting the array based on the display_order property. */
      sortedModule.sort(function (a, b) {
        return a.display_order - b.display_order;
      });
      dispatch({
        type: MODULE_LIST,
        payload: sortedModule,
      });
      dispatch({
        type: MODULE_TOTAL,
        payload: sortedModule?.length,
      });
      return {
        status: response.status,
        data: sortedModule,
        total: sortedModule?.length,
      };
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
/**
 * It's an async function that takes a dispatch function as an argument, makes an API call, and
 * dispatches an action with the response data
 */
export const moduleAccessApiCall = () => {
  return async (dispatch) => {
    const response = await api(moduleAccess, {}, "get");
    if (response.status === 200) {
      dispatch({
        type: MODULE_ACCESS_LIST,
        payload: response.data.data.modules,
      });
      dispatch({
        type: MODULE_ACCESS_TOTAL,
        payload: response.data.data.modules.length,
      });
      return {
        status: response.status,
        data: response.data.data.modules,
        total: response.data.data.count,
      };
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
