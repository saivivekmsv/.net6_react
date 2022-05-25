import React from "react";
import { Switch, Redirect } from "react-router-dom";
import {
  HolidayCalendar,
  AddHolidayCalendar,
  ScheduleExtension,
  ScheduleExceptionReport,
  ManagePlanGroup,
  AddPlanGroup,
} from "../layouts";

import { ROUTES, MANAGE_MAINTENANCE_ROUTES, ApplicationRoute } from "../utils";

export const ManageMaintenanceRoutes = () => {
  return (
    <Switch>
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR}/:maintenanceId?`,
          `${MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR}/:flow(add|edit|save)/:maintenanceId?`,
        ]}
        component={HolidayCalendar}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY}/:maintenanceId?`,
          `${MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY}/:flow(add|edit|save)/:maintenanceId?`,
        ]}
        component={AddHolidayCalendar}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_MAINTENANCE_ROUTES.SCHEDULE_EXTENSION}/:maintenanceId?`,
          `${MANAGE_MAINTENANCE_ROUTES.SCHEDULE_EXTENSION}/:flow(add|edit|save)/:maintenanceId?`,
        ]}
        component={ScheduleExtension}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_MAINTENANCE_ROUTES.SCHEDULE_EXCEPTION_REPORT}/:maintenanceId?`,
          `${MANAGE_MAINTENANCE_ROUTES.SCHEDULE_EXCEPTION_REPORT}/:flow(add|edit|save)/:maintenanceId?`,
        ]}
        component={ScheduleExceptionReport}
      />
      <ApplicationRoute
        exact
        path={[
          `${MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP}/:maintenanceId?`,
          `${MANAGE_MAINTENANCE_ROUTES.MANAGE_PLAN_GROUP}/:flow(add|edit|save)/:maintenanceId?`,
        ]}
        component={ManagePlanGroup}
      />

      <ApplicationRoute
        exact
        path={[
          `${MANAGE_MAINTENANCE_ROUTES.ADD_PLAN_GROUP}/:planGroupId?`,
          `${MANAGE_MAINTENANCE_ROUTES.ADD_PLAN_GROUP}/:flow(add|edit|save)/:planGroupId?`,
        ]}
        component={AddPlanGroup}
      />
      <Redirect
        exact
        from={ROUTES.MANAGE_MAINTENANCE}
        to={MANAGE_MAINTENANCE_ROUTES.HOLIDAY_CALENDAR}
      />
    </Switch>
  );
};
