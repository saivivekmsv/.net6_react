import apiInstance from "../api";
import fileApiInstance from "../fileApi";
import endPoints from "../endpoints";
import { delay } from "../helpers";
import getPlans from "../../mocks/getPlans.json";
import payrollAndCensusData from "../../mocks/payrollAndCensusData.json";
import eligibilityOverrideData from "../../mocks/eligibilityOverrideData.json";
import fundingDetails from "../../mocks/fundingDetails.json";
import forfeitureDetails from "../../mocks/forfeitureMaster.json";
import fundingTransactionDetails from "../../mocks/fundingTransactionDetails.json";

//import createAPIInstance from "../api";

export const getRecordUnlock = (id) => {
  console.log(`Request Sent for Record Unlock with id = ${id}`);
  return apiInstance().get(`${endPoints.payroll.recordUnlock}/${1}`);
  // return delay(1000).then(() => {
  //   return {IsSuccessfull:false};
  // });
};

export const getEligibilityInformation = (payload) => {
  console.log(
    `Request Sent for eligibility information with  ${payload.planId} and ${payload.employeeId}`
  );
  // return delay(1000).then(() => {
  //   return eligibilityOverrideData;
  // });
  return apiInstance().get(
    `${endPoints.census.getEligibilityInformation}/${payload.planId}/${payload.employeeId}`
  );
};

export const getEligibilityHistory = (payload) => {
  console.log(
    `Request Sent for eligibility history with  ${payload.planId} and ${payload.sourceId} and ${payload.employeeId}`
  );
  // return delay(1000).then(() => {
  //   return eligibilityOverrideData[0].history;
  // });
  return apiInstance().get(
    `${endPoints.census.getEligibilityHistory}/${payload.planId}/${payload.sourceId}/${payload.employeeId}`
  );
};

export const getErrorAndWarningMetadata = (id) => {
  console.log(`Request Sent for error and warning metadata with  ${id}`);
  return apiInstance().get(`${endPoints.payroll.errorAndWarningMetadata}/${1}`);
};
export const getWarningsInECR = (id) => {
  return apiInstance().get(`${endPoints.payroll.GetWarningsList}/${id}`);
};
export const getErrorsInECR = (id) => {
  return apiInstance().get(`${endPoints.payroll.GetErrorList}/${id}`);
};
export const getAllRecords = (id) => {
  return apiInstance().get(`${endPoints.payroll.getAllRecordsList}/${id}`);
};
export const getPayrollDetails = () => {
  return apiInstance().get(endPoints.plan.getPlanCount);
};

export const postCreatePayroll = (payload) => {
  return apiInstance().post(endPoints.payroll.createPayroll, payload);
};

export const createPayrollFromUI = (payload) => {
  return apiInstance().post(endPoints.payroll.createPayrollFromUI, payload);
};

//Manage Payroll
export const getPayrollTileCard = () => {
  return delay(1000).then(() => {
    //  return payrollAndCensusData;
  });
};
export const saveFundingDetails = (payload) => {
  return apiInstance().post(`${endPoints.payroll.saveFundingDetails}`, payload);
};
export const getFilesBasedOnSearch = (payload) => {
  return apiInstance().post(
    `${endPoints.payroll.getFilesBasedOnSearch}`,
    payload
  );
};

export const getCorrectAcceptDuplicateEmployee = (payload) => {
  return apiInstance().post(
    `${endPoints.payroll.getCorrectAcceptDuplicateEmployee}`,
    payload
  );
};

export const getFileInformationByFileId = (fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getFileInformationById}/${fileId}`
  );
};

export const getDuplicateEmployeeByFileId = (fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getDuplicateEmployeeByFileId}/${fileId}`
  );
};

export const getDuplicateRecord = (ssn, payDate, fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getDuplicateRecord}/${ssn}/${payDate}/${fileId}`
  );
};

export const getFileGraphInformationById = (fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getFileGraphInformation}/${fileId}`
  );
};

export const getPayrollMetaDataDetails = (fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getPayrollMetaDataInfo}/${fileId}`
  );
};

export const getPayrollEmployeesSSNAndNameByFileId = (fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getPayrollEmployeesSSNAndNameByFileId}/${fileId}`
  );
};

export const getTempCreatePayroll = (fileId) => {
  console.log("FILEID ", fileId);
  return apiInstance().get(
    `${endPoints.payroll.GetTempCreatePayroll}/${fileId}`
  );
};

