import apiInstance from "../api";
// import endPoints from "../endpoints";
import { delay } from "../helpers";
import getPlans from "../../../shared/mocks/getPlans.json";
import eligibilitySummaryReports from "../../../shared/mocks/eligibilitySummaryReports.json";
import newEmployeeEligibilityPlanReport from "../../../shared/mocks/newEmployeeEligibilityReport.json";
import endPoints from "../endpoints";

export const getEligibilityDetails = () => {
  // return apiInstance().get(endPoints.plan.get);
  return delay(1000).then(() => {
    return getPlans;
  });
};

//Manage Eligibility
export const getEligibilitySummaryReport = () => {
  return delay(1000).then(() => {
    return eligibilitySummaryReports;
  });
};

export const getnewEmployeeEligibilityPlanReport = () => {
  return delay(1000).then(() => {
    return newEmployeeEligibilityPlanReport;
  });
};

export const runEligibility = (payload) => {
  apiInstance().post(endPoints.eligibility.runEligibility, payload);
};
