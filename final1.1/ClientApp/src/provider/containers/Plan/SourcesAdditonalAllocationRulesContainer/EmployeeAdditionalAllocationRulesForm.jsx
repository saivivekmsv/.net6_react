import React from "react";
import EmployeeAllocationRules from "../ManageSourcesNewContainer/EmployeeAllocationRules";
import CommonAllocationRules from "./CommonAllocationRules";

const EmployeeAdditionalAllocationRulesForm = (props) => {
  const {
    fields,
    values,
    setFieldValue,
    isEdit,
    isSave,
    handleChange,
    setValues,
  } = props;

  return (
    <div>
      <EmployeeAllocationRules {...props} isSourceAditionalAllocation={true} />
      <div className="line-separator"></div>
      <CommonAllocationRules {...props} />
    </div>
  );
};

export default EmployeeAdditionalAllocationRulesForm;
