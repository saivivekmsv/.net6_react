import apiInstance from "../api";
// import endPoints from "../endpoints";
import { delay } from "../helpers";
import getPlans from "../../mocks/getPlans.json";
import eligibilitySummaryReports from "../../mocks/eligibilitySummaryReports.json";
import newEmployeeEligibilityPlanReport from "../../mocks/newEmployeeEligibilityReport.json";
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

export const runEligibility = (companyId, planId, sources) => {
  return apiInstance().post(
    `${endPoints.eligibility.runEligibility}/${companyId}/${planId}`,
    sources
  );
};
