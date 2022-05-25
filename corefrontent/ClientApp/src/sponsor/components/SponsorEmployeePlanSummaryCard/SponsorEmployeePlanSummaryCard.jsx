import React, { Profiler } from "react";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import SponsorSecondaryButton from "../SponsorSecondaryButton/SponsorSecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import SponsorFieldview from "../SponsorClassificationCard/SponsorFieldview";

const SponsorEmployeePlanSummaryCard = ({ data, className }) => {
  return (
    <div className={`d-flex flex-column plan-summary-container ${className}`}>
      <div className="m-3 pb-3 mb-0 card-title-container">
        <span className="heading">{data?.name}</span>
        <span className="heading">{data?.amount}</span>
      </div>
      <div className="mb-3 card-content">
        <SponsorFieldview
          className="p-3 card-item"
          title1={"Plan ID"}
          value1={data?.id}
        />
        <SponsorFieldview
          className="p-3 card-item"
          title1={"Category"}
          value1={data?.category}
        />
        <SponsorFieldview
          className="p-3 card-item"
          title1={"Type"}
          value1={data?.type}
        />
      </div>
    </div>
  );
};

export default SponsorEmployeePlanSummaryCard;
