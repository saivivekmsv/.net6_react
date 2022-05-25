import React from "react";

import { Link } from "react-router-dom";
// import empPhoto from "assets/employeePhoto.jpeg";
import {GetInitials} from "../../components";

const SponsorEmployeeCard = (props) => {
  console.log(props)
  return (
    <div className="flex-row sponsor-employee-card-container ">
      {props.empStatus === "enrolled" ? (
        <div className="employee-card-line enrolled"></div>
      ) : props.empStatus === "eligible"  ? (
        <div className="employee-card-line eligible"></div>
      ) : props.empStatus === "ineligible" ? (
        <div className="employee-card-line ineligible"></div>
      ) : props.empStatus === "optedout" ? (
        <div className="employee-card-line optedout"></div>
      ) : props.empStatus === "terminated" ? (
        <div className="employee-card-line terminated"></div>
      ) : null}

      <div className="sponsor-employee-card">
        <div
          className="disp-flex-col "
          style={{
            textAlign: "center",
            borderRight: "1px solid #e0e0e0",
            paddingRight: "10px",
            width: "129px",
          }}
        >
          <div className="employee-photo">
            {props.image ? <img alt="pic"
              src={props.image}
              style={{ width: "67px", height: "67px", borderRadius: "50%" }}
            /> :  <GetInitials name={props.name} className="initialsCustom"/>}
          </div>
          <div className="employee-name marg-top-5">{props.name}</div>
        </div>
        <div
          className="disp-flex-col"
          style={{ paddingLeft: "10px", justifyContent: "space-between" }}
        >
          <div className="flex-row">
            <div className="employee-card-title">Emp id</div>
            <div className="employee-name">{props.EmpId}</div>
          </div>
          <div className="flex-row ">
            <div className="employee-card-title">SSN</div>
            <div className="employee-card-value">{props.SSN}</div>
          </div>
          <div className="flex-row ">
            <div className="employee-card-title">Status</div>
            <div className="employee-card-value">{props.status}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorEmployeeCard;
