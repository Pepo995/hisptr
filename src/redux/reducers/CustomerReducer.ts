import { type PayloadAction } from "@reduxjs/toolkit";
import { CUSTOMER_LIST, CUSTOMER_TOTAL } from "@constants/ReducerConstants";
import { type UserFromPhp } from "@types";

const initialState = {
  customer: [],
  totalCustomer: 0,
  customerUserData: null,
  totalCustomerUserData: null,
};

const CustomerReducer = (state = initialState, action: PayloadAction<number | UserFromPhp[]>) => {
  switch (action.type) {
    case "CUSTOMER":
      return { ...state, customerUserData: action.payload };
    case "TOTAL_CUSTOMERS":
      return { ...state, totalCustomerUserData: action.payload };
    case CUSTOMER_LIST:
      return { ...state, customer: action.payload };
    case CUSTOMER_TOTAL:
      return { ...state, totalCustomer: action.payload };
    default: {
      return state;
    }
  }
};
export default CustomerReducer;
