import React from "react";
import { Row, Col, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-light-svg-icons";
import { FormControlSearch, Select } from "../../../components";
import { OPTIONS_DATA_MAPPER } from "../../../utils";

const MasterFilterComponent = ({
  onAddSelectedPlan,
  handleSearchChange,
  handleInvestmentTypeChange,
  handleInvestmentStatusChange,
  investmentCount,
  investmentType,
  investmentStatus,
  investmentTypeOptions = [],
  investmentStatusOptions = [],
  isAnySelected,
}) => {
  const investments = investmentCount > 0 && `${investmentCount} investments`;
  return (
    <Row className="mb-3 align-items-center">
      <Col md={3}>
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
      <Col md={3} className="text-right">
        <Button
          type="button"
          onClick={onAddSelectedPlan}
          disabled={!isAnySelected}
        >
          Add Selected To Plan
        </Button>
      </Col>
    </Row>
  );
};

export default MasterFilterComponent;
