import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  Button,
  Image,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import { ssnMasking, usDateFormat } from "../../../../../shared/utils";
import { get, toLower } from "lodash";
import { FormControlSearch } from "../../../../../shared/components";
import { deleteTempEmployeeById, getAllRecords } from "../../../../services";
import AddToolTip from "../../../../../shared/components/AddToolTip";
const AllRecordReports = (props) => {
  const { fileId, onClick, toggleUseEffect } = props;
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [recordToDelete, setRecordToDelete] = useState({});
  const [filteredValues, setFilteredValues] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [toggle, setToggle] = useState(true);
  useEffect(() => {
    getAllRecords(fileId).then((response) => {
      setAllRecords(response);
      setFilteredValues(response);
      console.log(response, "ALL RECORDS", fileId);
    });
  }, [toggle]);
  const removeOne = (item) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilteredValues(
      allRecords.filter((item) => {
        return (
          toLower(item.ssn).replace(/-/g, "").indexOf(toLower(val)) !== -1 ||
          toLower(item.employeeName).indexOf(toLower(val)) !== -1
        );
      })
    );
  };

  const onDeleteConfirmClick = () => {
    const id = get(recordToDelete, "id");
    deleteTempEmployeeById(id).then((response) => {
      toggleUseEffect();
      setToggle(!toggle);
    });

    setIsModalOpen(false);
    setRecordToDelete({});
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setRecordToDelete({});
  };

  return (
    <div>
      <div className="search-bar-warning-page">
        <Form>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text className="plan-search-button">
                <Image src="/assets/icons/svg/search.svg" width="14px" />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControlSearch
              type="search"
              placeholder="Search SSN or Employee Name"
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Form>
      </div>
      <Row className="error-types-box font-weight-500">
        <Col md="2">Social Security Number </Col>
        <Col md="2">Employee name </Col>
        <Col md="2">Pay date</Col>
        <Col md="5">Status</Col>
        <Col md="1">Action</Col>
      </Row>
      {filteredValues.map((data, index) => (
        <Row className="error-types-box font-weight-400" key={index}>
          <Col md="2" className="align-self-center grey-text">
            {ssnMasking(data.ssn)}
          </Col>
          {data.employeeName.length >= 30 ? (
            <Col md="2" className="align-self-center grey-text">
              <AddToolTip
                className="short-desc"
                name={data.employeeName}
                placement="bottom"
              >
                {(data.employeeName || "").slice(0, 30)}...
              </AddToolTip>
            </Col>
          ) : (
            <Col md="2" className="align-self-center grey-text">
              {data.employeeName}
            </Col>
          )}
          <Col md="2" className="align-self-center grey-text">
            {usDateFormat(data.payDate.split("T")[0])}
          </Col>
          <Col md="5" className="align-self-center black-text">
            {!(data.errorCount || data.warningCount) ? (
              <span className="grey-text font-weight-500">No Errors</span>
            ) : (
              <div>
                <span className="error-text font-weight-500">
                  {data.errorCount}
                </span>{" "}
                <span className="font-weight-500">Errors</span> |{" "}
                <span className="pending-text font-weight-500">
                  {data.warningCount}
                </span>{" "}
                <span className="font-weight-500">Warnings</span>
              </div>
            )}
          </Col>
          <Col md="1" className="align-self-center">
            <div className="d-flex justify-content-between">
              <div
                className="link-text"
                onClick={() => onClick(allRecords, data.id)}
              >
                view
              </div>
              <div onClick={() => removeOne(data)}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  size="sm"
                  color="#ff0000"
                  className="pointer"
                />
              </div>
            </div>
          </Col>
        </Row>
      ))}
      <div className="no-found">
        {filteredValues.length > 0 ? "" : "No records found"}
      </div>
      <Modal show={isModalOpen} onHide={handleClose}>
        <Modal.Body style={{ borderTop: "5px solid #f94f50" }}>
          <div className="text-right">
            <FontAwesomeIcon
              icon={faTimes}
              color="#000"
              onClick={handleClose}
            />
          </div>
          <div className="d-flex">
            <div className="pd-15">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                color="#f94f50"
                size="3x"
              />
            </div>
            <div className="remove-text">
              <h4>Delete Employee ?</h4>
              <p>
                You are attempting to delete employee from file. Do you wish to
                Delete ?
              </p>
              <div>{ssnMasking(get(recordToDelete, "ssn", ""))}</div>
              <div>{get(recordToDelete, "employeeName", "")}</div>
              {recordToDelete.errors === "" ? (
                <span className="grey-text mb-10">No Errors</span>
              ) : (
                <div>
                  <span className="error-text">
                    {get(recordToDelete, "errorCount", "")}
                  </span>{" "}
                  Errors |{" "}
                  <span className="error-text">
                    {get(recordToDelete, "warningCount", "")}
                  </span>{" "}
                  Warnings
                </div>
              )}
              <br />
              <Button
                className="remove-btn mr-4"
                onClick={onDeleteConfirmClick}
              >
                Delete
              </Button>
              <Button className="cancel-btn" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllRecordReports;
