import React, { useState, useEffect, useContext } from "react";
import { Formik, useFormikContext } from "formik";
import { Tab, Tabs, Button, Form, Modal } from "react-bootstrap";

import {
  formFields,
  managePayrollFormNames,
  ROUTES,
  scrollToErrorControl,
  ssnMasking,
} from "../../../utils";
import { managePayrollStore } from "../../../contexts";
import CensusFormDetails from "./CensusFormDetails";
import PayrollFormDetails from "./PayrollFormDetails";
import { camelCase, get, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ErrorListingPayroll,
  SliderPanel,
  Link,
  LoaderWrapper,
  CsplTable as Table,
} from "../../../components";
import {
  getTempEmployeeDetailsforPayroll,
  submitAndUpdateECR,
  acceptAllDataChangeValidationInaFile,
  acceptEmployeeWarnings,
} from "../../../services";
import {
  faExclamationTriangle,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";

const PayrollCensusDetails = (props) => {
  const {
    data,
    employeeId,
    setErrorPage,
    item,
    setIsModalOpen,
    setRecordToDelete,
    refresh,
    fileId,
  } = props;
  const { state, dispatch } = useContext(managePayrollStore);
  // const payrollDetails = get(state, "api.data", {});
  const [toggleEmp, setToggleEmp] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [deleteContributionId, setDeleteContributionId] = useState([]);
  const contirbutionIds = [...new Set(deleteContributionId)];
  const [deleteCompensationError, setDeleteCompensationError] = useState([]);
  const compensationIds = [...new Set(deleteCompensationError)];
  const [hoursErrorId, setHoursErrorId] = useState([]);
  const accpectedIds = contirbutionIds.concat(compensationIds, hoursErrorId);

  let fileValue = "",
    systemValue = "";
  const onFormSubmit = (values) => {
    setIsLoading(true);
    let updatedValues = { ...values, acceptedErrorIds: accpectedIds };
    submitAndUpdateECR(updatedValues, data.fileType)
      .then((response) => {
        setToggleEmp(!toggleEmp);
        if (
          response.contributions?.errorMessages?.any() ||
          response.loans?.errorMessages?.any() ||
          response.errorMessages?.any()
        ) {
        } else {
          window.location.reload();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };
  const graphdetails = get(state, "api.graphDetails", {});
  const pendingSubmission =
    get(graphdetails, "status") === "AwaitingFunding" ? true : false;
  const [censusOrPayrollTab, setCensusOrPayrollTab] = useState("census");
  const fields = formFields[managePayrollFormNames.ERROR_CORRECTION_FORM];
  const [payrollWarnings, setPayrollWarnings] = useState([]);
  const [censusWarnings, setCensusWarnings] = useState([]);
  const [payrollErrors, setPayrollErrors] = useState([]);
  const [censusErrors, setCensusErrors] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dataChangeValidations, setDataChangeValidations] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptWarningList, setAcceptWarningList] = useState([]);
  const [acceptWarningListCensus, setAcceptWarningListCensus] = useState([]);
  const [acceptWarningListPayroll, setAcceptWarningListPayroll] = useState([]);
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);

  const Func = (value, index) => {
    var data = [];
    dataChangeValidations.map((row, i) => {
      if (i == index) {
        data.push({ ...row, dataToSave: value });
      } else data.push(row);
    });
    setDataChangeValidations(data);
  };

  const onSubmitSave = () => {
    var d = dataChangeValidations.every((x) => x.dataToSave);
    if (d) {
      acceptAllDataChangeValidationInaFile({
        employeeId: employeeId,
        fileUploadId: employeeData.fileUploadId,
      }).then((response) => {
        if (response) {
          setIsSliderOpen(false);
        }
      });
    } else {
      console.log(fileValue);
      dataChangeValidations.map((x) => {
        if (!x.dataToSave) {
          if (fileValue !== "") {
            var d = JSON.parse(x.dynamicValue2);
            for (const i in d) {
              if (d[i] === "-") d[i] = null;
              employeeData[camelCase(i)] = d[i];
            }
            fileValue = "";
            //console.log(employeeData,camelCase(x.controlName))
          }
          employeeData[camelCase(x.controlName)] = x.dynamicValue2;
        }
      });
      setEmployeeData(employeeData);
      submitAndUpdateECR(employeeData, data.fileType).then((response) => {
        setIsSliderOpen(false);
      });
    }
    setDataChangeValidations([]);
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

  const onPayrollDeleteClick = (item, index) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };

  const acceptWarningCensus = (data) => {
    const id = data.map((_) => _.id);
    setAcceptWarningListCensus(id);
  };
  const acceptWarningPayroll = (data) => {
    const id = data.map((_) => _.id);
    setAcceptWarningListPayroll(id);
  };
  const AcceptNotificationClick = () => {
    //values.acceptWarning = true;
    setModalOpen(false);
    console.log(notifications.map((x) => x.id));
    acceptEmployeeWarnings({
      acceptedWarningIds: notifications.map((x) => x.id),
      fileUploadId: employeeData.fileUploadId,
    });
  };

  const acceptWarning = (census, payroll) => {
    const id = census.concat(payroll);
    acceptEmployeeWarnings({
      acceptedWarningIds: id,
      fileUploadId: employeeData.fileUploadId,
    })
      .then((response) => {
        setToggleEmp(!toggleEmp);
        window.location.reload();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    getTempEmployeeDetailsforPayroll(employeeId).then((response) => {
      setEmployeeData(response);
      if (response.leaveStartDate == null) setIsStartDate(false);
      else setIsStartDate(true);
      if (response.leaveEndDate == null) setIsEndDate(false);
      else setIsEndDate(true);
      // let c = response.contributions.map((_) => _.errorMessages);
      // var merged = response.errorMessages.concat.apply([], c);
      // merged.forEach((_) => response.errorMessages.push(_));
      // console.log("C", c);
      // console.log(merged, "Merged");
      // console.log(response, "Response");
      //console.log(c[0].filter((_)=>_.errorType==2 && _.processReferenceId != 2),'Warnings are')
      // var error = {}
      // response.errorMessages.forEach(_=> error[_.controlName]=_.MessageDescCode);
      // setErrors(error);
      setPayrollWarnings(
        response.errorMessages.filter(
          (_) => _.errorType == 2 && _.processReferenceId != 2
        )
        //c[0].filter((_)=>_.errorType==2 && _.processReferenceId != 2)
      );
      setCensusWarnings(
        response.errorMessages.filter(
          (_) => _.errorType == 2 && _.processReferenceId == 2
        )
      );
      var payrollError = response.errorMessages.filter(
        (_) => _.errorType == 1 && _.processReferenceId != 2
      );

      response.contributions?.forEach((_) => {
        _.errorMessages?.forEach((_) => {
          if (_.errorType == 1) payrollError.push(_);
        });
      });

      var dataValidationErrorCount = response.errorMessages?.filter(
        (_) => _.errorType === 3
      );
      dataValidationErrorCount.forEach((_) => {
        _["dataToSave"] = true;
      });
      if (dataValidationErrorCount.length > 0) {
        setIsSliderOpen(true);
      }
      var notification = response.errorMessages.filter(
        (x) => x.errorType === 4
      );
      setEmployeeInfo({
        employeeName: response.firstName + response.lastName,
        uniqueId: response.uniquePersonalIdentification,
      });

      var payrollWarning = response.errorMessages.filter(
        (_) => _.errorType == 2 && _.processReferenceId != 2
      );

      response.contributions?.forEach((_) => {
        _.errorMessages?.forEach((_) => {
          if (_.errorType == 2) payrollWarning.push(_);
        });
      });

      if (notification.length > 0) setModalOpen(true);
      console.log(notification, notification.length);
      setPayrollErrors(payrollError);
      setNotifications(notification);
      setDataChangeValidations(dataValidationErrorCount);
      setPayrollWarnings(payrollWarning);
      setCensusErrors(
        response.errorMessages.filter(
          (_) => _.errorType == 1 && _.processReferenceId == 2
        )
      );
    });
  }, [employeeId, toggleEmp]);

  return (
    <LoaderWrapper isLoading={isLoading}>
      <div className="error-details-tab">
        {employeeData != null ? (
          <Formik
            onSubmit={onFormSubmit}
            initialValues={{
              ...employeeData,
              country: "USA",
              compensationDetailsRecordType: 0,
              contributionDetailsRecordType: 0,
              errorReportRecordType: 0,
            }}
            initialErrors={errors}
            enableReinitialize
            validateOnChange={false}
            validateOnBlur={false}
            validateOnMount={true}
          >
            {({
              setFieldTouched,
              setErrors,
              errors,
              handleSubmit,
              values,
              setFieldError,
            }) => {
              const onTabChange = (index) => {
                setCensusOrPayrollTab(index);
              };

              const errorItemClick = (item, tab) => {
                setFieldTouched(item.controlName, true);
                setCensusOrPayrollTab(tab);
                window.setTimeout(() => {
                  // setErrors({ ...errors, [item.field]: item.message });

                  switch (item.controlName) {
                    case "employeeClassifications":
                      scrollToErrorControl("employeeClassifications[0].code");
                      break;
                    case "ytdHours":
                      scrollToErrorControl("hoursDetails[0].ytdHours");
                      break;
                    case "payPeriodHours":
                      scrollToErrorControl("hoursDetails[0].payPeriodHours");
                      break;
                    case "payPeriodGrossCompensation":
                      scrollToErrorControl("compensations[0].payPeriodAmount");
                      break;
                    case "payPeriodPlanCompensation":
                      scrollToErrorControl("compensations[1].payPeriodAmount");
                      break;
                    case "ytdGrossCompensation":
                      scrollToErrorControl("compensations[0].ytdAmount");
                      break;
                    case "ytdPlanCompensation":
                      scrollToErrorControl("compensations[1].ytdAmount");
                      break;
                    case "contributionsDetails":
                      scrollToErrorControl(
                        "contributions[0].contributionAmount"
                      );
                      break;
                    default:
                      scrollToErrorControl(item.controlName);
                      break;
                  }
                }, 500);
              };

              const disableStatus =
                censusErrors.length + payrollErrors.length > 0 ||
                censusWarnings.length + payrollWarnings.length > 0
                  ? true
                  : false;
              const handleClose = () => {
                setModalOpen(false);
              };

              const handleBack = () => {
                //setToggleEmp(!toggleEmp);
                setErrorPage(false);
                // setIsSliderOpen(false);
                // setDataChangeValidations([]);
              };

              if (dataChangeValidations.length == 0) {
                return (
                  <Form
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    className="h-100 d-flex"
                  >
                    <div className="h-100 d-flex">
                      <div className="payroll-census-tabs">
                        <Tabs
                          defaultActiveKey="census"
                          activeKey={censusOrPayrollTab}
                          onSelect={onTabChange}
                          transition={false}
                          mountOnEnter
                          unmountOnExit
                        >
                          {data.fileType != 2 && (
                            <Tab eventKey="census" title="Census">
                              <CensusFormDetails
                                fileType={data.fileType}
                                setFieldError={setFieldError}
                                setFieldTouched={setFieldTouched}
                                fields={fields}
                                data={employeeData}
                                awaitingFunding={pendingSubmission}
                                errors={2}
                                warnings={2}
                                errorItemClick={(item) =>
                                  errorItemClick(item, "census")
                                }
                                isStartDate={isStartDate}
                                isEndDate={isEndDate}
                              />
                            </Tab>
                          )}
                          {data.fileType != 1 && (
                            <Tab eventKey="payroll" title="Payroll">
                              <PayrollFormDetails
                                fields={fields}
                                data={values}
                                pendingSubmission={pendingSubmission}
                                errors={get(employeeData, "errorMessages", [])}
                                warnings={get(employeeData, "warnings", [])}
                                errorItemClick={(item) =>
                                  errorItemClick(item, "payroll")
                                }
                                setId={setDeleteContributionId}
                                setError={setDeleteCompensationError}
                                setHoursErrorId={setHoursErrorId}
                              />
                            </Tab>
                          )}
                        </Tabs>
                      </div>
                      <div className="payroll-error-details-tabs">
                        <div
                          className="payrol-cencus-button-wrapper"
                          style={{ marginLeft: -60 }}
                        >
                          {pendingSubmission ? null : (
                            <span
                              type="submit"
                              style={{ color: "red" }}
                              onClick={() => onPayrollDeleteClick(item)}
                            >
                              Delete Record
                            </span>
                          )}
                          &nbsp;&nbsp;
                          <Link to={ROUTES.PAYROLL}>
                            <Button type="button" variant="secondary">
                              Continue Later
                            </Button>
                          </Link>
                          &nbsp;&nbsp;
                          {pendingSubmission ? null : (
                            <Button type="submit" variant="primary">
                              Submit
                            </Button>
                          )}
                        </div>
                        <div className="error-details-tab-wrapper">
                          <Tabs
                            defaultActiveKey="warning"
                            transition={false}
                            mountOnEnter
                            unmountOnExit
                          >
                            <Tab
                              eventKey="warning"
                              title={
                                <span>
                                  Warnings{" "}
                                  <span className="pending-text">
                                    {(censusWarnings?.length ?? 0) +
                                      (payrollWarnings?.length ?? 0)}
                                  </span>
                                </span>
                              }
                            >
                              <div className="payroll-error-listing">
                                <span
                                  type="submit"
                                  style={{
                                    fontSize: "13px",
                                    color: "blue",
                                    position: "relative",
                                    left: "125px",
                                    top: "5px",
                                    display:
                                      (censusWarnings?.length ?? 0) +
                                      (payrollWarnings?.length ?? 0)
                                        ? "block"
                                        : "none",
                                  }}
                                  onClick={() =>
                                    acceptWarning(
                                      acceptWarningListCensus,
                                      acceptWarningListPayroll
                                    )
                                  }
                                >
                                  Accept Warnings
                                </span>
                                <ErrorListingPayroll
                                  head={`${censusWarnings.length} warnings in Census`}
                                  content={censusWarnings}
                                  employeeData={censusOrPayrollTab}
                                  errorItemClick={(item) =>
                                    errorItemClick(item, "census")
                                  }
                                  acceptWarningCensus={acceptWarningCensus}
                                  isCensusWarning={
                                    censusWarnings.length > 0 ? true : false
                                  }
                                  warningsTab={true}
                                />
                                <ErrorListingPayroll
                                  head={`${payrollWarnings.length} warnings in Payroll`}
                                  content={payrollWarnings}
                                  employeeData={censusOrPayrollTab}
                                  errorItemClick={(item) =>
                                    errorItemClick(item, "payroll")
                                  }
                                  acceptWarningPayroll={acceptWarningPayroll}
                                  isPayrollWarning={
                                    payrollWarnings.length > 0 ? true : false
                                  }
                                  warningsTab={true}
                                />
                              </div>
                            </Tab>
                            <Tab
                              eventKey="error"
                              title={
                                <span>
                                  Errors{" "}
                                  <span className="error-text">
                                    {censusErrors.length + payrollErrors.length}
                                  </span>
                                </span>
                              }
                            >
                              <div className="payroll-error-listing">
                                <ErrorListingPayroll
                                  head={`${censusErrors.length} Errors in Census`}
                                  content={censusErrors}
                                  employeeData={censusOrPayrollTab}
                                  errorItemClick={(item) =>
                                    errorItemClick(item, "census")
                                  }
                                />
                                <ErrorListingPayroll
                                  head={`${payrollErrors.length} Errors in Payroll`}
                                  content={payrollErrors}
                                  employeeData={censusOrPayrollTab}
                                  errorItemClick={(item) =>
                                    errorItemClick(item, "payroll")
                                  }
                                />
                              </div>
                            </Tab>
                          </Tabs>
                        </div>
                      </div>
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
                            {notifications.map((x) => (
                              <p>{x.messageDescCode} </p>
                            ))}

                            <br />
                            <Button
                              className="remove-btn mr-4"
                              onClick={AcceptNotificationClick}
                            >
                              Ok
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </Form>
                );
              } else {
                return (
                  <SliderPanel
                    isOpen={isSliderOpen}
                    size="84"
                    showCancel={false}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ fontWeight: "500" }}>
                        Data Change Validation
                      </p>
                      <div style={{}}>
                        <Button
                          style={{ marginRight: "20px" }}
                          variant="secondary"
                          onClick={() => handleBack()}
                        >
                          Back
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            onSubmitSave();
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>

                    <hr></hr>

                    <div style={{ display: "flex" }}>
                      <p style={{ fontSize: "12px", lineHeight: "18px" }}>
                        {ssnMasking(employeeInfo.uniqueId)}
                      </p>
                      <p
                        style={{
                          marginLeft: "30px",
                          fontSize: "12px",
                          lineHeight: "18px",
                        }}
                      >
                        {employeeInfo.employeeName}
                      </p>
                    </div>

                    <p
                      style={{
                        fontSize: "12px",
                        color: "#828282",
                        lineHeight: "25px",
                      }}
                    >
                      Following employee data changes were identified by the
                      system during validation process. Please select
                      appropriate data save option and click on 'Submit' to
                      continue
                    </p>
                    <div>
                      <Table className="datachangesvalidationtable">
                        <Table.Thead>
                          <Table.Tr>
                            {dataValidationTableHeader.map((item, index) => {
                              return (
                                <Table.Th
                                  key={index}
                                  className={item.className}
                                >
                                  {item.label}
                                </Table.Th>
                              );
                            })}
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          <div
                            style={{
                              maxHeight: "500px",
                              wordWrap: "breakWord",
                            }}
                          >
                            {dataChangeValidations.map((data, index) => {
                              fileValue = "";
                              systemValue = "";
                              //console.log(fileValue)
                              if (
                                data.controlName === "AddressDataChange" ||
                                data.controlName === "EmployementStatus" ||
                                data.controlName === "Classification"
                              ) {
                                fileValue = "";
                                systemValue = "";
                                let c = JSON.parse(data.dynamicValue1);
                                let d = JSON.parse(data.dynamicValue2);
                                if (data.controlName === "AddressDataChange") {
                                  if (!c.ForeignAddressIndicator) {
                                    delete c.ForeignCountry;
                                    delete c.ForeignState;
                                    delete d.ForeignCountry;
                                    delete d.ForeignState;
                                  } else {
                                    delete c.Country;
                                    delete c.State;
                                    delete d.State;
                                    delete d.Country;
                                  }
                                  delete c.ForeignAddressIndicator;
                                  delete d.ForeignAddressIndicator;
                                }
                                for (var i in c) {
                                  if (c[i] === null || c[i] === "") c[i] = " ";
                                  fileValue += i + " : " + "\n" + c[i] + "\n";
                                }
                                //fileValue=data.dynamicValue1.split(',').map(str => <p>{str}</p>);
                                for (var i in d) {
                                  if (d[i] === null || d[i] === "") d[i] = " ";
                                  systemValue += i + " : " + "\n" + d[i] + "\n";
                                }
                              }
                              return (
                                <Table.Tr>
                                  <div
                                    style={{ display: "flex" }}
                                    className="datachangesvalidationtable"
                                  >
                                    <Table.Td>
                                      <div className="temp1">
                                        {" "}
                                        {data.controlName}
                                      </div>
                                    </Table.Td>

                                    <Table.Td>
                                      <div className="temp2">
                                        {" "}
                                        {data.messageCode}
                                      </div>
                                    </Table.Td>
                                    <Table.Td>
                                      <div className="temp3">
                                        {fileValue === ""
                                          ? data.dynamicValue1
                                          : fileValue}
                                      </div>
                                    </Table.Td>
                                    <Table.Td>
                                      <div className="temp4">
                                        <div>
                                          {systemValue === ""
                                            ? data.dynamicValue2
                                            : systemValue}
                                        </div>
                                      </div>
                                    </Table.Td>
                                    <Table.Td>
                                      <div className="temp5">
                                        {" "}
                                        {
                                          "Accepting the file data may impact eligibility determination."
                                        }
                                      </div>
                                    </Table.Td>
                                    <Table.Td>
                                      <div className="temp6">
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",

                                              flexDirection: "row",
                                            }}
                                          >
                                            <input
                                              type="radio"
                                              checked={data.dataToSave == true}
                                              name={`dataToSave${index}`}
                                              id={"File"}
                                              value={true}
                                            />
                                            <label
                                              style={{
                                                fontSize: "12px",
                                                lineHeight: "18px",
                                                marginLeft: "5px",
                                              }}
                                              onClick={() => {
                                                Func(true, index);
                                              }}
                                            >
                                              File
                                            </label>
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                            }}
                                          >
                                            <input
                                              type="radio"
                                              checked={data.dataToSave == false}
                                              name={`dataToSave${index}`}
                                              id={"System"}
                                              value={false}
                                            />
                                            <label
                                              style={{
                                                fontSize: "12px",
                                                lineHeight: "18px",
                                                marginLeft: "5px",
                                              }}
                                              onClick={() => {
                                                Func(false, index);
                                              }}
                                            >
                                              System
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </Table.Td>
                                  </div>
                                </Table.Tr>
                              );
                            })}
                          </div>
                        </Table.Tbody>
                      </Table>
                    </div>
                  </SliderPanel>
                );
              }
            }}
          </Formik>
        ) : null}
      </div>
    </LoaderWrapper>
  );
};

export default PayrollCensusDetails;
