import { type PayloadAction } from "@reduxjs/toolkit";
import { SIDEBAR_LIST, SIDEBAR_TOTAL } from "@constants/ReducerConstants";

const initialState = {
  menu: [],
  menuTotal: 0,
};
const SidebarReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case SIDEBAR_LIST:
      return { ...state, menu: action.payload };
    case SIDEBAR_TOTAL:
      return { ...state, menuTotal: action.payload };
    default:
      return { ...state };
  }
};

export default SidebarReducer;
