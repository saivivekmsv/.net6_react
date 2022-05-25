import React from "react";
import { useDeepEffect, useRequest } from "../../abstracts";
import { getEmployeeCensusInformation } from "../../services";

const CensusMenuEmployeeDetails = (props) => {
  const { response: filteredValues, loading: load } = useRequest({
    method: getEmployeeCensusInformation,
    payload: props.censusId,
    defaultResponse: [],
  });
  console.log(props.censusId, "id");
  return (
    <div className="d-flex flex-column employee-details">
      <div>Employee</div>
      <div className="employee-name">
        {filteredValues.firstName} {filteredValues.middleName}{" "}
        {filteredValues.lastName}{" "}
      </div>
      <div className="employee-status">
        Status : {filteredValues.employmentStatus}
      </div>
      <div className="employee-id">ID:{filteredValues.employeeNumber}</div>
    </div>
  );
};

export default CensusMenuEmployeeDetails;
