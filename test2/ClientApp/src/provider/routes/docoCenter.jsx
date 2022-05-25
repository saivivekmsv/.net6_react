import React from "react";
import { Switch } from "react-router-dom";
import { MapAndTransform, Aggregate } from "../layouts";

import { DOCO_CENTER_ROUTES, ApplicationRoute } from "../utils";

export const ManageMapperRoutes = () => {
  return (
    <Switch>
      <ApplicationRoute
        exact
        path={[`${DOCO_CENTER_ROUTES.HOME}`]}
        component={MapAndTransform}
      />
    </Switch>
  );
};
