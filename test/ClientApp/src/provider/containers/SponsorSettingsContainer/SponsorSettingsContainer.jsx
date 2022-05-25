import React, { useState } from "react";
import { Button, Col, ListGroup, Row, Tab } from "react-bootstrap";
import SponsorFieldview from "../../components/SponsorClassificationCard/SponsorFieldview";

const SponsorSettingsContainer = (data) => {
  return (
    <>
      <div className="emp-classification">
        <div className="flex-row space-between border-bot">
          <div className="ft-20 fw-500">Settings</div>
          <Button className="edit-button">Edit</Button>
        </div>
        <div className="marg-top-30" style={{ marginLeft: "20px" }}>
          <div className="classification-inner-box">
            <div className="disp-flex-col">
              <SponsorFieldview
                title1="Mode of hours submission"
                value1="Pay Period"
              />
              <SponsorFieldview
                title1="Mode of Compensation"
                value1="Pay Period"
              />
              <SponsorFieldview title1="Payroll Calendar" value1="Yes" />
              <SponsorFieldview
                title1="Census and payroll file generation required?"
                value1="Yes"
              />
              <SponsorFieldview
                title1="Mode of Funding "
                value1="ACH Credit/Wire"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SponsorSettingsContainer;
