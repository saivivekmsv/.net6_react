import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import SponsorEmployeeLoanCard from "../../components/SponsorEmployeeLoanCard/SponsorEmployeeLoanCard";
import SponsorEmployeePlanSummaryCard from "../../components/SponsorEmployeePlanSummaryCard/SponsorEmployeePlanSummaryCard";
import SponsorEmployeeRetirementReadinessCard from "../../components/SponsorEmployeeRetirementReadinessCard/SponsorEmployeeRetirementReadinessCard";
import SponsorEmployeeSummaryCard from "../../components/SponsorEmployeeSummaryCard/SponsorEmployeeSummaryCard";
import SponsorEmployeeTransactionRequestsCard from "../../components/SponsorEmployeeTransactionRequestsCard/SponsorEmployeeTransactionRequestsCard";
import SponsorEmployeeTransactionsCard from "../../components/SponsorEmployeeTransactionsCard/SponsorEmployeeTransactionsCard";
import SponsorEmploymentDetailsCardView from "../../components/SponsorEmploymentDetailsCardView/SponsorEmploymentDetailsCardView";

const plans = [
  {
    name: "401k CORE Netflix",
    amount: "$ 45,873.22",
    id: "401KCORENF",
    category: "Regular",
    type: "401(B)",
  },
  {
    name: "IRA CORE KATNF",
    amount: "$ 15,361.68",
    id: "IRACKATNF",
    category: "Regular",
    type: "IRA",
  },
];

const SponsorEmployeeSummaryContainer = (data) => {
  return (
    <Container
      style={{
        backgroundColor: "#E0E0E0",
        width: "1240px",
        height: "fit-content",
        padding: "none",
        margin: "none",
      }}
    >
      <Row>
        <SponsorEmployeeSummaryCard />
      </Row>
      <Row>
        <Col>
          <SponsorEmploymentDetailsCardView />
        </Col>
        <Col>
          <Row>
            <SponsorEmployeePlanSummaryCard data={plans[0]} className="w-100" />
          </Row>
          <Row className="mt-3">
            <SponsorEmployeePlanSummaryCard data={plans[1]} className="w-100" />
          </Row>
        </Col>
        <Col>
          <SponsorEmployeeTransactionsCard />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <SponsorEmployeeRetirementReadinessCard />
        </Col>
        <Col className="p-0">
          <SponsorEmployeeLoanCard />
        </Col>
        <Col>
          <SponsorEmployeeTransactionRequestsCard />
        </Col>
      </Row>
    </Container>
  );
};

export default SponsorEmployeeSummaryContainer;
