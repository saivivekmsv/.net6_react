import {
  getMaintenanceDetails,
  saveHoliday,
  deleteHoliday,
  addPlanGroup,
} from "../../../services";

export const MANAGE_MAINTENANCE_SET_FLOW = "managemaintenance/SET_FLOW";
export const MANAGE_MAINTENANCE_SET_SELECTED_MENU =
  "managemaintenance/SET_SELECTED_MENU";
export const MANAGE_MAINTENANCE_SET_LOADER = "managemaintenance/SET_LOADER";
export const MANAGE_MAINTENANCE_SET_FULL_PAGE_DATA =
  "managemaintenance/SET_FULL_PAGE_DATA";
export const MANAGE_MAINTENANCE_SET_TOAST_INFO =
  "managemaintenance/SET_TOAST_INFO";
export const MANAGE_MAINTENANCE_SET_PAGE_DATA =
  "managemaintenance/SET_PAGE_DATA";
export const MANAGE_MAINTENANCE_GET_API_RESPONSE =
  "managemaintenance/ET_API_RESPONSE";
export const MANAGE_MAINTENANCE_GET_API_REQUEST =
  "managemaintenance/GET_API_REQUEST";
export const MANAGE_MAINTENANCE_GET_API_ERROR =
  "managemaintenance/N_GET_API_ERROR";
export const MANAGE_MAINTENANCE_POST_API_RESPONSE =
  "managemaintenance/ST_API_RESPONSE";
export const MANAGE_MAINTENANCE_POST_API_ERROR =
  "managemaintenance/_POST_API_ERROR";
export const MANAGE_MAINTENANCE_POST_API_REQUEST =
  "managemaintenance/OST_API_REQUEST";

export const setManageMaintenanceSelectedMenu = (payload) => ({
  type: MANAGE_MAINTENANCE_SET_SELECTED_MENU,
  payload,
});

export const setManageMaintenanceFlow = (payload) => ({
  type: MANAGE_MAINTENANCE_SET_FLOW,
  payload,
});

export const setManageMaintenanceLoader = (payload) => ({
  type: MANAGE_MAINTENANCE_SET_LOADER,
  payload,
});

export const setManageMaintenanceFullPageData = (payload) => ({
  type: MANAGE_MAINTENANCE_SET_FULL_PAGE_DATA,
  payload,
});

export const setManageMaintenanceToastInfo = (payload) => ({
  type: MANAGE_MAINTENANCE_SET_TOAST_INFO,
  payload,
});

export const setManageMaintenancePageLevelData = (payload) => ({
  type: MANAGE_MAINTENANCE_SET_PAGE_DATA,
  payload,
});

export const getMaintenanceDetailsAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_MAINTENANCE_GET_API_REQUEST,
  });

  return getMaintenanceDetails(payload)
    .then((response) => {
      dispatch({
        type: MANAGE_MAINTENANCE_GET_API_RESPONSE,
        payload: response,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_MAINTENANCE_GET_API_ERROR,
        payload: error,
      });
    });
};

export const saveHolidayDetailsAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_MAINTENANCE_POST_API_REQUEST,
  });
  return saveHoliday(payload)
    .then((response) => {
      if (response) {
        dispatch({
          type: MANAGE_MAINTENANCE_POST_API_RESPONSE,
          payload: new Date(payload.holidayDate).getFullYear(),
        });
      }
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_MAINTENANCE_POST_API_ERROR,
        payload: error,
      });
      throw error;
    });
};
export const deleteHolidayAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_MAINTENANCE_POST_API_REQUEST,
  });
  return deleteHoliday(payload.id)
    .then((response) => {
      console.log({ response });
      if (response) {
        dispatch({
          type: MANAGE_MAINTENANCE_POST_API_RESPONSE,
          payload: payload.holidayDate,
        });
      }
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_MAINTENANCE_POST_API_ERROR,
        payload: error,
      });
      throw error;
    });
};
export const savePlanGroupsAction = (payload, dispatch) => {
  console.log({ payload });
  dispatch({
    type: MANAGE_MAINTENANCE_POST_API_REQUEST,
  });
  return addPlanGroup(payload)
    .then((response) => {
      if (response) {
        dispatch({
          type: MANAGE_MAINTENANCE_POST_API_RESPONSE,
          payload: payload,
        });
      }
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_MAINTENANCE_POST_API_ERROR,
        payload: error,
      });
      throw error;
    });
};
