import { uniqueId } from "lodash";
import {
  getMappingProfiles,
  getProfileData,
  onProfileCreate,
} from "../../../services";

export const MANAGE_MAPPER_SET_FLOW = "managemapper/SET_FLOW";
export const MANAGE_MAPPER_SET_SELECTED_MENU = "managemapper/SET_SELECTED_MENU";
export const MANAGE_MAPPER_SET_LOADER = "managemapper/SET_LOADER";
export const MANAGE_MAPPER_SET_FULL_PAGE_DATA =
  "managemapper/SET_FULL_PAGE_DATA";
export const MANAGE_MAPPER_SET_TOAST_INFO = "managemapper/SET_TOAST_INFO";
export const MANAGE_MAPPER_SET_PAGE_DATA = "managemapper/SET_PAGE_DATA";
export const MANAGE_MAPPER_SET_MAPPING_DATA = "managemapper/SET_MAPPING_DATA";
export const MANAGE_MAPPER_GET_API_RESPONSE = "managemapper/GET_API_RESPONSE";
export const MANAGE_MAPPER_GET_API_REQUEST = "managemapper/GET_API_REQUEST";
export const MANAGE_MAPPER_GET_API_ERROR = "managemapper/N_GET_API_ERROR";
export const MANAGE_MAPPER_POST_API_RESPONSE = "managemapper/ST_API_RESPONSE";
export const MANAGE_MAPPER_POST_API_ERROR = "managemapper/_POST_API_ERROR";
export const MANAGE_MAPPER_POST_API_REQUEST = "managemapper/POST_API_REQUEST";
export const MANAGE_OBJECT_MAPPER_SET_PAGE_DATA =
  "managemapper/OBJECT_PAGE_DATA";

export const MANAGE_MAPPER_GET_API_FILEUPLOAD_RESPONSE =
  "managemapper/GET_FILEUPLOAD_API_RESPONSE";
export const MANAGE_MAPPER_BASIC_INFORMATION = "managemapper/BASIC_INFORMATION";
export const MANAGE_MAPPER_POST_API_FILEUPLOAD_RESPONSE =
  "managemapper/POST_FILEUPLOAD_API_RESPONSE";
export const setManageMapperSelectedMenu = (payload) => ({
  type: MANAGE_MAPPER_SET_SELECTED_MENU,
  payload,
});

export const setManageMapperFlow = (payload) => ({
  type: MANAGE_MAPPER_SET_FLOW,
  payload,
});

export const setManageMapperLoader = (payload) => ({
  type: MANAGE_MAPPER_SET_LOADER,
  payload,
});

export const setManageMapperFullPageData = (payload) => ({
  type: MANAGE_MAPPER_SET_FULL_PAGE_DATA,
  payload,
});

export const setManageMapperToastInfo = (payload) => ({
  type: MANAGE_MAPPER_SET_TOAST_INFO,
  payload,
});

export const setManageMapperPageLevelData = (payload) => ({
  type: MANAGE_MAPPER_SET_PAGE_DATA,
  payload,
});

export const setMapperPageLevelData = (payload) => ({
  type: MANAGE_OBJECT_MAPPER_SET_PAGE_DATA,
  payload,
});

export const setMapperMappingData = (payload, dispatch, state) => ({
  type: MANAGE_MAPPER_SET_MAPPING_DATA,
  payload,
});

export const setBasicInformation = (payload) => ({
  type: MANAGE_MAPPER_BASIC_INFORMATION,
  payload,
});

export const getProfileDetailsAction = (payload, dispatch) => {
  dispatch({
    type: MANAGE_MAPPER_GET_API_REQUEST,
  });

  return getProfileData(payload)
    .then(async (response) => {
      dispatch({
        type: MANAGE_MAPPER_GET_API_RESPONSE,
        payload: response,
      });
      return response;
    })
    .catch((error) => {
      dispatch({
        type: MANAGE_MAPPER_GET_API_ERROR,
        payload: error,
      });
    });
};

export const getMappingProfilesAction = () => {
  return getMappingProfiles()
    .then((response) => {
      return response;
    })
    .catch((_) => {
      return { isSucessful: false };
    })
    .finally((_) => {
      //Loading Stop
    });
};

export const UploadSourceFile = (payload, dispatch) => {
  const { basicInformation, values, configure } = payload;
  const configuration = JSON.stringify(configure);
  const planProfiles = basicInformation.planProfileMappings;
  let formData = new FormData();
  console.log(payload, "pay");
  dispatch({
    type: MANAGE_MAPPER_POST_API_REQUEST,
  });
  formData.append("fileType", values.fileType);
  formData.append("format", values.format);
  formData.append("name", basicInformation.name);
  formData.append("configuration", configuration);
  formData.append("planProfileMappings", planProfiles);
  formData.append("createdBy", 1);
  formData.append("file", values.uploadSourceFile[0]);
  return onProfileCreate(formData)
    .then((res) => {
      dispatch({
        type: MANAGE_MAPPER_GET_API_FILEUPLOAD_RESPONSE,
        payload: res,
      });
      return res;
    })
    .catch((error) => {
      throw error;
    });
};

export const SubmitMapperProfileOverview = (payload, dispatch) => {
  const { values } = payload;
  const planProfiles = "";
  // let formData = new FormData();
  console.log(payload, "pay");
  dispatch({
    type: MANAGE_MAPPER_POST_API_REQUEST,
  });
  // formData.append("name", basicInformation.name);
  console.log("formData", values);
  return onProfileCreate(values)
    .then((res) => {
      dispatch({
        type: MANAGE_MAPPER_GET_API_FILEUPLOAD_RESPONSE,
        payload: res,
      });
      return res;
    })
    .catch((error) => {
      throw error;
    });
};
