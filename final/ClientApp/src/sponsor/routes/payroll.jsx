import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { ROUTES, MANAGE_PAYROLL_ROUTES, ApplicationRoute } from "../../shared/utils";
import { CreateOrGenerate, UploadFile, CreatePayrollListing } from "../layouts";

export const ManagePayrollRoutes = () => {
  return (
    <Switch>
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_PAYROLL_ROUTES.NEW_PAYROLL_UPLOAD}/:payrollId?`,
          `${MANAGE_PAYROLL_ROUTES.NEW_PAYROLL_UPLOAD}/:flow(edit)/:payrollId?`,
        ]}
        component={UploadFile}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_PAYROLL_ROUTES.CREATE_OR_GENERATE}/:payrollId?`,
          `${MANAGE_PAYROLL_ROUTES.CREATE_OR_GENERATE}/:flow(edit)/:payrollId?`,
        ]}
        component={CreateOrGenerate}
      />

      <Redirect exact from={ROUTES.MANAGE_PAYROLL} to={ROUTES.MANAGE_PAYROLL} />
    </Switch>
  );
};
