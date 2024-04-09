import { type PayloadAction } from "@reduxjs/toolkit";
import {
  CLIENT_SUPPORT_LIST,
  CLIENT_SUPPORT_TOTAL,
  PARTNER_SUPPORT_LIST,
  PARTNER_SUPPORT_TOTAL,
  SUPPORT_LIST,
  SUPPORT_TOTAL,
} from "@constants/ReducerConstants";

// import from files
const initialState = {
  partnerTicket: [],
  totalPartnerTicket: 0,
  clientTicket: [],
  totalClientTicket: 0,
  ticket: [],
  totalTicket: 0,
};
// reducer for shop listing
const SupportReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case SUPPORT_LIST:
      return { ...state, ticket: action.payload };
    case SUPPORT_TOTAL:
      return { ...state, totalTicket: action.payload };
    case PARTNER_SUPPORT_LIST:
      return { ...state, partnerTicket: action.payload };
    case PARTNER_SUPPORT_TOTAL:
      return { ...state, totalPartnerTicket: action.payload };
    case CLIENT_SUPPORT_LIST:
      return { ...state, clientTicket: action.payload };
    case CLIENT_SUPPORT_TOTAL:
      return { ...state, totalClientTicket: action.payload };
    default: {
      return state;
    }
  }
};
export default SupportReducer;
