const endPoints = {
  home: {
    get: "/api/v1/Home",
    post: "/api/v1/Home",
  },
  company: {
    postCompanyGridView: "/api/v1/Company/CompaniesGridView",
    getCompany: "/api/v1/Company",
    postCompany: "/api/v1/Company",
    getGeneratePayrollSchedule: "/api/v1/Company/GeneratePayrollSchedule",
    // getCompany: "/api/v1/Company/fetch",
    // postCompany: "/api/v1/Company/save",
    getCompanyNameCheck: "/api/v1/Company/CheckCompanyNameExists",
    getSponsoringOrganisationNameCheck:
      "/api/v1/Plan/checkSponsoringOrganisationExists",
    getSponsoringOrganisationList: "/api/v1/Company/SponsoringOrganisationList",
    postSponsoringOrganisationList:
      "/api/v1/Company/SaveSponsoringOrganisation",
    getCompanyCount: "/api/v1/Company/CompanyCount",
    postSponsoringOrganisations: "/api/v1/Company/SponsoringOrganisations",
    postCompaniesGridViewBySponsoringOrganisation:
      "/api/v1/Company/CompaniesGridViewBySponsoringOrganisation",
    getCheckEinNumberExists: "/api/v1/Company/CheckEinNumberExists",
    getCompanyList: "/api/v1/Company/CompanyName",
    getMasterClassifications: "/api/v1/Company/GetMasterClassificationType",
    addMasterClassifications: "/api/v1/Company/AddMasterClassificationType",
    checkMasterClassificationExists:
      "/api/v1/Company/CheckMasterClassificationExists",
    getMasterEmploymentStatuses: "/api/v1/Company/GetMasterEmploymentStatuses",
    addMasterEmploymentStatus: "/api/v1/Company/AddMasterEmploymentStatus",
    checkMasterEmploymentStatusExists:
      "/api/v1/Company/CheckMasterEmploymentStatusExists",
    getLoanTypes: "/api/v1/Company/GetMasterLoanTypes",
    addMasterLoanType: "/api/v1/Company/AddMasterLoanType",
    // checkMasterLoanTypeExists: "/api/v1/Company/CheckMasterLoanTypeExists",
  },
  plan: {
    getPlanCount: "/api/v1/Plan/PlanCount",
    postPlanGridView: "/api/v1/Plan/PlanGridViewModel",
    getSponsoringOrganisationList: "/api/v1/Plan/SponsorOrganizations",
    postSponsoringOrganisationList: "/api/v1/Plan/SaveSponsorOrganization",
    getPlan: "/api/v1/Plan/Plan",
    postPlan: "/api/v1/Plan/SavePlan",
    checkPlanNameExists: "/api/v1/Plan/CheckPlanNameExists",
    checkRkPlanNumberExists: "/api/v1/Plan/checkRkPlanNumberExists",
    getEmployeeClassifications: "/api/v1/Plan/EmployeeClassifications",
    getPlanList: "/api/v1/Plan/PlanList",
    getSourceList: "/api/v1/Plan/SourceList",
    setPlanStatus: "/api/v1/Plan/UpdatePlanStatus",
    getEmploymentStatusList: "/api/v1/Company/GetEmploymentStatusList",
    getClassificationCodes: "/api/v1/Company/ClassificationCode",
    getCompensationCategories: "/api/v1/Plan/CompensationCategory",
  },

  masterData: {
    getCustodians: "/api/v1/MasterData/Custodians",
    getAdvisors: "/api/v1/MasterData/Advisors",
    getTrustees: "/api/v1/MasterData/Trustees",
    getSources: "/api/v1/MasterData/Sources",
    getInvestments: "/api/v1/MasterData/Investments",
  },
  refData: {
    getStates: "/api/v1/State",
  },
  payroll: {
    finalSubmit: "/api/v1/Payroll/FinalSubmit",
    saveFundingDetails: "/api/v1/Payroll/SaveFundingDetails",
    submitAndUpdateTempEmployeeInECR: "/api/v1/Payroll/ECRSubmitAndUpdate",
    addEmployeeToPayroll: "​/api​/v1​/Payroll​/AddEmployeeForPayroll​",
    deleteTempEmployeeId: "/api/v1/Payroll/DeleteTempEmployeeById",
    getFilesBasedOnSearch:
      "/api/v1/Payroll/GetUploadedFilesBasedOnSearchCriteria",
    geFileInformationById: "/api/v1/Payroll/GetFileInformation",
    getFileGraphInformation: "/api/v1/Payroll/FileProgressGraphInformation",
    getPayrollMetaDataInfo: "/api/v1/Payroll/GetPayrollMetaDataInformation",
    getPayrollEmployeeDetails: "/api/v1/Payroll/GetPayrollDetails",
    retrievePayrollDetailsByFileId:
      "/api/v1/Payroll/RetrievePayrollDetailsByFileId",
    getFundingDetailsByFile: "/api/v1/Payroll/GetFundingDetailsByFile",
    getFundingDetailsByClassification:
      "/api/v1/Payroll/GetFundingDetailsByClassification",
    getFundingDetailByPlan: "/api/v1/Payroll/GetFundingDetailByPlan",
    getFundingDetailByDivision: "/api/v1/Payroll/GetFundingDetailByDivision",
    getFundingTransactionDetailsByClassification:
      "/api/v1/Payroll/GetFundingTransactionDetailsByClassification",
    getForfeitureDetails: "/api/v1/Payroll/GetForfeitureDetails",
    recordLock: "/api/v1/Payroll/RecordLock",
    getSourceDeferral: "/api/v1/Payroll/GetSourceDeferral",
    getAllEmployeeLoans: "/api/v1/Payroll/GetAllEmployeeLoans",
    acceptAllWarningsInaFile: "/api/v1/Payroll/AcceptAllWarningsInaFile",
    acceptWarningsByMessage: "/api/v1/Payroll/AcceptWarningsById",
    createPayroll: "/api/v1/Payroll/CreatePayroll",
    GetErrorList: "/api/v1/payroll/ErrorList",
    GetWarningsList: "/api/v1/payroll/WarningsList",
    getAllRecordsList: "/api/v1/payroll/GetAllRecordsList",
    getTempEmployeeDetailsByssn:
      "​/api​/v1​/Payroll​/GetPayrollInformationBySSN​",
    getTempEmployeeDetailsById: "/api/v1/payroll/TempEmployeeDetailsById​",
    getFileInformationById: "/api/v1/Payroll/GetFileInformation",
    getDataTypeMisMatches: "/api/v1/Payroll/GetDataTypeMisMatchErrors",
    getDuplicateEmployeeByFileId: "/api/v1/Payroll/GetDuplicateEmployeeSSN",
    getDuplicateRecord: "/api/v1/Payroll/GetDuplicateRecordDetails",
    getCorrectAcceptDuplicateEmployee:
      "/api/v1/Payroll/CorrectAcceptDuplicateEmployee",
    getFilesBySearchCriteria: "/api/v1/Payroll/GetFilesBySearchCriteria",
    getFundingTransactionDetailsByPlan:
      "/api/v1/Payroll/GetFundingTransactionDetailsByPlan",
    getEmployeeDetailsbycompanyandplan:
      "/api/v1/Payroll/GetEmployeeByCompanyName",
    removeEmployeeFromPayroll:
      "/api/v1/Payroll/DeleteTempEmployeeDuringCreatePayroll",
    getTempEmployeeDetails: "/api/v1/Payroll/GetTempEmployeeDetailsById",
    getEmpCensusInformation: "/api/v1/Payroll/GetEmployeeCensusInformation",
    recordUnlock: "/api/v1/Payroll/RecordUnlock",
    errorAndWarningMetadata: "/api/v1/Payroll/GetErrorAndWarningMetadata",
    payrollAndCensusFileUpload: "/api/v1/Payroll/PayrollAndCensusFileUpload",
    deleteFileById: "/api/v1/Payroll/DeleteFileById",
    getWarningsForECR: "/api/v1/Payroll/WarningsList",
    checkClassificationTypePresent: "/api/v1/Payroll/ClassificationTypeExists",
    GetTempCreatePayroll: "/api/v1/Payroll/GetTempCreatePayroll",
    getCompanyPlanPayrollFrequencies:
      "/api/v1/Payroll/GetCompanyPlanPayrollFrequencies",
    createPayrollFromUI: "/api/v1/Payroll/CreatePayrollFromUI",
    getPayrollEmployeesSSNAndNameByFileId:
      "/api/v1/Payroll/GetPayrollEmployeesSSNAndNameByFileId",
    getCreatePayrollInformationByFileId:
      "/api/v1/Payroll/GetCreatePayrollInformationByFileId",
    getEmployerSources: "/api/v1/Payroll/GetEmployerSources",
    getComputationalPeriods: "/api/v1/Payroll/GetComputationalPeriods",
    downloadCreatePayrolldetail: "/api/v1/Payroll/downloadCreatePayrolldetail",
    submitCreatePayroll: "/api/v1/Payroll/submitCreatePayroll",
    UpdatePayrollEmployee: "/api/v1/Payroll/UpdatePayrollEmployee",
  },
  census: {
    getEmployeeClassificationHistory:
      "/api/v1/Payroll/GetEmployeeclassificatonHistory",
    getEmployeeCompensation: "/api/v1/Payroll/GetEmployeeCompensation",
    getSourceLevelContribution: "/api/v1/Payroll/GetSourceLevelContribution",
    getSourceDeferral: "/api/v1/Payroll/GetSourceDeferral",
    getAllEmployeeLoans: "/api/v1/Payroll/GetAllEmployeeLoans",
    getEnrolledPlans: "/api/v1/Payroll/GetEnrolledPlans",
    getEligibilityInformation: "/api/v1/Payroll/GetEligibilityInformation",
    getEligibilityHistory: "/api/v1/Payroll/GetEligibilityHistory",
    getEmployeesBySearchCriteria:
      "/api/v1/Payroll/GetEmployeesBySearchCriteria",
    addEmployeeContribution: "/api/v1/Payroll/AddEmployeeContribution",
    addEmployeeCompensation: "/api/v1/Payroll/AddEmployeeCompensation",
    addHoursDetail: "/api/v1/Payroll/AddHoursDetail",
    getEmployeeContribution: "/api/v1/Payroll/GetEmployeeContribution",
    getCensusHistory: "/api/v1/Payroll/GetEmployeeHistoryDetails",
    deleteExistingEmployee: "/api/v1/Payroll/DeleteExistingEmployeeById",
    getEmployeeLoanRepayments: "/api/v1/Payroll/GetLoanRepaymentInformation",
    getPlanMetaData: "/api/v1/Payroll/GetPlanMetaData",
    getHoursDetails: "/api/v1/Payroll/GetHoursDetail",
    saveEmployeeToPayroll: "/api/v1/Payroll/SaveEmployee",
    updateEmployeeToPayroll: "/api/v1/Payroll/UpdateExistingEmployee",
    getEmployee: "/api/v1/Payroll/GetEmployee",
    getEmployeeClassificationType: "/api/v1/Company/ClassificationType",
    getEmployeeClassificationName: "​/api​/v1​/Company​/GetClassifications​",
    getEmployeeRehireDetails: "/api/v1/Payroll/GetEmployeeRehireDetails",
    getEmployeePlanSources: "/api/v1/Plan/SourceList",
    getEmploymentStatusList: "/api/v1/Company/GetEmploymentStatusList",
    getPayrollFrequencies: "/api/v1/Payroll/GetPayrollFrequencies",
    getCountiesList: "/api/v1/Country",
    getStatesList: "/api/v1/State",
  },
  eligibility: {
    runEligibility: "/api/v1/Eligibility/RunManualEligibility",
  },
  enrollment: {
    getPlanSourceInformation:
      "/api/v1/Enrollment/RetrievePlanSourceInformation",
    getPlanInvestments: "api/v1/Enrollment/GetPlanInvestments",
    postDefaultElectionSetting: "/api/v1/Enrollment/SaveDefaultElectionSetting",
    postPlanInvestment: "/api/v1/Enrollment/AddPlanInvestment",
    postADIApplicableConfiguration:
      "/api/v1/Enrollment/SaveADIApplicableConfiguration",
    getDefaultElectionSetting:
      "/api/v1/Enrollment/GetDefaultElectionSettingIfExists",
    deleteInvestment: "/api/v1/Enrollment/DeleteInvestment",
    getADIApplicableConfiguration: "/api/v1/Enrollment/RetrieveADIDataIfExists",
    saveAutoEnrollment: "/api/v1/Enrollment/SaveAutoEnrollment",
    getAutoEnrollment: "/api/v1/Enrollment/GetAutoEnrollment",
    getEmployeeClassification: "/api/v1/Enrollment/GetEmployeeClassification",
    saveAdditionalAutoEnrollment:
      "/api/v1/Enrollment/SaveAdditionalAutoEnrollment",
    retrieveAdditionalAutoEnrollmentIfExists:
      "/api/v1/Enrollment/RetrieveAdditionalAutoEnrollmentIfExists",
    AutoEnrollmentGeneration: "/api/v1/Enrollment/AutoEnrollmentGeneration",
    EnrollmentSummaryReport: "/api/v1/Enrollment/EnrollmentSummaryReport",
    ParticipantwiseReport: "/api/v1/Enrollment/ParticipantwiseReport",
    CompanyanddPlanWiseEnrollmentReport:
      "/api/v1/Enrollment/CompanyanddPlanWiseEnrollmentReport",
  },
  maintenance: {
    getHolidayCalendarMaster: "/api/v1/Maintenance/GetHolidays",
    saveHolidayDetails: "/api/v1/Maintenance/AddHolidays",
    deleteHoliday: "/api/v1/Maintenance/DeleteHoliday",
    getPlanGroups: "/api/v1/Maintenance/GetPlanGroups",
    getAdvisors: "/api/v1/Maintenance/GetAdvisors",
    getCustodians: "/api/v1/Maintenance/GetCustodians",
    getInvestments: "/api/v1/Maintenance/GetInvestmentNames",
    getTrustees: "/api/v1/Maintenance/GetTrustees",
    getPlansInPlanGroup: "/api/v1/Maintenance/GetPlansBySearchCriteria",
    deletePlanGroup: "/api/v1/Maintenance/DeletePlanGroup",
    getPlansBySearchCriteria: "/api/v1/Maintenance/GetPlansBySearchCriteria",
    addPlanGroup: "/api/v1/Maintenance/AddPlanGroup",
    getPlanGroupById: "/api/v1/Maintenance/GetPlanGroupById",
  },
  reports: {
    getFileInformationWithErrorDetailsById: "/api/v1/Report/GetFileInformation",
    getSourceLevelPayrollDetailsById:
      "/api/v1/Report/GetSourceLevelPayrollinformation",
    getDataChangeInformation: "/api/v1/Report/GetDataChangeReportInformation",
    getDataOverrideInformation:
      "/api/v1/Report/GetDataOverrideReportInformation",
    getErrorValidationInformation:
      "/api/v1/Report/GetErrorValidationInformation",
    getPayrollFundingInformation: "/api/v1/Report/GetPayrollFundingInformation",
    getDownloadDataChangeReport: "/api/v1/Report/DownloadDataChangeReport",
    getDownloadDataOverrideReport: "/api/v1/Report/DownloadDataOverrideReport",
    getDownloadErrorValidationReport: "/api/v1/Report/DownloadErrorReport",
    getDownloadFundingReport:
      "/api/v1/Report/DownloadPayrollFundingInformation",
    getDownloadInputFileReport: "/api/v1/Report/DownloadInputFile",
    getDownloadSubmittedFileReport: "/api/v1/Report/DownloadSubmittedFile",

    // Manage Report
    getCompaniesList: "/api/v1/Report/GetCompaniesList",
    getPlansList: "/api/v1/Report/GetPlansList",
    getDownloadEligibilityStatusReport:
      "/api/v1/Report/DownloadEligibilityStatusReport",
    getEligibilityStatusReportInformation:
      "/api/v1/Report/GetEligibilityStatusReportInformation",
    getDownloadEligibilityForecastReport:
      "/api/v1/Report/DownloadEligibilityForcastReport",
    getEligibilityForecastReportInformation:
      "/api/v1/Report/GetEligibilityForecastReportInformation",
    getDownload402gReport: "/api/v1/Report/Download402GReport",
    get402gReportInformation: "/api/v1/Report/Get402gContribitionReport",
    getDownload415Report: "/api/v1/Report/Download415Report",
    get415ReportInformation: "/api/v1/Report/Get415ContribitionReport",
    getDownloadDeletedParticipantReport:
      "/api/v1/Report/DownloadDeletedParticipantReport",
    getDeletedParticipantReportInformation:
      "/api/v1/Report/GetDeletedParticipantReport",
    getDownloadEmploymentStatusReport:
      "/api/v1/Report/DownloadEmploymentStatusReport",
    getEmploymentStatusReportInformation:
      "/api/v1/Report/GetEmployementStatusReport",
  },
  // enrollment:{
  //   getPlanSources:"/api/v1/Enrollment/RetrievePlanSourceInformation",
  // }
  eligibility: {
    runManualEligibility: "/api/v1/Eligibility/RunManualEligibility",
  },
};

export default endPoints;
