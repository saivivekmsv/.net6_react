import React from "react";
import { SuccessPlans } from "../../../containers";
import { withAppLayout } from "../../../hoc";

const SuccessPlan = (props) => {
  return <SuccessPlans {...props} />;
};

export default withAppLayout(SuccessPlan);
