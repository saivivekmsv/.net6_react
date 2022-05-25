import {
  APP_LAYOUT_SET_SELECTED_MENU,
  APP_LAYOUT_SET_COMPANY_DETAILS,
  APP_LAYOUT_SET_PLAN_DETAILS,
  APP_LAYOUT_SET_ELIGIBILITY_DETAILS,
} from "./actions";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case APP_LAYOUT_SET_SELECTED_MENU:
      return {
        ...state,
        selectedMenu: payload,
      };
    case APP_LAYOUT_SET_COMPANY_DETAILS:
      return {
        ...state,
        companyDetails: payload,
      };
    case APP_LAYOUT_SET_PLAN_DETAILS:
      return {
        ...state,
        planDetails: payload,
      };
    case APP_LAYOUT_SET_ELIGIBILITY_DETAILS:
      return {
        ...state,
        eligibilityDetails: payload,
      };
    default:
      return state;
  }
};

export default reducer;
