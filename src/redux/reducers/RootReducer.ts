// // ** Reducers Imports

import RoleReducer from "./RoleReducer";
import ModuleReducer from "./ModuleReducer";
import MemberListingReducer from "./MemberListingReducer";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import SidebarReducer from "./SidebarReducer";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import SupportReducer from "./SupportReducer";
import AvailabilityReducer from "./AvailabilityReducer";
import EventReducer from "./EventReducer";
import MessageReducer from "./MessageReducer";
import CustomerReducer from "./CustomerReducer";
import VenueReducer from "./VenueReducer";
import NotificationReducer from "./NotificationReducer";
import { type AppState } from "@types";
import CountryReducer from "./CountryReducer";
import PackageReducer from "./PackageReducer";
import PartnerReducer from "./PartnerReducer";

import navbar from "@redux/navbar";
import layout from "@redux/layout";

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: hardSet,
  whitelist: ["sidebar", "navbar", "layout", "module", "moduleReducer"],
};

const persisted = persistReducer(
  persistConfig,
  combineReducers<AppState>({
    navbar,
    layout,
    availabilityReducer: AvailabilityReducer,
    countryReducer: CountryReducer,
    customerReducer: CustomerReducer,
    eventReducer: EventReducer,
    memberListingReducer: MemberListingReducer,
    messageReducer: MessageReducer,
    moduleReducer: ModuleReducer,
    notificationReducer: NotificationReducer,
    packageReducer: PackageReducer,
    partnerReducer: PartnerReducer,
    roleReducer: RoleReducer,
    sidebar: SidebarReducer,
    supportReducer: SupportReducer,
    venueReducer: VenueReducer,
  }),
);

export default persisted;
