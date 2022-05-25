import React from "react";
import "../../styles/components/SponsorCard.scss";
const SponsorFieldview = (props) => {
  return (
    <div className="disp-flex-col marg-top-20">
      <div className="title amrg-bottom-6">{props.title1}</div>
      <div className="value">{props.value1}</div>
    </div>
  );
};

export default SponsorFieldview;
