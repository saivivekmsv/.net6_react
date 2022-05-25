import React from "react";
import { PlanContainer } from "../../../containers";
import { withAppLayout } from "../../../hoc";

const Plan = (props) => {
  return <PlanContainer {...props} />;
};

export default withAppLayout(Plan);
