import React from "react";
import { LoaderWrapper } from "../";

import TableHead from "./TableHead";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import TableHeadCell from "./TableHeadCell";

const Table = ({ children, className, isLoading }) => {
  return (
    <LoaderWrapper isLoading={isLoading}>
      <div className={`d-flex flex-column cspl-table ${className}`}>
        {children}
      </div>
    </LoaderWrapper>
  );
};

Table.Td = TableCell;
Table.Tr = TableRow;
Table.Tbody = TableBody;
Table.Thead = TableHead;
Table.Th = TableHeadCell;

export default Table;
