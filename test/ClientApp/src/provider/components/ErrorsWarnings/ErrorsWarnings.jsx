import React from "react";

const ErrorsWarnings = ({ errors, warnings }) => {
  return (
    <span>
     
     Warnings <span className="pending-text ft-14">{warnings}</span> {""} | {""}
     Errors  <span className="error-text ft-14">{errors}</span> 
    </span>
  );
};

export default ErrorsWarnings;
