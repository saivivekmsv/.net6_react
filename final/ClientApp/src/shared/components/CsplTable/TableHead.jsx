import React from "react";

const TableHead = ({ children, className }) => {
  return (
    <div className={`d-flex table-head align-items-center ${className}`}>
      {children}
    </div>
  );
};

export default TableHead;
