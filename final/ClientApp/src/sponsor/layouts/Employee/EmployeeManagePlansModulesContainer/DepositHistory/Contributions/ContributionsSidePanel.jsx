import { get } from "lodash";
import React from "react";
import { CsplTable as Table } from "shared/components";
import { usDateFormat } from "shared/utils";

const columns = [
  {
    label: "Source",
    className: "column-contribution-source",
    columnName: "sourceName",
  },
  {
    label: "Contribution",
    className: "column-contribution-perc",
    columnName: "contribution",
  },
];

const ContributionsSidePanel = ({ data }) => {
  return (
    <div className="contributions-slider-table d-flex align-items-center w-100 h-100">
      <div className="w-100">
        <div className="header-details">
          <div>
            <div className="label">Pay Date</div>
            <div className="value">{usDateFormat(get(data, "payDate"))}</div>
          </div>
          <br />
          <div>
            <div className="label">Total Contribution</div>
            <div className="value">{get(data, "totalContribution")}</div>
          </div>
        </div>
        <br />
        <Table className="add-contributions-table">
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
            {get(data, "contributions", []).map((contributions, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    const getContent = () => {
                      if (item.columnName === "contribution") {
                        return contributions[item.columnName] ||
                          contributions[item.columnName] === 0
                          ? "$" + contributions[item.columnName].toFixed(2)
                          : contributions[item.columnName];
                      }
                      return contributions[item.columnName];
                    };
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {getContent()}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
};

export default ContributionsSidePanel;
