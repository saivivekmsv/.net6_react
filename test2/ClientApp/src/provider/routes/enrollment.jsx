import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { EnrollmentDetailReport } from "../layouts";

import { ROUTES, MANAGE_ENROLLMENT_ROUTES, ApplicationRoute } from "../utils";

export const ManageEnrollmentRoutes = () => {
  //console.log(MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT)
  return (
    <Switch>
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT}`,
          `${MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT}/:flow(add|edit|save)/:planId/:companyId`,
        ]}
        component={EnrollmentDetailReport}
      />
    </Switch>
  );
};
