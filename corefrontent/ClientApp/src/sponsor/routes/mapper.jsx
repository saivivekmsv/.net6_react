import React from "react";
import { Switch } from "react-router-dom";
import {
  MapAndTransform,
  Aggregate,
  ReviewAndConfirm,
  Ruleset,
  LoadDefinitionHome,
  LoadDefinitionSource,
  AssociatePlans,
  LoadFilter,
  Scheduler,
  TargetContainers,
  VerifyMap,
} from "../layouts";

import { MANAGE_MAPPER_ROUTES, ApplicationRoute } from "../../shared/utils";

export const ManageMapperRoutes = () => {
  return (
    <Switch>
      <ApplicationRoute
        exact
        path={[`${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}`]}
        component={MapAndTransform}
      />
      <ApplicationRoute
        exact
        path={[`${MANAGE_MAPPER_ROUTES.AGGREGATE}`]}
        component={Aggregate}
      />
      <ApplicationRoute
        exact
        path={[`${MANAGE_MAPPER_ROUTES.REVIEW_AND_CONFIRM}`]}
        component={ReviewAndConfirm}
      />
      <ApplicationRoute
        exact
        path={[`${MANAGE_MAPPER_ROUTES.RULESET}`]}
        component={Ruleset}
      />
      <ApplicationRoute
        exact
        path={[`${MANAGE_MAPPER_ROUTES.SCHEDULER}`]}
        component={Scheduler}
      />
      <ApplicationRoute
        exact
        path={[`${MANAGE_MAPPER_ROUTES.LOAD_DEFINITION}`]}
        component={LoadDefinitionHome}
      />
      <ApplicationRoute
        exact
        path={[`${MANAGE_MAPPER_ROUTES.SOURCE}`]}
        component={LoadDefinitionSource}
      />
      <ApplicationRoute
        path={[`${MANAGE_MAPPER_ROUTES.ASSOCIATEDPLANS}`]}
        component={AssociatePlans}
      />
      <ApplicationRoute
        path={[`${MANAGE_MAPPER_ROUTES.VERIFY_MAP}`]}
        component={VerifyMap}
      />
      <ApplicationRoute
        path={[`${MANAGE_MAPPER_ROUTES.FILTER}`]}
        component={LoadFilter}
      />
      <ApplicationRoute
        path={[`${MANAGE_MAPPER_ROUTES.TARGET}`]}
        component={TargetContainers}
      />
    </Switch>
  );
};
