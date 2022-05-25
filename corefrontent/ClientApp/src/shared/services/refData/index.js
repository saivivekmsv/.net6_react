import apiInstance from "../api";
import endPoints from "../endpoints";

export const getStates = () => {
  return apiInstance().get(`${endPoints.refData.getStates}`);
};
