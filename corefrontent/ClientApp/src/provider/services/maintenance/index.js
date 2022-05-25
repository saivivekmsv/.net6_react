import apiInstance from "../api";
import endPoints from "../endpoints";
import { delay } from "../helpers";
import getPlans from "../../mocks/getPlans.json";
// import holidayCalendar from "../../mocks/holidayCalendar.json";
import ScheduleExceptionReport from "../../mocks/scheduleExceptionReport.json";

export const getMaintenanceDetails = () => {
  // return apiInstance().get(endPoints.plan.get);
  return delay(1000).then(() => {
    return getPlans;
  });
};

//Manage Maintenance
export const getHolidayCalendarMaster = (id) => {
  return apiInstance().get(
    `${endPoints.maintenance.getHolidayCalendarMaster}/${id}`
  );
};

export const saveHoliday = (payload) => {
  return apiInstance().post(
    `${endPoints.maintenance.saveHolidayDetails}`,
    payload
  );
};

export const deleteHoliday = (id) => {
  return apiInstance().delete(`${endPoints.maintenance.deleteHoliday}/${id}`);
};
export const addPlanGroup = (payload) => {
  console.log({ payload });
  return apiInstance().post(`${endPoints.maintenance.addPlanGroup}`, payload);
};
export const getPlanGroupInfo = (id) => {
  return apiInstance().get(`${endPoints.maintenance.getPlanGroupById}/${id}`);
};
export const getPlanGroups = (payload) => {
  return apiInstance().get(`${endPoints.maintenance.getPlanGroups}/${payload}`);
};
export const getPlansBySearch = (payload) => {
  console.log({ payload });
  return apiInstance().post(
    `${endPoints.maintenance.getPlansInPlanGroup}`,
    payload
  );
};
export const deletePlanGroup = (id) => {
  return apiInstance().get(`${endPoints.maintenance.deletePlanGroup}/${id}`);
};

export const getAdvisorsList = () => {
  return apiInstance().get(`${endPoints.maintenance.getAdvisors}`);
};

export const getCustodiansList = () => {
  return apiInstance().get(`${endPoints.maintenance.getCustodians}`);
};

export const getInvestmentNamesList = () => {
  return apiInstance().get(`${endPoints.maintenance.getInvestments}`);
};

export const getTrusteesList = () => {
  return apiInstance().get(`${endPoints.maintenance.getTrustees}`);
};

export const getScheduleExceptionReportMaster = () => {
  return delay(1000).then(() => {
    return ScheduleExceptionReport;
  });
};

export const getPlansBySearchCriteria = (payload) => {
  console.log(payload);
  return apiInstance().get(
    `${endPoints.maintenance.getPlansBySearchCriteria}/${payload}`
  );
};
