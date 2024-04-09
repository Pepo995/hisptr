import { type PayloadAction } from "@reduxjs/toolkit";
import {
  PARTNER_LIST,
  PARTNER_TOTAL,
  PARTNER_USER_LIST,
  TOTAL_PARTNER_USER,
} from "@constants/ReducerConstants";

const initialState = {
  partner: [],
  totalPartner: 0,
  partnerUserData: null,
  totalPartnerUserData: null,
};

const PartnerReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case PARTNER_USER_LIST:
      return { ...state, partnerUserData: action.payload };
    case TOTAL_PARTNER_USER:
      return { ...state, totalpartnerUserData: action.payload };
    case PARTNER_LIST:
      return { ...state, partner: action.payload };
    case PARTNER_TOTAL:
      return { ...state, totalPartner: action.payload };
    default: {
      return state;
    }
  }
};
export default PartnerReducer;
