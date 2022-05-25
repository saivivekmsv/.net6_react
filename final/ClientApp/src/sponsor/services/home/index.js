import { get } from "lodash";
import apiInstance from "../api";
import endPoints from "../endpoints";

export const getAllCounts = (payload = []) => {
  const requestList = [];
  payload.forEach((item) => {
    if (["Company", "Plan", "Employees"].includes(item.tileName)) {
      requestList.push({
        name: item.tileName,
        api: () => apiInstance().get(`/api/v1/${get(item, "countUrl")}`),
      });
    }
  });

  return Promise.all(requestList.map((item) => item.api())).then(
    (responses) => {
      const result = {};
      requestList.forEach((item, index) => {
        result[item.name] = responses[index];
      });
      return result;
    }
  );
};

export const getHomePageDetails = () => {
  return apiInstance().get(endPoints.home.get);
};

export const getCompanyDetails = (companyId) => {
  return apiInstance().get(endPoints.home.getCompanyDetails+`/${companyId}`);
};
