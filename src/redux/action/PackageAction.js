import { toast } from "react-toastify";
import { api } from "~/api";
import { PACKAGE_LIST, PACKAGE_TOTAL } from "@constants/CommonConstants";
import { packageList } from "@configs/ApiEndpoints";
/**
 * It makes an API call to the backend for country list and  sorts the data, and then dispatches the data to the reducer
 */
export const packageListApiCall = () => {
  return async (dispatch) => {
    const response = await api(packageList, {}, "get");
    const sortData = [...response.data.data.packages];
    sortData.sort(function (a, b) {
      return a.display_order - b.display_order;
    });
    if (response.status === 200) {
      dispatch({
        type: PACKAGE_LIST,
        payload: sortData,
      });
      dispatch({
        type: PACKAGE_TOTAL,
        payload: response.data.data.packages.length,
      });
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