export const getPayrollEmployeeDetails = (fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getPayrollEmployeeDetails}/${fileId}`
  );
};

export const getCreatePayrollInformationByFileId = (
  fileId
  // companyId,
  // payrollFrequencyId
) => {
  return apiInstance().get(
    `${endPoints.payroll.getCreatePayrollInformationByFileId}/${fileId}`
  );
};
export const downloadCreatePayrolldetail = (
  employeeData,
  companyId,
  fileUploadId
) => {
  return apiInstance().post(
    `${endPoints.payroll.downloadCreatePayrolldetail}/${companyId}/${fileUploadId}`,
    employeeData
  );
};
export const UpdatePayrollEmployee = (employeeData) => {
  return apiInstance().post(
    endPoints.payroll.UpdatePayrollEmployee,
    JSON.stringify(employeeData)
  );
};

export const submitCreatePayroll = (employeeData, companyId, fileUploadId) => {
  return apiInstance().post(
    `${endPoints.payroll.submitCreatePayroll}/${companyId}/${fileUploadId}`,
    employeeData
  );
};

export const postCompanyDetails = (payload) => {
  return apiInstance().post(endPoints.payroll.ErrorList, payload);
};

export const getRecordLock = (id) => {
  console.log(`Recieved request for record lock with fileid: ${id}`);
  return apiInstance().get(`${endPoints.payroll.recordLock}/${id}`);
  // return delay(1000).then(() => {
  //   return {
  //     IsSuccessfull:true
  //   };
  // });
};
export const finalSubmit = (id, fileType) => {
  return apiInstance().get(
    `${endPoints.payroll.finalSubmit}/${id}/${fileType}`
  );
};
export const getEmployerSources = (planId) => {
  return apiInstance().get(`${endPoints.payroll.getEmployerSources}/${planId}`);
};

export const getComputationalPeriods = (payload) => {
  return apiInstance().get(
    `${endPoints.payroll.getComputationalPeriods}/${payload.planId}/${payload.sourceId}/${payload.employeeId}`
  );
};
export const submitAndUpdateECR = (payload) => {
  return apiInstance().post(
    `${endPoints.payroll.submitAndUpdateTempEmployeeInECR}`,
    payload
  );
};

export const getCompanyPlanPayrollFrequencies = () => {
  return apiInstance().get(endPoints.payroll.getCompanyPlanPayrollFrequencies);
};

//ECR
//-------------------
export const getErrorsList = (fileId) => {
  return apiInstance().get(`${endPoints.payroll.GetErrorList}/${fileId}`);
};

export const getWarningsList = (fileId) => {
  return apiInstance().get(`${endPoints.payroll.GetWarningsList}/${fileId}`);
};

export const getRecordsList = (fileId) => {
  return apiInstance().get(`${endPoints.payroll.getAllRecordsList}/${fileId}`);
};

export const acceptAllWarningsInaFile = (id) => {
  console.log(
    `Recieved request for accept all warnings in a file with fileid: ${id}`
  );
  return apiInstance().post(
    `${endPoints.payroll.acceptAllWarningsInaFile}/${id}`
  );
};
export const acceptWarningByMessageCode = (id, messageCode) => {
  var payload = { fileId: parseInt(id), messageCode: messageCode };
  console.log(payload);
  return apiInstance().post(
    `${endPoints.payroll.acceptWarningsByMessage}`,
    payload
  );
};
export const getSourceDeferral = (id) => {
  console.log(`Recieved request for get source deferral with planid: ${id}`);
  return apiInstance().get(`${endPoints.payroll.getSourceDeferral}/${id}`);
};

export const getAllEmployeeLoans = (planId, employeeId) => {
  console.log(
    `Recieved request for get all employee loans with planid: ${planId} and employeeid: ${employeeId}`
  );
  return apiInstance().get(
    `${endPoints.payroll.getAllEmployeeLoans}/${planId}/${employeeId}`
  );
};

//Payroll Funding
//------------------
export const getFundingDetailsByFile = (FileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getFundingDetailsByFile}/${FileId}`
  );
};

export const getFundingDetailsByClassification = (FileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getFundingDetailsByClassification}/${FileId}`
  );
};
export const getFundingDetailByPlan = (FileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getFundingDetailByPlan}/${FileId}`
  );
};

export const getForfeitureDetails = (payload) => {
  const { planId, fileId } = payload;
  return apiInstance().get(
    `${endPoints.payroll.getForfeitureDetails}/${planId}/${fileId}`
  );
};

export const checkClassificationCanBeDeleted = (typeId) => {
  return apiInstance().get(
    `${endPoints.payroll.checkClassificationTypePresent}/${typeId}`
  );
};

