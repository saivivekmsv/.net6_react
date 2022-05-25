import React from "react";

const ErrorsWarnings = ({ errors, warnings }) => {
  return (
    <span>
      <span className="error-text ft-14">{errors}</span> Errors |{" "}
      <span className="pending-text ft-14">{warnings}</span> warnings
    </span>
  );
};

export default ErrorsWarnings;
