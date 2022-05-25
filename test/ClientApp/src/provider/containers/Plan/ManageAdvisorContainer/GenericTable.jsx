import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CsplTable as Table } from "../../../components";
import AddToolTip from "../../../components/AddToolTip";
import { MANAGE_PLAN_ROUTES } from "../../../utils";

const columns = [
  {
    label: "Advisor Company Name",
    className: "column-custodianName",
    columnName: "advisorName",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "E Mail",
    className: "column-custodianMail",
    columnName: "advisorMail",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "Phone no.",
    className: "column-custodianPhone",
    columnName: "advisorPhone",
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
        {data.map((advisor, index) => {
          return (
            <Table.Tr key={index}>
              <Table.Td className="column-custodianName">
                <Link
                  to={`${MANAGE_PLAN_ROUTES.ADD_ADVISOR}/edit/${advisor.id}`}
                >
                  <AddToolTip name={advisor.advisorName} />
                </Link>
              </Table.Td>
              <Table.Td className="column-custodianMail">
                <AddToolTip name={advisor.advisorMail} />
              </Table.Td>
              <Table.Td className="column-custodianPhone">
                {advisor.advisorPhone}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};

export default GenericTable;
