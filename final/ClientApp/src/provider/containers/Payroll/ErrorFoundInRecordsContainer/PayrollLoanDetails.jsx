import React, { useState } from "react";
import { CsplTable as Table, SliderPanel } from "../../../components";
// import { getNullTableItem } from "../../../utils";
import LoadRepayment from "./LoanRepaymentDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrashAlt,
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";

const columns = [
  {
    label: "Plan ID",
    className: "column-plan-status ft-12",
    columnName: "planId",
  },
  {
    label: "Loan ID",
    className: "column-loan-id ft-12",
    columnName: "loanId",
  },
  {
    label: "Outstanding loan amount",
    className: "column-outstanding-loan-amount ft-12",
    columnName: "outstandingLoanAmount",
  },
  {
    label: "Periodic payment amount",
    className: "column-periodic-payment-amount ft-12",
    columnName: "periodicPaymentAmount",
  },
  {
    label: "Loan status",
    className: "column-loan-status ft-12",
    columnName: "loanStatus",
  },
  // {
  //   label: "Amortization",
  //   className: "column-loan-amortization ft-12",
  // },
  // {
  //   label: "Action",
  //   className: "column-removebutton",
  //   columnName: "removebutton",
  // },
];

const PayrollCompensationDetails = ({ data }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="payroll-loan-details">
      <div className="plan-sub-heading">Loan Details</div>
      <div className="ft-12 mb-25">
        The loan details displyed may not reflect newly uploaded loan activity.
      </div>
      <Table className="loan-details-table">
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
          {data.map((item, index) => {
            return (
              <Table.Tr key={index}>
                <Table.Td className="column-plan-status ft-12">
                  {item.planId}
                </Table.Td>
                <Table.Td className="column-loan-id ft-12">
                  {item.loanId}
                </Table.Td>
                <Table.Td className="column-outstanding-loan-amount ft-12">
                  {item.outstandingLoanAmount}
                </Table.Td>
                <Table.Td className="column-periodic-payment-amount ft-12">
                  {item.periodicPaymentAmount}
                </Table.Td>
                <Table.Td className="column-loan-status ft-12">
                  {item.loanStatus}
                </Table.Td>
                <Table.Td className="column-loan-amortization ft-12">
                  <span
                    className="link-text"
                    onClick={() => setModalOpen(true)}
                  >
                    view
                  </span>
                </Table.Td>
                <Table.Td className="column-removebutton ft-12">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size="sm"
                    color="#F16973"
                    className="pointer"
                    //onClick={() => removeOne(item, index)}
                  />
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="md"
                    color="green"
                    className="pointer"
                  />
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <SliderPanel
        isOpen={isModalOpen}
        size="80"
        onClose={() => setModalOpen(false)}
        backdropClicked={false}
      >
        <LoadRepayment />
      </SliderPanel>
    </div>
  );
};

export default PayrollCompensationDetails;
