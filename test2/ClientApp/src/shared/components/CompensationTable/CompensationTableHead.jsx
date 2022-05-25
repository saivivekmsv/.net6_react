import React from "react";

const CompensationTableHead = ({ children, className }) => {
  return (
    <div
      className={`d-flex compensation-table-head align-items-center ${className}`}
    >
      {children}
    </div>
  );
};

export default CompensationTableHead;
