import React, { useState } from "react";
import SponsorCard from "../../components/SponsorCards/SponsorCard";
import { usDateFormat } from "../../utils";

const EmployeeHistoryCard = (props) => {
  return (
    <>
      <div>
        <div className="card-container">
          <SponsorCard value="Email" title="Field edited" type="text" />
          <SponsorCard
            value="willam99bark@gmail.com"
            title="Previous value"
            type="text"
          />
          <SponsorCard
            value="willam34bark@gmail.com"
            title="Updated value"
            type="text"
          />
          <SponsorCard
            value="Added through File AC"
            title="Comment"
            type="text"
          />
        </div>
        <div className="card-container">
          <SponsorCard value="Mobile no." title="Field edited" type="text" />
          <SponsorCard
            value="679-567-4567"
            title="Previous value"
            type="text"
          />
          <SponsorCard value="867-545-6454" title="Updated value" type="text" />
          <SponsorCard value="-" title="Comment" type="text" />
        </div>
      </div>
    </>
  );
};

export default EmployeeHistoryCard;
