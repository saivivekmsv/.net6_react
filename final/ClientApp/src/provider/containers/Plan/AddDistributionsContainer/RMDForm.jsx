import React from "react";
import DistributionsOptionsFormFields from "./DistributionsOptionsFormFields";
import FeesFields from "./FeesFields";

const RMDForm = (props) => {
  return (
    <div>
      <DistributionsOptionsFormFields {...props} />
      <FeesFields {...props} />
    </div>
  );
};

export default RMDForm;
