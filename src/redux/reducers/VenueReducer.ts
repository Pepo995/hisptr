import { type PayloadAction } from "@reduxjs/toolkit";
import { VENUE_LIST, VENUE_TOTAL } from "@constants/ReducerConstants";
const initialState = {
  venue: [],
  totalVenue: 0,
};

const VenueReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case VENUE_LIST:
      return { ...state, venue: action.payload };
    case VENUE_TOTAL:
      return { ...state, totalVenue: action.payload };
    default: {
      return state;
    }
  }
};
export default VenueReducer;
