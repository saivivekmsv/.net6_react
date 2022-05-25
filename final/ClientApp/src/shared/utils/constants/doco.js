import { ROUTES } from "./";

export const DOCO_ROUTES = {
  TRANSFORMATIONS: `${ROUTES.DOCO}/transformation`,
  MAPPEROVERVIEW: `${ROUTES.DOCO}/mapperoverview`,
  PROFILES: `${ROUTES.DOCO}/profiles`,
  SOURCECONFIGURATION: `${ROUTES.DOCO}/source-configuration`,
  TARGETCONFIGURATION: `${ROUTES.DOCO}/target-configuration`,
  REVIEW_AND_CONFIRM: `${ROUTES.DOCO}/review-and-confirm`,
};

export const DOCO_MENU = [
  {
    label: "Mapper",
    contentHeader: "Mapper",
    path: DOCO_ROUTES.TRANSFORMATIONS,
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Mapper Overview",
    path: DOCO_ROUTES.MAPPEROVERVIEW,
    contentHeader: "Mapper Overview",
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Profiles",
    path: DOCO_ROUTES.PROFILES,
    contentHeader: "Profiles",
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Source Configuration",
    path: DOCO_ROUTES.SOURCECONFIGURATION,
    contentHeader: "Source Configuration",
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Target Configuration",
    path: DOCO_ROUTES.TARGETCONFIGURATION,
    contentHeader: "Target Configuration",
    subNav: [
      {
        label: "Transformations",
        path: DOCO_ROUTES.TRANSFORMATIONS,
        contentHeader: "Transformations",
        breadCrumbs: [],
        childRoutes: [],
      },
    ],
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Review & Confirm",
    path: DOCO_ROUTES.REVIEW_AND_CONFIRM,
    contentHeader: "Review & Confirm",
    breadCrumbs: [],
    childRoutes: [],
  },
];

export const ALL_DOCO_ROUTES = [
  ...DOCO_MENU,
  {
    contentHeader: "Mapper",
    path: DOCO_ROUTES.MAPPER,
    breadCrumbs: [
      // {
      //   label: "Manage Reports",
      //   link: MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER,
      // },
    ],
  },
];

export const docoMapperFormNames = {
  TRANSFORMATIONS: "transformations",
  MAPPEAROVERVIEW: "mapper-overview",
  PROFILES: "profiles",
  SOURCECONFIGURATION: "source-configuration",
  TARGETCONFIGURATION: "target-configuration-transformations",
  REVIEW_AND_CONFIRM: "review-and-confirm",
};
