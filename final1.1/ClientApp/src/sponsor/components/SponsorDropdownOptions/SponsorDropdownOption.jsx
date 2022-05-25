import React from "react";

const SponsorDropdownOption = (props) => {
  return (
    props.screen === "home" ?
      <div className="disp-flex-col">
        <div className="title w90 marg-bottom-6">{props.title}</div>
        <div className="value ">{props.value}</div>
      </div>
      : <div className="disp-flex-col">
        <div className="value marg-bottom-6">{props.value}</div>
        <div className="title w90">{props.title}</div>
      </div>

  );
};

export default SponsorDropdownOption;
