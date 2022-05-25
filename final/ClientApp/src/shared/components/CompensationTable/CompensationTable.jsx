import React from "react";
import { LoaderWrapper } from "..";

import CompensationTableHead from "./CompensationTableHead";
import CompensationTableBody from "./CompensationTableBody";
import CompensationTableRow from "./CompensationTableRow";
import CompensationTableCell from "./CompensationTableCell";
import CompensationTableHeadCell from "./CompensationTableHeadCell";

const CompensationTable = ({ children, className, isLoading }) => {
  return (
    <LoaderWrapper isLoading={isLoading}>
      <div className={`d-flex flex-column compensation-table ${className}`}>
        {children}
      </div>
    </LoaderWrapper>
  );
};

CompensationTable.Td = CompensationTableCell;
CompensationTable.Tr = CompensationTableRow;
CompensationTable.Tbody = CompensationTableBody;
CompensationTable.Thead = CompensationTableHead;
CompensationTable.Th = CompensationTableHeadCell;

export default CompensationTable;
