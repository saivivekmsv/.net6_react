import { ROUTES } from "./";

export const MANAGE_CENSUS_ROUTES = {
  EMPLOYEE_INFORMATION: `${ROUTES.MANAGE_CENSUS}/employee-information`,
  EMPLOYEE_MANAGE_PLANS: `${ROUTES.MANAGE_CENSUS}/employee-plans`,
  EMPLOYEE_MANAGE_PLAN_MODULES: `${ROUTES.MANAGE_CENSUS}/employee-manage-plans`,
  EMPLOYEE_HISTORY: `${ROUTES.MANAGE_CENSUS}/employee-history`,
  MANUAL_ENROLLMENT: `${ROUTES.MANAGE_CENSUS}/manual-enrollment`,
  ENROLLMENT_REPORT: `${ROUTES.MANAGE_CENSUS}/enrollment-Report`,
};

export const MANAGE_CENSUS_MENU = [
  {
    label: "Employee Information",
    path: MANAGE_CENSUS_ROUTES.EMPLOYEE_INFORMATION,
    contentHeader: "Add Employee",
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Plans",
    path: MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLANS,
    contentHeader: "Plans",
    breadCrumbs: [],
    childRoutes: [MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES],
  },
  {
    label: "History",
    path: MANAGE_CENSUS_ROUTES.EMPLOYEE_HISTORY,
    contentHeader: "History",
    breadCrumbs: [],
    childRoutes: [],
  },
];

export const ALL_MANAGE_CENSUS_ROUTES = [
  ...MANAGE_CENSUS_MENU,
  {
    contentHeader: "Manage Employees",
    path: MANAGE_CENSUS_ROUTES.EMPLOYEE_INFORMATION,
    breadCrumbs: [
      {
        label: "Manage Employees",
        link: MANAGE_CENSUS_ROUTES.EMPLOYEE_INFORMATION,
      },
    ],
  },
  {
    contentHeader: "Manual Enrollment",
    path: MANAGE_CENSUS_ROUTES.MANUAL_ENROLLMENT,
    breadCrumbs: [
      {
        label: "Manual Enrollment",
        link: MANAGE_CENSUS_ROUTES.MANUAL_ENROLLMENT,
      },
    ],
  },
  {
    contentHeader: "Enrollment Report",
    path: MANAGE_CENSUS_ROUTES.ENROLLMENT_REPORT,
    breadCrumbs: [
      {
        label: "Enrollment Report",
        link: MANAGE_CENSUS_ROUTES.ENROLLMENT_REPORT,
      },
    ],
  },
  {
    contentHeader: "Plans",
    path: MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES,
    breadCrumbs: [],
  },
];

export const manageCensusFormNames = {
  CENSUS_FILTER: "census filter",
  PERSONAL_INFORMATION: "personal information",
  ADD_COMPENSATIONS: "add_compensations",
  CONTRIBUTIONS_FILTER: "contributions_filter",
  ADD_CONTRIBUTIONS: "add_contributions",
  CENSUS_HISTORY: "census_history",
  HOURS: "hours",
  MANUAL_ENROLLMENT: "manual_enrollment",
};

