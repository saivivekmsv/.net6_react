import React from "react";

import EmployeeAllocationRules from "./EmployeeAllocationRules";
import EmployerAllocationRules from "./EmployerAllocationRules";

const AllocationRulesForm = (props) => {
  const { values, fields } = props;
  const isEmployee = parseInt(values[fields.sourceType], 10) !== 2;
  return (
    <div>
      {isEmployee && <EmployeeAllocationRules {...props} />}
      {!isEmployee && <EmployerAllocationRules {...props} />}
    </div>
  );
};

export default AllocationRulesForm;
