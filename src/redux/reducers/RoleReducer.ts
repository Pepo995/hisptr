import { type PayloadAction } from "@reduxjs/toolkit";
import { ROLE_LIST, ROLE_TOTAL } from "@constants/ReducerConstants";

const initialState = {
  role: [],
  totalRole: 0,
};

const RoleReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case ROLE_LIST:
      return { ...state, role: action.payload };
    case ROLE_TOTAL:
      return { ...state, totalRole: action.payload };
    default: {
      return state;
    }
  }
};

export default RoleReducer;
