import { delay } from "../helpers";
import apiInstance from "../api";
import endPoints from "../endpoints";

export const getPlanSourceInformation = (planId) => {
  return apiInstance().get(
    `${endPoints.enrollment.getPlanSourceInformation}/${planId}`
  );
};

export const getPlanInvestments = (planId) => {
  return apiInstance().get(
    `${endPoints.enrollment.getPlanInvestments}/${planId}`
  );
};
export const postDefaultElectionSetting = (payload) => {
  return apiInstance().post(
    `${endPoints.enrollment.postDefaultElectionSetting}`,
    payload
  );
};
export const postPlanInvestment = (payload) => {
  return apiInstance().post(
    `${endPoints.enrollment.postPlanInvestment}`,
    payload
  );
};
export const postADIApplicableConfiguration = (payload) => {
  return apiInstance().post(
    `${endPoints.enrollment.postADIApplicableConfiguration}`,
    payload
  );
};
export const getDefaultElectionSetting = (planId) => {
  return apiInstance().get(
    `${endPoints.enrollment.getDefaultElectionSetting}/${planId}`
  );
};
export const deleteInvestment = (planId, investmentId) => {
  return apiInstance().delete(
    `${endPoints.enrollment.deleteInvestment}/${planId}/${investmentId}`
  );
};
export const getADIApplicableConfiguration = (Id) => {
  return apiInstance().get(
    `${endPoints.enrollment.getADIApplicableConfiguration}/${Id}`
  );
};
export const saveAutoEnrollment = (payload) => {
  return apiInstance().post(
    `${endPoints.enrollment.saveAutoEnrollment}`,
    payload
  );
};
export const getAutoEnrollment = (planId) => {
  return apiInstance().get(
    `${endPoints.enrollment.getAutoEnrollment}/${planId}`
  );
};
export const getEmployeeClassification = (planId) => {
  return apiInstance().get(
    `${endPoints.enrollment.getEmployeeClassification}/${planId}`
  );
};
export const saveAdditionalAutoEnrollment = (payload) => {
  return apiInstance().post(
    `${endPoints.enrollment.saveAdditionalAutoEnrollment}`,
    payload
  );
};
export const getAdditionalAutoEnrollment = (planId) => {
  return apiInstance().get(
    `${endPoints.enrollment.retrieveAdditionalAutoEnrollmentIfExists}/${planId}`
  );
};

export const autoEnrollmentGeneration = (payload) => {
  return apiInstance().get(
    `${endPoints.enrollment.AutoEnrollmentGeneration}/${payload.planId}/${payload.companyId}`
  );
};
export const EnrollmentSummaryReport = (payload) => {
  return apiInstance().get(
    `${endPoints.enrollment.EnrollmentSummaryReport}/${payload.planId}/${payload.companyId}/${payload.processingDateFrom}/${payload.processingDateTo}`
  );
};
export const ParticipantwiseReport = (payload) => {
  return apiInstance().get(
    `${endPoints.enrollment.ParticipantwiseReport}/${payload.planId}/${payload.companyId}`
  );
};
export const CompanyanddPlanWiseEnrollmentReport = (payload) => {
  return apiInstance().get(
    `${endPoints.enrollment.CompanyanddPlanWiseEnrollmentReport}/${payload.planId}/${payload.companyId}`
  );
};
