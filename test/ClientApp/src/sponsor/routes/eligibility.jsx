// import React from "react";
// import { Switch, Redirect } from "react-router-dom";
// import {
//   Eligibilitys,
//   EligibilitySummaryReports,
//   NewEmployeeEligibilityReport,
// } from "../layouts";

// import { ROUTES, MANAGE_ELIGIBILITY_ROUTES, ApplicationRoute } from "../utils";

// export const ManageEligibilityRoutes = () => {
//   return (
//     <Switch>
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY}/:eligibilityId?`,
//           `${MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY}/:flow(edit)/:eligibilityId?`,
//         ]}
//         component={Eligibilitys}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY_SUMMARY_REPORTS}/:eligibilityId?`,
//           `${MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY_SUMMARY_REPORTS}/:flow(edit)/:eligibilityId?`,
//         ]}
//         component={EligibilitySummaryReports}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT}/:eligibilityId?`,
//           `${MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT}/:flow(edit)/:eligibilityId?`,
//         ]}
//         component={NewEmployeeEligibilityReport}
//       />
//       <Redirect
//         exact
//         from={ROUTES.MANAGE_ELIGIBILITY}
//         to={MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY}
//       />
//     </Switch>
//   );
// };
