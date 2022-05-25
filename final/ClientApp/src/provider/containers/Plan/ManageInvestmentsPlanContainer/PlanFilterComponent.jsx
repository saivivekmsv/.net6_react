import React from "react";
import { Row, Col, InputGroup } from "react-bootstrap";
import { faSearch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControlSearch, Select } from "../../../components";
import { OPTIONS_DATA_MAPPER } from "../../../utils";

const PlanFilterComponent = ({
  handleSearchChange,
  handleInvestmentTypeChange,
  handleInvestmentStatusChange,
  investmentCount,
  investmentType,
  investmentStatus,
  investmentTypeOptions = [],
  investmentStatusOptions = [],
}) => {
  const investments = investmentCount > 0 && `${investmentCount} investments`;
  return (
    <Row className="mb-3 align-items-center">
      <Col>
        <InputGroup className="small-input-grp">
          <FormControlSearch
            type="search"
            placeholder=""
            onChange={handleSearchChange}
          />
          <InputGroup.Append>
            <InputGroup.Text className="plan-search-button">
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Col>
      <Col>
        <Select
          title={`Type: ${
            !investmentType
              ? "All"
              : OPTIONS_DATA_MAPPER.INVESTMENT_TYPES[investmentType]
          }`}
          optionsList={investmentTypeOptions}
          className="bg-transparent p-0 no-caret"
          onClick={handleInvestmentTypeChange}
          value={investmentType}
        />
      </Col>
      <Col>
        <Select
          title={`Status: ${
            !investmentStatus
              ? "All"
              : OPTIONS_DATA_MAPPER.INVESTMENT_STATUS[investmentStatus]
          }`}
          optionsList={investmentStatusOptions}
          className="bg-transparent p-0 no-caret"
          onClick={handleInvestmentStatusChange}
          value={investmentStatus}
        />
      </Col>
      <Col>{investments}</Col>
    </Row>
  );
};

export default PlanFilterComponent;
