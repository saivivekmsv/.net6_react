import React from "react";
import { SponsorEmployeeContainer } from "../../../containers";
import { withAppLayout } from "../../../hoc";
import { AppLayoutProvider } from "shared/contexts";

const ManageEmployee = (props) => {
  return <AppLayoutProvider><SponsorEmployeeContainer {...props} /></AppLayoutProvider>;
};

export default withAppLayout(ManageEmployee);
