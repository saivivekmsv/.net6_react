import React from "react";
import "../../styles/components/SponsorCard.scss";
const SponsorFieldview = (props) => {
  return (
    <div className={`disp-flex-col ${props.className}`}>
      <div className="title marg-bottom-6">{props.title1}</div>
      <div className="flex-row">
        <div className="value">{props.value1}</div>
        <span className="tag">{props.tag}</span>
      </div>
    </div>
  );
};

export default SponsorFieldview;
