import React from "react";
import { Link } from "..";
import { Row } from "react-bootstrap";
import "../../styles/components/SponsorCard.scss";
const SponsorTaskManagementCard = (props) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor:'white',
        borderRadius:'5px',
        width: "447px",
        height: "322px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="ft-18 fw-500"
        style={{ color: "#333333", marginBottom: "40px" }}
      >
        Task management
      </div>
      <div>
        <div className="disp-flew-col">
          <div className="task-tab">
            <div className="tab-line red"></div>
            <div
              className="marg-left-15"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
            >
              <div className="task-tab-title">4 Files with errors</div>
              <div className="task-tab-desc">Error correction</div>
            </div>
            <Link style={{ marginLeft: "30px" }}>
              <div
                className=""
                style={{
                  alignItems: "center",
                  width: "28px",
                  height: "28px",
                  alignItems: "center",
                  borderRadius: "50%",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <i
                  class="fas fa-chevron-right"
                  style={{ color: " #828282" }}
                ></i>
              </div>
            </Link>
          </div>
          <div className="task-tab" style={{ marginTop: "20px" }}>
            <div className="tab-line orange"></div>
            <div
              className="marg-left-15"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
            >
              <div className="task-tab-title">August payroll file dues</div>
              <div className="task-tab-desc">Payroll upload</div>
            </div>
            <Link style={{ marginLeft: "30px" }}>
              <div
                className=""
                style={{
                  alignItems: "center",
                  width: "28px",
                  height: "28px",
                  alignItems: "center",
                  borderRadius: "50%",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <i
                  class="fas fa-chevron-right"
                  style={{ color: " #828282" }}
                ></i>
              </div>
            </Link>
          </div>
          <div className="task-tab" style={{ marginTop: "20px" }}>
            <div className="tab-line green"></div>
            <div
              className="marg-left-15"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
            >
              <div className="task-tab-title">6 Loan | 3 Withdrawls | 2 Transfers</div>
              <div className="task-tab-desc">Transaction requests (11)</div>
            </div>
            <Link style={{ marginLeft: "30px" }}>
              <div
                className=""
                style={{
                  alignItems: "center",
                  width: "28px",
                  height: "28px",
                  alignItems: "center",
                  borderRadius: "50%",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <i
                  class="fas fa-chevron-right"
                  style={{ color: " #828282" }}
                ></i>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorTaskManagementCard;
