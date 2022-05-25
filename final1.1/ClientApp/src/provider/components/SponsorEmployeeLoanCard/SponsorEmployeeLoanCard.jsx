import React, { useState } from "react";
import { Pagination, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import SponsorFieldview from "../SponsorClassificationCard/SponsorFieldview";

const loans = [
  {
    description: "Housing Loan",
    planId: "401KCORENF",
    outstandingLoan: "$ 8,080.00",
    installment: "$ 120.00",
    nextDue: "10/20/2021",
    progress: 57,
  },
  {
    description: "Car Loan",
    planId: "401KCORENF",
    outstandingLoan: "$ 8,080.00",
    installment: "$ 120.00",
    nextDue: "10/20/2021",
    progress: 67,
  },
  {
    description: "Medical Loan",
    planId: "401KCORENF",
    outstandingLoan: "$ 8,080.00",
    installment: "$ 120.00",
    nextDue: "10/20/2021",
    progress: 77,
  },
];

const SponsorEmployeeLoanCard = (props) => {
  const [active, setActive] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setActive(selectedIndex);
  };

  return (
    <div
      className="d-flex flex-column w-100"
      style={{ backgroundColor: "#FFFFFF", borderRadius: "0.313rem" }}
    >
      <div className="d-flex flex-row flex-wrap justify-content-between m-3 p-3 border-bottom">
        <div className="d-flex flex-column justify-content-center heading">
          {loans[active].description}
        </div>
        <SponsorFieldview title1={"Next Due"} value1={loans[active].nextDue} />
      </div>
      <div className="p-3">
        <span
          style={{
            left: loans[active].progress + "%",
          }}
          className="percentage-label"
        >
          {loans[active].progress}%
        </span>
        <div
          style={{
            borderLeft: "0.063rem solid #27AE60",
            position: "relative",
            left: loans[active].progress + "%",
            height: "0.625rem",
            transform: "translateX(-0.125rem)",
          }}
        ></div>
        <ProgressBar
          now={loans[active].progress}
          label={`${loans[active].progress}%`}
          variant={"my-variant"}
        />
      </div>
      <div className="d-flex flex-row flex-wrap justify-content-between p-3">
        <SponsorFieldview
          title1={"Outstanding Loan"}
          value1={loans[active].outstandingLoan}
        />
        <SponsorFieldview
          title1={"Payment per Period"}
          value1={loans[active].installment}
        />
      </div>
      <div>
        <Pagination size="sm">
          {loans.map((loan, index) => (
            <Pagination.Item
              key={index}
              active={index === active}
              onClick={() => handleSelect(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default SponsorEmployeeLoanCard;
