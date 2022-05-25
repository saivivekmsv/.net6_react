import React from "react";
import DistributionAllocationMethodsFields from "./DistributionAllocationMethodsFields";
import DistributionsOptionsFormFields from "./DistributionsOptionsFormFields";
import FeesFields from "./FeesFields";
import SourceApplicableTable from "./SourceApplicableTable";

const InServiceForm = (props) => {
  return (
    <div>
      <DistributionsOptionsFormFields {...props} />
      <SourceApplicableTable {...props} />
      <DistributionAllocationMethodsFields {...props} />
      <FeesFields {...props} />
    </div>
  );
};

export default InServiceForm;
