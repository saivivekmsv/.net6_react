import React, { Profiler } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import SponsorSecondaryButton from "../SponsorSecondaryButton/SponsorSecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import SponsorFieldview from "../SponsorClassificationCard/SponsorFieldview";
import { RadialGauge } from "@progress/kendo-react-gauges";

const SponsorEmployeeRetirementReadinessCard = (props) => {
  const radialOptions = {
    value: value,
    shape: "arrow",
    rangeLineCap: "round",
    scale: {
      labels: {
        visible: false,
      },
      majorTicks: {
        visible: false,
      },
      minorTicks: {
        visible: false,
      },
      max: 100,
      startAngle: 0,
      endAngle: 180,
      rangeSize: 10,
      ranges: [
        {
          from: 0,
          to: 10,
          color: "#EB57574D",
        },
        {
          from: 10,
          to: 40,
          color: "#F2994A4D",
        },
        {
          from: 40,
          to: 70,
          color: "#F2C94C",
        },
        {
          from: 70,
          to: 90,
          color: "#27AE604D",
        },
        {
          from: 90,
          to: 100,
          color: "#2196534D",
        },
      ],
    },
  };
  const value = 64.3;
  return (
    <div className="d-flex flex-column retirement-readiness-card">
      <div className="heading m-3 p-3 border-bottom">Retirement Readiness</div>
      <div className="d-flex flex-row justift-content-between">
        <div>
          <RadialGauge
            {...radialOptions}
            className="m-3"
            style={{ width: "202px", height: "111px" }}
            pointer={{ value: value }}
          />
          <div className="m-3 d-flex flex-column">
            <div className="d-flex justify-content-center">
              <span className="value">{value}</span>
              <span className="title">/100</span>
            </div>
            <div className="value d-flex justify-content-center">
              Good Score
            </div>
          </div>
        </div>
        <SponsorFieldview
          className="justify-content-start p-3 age"
          title1={"Target Age"}
          value1={60}
        />
      </div>
      <Container>
        <Row className="d-flex flex-row justify-content-center p-3">
          <Col>
            <SponsorFieldview
              title1={"Target Monthly Income"}
              value1={"$ 6,670.56"}
            />
          </Col>
          <Col>
            <SponsorFieldview
              title1={"Est. Monthly Income"}
              value1={"$ 4,289.17"}
            />
          </Col>
        </Row>
        <Row className="d-flex flex-row justify-content-center p-3">
          <Col>
            <SponsorFieldview
              title1={"Retirement Goal"}
              value1={"$ 1,900,000.00"}
            />
          </Col>
          <Col>
            <SponsorFieldview
              title1={"Saved For Retirement"}
              value1={"$ 45,873.22"}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SponsorEmployeeRetirementReadinessCard;
