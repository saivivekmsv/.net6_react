import React from "react";

const TableRow = ({ children, className, ...rest }) => {
  return (
    <div className={`d-flex table-row ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default TableRow;
