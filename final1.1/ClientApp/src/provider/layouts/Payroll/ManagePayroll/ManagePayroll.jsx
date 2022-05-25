import React from "react";
import { ManagePayrollContainer } from "../../../containers";
import { ManagePayrollProvider } from "../../../contexts";
import { withAppLayout } from "../../../hoc";

const ManagePayroll = (props) => {
  return (
    <ManagePayrollProvider>
      <ManagePayrollContainer {...props} />
    </ManagePayrollProvider>
  );
};

export default withAppLayout(ManagePayroll);
