import React from "react";
import "../../styles/components/SponsorCard.scss";
const SponsorLoanInformationCard = (props) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
        borderRadius:'5px',
        backgroundColor:'white',
        width: "345px",
        height: "192px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="ft-18 fw-500" style={{ color: "#333333" }}>
        Loan Information
      </div>
      <div className="flex-row space-between">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "140px",
            height: "71px",
            backgroundColor: "#FAFAFA",
          }}
        >
          <div
            style={{
              lineHeight: "36px",
              color: "#4F4F4F",
              marginBottom: "10px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            $ 1.62 M
          </div>
          <div
            style={{ color: "#828282", fontSize: "12px", fontWeight: "400" }}
          >
            Total loan amount{" "}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "140px",
            height: "71px",
            backgroundColor: "#FAFAFA",
          }}
        >
          <div
            style={{
              lineHeight: "36px",
              color: "#4F4F4F",
              marginBottom: "10px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            $ 10.21 K
          </div>
          <div
            style={{ color: "#828282", fontSize: "12px", fontWeight: "400" }}
          >
            Avg. loan amount{" "}
          </div>
        </div>
      </div>
      <div className="flex-row space-between" style={{ marginTop: "10px" }}>
        <div className="flex-row space-between" style={{ width: "140px" }}>
          <span
            style={{ color: "#828282", fontSize: "12px", fontWeight: "500" }}
          >
            No. of delinquint
          </span>
          <span
            style={{
              lineHeight: "20px",
              color: "#4F4F4F",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            09
          </span>
        </div>
        <div className="flex-row space-between" style={{ width: "140px" }}>
          <span
            style={{ color: "#828282", fontSize: "12px", fontWeight: "500" }}
          >
            Active loans
          </span>
          <span
            style={{
              lineHeight: "20px",
              color: "#4F4F4F",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            160
          </span>
        </div>
      </div>
    </div>
  );
};

export default SponsorLoanInformationCard;
