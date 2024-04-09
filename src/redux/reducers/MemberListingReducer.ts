import { type PayloadAction } from "@reduxjs/toolkit";
// import from files
const initState = {
  memberData: [],
  totalMemberData: 0,
};
// reducer for shop listing
const MemberListingReducer = (state = initState, action: PayloadAction) => {
  switch (action.type) {
    case "MEMBER_LIST":
      return { ...state, memberData: action.payload };
    case "MEMBER_TOTAL":
      return { ...state, totalMemberData: action.payload };
    default: {
      return state;
    }
  }
};
export default MemberListingReducer;
