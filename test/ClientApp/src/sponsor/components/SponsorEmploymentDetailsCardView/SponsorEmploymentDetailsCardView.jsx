import React from "react";
import SponsorFieldview from "../SponsorClassificationCard/SponsorFieldview";

const fields = [
  {
    id: "hireDate",
    label: "Hire Date",
    mockValue: "05/17/2020",
  },
  {
    id: "division",
    label: "Division",
    mockValue: "Design, Interactive Experiences (IE)",
  },
  {
    id: "employeeType",
    label: "Employee Type",
    mockValue: "Executive Officer",
  },
  {
    id: "location",
    label: "Location",
    mockValue: "Los Gatos, California, USA",
  },
  {
    id: "union",
    label: "Union",
    mockValue: "ID Fellows",
  },
];

const SponsorEmploymentDetailsCardView = (props) => {
  return (
    <div className="d-flex flex-column sponsor-employee-summary-card">
      <span className="heading card-title m-3 p-3 border-bottom">
        Employment Details
      </span>
      {fields.map((field) => (
        <SponsorFieldview
          className="ml-3 pl-3 pb-2"
          title1={field.label}
          value1={field.mockValue}
        />
      ))}
    </div>
  );
};

export default SponsorEmploymentDetailsCardView;
