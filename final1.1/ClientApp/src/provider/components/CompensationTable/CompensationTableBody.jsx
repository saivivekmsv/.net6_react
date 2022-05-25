import React, { Children, useState, useRef } from "react";
import { useDetectScrollEnd, useDeepEffect } from "../../abstracts";
import CompensationTableNoData from "./CompensationTableNoData";

const CompensationTableBody = ({
  children,
  className,
  interVal = 10,
  scrollEndCallBack,
  totalRecords = 0,
  isLoading,
}) => {
  const tableBodyRef = useRef(null);
  const [pageDetails, setPageDetails] = useState({
    pageNumber: 1,
    from: 1,
    to: interVal,
  });

  const totalPage = Math.ceil(totalRecords / interVal);
  const { triggerScrollEnd } = useDetectScrollEnd(tableBodyRef);

  useDeepEffect(() => {
    const newPageNumber = pageDetails.pageNumber + 1;
    const fromPage = pageDetails.to + 1;
    const toPage = newPageNumber * interVal;

    const newDetails = {
      pageNumber: newPageNumber,
      from: fromPage,
      to: toPage,
    };
    if (triggerScrollEnd && newPageNumber <= totalPage) {
      setPageDetails(newDetails);
      scrollEndCallBack(newDetails);
    }
  }, [triggerScrollEnd]);
  const childrenCount = Children.count(children);
  return (
    <div
      ref={tableBodyRef}
      className={`d-flex flex-column compensation-table-body ${className}`}
    >
      {childrenCount < 1 && (
        <CompensationTableNoData
          isLoading={isLoading}
          totalRecords={totalRecords}
        />
      )}
      {children}
    </div>
  );
};

export default CompensationTableBody;
