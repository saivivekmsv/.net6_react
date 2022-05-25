import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CsplTable as Table } from "../../../components";
import {
  getNullTableItem,
  MANAGE_PLAN_ROUTES,
  OPTIONS_DATA_MAPPER,
} from "../../../utils";

const columns = [
  {
    label: "Plan ID",
    className: "column-plan-id",
    columnName: "id",
    isSortable: true,
    orderBy: "",
    link: MANAGE_PLAN_ROUTES.BASIC_DETAILS,
  },
  {
    label: "Plan name",
    className: "column-plan-name",
    columnName: "planName",
    isSortable: true,
    orderBy: "",
  },
  {
    label: "Plan Type",
    className: "column-plan-type",
    columnName: "planType",
    isSortable: true,
    orderBy: "",
    dataMapper: OPTIONS_DATA_MAPPER.PLAN_TYPES,
  },
  {
    label: "Plan Category",
    className: "column-plan-category",
    columnName: "planCategory",
    isSortable: true,
    orderBy: "",
    dataMapper: OPTIONS_DATA_MAPPER.PLAN_CATERGORY,
  },
  {
    label: "Plan Status",
    className: "column-plan-status",
    columnName: "planStatus",
    isSortable: true,
    orderBy: "",
    dataMapper: OPTIONS_DATA_MAPPER.PLAN_STATUS_LIST,
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

  const scrollCallBack = (pageDetails) => {
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
              {columns.map((item, cellIndex) => {
                const getContent = () => {
                  if (item.link) {
                    return (
                      <Link to={`${item.link}/edit/${plan.id}`}>
                        {plan[item.columnName]}
                      </Link>
                    );
                  }
                  if (item.dataMapper) {
                    return item.dataMapper[plan[item.columnName]];
                  }
                  return plan[item.columnName];
                };
                return (
                  <Table.Td key={cellIndex} className={item.className}>
                    {getNullTableItem(getContent())}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};

export default GenericTable;
