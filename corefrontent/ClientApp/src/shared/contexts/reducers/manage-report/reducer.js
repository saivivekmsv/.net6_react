import { get } from "lodash";
import {
  MANAGE_REPORTS_SET_FLOW,
  MANAGE_REPORTS_SET_SELECTED_MENU,
  MANAGE_REPORTS_SET_LOADER,
  MANAGE_REPORTS_SET_FULL_PAGE_DATA,
  MANAGE_REPORTS_SET_TOAST_INFO,
  MANAGE_REPORTS_SET_PAGE_DATA,
  MANAGE_REPORTS_GET_API_RESPONSE,
  MANAGE_REPORTS_GET_API_REQUEST,
  MANAGE_REPORTS_GET_API_ERROR,
  MANAGE_REPORTS_POST_API_RESPONSE,
  MANAGE_REPORTS_POST_API_ERROR,
  MANAGE_REPORTS_POST_API_REQUEST,
} from "./actions";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case MANAGE_REPORTS_SET_SELECTED_MENU:
      return {
        ...state,
        selectedMenu: payload,
      };
    case MANAGE_REPORTS_SET_FLOW:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_REPORTS_SET_FULL_PAGE_DATA:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_REPORTS_SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case MANAGE_REPORTS_SET_PAGE_DATA: {
      const { formName, fieldData } = payload;
      return {
        ...state,
        [formName]: { ...fieldData },
      };
    }
    case MANAGE_REPORTS_SET_TOAST_INFO: {
      return {
        ...state,
        showToast: get(payload, "showToast", false),
        toastMessage: get(payload, "toastMessage", ""),
      };
    }

    case MANAGE_REPORTS_GET_API_REQUEST:
    case MANAGE_REPORTS_POST_API_REQUEST:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: true,
          error: null,
        },
      };
    case MANAGE_REPORTS_GET_API_RESPONSE:
    case MANAGE_REPORTS_POST_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          data: payload,
          isError: false,
        },
      };
    case MANAGE_REPORTS_GET_API_ERROR:
    case MANAGE_REPORTS_POST_API_ERROR:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          isError: true,
          error: payload,
        },
      };
    default:
      return state;
  }
};

export default reducer;
