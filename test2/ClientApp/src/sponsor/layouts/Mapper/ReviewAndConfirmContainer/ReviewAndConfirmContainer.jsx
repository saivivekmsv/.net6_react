import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import RACTile from "./RACTile";
import "./sample.css";
import { MANAGE_MAPPER_ROUTES } from "../../../../shared/utils"

const ReviewAndConfirmContainer = (props) => {
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Confirm",
      variant: "primary",
      type: "submit",
    },
  ];

  return (
    <ManageMapperLayout buttons={buttons}>
      <div
        style={{ marginTop: "3.125rem" }}
        className="mapper-raccontainer-grid"
      >
        <RACTile
          tileRoute={`${MANAGE_MAPPER_ROUTES.SOURCE}`}
          title="Source"
          height="9.188rem"
        >
          <div>Database Table</div>
          <div>Table Name</div>
        </RACTile>

        <RACTile tileRoute={`${MANAGE_MAPPER_ROUTES.TARGET}`} title="Target">
          <div>File</div>
          <div>JSON</div>
        </RACTile>

        <RACTile tileRoute={`${MANAGE_MAPPER_ROUTES.RULESET}`} title="Ruleset">
          <div>Core combined ruleset</div>
        </RACTile>

        <RACTile
          tileRoute={`${MANAGE_MAPPER_ROUTES.MAP_AND_TRANSFORM}`}
          title="Map & Transform"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <div style={{ fontSize: "14px" }}>Source Fields</div>
              <div
                style={{
                  fontSize: "24px",
                  color: "orange",
                  marginBottom: "1.563rem",
                }}
              >
                60
              </div>
            </div>
            <div>
              <div style={{ fontSize: "14px" }}>Mapped Fields</div>
              <div style={{ fontSize: "24px", color: "green" }}>50</div>
            </div>
            <div>
              <div style={{ fontSize: "14px" }}>Transformed</div>
              <div style={{ fontSize: "24px", color: "purple" }}>5</div>
            </div>
          </div>
        </RACTile>

        <RACTile
          tileRoute={`${MANAGE_MAPPER_ROUTES.SCHEDULER}`}
          title="Schedule"
        >
          <div style={{ fontSize: "12px", color: "grey" }}>Import via</div>
          <div style={{ fontSize: "14px", marginBottom: "1.563rem" }}>FTP</div>
          <div style={{ fontSize: "12px", color: "grey" }}>Frequency</div>
          <div style={{ fontSize: "14px" }}>Every hour</div>
        </RACTile>
      </div>
    </ManageMapperLayout>
  );
};

export default ReviewAndConfirmContainer;
