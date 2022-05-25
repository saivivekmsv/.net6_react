import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  Home,
  Error,
  Company,
  ManageCompany,
  Plan,
  SuccessPlan,
  ManagePlan,
  ManageEligibility,
  Mapper,
  MapperHome,
  ManageEmployee,
  ManageCensus,
  ManagePayroll,
  PayrollManage,
  PayrollFileStatus,
  PayrollReports,
  ManageMaintenance,
  ManageReport,
  // Reports,
  UnderConstruction,
  EnrollmentReport,
  EnrollmentDetailReport,
  CreatePayrollListing,
  Doco_Center,
  Doco,
  SponsorLayout,
  OutputFiles,
} from "../layouts";
import ApiAuthorizationRoutes from "../components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "../components/api-authorization/ApiAuthorizationConstants";

import {
  ROUTES,
  ApplicationRoute,
  MANAGE_ENROLLMENT_ROUTES,
  MANAGE_PAYROLL_ROUTES,
} from "../utils";
import SponsorEmployeeSummaryContainer from "../containers/SponsorEmployeeSummaryContainer/SponsorEmployeeSummaryContainer";

const Routes = () => (
  <div>
    <Switch>
      <ApplicationRoute exact path={ROUTES.HOME} component={Home} />
      <ApplicationRoute exact path={ROUTES.COMPANY} component={Company} />
      <ApplicationRoute exact path={ROUTES.PLAN} component={Plan} />
      <ApplicationRoute
        path={ROUTES.MANAGE_COMPANY}
        component={ManageCompany}
      />
      <ApplicationRoute path={ROUTES.SUCCESS_PLAN} component={SuccessPlan} />
      <ApplicationRoute path={ROUTES.MANAGE_PLAN} component={ManagePlan} />
      <ApplicationRoute
        path={ROUTES.MANAGE_ELIGIBILITY}
        component={ManageEligibility}
      />
      <Redirect from={ROUTES.MAPPER} to={ROUTES.MAPPER_HOME} />
      <ApplicationRoute path={ROUTES.MAPPER} component={Mapper} />
      <ApplicationRoute path={ROUTES.MAPPER_HOME} component={MapperHome} />
      <ApplicationRoute path={ROUTES.MANAGE_MAPPER} component={Mapper} />
      <ApplicationRoute path={ROUTES.OUTPUT_FILES} component={OutputFiles} />
      <ApplicationRoute path={ROUTES.DOCO_CENTER} component={Doco_Center} />
      <ApplicationRoute path={ROUTES.DOCO} component={Doco} />
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
      <ApplicationRoute
        path={ROUTES.MANAGE_MAINTENANCE}
        component={ManageMaintenance}
      />
      <ApplicationRoute path={ROUTES.MANAGE_REPORTS} component={ManageReport} />
      {/* <ApplicationRoute path={ROUTES.MANAGE_REPORTS} component={Reports} /> */}
      <ApplicationRoute
        path={ROUTES.CALCULATORS}
        component={UnderConstruction}
      />

      <ApplicationRoute
        path={`${MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT}/:flow(add|edit|save)/:planId/:companyId`}
        component={EnrollmentDetailReport}
      />
      <ApplicationRoute
        exact
        path={ROUTES.ENROLLMENT}
        component={EnrollmentReport}
      />
      <ApplicationRoute exact path={ROUTES.SPONSOR} component={SponsorLayout} />
      <ApplicationRoute
        exact
        path={`${ROUTES.SPONSOR}/employee/summary`}
        component={SponsorEmployeeSummaryContainer}
      />
      <ApplicationRoute path={ROUTES.TEMPLATES} component={UnderConstruction} />
      <Redirect exact from="/" to={ROUTES.HOME} />
      <Route
        path={ApplicationPaths.ApiAuthorizationPrefix}
        component={ApiAuthorizationRoutes}
      />
      <Route component={Error} />
    </Switch>
  </div>
);

export default Routes;
