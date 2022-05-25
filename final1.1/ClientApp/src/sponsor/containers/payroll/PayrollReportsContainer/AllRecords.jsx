import React, { useState } from "react";
import { Row, Col, Form, InputGroup, Image } from "react-bootstrap";
import { get, toLower } from "lodash";
import {
  FormControlSearch,
  ExcelNameExport,
  SliderPanel,
} from "../../../../shared/components";
import { ssnMasking } from "../../../../shared/utils";
import EditContribution from "./EditContribution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { allRecordReport } from "./constant";

const AllRecords = ({ data }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const PayrollReport = get(data, "AllRecords", []);
  const [filteredValues, setFilteredValues] = useState(PayrollReport);
  const [selectedList, setSelectedList] = useState();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilteredValues(
      PayrollReport.filter((item) => {
        return (
          toLower(item.ssn).replace(/-/g, "").indexOf(toLower(val)) !== -1 ||
          toLower(item.employeeName).indexOf(toLower(val)) !== -1
        );
      })
    );
  };

  const onViewButtonClick = (id) => {
    const selected = PayrollReport.filter((item) => {
      return id === item.id;
    });
    setSelectedList(selected);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-center">
        <div className="search-bar">
          <Form>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text className="plan-search-button">
                  <Image src="/assets/icons/svg/search.svg" width="14px" />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControlSearch
                type="search"
                placeholder="Search SSN or employee"
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Form>
        </div>
        <div>
          <ExcelNameExport
            headers={allRecordReport}
            data={PayrollReport}
            fileName={"all_records.xls"}
            name="All Records"
          />
        </div>
      </div>
      <Row className="all-records">
        <Col md="3">Social Security Number</Col>
        <Col md="3">Employee name</Col>
        <Col md="2">Plan ID</Col>
        <Col md="2">Pay date</Col>
        <Col md="2">Action</Col>
      </Row>
      {filteredValues.map((records, index) => (
        <Row className="all-records-inner" key={index}>
          <Col md="3">{ssnMasking(records.ssn)}</Col>
          <Col md="3">{records.employeeName}</Col>
          <Col md="2">{records.planId}</Col>
          <Col md="2">{records.paydate}</Col>
          <Col
            md="2"
            className="link-text"
            onClick={() => onViewButtonClick(records.id)}
          >
            view
          </Col>
        </Row>
      ))}
      <SliderPanel
        isOpen={isModalOpen}
        size="35"
        showCancel={false}
        backdropClicked={() => setModalOpen(false)}
      >
        <div className="d-flex justify-content-between align-baseline">
          <div>
            <p>Payroll Contributions</p>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setModalOpen(false)}
              className="pointer"
            />
          </div>
        </div>
        <div className="bb-1" />
        <div className="scroll-body">
          <EditContribution data={selectedList} />
        </div>
      </SliderPanel>
    </div>
  );
};

export default AllRecords;
