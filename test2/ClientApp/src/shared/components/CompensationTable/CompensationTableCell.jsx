import React from "react";

const CompensationTableCell = ({ children, className, onClick }) => {
  return (
    <div
      className={`d-flex compensation-table-cell ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CompensationTableCell;
