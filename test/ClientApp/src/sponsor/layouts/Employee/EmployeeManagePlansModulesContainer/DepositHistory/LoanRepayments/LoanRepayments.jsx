import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CsplTable as Table } from "shared/components";
import { useRequest, useRouterParams } from "shared/abstracts";
import { getPlansLoanRepayments } from "sponsor/services";
import { censusFormFields } from "shared/utils";

const columns = [
  {
    label: "Loan ID",
    className: "column-loadId",
    columnName: "loanId",
  },
  {
    label: "Repayment Date",
    className: "column-repaymentDate",
    columnName: "repaymentDate",
  },
  {
    label: "Repayment Amount",
    className: "column-repaymentAmount",
    columnName: "repaymentAmount",
  },
  {
    label: "Updated Through",
    className: "column-updatedThrough",
    columnName: "updatedThrough",
  },
  {
    label: "Date Time Loaded",
    className: "column-dateTimeLoaded",
    columnName: "dateTimeLoaded",
  },
  {
    label: "Comments",
    className: "column-comments",
    columnName: "comments",
    link: `link`,
  },
];

const LoanRepayments = (props) => {
  const [filteredResponse] = useState([]);
  const { planId, censusId } = useRouterParams();
  const { response } = useRequest({
    method: getPlansLoanRepayments,
    payload: {
      planId: planId,
      employeeId: censusId,
    },
    defaultResponse: filteredResponse,
  });

  return (
    <>
      <div className="w-100 loan-container">
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
            {response.map((compensation, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    return (
                      <Table.Td key={cellIndex} className={item.className}>
                        {!isEmpty(item.link) ? (
                          <OverlayTrigger
                            overlay={<Tooltip>{compensation.tooltip}</Tooltip>}
                          >
                            <Link>{compensation[item.columnName]}</Link>
                          </OverlayTrigger>
                        ) : item.dataMapper ? (
                          item.dataMapper[compensation[item.columnName]]
                        ) : item.columnName === "repaymentAmount" ? (
                          "$" + compensation[item.columnName].toFixed(2)
                        ) : (
                          compensation[item.columnName]
                        )}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
};

export default LoanRepayments;
