import React from "react";
import { OutputFilesContainer } from "../../containers";
// import { ManagePayrollProvider } from "../../../contexts";
import { withAppLayout } from "../../hoc";

const OutputFiles = (props) => {
  return (
    // <ManagePayrollProvider>
    //   <ManagePayrollContainer {...props} />
    // </ManagePayrollProvider>
    <OutputFilesContainer />
  );
};

export default withAppLayout(OutputFiles);
