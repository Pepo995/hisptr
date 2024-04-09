import { type PayloadAction } from "@reduxjs/toolkit";
import { COUNTRY_LIST, COUNTRY_TOTAL } from "@constants/ReducerConstants";

const initialState = {
  country: null,
  totalCountry: null,
};

const CountryReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case COUNTRY_LIST:
      return { ...state, country: action.payload };
    case COUNTRY_TOTAL:
      return { ...state, totalCountry: action.payload };
    default: {
      return state;
    }
  }
};

export default CountryReducer;
