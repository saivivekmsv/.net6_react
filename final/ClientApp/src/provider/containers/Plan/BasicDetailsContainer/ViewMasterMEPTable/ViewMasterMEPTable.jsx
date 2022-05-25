import React from "react";
import { CsplTable as Table } from "../../../../components";
import { getPlansEmployeeClassificationHistory } from "../../../../services";
import { useRequest } from "../../../../abstracts";
import { isEmpty } from "lodash";

const columns = [
  {
    label: "Classification type",
    className: "column-classificationType",
    columnName: "classificationType",
  },
  {
    label: "Classification code",
    className: "column-classificationCode",
    columnName: "classificationCode",
  },
  {
    label: "Effective start date",
    className: "column-startDate",
    columnName: "startDate",
  },
  {
    label: "Effective end date",
    className: "column-endDate",
    columnName: "endDate",
  },
];

const ViewMasterMEPTable = ({ data }) => {
  const { response } = useRequest({
    method: getPlansEmployeeClassificationHistory,
    defaultResponse: response,
  });

  return (
    <div className="employee-slider-table">
      <div className="plan-sub-heading">Employee Classification</div>
      <div className="header-details">
        <div className="label">Classification type</div>
        <div className="value">Location</div>
      </div>
      <div className="d-flex mt-10">
        <div className="header-details">
          <div className="label">Classification code</div>
          <div className="value">Sales</div>
        </div>
        <div className="header-details">
          <div className="label">Classification name</div>
          <div className="value">DM</div>
        </div>
        <div className="header-details">
          <div className="label">Start date</div>
          <div className="value">01/01/2019</div>
        </div>
        <div className="header-details">
          <div className="label">End date</div>
          <div className="value">12/12/2019</div>
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
          {response &&
            response.map((compensation, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {!isEmpty(item.link)
                          ? item.dataMapper[compensation[item.columnName]]
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

export default ViewMasterMEPTable;
