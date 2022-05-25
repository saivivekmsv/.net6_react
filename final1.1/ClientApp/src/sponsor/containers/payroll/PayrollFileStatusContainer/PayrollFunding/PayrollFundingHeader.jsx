import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Select } from "../../../../../shared/components";

const PayrollFundingHeader = ({
  title,
  subtitle,
  onClick,
  handleChange,
  mockOptions = [],
  fileType,
}) => {
  return (
    <>
      <p className="mt-20 payroll-submission-heading">{title}</p>
      <div className="border-top" />
      <div className="d-flex justify-content-between">
        <div className="font-weight-500">{subtitle}</div>
        <div>
          <Button variant="primary" type="submit" onClick={onClick}>
            Submit
          </Button>
        </div>
      </div>
      <Row>
        <Col md="2">
          <p className="ft-12 grey-text">View by</p>
          <Select
            title={`${!fileType ? "All" : fileType}`}
            optionsList={mockOptions}
            className="bg-transparent p-0 no-caret payroll-select mt-10"
            onClick={handleChange}
            value={fileType}
          />
        </Col>
      </Row>
    </>
  );
};

export default PayrollFundingHeader;