export const getFundingDetailByDivision = (FileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getFundingDetailByDivision}/${FileId}`
  );
};

export const getFundingTransactionDetailsByClassification = (
  classificationId,
  planId,
  fileId
) => {
  // return delay(1000).then(() => {
  //   return fundingTransactionDetails;
  // });
  return apiInstance().get(
    `${endPoints.payroll.getFundingTransactionDetailsByClassification}/${classificationId}/${planId}/${fileId}`
  );
};
export const getFundingTransactionDetailsByPlan = ({ planId, fileId }) => {
  return apiInstance().get(
    `${endPoints.payroll.getFundingTransactionDetailsByPlan}/${planId}/${fileId}`
  );
};

export const retrievePayrollDetailsByFileId = (FileId) => {
  return apiInstance().get(
    `${endPoints.payroll.retrievePayrollDetailsByFileId}/${FileId}`
  );
};

//--------

export const getExistingEmployeeDetails = (companyId) => {
  return apiInstance().get(
    `${endPoints.payroll.getEmployeeDetailsbycompanyandplan}/${companyId}`
  );
};

export const addEmployeeToPayrollData = (payload) => {
  return apiInstance().get(
    `${endPoints.payroll.addEmployeeToPayroll}/${payload}`
  );
};

export const removeEmployeeFromPayrollData = (id) => {
  return apiInstance().delete(
    `${endPoints.payroll.removeEmployeeFromPayroll}/${id}`
  );
};
export const deleteTempEmployeeById = (id) => {
  return apiInstance().delete(
    `${endPoints.payroll.deleteTempEmployeeId}/${id}`
  );
};
export const getTempEmployeeDetailsforPayroll = (id) => {
  return apiInstance().get(`${endPoints.payroll.getTempEmployeeDetails}/${id}`);
};

export const saveEmployeeInformationInPayroll = (payload) => {
  return apiInstance().get(
    `${endPoints.payroll.updateEmployeeToPayroll}/${payload}`
  );
};
export const employeeCensusInformation = (id) => {
  return apiInstance().get(
    `${endPoints.payroll.getEmpCensusInformation}/${id}`
  );
};
export const getDataTyeMisMatchErrors = (fileId) => {
  return apiInstance().get(
    `${endPoints.payroll.getDataTypeMisMatches}/${fileId}`
  );
};
export const editContributionDetails = (id) => {
  return apiInstance().get(
    `${endPoints.payroll.getTempEmployeeDetailsByssn}/${id}`
  );
};
export const payrollAndCensusFileUpload = (payload) => {
  return apiInstance().post(
    endPoints.payroll.payrollAndCensusFileUpload,
    payload,
    { headers: { "content-type": "multipart/form-data" } }
  );
};

export const deleteUploadedFileById = (id) => {
  return apiInstance().delete(`${endPoints.payroll.deleteFileById}/${id}`);
};

export const getTempEmployeeDetailsById = (payload) => {
  return apiInstance().get(
    `${endPoints.payroll.getTempEmployeeDetailsById}/${payload}`
  );
};

// Payroll Report

export const getFileInformationWithErrorDetailsById = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getFileInformationWithErrorDetailsById}/${fileid}`
  );
};

export const getSourceLevelPayrollDetailsById = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getSourceLevelPayrollDetailsById}/${fileid}`
  );
};

export const getDataChangeInformation = (fileid, from, count) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDataChangeInformation}/${fileid}/${from}/${count}`
  );
};

export const getDataOverrideInformation = (fileid, from, count) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDataOverrideInformation}/${fileid}/${from}/${count}`
  );
};

export const getErrorValidationInformation = (fileid, from, count) => {
  return fileApiInstance().get(
    `${endPoints.reports.getErrorValidationInformation}/${fileid}/${from}/${count}`
  );
};

export const getPayrollFundingInformation = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getPayrollFundingInformation}/${fileid}`
  );
};

export const getDownloadDataChangeReport = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadDataChangeReport}/${fileid}`
  );
};

export const getDownloadDataOverrideReport = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadDataOverrideReport}/${fileid}`
  );
};

export const getDownloadErrorValidationReport = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadErrorValidationReport}/${fileid}`
  );
};

export const getDownloadFundingReport = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadFundingReport}/${fileid}`
  );
};

export const getDownloadInputFileReport = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadInputFileReport}/${fileid}`
  );
};

export const getDownloadSubmittedFileReport = (fileid) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadSubmittedFileReport}/${fileid}`
  );
};
