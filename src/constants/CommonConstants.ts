import { type events_admin_status } from "@prisma/client";
import { type AdminStatusLabels, eventVenueDetailsCOI } from "@types";

export const ADMIN = "admin";
export const AGREEMENT_SIZE = 10000000;
export const AGREEMENT_SUPPORTED_FORMATS = ["application/pdf"];
export const BEARER_TOKEN = "HipStrAdminToken";
// export const BEARER_TOKEN = "HipStrCustomerToken";
// export const BEARER_TOKEN = "HipStrPartnerToken";
export const BLOG = "blog";
export const CUSTOMER = "customer";
export const CUSTOMER_FCM_TOKEN = "HipStrCustomerFcm";
export const DEFAULT_PASSWORD = "P@$$w0rd!";
export const DELETE_MEMBER = "Member deleted successfully";
export const FAQ = "faq";
export const FCM_TOKEN = "FCM_TOKEN";
export const FIRST_ADMIN_NAME = "HipStrAdminFirstName";
export const FIRST_CUSTOMER_NAME = "HipStrCustomerFirstName";
export const FIRST_NAME = "HipStrPartnerFirstName";
export const LAST_ADMIN_NAME = "HipStrAdminLastName";
export const LAST_CUSTOMER_NAME = "HipStrCustomerLastName";
export const LAST_NAME = "HipStrPartnerLastName";
export const LOGOUT = "Logout successfully";
export const MEMBER = "member";
export const MEMBER_ADD = "Member added successfully";
export const MEMBER_EDIT = "Member Updated successfully";
export const MODULE_ADMIN_LIST = "HipStrModuleList";
export const MODULE_CUSTOMER_LIST = "HipStrCustomerList";
export const MODULE_LIST = "HipStrPartnerList";
export const NOTIFICATION_LIMIT = 3;
export const PACKAGE_LIST = "PACKAGE_LIST";
export const PACKAGE_TOTAL = "PACKAGE_TOTAL";
export const PARTNER = "partner";
export const PARTNER_ADD = "Partner added successfully";
export const PARTNER_EDIT = "Partner updated successfully";
export const PROFILE_ADMIN_IMAGE = "HipStrAdminProfileImage";
export const PROFILE_CUSTOMER_IMAGE = "HipStrCustomerProfileImage";
export const PROFILE_PARTNER_IMAGE = "HipStrPartnerProfileImage";
export const REMEMBER = "HipStrRemember";
export const RESOURCES = "resource";
export const ROLE = "role";
export const SELECT_ONE_PERMISSON = "Please select at least one permission";
export const SET_PASSWORD = "Password Set successfully";
export const TYPE_MEMBER = "member";
export const TYPE_PARTNER = "partner";
export const TYPE_PARTNER_USER = "partner user";
export const USER = "HipStrPartnerUser";
export const USER_ID = "HipStrAdminUser";
export const USER_TYPE = "HipStrAdminType";
export const USER_CUSTOMER = "HipStrCustomerUser";
// export const USER_TYPE = "HipStrCustomerType";
// export const USER_TYPE = "HipStrPartnerType";
export const VIDEO = "video";

export const TICKET_STATUS = new Map();
TICKET_STATUS.set("close", "Closed");
TICKET_STATUS.set("inprogress", "In Progress");
TICKET_STATUS.set("open", "Open");

type EventStatusAction = {
  label: string;
  href?: (id: bigint) => string;
};

export const EVENT_STATUS = new Map<events_admin_status, EventStatusAction>();
EVENT_STATUS.set("awaiting", {
  label: "Awaiting event details, please complete the required event details.",
});
EVENT_STATUS.set("detail_recieved", {
  label:
    "Sit back and Relax. There’s no action required at this time. We’re prepping for your event on our end and will get back to you soon.",
  href: (id) => `/customer/event-management/upcoming-event/edit-event-detail/${id}`,
});
EVENT_STATUS.set("in_planning", {
  label:
    "Sit back and Relax. There’s no action required at this time. We’re prepping for your event on our end and will get back to you soon.",
  href: (id) => `/customer/event-management/upcoming-event/edit-event-detail/${id}`,
});
EVENT_STATUS.set("awaiting_for_host", {
  label:
    "There’s no action required at this time. We’re taking our final steps to complete our preparation for your event.",
  href: (id) => `/customer/event-management/upcoming-event/edit-event-detail/${id}`,
});
EVENT_STATUS.set("ready_to_execute", {
  label:
    "There’s no additional action required at this time. We’re prepared for your event and looking forward to seeing you soon.",
  href: (id) => `/customer/event-management/upcoming-event/edit-event-detail/${id}`,
});
EVENT_STATUS.set("serviced", {
  label: "Your Event has been serviced. We hope you enjoyed your event.",
  href: (id) => `/customer/event-management/upcoming-event/edit-event-detail/${id}`,
});

export const EVENT_ADMIN_STATUS_LABEL = new Map<events_admin_status, AdminStatusLabels>();

EVENT_ADMIN_STATUS_LABEL.set("awaiting", "Awaiting Admin Confirmation");
EVENT_ADMIN_STATUS_LABEL.set("confirmed", "Awaiting Event Details");
EVENT_ADMIN_STATUS_LABEL.set("detail_recieved", "Event Details Received");
EVENT_ADMIN_STATUS_LABEL.set("in_planning", "Event Planning In Progress");
EVENT_ADMIN_STATUS_LABEL.set("awaiting_for_host", "Awaiting Host Details");
EVENT_ADMIN_STATUS_LABEL.set("ready_to_execute", "Ready To Execute Event");
EVENT_ADMIN_STATUS_LABEL.set("serviced", "Event Serviced");

export const COILabels = new Map<eventVenueDetailsCOI, string>();
COILabels.set(eventVenueDetailsCOI.send, "Send");
COILabels.set(eventVenueDetailsCOI.notRequire, "Not Required");
COILabels.set(eventVenueDetailsCOI.requireCustom, "Require Custom");
COILabels.set(eventVenueDetailsCOI.notSure, "Not Sure");
