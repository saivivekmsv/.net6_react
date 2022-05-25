import { get } from "lodash";
import {
  postCompanyDetails,
  getCompanyDetails,
  getMasterClassificationTypes,
  addMasterClassificationTypes,
  getGeneratePayrollSchedule,
  // getSponsoringOrganisationList,
uploadCompanyLogo,
  getCompanyLogo,
} from "../../../services";
import {
  populateManageCompanyForm,
  // tranformListToDropdownValues,
} from "../../../utils";

export const MANAGE_COMPANY_SET_FLOW = "managecompany/SET_FLOW";
export const MANAGE_COMPANY_SET_SELECTED_MENU =
  "managecompany/SET_SELECTED_MENU";
export const MANAGE_COMPANY_SET_PAGE_DATA = "managecompany/SET_PAGE_DATA";
export const MANAGE_COMPANY_SET_LOADER = "managecompany/SET_LOADER";
export const MANAGE_COMPANY_SET_FULL_PAGE_DATA =
  "managecompany/SET_FULL_PAGE_DATA";
export const MANAGE_COMPANY_SET_TOAST_INFO = "managecompany/SET_TOAST_INFO";

export const MANAGE_COMPANY_POST_API_REQUEST = "managecompany/POST_API_REQUEST";
export const MANAGE_COMPANY_POST_API_RESPONSE =
  "managecompany/POST_API_RESPONSE";
export const MANAGE_COMPANY_POST_API_ERROR = "managecompany/POST_API_ERROR";
export const MANAGE_COMPANY_GET_API_REQUEST = "managecompany/GET_API_REQUEST";
export const GET_MASTERCLASSIFICATION_TYPE_REQUEST =
  "managecompany/GET_MASTERCLASSIFICATION_TYPE_REQUEST";
export const GET_MASTERCLASSIFICATION_TYPE_RESPONSE =
  "managecompany/GET_MASTERCLASSIFICATION_TYPE_RESPONSE";
export const MANAGE_COMPANY_GET_API_RESPONSE = "managecompany/GET_API_RESPONSE";
export const MANAGE_COMPANY_GET_API_ERROR = "managecompany/GET_API_ERROR";
export const MANAGE_COMPANY_SET_EMPLOYEE_CLASSIFICATION_DATA =
  "managecompany/SET_EMPLOYEE_CLASSIFICATION_DATA";
export const MANAGE_COMPANY_LOCAL_CACHE = "managecompany/SET_LOCAL_CACHE";
export const MANAGE_COMPANY_CLEAR_LOCAL_CACHE =
  "managecompany/CLEAR_LOCAL_CACHE";
export const MANAGE_COMPANY_SET_POST_FETCHING_FALSE =
  "manageCompany/SET_FETCHING_FALSE";
export const setManageCompanySelectedMenu = (payload) => ({
  type: MANAGE_COMPANY_SET_SELECTED_MENU,
  payload,
});

export const setManageCompanyFlow = (payload) => ({
  type: MANAGE_COMPANY_SET_FLOW,
  payload,
});

export const setManagePageLevelData = (payload) => ({
  type: MANAGE_COMPANY_SET_PAGE_DATA,
  payload,
});
export const setManageCompanyLoader = (payload) => ({
  type: MANAGE_COMPANY_SET_LOADER,
  payload,
});

export const setManageCompanyFullPageData = (payload) => ({
  type: MANAGE_COMPANY_SET_FULL_PAGE_DATA,
  payload,
});

export const setManageCompanyToastInfo = (payload) => ({
  type: MANAGE_COMPANY_SET_TOAST_INFO,
  payload,
});

export const setManageCompanySetClassificationData = (payload) => ({
  type: MANAGE_COMPANY_SET_EMPLOYEE_CLASSIFICATION_DATA,
  payload,
});

