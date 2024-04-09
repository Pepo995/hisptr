import Layout from "@components/layouts/layouts/VerticalLayout";
import { type ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PushToFirstMenu, decryptData } from "@utils/Utils";
import { USER_TYPE } from "@constants/CommonConstants";
import { moduleAccessApiCall } from "@redux/action/ModuleAction";
import { getSidebarList } from "@redux/action/SidebarAction";
import { getFlagAPICall, updateFlagAPICall } from "@redux/action/UserFlagAction";
import { type AnyAction } from "redux";
import { useRouter } from "next/router";
import { UserType } from "@types";
import {
  adminMenuData,
  customerMenuData,
  partnerMenuData,
  partnerUserMenuData,
} from "@components/navigation/vertical/index";

import { getRouterPrefix, sideBarData } from "@utils/platformUtils";

type LayoutProps = {
  children: ReactElement;
};

const VerticalLayout = (props: LayoutProps) => {
  const userType = decryptData(localStorage.getItem(USER_TYPE) ?? "") as UserType;

  let menuList;

  switch (userType) {
    case UserType.SUPER_ADMIN:
      menuList = adminMenuData;
      break;
    case UserType.MEMBER:
      menuList = sideBarData();
      break;
    case UserType.PARTNER:
      menuList = partnerMenuData;
      break;
    case UserType.PARTNER_USER:
      menuList = partnerUserMenuData;
      break;
    case UserType.CUSTOMER:
      menuList = customerMenuData;
      break;
    default:
      break;
  }

  const dispatch = useDispatch();
  const router = useRouter();

  //onload check if user permission is updated or not
  const checkUserUpdate = () => {
    const response = dispatch(getFlagAPICall() as unknown as AnyAction);
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.data.data.user.module_flag === 1) {
        const menuData = dispatch(getSidebarList() as unknown as AnyAction);
        if (menuData.status === 200) {
          const accessResponse = dispatch(moduleAccessApiCall() as unknown as AnyAction);
          if (accessResponse.status === 200) {
            PushToFirstMenu(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              accessResponse.data,
              getRouterPrefix(userType),
              router,
            );
          }
        }
        dispatch(updateFlagAPICall() as unknown as AnyAction);
      }
    }
  };

  useEffect(() => {
    if (userType === UserType.MEMBER) checkUserUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuData = menuList;

  return (
    <Layout menuData={menuData} {...props}>
      {props.children}
    </Layout>
  );
};

export default VerticalLayout;
