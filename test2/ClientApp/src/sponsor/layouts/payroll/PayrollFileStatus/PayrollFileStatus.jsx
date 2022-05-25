import React from "react";
import  {PayrollFileStatusContainer}  from "../../../containers";
import { withAppLayout } from "../../../hoc";
import { ManagePayrollProvider } from "../../../contexts";

const PayrollFileStatus = (props) => {
  return (
    <ManagePayrollProvider>
      <PayrollFileStatusContainer {...props} />
    </ManagePayrollProvider>
  );
};

export default withAppLayout(PayrollFileStatus);
