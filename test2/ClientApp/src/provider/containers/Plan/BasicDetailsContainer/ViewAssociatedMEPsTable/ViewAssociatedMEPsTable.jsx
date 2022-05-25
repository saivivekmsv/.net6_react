import React from "react";
import { CsplTable as Table } from "../../../../components";
import { getMasterAssociatedMEPs } from "../../../../services";
import { useRequest } from "../../../../abstracts";
import { isEmpty } from "lodash";

const columns = [
  {
    label: "Plan name",
    className: "column-planName",
    columnName: "planName",
  },
  {
    label: "Company name",
    className: "column-companyName",
    columnName: "companyName",
  },
  {
    label: "Plan ID",
    className: "column-planId",
    columnName: "planId",
  },
  {
    label: "Action",
    className: "column-action",
    columnName: "action",
  },
];

const ViewAssociatedMEPsTable = ({ data }) => {
  const { response } = useRequest({
    method: getMasterAssociatedMEPs,
    defaultResponse: [],
  });

  return (
    <div className="basic-slider-table text-left">
      <div className="plan-sub-heading">
        Adopting Employer plans associated with the Master MEP/PEP.
      </div>
      <div className="plan-sub-heading text-uppercase">plan reg 401k mm1</div>

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
            response.map((master, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {!isEmpty(item.link)
                          ? item.dataMapper[master[item.columnName]]
                          : master[item.columnName]}
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

export default ViewAssociatedMEPsTable;
