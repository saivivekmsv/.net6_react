import React from "react";
import { Link } from "react-router-dom";

const SponsorCard = (props) => {
  return (
    <div className="Sponsor-Card">
      {props.type == "img" ? (
        <div style={{ padding: "1.875rem 0rem 1.875rem 1.25rem" }}>
          <img
            src={props.image}
            style={{ width: "6.438rem", height: "2rem" }}
          />
        </div>
      ) : null}
      <p className="title">{props.title}</p>
      {props.type == "link" ? (
        <p className="value">
          <Link>{props.value}</Link>
        </p>
      ) : (
        <p className="value">{props.value}</p>
      )}
    </div>
  );
};

export default SponsorCard;
