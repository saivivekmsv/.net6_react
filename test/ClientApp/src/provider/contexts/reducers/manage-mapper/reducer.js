import { get } from "lodash";
import {
  MANAGE_MAPPER_SET_FLOW,
  MANAGE_MAPPER_SET_SELECTED_MENU,
  MANAGE_MAPPER_SET_LOADER,
  MANAGE_MAPPER_SET_FULL_PAGE_DATA,
  MANAGE_MAPPER_SET_TOAST_INFO,
  MANAGE_MAPPER_SET_PAGE_DATA,
  MANAGE_MAPPER_SET_MAPPING_DATA,
  MANAGE_MAPPER_GET_API_RESPONSE,
  MANAGE_MAPPER_GET_API_REQUEST,
  MANAGE_MAPPER_GET_API_ERROR,
  MANAGE_MAPPER_POST_API_RESPONSE,
  MANAGE_MAPPER_POST_API_ERROR,
  MANAGE_MAPPER_POST_API_REQUEST,
  MANAGE_MAPPER_GET_API_FILEUPLOAD_RESPONSE,
  MANAGE_MAPPER_POST_API_FILEUPLOAD_RESPONSE,
  MANAGE_MAPPER_BASIC_INFORMATION,
  MANAGE_OBJECT_MAPPER_SET_PAGE_DATA,
} from "./actions";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case MANAGE_MAPPER_SET_SELECTED_MENU:
      return {
        ...state,
        selectedMenu: payload,
      };
    case MANAGE_MAPPER_SET_FLOW:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_MAPPER_SET_FULL_PAGE_DATA:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_MAPPER_SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case MANAGE_OBJECT_MAPPER_SET_PAGE_DATA: {
      const { formName, fieldData } = payload;
      return {
        ...state,
        [formName]: { ...fieldData },
      };
    }
    case MANAGE_MAPPER_SET_PAGE_DATA: {
      const { formName, fieldData } = payload;
      return {
        ...state,
        api: {
          ...state.api,
          data: {
            ...state.api.data,
            [formName]: fieldData,
          },
        },
      };
    }
    case MANAGE_MAPPER_SET_TOAST_INFO: {
      return {
        ...state,
        showToast: get(payload, "showToast", false),
        toastMessage: get(payload, "toastMessage", ""),
      };
    }
    case MANAGE_MAPPER_SET_MAPPING_DATA: {
      return {
        ...state,
        mappingData: payload,
      };
    }
    case MANAGE_MAPPER_BASIC_INFORMATION: {
      return {
        ...state,
        basicInformation: payload,
      };
    }
    case MANAGE_MAPPER_GET_API_REQUEST:
    case MANAGE_MAPPER_POST_API_REQUEST:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: true,
          error: null,
        },
      };
    case MANAGE_MAPPER_GET_API_RESPONSE:
    case MANAGE_MAPPER_POST_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          data: payload,
          isError: false,
        },
      };
    case MANAGE_MAPPER_GET_API_ERROR:
    case MANAGE_MAPPER_POST_API_ERROR:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          isError: true,
          error: payload,
        },
      };
    case MANAGE_MAPPER_GET_API_FILEUPLOAD_RESPONSE:
    case MANAGE_MAPPER_POST_API_FILEUPLOAD_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          fileuploadData: payload,
          isError: false,
        },
      };
    default:
      return state;
  }
};

export default reducer;
