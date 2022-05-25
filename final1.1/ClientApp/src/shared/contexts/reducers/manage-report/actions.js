import { getReportsDetails } from "../../../services";

export const MANAGE_REPORTS_SET_FLOW = "managereports/SET_FLOW";
export const MANAGE_REPORTS_SET_SELECTED_MENU =
  "managereports/SET_SELECTED_MENU";
export const MANAGE_REPORTS_SET_LOADER = "managereports/SET_LOADER";
export const MANAGE_REPORTS_SET_FULL_PAGE_DATA =
  "managereports/SET_FULL_PAGE_DATA";
export const MANAGE_REPORTS_SET_TOAST_INFO = "managereports/SET_TOAST_INFO";
export const MANAGE_REPORTS_SET_PAGE_DATA = "managereports/SET_PAGE_DATA";
export const MANAGE_REPORTS_GET_API_RESPONSE = "managereports/ET_API_RESPONSE";
export const MANAGE_REPORTS_GET_API_REQUEST = "managereports/GET_API_REQUEST";
export const MANAGE_REPORTS_GET_API_ERROR = "managereports/N_GET_API_ERROR";
export const MANAGE_REPORTS_POST_API_RESPONSE = "managereports/ST_API_RESPONSE";
export const MANAGE_REPORTS_POST_API_ERROR = "managereports/_POST_API_ERROR";
export const MANAGE_REPORTS_POST_API_REQUEST = "managereports/OST_API_REQUEST";

export const setManageReportsSelectedMenu = (payload) => ({
  type: MANAGE_REPORTS_SET_SELECTED_MENU,
  payload,
});

export const setManageReportsFlow = (payload) => ({
  type: MANAGE_REPORTS_SET_FLOW,
  payload,
});

export const setManageReportsLoader = (payload) => ({
  type: MANAGE_REPORTS_SET_LOADER,
  payload,
});

export const setManageReportsFullPageData = (payload) => ({
  type: MANAGE_REPORTS_SET_FULL_PAGE_DATA,
  payload,
});

export const setManageReportsToastInfo = (payload) => ({
  type: MANAGE_REPORTS_SET_TOAST_INFO,
  payload,
});

export const setManageReportsPageLevelData = (payload) => ({
  type: MANAGE_REPORTS_SET_PAGE_DATA,
  payload,
});

export const getReportsDetailsAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_REPORTS_GET_API_REQUEST,
  });

  return getReportsDetails(payload)
    .then((response) => {
      dispatch({
        type: MANAGE_REPORTS_GET_API_RESPONSE,
        payload: response,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_REPORTS_GET_API_ERROR,
        payload: error,
      });
    });
};
