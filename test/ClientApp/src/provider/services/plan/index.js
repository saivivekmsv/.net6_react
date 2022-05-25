import apiInstance from "../api";
import endPoints from "../endpoints";
import { delay } from "../helpers";
import manageSources from "../../mocks/manageSources.json";
// import manageSourcesMaster from "../../mocks/manageSourcesMaster.json";
import eligibilityRuleMaster from "../../mocks/eligibilityRule.json";
import eligibilityMaster from "../../mocks/eligibility.json";
import manageEligibility from "../../mocks/manageEligibility.json";
import employeeClassificationForSources from "../../mocks/employeeClassificationForSources.json";
import employeeDeferralTypes from "../../mocks/employeeDeferralTypes.json";
import addSourceAllocation from "../../mocks/addSourceAllocation.json";
import sourcesEffectiveDateHistory from "../../mocks/sourcesEffectiveDateHistory.json";
import vestingMaster from "../../mocks/vestingMaster.json";
import ForfeitureMaster from "../../mocks/forfeitureMaster.json";
// import getPlans from "../../mocks/getPlans.json";
import manageSourceEnrollment from "../../mocks/manageSourceEnrollment.json";
import manageDistributions from "../../mocks/manageDistributionsMaster.json";
import distributionSourceMaster from "../../mocks/distributionSourceMaster.json";
import loanMaster from "../../mocks/loanMaster.json";
// import TrusteeMasterInformation from "../../mocks/trusteeMaster.json";
// import CustodianMasterInformation from "../../mocks/custodianMaster.json";
// import AdvisorMasterInformation from "../../mocks/advisorMaster.json";
// import ManageTrustee from "../../mocks/manageTrustee.json";
import { transformMasterDataInfo } from "../../utils";

export const postPlanGridDetails = (payload) => {
  return apiInstance().post(`${endPoints.plan.postPlanGridView}`, payload);
};
export const getMasterPlans = (payload) => {
  return apiInstance().get(`${endPoints.plan.getMasterplans}/1`); //tenantId HardCoded
};
export const getPlanCount = () => {
  return apiInstance().get(`${endPoints.plan.getPlanCount}`);
};
export const setPlanStatus = (planId, planStatus) => {
  var payload = { planId: planId, planStatus: planStatus };
  console.log(payload);
  return apiInstance().post(`${endPoints.plan.setPlanStatus}`, payload);
};
export const getPlanDetails = (id) => {
  return apiInstance().get(`${endPoints.plan.getPlan}/${id}`);
};

// Trustee
export const getTrusteeCompany = (id = 1) => {
  return apiInstance()
    .get(`${endPoints.masterData.getTrustees}/${id}`)
    .then((response) => transformMasterDataInfo(response));
};

// Trustee
export const getAdvisorCompany = (id = 1) => {
  return apiInstance()
    .get(`${endPoints.masterData.getAdvisors}/${id}`)
    .then((response) => transformMasterDataInfo(response));
};
// export const getManageTrusteeCompany = (id) => {
//   console.log(id, "plan id")
//   return apiInstance().get(`${endPoints.plan.getPlan}`)
//   .then((response) => {
//         console.log(response, "trustee table")
//         return transformMasterDataInfo(response.trustees || []);
//       })
//   // return delay(1000).then(() => {
//   //   return ManageTrustee;
//   // });
// };

// Custodian
export const getIRSLimits = (planType) => {
  return apiInstance().get(`${endPoints.plan.getIRSLimits}/${planType}`);
};
export const getCustodianCompany = (id = 1) => {
  return apiInstance()
    .get(`${endPoints.masterData.getCustodians}/${id}`)
    .then((response) => transformMasterDataInfo(response));
};

export const getPlanCompanyNameExists = (planName) => {
  return apiInstance().get(`${endPoints.plan.checkPlanNameExists}/${planName}`);
};

export const checkRkPlanNumberExists = (rkPlanNumber) => {
  return apiInstance().get(
    `${endPoints.plan.checkRkPlanNumberExists}/${rkPlanNumber}`
  );
};

// Sources
export const getPlanSources = () => {
  return delay(1000).then(() => {
    return manageSources;
  });
};

export const getPlanSourcesMasterData = (id = 1) => {
  return apiInstance().get(`${endPoints.masterData.getSources}/${id}`);
};

export const getInvestmentsMasterData = (id = 1) => {
  return apiInstance().get(`${endPoints.masterData.getInvestments}/${id}`);
};

export const getEmployeeEmployeeDeferrals = () => {
  return delay(1000).then(() => {
    return employeeDeferralTypes;
  });
};

//Eligibility
export const getPlanEligibilityRuleMasterData = () => {
  return delay(1000).then(() => {
    return eligibilityRuleMaster;
  });
};

export const getPlanEligibilityMasterData = () => {
  return delay(1000).then(() => {
    return eligibilityMaster;
  });
};

export const getEmployeeClassificationForSources = () => {
  return delay(1000).then(() => {
    return employeeClassificationForSources;
  });
};

export const getPlanEligibility = () => {
  return delay(1000).then(() => {
    return manageEligibility;
  });
};

//Allocation
export const getAllocationPlanInvestmentMasterData = () => {
  return delay(1000).then(() => {
    return addSourceAllocation;
  });
};

//Vesting
export const getPlanVesting = () => {
  return delay(1000).then(() => {
    return vestingMaster;
  });
};

export const getSourcesHistory = () => {
  return delay(1000).then(() => {
    return sourcesEffectiveDateHistory;
  });
};

//Forfeiture
export const getForfeitureMaster = () => {
  return delay(1000).then(() => {
    return ForfeitureMaster;
  });
};

//Enrollment
export const getSourceEnrollment = () => {
  return delay(1000).then(() => {
    return manageSourceEnrollment;
  });
};
// export const getPlanSource=(planId)=>{
//   return apiInstance().get(`${endPoints.enrollment.getPlanSources}/${planId}`);
// }

//Distributions
export const getPlanDistributions = () => {
  return delay(1000).then(() => {
    return manageDistributions;
  });
};

export const getPlanDistributionSourceData = () => {
  return delay(1000).then(() => {
    return distributionSourceMaster;
  });
};

//Loan
export const getPlanLoan = () => {
  return delay(1000).then(() => {
    return loanMaster;
  });
};

export const getPlanSponsoringOrganisationList = () => {
  return apiInstance().get(`${endPoints.plan.getSponsoringOrganisationList}`);
};

export const postPlanSponsoringOrganisationList = (payload) => {
  return apiInstance()
    .post(`${endPoints.plan.postSponsoringOrganisationList}`, payload)
    .then(() => getPlanSponsoringOrganisationList());
};

export const postPlanDetails = (payload) => {
  return apiInstance().post(`${endPoints.plan.postPlan}`, payload);
};

export const getEmployeeClassifications = (id) => {
  return apiInstance().get(
    `${endPoints.plan.getEmployeeClassifications}/${id}`
  );
};

export const getEmploymentStatusList = (companyId) => {
  return apiInstance().get(
    `${endPoints.plan.getEmploymentStatusList}/${companyId}`
  );
};

export const getClassificationCodes = (companyId) => {
  return apiInstance().get(
    `${endPoints.plan.getClassificationCodes}/${companyId}`
  );
};

export const getPlanCompensationCategories = (companyId) => {
  return apiInstance().get(
    `${endPoints.plan.getCompensationCategories}/${companyId}`
  );
};
