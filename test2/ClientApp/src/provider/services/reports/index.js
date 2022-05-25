import apiInstance from "../api";
import fileApiInstance from "../fileApi";
import endPoints from "../endpoints";
import { delay } from "../helpers";
import getPlans from "../../mocks/getPlans.json";
import EligilibilityReport from "../../mocks/eligibilityReport.json";
import EligilibilityForecast from "../../mocks/eligibilityForecast.json";
import DeletedParticipant from "../../mocks/deletedParticipant.json";
import GContributionLimit from "../../mocks/GContributionLimit.json";
import ContributionLimit from "../../mocks/contributionLimit.json";
import EmployementStatus from "../../mocks/employementStatus";

export const getReportsDetails = () => {
  // return apiInstance().get(endPoints.plan.get);
  return delay(100).then(() => {
    return getPlans;
  });
};

export const getFileInformationWithErrorDetailsByFileId = (fileId) => {
  return apiInstance().get(
    `${endPoints.reports.getFileInformationWithErrorDetailsById}/${fileId}`
  );
};

export const getDataChangeReport = (fileId) => {
  return apiInstance().get(
    `${endPoints.reports.getDataChangeReport}/${fileId}`
  );
};

export const getAllEmployeeRecordsInformation = (payload) => {
  return apiInstance().get(
    `${endPoints.reports.getAllEmployeeRecords}/${payload.fileId}/${payload.searchString}/${payload.pageNumber}`
  );
};

export const getEmployeePayDateLevelTransactionDetails = (payload) => {
  return apiInstance().get(
    `${endPoints.reports.getEmployeeTransactionDetails}/${payload.fileId}/${payload.employeeId}/${payload.planId}/${payload.payDate}`
  );
};
export const getDataChangeInformationById = (payload) => {
  return apiInstance().get(
    `${endPoints.reports.getDataChangeInformation}/${payload.fileId}/${payload.pageNumber}`
  );
};
export const downloadAllFileEmployeeDetails = (payload) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadAllFileEmployeeDetails}/${payload.searchString}/${payload.fileId}`
  );
};
export const downloadDataChangeReportById = (fileId) => {
  return fileApiInstance().get(
    `${endPoints.reports.downloadDataChangeReport}/${fileId}`
  );
};

export const getDataOverrideInformationById = (payload) => {
  return apiInstance().get(
    `${endPoints.reports.getDataOverrideInformation}/${payload.fileId}/${payload.pageNumber}`
  );
};

export const getErrorValidationInformationById = (payload) => {
  return apiInstance().get(
    `${endPoints.reports.getErrorValidationInformation}/${payload.fileId}/${payload.pageNumber}`
  );
};

export const getPayrollFundingInformationById = (payload) => {
  return apiInstance().get(
    `${endPoints.reports.getPayrollFundingInformation}/${payload.fileId}/${payload.pageNumber}`
  );
};

export const getInputFileById = (fileId) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadUploadedFileReport}/${fileId}`
  );
};

export const getSubmittedFilebyFileId = (fileId) => {
  return fileApiInstance().get(
    `${endPoints.reports.getDownloadSubmittedFileReport}/${fileId}`
  );
};

export const getSourceLevelPayrollDetailsByFileId = (id) => {
  return apiInstance().get(
    `${endPoints.reports.getSourceLevelPayrollDetailsById}/${id}`
  );
};

//Manage Report

export const getCompaniesDropDown = (payload) => {
  return apiInstance().get(endPoints.reports.getCompaniesList);
};

export const getPlansDropDown = (companyId) => {
  return apiInstance().get(`${endPoints.reports.getPlansList}/${companyId}`);
};

export const getDownloadEligibilityStatusReport = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownloadEligibilityStatusReport,
    payload
  );
};

export const getEligilibilityStatusReportInfo = (payload) => {
  return apiInstance().post(
    endPoints.reports.getEligibilityStatusReportInformation,
    payload
  );
};

export const getDownloadEligibilityForecastReport = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownloadEligibilityForecastReport,
    payload
  );
};

export const getEligibilityForecastReportInfo = (payload) => {
  return apiInstance().post(
    endPoints.reports.getEligibilityForecastReportInformation,
    payload
  );
};

export const getDownload402gReport = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownload402gReport,
    payload
  );
};

export const get402gReportInfo = (payload) => {
  return apiInstance().post(
    endPoints.reports.get402gReportInformation,
    payload
  );
};

export const getDownload415Report = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownload415Report,
    payload
  );
};

export const get415ReportInfo = (payload) => {
  return apiInstance().post(endPoints.reports.get415ReportInformation, payload);
};

export const getDownloadDeletedParticipantReport = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownloadDeletedParticipantReport,
    payload
  );
};

export const getDeletedParticipantReportInfo = (payload) => {
  return apiInstance().post(
    endPoints.reports.getDeletedParticipantReportInformation,
    payload
  );
};
export const GetRehireParticipantsReport = (payload) => {
  return apiInstance().post(
    endPoints.reports.getRehireParticipantsReportInformation,
    payload
  );
};
export const GetNewParticipantEligibilityReport = (payload) => {
  return apiInstance().post(
    endPoints.reports.getNewParticipantEligibilityReportInformation,
    payload
  );
};

export const getEmploymentStatusReportInfo = (payload) => {
  return apiInstance().post(
    endPoints.reports.getEmploymentStatusReportInformation,
    payload
  );
};

export const getDownloadEmploymentStatusReport = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownloadEmploymentStatusReport,
    payload
  );
};

export const getDownloadNewParticipantReport = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownloadNewParticipantReport,
    payload
  );
};

export const getDownloadRehireReport = (payload) => {
  return fileApiInstance().post(
    endPoints.reports.getDownloadRehireReport,
    payload
  );
};

export const getEligilibilityReportMaster = () => {
  return delay(100).then(() => {
    return EligilibilityReport;
  });
};

export const getEligilibilityForecastMaster = () => {
  return delay(100).then(() => {
    return EligilibilityForecast;
  });
};

// export const getDeletedParticipantMaster = () => {
//   return delay(100).then(() => {
//     return DeletedParticipant;
//   });
// };

export const getGContributionLimitMaster = () => {
  return delay(100).then(() => {
    return GContributionLimit;
  });
};

export const getContributionLimitMaster = () => {
  return delay(100).then(() => {
    return ContributionLimit;
  });
};

export const getEmployementStatusMaster = () => {
  return delay(100).then(() => {
    return EmployementStatus;
  });
};
