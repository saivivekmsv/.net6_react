import { get } from "lodash";
import {
  MANAGE_COMPANY_SET_FLOW,
  MANAGE_COMPANY_SET_SELECTED_MENU,
  MANAGE_COMPANY_SET_PAGE_DATA,
  MANAGE_COMPANY_SET_LOADER,
  MANAGE_COMPANY_SET_FULL_PAGE_DATA,
  MANAGE_COMPANY_SET_TOAST_INFO,
  MANAGE_COMPANY_POST_API_REQUEST,
  MANAGE_COMPANY_POST_API_RESPONSE,
  MANAGE_COMPANY_POST_API_ERROR,
  MANAGE_COMPANY_GET_API_REQUEST,
  MANAGE_COMPANY_GET_API_RESPONSE,
  MANAGE_COMPANY_GET_API_ERROR,
  MANAGE_COMPANY_SET_EMPLOYEE_CLASSIFICATION_DATA,
  MANAGE_COMPANY_LOCAL_CACHE,
  MANAGE_COMPANY_CLEAR_LOCAL_CACHE,
  MANAGE_COMPANY_SET_POST_FETCHING_FALSE,
  GET_MASTERCLASSIFICATION_TYPE_RESPONSE,
  GET_MASTERCLASSIFICATION_TYPE_REQUEST,
} from "./actions";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case MANAGE_COMPANY_SET_SELECTED_MENU:
      return {
        ...state,
        selectedMenu: payload,
      };
    case MANAGE_COMPANY_SET_FLOW:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_COMPANY_SET_PAGE_DATA:
      const { formName, fieldData } = payload;
      return {
        ...state,
        [formName]: { ...fieldData },
      };
    case MANAGE_COMPANY_SET_POST_FETCHING_FALSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          error: null,
        },
      };
    case MANAGE_COMPANY_SET_FULL_PAGE_DATA:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_COMPANY_SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case MANAGE_COMPANY_GET_API_REQUEST:
    case MANAGE_COMPANY_POST_API_REQUEST:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: true,
          error: null,
        },
      };
    case MANAGE_COMPANY_GET_API_RESPONSE:
    case MANAGE_COMPANY_POST_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          data: payload,
          isError: false,
        },
      };
    case MANAGE_COMPANY_GET_API_ERROR:
    case MANAGE_COMPANY_POST_API_ERROR:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          isError: true,
          error: payload,
        },
      };
    case MANAGE_COMPANY_SET_TOAST_INFO:
      return {
        ...state,
        showToast: get(payload, "showToast", false),
        toastMessage: "Data saved successfully",
      };
    case MANAGE_COMPANY_SET_EMPLOYEE_CLASSIFICATION_DATA:
      return {
        ...state,
        classifications: payload,
      };
    case MANAGE_COMPANY_LOCAL_CACHE:
      return {
        ...state,
        [payload.model]: payload.data,
      };
    case MANAGE_COMPANY_CLEAR_LOCAL_CACHE:
      delete state[payload];
      return {
        ...state,
      };
    case GET_MASTERCLASSIFICATION_TYPE_RESPONSE: {
      return {
        ...state,
        masterClassificationDropDown: {
          isLoading: false,
        },
        api: {
          ...state.api,
          isFetching: false,
        },
      };
    }
    case GET_MASTERCLASSIFICATION_TYPE_REQUEST: {
      return {
        ...state,
        masterClassificationDropDown: {
          isLoading: true,
        },
        api: {
          ...state.api,
          isFetching: true,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
