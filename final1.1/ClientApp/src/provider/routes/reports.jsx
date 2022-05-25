import React from "react";
import { Switch, Redirect } from "react-router-dom";
import {
  ContributionLimit,
  DeletedParticipant,
  EligibilityReports,
  EligibiltyForecast,
  EmploymentStatus,
  GContributionLimit,
  RehireReport,
  NewParticipant,
} from "../layouts";

import { ROUTES, MANAGE_REPORTS_ROUTES, ApplicationRoute } from "../utils";

export const ManageReportRoutes = () => {
  return (
    <Switch>
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER}/:flow(edit)/:reportId?`,
        ]}
        component={EligibilityReports}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.GCONTRIBUTION_LIMITS}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.GCONTRIBUTION_LIMITS}/:flow(edit)/:reportId?`,
        ]}
        component={GContributionLimit}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.ELIGIBILITY_FORECAST}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.ELIGIBILITY_FORECAST}/:flow(edit)/:reportId?`,
        ]}
        component={EligibiltyForecast}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.CONTRIBUTION_LIMITS}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.CONTRIBUTION_LIMITS}/:flow(add|edit|save)/:reportId?`,
        ]}
        component={ContributionLimit}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.DELETED_PARTICIPANT}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.DELETED_PARTICIPANT}/:flow(edit)/:reportId?`,
        ]}
        component={DeletedParticipant}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.REHIRE_REPORT}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.REHIRE_REPORT}/:flow(edit)/:reportId?`,
        ]}
        component={RehireReport}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.NEW_PARTICIPANT}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.NEW_PARTICIPANT}/:flow(edit)/:reportId?`,
        ]}
        component={NewParticipant}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_REPORTS_ROUTES.EMPLOYEMENT_STATUS}/:reportId?`,
          `${MANAGE_REPORTS_ROUTES.EMPLOYEMENT_STATUS}/:flow(edit)/:reportId?`,
        ]}
        component={EmploymentStatus}
      />
      <Redirect
        exact
        from={ROUTES.MANAGE_REPORTS}
        to={MANAGE_REPORTS_ROUTES.ELIGIBILITY_FILTER}
      />
      <Redirect to={ROUTES.HOME} />
    </Switch>
  );
};
