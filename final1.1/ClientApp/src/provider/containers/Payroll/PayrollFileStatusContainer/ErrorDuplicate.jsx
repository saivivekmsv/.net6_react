import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import SSNList from "../../../mocks/SSNDataList.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import upload from "../../../styles/upload.png";
import {
  getDuplicateEmployeeByFileId,
  getDuplicateRecord,
} from "../../../services/payroll/index";
import { usDateFormat, getFormattedSsn, ssnMasking } from "../../../utils";
import { isEmpty, isNull } from "lodash";
import { DeletePopUp } from "../../../components";
import { useDeepEffect } from "../../../abstracts";
// const ssnListArray = [
//   {
//     value: "XXX-XX-0456",
//   },
//   {
//     value: "XXX-XX-9868",
//   },
//   {
//     value: "XXX-XX-0488",
//   },
// ];

const ErrorDuplicate = (props) => {
  const { onClick, fileId, datas, info } = props;
  const [DuplicateEmployee, SetDuplicateEmployee] = useState([]);
  const [DuplicateRecord, SetDuplicateRecord] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [showText, setShowText] = useState(false);
  const [showSelected, setShowSelected] = useState(0);
  const [ssnList, setSSNList] = useState(SSNList);
  // eslint-disable-next-line no-unused-vars
  const [acceptempval, setAcceptempval] = useState();
  const [Ssn, setSsn] = useState();
  const [deleteEmployeeIds, setDeleteEmployeeIds] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

  const onHandleHeight = () => {
    setShowText(!showText);
  };

  const onSelected = (key) => {
    setShowSelected(key);
  };

  // const remove = (id) => {
  //   if (
  //     window.confirm(
  //       "You are attempting to delete this record .Do you wish to continue?"
  //     )
  //   ) {
  //     let list = DuplicateRecord.filter((val) => val.id !== id);
  //     SetDuplicateRecord(list);
  //     console.log("hii", id)
  //   }
  // };
  const deletedVal = {
    UserId: 1,
    FileType: datas.fileType,
    AcceptedEmployeeId: acceptempval,
    FileUploadId: parseInt(fileId),
    SSN: Ssn,
    DeletedEmployeeIds: deleteEmployeeIds,
  };
  console.log("Deleted employee", deletedVal);
  const remove = () => {
    let list = DuplicateRecord.filter((val) => val.id !== deleteEmployeeId);
    SetDuplicateRecord(list);
    setDeleteEmployeeIds([...deleteEmployeeIds, deleteEmployeeId]);
    console.log("hi", deleteEmployeeIds);
    setModelOpen(false);
  };
  console.log("DeleteEmployeeIds", deleteEmployeeIds);
  var i = 1;

  const onRowItemClick = (rowIndex) => {
    setAcceptempval(rowIndex);
    // const totalChecked = [];
    // const updatedData = SSNList.filter((item) => {
    //   const checked = rowIndex === item.id ? !item.checked : item.checked;

    //   if (checked) {
    //     totalChecked.push(item);
    //   }

    //   return {
    //     ...item,
    //     checked,
    //   };
    // });
    // setAcceptempval(totalChecked);
  };
  console.log("Hello", acceptempval);
  useEffect(() => {
    getDuplicateEmployeeByFileId(fileId).then((response) => {
      SetDuplicateEmployee(response);
      console.log(response, "Duplicate Employee", fileId);
    });
  }, [toggle]);
  console.log("Duplicate Employee", DuplicateEmployee);

  useEffect(() => {
    if (!isEmpty(DuplicateEmployee)) {
      var getSsn = DuplicateEmployee[0].ssn;
      setSsn(getSsn);
      var getPayDate = DuplicateEmployee[0].payDate;
      var getDuplicateRecordViewModel = {
        ssn: getSsn,
        payDate: getPayDate,
        fileId: fileId,
        fileType: datas.fileType,
      };
      console.log(getDuplicateRecordViewModel);
      getDuplicateRecord(getDuplicateRecordViewModel).then((response) => {
        SetDuplicateRecord(response);
        !isEmpty(response) && setAcceptempval(response[0].id);
        console.log(response, "Duplicate Records", fileId);
      });
    }
  }, [toggle, DuplicateEmployee]);
  console.log("Duplicate Records values", DuplicateRecord);

  return (
    <div className="file-information">
      <div className="d-flex justify-content-between">
        <div className="mt-20 payroll-sub-head">Errors Found in records</div>
        <div className="mt-20 ft-12 text-black font-weight-500">
          Total Records {DuplicateRecord.length}
        </div>
      </div>
      <div className="border-top" />
      <Row>
        <Col md="9" className="mt-20">
          {info.fileName && info.fileName.length >= 30 ? (
            <div>
              <p className="text-black ft-14 font-weight-500">
                <Image src={upload} className="mr-3" />
                <OverlayTrigger overlay={<Tooltip>{info.fileName}</Tooltip>}>
                  <span>
                    {(info.fileName || "").slice(0, 30)}... .xlsx
                    {}
                  </span>
                </OverlayTrigger>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-black ft-14 font-weight-500">
                <Image src={upload} className="mr-3" />
                <span>
                  {info.fileName}
                  {/* <span className="grey-text ft-10">.xls</span> */}
                </span>
              </p>
            </div>
          )}

          <h3 className="duplicate-text">
            {DuplicateRecord.length} Duplicate records found
          </h3>
          <div className="row">
            <div className="col-md-11">
              <p className="ft-12 grey-text">
                To delete one or more of the duplicate records, click on Delete
                for each related record. To retain the records, select the
                census record to be retained and click submit (hours,
                compensation, contribution and loan payments for all records
                shown will be aggregated upon submit)
              </p>
            </div>
            <div className="col-md-1">
              <Button
                variant="primary"
                onClick={() => {
                  onClick(deletedVal);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="2" className="no-pad-right">
          <div className="ssn-list">
            {DuplicateEmployee.map((data, key) => (
              <div
                className={
                  showSelected === key ? "ssn-list-selected" : "ssn-list-value"
                }
                onClick={() => onSelected(key)}
              >
                {ssnMasking(data.ssn)}
                <br />
                {usDateFormat(data.payDate)}
              </div>
            ))}
          </div>
        </Col>
        <Col md="10" className={`no-pad-left layout-grid height-auto`}>
          <p className="ft-14 grey-text mt-10 ml-4">
            {showText === false ? "Common data fields are hidden" : null}{" "}
            <span className="link-text" onClick={onHandleHeight}>
              {showText ? "Hide common fields" : "View all fields"}
            </span>
          </p>
          <p className="mt-3 ml-4">Select Record to be saved</p>
          <div className={"grid-template"}>
            <div className="grid-item">
              <div className="bg-head">
                <h4 className="inner-head">Field description</h4>
              </div>
              <div className="field-name">
                <p>Social Security Number</p>
                <p>Pay Date</p>
                {showText && (
                  <>
                    <p>Employee Id</p>
                    <p>Plan Id</p>
                    <p>Plan Name</p>
                    {datas.fileType != 2 && (
                      <>
                        <p>First Name</p>
                        <p>Middle Name</p>
                        <p>Last Name</p>
                        <p>Gender</p>
                        <p>Date Of Birth</p>
                        <p>Marital Status</p>
                        <p>Address</p>
                        <br />
                        <p>City</p>
                        <p>Country</p>
                        <p>State</p>
                        <p>Zip Code</p>
                        <p>Company Name</p>
                        <p>Primary Phone Number</p>
                        <p>Email</p>
                        <p>Hire Date</p>
                        <p>Termination Date</p>
                        <p>Most Recent Rehire Date</p>
                        <p>Payroll Frequency</p>
                        <p>
                          {!isEmpty(DuplicateRecord) &&
                            DuplicateRecord[0]?.employeeClassifications[0]
                              ?.classificationTypeName}
                        </p>
                        <p>Effective Start Date</p>
                        <p>Effective End Date</p>
                        <p>Employment Status</p>
                        <p>Leave Start Date</p>
                        <p>Leave End Date</p>
                        <p>Hours</p>
                      </>
                    )}
                    {datas.fileType != 1 && (
                      <>
                        <p>Gross Compensation</p>
                        <p>Plan Compensation</p>
                        {!isEmpty(DuplicateRecord) &&
                          DuplicateRecord[0].contributions.map((a) => (
                            <p>{a.rkPlanNumber + "_" + a.sourceName}</p>
                          ))}
                        {/* <p>Loan</p> */}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            {DuplicateRecord &&
              DuplicateRecord.map((data, index) => {
                // index==0 && onRowItemClick(data.id)
                return (
                  <div className="grid-item" key={index}>
                    <div className="bg-head d-flex justify-content-between">
                      <div className="d-flex">
                        <Form.Check
                          type="radio"
                          name={`selected-data`}
                          id={`selected-data${data.id}`}
                          checked={data.id == acceptempval}
                          onChange={() => onRowItemClick(data.id)}
                          className="pointer"
                        />{" "}
                        <span className="inner-head-value">Record {i++}</span>
                      </div>
                      <div
                        className="trash-btn"
                        onClick={() => {
                          setDeleteEmployeeId(data.id);
                          setModelOpen(true);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          size="14px"
                          color="#FF0000"
                          className="pointer"
                        />
                      </div>
                    </div>
                    <div className="field-values">
                      <p>{ssnMasking(data.socialSecurityNumber)}</p>
                      <p>{data.payDate ? data.payDate : "-"}</p>
                      {showText && (
                        <>
                          <p>
                            {data.employeeNumber ? data.employeeNumber : "-"}
                          </p>
                          <p>{data.planId ? data.planId : "-"}</p>
                          <p>{data.planName ? data.planName : "-"}</p>
                          {datas.fileType != 2 && (
                            <>
                              <p>{data.firstName ? data.firstName : "-"}</p>
                              <p>{data.middleName ? data.middleName : "-"}</p>
                              <p>{data.lastName ? data.lastName : "-"}</p>
                              <p>{data.gender ? data.gender : "-"}</p>
                              <p>{data.birthDate ? data.birthDate : "-"}</p>
                              <p>
                                {data.maritalStatus ? data.maritalStatus : "-"}
                              </p>
                              <p>
                                {data.address1 +
                                ", " +
                                data.address2 +
                                ", " +
                                data.address3
                                  ? data.address1 +
                                    ", " +
                                    data.address2 +
                                    ", " +
                                    data.address3
                                  : "-"}
                              </p>
                              <p>{data.city ? data.city : "-"}</p>
                              <p>{data.country ? data.country : "-"}</p>
                              <p>{data.state ? data.state : "-"}</p>
                              <p>{data.zipCode ? data.zipCode : "-"}</p>
                              <p>{data.companyName ? data.companyName : "-"}</p>
                              <p>
                                {data.primaryPhoneNumber
                                  ? data.primaryPhoneNumber
                                  : "-"}
                              </p>
                              <p>{data.email ? data.email : "-"}</p>
                              <p>{data.hireDate ? data.hireDate : "-"}</p>
                              <p>
                                {data.terminationDate
                                  ? data.terminationDate
                                  : "-"}
                              </p>
                              <p>
                                {data.mostRecentReHireDate
                                  ? data.mostRecentReHireDate
                                  : "-"}
                              </p>
                              <p>
                                {data.payrollFrequency
                                  ? data.payrollFrequency
                                  : "-"}
                              </p>
                              <p>
                                {data.employeeClassifications[0].code
                                  ? data.employeeClassifications[0].code
                                  : "-"}
                              </p>
                              <p>
                                {data.employeeClassifications[0]
                                  .effectiveStartDate
                                  ? data.employeeClassifications[0]
                                      .effectiveStartDate
                                  : "-"}
                              </p>
                              <p>
                                {data.employeeClassifications[0]
                                  .effectiveEndDate
                                  ? data.employeeClassifications[0]
                                      .effectiveEndDate
                                  : "-"}
                              </p>
                              <p>
                                {data.employmentStatus
                                  ? data.employmentStatus
                                  : "-"}
                              </p>
                              <p>
                                {data.leaveStartDate
                                  ? data.leaveStartDate
                                  : "-"}
                              </p>
                              <p>
                                {data.leaveEndDate ? data.leaveEndDate : "-"}
                              </p>
                              <p>{data.hours ? data.hours : "-"}</p>
                            </>
                          )}

                          {datas.fileType != 1 && (
                            <>
                              <p>
                                {data.grossCompensation
                                  ? data.grossCompensation
                                  : "-"}
                              </p>
                              <p>
                                {data.planCompensation
                                  ? data.planCompensation
                                  : "-"}
                              </p>
                              <>
                                {data.contributions.map((a) => (
                                  <p>{!isNull(a.amount) ? a.amount : "-"}</p>
                                ))}
                              </>
                              {/* <p>{data.loans[0] ? data.loans[0] : "-"}</p> */}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </Col>
      </Row>
      <DeletePopUp
        msg="You are attempting to delete this record .Do you wish to continue?"
        onclick={remove}
        modelOpen={modelOpen}
        modelClose={setModelOpen}
      />
    </div>
  );
};

export default ErrorDuplicate;
