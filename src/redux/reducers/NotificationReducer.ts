import { type PayloadAction } from "@reduxjs/toolkit";
import {
  NOTIFICATION_LIST,
  NOTIFICATION_TOTAL,
  RECIPIENT_LIST,
  RECIPIENT_TOTAL,
} from "@constants/ReducerConstants";

const initialState = {
  notification: [],
  totalNotification: 0,
  recipient: [],
  totalRecipient: 0,
};
// reducer for availability listing and detail view listing
const NotificationReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case NOTIFICATION_LIST:
      return { ...state, notification: action.payload };
    case NOTIFICATION_TOTAL:
      return { ...state, totalNotification: action.payload };
    case RECIPIENT_LIST:
      return { ...state, recipient: action.payload };
    case RECIPIENT_TOTAL:
      return { ...state, totalRecipient: action.payload };
    default: {
      return state;
    }
  }
};
export default NotificationReducer;
