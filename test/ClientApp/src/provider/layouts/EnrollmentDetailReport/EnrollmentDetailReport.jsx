import React from "react";
import { EnrollmentDetailReportContainer } from "../../containers";
import { withAppLayout } from "../../hoc";

const EnrollmentDetailReport = (props) => {
  return (
    <div style={{ "overflow-y": "scroll", width: "100%" }}>
      {" "}
      <EnrollmentDetailReportContainer {...props} />{" "}
    </div>
  );
};

export default withAppLayout(EnrollmentDetailReport);
