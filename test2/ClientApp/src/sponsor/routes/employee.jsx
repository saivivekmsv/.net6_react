// import React from "react";
// import { Switch, Redirect } from "react-router-dom";
// import {
//   EmployeeInformation,
//   EmployeeManagePlans,
//   EmployeeManagePlansModules,
//   ManageCensusHistory,
//   ManualEnrollment,
// } from "../layouts";

// import { ROUTES, MANAGE_CENSUS_ROUTES, ApplicationRoute } from "../utils";

// export const ManageCensusRoutes = () => {
//   return (
//     <Switch>
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_CENSUS_ROUTES.EMPLOYEE_INFORMATION}/:censusId?`,
//           `${MANAGE_CENSUS_ROUTES.EMPLOYEE_INFORMATION}/:flow(add|edit|save)/:censusId?`,
//         ]}
//         component={EmployeeInformation}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLANS}/:censusId?`,
//           `${MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLANS}/:flow(add|edit|save)/:censusId?`,
//         ]}
//         component={EmployeeManagePlans}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES}/:flow(add|edit|save)/:censusId?/:planId?`,
//         ]}
//         component={EmployeeManagePlansModules}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_CENSUS_ROUTES.EMPLOYEE_HISTORY}/:censusId?`,
//           `${MANAGE_CENSUS_ROUTES.EMPLOYEE_HISTORY}/:flow(add|edit|save)/:censusId?`,
//         ]}
//         component={ManageCensusHistory}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_CENSUS_ROUTES.MANUAL_ENROLLMENT}/:censusId?/:planId?`,
//           `${MANAGE_CENSUS_ROUTES.MANUAL_ENROLLMENT}/:flow(add|edit|save)/:censusId?/:planId?`,
//         ]}
//         component={ManualEnrollment}
//       />
//       <Redirect exact from={ROUTES.MANAGE_EMPLOYEE} to={ROUTES.MANAGE_CENSUS} />
//     </Switch>
//   );
// };
