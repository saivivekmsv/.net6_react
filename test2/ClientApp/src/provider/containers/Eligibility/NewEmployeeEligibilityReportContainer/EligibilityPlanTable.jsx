import React, { useState } from "react";
import { CsplTable as Table } from "../../../components";
import { usDateFormat } from "../../../utils";
import moment from "moment";

const columns = [
  {
    label: "Employee Name",
    className: "column-plan-employeeName",
    columnName: "employeeName",
  },
  {
    label: "Eligibility Status",
    className: "column-plan-eligibilityStatus",
    columnName: "isEligible",
  },
  {
    label: "Eligibility Date",
    className: "column-plan-eligibilityDate",
    columnName: "eligibilityDate",
  },
  {
    label: "Eligibility since(days)",
    className: "column-plan-eligibileSince",
    columnName: "eligibilitySinceDays",
  },
];

const EligibilityPlan = ({
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
    <Table isLoading={isLoading}>
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
        {data.map((plan, index) => {
          return (
            <Table.Tr key={index}>
              <Table.Td className="column-plan-employeeName">
                {plan.employeeName}
              </Table.Td>
              <Table.Td
                className={`column-plan-eligibilityStatus ${
                  plan.isEligible === true ? "" : "highlighted-red"
                }`}
              >
                {plan.isEligible == true ? "Eligible" : "Ineligible"}
              </Table.Td>
              <Table.Td className="column-plan-eligibilityDate">
                {plan.eligibilityDate
                  ? usDateFormat(plan.eligibilityDate)
                  : "-"}
              </Table.Td>
              <Table.Td className="column-plan-eligibileSince">
                {plan.eligibilitySinceDays}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};

export default EligibilityPlan;
