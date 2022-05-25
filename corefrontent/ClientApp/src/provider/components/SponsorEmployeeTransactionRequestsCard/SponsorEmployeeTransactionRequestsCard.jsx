import React from "react";
import SponsorFieldview from "../SponsorClassificationCard/SponsorFieldview";

const SponsorEmployeeTransactionRequestsCard = (props) => {
  return (
    <div
      className="d-flex flex-column"
      style={{ backgroundColor: "#FFFFFF", borderRadius: "0.313rem" }}
    >
      <div className="m-3 border-bottom justify-content-start heading p-3">
        Transaction Requests (5)
      </div>
      <div className="d-flex flex-row justify-content-between m-3 pl-3">
        <SponsorFieldview title1={"Loan Request (2) "} value1={"$ 5,000.00"} />
        <SponsorFieldview
          title1={"Withdrawal Request(3)"}
          value1={"$ 1,000.00"}
        />
      </div>
    </div>
  );
};

export default SponsorEmployeeTransactionRequestsCard;
