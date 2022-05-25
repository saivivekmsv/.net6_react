import React from "react";
import { CompanyContainer } from "../../containers";
import { withAppLayout } from "../../hoc";

const Company = (props) => {
  return <CompanyContainer {...props} />;
};

export default withAppLayout(Company);
