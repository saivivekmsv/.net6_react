import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CsplTable as Table } from "../../../components";
import { MANAGE_PLAN_ROUTES } from "../../../utils";

const columns = [
  {
    label: "Eligibility Name",
    className: "column-eligibilityName",
    columnName: "eligibilityName",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "Eligibility Type",
    className: "column-eligibilityType",
    columnName: "eligibilityType",
    isSortable: true,
    orderBy: "",
  },
];

const GenericTable = ({
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
        {data.map((eligibility, index) => {
          return (
            <Table.Tr key={index}>
              <Table.Td className="column-eligibilityName">
                <Link
                  to={`${MANAGE_PLAN_ROUTES.ADD_ADVISOR}/edit/${eligibility.id}`}
                >
                  {eligibility.eligibilityName}
                </Link>
              </Table.Td>
              <Table.Td className="column-eligibilityType">
                {eligibility.eligibilityType}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};

export default GenericTable;
