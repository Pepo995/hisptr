import kebabCase from "lodash/kebabCase";
import { useSelector } from "react-redux";

import {
  AlignLeft,
  Bell,
  Briefcase,
  Calendar,
  Circle,
  Clipboard,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Headphones,
  Home,
  MapPin,
  MessageSquare,
  Settings,
  Tv,
  User,
  UserPlus,
  Users,
} from "react-feather";

import { FirstUpperCase, decryptData, isUserLoggedIn } from "./Utils";
import { USER_TYPE } from "@constants/CommonConstants";
import { components } from "react-select";
import { Badge } from "reactstrap";
import { tickets_status, type events_admin_status } from "@prisma/client";
import { type AdminStatusLabels } from "~/types/event";
import { type JSX } from "react";
import { TicketWithEventAndUser } from "@server/api/routers/customer/events";

const menuIcon = [
  { name: "dashboard", icon: <Home size={20} /> },
  { name: "account", icon: <CreditCard size={20} /> },
  { name: "customer", icon: <User size={20} /> },
  { name: "partner", icon: <Users size={20} /> },
  { name: "media", icon: <Tv size={20} /> },
  { name: "role", icon: <Briefcase size={20} /> },
  { name: "venue", icon: <MapPin size={20} /> },
  { name: "hipstr-member", icon: <UserPlus size={20} /> },
  { name: "notification-partner", icon: <Bell size={20} /> },
  { name: "notification-of-booking", icon: <Bell size={20} /> },
  { name: "event", icon: <Calendar size={20} /> },
  { name: "booking", icon: <Clipboard size={20} /> },
  { name: "activity-log", icon: <Clock size={20} /> },
  { name: "message", icon: <MessageSquare size={20} /> },
  { name: "support-request", icon: <Headphones size={20} /> },
  { name: "blog", icon: <AlignLeft size={20} /> },
  { name: "availability-check", icon: <Settings size={20} /> },
  { name: "promotional-codes", icon: <DollarSign size={20} /> },
  { name: "custom-invoice", icon: <FileText size={20} /> },
];

/**
 * It takes in a string, and returns the icon associated with that string
 * @param e - The name of the icon you want to return.
 * @returns The icon of the menu item
 */
const returnIcon = (e: string) => {
  const data = menuIcon.filter((ele) => ele.name === e);
  return data[0]?.icon;
};
//set sidebar data

export const sideBarData = () => {
  if (isUserLoggedIn()) {
    const menuList: {
      id: any;
      title: string;
      icon: JSX.Element;
      navLink: string;
      children: any;
    }[] = [];
    const tempList: any[] = [];
    const permisson = useSelector((state: any) => state?.moduleReducer?.permisson);
    const menu = useSelector((state: any) => state?.sidebar?.menu);
    menu?.map((m: { code: any }) => {
      permisson?.map((p: { module_code: any; view_access: number }) => {
        if (m.code === p.module_code && p.view_access === 1) {
          tempList.push(p);
        }
      });
    });
    const sortMenu: any[] = [];
    tempList.map((ele, i) => {
      const tempArray: { id: any; title: string; icon: JSX.Element; navLink: string }[] = [];
      if (ele?.module?.children?.length !== 0) {
        const childrenData = ele?.module?.children;
        childrenData?.map((child: { code: string | undefined; name: string }) =>
          tempArray.push({
            id: child.code,
            title: FirstUpperCase(child.name),
            icon: <Circle size={20} />,
            navLink: `/${kebabCase(child.code)}`,
          }),
        );
        sortMenu[i] = { ...ele, children: tempArray };
      } else {
        sortMenu[i] = { ...ele };
      }
    });

    sortMenu.sort(function (a, b) {
      return a.module.display_order - b.module.display_order;
    });
    sortMenu?.map((e, i) =>
      menuList.push({
        id: e.module.code,
        title: FirstUpperCase(e.module.name),
        icon: returnIcon(e.module_code),
        navLink: `/${kebabCase(e.module.code)}`,
        children: e.children,
      }),
    );

    return menuList;
  }
  // return [...menuList, ...demoMenu];
};

export const adminSideBarData = () => {
  if (isUserLoggedIn()) {
    const menuList: {
      id: any;
      title: string;
      icon: JSX.Element;
      navLink: string;
      children: any;
    }[] = [];
    const menu = useSelector((state: any) => state?.sidebar?.menu);
    const filterParentMenu = menu.filter((e: { parent_code: null }) => e.parent_code === null);
    const filterChildMenu = menu.filter((e: { parent_code: null }) => e.parent_code !== null);
    filterParentMenu.map(
      (e: any, i: string | number) =>
        (filterParentMenu[i] = { ...filterParentMenu[i], children: [] }),
    );
    const tempParentArray = [...filterParentMenu];
    filterChildMenu.map((ele: { parent_code: any }) => {
      const index = tempParentArray.findIndex((item) => item.code === ele.parent_code);
      tempParentArray[index] = {
        ...tempParentArray[index],
        children: [...tempParentArray[index].children, ele],
      };
    });
    const sortMenu: any[] = [];
    tempParentArray.map((ele, i) => {
      const tempArray: { id: any; title: string; icon: JSX.Element; navLink: string }[] = [];
      if (ele?.children?.length !== 0) {
        const childrenData = ele.children;
        childrenData.map((child: { code: string | undefined; name: string }) =>
          tempArray.push({
            id: child.code,
            title: FirstUpperCase(child.name),
            icon: <Circle size={20} />,
            navLink: `/${kebabCase(child.code)}`,
          }),
        );
        sortMenu[i] = { ...ele, children: tempArray };
      } else {
        sortMenu[i] = { ...ele, children: null };
      }
    });

    sortMenu.sort(function (a, b) {
      return a.display_order - b.display_order;
    });
    sortMenu?.map((e, i) =>
      menuList.push({
        id: e.code,
        title: FirstUpperCase(e.name),
        icon: returnIcon(e.code),
        navLink: `/${kebabCase(e.code)}`,
        children: e.children,
      }),
    );

    return menuList;
  }
};

