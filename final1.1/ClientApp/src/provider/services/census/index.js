// import apiInstance from "../api";
// import endPoints from "../endpoints";
import { delay } from "../helpers";
import getCensus from "../../mocks/CensusEmployeeInformation.json";
import manageEmployee from "../../mocks/manageEmployee.json";
import employeeStatus from "../../mocks/exployeeStatus.json";
import employeeManagePlans from "../../mocks/employeeManagePlans.json";
import compensationMaster from "../../mocks/censusCompensationMaster.json";
import censusContributionsMaster from "../../mocks/censusContributionsMaster.json";
import censusHistoryData from "../../mocks/censusHistoryData.json";
import hoursMaster from "../../mocks/censusHoursMaster.json";
import loansMaster from "../../mocks/censusLoansMaster.json";
import employeeClassificationHistory from "../../mocks/censusEmployeeClassificationHistory.json";
import CensusEmployeeAgeMaster from "../../mocks/CensusEmployeeAgeMaster.json";
import company from "../../mocks/company.json";
import masterAssociatedPlan from "../../mocks/masterAssociatedPlan.json";
import censusMasterData from "../../mocks/CensusEmployeeInformation.json";
import companies from "../../mocks/companies.json";
import apiInstance from "../api";
import endPoints from "../endpoints";

export const getCensusDetails = () => {
  // return apiInstance().get(endPoints.plan.get);
  return delay(1000).then(() => {
    return getCensus;
  });
};

export const getManageEmployeeMaster = (payload) => {
  // return delay(1000).then(() => {
  //   return manageEmployee;
  // });
  return apiInstance().post(
    endPoints.census.getEmployeesBySearchCriteria,
    payload
  );
};

export const getEmployeeManagePlans = (empId) => {
  // return delay(1000).then(() => {
  //   return employeeManagePlans;
  // });
  return apiInstance().get(`${endPoints.census.getEnrolledPlans}/${empId}`);
};

export const getPlansCompensation = (payload) => {
  return apiInstance().post(endPoints.census.getEmployeeCompensation, payload);
  // return delay(1000).then(() => {
  //   return compensationMaster;
  // });
};

export const getPlansHours = (payload) => {
  // return delay(1000).then(() => {
  //   return hoursMaster;
  // });
  return apiInstance().post(endPoints.census.getHoursDetails, payload);
};

export const getPlansLoanRepayments = (payload) => {
  return apiInstance().post(
    endPoints.census.getEmployeeLoanRepayments,
    payload
  );
};

export const getPlansEmployeeClassificationHistory = (payload) => {
  // return delay(1000).then(() => {
  //   return employeeClassificationHistory;
  // });
  return apiInstance().get(
    `${endPoints.census.getEmployeeClassificationHistory}/${payload.employeeId}/${payload.classificationTypeId}`
  );
};

export const deleteExistingEmployee = (id) => {
  // return delay(1000).then(() => {
  //   return true;
  // });
  return apiInstance().delete(
    `${endPoints.census.deleteExistingEmployee}/${id}`
  );
};

export const getPlansContributions = (payload) => {
  //   return delay(1000).then(() => {
  //   return censusContributionsMaster;
  // });
  return apiInstance().post(endPoints.census.getEmployeeContribution, payload);
};

export const getEmployeePlanSources = (payload) => {
  return apiInstance().get(
    `${endPoints.census.getEmployeePlanSources}/${payload.companyId}/${payload.planId}`
  );
};

export const getCensusHistory = (payload) => {
  return apiInstance().post(endPoints.census.getCensusHistory, payload);
};

export const getMasterAssociatedMEPs = () => {
  return delay(1000).then(() => {
    return masterAssociatedPlan;
  });
};

export const getSourceLevelContribution = (payload) => {
  return apiInstance().post(
    endPoints.census.getSourceLevelContribution,
    payload
  );
  // return apiInstance().get(
  //   `${endPoints.census.getSourceLevelContribution}/${payload.planId}/${payload.employeeId}/${payload.payDate}`
  // );
};

export const getSourceDeferral = (id) => {
  return apiInstance().get(`${endPoints.census.getSourceDeferral}/${id}`);
};

export const getAllEmployeeLoans = (payload) => {
  return apiInstance().get(
    `${endPoints.census.getAllEmployeeLoans}/${payload.planId}/${payload.employeeId}`
  );
};

export const getPlanMetaData = (id) => {
  return apiInstance().get(`${endPoints.census.getPlanMetaData}/${id}`);
};

export const getEmploymentStatusList = (id) => {
  // return delay(1000).then(() => {
  //   return employeeStatus;
  // });
  return apiInstance().get(`${endPoints.census.getEmploymentStatusList}/${id}`);
};

export const getCompaniesList = (id) => {
  // return delay(1000).then(() => {
  //   return companies;
  // });
  return apiInstance().get(`${endPoints.company.getCompanyList}/${id}`);
};

export const getPlanList = (id) => {
  return apiInstance().get(`${endPoints.plan.getPlanList}/${id}`);
};

export const addEmployeeContribution = (payload) => {
  return apiInstance().post(endPoints.census.addEmployeeContribution, payload);
};

export const addEmployeeCompensation = (payload) => {
  return apiInstance().post(endPoints.census.addEmployeeCompensation, payload);
};

export const addHoursDetail = (payload) => {
  return apiInstance().post(endPoints.census.addHoursDetail, payload);
};

export const saveEmployeeToPayroll = (payload) => {
  return apiInstance().post(endPoints.census.saveEmployeeToPayroll, payload);
};

export const updateEmployeePayroll = (payload) => {
  return apiInstance().post(endPoints.census.updateEmployeeToPayroll, payload);
};

export const getEmployeeCensusInformation = (id) => {
  // return delay(1000).then(() => {
  //   return censusMasterData[0];
  // });
  return apiInstance().get(`${endPoints.census.getEmployee}/${id}`);
};

export const getEmployeeClassificationName = (id) => {
  // return delay (1000).then(() => {
  //   return company;
  // });
  return apiInstance().get(
    `${endPoints.census.getEmployeeClassificationName}/${id}`
  );
};

export const getEmployeeClassificationType = (id) => {
  return apiInstance().get(
    `${endPoints.census.getEmployeeClassificationType}/${id}`
  );
};

export const getEmployeeRehireDetails = (id) => {
  return apiInstance().get(
    `${endPoints.census.getEmployeeRehireDetails}/${id}`
  );
};

export const getPayrollFrequencies = (id) => {
  return apiInstance().get(`${endPoints.census.getPayrollFrequencies}/${id}`);
};

export const getCountriesList = () => {
  return apiInstance().get(`${endPoints.census.getCountiesList}`);
};

export const getStatesList = (id) => {
  return apiInstance().get(`${endPoints.census.getStatesList}/${id}`);
};

export const uploadEmployeeLogo = (payload) => {
  return apiInstance().post(endPoints.census.uploadEmployeeLogo, payload, {
    headers: { "content-type": "multipart/form-data" },
  });
};

export const getEmployeeImage = (employeeId) => {
  return apiInstance().get(
    `${endPoints.census.getEmployeeImage}/${employeeId}`
  );
};
