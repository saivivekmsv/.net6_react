import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Error, UnderConstruction } from "../../shared/layouts";
import {
  Home,

  // Company,
  // ManageCompany,
  // Plan,
  // SuccessPlan,
  // ManagePlan,
  // ManageEligibility,
  Mapper,
  MapperHome,
  ManageEmployee,
  ManageCensus,
  ManagePayroll,
  PayrollManage,
  PayrollFileStatus,
  PayrollReports,
  // ManageMaintenance,
  // ManageReport,
  // // Reports,
  // UnderConstruction,
  // EnrollmentReport,
  // EnrollmentDetailReport,
  CreatePayrollListing,
  // Doco_Center,
  // Doco,
  // SponsorLayout,
} from "../layouts";
import ApiAuthorizationRoutes from "../../shared/components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "../../shared/components/api-authorization/ApiAuthorizationConstants";

import {
  ROUTES,
  ApplicationRoute,
  MANAGE_ENROLLMENT_ROUTES,
  MANAGE_PAYROLL_ROUTES,
} from "../../shared/utils";

const Routes = () => (
  <Switch>
    <ApplicationRoute exact path={ROUTES.HOME} component={Home} />    
    <ApplicationRoute path={ROUTES.MAPPER} component={Mapper} />
    <ApplicationRoute path={ROUTES.MAPPER_HOME} component={MapperHome} />    
    <ApplicationRoute
      path={ROUTES.MANAGE_EMPLOYEE}
      component={ManageEmployee}
    />
    <ApplicationRoute exact path={ROUTES.PAYROLL} component={ManagePayroll} />
    <ApplicationRoute
      exact
      path={[
        ROUTES.PAYROLL_FILE_STATUS,
        `${ROUTES.PAYROLL_FILE_STATUS}/:payrollId?`,
      ]}
      component={PayrollFileStatus}
    />
    <ApplicationRoute
      exact
      path={[ROUTES.PAYROLL_REPORTS, `${ROUTES.PAYROLL_REPORTS}/:payrollId?`]}
      component={PayrollReports}
    />
    <ApplicationRoute path={ROUTES.MANAGE_CENSUS} component={ManageCensus} />
    <ApplicationRoute
      path={ROUTES.MANAGE_PAYROLL}
      component={PayrollManage}
    />
    <ApplicationRoute
      exact
      path={[
        `${MANAGE_PAYROLL_ROUTES.CREATE_PAYROLL_LISTING}/:payrollId?`,
        `${MANAGE_PAYROLL_ROUTES.CREATE_PAYROLL_LISTING}/:flow(edit)/:payrollId?`,
      ]}
      component={CreatePayrollListing}
    />
    <Redirect exact from="/" to={ROUTES.HOME} />
    <Route
      path={ApplicationPaths.ApiAuthorizationPrefix}
      component={ApiAuthorizationRoutes}
    />
    <Route component={Error} />
  </Switch>
);

export default Routes;
