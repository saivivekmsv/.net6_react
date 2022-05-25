import React from "react";
import { Row, Col } from "react-bootstrap";
import "../../styles/components/SponsorLoanInformationCard.scss"

const SponsorLoanInformationCard = (props) => {
  return (


    <div className="tile-with-border">
      <div className="tile-title">
        Loan Information
      </div>

      <Row className="pad-right-20">
        <Col md={5} className="tile-alt-with-border d-flex flex-column offset-1 align-center">
          <span className="loan-value">$ 1.62 M</span>
          <span className="loan-title">Total loan amount</span>
        </Col>
        <Col md={5} className="tile-alt-with-border d-flex flex-column offset-1 align-center">
          <span className="loan-value">$ 10.21 K</span>
          <span className="loan-title">Avg. loan amount</span>
        </Col>
      </Row>
      <Row className='ml-1'>
        <Col md={6}>
          <span className="loan-count-title">No. of delinquint</span>
          <span className="loan-count">09</span>
        </Col>
        <Col md={6}>
          <span className="loan-count-title">Active loans</span>
          <span className="loan-count">160</span>
        </Col>
      </Row>
    </div>

  );
};

export default SponsorLoanInformationCard;
