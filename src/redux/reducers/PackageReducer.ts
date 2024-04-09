import { type PayloadAction } from "@reduxjs/toolkit";
import { PACKAGE_LIST, PACKAGE_TOTAL } from "@constants/CommonConstants";

const initialState = {
  package: null,
  totalPackage: null,
};

const packageReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case PACKAGE_LIST:
      return { ...state, package: action.payload };
    case PACKAGE_TOTAL:
      return { ...state, totalPackage: action.payload };
    default: {
      return state;
    }
  }
};

export default packageReducer;
