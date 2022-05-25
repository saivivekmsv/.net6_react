import React, { useState, useEffect } from "react";

const CompensationTableHeadCell = ({
  children,
  className,
  isSortable,
  onClick,
  orderBy,
}) => {
  const [sortOrder, setSortOrder] = useState(orderBy);

  useEffect(() => {
    setSortOrder(orderBy);
  }, [orderBy]);

  const additionalProps = {};

  const onSortClick = () => {
    const newOrder = ["desc", ""].includes(sortOrder) ? "asc" : "desc";
    setSortOrder(newOrder);
    onClick(newOrder);
  };

  if (isSortable) {
    additionalProps.onClick = onSortClick;
  }
  const sortClass = isSortable ? "sortable" : "";
  return (
    <div
      className={`d-flex compensation-table-head-cell ${className} ${sortClass} ${sortOrder}`}
      {...additionalProps}
    >
      {children}
    </div>
  );
};

export default CompensationTableHeadCell;
