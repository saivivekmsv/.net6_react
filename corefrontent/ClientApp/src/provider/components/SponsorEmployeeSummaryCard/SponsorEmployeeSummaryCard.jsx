import React, { Profiler } from "react";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import SponsorSecondaryButton from "../SponsorSecondaryButton/SponsorSecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import SponsorFieldview from "../SponsorClassificationCard/SponsorFieldview";

const SponsorEmployeeSummaryCard = (props) => {
  return (
    <div className="sponsor-employee-summary-card m-3">
      <SponsorSecondaryButton className="sponsor-employee-back">
        Back
      </SponsorSecondaryButton>
      <div className="sponsor-employee-profile">
        <Image src="/logo512.png" className="image"></Image>
        <div className="ellipse" />
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="status-icon"
          color="#61A637"
          size="sm"
        ></FontAwesomeIcon>
      </div>
      <div className="name-container">
        <span className="card-name heading">Kevin Alfred Thomas</span>
        <SponsorFieldview
          className="employee-id"
          title1={"Employee Id"}
          value1={"1001"}
        ></SponsorFieldview>
      </div>
      <span className="vertical-line" />
      <SponsorFieldview
        className="ssn"
        title1={"SSN"}
        value1={"AAA-XX-1234"}
      ></SponsorFieldview>
      <SponsorFieldview
        className="dob"
        title1={"D.O.B"}
        value1={"08/23/1989 (33 Y)"}
      ></SponsorFieldview>
      <span className="vertical-line" />
      <SponsorFieldview
        className="email"
        title1={"E-mail ID"}
        value1={"kevin.thomas@netflix.com"}
      ></SponsorFieldview>
      <Button className="create-button view-button">View All Details</Button>
    </div>
  );
};

export default SponsorEmployeeSummaryCard;