export const checkPermisson: (moduleString: string) =>
  | {
      add_access: number;
      delete_access: number;
      edit_access: number;
      view_access: number;
    }
  | undefined = (moduleString: string) => {
  const isSuperAdmin = decryptData(localStorage.getItem(USER_TYPE) ?? "") === "superadmin";
  const superAdminPermisson = {
    add_access: 1,
    delete_access: 1,
    edit_access: 1,
    view_access: 1,
  };
  const permisson = useSelector((state: any) => state?.moduleReducer?.permisson);
  const data = permisson?.filter(
    (item: { module_code: string | undefined }) =>
      kebabCase(item?.module_code) === kebabCase(moduleString),
  );
  return isSuperAdmin ? superAdminPermisson : data[0];
};

export const OptionComponent = ({ data, ...props }: any) => {
  const Icon = data.icon;

  return (
    <components.Option {...props}>
      <Badge color={data.color} className="me-50" pill>
        <Icon size={14} />
      </Badge>
      &nbsp;
      <Badge color={data.color} pill>
        {data.label}
      </Badge>
    </components.Option>
  );
};

export type CheckIsReadElement = {
  ticket_number: number;
  id?: string;
  title?: string;
  status?: string;
  trails?: { created_by: string; is_read: number }[];
  created_at: string;
};
export const checkIsRead = (dataArray: CheckIsReadElement) => {
  if (dataArray.status === "open" || dataArray.status === "inprogress") {
    const filterData = dataArray?.trails?.filter(
      (e: { created_by: any }) => e.created_by === dataArray?.trails?.[0]?.created_by,
    );
    const check = filterData?.filter((e: { is_read: number }) => e.is_read === 0);
    return check?.length !== 0 && check?.length;
  } else {
    return false;
  }
};

export const checkIsReadTicket = (dataArray: TicketWithEventAndUser) => {
  if (dataArray.status === "open" || dataArray.status === "inprogress") {
    const filterData = dataArray?.ticketTrails?.filter(
      (e) => e.createdBy === dataArray?.ticketTrails?.[0]?.createdBy,
    );
    const check = filterData?.filter((e) => !e.isRead);
    return check?.length !== 0 && check?.length;
  } else {
    return false;
  }
};

export const ticketStatusOption: {
  label: string;
  value: tickets_status;
  icon: any;
  color: string;
}[] = [
  {
    value: "open",
    label: "Open",
    icon: FileText,
    color: "light-success",
  },
  {
    value: "inprogress",
    label: "In Progress",
    icon: FileText,
    color: "light-warning",
  },
  {
    value: "close",
    label: "Closed",
    icon: FileText,
    color: "light-danger",
  },
];

export const eventStatusOption: { label: AdminStatusLabels; value: events_admin_status }[] = [
  { label: "Hipstr Account Invite Sent", value: "invite" },
  { label: "Awaiting Admin Confirmation", value: "awaiting" },
  { label: "Cancelled by Admin", value: "cancelled" },
  { label: "Awaiting Event Details", value: "confirmed" },
  { label: "Event Details Received", value: "detail_recieved" },
  { label: "Event Planning In Progress", value: "in_planning" },
  { label: "Awaiting Host Details", value: "awaiting_for_host" },
  { label: "Ready To Execute Event", value: "ready_to_execute" },
  { label: "Event Serviced", value: "serviced" },
];

export const NoOfEntries = (page: number, perPage: number, total: number) => {
  const startingValue = (page - 1) * perPage + 1;
  const endingValue =
    startingValue + perPage - 2 >= total
      ? ((startingValue + total) % perPage) - 2 + startingValue
      : startingValue + perPage - 1;
  return total !== 0 ? `Showing ${startingValue} to ${endingValue} of ${total} entries` : "";
};

export const ticketStatusOpen = [
  {
    options: [
      {
        value: "inprogress",
        label: "In Progress",
        icon: FileText,
        color: "light-warning",
      },
      {
        value: "close",
        label: "Closed",
        icon: FileText,
        color: "light-danger",
      },
    ],
  },
];
export const ticketStatusInprogress = [
  {
    options: [
      {
        value: "close",
        label: "Closed",
        icon: FileText,
        color: "light-danger",
      },
    ],
  },
];
export const eventDateSortOption = [
  { label: "Sort by event date (A > Z)", value: "desc" },
  { label: "Sort by event date (Z > A)", value: "asc" },
];

const userTypeMap = new Map<string, string>();
userTypeMap.set("superadmin", "admin");
userTypeMap.set("member", "admin");
userTypeMap.set("partner", "partner");
userTypeMap.set("partneruser", "partner");
userTypeMap.set("customer", "customer");

export const getRouterPrefix = (userType: string) => userTypeMap.get(userType);
