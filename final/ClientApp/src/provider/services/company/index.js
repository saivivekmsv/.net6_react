import apiInstance from "../api";
import endPoints from "../endpoints";
// import manageCompanyDetails from "../../mocks/manageCompanyDetails.json";

export const postCompanyGridView = (payload) => {
  return apiInstance().post(
    `${endPoints.company.postCompanyGridView}`,
    payload
  );
};

export const getCompanyDetails = (id) => {
  return apiInstance().get(`${endPoints.company.getCompany}/${id}`);
};
export const getMasterClassificationTypes = (companyId) => {
  return apiInstance().get(
    `${endPoints.company.getMasterClassifications}/${companyId}`
  );
};
export const addMasterClassificationTypes = (payload) => {
  return apiInstance().post(
    `${endPoints.company.addMasterClassifications}`,
    payload
  );
};
export const checkMasterClassificationExists = (payload) => {
  return apiInstance().get(
    `${endPoints.company.checkMasterClassificationExists}/${payload}`
  );
};
export const getMasterEmploymentStatuses = (companyId) => {
  return apiInstance().get(
    `${endPoints.company.getMasterEmploymentStatuses}/${companyId}`
  );
};
export const addMasterEmploymentStatus = (payload) => {
  return apiInstance().post(
    `${endPoints.company.addMasterEmploymentStatus}`,
    payload
  );
};
export const checkMasterEmploymentStatusExists = (payload) => {
  return apiInstance().get(
    `${endPoints.company.checkMasterEmploymentStatusExists}/${payload}`
  );
};
export const getGeneratePayrollSchedule = (payload) => {
  return apiInstance().post(
    `${endPoints.company.getGeneratePayrollSchedule}`,
    payload
  );
};

export const postCompanyDetails = (payload) => {
  return apiInstance().post(endPoints.company.postCompany, payload);
};

export const getCheckCompanyNameExists = (payload) => {
  return apiInstance().get(
    `${endPoints.company.getCompanyNameCheck}/${payload}`
  );
};

export const getCheckIfSponsoringOrganisationNameExists = (payload) => {
  return apiInstance().get(
    `${endPoints.company.getSponsoringOrganisationNameCheck}/${payload}`
  );
};

export const getSponsoringOrganisationList = () => {
  return apiInstance().get(
    `${endPoints.company.getSponsoringOrganisationList}`
  );
};

export const postSponsoringOrganisationList = (payload) => {
  return apiInstance()
    .post(`${endPoints.company.postSponsoringOrganisationList}`, payload)
    .then(() => getSponsoringOrganisationList());
};

export const getCompanyCount = () => {
  return apiInstance().get(`${endPoints.company.getCompanyCount}`);
};

export const postSponsoringOrganisations = (payload) => {
  return apiInstance().post(
    `${endPoints.company.postSponsoringOrganisations}`,
    payload
  );
};

export const postCompaniesGridViewBySponsoringOrganisation = (payload) => {
  return apiInstance().post(
    `${endPoints.company.postCompaniesGridViewBySponsoringOrganisation}`,
    payload
  );
};

export const getCheckEinNumberExists = (payload) => {
  return apiInstance().get(
    `${endPoints.company.getCheckEinNumberExists}/${payload}`
  );
};

export const getLoanTypes = (companyId = 0) => {
  return apiInstance().get(`${endPoints.company.getLoanTypes}/${companyId}`);
};

export const addLoanType = (payload) => {
  return apiInstance().post(`${endPoints.company.addMasterLoanType}`, payload);
};

export const uploadCompanyLogo = (payload) => {
  return apiInstance().post(endPoints.company.uploadCompanyLogo, payload, {
    headers: { "content-type": "multipart/form-data" },
  });
};

export const getCompanyLogo = (companyId) => {
  return apiInstance().get(`${endPoints.company.getCompanyLogo}/${companyId}`);
};

// export const checkLoanTypeExists = (payload) => {
//   return apiInstance().get(`${endPoints.company.checkMasterLoanTypeExists}/${payload.name}/${payload.companyId}`);
// };
