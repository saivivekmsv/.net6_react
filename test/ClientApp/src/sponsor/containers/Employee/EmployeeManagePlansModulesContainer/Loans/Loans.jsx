import React from "react";
import { CsplTable as Table } from "../../../../../shared/components";

import { getNullTableItem, OPTIONS_DATA_MAPPER } from "../../../../../shared/utils";
import { useRequest, useRouterParams } from "../../../../../shared/abstracts";
import { getAllEmployeeLoans } from "../../../../services"

const columns = [
  {
    label: "Loan ID",
    className: "column-loanId",
    columnName: "loanNumber",
  },
  {
    label: "Outstanding Loan Amount",
    className: "column-outstandingLoanAmount",
    columnName: "loanOutStandingAmount",
  },
  {
    label: "Periodic Payment Amount",
    className: "column-periodicPaymentAmount",
    columnName: "scheduleRepaymentAmount",
  },
  {
    label: "Loan Status",
    className: "column-loanStatus",
    columnName: "loanStatus",
    //dataMapper: OPTIONS_DATA_MAPPER.LOAN_STATUS,
  },
];

const Loans = (props) => {
  const { planId } = useRouterParams();
  const intPlanId = parseInt(planId, 10);
  const { censusId } = useRouterParams();
  const intEmployeeId = parseInt(censusId, 10);

  const { loading: isLoading, response: employeeLoans } = useRequest({
    method: getAllEmployeeLoans,
    payload: {
      planId: intPlanId,
      employeeId: intEmployeeId,
    },
  });
  return (
    <div className="mt-5">
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
          {employeeLoans &&
            employeeLoans.map((loan, index) => {
              return (
                <Table.Tr key={index}>
                  {columns.map((item, cellIndex) => {
                    const getContent = () => {
                      // if (item.dataMapper) {
                      //   return item.dataMapper[loan[item.columnName]];
                      // }
                      return loan[item.columnName];
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
    </div>
  );
};

export default Loans;
