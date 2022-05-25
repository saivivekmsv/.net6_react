import apiInstance from "../api";
import endPoints from "../endpoints";

export const getMappingProfiles = () => {
  return apiInstance().get(`${endPoints.mapper.getMappingProfiles}`);
};

export const getProfileData = (id) => {
  return apiInstance().get(`${endPoints.mapper.getProfileData}/${id}`);
};
export const verifyMapService = (id) => {
  return apiInstance().get(`${endPoints.mapper.verifyMapService}/${id}`);
};
