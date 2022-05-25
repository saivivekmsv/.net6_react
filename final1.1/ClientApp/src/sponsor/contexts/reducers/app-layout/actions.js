export const APP_LAYOUT_SET_SELECTED_MENU = "applayout/SET_SELECTED_MENU";
export const APP_LAYOUT_SET_COMPANY_DETAILS = "applayout/SET_COMPANY_DETAILS";
export const APP_LAYOUT_SET_PLAN_DETAILS = "applayout/SET_PLAN_DETAILS";
export const APP_LAYOUT_SET_ELIGIBILITY_DETAILS =
  "applayout/SET_ELIGIBILITY_DETAILS";

export const setSelectedMenu = (payload) => ({
  type: APP_LAYOUT_SET_SELECTED_MENU,
  payload,
});

export const setCompanyDetails = (payload) => ({
  type: APP_LAYOUT_SET_COMPANY_DETAILS,
  payload,
});

export const setPlanDetails = (payload) => ({
  type: APP_LAYOUT_SET_PLAN_DETAILS,
  payload,
});

export const setEligibilityDetails = (payload) => ({
  type: APP_LAYOUT_SET_ELIGIBILITY_DETAILS,
  payload,
});
