import { get } from "lodash";
import { getPlanDetails, postPlanDetails } from "../../../services";
import { populateManagePlanForm } from "../../../utils";

export const CREATE_PLAN_SET_PAGE_DATA = "createplan/SET_PAGE_DATA";
export const MANAGE_PLAN_SET_FLOW = "createplan/SET_FLOW";
export const MANAGE_PLAN_SET_SELECTED_MENU = "createplan/SET_SELECTED_MENU";
export const MANAGE_PLAN_SET_LOADER = "createplan/SET_LOADER";
export const MANAGE_PLAN_SET_FULL_PAGE_DATA = "createplan/SET_FULL_PAGE_DATA";
export const MANAGE_PLAN_SET_TOAST_INFO = "createplan/SET_TOAST_INFO";
export const MANAGE_PLAN_SET_PAGE_DATA = "manageplan/SET_PAGE_DATA";
export const MANAGE_PLAN_GET_API_REQUEST = "manageplan/GET_API_REQUEST";
export const MANAGE_PLAN_POST_API_REQUEST = "manageplan/OST_API_REQUEST";
export const MANAGE_PLAN_GET_API_RESPONSE = "manageplan/ET_API_RESPONSE";
export const MANAGE_PLAN_POST_API_RESPONSE = "manageplan/ST_API_RESPONSE";
export const MANAGE_PLAN_POST_VALIDATION_ERROR =
  "managePlan/POST_VALIDATION_ERROR";
export const MANAGE_PLAN_GET_API_ERROR = "manageplan/N_GET_API_ERROR";
export const MANAGE_PLAN_POST_API_ERROR = "manageplan/_POST_API_ERROR";
export const MANAGE_PLAN_LOCAL_CACHE = "manageplan/LOCAL_CACHE";
export const MANAGE_PLAN_CLEAR_LOCAL_CACHE = "manageplan/CLEAR_LOCAL_CACHE";
export const MANAGE_PLAN_SAVE_EMPLOYEE_CLASSIFICATION =
  "manageplan/SAVE_EMPLOYEE_CLASSIFICATION";
export const MANAGE_PLAN_SET_PLAN_STATUS = "setPlanStatus";
export const INCREASE_SOURCE_HIERARCHY = "increaseSourceHierarchy";
export const DECREASE_SOURCE_HIERARCHY = "decreaseSourceHierarchy";

export const increaseSourceHierarchy = (payload) => ({
  type: INCREASE_SOURCE_HIERARCHY,
  payload,
});

export const decreaseSourceHierarchy = (payload) => ({
  type: DECREASE_SOURCE_HIERARCHY,
  payload,
});

export const setManagePlanSelectedMenu = (payload) => ({
  type: MANAGE_PLAN_SET_SELECTED_MENU,
  payload,
});

export const setManageCreateData = (payload) => ({
  type: CREATE_PLAN_SET_PAGE_DATA,
  payload,
});

export const setManagePlanFlow = (payload) => ({
  type: MANAGE_PLAN_SET_FLOW,
  payload,
});

export const setManagePlanLoader = (payload) => ({
  type: MANAGE_PLAN_SET_LOADER,
  payload,
});

export const setManagePlanFullPageData = (payload) => ({
  type: MANAGE_PLAN_SET_FULL_PAGE_DATA,
  payload,
});

export const setManagePlanToastInfo = (payload) => ({
  type: MANAGE_PLAN_SET_TOAST_INFO,
  payload,
});

export const setManagePlanPageLevelData = (payload) => ({
  type: MANAGE_PLAN_SET_PAGE_DATA,
  payload,
});

export const getPlanDetailsAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_PLAN_GET_API_REQUEST,
  });

  return getPlanDetails(payload)
    .then(async (response) => {
      // Employee classification list for the company id to be retrieveconst employeeClassification = get(state, "employeeClassification", []);
      // const employeeClassificationApiData = await getEmployeeClassifications(
      //   get(response, "companyId")
      // );
      // savePlanEmployeeClassification(employeeClassificationApiData || []);

      const formData = populateManagePlanForm(response.plan);
      dispatch(setManagePlanFullPageData(formData));
      dispatch({
        type: MANAGE_PLAN_GET_API_RESPONSE,
        payload: response.plan,
      });
      return response.plan;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_PLAN_GET_API_ERROR,
        payload: error,
      });
    });
};

export const savePlanDetailsAction = (payload, dispatch, state) => {
  console.log(payload);
  dispatch({
    type: MANAGE_PLAN_POST_API_REQUEST,
  });
  const apiData = get(state, "api.data", {});
  return postPlanDetails({
    ...apiData,
    ...payload,
    tenantId: 1, //TODO: remove hardcoding & take it from JWT
  })
    .then(async (response) => {
      // Employee classification list for the company id to be retrieve
      // const employeeClassification = get(state, "employeeClassification", []);
      // if (isEmpty(employeeClassification)) {
      //   const employeeClassificationApiData = await getEmployeeClassifications(
      //     get(response, "companyId")
      //   );
      //   savePlanEmployeeClassification(employeeClassificationApiData);
      // }

      if (response.isSuccessful) {
        dispatch({
          type: MANAGE_PLAN_POST_API_RESPONSE,
          payload: response.plan,
        });
        const formData = populateManagePlanForm(response.plan);
        dispatch(setManagePlanFullPageData(formData));
      } else {
        dispatch({
          type: MANAGE_PLAN_POST_VALIDATION_ERROR,
          payload: null,
        });
      }
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_PLAN_POST_API_ERROR,
        payload: error,
      });
      throw error;
    });
};

export const setManagePlanLocalCache = (payload) => ({
  type: MANAGE_PLAN_LOCAL_CACHE,
  payload,
});

export const clearLocalCacheByModel = (payload) => ({
  type: MANAGE_PLAN_CLEAR_LOCAL_CACHE,
  payload,
});

export const savePlanEmployeeClassification = (payload) => ({
  type: MANAGE_PLAN_SAVE_EMPLOYEE_CLASSIFICATION,
  payload,
});
export const setPageLevelPlanStatus = (payload) => ({
  type: MANAGE_PLAN_SET_PLAN_STATUS,
  payload,
});
