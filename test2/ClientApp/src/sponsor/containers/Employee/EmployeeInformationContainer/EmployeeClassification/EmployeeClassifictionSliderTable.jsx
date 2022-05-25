import React from "react";
import { CsplTable as Table } from "../../../../../shared/components"
import { isEmpty, get } from "lodash";
import { useState } from "react";
import { usDateFormat } from "../../../../../shared/utils";

const columns = [
  {
    label: "Classification type",
    className: "column-classificationType",
    columnName: "classificationTypeName",
  },
  {
    label: "Classification code",
    className: "column-classificationCode",
    columnName: "code",
  },
  {
    label: "Effective start date",
    className: "column-startDate",
    columnName: "effectiveStartDate",
  },
  {
    label: "Effective end date",
    className: "column-endDate",
    columnName: "effectiveEndDate",
  },
];

const EmployeeClassificationSliderTable = ({ data }) => {
  console.log("Pkk", data);
  const employeeClassification = get(data, "employeeClassificationHistory", "");
  // const { censusId, flow } = useRouterParams();
  // const { response } = useRequest({
  //   method: getPlansEmployeeClassificationHistory,
  //   payload: {
  //     employeeId: censusId,
  //     classificationTypeId: get(data, "id", "123"),
  //   },
  //   defaultResponse: [],
  // });

  return (
    <div className="employee-slider-table">
      <div className="plan-sub-heading">Employee Classification</div>
      <div className="header-details">
        <div className="label">Classification type</div>
        <div className="value">{get(data, "classificationTypeName", "")}</div>
      </div>
      <div className="d-flex mt-10">
        <div className="header-details">
          <div className="label">Classification code</div>
          <div className="value">{get(data, "code", "")}</div>
        </div>
        <div className="header-details">
          <div className="label">Classification name</div>
          <div className="value">{get(data, "classificationName", "")}</div>
        </div>
        <div className="header-details">
          <div className="label">Start date</div>
          <div className="value">
            {usDateFormat(get(data, "effectiveStartDate", ""))}
          </div>
        </div>
        <div className="header-details">
          <div className="label">End date</div>
          <div className="value">
            {usDateFormat(get(data, "effectiveEndDate", ""))}
          </div>
        </div>
      </div>
      <div className="line-separator" />
      <div className="plan-sub-heading">Employee Classification History</div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            {columns.map((item, index) => {
              return (
                <Table.Th key={index} className={item.className}>
                  {item.label}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {employeeClassification &&
            employeeClassification.map((compensation, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {!isEmpty(item.link)
                          ? item.dataMapper[compensation[item.columnName]]
                          : item.columnName == "effectiveStartDate" ||
                            item.columnName == "effectiveEndDate"
                          ? usDateFormat(compensation[item.columnName])
                          : compensation[item.columnName]}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default EmployeeClassificationSliderTable;
