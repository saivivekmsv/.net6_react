import React, { useState } from "react";
import { CsplTable as Table } from "../../../components";
import { usDateFormat } from "../../../utils";
import moment from "moment";

const columns = [
  {
    label: "Employee Name",
    className: "column-source-employeeName",
    columnName: "employeeName",
  },
  {
    label: "Eligibility Status",
    className: "column-source-eligibilityStatus",
    columnName: "eligibilityStatus",
  },
  {
    label: "Eligibility Date",
    className: "column-source-eligibilityDate",
    columnName: "eligibilityDate",
  },
  {
    label: "Eligibility since(days)",
    className: "column-source-eligibileSince",
    columnName: "eligibileSince",
  },
  {
    label: "Source Name",
    className: "column-source-sourceName",
    columnName: "sourceName",
  },
];

const EligibilitySource = ({
  data = [],
  isLoading,
  handleSort,
  totalRecords,
  scrollEndCallBack,
}) => {
  const [sortingData, setSortingData] = useState({});

  const onSortClick = (item, index, orderBy) => {
    const details = {
      column: item.columnName,
      columnIndex: index,
      orderBy,
    };
    setSortingData(details);
    handleSort(details);
  };

  const scrollCallBack = (_, pageDetails) => {
    scrollEndCallBack(pageDetails, "generic");
  };

  return (
    <Table isLoading={isLoading} className="eligibility-source-table">
      <Table.Thead>
        <Table.Tr>
          {columns.map((item, index) => {
            const orderBy =
              sortingData.columnIndex === index ? sortingData.orderBy : "";
            return (
              <Table.Th
                key={index}
                className={item.className}
                isSortable={item.isSortable}
                orderBy={orderBy}
                onClick={(sortOrder) => onSortClick(item, index, sortOrder)}
              >
                {item.label}
              </Table.Th>
            );
          })}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody
        scrollEndCallBack={scrollCallBack}
        totalRecords={totalRecords}
      >
        {data.map((source, index) => {
          return (
            <Table.Tr key={index}>
              <Table.Td className="column-source-employeeName">
                {source.employeeName}
              </Table.Td>
              <Table.Td
                className={`column-source-eligibilityStatus ${
                  source.isEligible === true ? "" : "highlighted-red"
                }`}
              >
                {source.isEligible == true ? "Eligible" : "Ineligible"}
              </Table.Td>
              <Table.Td className="column-source-eligibilityDate">
                {source.eligibilityDate != null
                  ? usDateFormat(source.eligibilityDate)
                  : "-"}
              </Table.Td>
              <Table.Td className="column-source-eligibileSince">
                {source.eligibilitySinceDays}
              </Table.Td>
              <Table.Td className="column-source-sourceName">
                {source.sourceName}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};

export default EligibilitySource;
