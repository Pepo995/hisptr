import { type PayloadAction } from "@reduxjs/toolkit";
import {
  AVAILABILITY_DETAIL_LIST,
  AVAILABILITY_DETAIL_TOTAL,
  AVAILABILITY_LIST,
  AVAILABILITY_TOTAL,
} from "@constants/ReducerConstants";

const initialState = {
  availabilityRequest: [],
  totalAvailabilityRequest: 0,
  availabilityDetail: [],
  totalAvailabilityDetail: 0,
};
// reducer for availability listing and detail view listing
const AvailabilityReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case AVAILABILITY_LIST:
      return { ...state, availabilityRequest: action.payload };
    case AVAILABILITY_TOTAL:
      return { ...state, totalAvailabilityRequest: action.payload };
    case AVAILABILITY_DETAIL_LIST:
      return { ...state, availabilityDetail: action.payload };
    case AVAILABILITY_DETAIL_TOTAL:
      return { ...state, totalAvailabilityDetail: action.payload };
    default: {
      return state;
    }
  }
};
export default AvailabilityReducer;
