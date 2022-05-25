import React from "react";
import { CsplTable as Table } from "../../../components";
import RepaymentDetails from "../../../mocks/loanRepaymentDetails.json";
const columns = [
  {
    label: "Installment count",
    className: "column-installmentCount ft-12",
    columnName: "installmentCount",
  },
  {
    label: "Payment date",
    className: "column-paymentDate ft-12",
    columnName: "paymentDate",
  },
  {
    label: "Pay date",
    className: "column-paydate ft-12",
    columnName: "paydate",
  },
  {
    label: "Expected repayment amount",
    className: "column-expectedRepaymentAmount ft-12",
    columnName: "expectedRepaymentAmount",
  },
  {
    label: "Loan repayment amount",
    className: "column-loanRepaymentAmount ft-12",
    columnName: "loanRepaymentAmount",
  },
  {
    label: "Principal payment",
    className: "column-principalPayment ft-12",
    columnName: "principalPayment",
  },
  {
    label: "Interest payment",
    className: "column-interestPayment ft-12",
    columnName: "interestPayment",
  },
  {
    label: "Outstanding principal balance",
    className: "column-outstandingPrincipalBalance ft-12",
    columnName: "outstandingPrincipalBalance",
  },
  {
    label: "Loan Status",
    className: "column-loanStatus ft-12",
    columnName: "loanStatus",
  },
];

const LoanRepaymentDetails = () => {
  return (
    <div className="payroll-loan-details">
      <div className="plan-sub-heading">Loan Details</div>
      <div className="ft-14 mb-10">
        XXX-XX-2009 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Peter Parker
      </div>
      <Table className="loan-details-view-table">
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
          {RepaymentDetails.map((item, index) => {
            return (
              <Table.Tr key={index}>
                <Table.Td className="column-installmentCount ft-12">
                  {item.installmentCount}
                </Table.Td>
                <Table.Td className="column-paymentDate ft-12">
                  {item.paymentDate}
                </Table.Td>
                <Table.Td className="column-paydate ft-12">
                  {item.paydate}
                </Table.Td>
                <Table.Td className="column-expectedRepaymentAmount ft-12">
                  {item.expectedRepaymentAmount}
                </Table.Td>
                <Table.Td className="column-loanRepaymentAmount ft-12">
                  {item.loanRepaymentAmount}
                </Table.Td>
                <Table.Td className="column-principalPayment ft-12">
                  {item.principalPayment}
                </Table.Td>
                <Table.Td className="column-interestPayment ft-12">
                  {item.interestPayment}
                </Table.Td>
                <Table.Td className="column-outstandingPrincipalBalance ft-12">
                  {item.outstandingPrincipalBalance}
                </Table.Td>
                <Table.Td className="column-loanStatus ft-12">
                  {item.loanStatus === 1 ? "Active" : ""}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default LoanRepaymentDetails;
