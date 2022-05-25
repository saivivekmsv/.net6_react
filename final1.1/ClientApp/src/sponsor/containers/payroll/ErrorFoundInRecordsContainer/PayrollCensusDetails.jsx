import React, { useState, useEffect, useContext } from "react";
import { Formik, useFormikContext } from "formik";
import { Tab, Tabs, Button, Form } from "react-bootstrap";
import {
  formFields,
  managePayrollFormNames,
  ROUTES,
  scrollToErrorControl,
} from "../../../../shared/utils"
// import { managePayrollStore } from "sponsor/contexts"
import CensusFormDetails from "./CensusFormDetails";
import PayrollFormDetails from "./PayrollFormDetails";
import { get } from "lodash";
import { ErrorListingPayroll, Link } from "../../../../shared/components";
import {
  getTempEmployeeDetailsforPayroll,
  submitAndUpdateECR,
} from "../../../services";

const PayrollCensusDetails = (props) => {
  const {
    data,
    employeeId,
    setErrorPage,
    item,
    setIsModalOpen,
    setRecordToDelete,
    refresh,
  } = props;
  // const { state, dispatch } = useContext(managePayrollStore);
  // const payrollDetails = get(state, "api.data", {});
  const [toggleEmp, setToggleEmp] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const onFormSubmit = (values) => {
    console.log(values);
    submitAndUpdateECR(values).then((response) => {
      setToggleEmp(!toggleEmp);
      refresh();
      console.log(response);
    });
  };
  const [censusOrPayrollTab, setCensusOrPayrollTab] = useState("census");
  const fields = formFields[managePayrollFormNames.ERROR_CORRECTION_FORM];
  const [payrollWarnings, setPayrollWarnings] = useState([]);
  const [censusWarnings, setCensusWarnings] = useState([]);
  const [payrollErrors, setPayrollErrors] = useState([]);
  const [censusErrors, setCensusErrors] = useState([]);
  const [errors, setErrors] = useState({});

  const onPayrollDeleteClick = (item, index) => {
    setIsModalOpen(true);
    setRecordToDelete(item);
  };
  useEffect(() => {
    getTempEmployeeDetailsforPayroll(employeeId).then((response) => {
      console.log(response, "Response is");
      console.log("Id is ", employeeId);
      setEmployeeData(response);
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
      console.log(payrollWarnings, "Warnings");
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

      var payrollWarning = response.errorMessages.filter(
        (_) => _.errorType == 2 && _.processReferenceId != 2
      );

      response.contributions?.forEach((_) => {
        _.errorMessages?.forEach((_) => {
          if (_.errorType == 2) payrollWarning.push(_);
        });
      });

      setPayrollErrors(payrollError);
      setPayrollWarnings(payrollWarning);
      setCensusErrors(
        response.errorMessages.filter(
          (_) => _.errorType == 1 && _.processReferenceId == 2
        )
      );
    });
  }, [employeeId, toggleEmp]);

  return (
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
          // enableReinitialize
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
                scrollToErrorControl(item.controlName);
              }, 500);
            };

            const disableStatus =
              censusErrors.length + payrollErrors.length > 0 ||
              censusWarnings.length + payrollWarnings.length > 0
                ? true
                : false;

            return (
              // <Form
              //   autoComplete="off"
              //   onSubmit={handleSubmit}
              //   className="h-100 d-flex"
              // >
              <div className="h-100 d-flex">
                <div className="payroll-census-tabs">
                  {console.log("File Type", data.fileType)}
                  {data.fileType == 1 ? (
                    <Tabs
                      defaultActiveKey="census"
                      activeKey={censusOrPayrollTab}
                      onSelect={onTabChange}
                      transition={false}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Tab eventKey="census" title="Census">
                        <CensusFormDetails
                          setFieldError={setFieldError}
                          setFieldTouched={setFieldTouched}
                          fields={fields}
                          data={employeeData}
                          errors={2}
                          warnings={2}
                          errorItemClick={(item) =>
                            errorItemClick(item, "census")
                          }
                        />
                      </Tab>
                    </Tabs>
                  ) : data.fileType == 2 ? (
                    <Tabs
                      defaultActiveKey="census"
                      activeKey={censusOrPayrollTab}
                      onSelect={onTabChange}
                      transition={false}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Tab eventKey="payroll" title="Payroll">
                        <PayrollFormDetails
                          fields={fields}
                          data={values}
                          errors={get(employeeData, "errors", [])}
                          warnings={get(employeeData, "warnings", [])}
                          errorItemClick={(item) =>
                            errorItemClick(item, "payroll")
                          }
                        />
                      </Tab>
                    </Tabs>
                  ) : (
                    <Tabs
                      defaultActiveKey="census"
                      activeKey={censusOrPayrollTab}
                      onSelect={onTabChange}
                      transition={false}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Tab eventKey="census" title="Census">
                        <CensusFormDetails
                          setFieldError={setFieldError}
                          setFieldTouched={setFieldTouched}
                          fields={fields}
                          data={employeeData}
                          errors={2}
                          warnings={2}
                          errorItemClick={(item) =>
                            errorItemClick(item, "census")
                          }
                        />
                      </Tab>
                      <Tab eventKey="payroll" title="Payroll">
                        <PayrollFormDetails
                          fields={fields}
                          data={values}
                          errors={get(employeeData, "errors", [])}
                          warnings={get(employeeData, "warnings", [])}
                          errorItemClick={(item) =>
                            errorItemClick(item, "payroll")
                          }
                        />
                      </Tab>
                    </Tabs>
                  )}
                </div>
                <div className="payroll-error-details-tabs">
                  <div
                    className="payrol-cencus-button-wrapper"
                    style={{ marginLeft: -60 }}
                  >
                    <span
                      type="submit"
                      style={{ color: "red" }}
                      onClick={() => onPayrollDeleteClick(item)}
                    >
                      Delete Record
                    </span>
                    &nbsp;&nbsp;
                    <Link to={ROUTES.PAYROLL}>
                      <Button type="button" variant="secondary">
                        Continue Later
                      </Button>
                    </Link>
                    &nbsp;&nbsp;
                    <Button type="submit">Submit</Button>
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
                              {censusWarnings.length + payrollWarnings.length}
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
                            }}
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
                            warningsTab={true}
                          />
                          <ErrorListingPayroll
                            head={`${payrollWarnings.length} warnings in Payroll`}
                            content={payrollWarnings}
                            employeeData={censusOrPayrollTab}
                            errorItemClick={(item) =>
                              errorItemClick(item, "payroll")
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
            );
          }}
        </Formik>
      ) : null}
    </div>
  );
};

export default PayrollCensusDetails;
