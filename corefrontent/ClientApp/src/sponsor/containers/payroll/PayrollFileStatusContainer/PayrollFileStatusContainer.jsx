import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { LoaderWrapper } from "../../../../shared/components";
import { Tabs, Tab } from "react-bootstrap";
import FileInformation from "./FileInformation";
import ErrorFoundRecords from "./ErrorFoundRecords";
import PayrollSubmission from "./PayrollSubmission";
import ErrorDuplicates from "./ErrorDuplicate";
import DataMismatchErrors from "./DataMismatchErrors";
import PayrollFunding from "./PayrollFunding/PayrollFunding";
import ErrorFoundInRecordsContainer from "../ErrorFoundInRecordsContainer";
import PayrollAndCensusData from "../../../../shared/mocks/payrollAndCensusData.json";
import { useRouterParams, useDeepEffect, useRequest } from "../../../../shared/abstracts";
import { find, get, isEmpty } from "lodash";
import {
  getParamsFromQueryString,
  ROUTES,
  getPathWithParam,
  MANAGE_PAYROLL_ROUTES,
} from "shared/utils";
import { Redirect, Link, useLocation } from "react-router-dom";
import { getDataTyeMisMatchErrors } from "sponsor/services";
import {
  getFileInfo,
  getFileGraphInfo,
  managePayrollStore,
  errorList,
  warningList,
  recordList,
} from "sponsor/contexts";
import {
  getWarningsInECR,
  getErrorsInECR,
  getAllRecords,
  getCorrectAcceptDuplicateEmployee,
} from "sponsor/services/payroll/index";
const PayrollFileStatus = (props) => {
  const { history } = props;
  const [keyValue, setKeyValue] = useState(1);
  const [errorPage, setErrorPage] = useState(false);
  const [warningPage, setWarningPage] = useState(true);
  const { state, dispatch } = useContext(managePayrollStore);
  const [errorType, setErrorType] = useState();
  const { payrollId } = useRouterParams();
  const intPayrollId = parseInt(payrollId, 10);
  const [empId, setEmpId] = useState(0);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const Loading = get(state, "api.isFetching", true);
  const [errors, setErrors] = useState([]);
  const [DuplicateEmployee, SetDuplicateEmployee] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [toggle, setToggle] = useState(true);
  const search = useLocation().search;
  const amount = new URLSearchParams(search).get("amount");
  console.log(intPayrollId, "intPayrollId");
  const toggleFileStatus = () => {
    setToggle(!toggle);
  };
  // const payrollDetails =
  //   find(PayrollAndCensusData, {
  //     id: intPayrollId,
  //   }) || {};
  console.log("Amount is ", amount);
  console.log(state, "wholestate");
  console.log(get(state, "api.data", {}), "fileInfo");
  console.log(get(state, "api.graphDetails", {}), "graphInfo");
  console.log("Error count is ", errors.length);
  const payrollDetails = get(state, "api.data", {});
  const graphdetails = get(state, "api.graphDetails", {});
  console.log(graphdetails, "graphdetails - 1");
  const { response: result, loading: load } = useRequest({
    method: getDataTyeMisMatchErrors,
    payload: payrollId,
    defaultResponse: [],
  });
  useEffect(() => {
    getErrorsInECR(payrollId).then((response) => {
      setErrors(response);
      console.log(response, "ERROR RECORDS", payrollId);
    });
    getAllRecords(payrollId).then((response) => {
      setAllRecords(response);
    });
  }, [toggle]);
  useEffect(() => {
    getWarningsInECR(payrollId).then((response) => {
      setWarnings(response);
      console.log(response, "Warning RECORDS", payrollId);
    });
  }, [toggle]);
  console.log("Duplicate Count is ", get(graphdetails, "duplicatesCount", 0));
  console.log("Error Count is ", get(graphdetails, "errorsCount", 0));
  console.log("Warning Count is ", get(graphdetails, "status", 0));
  const DisableStatus = errors.length > 0 || warnings.length > 0 ? true : false;
  const [recordsListType, setRecordsListType] = useState("");

  const DeleteEmployeeId = (i) => {
    setIsLoading(true);
    getCorrectAcceptDuplicateEmployee(i).then((response) => {
      console.log("Correct Accept Duplicate Employee reasponse", response);
      setIsLoading(false);
      window.location.reload();
      if (!response) {
        console.log("erorrrrrr");
        history.push(
          getPathWithParam({
            path: MANAGE_PAYROLL_ROUTES.UPLOADED_FILES_LISTING,
          })
        );
      }
    });
  };

  useDeepEffect(() => {
    dispatch(getFileInfo(payrollId, dispatch, state));
    dispatch(getFileGraphInfo(payrollId, dispatch, state));
    // if (get(graphdetails, "duplicatesCount", 0)) {
    //   setErrorType(2);
    // } else if (
    //   get(graphdetails, "errorsCount", 0)  ||
    //   get(graphdetails, "warningsCount", 0)
    // ) {
    //   setErrorType(3);
    // } else if (result) {
    //   setErrorType(1);
    // }
  }, [payrollId]);
  useEffect(() => {
    if (get(graphdetails, "duplicatesCount", 0)) {
      setErrorType(2);
    } else if (
      get(graphdetails, "errorsCount", 0) ||
      get(graphdetails, "warningsCount", 0)
    ) {
      setErrorType(3);
    } else if (result) {
      setErrorType(1);
    }
  }, [graphdetails]);
  useEffect(() => {
    const tabIdFromQuery = getParamsFromQueryString("tab");
    setKeyValue(tabIdFromQuery || 1);
  }, []);
  useEffect(() => {
    if (
      get(graphdetails, "errorsCount", 0) &&
      get(graphdetails, "warningsCount", 0)
    ) {
      dispatch(errorList(payrollId, dispatch, state));
      dispatch(warningList(payrollId, dispatch, state));
      dispatch(recordList(payrollId, dispatch, state));
    }
    if (get(graphdetails, "errorsCount", 0)) {
      dispatch(errorList(payrollId, dispatch, state));
      dispatch(recordList(payrollId, dispatch, state));
    }
    if (get(graphdetails, "warningsCount", 0)) {
      dispatch(warningList(payrollId, dispatch, state));
      dispatch(recordList(payrollId, dispatch, state));
    }
  }, [errorType]);
  console.log(errorType, "errorType");
  // console.log('Error count is',get(graphdetails, "errorsCount"));
  console.log("Graph details are", graphdetails);
  const tabChange = (key) => {
    setKeyValue(key);
  };

  const censusAndErrorPage = (records, id) => {
    setRecords(records);
    setEmpId(id);
    setErrorPage(true);
  };

  // const duplicatePage = () => {
  //   AccptedEmployeeId();
  //   DeletedEmployeeIds();
  // };

  return (
    
    <LoaderWrapper isLoading={Loading || isLoading}>
      <div className="payroll-file-status-wrapper">
        <div className="d-flex justify-content-between align-baseline">
          <div className="payroll-heading font-weight-500">
            Payroll Submission
          </div>
          <div className="mtb-auto">
            <Link to={ROUTES.PAYROLL}>
              <FontAwesomeIcon icon={faTimes} size="18px" color="#333" />
            </Link>
          </div>
        </div>
      
        <div className="bt-1 tabs-wrapper">
          <Tabs activeKey={keyValue} transition={false} onSelect={tabChange}>
            <Tab
              eventKey={1}
              title={
                <div className="d-flex">
                  <div
                    className={`file-progress-circle ${
                      keyValue === 1 ? "active" : 2 ? "success-tab" : ""
                    }`}
                  >
                    1
                  </div>
                  <div>
                    &nbsp;<span className="title-file">File Information</span>{" "}
                    <br />
                    <span className="sub-title-file">
                      File creations and Informations
                    </span>
                  </div>
                </div>
              }
            >
              <FileInformation
                data={payrollDetails}
                errorType={errorType}
                graphData={graphdetails}
              />
            </Tab>
            <Tab
              eventKey={2}
              title={
                <div className="d-flex">
                  <div
                    className={`file-progress-circle ${
                      keyValue === "2" ? "active" : "3" ? "success-tab" : ""
                    }`}
                  >
                    2
                  </div>
                  <div>
                    &nbsp;
                    <span className="title-file">Validation & Errors</span>{" "}
                    <br />
                    <span className="sub-title-file">
                      File validations and Business error
                    </span>
                  </div>
                </div>
              }
              disabled={false}
            >
              {errorType === 0
                ? result && <DataMismatchErrors data={payrollDetails} />
                : null}
              {warningPage === false
                ? errorType === 2 && (
                    <ErrorDuplicates
                      data={get(payrollDetails, "duplidateErrors", [])}
                      onClick={() => setWarningPage(true)}
                      fileId={payrollId}
                      toggleFileStatus={toggleFileStatus}
                    />
                  )
                : null}
              {errorPage === false ? (
                ![1, 2].includes(errorType) ? (
                  <ErrorFoundRecords
                    info={payrollDetails}
                    countDetails={graphdetails}
                    onClick={censusAndErrorPage}
                    fileId={payrollId}
                    toggleFileStatus={toggleFileStatus}
                    setRecordsListType={setRecordsListType}
                    tabChange={tabChange}
                    // fileName={get(payrollDetails, "fileName", {})}
                  />
                ) : ![1, 3].includes(errorType) ? (
                  <ErrorDuplicates
                    onClick={(i) => {
                      DeleteEmployeeId(i);
                    }}
                    info={payrollDetails}
                    fileId={payrollId}
                    datas={payrollDetails}
                    toggleFileStatus={toggleFileStatus}
                  />
                ) : (
                  <ErrorFoundRecords
                    info={payrollDetails}
                    countDetails={graphdetails}
                    onClick={censusAndErrorPage}
                    fileId={payrollId}
                    toggleFileStatus={toggleFileStatus}
                    setRecordsListType={setRecordsListType}
                    tabChange={tabChange}
                    // fileName={get(payrollDetails, "fileName", {})}
                  />
                )
              ) : (
                <ErrorFoundInRecordsContainer
                  data={payrollDetails}
                  employeeData={payrollDetails}
                  empId={empId}
                  fileId={payrollId}
                  countDetails={graphdetails}
                  toggleFileStatus={toggleFileStatus}
                  setErrorPage={setErrorPage}
                  fileName={get(payrollDetails, "fileName", {})}
                  recordsListType={recordsListType}
                  errorCount={errors.length}
                  allRecords={allRecords}
                  errors={errors}
                />
              )}
            </Tab>
            <Tab
              eventKey={3}
              title={
                <div className="d-flex">
                  <div
                    className={`file-progress-circle ${
                      keyValue === "3"
                        ? "active"
                        : Number(keyValue + 1) === 41
                        ? "success-tab"
                        : ""
                    }`}
                  >
                    3
                  </div>
                  <div>
                    &nbsp;<span className="title-file">Payroll Submission</span>{" "}
                    <br />
                    <span className="sub-title-file">
                      Submit payroll for funding
                    </span>
                  </div>
                </div>
              }
              disabled={DisableStatus}
            >
              <PayrollSubmission
                fileId={payrollId}
                totalFunding={amount}
                data={payrollDetails}
                tabChange={tabChange}
              />
            </Tab>
            <Tab
              eventKey={4}
              title={
                <div className="d-flex">
                  <div
                    className={`file-progress-circle ${
                      keyValue === "4" ? "active" : ""
                    }`}
                  >
                    4
                  </div>
                  <div>
                    &nbsp;<span className="title-file">Payroll Funding</span>{" "}
                    <br />
                    <span className="sub-title-file">Funding process</span>
                  </div>
                </div>
              }
              disabled={DisableStatus}
            >
              <PayrollFunding data={payrollDetails} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default PayrollFileStatus;
