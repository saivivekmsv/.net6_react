import React from "react";
import { PayrollReportsContainer } from "../../../containers";
import { withAppLayout } from "../../../hoc";

const PayrollReports = (props) => {
  return <PayrollReportsContainer {...props} />;
};

export default withAppLayout(PayrollReports);
