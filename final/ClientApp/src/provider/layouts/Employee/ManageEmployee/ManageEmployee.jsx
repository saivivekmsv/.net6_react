import React from "react";
import { ManageEmployeeContainer } from "../../../containers";
import { withAppLayout } from "../../../hoc";
import { ManageCensusProvider } from "../../../contexts";

const ManageEmployee = (props) => {
  return (
    <ManageCensusProvider>
      <ManageEmployeeContainer {...props} />
    </ManageCensusProvider>
  );
};

export default withAppLayout(ManageEmployee);
