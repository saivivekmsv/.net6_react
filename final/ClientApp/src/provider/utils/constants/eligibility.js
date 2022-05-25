import { ROUTES } from "./";

export const MANAGE_ELIGIBILITY_ROUTES = {
  ELIGIBILITY: `${ROUTES.MANAGE_ELIGIBILITY}/eligibility-summary`,
  ELIGIBILITY_SUMMARY_REPORTS: `${ROUTES.MANAGE_ELIGIBILITY}/eligibility-process-reports`,
  NEW_EMPLOYEE_ELIGIBILITY_REPORT: `${ROUTES.MANAGE_ELIGIBILITY}/new-employee-eligibility-reports`,
};

export const MANAGE_ELIGIBILITY_MENU = [
  // {
  //   label: "Summary",
  //   path: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY,
  //   contentHeader: "Eligibility Summary",
  //   breadCrumbs: [],
  //   childRoutes: [],
  // },
  {
    label: "Eligibility Process",
    path: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY_SUMMARY_REPORTS,
    contentHeader: "Eligibility Process",
    breadCrumbs: [],
    childRoutes: [
      MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY_SUMMARY_REPORTS,
      MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT,
    ],
  },
];

export const ALL_MANAGE_ELIGIBILITY_ROUTES = [
  ...MANAGE_ELIGIBILITY_MENU,
  {
    contentHeader: "Eligibility",
    path: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY,
    breadCrumbs: [
      {
        label: "Manage Eligibility",
        link: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY,
      },
    ],
  },
  {
    contentHeader: "Eligibility Process",
    path: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY_SUMMARY_REPORTS,
    breadCrumbs: [
      {
        label: "Eligibility Process",
        link: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY_SUMMARY_REPORTS,
      },
    ],
  },
  {
    contentHeader: "Eligibility Process",
    path: MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT,
    breadCrumbs: [
      {
        label: "New Employee Eligibility",
        link: MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT,
      },
    ],
  },
];

export const manageEligibilityFormNames = {
  ELIGIBILITY_PROCESS: "eligibility process",
  ELIGIBILITY_SUMMARY_FILTER: "eligibility summary filter",
  EMPLOYEE_ELIGIBILITY_FILTER: "employee eligilibity filter",
};

export const eligibilityFormFields = {
  [manageEligibilityFormNames.ELIGIBILITY_PROCESS]: {
    companyName: "companyName",
    companyId: "companyId",
    planName: "planName",
    planId: "planId",
    sources: "sources",
    startDate: "startDate",
    endDate: "endDate",
  },
  [manageEligibilityFormNames.ELIGIBILITY_SUMMARY_FILTER]: {
    companyName: "companyName",
    companyId: "companyId",
    planId: "planId",
    planName: "planName",
    rkPlanNumber: "rkPlanNumber",
    startDate: "startDate",
    endDate: "endDate",
  },
  [manageEligibilityFormNames.EMPLOYEE_ELIGIBILITY_FILTER]: {
    eligibilityType: "eligibilityType",
    source: "source",
    search: "search",
  },
};
