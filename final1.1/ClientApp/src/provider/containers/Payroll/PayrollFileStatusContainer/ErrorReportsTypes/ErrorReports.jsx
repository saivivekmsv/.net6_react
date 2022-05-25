import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  Button,
  Image,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import { useHistory } from "react-router-dom";
import { FormControlSearch } from "../../../../components";
import {
  ssnMasking,
  usDateFormat,
  DateFormat,
  MANAGE_PAYROLL_ROUTES,
} from "../../../../utils";
import { get, toLower } from "lodash";
import { getErrorsInECR, deleteTempEmployeeById } from "../../../../services";
const ErrorReports = (props) => {
  const { fileId, onClick, toggleUseEffect } = props;
  const history = useHistory();
  const [errorRecords, setErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [recordToDelete, setRecordToDelete] = useState({});
  const [filteredValues, setFilteredValues] = useState([]);
  const [toggle, setToggle] = useState(true);
  useEffect(() => {
    getErrorsInECR(fileId).then((response) => {
      setErrors(response);
      setFilteredValues(response);
      console.log(response, "ERROR RECORDS FROM ERROR RECIRDS", fileId);
    });
  }, [toggle]);

  const removeOne = (item) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilteredValues(
      errorRecords.filter((item) => {
        return (
          toLower(item.ssn).replace(/-/g, "").indexOf(toLower(val)) !== -1 ||
          toLower(item.employeeName).indexOf(toLower(val)) !== -1
        );
      })
    );
  };

  const onDeleteConfirmClick = () => {
    const id = get(recordToDelete, "id");
    // setFilteredValues(
    //   filteredValues.filter((item) => {
    //     return toLower(item.ssn) !== selectedSsn;
    //   })
    // );
    deleteTempEmployeeById(id).then((response) => {
      toggleUseEffect();
      setToggle(!toggle);
    });
    var idLength = errorRecords.length;
    console.log("id", errorRecords.length);
    if (idLength == 1) {
      setIsModalOpen(false);
      history.push({
        pathname: MANAGE_PAYROLL_ROUTES.UPLOADED_FILES_LISTING,
      });
    } else {
      setIsModalOpen(false);
      setRecordToDelete({});
    }
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
        <Col md="5">Errors</Col>
        <Col md="1">Action</Col>
      </Row>
      {filteredValues.map((error, index) => (
        <Row className="error-types-box font-weight-400" key={index}>
          <Col md="2" className="align-self-center grey-text">
            {ssnMasking(error.ssn)}
          </Col>
          {error.employeeName.length >= 30 ? (
            <OverlayTrigger overlay={<Tooltip>{error.employeeName}</Tooltip>}>
              <Col md="2" className="align-self-center grey-text">
                {(error.employeeName || "").slice(0, 30)}...
              </Col>
            </OverlayTrigger>
          ) : (
            <Col md="2" className="align-self-center grey-text">
              {error.employeeName}
            </Col>
          )}
          <Col md="2" className="align-self-center grey-text">
            {DateFormat(error.paydate.split("T")[0], "-")}
          </Col>
          <Col md="5" className="align-self-center grey-text">
            {error.employeeErrors.map((code, i) => (
              <div className="black-text font-weight-500 mb-10">
                <span className="font-weight-250 grey-text">
                  {code.messageCode}
                </span>
                {` - ${code.messageDescCode}`}
              </div>
            ))}
          </Col>
          <Col md="1" className="align-self-center">
            <div className="d-flex justify-content-between">
              {console.log("employee id", error.id)}
              <div
                className="link-text"
                onClick={() => onClick(errorRecords, error.id)}
              >
                view
              </div>

              <div onClick={() => removeOne(error)}>
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
        {filteredValues.length > 0 ? "" : "No errors found"}
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

export default ErrorReports;
