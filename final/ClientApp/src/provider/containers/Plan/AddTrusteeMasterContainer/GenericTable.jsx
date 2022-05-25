import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CsplTable as Table } from "../../../components";
import { MANAGE_PLAN_ROUTES } from "../../../utils";

const columns = [
  {
    label: "Company Name",
    className: "column-trusteeName",
    columnName: "trusteeName",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "E Mail",
    className: "column-trusteeMail",
    columnName: "trusteeMail",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "Phone no.",
    className: "column-trusteePhone",
    columnName: "trusteePhone",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "",
    className: "column-trusteePlan",
    columnName: "trusteePlan",
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
        {data.map((trustee, index) => {
          return (
            <Table.Tr key={index}>
              <Table.Td className="column-trusteeName">
                <Link to={`${MANAGE_PLAN_ROUTES.MANAGE_TRUSTEE}`}>
                  {trustee.trusteeName}
                </Link>
              </Table.Td>
              <Table.Td className="column-trusteeMail">
                {trustee.trusteeMail}
              </Table.Td>
              <Table.Td className="column-trusteePhone">
                {trustee.trusteePhone}
              </Table.Td>
              <Table.Td className="column-trusteePlan">
                <Link to={`${MANAGE_PLAN_ROUTES.MANAGE_TRUSTEE}`}>
                  {trustee.trusteePlan === "" ? (
                    ""
                  ) : (
                    <button className="btn-theme">{trustee.trusteePlan}</button>
                  )}
                </Link>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};

export default GenericTable;
