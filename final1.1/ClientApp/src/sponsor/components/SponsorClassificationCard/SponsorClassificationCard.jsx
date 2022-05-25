import React from "react";
import SponsorCard from "../SponsorCards/SponsorCard";
const SponsorClassificationCard = ({ data, onClick }) => {
  return (
    <div
      className="sponsor-card-container classification-card"
      onClick={onClick}
    >
      {data?.map((item, index) => (
        <SponsorCard title={item.label} value={item.value} />
      ))}
    </div>
  );
};

export default SponsorClassificationCard;
