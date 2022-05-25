import React from "react";

const fields = [
  {
    title: "Loan Payment ",
    date: "Mar 21, 2021 at 14:32",
    value: "$ 682.00",
  },
  {
    title: "Payroll Contribution",
    date: "Mar 21, 2021 at 14:32",
    value: "$ 682.00",
  },
  {
    title: "Loan Payment ",
    date: "Mar 21, 2021 at 14:32",
    value: "$ 682.00",
  },
  {
    title: "Payroll Contribution",
    date: "Mar 21, 2021 at 14:32",
    value: "$ 682.00",
  },
  {
    title: "Withdrawal",
    date: "Mar 21, 2021 at 14:32",
    value: "$ 682.00",
  },
];

const SponsorEmployeeTransactionsCard = (props) => {
  return (
    <div className="d-flex flex-column sponsor-employee-summary-card">
      <span className="heading m-3 p-3 border-bottom">Latest Transactions</span>
      {fields.map((field) => (
        <div className="mb-3 transaction">
          <div className="transaction-detail">
            <span className="transaction-title">{field.title}</span>
            <span className="transaction-date">{field.date}</span>
          </div>
          <span className="heading">{field.value}</span>
        </div>
      ))}
    </div>
  );
};

export default SponsorEmployeeTransactionsCard;
