import { isEmpty } from "lodash";
import React from "react";

const CompensationTableNoData = ({ isLoading, totalRecords, content }) => {
  if (
    (typeof isLoading === "boolean" && !isLoading && totalRecords < 1) ||
    (typeof isLoading !== "boolean" && isEmpty(totalRecords))
  ) {
    return (
      <div className="d-flex align-items-center justify-content-center">
        {content}
      </div>
    );
  }

  return null;
};

CompensationTableNoData.defaultProps = {
  content: "No data available",
};

export default CompensationTableNoData;