export const censusFormFields = {
  [manageCensusFormNames.CENSUS_FILTER]: {
    companyId: "companyId",
    companyName: "companyName",
    planSearchOption: "planSearchOption",
    planId: "planId",
    planName: "planName",
    rKPlanNumber: "rKPlanNumber",
    employmentStatusId: "employmentStatusId",
    employmentStatusName: "employmentStatusName",
    searchBySSNEmpIdName: "searchBySSNEmpIdName",
    startDate: "startDate",
    endDate: "endDate",
    companyNameAutoEnrollment: "companyNameAutoEnrollment",
    planNameAutoEnrollment: "planNameAutoEnrollment",
    planIdAutoEnrollment: "planIdAutoEnrollment",
    companyIdAutoEnrollment: "companyIdAutoEnrollment",
  },
  [manageCensusFormNames.PERSONAL_INFORMATION]: {
    firstName: "firstName",
    middleName: "middleName",
    lastName: "lastName",
    uniquePersonalIdentification: "uniquePersonalIdentification",
    companyName: "companyName",
    companyId: "companyId",
    employeeNumber: "employeeNumber",
    payrollFrequency: "payrollFrequency",
    payrollFrequencyName: "payrollFrequencyName",
    payrollFrequencyId: "payrollFrequencyId",
    gender: "gender",
    maritalStatus: "maritalStatus",
    primaryEmailAddress: "primaryEmailAddress",
    workPhoneNumber: "workPhoneNumber",
    mobilePhoneNumber: "mobilePhoneNumber",
    address: "address",
    address1: "address1",
    address2: "address2",
    address3: "address3",
    city: "city",
    country: "country",
    countryCode: "countryCode",
    countryId: "countryId",
    foreignCountry: "foreignCountry",
    foreignState: "foreignState",
    state: "state",
    stateId: "stateId",
    zipCode: "zipCode",
    additionalAddressName: "additionalAddressName",
    additionalAddressOne: "additionalAddressOne",
    additionalAddressTwo: "additionalAddressTwo",
    additionalAddressThree: "additionalAddressThree",
    additionalCity: "additionalCity",
    additionalCountry: "additionalCountry",
    additionalCountryCode: "additionalCountryCode",
    additionalCountryId: "additionalCountryId",
    additionalForeignCountry: "additionalForeignCountry",
    additionalForeignState: "additionalForeignState",
    additionalForeignAddressIndicator: "additionalForeignAddressIndicator",
    additionalState: "additionalState",
    additionalStateId: "additionalStateId",
    additionalZipCode: "additionalZipCode",
    birthDate: "birthDate",
    leaveStartDate: "leaveStartDate",
    leaveEndDate: "leaveEndDate",
    hireDate: "hireDate",
    employmentStatus: "employmentStatus",
    employmentStatusId: "employmentStatusId",
    terminationDate: "terminationDate",
    rehireDate: "rehireDate",
    classificationId: "classificationId",
    classificationType: "classificationType",
    classificationCode: "classificationCode",
    classificationName: "classificationName",
    startDate: "startDate",
    endDate: "endDate",
    pendingQDROIndicator: "pendingQDROIndicator",
    ownerShip: "ownerShip",
    masterEmploymentStatusId: "masterEmploymentStatusId",
    familyMemberOfOwnerIndicator: "familyMemberOfOwnerIndicator",
    relationUniquePersonalIdentification:
      "relationUniquePersonalIdentification",
    returnMailIndicator: "returnMailIndicator",
    officerIndicator: "officerIndicator",
    hceIndicator: "hceIndicator",
    hce: "hce",
    HCEIndicatorReason: "HCEIndicatorReason",
    keyEmployeeIndicator: "keyEmployeeIndicator",
    insiderOrRestrictedEmployeeIndicator:
      "insiderOrRestrictedEmployeeIndicator",
  },
  [manageCensusFormNames.ADD_COMPENSATIONS]: {
    payDate: "payDate",
    payPeriodPlanCompensation: "payPeriodPlanCompensation",
    payPeriodGrossCompensation: "payPeriodGrossCompensation",
    annualSalary: "annualSalary",
    eligiblePlanCompensation: "eligiblePlanCompensation",
    eligibleSources: "eligibleSources",
    comments: "comments",
  },
  [manageCensusFormNames.HOURS]: {
    payDate: "payDate",
    hours: "hours",
    comments: "comments",
    startDate: "startDate",
    endDate: "endDate",
  },
  [manageCensusFormNames.CONTRIBUTIONS_FILTER]: {
    startDate: "startDate",
    endDate: "endDate",
    sourcesList: "sourcesList",
  },
  [manageCensusFormNames.ADD_CONTRIBUTIONS]: {
    payDate: "payDate",
    comments: "comments",
  },
  [manageCensusFormNames.CENSUS_HISTORY]: {
    startDate: "startDate",
    endDate: "endDate",
    fields: "fields",
  },
  [manageCensusFormNames.MANUAL_ENROLLMENT]: {
    usePlanDefaultDeferralElection: "usePlanDefaultDeferralElection",
    investmentsElection: "investmentsElection",
    autoDeferralIncrease: "autoDeferralIncrease",
  },
};

export const EMPLOYEE_RECORDS_TO_FETCH = 20;
