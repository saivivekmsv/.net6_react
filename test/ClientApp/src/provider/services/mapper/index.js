import apiInstance from "../api";
import endPoints from "../endpoints";

export const getMappingProfiles = () => {
  return apiInstance().get(`${endPoints.mapper.getMappingProfiles}`);
};
export const getAllProfiles = () => {
  return apiInstance().get(`${endPoints.mapper.getProfiles}`);
};

export const getProfileData = (id) => {
  return apiInstance().get(`${endPoints.mapper.getProfileData}/${id}`);
};
export const verifyMapService = (id) => {
  return apiInstance().get(`${endPoints.mapper.verifyMapService}/${id}`);
};

export const onProfileCreate = (payload) => {
  return apiInstance().post(endPoints.mapper.saveOnProfileCreate, payload, {
    headers: { "content-type": "multipart/form-data" },
  });
};

export const cloneProfile = (id, name) => {
  return apiInstance().get(`${endPoints.mapper.cloneProfile}/${id}/${name}`);
};
export const getActivePlans = (payload) => {
  return apiInstance().post(`${endPoints.mapper.getActivePlans}`, payload);
};

export const checkProfileNameExists = (id, profileName) => {
  return apiInstance().get(
    `${endPoints.mapper.checkProfileNameExists}/${id}/${profileName}`
  );
};

export const searchProfiles = (payload) => {
  return apiInstance().post(`${endPoints.mapper.searchProfiles}`, payload);
};

export const onUpdateStatus = (payload) => {
  return apiInstance().post(`${endPoints.mapper.UpdateStatus}`, payload);
};

export const onMappingChange = (payload) => {
  return apiInstance().post(`${endPoints.mapper.mappingChange}`, payload);
};

export const onProfileNameChange = (payload) => {
  return apiInstance().post(`${endPoints.mapper.profileNameChange}`, payload);
};

export const onAggregateSave = (payload) => {
  return apiInstance().post(`${endPoints.mapper.onAggregateSave}`, payload);
};

export const onSchedulerSave = (payload) => {
  return apiInstance().post(`${endPoints.mapper.onSchedulerSave}`, payload);
};

export const onFilterSave = (payload) => {
  return apiInstance().post(`${endPoints.mapper.onFilterSave}`, payload);
};

export const onUpdatePlans = (payload) => {
  return apiInstance().post(`${endPoints.mapper.updatePlans}`, payload);
};

export const onSaveTarget = (payload) => {
  return apiInstance().post(`${endPoints.mapper.saveTargetType}`, payload);
};
