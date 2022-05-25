import { getCensusDetails } from "../../../services";

export const MANAGE_CENSUS_SET_FLOW = "managecensus/SET_FLOW";
export const MANAGE_CENSUS_SET_SELECTED_MENU = "managecensus/SET_SELECTED_MENU";
export const MANAGE_CENSUS_SET_LOADER = "managecensus/SET_LOADER";
export const MANAGE_CENSUS_SET_FULL_PAGE_DATA =
  "managecensus/SET_FULL_PAGE_DATA";
export const MANAGE_CENSUS_SET_TOAST_INFO = "managecensus/SET_TOAST_INFO";
export const MANAGE_CENSUS_SET_PAGE_DATA = "managecensus/SET_PAGE_DATA";
export const MANAGE_CENSUS_GET_API_RESPONSE = "managecensus/ET_API_RESPONSE";
export const MANAGE_CENSUS_GET_API_REQUEST = "managecensus/GET_API_REQUEST";
export const MANAGE_CENSUS_GET_API_ERROR = "managecensus/N_GET_API_ERROR";
export const MANAGE_CENSUS_POST_API_RESPONSE = "managecensus/ST_API_RESPONSE";
export const MANAGE_CENSUS_POST_API_ERROR = "managecensus/_POST_API_ERROR";
export const MANAGE_CENSUS_POST_API_REQUEST = "managecensus/OST_API_REQUEST";

export const setManageCensusSelectedMenu = (payload) => ({
  type: MANAGE_CENSUS_SET_SELECTED_MENU,
  payload,
});

export const setManageCensusFlow = (payload) => ({
  type: MANAGE_CENSUS_SET_FLOW,
  payload,
});

export const setManageCensusLoader = (payload) => ({
  type: MANAGE_CENSUS_SET_LOADER,
  payload,
});

export const setManageCensusFullPageData = (payload) => ({
  type: MANAGE_CENSUS_SET_FULL_PAGE_DATA,
  payload,
});

export const setManageCensusToastInfo = (payload) => ({
  type: MANAGE_CENSUS_SET_TOAST_INFO,
  payload,
});

export const setManageCensusPageLevelData = (payload) => ({
  type: MANAGE_CENSUS_SET_PAGE_DATA,
  payload,
});

export const getCensusDetailsAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_CENSUS_GET_API_REQUEST,
  });

  return getCensusDetails(payload)
    .then((response) => {
      dispatch({
        type: MANAGE_CENSUS_GET_API_RESPONSE,
        payload: response,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_CENSUS_GET_API_ERROR,
        payload: error,
      });
    });
};
