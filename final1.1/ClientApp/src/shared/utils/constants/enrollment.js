import { ROUTES } from ".";

export const MANAGE_ENROLLMENT_ROUTES = {
  ENROLLMENT_DETAIL_REPORT: `${ROUTES.ENROLLMENT}/enrollment_detail_report`,
};

export const MANAGE_ENROLLMENT_MENU = [
  {
    label: "Enrollment Detail Report",
    path: MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT,
    contentHeader: "Enrollment",
    breadCrumbs: [],
    childRoutes: [MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT],
  },
];

export const ALL_MANAGE_ENROLLMENT_ROUTES = [
  ...MANAGE_ENROLLMENT_MENU,
  {
    contentHeader: "Enrollment",
    path: MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT,
    breadCrumbs: [
      {
        label: "Manage Enrollment",
        link: MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT,
      },
    ],
  },
];

export const enrollmentFormNames = {};
