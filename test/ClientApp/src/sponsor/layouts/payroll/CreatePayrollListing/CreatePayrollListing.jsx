import React from "react";
import  {CreatePayrollListingContainer}  from "../../../containers";
import { withAppLayout } from "../../../hoc";
import { ManagePayrollProvider } from "../../../contexts";

const CreatePayrollListing = (props) => {
  return (
    <ManagePayrollProvider>
      <CreatePayrollListingContainer {...props} />
    </ManagePayrollProvider>
  );
};

export default withAppLayout(CreatePayrollListing);
