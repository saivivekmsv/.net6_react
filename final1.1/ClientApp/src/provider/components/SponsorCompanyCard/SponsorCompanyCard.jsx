import React from "react";
import "../../styles/components/SponsorCard.scss";
import logo from "../../assets/netflix-logo-0.png";
import SponsorPlanDropdown from "../SponsorPlanDropdown/SponsorPlanDropdown";
import { Row } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import DoughnutEmployeeChart from "../../mocks/DoughnutEmployeeChart";
const SponsorFieldview = (props) => {
  const plans = [
    { planId: "783KCIUUNF01", planName: "783K Core Amazon_01 off 828731892" },
    { planId: "401KCORENF01", planName: "401K Core Netflix_01 get 9831712988" },
    { planId: "239KAJHFAJK3", planName: "239K Core Njfhaks_01 in 82173918" },
    { planId: "838KKAJSHDK2", planName: "838K Core Netflix_01 at 93484092" },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "770px",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        border: "1px solid #e0e0e0",
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
        borderRadius:'5px',
        backgroundColor:'white'
      }}
    >
      <img
        src={logo}
        style={{
          marginTop: "26px",

          width: "112px",
          height: "35px",
          paddingLeft: "7px",
          marginBottom: "20px",
        }}
      />
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "15px",backgroundColor: '#FAFAFA' }}
      >
        <SponsorPlanDropdown options={plans} placeHolder="Select" />
        <span className="title" style={{ marginTop: "6px" }}>
          Plan Name
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
            width: "196px",
            height: "77px",
            backgroundColor: '#FAFAFA'
          }}
        >
          <span className="value">401KMLPMLLC</span>
          <span className="title" style={{ marginTop: "6px" }}>
            Plan ID
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
            width: "196px",
            height: "77px",
            backgroundColor: '#FAFAFA'
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <i class="fas fa-check-circle" style={{ color: "#219653" }}></i>
            <span
              className="value"
              style={{ color: "#219653", marginLeft: "5px" }}
            >
              Active
            </span>
          </div>
          <span className="title" style={{ marginTop: "6px" }}>
            Plan Status
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
            width: "196px",
            height: "77px",
            backgroundColor: '#FAFAFA'
          }}
        >
          <span className="value">$ 253.73 M</span>
          <span className="title" style={{ marginTop: "6px" }}>
            Total plan balance
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
            width: "196px",
            height: "77px",
            backgroundColor: '#FAFAFA'
          }}
        >
          <span className="value">$ 53.73 M</span>
          <span className="title" style={{ marginTop: "6px" }}>
            Vested balance
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px",
          backgroundColor: '#FAFAFA'
        }}
      >
        <span style={{ color: "#4F4F4F", fontWeight: "500", fontSize: "14px" }}>
          Forfieture balance
        </span>
        <span className="value">$ 16.45 K</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px",
          backgroundColor: '#FAFAFA'
        }}
      >
        <span style={{ color: "#4F4F4F", fontWeight: "500", fontSize: "14px" }}>
          Contribution rate
        </span>
        <span className="value">3.2%</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px",
          backgroundColor: '#FAFAFA'
        }}
      >
        <span style={{ color: "#4F4F4F", fontWeight: "500", fontSize: "14px" }}>
          Total Employees
        </span>
        <span className="value">967</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px 60px 15px 15px",
          alignItems:'center'
        }}
      >
        <div style={{ width: "116px", height: "116px" }}>
          <DoughnutEmployeeChart />
        </div>
        <div>
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#2F80ED" }}></div>
            <div className="tabs-text">Enrolled</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}650
            </div>
          </div>
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#27AE60" }}></div>
            <div className="tabs-text">Eligible</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}190
            </div>
          </div>
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#EB5757" }}></div>
            <div className="tabs-text">Opted Out</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}50
            </div>
          </div>
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#BDBDBD" }}></div>
            <div className="tabs-text">Ineligible</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorFieldview;
