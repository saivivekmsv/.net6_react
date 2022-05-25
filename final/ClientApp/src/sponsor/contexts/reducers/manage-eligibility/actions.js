import { getEligibilityDetails } from "../../../services";

export const MANAGE_ELIGIBILITY_SET_FLOW = "manageeligibility/SET_FLOW";
export const MANAGE_ELIGIBILITY_SET_SELECTED_MENU =
  "manageeligibility/SET_SELECTED_MENU";
export const MANAGE_ELIGIBILITY_SET_LOADER = "manageeligibility/SET_LOADER";
export const MANAGE_ELIGIBILITY_SET_FULL_PAGE_DATA =
  "manageeligibility/SET_FULL_PAGE_DATA";
export const MANAGE_ELIGIBILITY_SET_TOAST_INFO =
  "manageeligibility/SET_TOAST_INFO";
export const MANAGE_ELIGIBILITY_SET_PAGE_DATA =
  "manageeligibility/SET_PAGE_DATA";
export const MANAGE_ELIGIBILITY_GET_API_RESPONSE =
  "manageeligibility/ET_API_RESPONSE";
export const MANAGE_ELIGIBILITY_GET_API_REQUEST =
  "manageeligibility/GET_API_REQUEST";
export const MANAGE_ELIGIBILITY_GET_API_ERROR =
  "manageeligibility/N_GET_API_ERROR";
export const MANAGE_ELIGIBILITY_POST_API_RESPONSE =
  "manageeligibility/ST_API_RESPONSE";
export const MANAGE_ELIGIBILITY_POST_API_ERROR =
  "manageeligibility/_POST_API_ERROR";
export const MANAGE_ELIGIBILITY_POST_API_REQUEST =
  "manageeligibility/OST_API_REQUEST";

export const setManageEligibilitySelectedMenu = (payload) => ({
  type: MANAGE_ELIGIBILITY_SET_SELECTED_MENU,
  payload,
});

export const setManageEligibilityFlow = (payload) => ({
  type: MANAGE_ELIGIBILITY_SET_FLOW,
  payload,
});

export const setManageEligibilityLoader = (payload) => ({
  type: MANAGE_ELIGIBILITY_SET_LOADER,
  payload,
});

export const setManageEligibilityFullPageData = (payload) => ({
  type: MANAGE_ELIGIBILITY_SET_FULL_PAGE_DATA,
  payload,
});

export const setManageEligibilityToastInfo = (payload) => ({
  type: MANAGE_ELIGIBILITY_SET_TOAST_INFO,
  payload,
});

export const setManageEligibilityPageLevelData = (payload) => ({
  type: MANAGE_ELIGIBILITY_SET_PAGE_DATA,
  payload,
});

export const getEligibilityDetailsAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_ELIGIBILITY_GET_API_REQUEST,
  });

  return getEligibilityDetails(payload)
    .then((response) => {
      dispatch({
        type: MANAGE_ELIGIBILITY_GET_API_RESPONSE,
        payload: response,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_ELIGIBILITY_GET_API_ERROR,
        payload: error,
      });
    });
};
