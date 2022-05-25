import {
  faExclamationTriangle,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get, toLower } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Image,
  Tab,
  Nav,
  Modal,
  Button,
  Tabs,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  ErrorsWarnings,
  FileTypeWithExt,
  FormControlSearch,
} from "../../../../shared/components";

import { ssnMasking, usDateFormat, ROUTES } from "shared/utils"
import PayrollCensusDetails from "./PayrollCensusDetails";
import { useRequest } from "../../../../shared/abstracts";
import {
  getErrorAndWarningMetadata,
  getErrorsInECR,
  getWarningsInECR,
  deleteTempEmployeeById,
  getAllRecords,
} from "../../../services";
import upload from "../../../../shared/styles/upload.png";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons";
const ErrorFoundInRecordsContainer = ({
  data,
  fileName,
  empId,
  fileId,
  countDetails,
  recordsListType,
  setErrorPage,
  toggleFileStatus,
  allRecords,
  errors,
}) => {
  const [filteredValues, setFilteredValues] = useState([]);
  const [filteredValuesAllRecords, setFilteredValuesAllRecords] = useState([]);
  const [totalErrors, setTotalErrors] = useState(0);
  const [totalWarnings, setTotalWarnings] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [recordToDelete, setRecordToDelete] = useState({});
  console.log(recordsListType, "recofrds asda");
  // eslint-disable-next-line no-unused-vars
  const [selectTab, setTabIndex] = useState(true);
  const [showIcon, setShowIcon] = useState(0);
  const [employeeId, setEmployeeId] = useState(empId);
  const [errorsAndWarningsInfo, setErrorsAndWarningsInfo] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [toggleAllRecords, setToggleAllRecords] = useState(true);
  const [warnings, setWarnings] = useState(0);

  useEffect(() => {
    getErrorsInECR(fileId).then((response) => {
      setFilteredValues(response);
      console.log(response, "ERROR RECORDS FROM ERROR RECIRDS", fileId);
    });
  }, [toggle]);
  console.log("Filtered values", filteredValues);
  useEffect(() => {
    getAllRecords(fileId).then((response) => {
      setFilteredValuesAllRecords(response);
      console.log(response, "ERROR RECORDS FROM ERROR RECIRDS", fileId);
    });
  }, [toggle]);
  useEffect(() => {
    getWarningsInECR(fileId).then((response) => {
      setWarnings(response);
      console.log(response, "Warning RECORDS FROM ERROR RECIRDS", fileId);
    });
  }, [toggle]);
  console.log("Tot War", totalWarnings);
  useEffect(() => {
    getErrorAndWarningMetadata(employeeId).then((response) => {
      setErrorsAndWarningsInfo(response);
    });
  }, [employeeId]);
  const refresh = () => {
    setToggle(!toggle);
    toggleFileStatus();
  };
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilteredValues(
      errors.filter((item) => {
        return (
          toLower(item.ssn).replace(/-/g, "").indexOf(toLower(val)) !== -1 ||
          toLower(item.employeeName).indexOf(toLower(val)) !== -1
        );
      })
    );
  };

  const handleSearchChangeAll = (e) => {
    const val = e.target.value;
    setFilteredValuesAllRecords(
      allRecords.filter((item) => {
        return (
          toLower(item.ssn).replace(/-/g, "").indexOf(toLower(val)) !== -1 ||
          toLower(item.employeeName).indexOf(toLower(val)) !== -1
        );
      })
    );
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setRecordToDelete({});
  };

  const onPayrollDeleteClick = (item, index) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };
  const onDeleteConfirmClick = () => {
    const id = get(recordToDelete, "id");
    deleteTempEmployeeById(id).then((response) => {
      refresh();
    });
    setIsModalOpen(false);
    setRecordToDelete({});
  };

  const selectedId = (key) => {
    console.log("===key", key);
    const selected = filteredValues.filter((item) => {
      return key === item.id;
    });
    setTabIndex(selected);
    setShowIcon(key);
    // setEmployeeId(key);
  };

  // let filenamadj = fileName.substr(0, 30);
  // const [errorCount] = [countDetails.errorsCount];
  // const totErrsAndWarnings = filteredValues
  //   .map((_) => _.employeeErrors.length)
  //   .reduce((a, b) => a + b, 0);
  // const warningCount = totErrsAndWarnings - errorCount;

  return (
    <div className="file-information">
      <div className="mt-20 payroll-sub-head">
        <div className="mt-20 ft-12 text-black font-weight-500 text-right">
          Total Records {allRecords.length}
          {console.log("totallll", allRecords)}
        </div>
        <span
          onClick={() => {
            setErrorPage(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="500px" color="blue" />
        </span>
        <Tabs
          defaultActiveKey={recordsListType}
          transition={false}
          className="errors-level-tab"
          style={{ borderBottom: "0px" }}
          mountOnEnter
          unmountOnExit
        >
          <Tab eventKey="errors" title={<div>Error Records </div>}>
            <div className="border-top" />
            <div className="d-flex align-items-center justify-content-between py-4">
              <div>
                {/* <FileTypeWithExt fileName={fileName} description="" /> */}
                <OverlayTrigger overlay={<Tooltip>{fileName}</Tooltip>}>
                  <div className="grey-text">
                    {/* {fileName} */}
                    <Image src={upload} className="mr-2" />
                    {fileName}
                  </div>
                </OverlayTrigger>
              </div>
              <div>
                <span className="font-weight-500 ft-12">
                  <span className="pending-text ft-14">
                    {get(countDetails, "warningsCount", 0)}
                  </span>{" "}
                  Warnings
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="font-weight-500 ft-12">
                  <span className="error-text ft-14">
                    {get(countDetails, "errorsCount", 0)}
                  </span>{" "}
                  Errors
                </span>
              </div>
            </div>
            <div className="vertical-tabs">
              <Tab.Container
                defaultActiveKey={0}
                onSelect={selectedId}
                mountOnEnter
                unmountOnExit
              >
                <div className="d-flex w-100">
                  <div className="ssn-search-tabs-navs">
                    <Nav variant="pills" className="flex-column">
                      <div className="search-control-wrapper">
                        <FormControlSearch
                          type="search"
                          placeholder="Search SSN or Employee Name"
                          onChange={handleSearchChange}
                          size="1x"
                        />
                      </div>
                      {filteredValues.map((item, index) => {
                        return (
                          <Nav.Item>
                            <Nav.Link
                              eventKey={index}
                              onClick={() => {
                                setEmployeeId(item.id);
                              }}
                            >
                              <div className="d-flex justify-content-between align-item-center">
                                <div>
                                  <div className="ssn-number">
                                    {ssnMasking(item.ssn)}
                                  </div>
                                  {item.employeeName.length >= 30 ? (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip>{item.employeeName}</Tooltip>
                                      }
                                    >
                                      <div className="employee-name">
                                        {(item.employeeName || "").slice(0, 30)}
                                        ...
                                      </div>
                                    </OverlayTrigger>
                                  ) : (
                                    <div className="employee-name">
                                      {item.employeeName}
                                    </div>
                                  )}
                                  <div className="employee-dob">
                                    {usDateFormat(item.paydate.split("T")[0])}
                                  </div>
                                </div>
                                <div>
                                  {showIcon == index ? (
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      color="#f94f50"
                                      size="1x"
                                      onClick={() =>
                                        onPayrollDeleteClick(item, index)
                                      }
                                    />
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                    </Nav>
                  </div>
                  <div className="ssn-search-tabs-content">
                    <Tab.Content>
                      {filteredValues.map((item, index) => {
                        return (
                          <Tab.Pane eventKey={index}>
                            {console.log("dataaaa", data)}
                            <PayrollCensusDetails
                              data={data}
                              employeeId={employeeId}
                              setErrorPage={setErrorPage}
                              item={item}
                              setIsModalOpen={setIsModalOpen}
                              setRecordToDelete={setRecordToDelete}
                              refresh={refresh}
                            />
                            {console.log(errorsAndWarningsInfo)}
                          </Tab.Pane>
                        );
                      })}
                    </Tab.Content>
                  </div>
                </div>
              </Tab.Container>
            </div>
          </Tab>
          <Tab eventKey="all_records" title={<div>All Records</div>}>
            <div className="border-top" />
            <div className="d-flex align-items-center justify-content-between py-4">
              <div>
                {/* <FileTypeWithExt fileName={fileName} description="" /> */}
                <OverlayTrigger overlay={<Tooltip>{fileName}</Tooltip>}>
                  <div className="grey-text">
                    {/* {fileName} */}
                    <Image src={upload} className="mr-2" />
                    {fileName}
                  </div>
                </OverlayTrigger>
              </div>
              <div>
                <span className="font-weight-500 ft-12">
                  <span className="pending-text ft-14">
                    {get(countDetails, "warningsCount", 0)}
                  </span>{" "}
                  Warnings
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="font-weight-500 ft-12">
                  <span className="error-text ft-14">
                    {get(countDetails, "errorsCount", 0)}
                  </span>{" "}
                  Errors
                </span>
              </div>
            </div>
            <div className="vertical-tabs">
              <Tab.Container
                defaultActiveKey={0}
                onSelect={selectedId}
                mountOnEnter
                unmountOnExit
              >
                <div className="d-flex w-100">
                  <div className="ssn-search-tabs-navs">
                    <Nav variant="pills" className="flex-column">
                      <div className="search-control-wrapper">
                        <FormControlSearch
                          type="search"
                          placeholder="Search SSN or Employee Name"
                          onChange={handleSearchChangeAll}
                          size="1x"
                        />
                      </div>
                      {filteredValuesAllRecords.map((item, index) => {
                        return (
                          <Nav.Item>
                            <Nav.Link
                              eventKey={index}
                              onClick={() => {
                                setEmployeeId(item.id);
                              }}
                            >
                              <div className="d-flex justify-content-between align-item-center">
                                <div>
                                  <div className="ssn-number">
                                    {ssnMasking(item.ssn)}
                                  </div>
                                  <div className="employee-name">
                                    {item.employeeName}
                                  </div>
                                  <div className="employee-dob">
                                    {usDateFormat(item.payDate.split("T")[0])}
                                  </div>
                                </div>
                                {/* <div>
                                  {showIcon == index ? (
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      color="#f94f50"
                                      size="1x"
                                      onClick={() =>
                                        onPayrollDeleteClick(item, index)
                                      }
                                    />                                
                                  ) : (
                                    ""
                                  )}
                                </div> */}
                              </div>
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                    </Nav>
                  </div>
                  <div className="ssn-search-tabs-content">
                    <Tab.Content>
                      {filteredValuesAllRecords.map((item, index) => {
                        return (
                          <Tab.Pane eventKey={index}>
                            <PayrollCensusDetails
                              data={data}
                              employeeId={employeeId}
                              setErrorPage={setErrorPage}
                              item={item}
                              setIsModalOpen={setIsModalOpen}
                              setRecordToDelete={setRecordToDelete}
                              refresh={refresh}
                            />
                          </Tab.Pane>
                        );
                      })}
                    </Tab.Content>
                  </div>
                </div>
              </Tab.Container>
            </div>
          </Tab>
        </Tabs>
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
              <div>
                <div>{ssnMasking(get(recordToDelete, "ssn", ""))}</div>
                <div>{get(recordToDelete, "name", "")}</div>
                <ErrorsWarnings
                  errors={[
                    ...get(errorsAndWarningsInfo, "payrollErrorMessages", []),
                    ...get(errorsAndWarningsInfo, "censusErrorMessages", []),
                  ]}
                  warnings={[
                    ...get(errorsAndWarningsInfo, "payrollWarningMessages", []),
                    ...get(errorsAndWarningsInfo, "censusWarningMessages", []),
                  ]}
                />
              </div>
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

export default ErrorFoundInRecordsContainer;
