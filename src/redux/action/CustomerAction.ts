import { toast } from "react-toastify";
import { api } from "../../api";
import {
  BEARER_TOKEN,
  CUSTOMER_FCM_TOKEN,
  FIRST_ADMIN_NAME,
  FIRST_NAME,
  LAST_ADMIN_NAME,
  LAST_NAME,
  LOGOUT,
  PROFILE_ADMIN_IMAGE,
  PROFILE_CUSTOMER_IMAGE,
  USER_TYPE,
} from "@constants/CommonConstants";
import { encryptData } from "@utils/Utils";
import { type NextRouter } from "next/router";
import {
  authForgotPassword,
  authLogout,
  authResetPassword,
  authSignup,
  customerGetById,
  customerListing,
  profileUpdate,
  signupEventDetails,
  userDetails,
  userDetailsSignIn,
} from "@configs/ApiEndpoints";
import { CUSTOMER_LIST, CUSTOMER_TOTAL } from "@constants/ReducerConstants";
import { type BaseAction, type FilterAndPagination, type GetUsersAction } from "@types";
import { type Dispatch } from "react";
import { type UserFromPhp } from "@types";
import axios from "axios";

/**
 * It's an async function that makes an API call to the backend for get customer by id, and returns the response
 * @param data - The data you want to send to the API.
 */
export const customerByIdApiCall = (data: object) => async () => {
  const response = await (api(customerGetById, data, "post") as unknown as BaseAction);

  if (response.status !== 200) {
    toast.error(response.data.message);
  }

  return response;
};

/**
 * It makes an API call to the server for update profile, and if the response is successful, it updates the local storage
 * with the new profile image, and if the response is not successful, it shows an error message
 * @param data - The data you want to send to the API.
 */
export const profileUpdateApiCall = (data: object) => {
  return async () => {
    const response = await api(profileUpdate, data, "postMultipart");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const { picture, first_name, last_name } = response?.data?.data?.user;

    if (response.status === 200) {
      localStorage.setItem(
        PROFILE_CUSTOMER_IMAGE,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        encryptData(picture) ?? "",
      );
      localStorage.setItem(
        FIRST_NAME,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        encryptData(first_name) ?? "",
      );
      localStorage.setItem(
        LAST_NAME,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        encryptData(last_name) ?? "",
      );
      window.location.reload();
      toast.success("Profile updated successfully");
      return response;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend for signup and returns the response
 * @param data - The data you want to send to the API.
 */
export const signUpApiCall = (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  acceptTerms: boolean;
}) => {
  return async () => {
    const response = await api(authSignup, data, "postMultipart");
    if (response.status === 200) {
      toast.success("Customer registered successfully");
      return response;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(response.data.message);
      return response;
    }
  };
};
/**
 * It makes an API call to the backend for signup and returns the response
 * @param data - The data you want to send to the API.
 */
export const getUserApiCall = (data: object) => {
  return async () => {
    const response = await api(userDetails, data, "post");
    if (response.status === 200) {
      // toast.success('Customer registered successfully')
      return response;
    } else {
      // toast.error(response.data.message)
      return response;
    }
  };
};
/**
 * It makes an API call to the backend for signup and returns the response
 * @param data - The data you want to send to the API.
 */
export const getUserSignInApiCall = (data: object) => {
  return async () => {
    const response = await api(userDetailsSignIn, data, "post");
    if (response.status === 200) {
      // toast.success('Customer registered successfully')
      return response;
    } else {
      // toast.error(response.data.message)
      return response;
    }
  };
};
/**
 * It makes an API call to the backend and returns the response
 * @param data - The data you want to send to the API.
 * @returns A function that returns a function that returns a promise.
 */
export const forgotPasswordApiCall = (data: object) => {
  return async () => {
    const response = await api(authForgotPassword, data, "post");
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.success(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      return { data: response.data.data, status: response.status };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(response.data.message);
    }
  };
};

/**
 * It makes an API call to the backend to reset the user's password
 * @param data - The data to be sent to the API.
 * @returns A function that returns a promise.
 */
export const resetPasswordApiCall = (data: object, router: NextRouter) => {
  return async () => {
    const response = await api(authResetPassword, data, "post");
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.success(response.data.message);
      // router.replace("/signin");
      await router.push("/signin");
      // window.location.reload(false)
      return response;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(response.data.message);
    }
  };
};

/**
 * It makes an API call to the backend, and if the response is successful, it removes the user's data
 * from localStorage and redirects them to the home page
 * @returns A function that returns a function that returns a promise.
 */
export const logoutApiCall = (router: NextRouter) => {
  return async () => {
    const response = await api(authLogout, {}, "post");
    if (response.status === 200) {
      await axios.post("/api/auth", { token: "" });
      localStorage.removeItem(BEARER_TOKEN);
      localStorage.removeItem(FIRST_ADMIN_NAME);
      localStorage.removeItem(LAST_ADMIN_NAME);
      localStorage.removeItem(PROFILE_ADMIN_IMAGE);
      localStorage.removeItem(USER_TYPE);
      localStorage.removeItem(CUSTOMER_FCM_TOKEN);
      toast.success(LOGOUT);
      // router.replace("/home");
      await router.push("/");
      return response;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data to be sent to the API.
 * @returns A function that returns a promise.
 */
export const signupEventDetailApiCall = (data: object) => {
  return async () => {
    const response = await api(signupEventDetails, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(response.data.message);
      return response;
    }
  };
};

/**
 * It makes an API call to the backend and returns the response
 * @param data - The data to be sent to the API.
 * @returns The response from the api call.
 */
export const customerListingApiCall = (data: FilterAndPagination) => {
  return async (dispatch: Dispatch<{ type: string; payload: number | UserFromPhp[] }>) => {
    const response = await (api(customerListing, data, "post") as unknown as GetUsersAction);
    if (response.status === 200) {
      dispatch({
        type: CUSTOMER_LIST,
        payload: response.data.data.users,
      });
      dispatch({
        type: CUSTOMER_TOTAL,
        payload: response.data.data.count,
      });
      return response;
    } else {
      toast.error(response.data.message);
    }
  };
};
