import React, { useState, useEffect, Component } from "react";
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
import {
  ssnMasking,
  usDateFormat,
  getParamsFromQueryString,
  MANAGE_PAYROLL_ROUTES,
} from "../../../../utils";
import { get, toLower } from "lodash";
import {
  FormControlSearch,
  FormLeaveGuard,
  SliderPanel,
  CsplTable as Table,
} from "../../../../components";
import {
  deleteTempEmployeeById,
  getAllRecords,
  getTempEmployeeDetailsById,
} from "../../../../services";
import AddToolTip from "../../../../components/AddToolTip";
import { useHistory } from "react-router-dom";

const AllRecordReports = (props) => {
  const { fileId, onClick, toggleUseEffect, pendingSubmission } = props;
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [recordToDelete, setRecordToDelete] = useState({});
  const [filteredValues, setFilteredValues] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [isDataValidationModalOpen, setIsDataValidationModalOpen] = useState(
    false
  );
  const [showDirtyCheckModal, setShowDirtyCheckModal] = useState(false);
  //const selectedSaveType="File";
  const [selectedSaveType, setSelectedSaveType] = useState("File");
  const [dataValidationTable, setDataValidationTable] = useState([]);
  // const sourcesApiData = get(state, "api.data.sources", []);
  //const { state, dispatch } = useContext();
  // const sourcesApiData = get(state, "api.data.sources", []);

  useEffect(() => {
    setDataValidationTable(dataValidationTableMock);
  }, []);
  useEffect(() => {
    console.log(dataValidationTable);
  }, [dataValidationTable]);
  const values = ["File", "System"];
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

  const Func = (value, index) => {
    var data = [];
    dataValidationTable.map((row, i) => {
      if (i == index) data.push({ ...row, dataToSave: value });
      else data.push(row);
    });
    setDataValidationTable(data);
  };

  const dataValidationTableHeader = [
    {
      label: "Field Name",
      className: "column-fieldName",
      columnName: "fieldName",
    },
    {
      label: "Error Details",
      className: "column-errorDetails",
      columnName: "errorDetails",
    },
    {
      label: "Data in File",
      className: "column-dataInFile",
      columnName: "dataInFile",
    },
    {
      label: "Data in System",
      className: "column-dataInSystem",
      columnName: "dataInSystem",
    },
    {
      label: "Notifications",
      className: "column-notifications",
      columnName: "notifications",
    },
    {
      label: "Data to Save",
      className: "column-dataToSave",
      columnName: "dataToSave",
    },
  ];

  const dataValidationTableMock = [
    {
      fieldName: "Employment Status",
      errorDetails:
        "Employee’s employment status details received on file is different from that in the system. Please select the employment details you want to save.",
      dataInFile: "",
      dataInSystem: "",
      notifications:
        "Accepting the file data may impact eligibility determination.",
      dataToSave: true,
    },
    {
      fieldName: "Employment Status",
      errorDetails:
        "Employee’s employment status details received on file is different from that in the system. Please select the employment details you want to save.",
      dataInFile: "",
      dataInSystem: "",
      notifications:
        "Accepting the file data may impact eligibility determination.",
      dataToSave: true,
    },
    {
      fieldName: "Employment Status",
      errorDetails:
        "Employee’s employment status details received on file is different from that in the system. Please select the employment details you want to save.",
      dataInFile: "",
      dataInSystem: "",
      notifications:
        "Accepting the file data may impact eligibility determination.",
      dataToSave: true,
    },
    {
      fieldName: "Employment Status",
      errorDetails:
        "Employee’s employment status details received on file is different from that in the system. Please select the employment details you want to save.",
      dataInFile: "",
      dataInSystem: "",
      notifications:
        "Accepting the file data may impact eligibility determination.",
      dataToSave: true,
    },
    {
      fieldName: "Employment Status",
      errorDetails:
        "Employee’s employment status details received on file is different from that in the system. Please select the employment details you want to save.",
      dataInFile: "",
      dataInSystem: "",
      notifications:
        "Accepting the file data may impact eligibility determination.",
      dataToSave: true,
    },
    {
      fieldName: "Employment Status",
      errorDetails:
        "Employee’s employment status details received on file is different from that in the system. Please select the employment details you want to save.",
      dataInFile: "",
      dataInSystem: "",
      notifications:
        "Accepting the file data may impact eligibility determination.",
      dataToSave: true,
    },
  ];

  const onDeleteConfirmClick = () => {
    const id = get(recordToDelete, "id");
    deleteTempEmployeeById(id).then((response) => {
      toggleUseEffect();
      setToggle(!toggle);
    });
    var idLength = allRecords.length;
    console.log("id", allRecords.length);
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

  //added

  const handleConfirmClick = () => {};

  const handleCancelClick = () => {
    setShowDirtyCheckModal(false);
  };

  const dataValidationHandleClose = () => {
    setIsDataValidationModalOpen(false);
  };
  const apiDateValidattion = () => {
    // getTempEmployeeDetailsById(get(state, "api.data.employeeId", 0))
    //   .then((response) => {
    //     console.log(response);
    //     // dataValidationTableMock(
    //     //   response
    //     //     .filter((x) => x.errors. == 3 )
    //     //     .map((val) => ({
    //     //      console.log(response);
    //     //     }))
    //     // );
    //   })
    //   .catch((error) => {
    //     //Handle Error
    //   });
  };
  const tab = getParamsFromQueryString("tab");

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
                <span className="pending-text font-weight-500">
                  {data.warningCount}
                </span>{" "}
                <span className="font-weight-500">Warnings</span> |{" "}
                <span className="error-text font-weight-500">
                  {data.errorCount}
                </span>{" "}
                <span className="font-weight-500">Errors</span>
              </div>
            )}
          </Col>
          <Col md="1" className="align-self-center">
            <div className="d-flex justify-content-between">
              <div
                className="link-text"
                onClick={() => onClick(allRecords, data.id)}
                //onClick={() => setSliderOpen(true)}
              >
                view
              </div>
              {console.log("pendingSubmission", pendingSubmission)}
              {pendingSubmission ? null : (
                <div onClick={() => removeOne(data)}>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size="sm"
                    color="#ff0000"
                    className="pointer"
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      ))}

      <SliderPanel isOpen={isSliderOpen} size="84" showCancel={false}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontWeight: "500" }}>Data Change Validation</p>
          <div style={{}}>
            <Button
              style={{ marginRight: "20px" }}
              variant="secondary"
              onClick={() => setSliderOpen(false)}
            >
              Back
            </Button>
            <Button variant="primary">Submit</Button>
          </div>
        </div>

        <hr></hr>

        <div style={{ display: "flex" }}>
          <p style={{ fontSize: "12px", lineHeight: "18px" }}>xxx-xx-209</p>
          <p
            style={{ marginLeft: "30px", fontSize: "12px", lineHeight: "18px" }}
          >
            Peter Parker
          </p>
        </div>

        <p style={{ fontSize: "12px", color: "#828282", lineHeight: "25px" }}>
          Following employee data changes were identified by the system during
          validation process. Please select appropriate data save option and
          click on 'Submit' to continue
        </p>
        <div>
          <Table className="datachangesvalidationtable">
            <Table.Thead>
              <Table.Tr>
                {dataValidationTableHeader.map((item, index) => {
                  return (
                    <Table.Th key={index} className={item.className}>
                      {item.label}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <div style={{ maxWidth: "500px", overflowY: "scroll" }}>
                {dataValidationTable.map((data, index) => {
                  return (
                    <Table.Tr>
                      <Table.Td>
                        <p
                          style={{
                            width: "90px",
                            fontSize: "12px",
                            lineHeight: "18px",
                          }}
                        >
                          {" "}
                          {data.fieldName}
                        </p>
                      </Table.Td>

                      <Table.Td>
                        <p
                          style={{
                            width: "200px",
                            fontSize: "12px",
                            lineHeight: "18px",
                          }}
                        >
                          {" "}
                          {data.errorDetails}
                        </p>
                      </Table.Td>
                      <Table.Td>
                        <p
                          style={{
                            width: "140px",
                            fontSize: "12px",
                            lineHeight: "18px",
                          }}
                        >
                          <div>
                            <div style={{ color: "#828282" }}>
                              Employment Status
                            </div>
                            <p>Terminated</p>
                            <div style={{ color: "#828282" }}>
                              Most recent term date
                            </div>
                            <p>-</p>
                          </div>
                        </p>
                      </Table.Td>
                      <Table.Td>
                        <p
                          style={{
                            width: "140px",
                            fontSize: "12px",
                            lineHeight: "18px",
                          }}
                        >
                          <div>
                            <div style={{ color: "#828282" }}>
                              Employment Status
                            </div>
                            <p>Terminated</p>
                            <div style={{ color: "#828282" }}>
                              Most recent term date
                            </div>
                            <p>12/16/2020</p>
                          </div>
                        </p>
                      </Table.Td>
                      <Table.Td>
                        <p
                          style={{
                            width: "200px",
                            fontSize: "12px",
                            lineHeight: "18px",
                          }}
                        >
                          {" "}
                          {data.notifications}
                        </p>
                      </Table.Td>
                      <Table.Td>
                        <p style={{ width: "100px" }}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <input
                                type="radio"
                                name={`dataToSave${index}`}
                                id={"File"}
                                value={true}
                              />
                              <label
                                style={{ fontSize: "12px", lineHeight: "18px" }}
                              >
                                File
                              </label>
                            </div>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <input
                                type="radio"
                                name={`dataToSave${index}`}
                                id={"System"}
                                value={false}
                              />
                              <label
                                style={{ fontSize: "12px", lineHeight: "18px" }}
                              >
                                System
                              </label>
                            </div>
                          </div>
                        </p>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </div>
            </Table.Tbody>
          </Table>
        </div>
      </SliderPanel>

      {/* <Row className="w-100" style={{ justifyContent: "space-between", alignItems: 'flex-start' }}>
          {dataValidationTableHeader.map((item, index) => (
            <div>

              <Col xl="12">
                <p className="ft-12 w-100 font-weight-500" style={{ lineHeight: "18px", backgroundColor: "red" }}>
                  {item.label}
                </p>
              </Col> </div>))}</Row>

        <div style={{ display: "auto", maxHeight: "450px", overflowY: "scroll" }}>
          <Col>
            {dataValidationTable.map((item, index) => (
              <div>
                <Row style={{ fontSize: "12px", lineHeight: "18px" }}>
                  <Col md="1">
                    <p className="ft-12">{item.fieldName}</p>
                  </Col>

                  <Col md="3">
                    <p className="ft-12">{item.errorDetails}</p>
                  </Col>

                  <Col md="2">
                    <div >
                      <div style={{ color: "#828282" }}>Employment Status</div>
                      <p>Terminated</p>
                      <div style={{ color: "#828282" }}>Most recent term date</div>
                      <p>-</p>
                    </div>
                  </Col>

                  <Col md="2">
                    <div>
                      <div style={{ color: "#828282" }}>Employment Status</div>
                      <p>Terminated</p>
                      <div style={{ color: "#828282" }}>Most recent term date</div>
                      <p>12/16/2020</p>
                    </div>
                  </Col>

                  <Col md="2">
                    <p className="ft-12">{item.notifications}</p>
                  </Col>

                  <Col md="2">

                    <Row>
                      <div style={{ display: "flex", flexDirection: "row" }}><input style={{ width: "20px", height: "20px" }}
                        type="radio" id={values[0]} value={values[0]} checked={selectedSaveType ==values[0]} onChange={(e) => setSelectedSaveType(values[0])} />
                        <label style={{ marginLeft: "15px", fontSize: "12px", lineHeight: "18px" }}>File</label></div>
                    </Row>

                    <Row>
                      <div style={{ display: "flex", flexDirection: "row", marginTop: "25px" }}><input style={{ width: "20px", height: "20px" }}
                        type="radio" id={values[1]} value={values[1]} checked={selectedSaveType == values[1]} onChange={(e) => setSelectedSaveType(values[1])} />
                        <label style={{ marginLeft: "15px", fontSize: "12px", lineHeight: "18px" }}>System</label></div>
                    </Row>

                  </Col>

                </Row>
                <hr></hr>
              </div>))}
          </Col></div> */}
      {/* </SliderPanel> */}

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

      {/* <Modal show={isDataValidationModalOpen} onHide={dataValidationHandleClose}>
              <Modal.Body style={{ borderTop: "5px solid #f94f50",backgroundColor:"red"}}  className="modal modal-content">

              <div style={{ display: "flex", flexDirection: "row" }}>
          <p style={{ fontWeight: "500" }}>Data Change Validation</p>
          <div style={{ marginLeft: "50px" }}>
            <Button style={{ marginRight: "20px" }} variant="secondary" onClick={() => setIsDataValidationModalOpen(false)}>Back</Button>
            <Button variant="primary">Submit</Button>
          </div>
        </div>

        <hr></hr>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <p style={{ fontSize: "12px", lineHeight: "18px" }}>xxx-xx-209</p>
          <p style={{ marginLeft: "30px", fontSize: "12px", lineHeight: "18px" }}>Peter Parker</p>
        </div>

        <p style={{ fontSize: "12px", color: "#828282", lineHeight: "25px" }}>Following employee data changes were identified by the system during validation process. Please select appropriate data save option and click on 'Submit' to continue</p>

            <Table className="datachangesvalidationtable">
            <Table.Thead>
            <Table.Tr>
            {dataValidationTableHeader.map((item, index) => {
            return (
            <Table.Th key={index} className={item.className}>
            {item.label}
            </Table.Th>
            );
            })}
            </Table.Tr>
            </Table.Thead>
             <Table.Tbody>
             {dataValidationTable.map((data,index) => {

                return(
                  <Table.Tr >
                  <Table.Td >
                  <p style={{width:'90px',fontSize:'12px',lineHeight:'18px'}}> {data.fieldName}</p>

                  </Table.Td>

                  <Table.Td>
                  <p style={{width:'200px',fontSize:'12px',lineHeight:'18px'}}> {data.errorDetails}</p>
                  </Table.Td>
                  <Table.Td>
                  <p style={{width:'140px',fontSize:'12px',lineHeight:'18px'}}>
                    <div>
                      <div style={{ color: "#828282" }}>Employment Status</div>
                        <p>Terminated</p>
                        <div style={{ color: "#828282" }}>Most recent term date</div>
                        <p>-</p>
                      </div>
                  </p>
                  </Table.Td>
                  <Table.Td>
                  <p style={{width:'140px',fontSize:'12px',lineHeight:'18px'}}>
                  <div>
                    <div style={{ color: "#828282" }}>Employment Status</div>
                        <p>Terminated</p>
                        <div style={{ color: "#828282" }}>Most recent term date</div>
                        <p>12/16/2020</p>
                    </div>
                  </p>
                  </Table.Td>
                  <Table.Td>
                  <p style={{width:'200px',fontSize:'12px',lineHeight:'18px'}}> {data.notifications}</p>
                  </Table.Td>
                  <Table.Td>
                  <p style={{width:'100px'}}>
                  <div style={{display:'flex',flexDirection:'column'}}>
                  <div style={{display:'flex',flexDirection:'row'}}><input type="radio" id={"File"} value={"File"} onChange={()=>{setSelectedSaveType("File")}}/><label style={{fontSize:'12px',lineHeight:'18px'}}>File</label></div>
                  <div style={{display:'flex',flexDirection:'row'}}><input type="radio" id={"System"}value={"System"} onChange={()=>{setSelectedSaveType("System")}}/><label style={{fontSize:'12px',lineHeight:'18px'}}>System</label></div>
                  </div></p>
                  </Table.Td>
                  </Table.Tr>
                  )    })}

             </Table.Tbody>
             </Table>

            </Modal.Body>
          </Modal> */}
    </div>
  );
};

export default AllRecordReports;
