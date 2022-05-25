import { ROUTES } from "./";

export const DOCO_CENTER_ROUTES = {
  HOME: `${ROUTES.DOCO_CENTER}/home`,
};

export const MANAGE_MAPPER_MENU = [
  //   {
  //     label: "Load Definition",
  //     contentHeader: "Load Definition",
  //     path: MANAGE_MAPPER_ROUTES.AGGREGATE,
  //     subNav: [
  //       {
  //         label: "Source",
  //         path: MANAGE_MAPPER_ROUTES.SOURCE,
  //         contentHeader: "Source",
  //         breadCrumbs: [],
  //         childRoutes: [],
  //       },
  //       {
  //         label: "Filter",
  //         path: MANAGE_MAPPER_ROUTES.FILTER,
  //         contentHeader: "Filter",
  //         breadCrumbs: [],
  //         childRoutes: [],
  //       },
  //       {
  //         label: "Aggregate",
  //         path: MANAGE_MAPPER_ROUTES.AGGREGATE,
  //         contentHeader: "Aggregate",
  //         breadCrumbs: [],
  //         childRoutes: [],
  //       },
  //     ],
  //     breadCrumbs: [],
  //     childRoutes: [],
  //   },
  //   {
  //     label: "Target",
  //     path: MANAGE_MAPPER_ROUTES.TARGET,
  //     contentHeader: "Target",
  //     breadCrumbs: [],
  //     childRoutes: [],
  //   },
  //   {
  //     label: "Associate Plans",
  //     path: MANAGE_MAPPER_ROUTES.ASSOCIATEDPLANS,
  //     contentHeader: "Associate Plans",
  //     breadCrumbs: [],
  //     childRoutes: [],
  //   },
  //   {
  //     label: "Map & Transform",
  //     path: MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM,
  //     contentHeader: "Map & Transform",
  //     breadCrumbs: [],
  //     childRoutes: [],
  //   },
  //   {
  //     label: "Ruleset",
  //     path: MANAGE_MAPPER_ROUTES.RULESET,
  //     contentHeader: "Ruleset",
  //     breadCrumbs: [],
  //     childRoutes: [],
  //   },
  //   {
  //     label: "Scheduler",
  //     path: MANAGE_MAPPER_ROUTES.SCHEDULER,
  //     contentHeader: "Scheduler",
  //     breadCrumbs: [],
  //     childRoutes: [],
  //   },
  //   {
  //     label: "Review & Confirm",
  //     path: MANAGE_MAPPER_ROUTES.REVIEW_AND_CONFIRM,
  //     contentHeader: "Review & Confirm",
  //     breadCrumbs: [],
  //     childRoutes: [],
  //   },
  // ];
  // export const ALL_MANAGE_MAPPER_ROUTES = [
  //   ...MANAGE_MAPPER_MENU,
  //   {
  //     contentHeader: "Mapper",
  //     path: MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM,
  //     breadCrumbs: [
  //       // {
  //       //   label: "Manage Reports",
  //       //   link: MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER,
  //       // },
  //     ],
  //   },
];

export const manageMapperFormNames = {
  MAP_AND_TRANSFORM: "map-and-transform",
  AGGREGATE: "load-definition-aggregate",
  SOURCE: "load-definition-source",
  FILTER: "load-definition-filter",
  TARGET: "target",
  ASSOCIATEDPLANS: "associate-plans",
  RULESET: "ruleset",
  SCHEDULER: "scheduler",
  REVIEW_AND_CONFIRM: "review-and-confirm",
};

// export const= DOCUMENT_MAPPER_ROUTES = {
//   MAP_AND_TRANSFORM: `${ROUTES.MAPPER}/map-and-transform`,
//   AGGREGATE: `${ROUTES.MAPPER}/load-definition-aggregate`,
//   SOURCE: `${ROUTES.MAPPER}/load-definition-source`,
//   FILTER: `${ROUTES.MAPPER}/load-definition-filter`,
//   TARGET: `${ROUTES.MAPPER}/target`,
//   ASSOCIATEDPLANS: `${ROUTES.MAPPER}/associate-plans`,
//   RULESET: `${ROUTES.MAPPER}/ruleset`,
//   SCHEDULER: `${ROUTES.MAPPER}/scheduler`,
//   REVIEW_AND_CONFIRM: `${ROUTES.MAPPER}/review-and-confirm`,
// };
