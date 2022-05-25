import React from "react";
import { EnrollmentReportContainer } from "../../containers";
import { withAppLayout } from "../../hoc";

const EnrollmentReport = (props) => {
  return <EnrollmentReportContainer {...props} />;
};

export default withAppLayout(EnrollmentReport);
