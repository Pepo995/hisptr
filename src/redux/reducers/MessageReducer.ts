import { type PayloadAction } from "@reduxjs/toolkit";
import { MESSAGE_LIST, MESSAGE_TOTAL } from "@constants/ReducerConstants";

// import from files
const initialState = {
  messsageList: [],
  totalMessage: 0,
};
// reducer for shop listing
const MessageReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case MESSAGE_LIST:
      return { ...state, messsageList: action.payload };
    case MESSAGE_TOTAL:
      return { ...state, totalMessage: action.payload };
    default: {
      return state;
    }
  }
};
export default MessageReducer;
