import { get } from "lodash";
import {
  MANAGE_ELIGIBILITY_SET_FLOW,
  MANAGE_ELIGIBILITY_SET_SELECTED_MENU,
  MANAGE_ELIGIBILITY_SET_LOADER,
  MANAGE_ELIGIBILITY_SET_FULL_PAGE_DATA,
  MANAGE_ELIGIBILITY_SET_TOAST_INFO,
  MANAGE_ELIGIBILITY_SET_PAGE_DATA,
  MANAGE_ELIGIBILITY_GET_API_RESPONSE,
  MANAGE_ELIGIBILITY_GET_API_REQUEST,
  MANAGE_ELIGIBILITY_GET_API_ERROR,
  MANAGE_ELIGIBILITY_POST_API_RESPONSE,
  MANAGE_ELIGIBILITY_POST_API_ERROR,
  MANAGE_ELIGIBILITY_POST_API_REQUEST,
} from "./actions";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case MANAGE_ELIGIBILITY_SET_SELECTED_MENU:
      return {
        ...state,
        selectedMenu: payload,
      };
    case MANAGE_ELIGIBILITY_SET_FLOW:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_ELIGIBILITY_SET_FULL_PAGE_DATA:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_ELIGIBILITY_SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case MANAGE_ELIGIBILITY_SET_PAGE_DATA: {
      const { formName, fieldData } = payload;
      return {
        ...state,
        [formName]: { ...fieldData },
      };
    }
    case MANAGE_ELIGIBILITY_SET_TOAST_INFO: {
      return {
        ...state,
        showToast: get(payload, "showToast", false),
        toastMessage: get(payload, "toastMessage", ""),
      };
    }

    case MANAGE_ELIGIBILITY_GET_API_REQUEST:
    case MANAGE_ELIGIBILITY_POST_API_REQUEST:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: true,
          error: null,
        },
      };
    case MANAGE_ELIGIBILITY_GET_API_RESPONSE:
    case MANAGE_ELIGIBILITY_POST_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          data: payload,
          isError: false,
        },
      };
    case MANAGE_ELIGIBILITY_GET_API_ERROR:
    case MANAGE_ELIGIBILITY_POST_API_ERROR:
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