export const getMasterClassificationTypesAction = (
  payload,
  dispatch,
  state
) => {
  // console.log(payload, "inside masterClassificationTypes");
  dispatch({
    type: GET_MASTERCLASSIFICATION_TYPE_REQUEST,
  });
  return getMasterClassificationTypes(payload)
    .then((response) => {
      dispatch({
        type: GET_MASTERCLASSIFICATION_TYPE_RESPONSE,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: GET_MASTERCLASSIFICATION_TYPE_RESPONSE,
      });
    });
};
export const addMasterClassificationTypesAction = (
  payload,
  dispatch,
  state
) => {
  dispatch({
    type: GET_MASTERCLASSIFICATION_TYPE_REQUEST,
  });
  return addMasterClassificationTypes(payload)
    .then((response) => {
      dispatch({
        type: GET_MASTERCLASSIFICATION_TYPE_RESPONSE,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: GET_MASTERCLASSIFICATION_TYPE_RESPONSE,
      });
    });
};
export const getCompanyDetailsAction = (payload, dispatch, state) => {
  dispatch({
    type: MANAGE_COMPANY_GET_API_REQUEST,
  });

  return getCompanyDetails(payload)
    .then((response) => {
      const formData = populateManageCompanyForm(response.company);
      dispatch(setManageCompanyFullPageData(formData));
      dispatch({
        type: MANAGE_COMPANY_GET_API_RESPONSE,
        payload: response.company,
      });
      dispatch(
        setManageCompanySetClassificationData(
          get(response.company, "classifications", [])
        )
      );
      return response.company;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_COMPANY_GET_API_ERROR,
        payload: error,
      });
    });
};

export const saveCompanyDetails = (payload, dispatch, state) => {  
  dispatch({
    type: MANAGE_COMPANY_POST_API_REQUEST,
  });
  const apiData = get(state, "api.data", {});
  return postCompanyDetails({
    ...apiData,
    ...payload,
    tenantId: 1, //TODO: remove hardcoding & take it from JWT
  })
    .then((response) => {
      dispatch({
        type: MANAGE_COMPANY_SET_POST_FETCHING_FALSE,
        payload: false,
      });
      if (response.isSuccessful) {
        const formData = populateManageCompanyForm(response.company);
        dispatch(setManageCompanyFullPageData(formData));
        dispatch({
          type: MANAGE_COMPANY_POST_API_RESPONSE,
          payload: response.company,
        });
        dispatch(
          setManageCompanySetClassificationData(
            get(response.company, "classifications", [])
          )
        );
      }
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_COMPANY_POST_API_ERROR,
        payload: error,
      });
      throw error;
    });
};

export const saveCompanyImage = (payload, dispatch, state) => {
 
  dispatch({
    type: MANAGE_COMPANY_POST_API_REQUEST,
  });
  return uploadCompanyLogo(payload)
    .then((response) => {
      dispatch({
        type: MANAGE_COMPANY_SET_POST_FETCHING_FALSE,
        payload: false,
      });
      dispatch(
        setManageCompanyLocalCache({
          model: "imageURL",
          data: response.result,
        })
      );
      // const imageUrl = { companyImage: response };
      // const formData = populateManageCompanyForm(imageUrl);
      // dispatch(setManageCompanyFullPageData(formData));
      // dispatch({
      //   type: MANAGE_COMPANY_POST_API_RESPONSE,
      //   payload: imageUrl,
      // });         
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_COMPANY_POST_API_ERROR,
        payload: error,
      });
      throw error;
    });
    
    
    
    
};

export const generatePayrollSchedule = (payload, dispatch, state) => {
  dispatch({
    type: MANAGE_COMPANY_POST_API_REQUEST,
  });
  const apiData = get(state, "api.data", {});
  return getGeneratePayrollSchedule({
    ...apiData,
    ...payload,
    tenantId: 1, //TODO: remove hardcoding & take it from JWT
  })
    .then((response) => {
      dispatch({
        type: MANAGE_COMPANY_SET_POST_FETCHING_FALSE,
        payload: false,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_COMPANY_POST_API_ERROR,
        payload: error,
      });
      throw error;
    });
};

export const setManageCompanyLocalCache = (payload) => ({
  type: MANAGE_COMPANY_LOCAL_CACHE,
  payload,
});

export const clearMamangeCompanyLocalCacheByModel = (payload) => ({
  type: MANAGE_COMPANY_CLEAR_LOCAL_CACHE,
  payload,
});
