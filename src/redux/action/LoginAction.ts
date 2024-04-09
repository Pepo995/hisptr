import { toast } from "react-toastify";
import { api } from "~/api";
import {
  BEARER_TOKEN,
  FCM_TOKEN,
  FIRST_NAME,
  LAST_NAME,
  PROFILE_PARTNER_IMAGE,
  REMEMBER,
  SET_PASSWORD,
  USER,
  USER_ID,
  USER_TYPE,
} from "@constants/CommonConstants";
import { PushToFirstMenu, encryptData } from "@utils/Utils";
import { getRouterPrefix } from "@utils/platformUtils";
import {
  INVALID_USER_TYPE,
  LOGOUT,
  MAIL_RESET_LINK_SENT,
  PASSWORD_CHANGE,
  PASSWORD_RESET,
} from "@constants/ToastMsgConstants";
import {
  MODULE_ACCESS_LIST,
  MODULE_ACCESS_TOTAL,
  SIDEBAR_LIST,
  SIDEBAR_TOTAL,
} from "@constants/ReducerConstants";
import {
  acceptInvitation,
  authChangePassword,
  authForgotPassword,
  authLogin,
  authLogout,
  authResetPassword,
  authSetPassword,
  moduleAccess,
  moduleList,
} from "@configs/ApiEndpoints";

import { type Dispatch, type SetStateAction } from "react";
import { type AnyAction } from "@reduxjs/toolkit";
import { type BaseAction, type GetModulesAction, type LoginAction } from "@types";
import { type NextRouter } from "next/router";
import axios from "axios";

//Login api action call
export const loginApiCall =
  (
    data: { email: string; password: string },
    remember: boolean,
    router: NextRouter,
    setLoading: Dispatch<SetStateAction<boolean>>,
  ) =>
  async (dispatch: Dispatch<AnyAction>) => {
    const response = await (api(authLogin, data, "post") as unknown as LoginAction);

    if (response.status === 200) {
      const rememberData = {
        ...data,
        isChecked: remember,
      };

      localStorage.setItem(REMEMBER, encryptData(JSON.stringify(rememberData)));
      localStorage.setItem(BEARER_TOKEN, encryptData(response.data.data?.token));
      localStorage.setItem(FIRST_NAME, encryptData(response.data.data.user.first_name));
      localStorage.setItem(USER, encryptData(JSON.stringify(response.data.data.user.id)));
      localStorage.setItem(LAST_NAME, encryptData(response.data.data.user.last_name));
      localStorage.setItem(
        PROFILE_PARTNER_IMAGE,
        encryptData(response.data.data.user.picture ?? ""),
      );
      localStorage.setItem(USER_TYPE, encryptData(response.data.data.user.type));
      await axios.post("/api/auth", { token: response.data.data?.token });
      if (response.data.data.user.type === "superadmin") {
        localStorage.setItem(USER_ID, encryptData(JSON.stringify(response.data.data.user.id)));
      }

      if (
        !["superadmin", "member", "partneruser", "partner", "customer"].some(
          (validType) => validType === response.data.data.user.type,
        )
      ) {
        console.error("invalid user type", response.data.data.user.type);
        toast.error(INVALID_USER_TYPE);
        setLoading(false);
        return response;
      }

      const urlPrefix = getRouterPrefix(response.data.data.user.type);

      const isAdmin =
        response.data.data.user.type === "superadmin" || response.data.data.user.type === "member";

      const isSuperAdmin = response.data.data.user.type === "superadmin";

      if (!isAdmin) {
        void router.replace(`${urlPrefix}/dashboard`);
        return;
      }

      const menuData = await (api(moduleList, {}, "post") as unknown as GetModulesAction);

      if (menuData.status === 200) {
        dispatch({
          type: SIDEBAR_LIST,
          payload: menuData.data.data.modules,
        });
        dispatch({
          type: SIDEBAR_TOTAL,
          payload: menuData.data.data.count,
        });

        if (!isSuperAdmin) {
          const accessResponse = await (api(
            moduleAccess,
            {},
            "get",
          ) as unknown as GetModulesAction);

          if (accessResponse.status === 200) {
            dispatch({
              type: MODULE_ACCESS_LIST,
              payload: accessResponse.data.data.modules,
            });
            dispatch({
              type: MODULE_ACCESS_TOTAL,
              payload: accessResponse.data.data.count,
            });

            PushToFirstMenu(accessResponse.data.data.modules, urlPrefix, router);
          }
        } else {
          PushToFirstMenu(menuData.data.data.modules, urlPrefix, router);
        }
      }

      // void router.push(`${userTypeMap.get(response.data.data.user.type)}`);
      return response;
    } else {
      toast.error(response?.data?.message);
      setLoading(false);
      return response;
    }
  };

//logout api action call
export const logoutApiCall = (router: NextRouter) => {
  return async () => {
    const response = await (api(authLogout, {}, "post") as unknown as BaseAction);
    if (response.status === 200) {
      await axios.post("/api/auth", { token: "" });
      localStorage.removeItem(BEARER_TOKEN);
      localStorage.removeItem(FIRST_NAME);
      localStorage.removeItem(LAST_NAME);
      localStorage.removeItem(PROFILE_PARTNER_IMAGE);
      localStorage.removeItem(USER_TYPE);
      localStorage.removeItem(FCM_TOKEN);
      toast.success(LOGOUT);
      void router.push("/signin");
    } else {
      toast.error(response.data.message);
    }
  };
};
//Forgotpassword api call
export const forgotPasswordApiCall = (data: { email: string }) => {
  return async () => {
    const response = await (api(authForgotPassword, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(MAIL_RESET_LINK_SENT);
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//change password api call
export const changePasswordApi = (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return async () => {
    const response = await (api(authChangePassword, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(PASSWORD_CHANGE);
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//Reset password api call
export const resetPasswordApiCall = (
  data: {
    password: string;
    password_confirmation: string;
    token: string;
  },
  router: NextRouter,
) => {
  return async () => {
    const response = await (api(authResetPassword, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(PASSWORD_RESET);
      void router.push("/signin");
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//Accept invitation api call
export const acceptInvitationApiCall = (data: { email: string; token: string }) => {
  return async () => {
    const response = await (api(acceptInvitation, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//Set password api call
export const setPasswordApiCall = (
  data: {
    password: string;
    password_confirmation: string;
    token: string;
  },
  router: NextRouter,
) => {
  return async () => {
    const response = await (api(authSetPassword, data, "post") as unknown as BaseAction);
    if (response.status === 200) {
      toast.success(SET_PASSWORD);
      void router.push("/signin");
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
