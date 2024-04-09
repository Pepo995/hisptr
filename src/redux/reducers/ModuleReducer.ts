import { type PayloadAction } from "@reduxjs/toolkit";
import {
  MODULE_ACCESS_LIST,
  MODULE_ACCESS_TOTAL,
  MODULE_LIST,
  MODULE_TOTAL,
} from "@constants/ReducerConstants";

const initialState = {
  module: [],
  totalModule: 0,
  permisson: [],
  totalPermisson: 0,
};

const ModuleReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case MODULE_LIST:
      return { ...state, module: action.payload };
    case MODULE_TOTAL:
      return { ...state, totalModule: action.payload };
    case MODULE_ACCESS_LIST:
      return { ...state, permisson: action.payload };
    case MODULE_ACCESS_TOTAL:
      return { ...state, totalPermisson: action.payload };
    default: {
      return state;
    }
  }
};

export default ModuleReducer;
