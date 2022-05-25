import { get } from "lodash";
import {
  MANAGE_PAYROLL_SET_FLOW,
  MANAGE_PAYROLL_SET_SELECTED_MENU,
  MANAGE_PAYROLL_SET_LOADER,
  MANAGE_PAYROLL_SET_FULL_PAGE_DATA,
  MANAGE_PAYROLL_SET_TOAST_INFO,
  MANAGE_PAYROLL_SET_PAGE_DATA,
  MANAGE_PAYROLL_GET_API_FILEUPLOAD_RESPONSE,
  MANAGE_PAYROLL_FILE_STATUSES,
  MANAGE_PAYROLL_GET_API_RESPONSE,
  MANAGE_PAYROLL_GET_API_REQUEST,
  MANAGE_PAYROLL_GET_API_ERROR,
  MANAGE_PAYROLL_POST_API_RESPONSE,
  MANAGE_PAYROLL_POST_API_FILEUPLOAD_RESPONSE,
  MANAGE_PAYROLL_POST_API_ERROR,
  MANAGE_PAYROLL_POST_API_REQUEST,
  MANAGE_EXISTING_EMPLOYEE_DETAILS,
  MANAGE_PAYROLL_GRAPH_GET_API_RESPONSE,
  MANAGE_PAYROLL_ERROR_API_RESPONSE,
  MANAGE_PAYROLL_WARNING_API_RESPONSE,
  MANAGE_PAYROLL_RECORDS_API_RESPONSE,
  MANAGE_PAYROLL_EMPLOYEE_DETAILS,
} from "./actions";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case MANAGE_PAYROLL_SET_SELECTED_MENU:
      return {
        ...state,
        selectedMenu: payload,
      };
    case MANAGE_PAYROLL_SET_FLOW:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_PAYROLL_FILE_STATUSES:
      return {
        ...state,
        uploadedFileStatuses: payload,
      };
    case MANAGE_PAYROLL_SET_FULL_PAGE_DATA:
      return {
        ...state,
        ...payload,
      };
    case MANAGE_PAYROLL_SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case MANAGE_PAYROLL_SET_PAGE_DATA: {
      const { formName, fieldData } = payload;
      return {
        ...state,
        [formName]: { ...fieldData },
      };
    }
    case MANAGE_PAYROLL_SET_TOAST_INFO: {
      return {
        ...state,
        showToast: get(payload, "showToast", false),
        toastMessage: get(payload, "toastMessage", ""),
      };
    }
    case MANAGE_PAYROLL_EMPLOYEE_DETAILS:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          payrollData: payload,
          isError: false,
        },
      };
    case MANAGE_EXISTING_EMPLOYEE_DETAILS:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          employeeDetails: payload,
          isError: false,
        },
      };
    case MANAGE_PAYROLL_GRAPH_GET_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          graphDetails: payload,
          isError: false,
        },
      };
    case MANAGE_PAYROLL_ERROR_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          errorList: payload,
          isError: false,
        },
      };
    case MANAGE_PAYROLL_WARNING_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          warningList: payload,
          isError: false,
        },
      };
    case MANAGE_PAYROLL_RECORDS_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          recordList: payload,
          isError: false,
        },
      };
    case MANAGE_PAYROLL_GET_API_REQUEST:
    case MANAGE_PAYROLL_POST_API_REQUEST:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: true,
          error: null,
        },
      };
    case MANAGE_PAYROLL_GET_API_RESPONSE:
    case MANAGE_PAYROLL_POST_API_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          data: payload,
          isError: false,
        },
      };
    case MANAGE_PAYROLL_GET_API_FILEUPLOAD_RESPONSE:
    case MANAGE_PAYROLL_POST_API_FILEUPLOAD_RESPONSE:
      return {
        ...state,
        api: {
          ...state.api,
          isFetching: false,
          fileuploadData: payload,
          isError: false,
        },
      };
    case MANAGE_PAYROLL_GET_API_ERROR:
    case MANAGE_PAYROLL_POST_API_ERROR:
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
