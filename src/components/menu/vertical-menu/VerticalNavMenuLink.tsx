// ** Third Party Components
import classnames from "classnames";
import { useTranslation } from "react-i18next";

// ** Reactstrap Imports
import { Badge } from "reactstrap";
import { useDispatch } from "react-redux";
import {
  getFlagAPICall,
  updateFlagAPICall,
} from "@redux/action/UserFlagAction";
import { USER_TYPE } from "@constants/CommonConstants";
import { getSidebarList } from "@redux/action/SidebarAction";
import { moduleAccessApiCall } from "@redux/action/ModuleAction";
import { PushToFirstMenu, decryptData } from "@utils/Utils";
import { getRouterPrefix } from "@utils/platformUtils";
import { useRouter } from "next/router";
import Link from "@components/ActiveLink";
import { UserType } from "@types";
import { type AnyAction } from "@reduxjs/toolkit";

const VerticalNavMenuLink = ({ item, activeItem }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? "a" : Link;

  // ** Hooks
  const { t } = useTranslation();
  //onclick check if user permission is updated or not
  const userType = decryptData(
    localStorage.getItem(USER_TYPE) ?? "",
  ) as UserType;

  const checkUserUpdate = () => {
    const isSuperAdmin = userType === UserType.SUPER_ADMIN;
    const response = dispatch(getFlagAPICall() as unknown as AnyAction);
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.data.data.user.module_flag === 1) {
        const menuData = dispatch(getSidebarList() as unknown as AnyAction);
        if (menuData.status === 200) {
          if (!isSuperAdmin) {
            const accessResponse = dispatch(
              moduleAccessApiCall() as unknown as AnyAction,
            );
            if (accessResponse.status === 200) {
              PushToFirstMenu(
                accessResponse.data,
                getRouterPrefix(userType),
                router,
              );
            }
          } else {
            PushToFirstMenu(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              menuData.data.data.modules,
              getRouterPrefix(userType),
              router,
            );
          }
        }
        dispatch(updateFlagAPICall() as unknown as AnyAction);
      }
    }
  };

  const handleMenuItemClicked = () => {
    switch (userType) {
      case UserType.SUPER_ADMIN:
      case UserType.MEMBER:
        checkUserUpdate();
        break;
      default:
        break;
    }
  };

  return (
    <li
      className={classnames({
        "nav-item": !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem,
      })}
    >
      <LinkTag
        className="d-flex align-items-center"
        target={item.newTab ? "_blank" : undefined}
        href={`/${getRouterPrefix(userType)}${item.navLink}` || "/"}
        onClick={(e) => {
          if (
            item.navLink.length === 0 ||
            item.navLink === "#" ||
            item.disabled === true
          ) {
            e.preventDefault();
          }
        }}
      >
        {item.icon}
        <span
          className="menu-item text-truncate"
          onClick={handleMenuItemClicked}
        >
          {t(item.title)}
        </span>

        {item.badge && item.badgeText ? (
          <Badge className="ms-auto me-1" color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  );
};

export default VerticalNavMenuLink;
