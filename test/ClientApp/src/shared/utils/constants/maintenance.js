import { ROUTES } from ".";

export const MANAGE_MAINTENANCE_ROUTES = {
  HOLIDAY_CALENDAR: `${ROUTES.MANAGE_MAINTENANCE}/holiday-calendar`,
  ADD_HOLIDAY: `${ROUTES.MANAGE_MAINTENANCE}/add-new-holiday`,
  SCHEDULE_EXTENSION: `${ROUTES.MANAGE_MAINTENANCE}/schedule-extension`,
  SCHEDULE_EXCEPTION_REPORT: `${ROUTES.MANAGE_MAINTENANCE}/schedule-exception-report`,
  MANAGE_PLAN_GROUP: `${ROUTES.MANAGE_MAINTENANCE}/manage-plan-group`,
  ADD_PLAN_GROUP: `${ROUTES.MANAGE_MAINTENANCE}/add-plan-group`,
};

export const MANAGE_MAINTENANCE_MENU = [
  {
    label: "Holiday calendar",
    path: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
    contentHeader: "Manage Holiday Calendar",
    breadCrumbs: [],
    childRoutes: [MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY],
  },
  {
    label: "Schedule extension",
    path: MANAGE_MAINTENANCE_ROUTES.SCHEDULE_EXTENSION,
    contentHeader: "Manage Schedule extensions",
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Schedule exceptions report",
    path: MANAGE_MAINTENANCE_ROUTES.SCHEDULE_EXCEPTION_REPORT,
    contentHeader: "Manage Schedule exceptions",
    breadCrumbs: [],
    childRoutes: [],
  },
  // {
  //   label: "Plan Group",
  //   path: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
  //   contentHeader: "Manage Plan Group",
  //   breadCrumbs: [],
  //   childRoutes: [MANAGE_MAINTENANCE_ROUTES.ADD_PLAN_GROUP],
  // },
];

export const ALL_MANAGE_MAINTENANCE_ROUTES = [
  ...MANAGE_MAINTENANCE_MENU,
  {
    contentHeader: "Maintenance",
    path: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
    breadCrumbs: [
      {
        label: "Manage Maintenance",
        link: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
      },
    ],
  },
  {
    contentHeader: "Holiday Details",
    path: MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY,
    breadCrumbs: [
      {
        label: "Home",
        link: ROUTES.HOME,
      },
      {
        label: "Manage Holiday Calendar",
        link: MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR,
      },
    ],
  },
  {
    contentHeader: "Maintenance",
    path: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
    breadCrumbs: [
      {
        label: "Manage Maintenance",
        link: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
      },
    ],
  },
  // {
  //   contentHeader: "Plan Group",
  //   path: MANAGE_MAINTENANCE_ROUTES.ADD_PLAN_GROUP,
  //   breadCrumbs: [
  //     {
  //       label: "Home",
  //       link: ROUTES.HOME,
  //     },
  //     {
  //       label: "Maintenance",
  //       link: MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP,
  //     },
  //   ],
  // },
];

export const manageMaintenanceFormNames = {
  HOLIDAY_CALENDAR: "holiday calendar",
  ADD_NEW_HOLIDAY: "new holiday calendar",
  SCHEDULE_EXTENSION: "schedule extension",
  SCHEDULE_EXCEPTION_REPORT: "schedule exception report",
  MANAGE_PLAN_GROUP: "manage_plan_group",
  ADD_PLAN_GROUP: "add_plan_group",
};

export const maintenanceFormFields = {
  [manageMaintenanceFormNames.HOLIDAY_CALENDAR]: {
    selectYear: "selectYear",
  },
  [manageMaintenanceFormNames.ADD_NEW_HOLIDAY]: {
    date: "holidayDate",
    holidayName: "name",
  },
  [manageMaintenanceFormNames.SCHEDULE_EXTENSION]: {
    extendScheduleDate: "extendScheduleDate",
  },
  [manageMaintenanceFormNames.SCHEDULE_EXCEPTION_REPORT]: {
    companyName: "companyName",
    frequency: "frequency",
  },
  [manageMaintenanceFormNames.MANAGE_PLAN_GROUP]: {
    search: "search",
    planTypes: "planTypes",
  },
  [manageMaintenanceFormNames.ADD_PLAN_GROUP]: {
    planGroupName: "name",
    planGroupDescription: "description",
  },
};
