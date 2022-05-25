import React from "react";

const CompensationTableRow = ({ children, className, ...rest }) => {
  return (
    <div className={`d-flex compensation-table-row ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default CompensationTableRow;
