import { ROUTES } from ".";

export const MANAGE_REPORTS_ROUTES = {
  ELIGIBILITY_FILTER: `${ROUTES.MANAGE_REPORTS}/eligibility-filter`,
  GCONTRIBUTION_LIMITS: `${ROUTES.MANAGE_REPORTS}/gcontribution-limit`,
  CONTRIBUTION_LIMITS: `${ROUTES.MANAGE_REPORTS}/contribution-limit`,
  ELIGIBILITY_FORECAST: `${ROUTES.MANAGE_REPORTS}/eligibility-forecast`,
  DELETED_PARTICIPANT: `${ROUTES.MANAGE_REPORTS}/deleted-participant`,
  EMPLOYEMENT_STATUS: `${ROUTES.MANAGE_REPORTS}/employement-status`,
};

export const MANAGE_REPORTS_MENU = [
  {
    label: "Report",
  },
  {
    label: "Eligibility",
    subNav: [
      {
        label: "Status",
        path: MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER,
        contentHeader: "Reports",
        breadCrumbs: [],
        childRoutes: [],
      },
      {
        label: "Forecast",
        path: MANAGE_REPORTS_ROUTES.ELIGIBILITY_FORECAST,
        contentHeader: "Reports",
        breadCrumbs: [],
        childRoutes: [],
      },
    ],
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Contribution Limits",
    subNav: [
      {
        label: "402 (G) Limit",
        path: MANAGE_REPORTS_ROUTES.GCONTRIBUTION_LIMITS,
        contentHeader: "Reports",
        breadCrumbs: [],
        childRoutes: [],
      },
      {
        label: "415",
        path: MANAGE_REPORTS_ROUTES.CONTRIBUTION_LIMITS,
        contentHeader: "Reports",
        breadCrumbs: [],
        childRoutes: [],
      },
    ],
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Participant",
    subNav: [
      {
        label: "Deleted Status",
        path: MANAGE_REPORTS_ROUTES.DELETED_PARTICIPANT,
        contentHeader: "Reports",
        breadCrumbs: [],
        childRoutes: [],
      },
    ],
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Employment",
    subNav: [
      {
        label: "Status ",
        path: MANAGE_REPORTS_ROUTES.EMPLOYEMENT_STATUS,
        contentHeader: "Reports",
        breadCrumbs: [],
        childRoutes: [],
      },
    ],
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Sponsor",
    path: MANAGE_REPORTS_ROUTES.ELIGIBILITY_FORECAST,
    contentHeader: "Reports",
    breadCrumbs: [],
    childRoutes: [],
  },
];

export const ALL_MANAGE_REPORTS_ROUTES = [
  ...MANAGE_REPORTS_MENU,
  {
    contentHeader: "Reports",
    path: MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER,
    breadCrumbs: [
      // {
      //   label: "Manage Reports",
      //   link: MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER,
      // },
    ],
  },
];
export const manageReportsFormNames = {
  ELIGIBILITY_FILTER: "eligibility filter",
  GCONTRIBUTION_LIMITS: "gcontribution limit",
  CONTRIBUTION_LIMITS: "contribution limit",
  ELIGIBILITY_FORECAST: "eligibility forecast",
  DELETED_PARTICIPANT: "deleted participant",
  EMPLOYEMENT_STATUS: "employement status",
};

export const reportsFormFields = {
  [manageReportsFormNames.ELIGIBILITY_FILTER]: {
    search: "search",
    companyName: "companyName",
    companyId: "companyId",
    planId: "planId",
    planName: "planName",
    eligibilityStatus: "eligibilityStatus",
  },
  [manageReportsFormNames.GCONTRIBUTION_LIMITS]: {
    search: "nameorSSN",
    companyName: "companyName",
    companyId: "companyId",
    planId: "planId",
    planName: "planName",
    amountFrom: "amountFrom",
    amountTo: "amountTo",
    payDateFrom: "payDateFrom",
    payDateTo: "payDateTo",
  },
  [manageReportsFormNames.CONTRIBUTION_LIMITS]: {
    search: "nameorSSN",
    companyName: "companyName",
    companyId: "companyId",
    planId: "planId",
    planName: "planName",
    amountFrom: "amountFrom",
    amountTo: "amountTo",
    payDateFrom: "payDateFrom",
    payDateTo: "payDateTo",
  },
  [manageReportsFormNames.ELIGIBILITY_FORECAST]: {
    search: "search",
    companyName: "companyName",
    companyId: "companyId",
    planId: "planId",
    planName: "planName",
    asOfDate: "asOfDate",
  },
  [manageReportsFormNames.DELETED_PARTICIPANT]: {
    search: "nameorSSN",
    companyId: "companyId",
    companyName: "companyName",
    fromDate: "fromDate",
    toDate: "toDate",
  },
  [manageReportsFormNames.EMPLOYEMENT_STATUS]: {
    search: "nameorSSN",
    companyId: "companyId",
    companyName: "companyName",
    fromDate: "fromDate",
  },
};
