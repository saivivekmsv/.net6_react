import React from "react";
import { Doco_CenterContainer } from "../../containers";
import { withAppLayout } from "../../hoc";

const Doco_Center = (props) => {
  return <Doco_CenterContainer {...props} />;
};

export default withAppLayout(Doco_Center);
