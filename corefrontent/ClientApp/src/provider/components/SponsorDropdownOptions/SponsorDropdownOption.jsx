import React from "react";
import "../../styles/components/SponsorCard.scss";
const SponsorDropdownOption = (props) => {
  return (
    <div className="disp-flex-col">
      <div className="value marg-bottom-6">{props.value}</div>
      <div className="title w90">{props.title}</div>
    </div>
  );
};

export default SponsorDropdownOption;
