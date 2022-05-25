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
import SSNList from "shared/mocks/SSNDataList.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import upload from "../../../../shared/styles/upload.png";
import {
  getDuplicateEmployeeByFileId,
  getDuplicateRecord,
} from "../../../services/payroll/index";
import { usDateFormat, getFormattedSsn, ssnMasking } from "../../../../shared/utils";
import { isEmpty } from "lodash";
import { useDeepEffect } from "../../../../shared/abstracts";
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
  const [data, setData] = useState([]);
  const [Ssn, setSsn] = useState();
  const [deleteEmployeeIds, setDeleteEmployeeIds] = useState([]);

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
    AcceptedEmployeeId: data,
    FileUploadId: parseInt(fileId),
    SSN: Ssn,
    DeletedEmployeeIds: deleteEmployeeIds,
  };
  console.log("aaaaaaaaa", deletedVal);
  const remove = (id) => {
    if (
      window.confirm(
        "You are attempting to delete this record .Do you wish to continue?"
      )
    ) {
      let list = DuplicateRecord.filter((val) => val.id !== id);
      SetDuplicateRecord(list);
      setDeleteEmployeeIds([...deleteEmployeeIds, id]);
    }
  };
  console.log("DeleteEmployeeIds", deleteEmployeeIds);
  var i = 1;
  var arr = 0;
  const onRowItemClick = (rowIndex) => {
    setData(rowIndex);
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
    // setData(totalChecked);
  };
  console.log("Hello", data);
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
      console.log("file Type", datas.fileType);
      getDuplicateRecord(getSsn, getPayDate, fileId, datas.fileType).then(
        (response) => {
          SetDuplicateRecord(response);
          console.log(response, "Duplicate Records", fileId);
        }
      );
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
              <Button variant="primary" onClick={() => onClick(deletedVal)}>
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
        <Col
          md="10"
          className={`no-pad-left layout-grid ${
            showText ? "height-auto" : "fixed-height"
          }`}
        >
          <p className="ft-14 grey-text mt-10 ml-4">
            {showText === false ? "Common data fields are hidden" : null}{" "}
            <span className="link-text" onClick={onHandleHeight}>
              {showText ? "Hide common fields" : "View all fields"}
            </span>
          </p>
          <div className={"grid-template"}>
            <div className="grid-item">
              <div className="bg-head">
                <h4 className="inner-head">Field description</h4>
              </div>
              <div className="field-name">
                <p>Social Security Number</p>
                <p>Pay Date</p>
                <p>Employee Id</p>
                {datas.fileType == 1 ? (
                  <p>First Name</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>First Name</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Middle Name</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Middle Name</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Last Name</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Last Name</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Gender</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Gender</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Date Of Birth</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Date Of Birth</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Marital Status</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Marital Status</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Address</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Address</p>
                )}
                {datas.fileType == 1 ? (
                  <p>City</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>City</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Country</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Country</p>
                )}
                {datas.fileType == 1 ? (
                  <p>State</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>State</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Zip Code</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Zip Code</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Company Name</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Company Name</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Primary Phone Number</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Primary Phone Number</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Email</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Email</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Hire Date</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Hire Date</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Termination Date</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Termination Date</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Most Recent Rehire Date</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Most Recent Rehire Date</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Payroll Frequency</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Payroll Frequency</p>
                )}
                {datas.fileType == 1 ? (
                  <p>
                    {!isEmpty(DuplicateRecord) &&
                      DuplicateRecord[0].employeeClassifications[0]
                        .classificationTypeName}
                  </p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>
                    {!isEmpty(DuplicateRecord) &&
                      DuplicateRecord[0].employeeClassifications[0]
                        .classificationTypeName}
                  </p>
                )}
                {datas.fileType == 1 ? (
                  <p>Effective Start Date</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Effective Start Date</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Effective End Date</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Effective End Date</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Employment Status</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Employment Status</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Leave Start Date</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Leave Start Date</p>
                )}
                {datas.fileType == 1 ? (
                  <p>Leave End Date</p>
                ) : datas.fileType == 2 ? (
                  ""
                ) : (
                  <p>Leave End Date</p>
                )}
                {datas.fileType == 1 ? (
                  ""
                ) : datas.fileType == 2 ? (
                  <p>Gross Compensation</p>
                ) : (
                  <p>Gross Compensation</p>
                )}
                {datas.fileType == 1 ? (
                  ""
                ) : datas.fileType == 2 ? (
                  <p>Plan Compensation</p>
                ) : (
                  <p>Plan Compensation</p>
                )}
                {datas.fileType == 1 ? (
                  ""
                ) : datas.fileType == 2 ? (
                  <p>Hours</p>
                ) : (
                  <p>Hours</p>
                )}
                {datas.fileType == 1 ? (
                  ""
                ) : datas.fileType == 2 ? (
                  <p>
                    {!isEmpty(DuplicateRecord) &&
                      DuplicateRecord[0].contributions[0].rkPlanNumber +
                        "_" +
                        DuplicateRecord[0].contributions[0].sourceName}
                  </p>
                ) : (
                  <p>
                    {!isEmpty(DuplicateRecord) &&
                      DuplicateRecord[0].contributions[0].rkPlanNumber +
                        "_" +
                        DuplicateRecord[0].contributions[0].sourceName}
                  </p>
                )}
                {datas.fileType == 1 ? (
                  ""
                ) : datas.fileType == 2 ? (
                  <p>
                    {!isEmpty(DuplicateRecord) &&
                      DuplicateRecord[0].contributions[1].rkPlanNumber +
                        "_" +
                        DuplicateRecord[0].contributions[1].sourceName}
                  </p>
                ) : (
                  <p>
                    {!isEmpty(DuplicateRecord) &&
                      DuplicateRecord[0].contributions[1].rkPlanNumber +
                        "_" +
                        DuplicateRecord[0].contributions[1].sourceName}
                  </p>
                )}
                {datas.fileType == 1 ? (
                  ""
                ) : datas.fileType == 2 ? (
                  <p>Loan</p>
                ) : (
                  <p>Loan</p>
                )}
              </div>
            </div>
            {DuplicateRecord &&
              DuplicateRecord.map((data, index) => (
                <div className="grid-item" key={index}>
                  <div className="bg-head d-flex justify-content-between">
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        name={`selected-data`}
                        id={`selected-data${data.id}`}
                        onChange={() => onRowItemClick(data.id)}
                        className="pointer"
                      />{" "}
                      <span className="inner-head-value">Record {i++}</span>
                    </div>
                    <div className="trash-btn" onClick={() => remove(data.id)}>
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
                    <p>{data.employeeNumber ? data.employeeNumber : "-"}</p>
                    {datas.fileType == 1 ? (
                      <p className="marker-name">
                        {data.firstName ? data.firstName : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p className="marker-name">
                        {data.firstName ? data.firstName : "-"}
                      </p>
                    )}
                    {datas.fileType == 1 ? (
                      <p className="marker-name">
                        {data.middleName ? data.middleName : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p className="marker-name">
                        {data.middleName ? data.middleName : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p className="marker-name">
                        {data.lastName ? data.lastName : "-"}
                      </p>
                    ) : datas.FileType == 2 ? (
                      ""
                    ) : (
                      <p className="marker-name">
                        {data.lastName ? data.lastName : "-"}
                      </p>
                    )}

                    {datas.FileType == 1 ? (
                      <p>{data.gender ? data.gender : "-"}</p>
                    ) : datas.FileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.gender ? data.gender : "-"}</p>
                    )}

                    {datas.FileType == 1 ? (
                      <p>{data.birthDate ? data.birthDate : "-"}</p>
                    ) : datas.FileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.birthDate ? data.birthDate : "-"}</p>
                    )}

                    {datas.FileType == 1 ? (
                      <p>{data.maritalStatus ? data.maritalStatus : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.maritalStatus ? data.maritalStatus : "-"}</p>
                    )}

                    {datas.FileType == 1 ? (
                      <p>
                        {data.address1 + ", " + data.address2
                          ? data.address1 + ", " + data.address2
                          : "-"}
                      </p>
                    ) : datas.FileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.address1 + ", " + data.address2
                          ? data.address1 + ", " + data.address2
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.city ? data.city : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.city ? data.city : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.country ? data.country : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.country ? data.country : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.state ? data.state : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.state ? data.state : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.zipCode ? data.zipCode : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.zipCode ? data.zipCode : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.companyName ? data.companyName : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.companyName ? data.companyName : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>
                        {data.primaryPhoneNumber
                          ? data.primaryPhoneNumber
                          : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.primaryPhoneNumber
                          ? data.primaryPhoneNumber
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.email ? data.email : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.email ? data.email : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.hireDate ? data.hireDate : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.hireDate ? data.hireDate : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.terminationDate ? data.terminationDate : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.terminationDate ? data.terminationDate : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>
                        {data.mostRecentReHireDate
                          ? data.mostRecentReHireDate
                          : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.mostRecentReHireDate
                          ? data.mostRecentReHireDate
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>
                        {data.payrollFrequency ? data.payrollFrequency : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.payrollFrequency ? data.payrollFrequency : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>
                        {data.employeeClassifications[0].code
                          ? data.employeeClassifications[0].code
                          : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.employeeClassifications[0].code
                          ? data.employeeClassifications[0].code
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>
                        {data.employeeClassifications[0].effectiveStartDate
                          ? data.employeeClassifications[0].effectiveStartDate
                          : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.employeeClassifications[0].effectiveStartDate
                          ? data.employeeClassifications[0].effectiveStartDate
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>
                        {data.employeeClassifications[0].effectiveEndDate
                          ? data.employeeClassifications[0].effectiveEndDate
                          : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.employeeClassifications[0].effectiveEndDate
                          ? data.employeeClassifications[0].effectiveEndDate
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>
                        {data.employmentStatus ? data.employmentStatus : "-"}
                      </p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>
                        {data.employmentStatus ? data.employmentStatus : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.leaveStartDate ? data.leaveStartDate : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.leaveStartDate ? data.leaveStartDate : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      <p>{data.leaveEndDate ? data.leaveEndDate : "-"}</p>
                    ) : datas.fileType == 2 ? (
                      ""
                    ) : (
                      <p>{data.leaveEndDate ? data.leaveEndDate : "-"}</p>
                    )}

                    {datas.fileType == 1 ? (
                      ""
                    ) : datas.fileType == 2 ? (
                      <p>
                        {data.grossCompensation ? data.grossCompensation : "-"}
                      </p>
                    ) : (
                      <p>
                        {data.grossCompensation ? data.grossCompensation : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      ""
                    ) : datas.fileType == 2 ? (
                      <p>
                        {data.planCompensation ? data.planCompensation : "-"}
                      </p>
                    ) : (
                      <p>
                        {data.planCompensation ? data.planCompensation : "-"}
                      </p>
                    )}

                    <p>{data.hours ? data.hours : "-"}</p>

                    {datas.fileType == 1 ? (
                      ""
                    ) : datas.fileType == 2 ? (
                      <p>
                        {data.contributions[0].amount
                          ? data.contributions[0].amount
                          : "-"}
                      </p>
                    ) : (
                      <p>
                        {data.contributions[0].amount
                          ? data.contributions[0].amount
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      ""
                    ) : datas.fileType == 2 ? (
                      <p>
                        {data.contributions[1].amount
                          ? data.contributions[1].amount
                          : "-"}
                      </p>
                    ) : (
                      <p>
                        {data.contributions[1].amount
                          ? data.contributions[1].amount
                          : "-"}
                      </p>
                    )}

                    {datas.fileType == 1 ? (
                      ""
                    ) : datas.fileType == 2 ? (
                      <p>{data.loanse[0] ? data.loans[0] : "-"}</p>
                    ) : (
                      <p>{data.loans[0] ? data.loans[0] : "-"}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ErrorDuplicate;
