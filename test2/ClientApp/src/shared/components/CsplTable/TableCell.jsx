import React from "react";

const TableCell = ({ children, className, onClick }) => {
  return (
    <div className={`d-flex table-cell ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default TableCell;
