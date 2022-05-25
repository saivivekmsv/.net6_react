/* eslint-disable eqeqeq */
import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PayrollFilterCard from "./PayrollFilterCard";
import { ProgressBar, LoaderWrapper } from "../../../components";
import PayrollAndCensusData from "../../../mocks/payrollAndCensusData.json";
import {
  MANAGE_PAYROLL_ROUTES,
  getPathWithParam,
  ROUTES,
  PAYROLL_RECORDS_TO_FETCH,
  getAdvancedPathWithParam,
  FLOW_TYPES,
} from "../../../utils";
import {
  deleteUploadedFile,
  getPayrollDetailsAction,
  managePayrollStore,
  refreshPayrollDetails,
} from "../../../contexts";
import PayrollCard from "./PayrollCard";
import { isEmpty, get } from "lodash";
import { faBullseyeArrow } from "@fortawesome/pro-solid-svg-icons";
import { useDeepEffect } from "../../../abstracts";
import InfiniteScroll from "react-infinite-scroller";

const today = new Date();
const toDate = new Date(today.setDate(today.getDate()));
const fromDate = new Date(today.setDate(today.getDate() - 7));

const ManagePayrollContainer = (props) => {
  const { history } = props;
  const [activeButton, setActiveButton] = useState("");
  const [fieldValues, setFieldValues] = useState({
    companyId: 0,
    planId: 0,
    fileStatus: 0,
    toDate: toDate,
    fromDate: fromDate,
    itemsAlreadyFetched: 0,
    recordsToFetch: PAYROLL_RECORDS_TO_FETCH,
  });
  const [refresh, setRefresh] = useState(true);
  const [payrollFilterLoading, setPayrollFilterLoading] = useState(false);
  const { state, dispatch } = useContext(managePayrollStore);
  const testData = [{ bgcolor: "#219653", completed: 75 }];
  const formdata = get(state, "api.fileuploadData", []);
  const Loading = get(state, "api.isFetching", false);
  const payrollStatuses = get(state, "uploadedFileStatuses", {});
  const [stopInfiniteScroll, setStopInfiniteScroll] = useState(false);
  // console.log("Main data", formdata);
  const prepareFieldValues = (values) => {
    return {
      ...values,
      companyId: values.companyId ? parseInt(values.companyId) : 0,
      planId: values.planId ? parseInt(values.planId) : 0,
      fileStatus: values.fileStatus ? values.fileStatus : 0,
    };
  };

  useDeepEffect(() => {
    dispatch(
      getPayrollDetailsAction(prepareFieldValues(fieldValues), dispatch, state)
    );
  }, [fieldValues.itemsAlreadyFetched]);

  useDeepEffect(() => {
    dispatch(
      refreshPayrollDetails(
        prepareFieldValues({
          ...fieldValues,
          itemsAlreadyFetched: 0,
          recordsToFetch: formdata.length || PAYROLL_RECORDS_TO_FETCH,
        }),
        dispatch,
        state
      )
    );
  }, [refresh]);

  useDeepEffect(
    () => setStopInfiniteScroll(get(payrollStatuses, "stopTrigger", false)),
    [payrollStatuses]
  );

  const selectButtons = (btnName) => {
    setActiveButton(btnName);
  };

  const nextPage = (id, tabNo, amount) => {
    history.push(
      getPathWithParam({
        path: ROUTES.PAYROLL_FILE_STATUS,
        pathParam: [id],
        queryParam: `?tab=${tabNo}&amount=${amount}`,
      })
    );
  };
  const deleteFile = (id) => {
    deleteUploadedFile(id);
  };
  const pageRefresh = () => {
    setRefresh(!refresh);
  };
  return (
    <LoaderWrapper isLoading={Loading || payrollFilterLoading}>
      <div className="payroll-container w-100">
        <div className="d-flex justify-content-between align-baseline">
          <div className="plan-heading font-weight-500">Payroll & Census</div>
          <div className="mt-10">
            <Link to={MANAGE_PAYROLL_ROUTES.NEW_PAYROLL_UPLOAD}>
              <Button>New Payroll</Button>
            </Link>
          </div>
        </div>
        <div className="border-top" />
        <PayrollFilterCard
          setFieldValues={setFieldValues}
          pageRefresh={pageRefresh}
          setLoading={setPayrollFilterLoading}
        />
        <div className="d-flex justify-content-between">
          <div
            className={`${
              activeButton === "ErrorCorrectionRequired"
                ? `class${2} active`
                : `class${2}`
            } d-flex justify-content-between mt-10`}
            onClick={() =>
              "ErrorCorrectionRequired" != activeButton
                ? selectButtons("ErrorCorrectionRequired")
                : selectButtons("")
            }
          >
            <div>Error Corrections required</div>
            <div
              className={
                activeButton === "ErrorCorrectionRequired" ? "" : "error-text"
              }
            >
              {get(payrollStatuses, "errorCorrection", 0)}
            </div>
          </div>
          <div
            className={`${
              activeButton === "PendingSubmission"
                ? `class${3} active`
                : `class${3}`
            } d-flex justify-content-between mt-10`}
            onClick={() =>
              "PendingSubmission" != activeButton
                ? selectButtons("PendingSubmission")
                : selectButtons("")
            }
          >
            <div>Pending Submission</div>
            <div
              className={
                activeButton === "PendingSubmission" ? "" : "pending-text"
              }
            >
              {get(payrollStatuses, "pendingSubmission", 0)}
            </div>
          </div>
          <div
            className={`${
              activeButton === "AwaitingFunding"
                ? `class${4} active`
                : `class${4}`
            } d-flex justify-content-between mt-10`}
            onClick={() =>
              "AwaitingFunding" != activeButton
                ? selectButtons("AwaitingFunding")
                : selectButtons("")
            }
          >
            <div>Awaiting Funding</div>
            <div
              className={
                activeButton === "AwaitingFunding" ? "" : "awaiting-text"
              }
            >
              {get(payrollStatuses, "awaitingFunding", 0)}
            </div>
          </div>
          <div
            className={`${
              activeButton === "CreationInProgress"
                ? `class${1} active`
                : `class${1}`
            } d-flex justify-content-between mt-10`}
            onClick={() =>
              "CreationInProgress" != activeButton
                ? selectButtons("CreationInProgress")
                : selectButtons("")
            }
          >
            <div>Creation In progress</div>
            <div
              className={
                activeButton === "CreationInProgress" ? "" : "creation-text"
              }
            >
              {get(payrollStatuses, "creationInProgress", 0)}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-20">
          <div>
            <p className="files-list-text">Last 60 days files</p>
          </div>
          <div>
            <p className="files-count font-weight-500">
              {formdata.length}/ {get(payrollStatuses, "total", 0)} files found
            </p>
          </div>
        </div>
        <div className="line-separator" style={{ marginBottom: "0px" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "10px",
            marginTop: "0px",
          }}
        >
          <Button
            className="ml-2 mt-12 sort-button"
            style={{ lineHeight: "19px" }}
            size="sm"
            variant="secondary"
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            Refresh
          </Button>
        </div>

        <div className="file-list">
          <InfiniteScroll
            pageStart={0}
            loadMore={() => {
              setFieldValues((fieldValues) => {
                return { ...fieldValues, itemsAlreadyFetched: formdata.length };
              });
            }}
            hasMore={!stopInfiniteScroll}
            initialLoad={false}
            threshold={100}
            useWindow={false}
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
          >
            {/* <div className="fil-upload">
          <Row>
            <Col md="3">
              <Image src={require("../../../styles/upload.png")} />
              <OverlayTrigger
                overlay={<Tooltip>ABC-CA 2020FEDHJAIEIEONCOBA.xls</Tooltip>}
              >
                <span className="excel-text ft-14">
                  ABC-CA 2020FEBA<span className="grey-text ft-10">.xls</span>
                </span>
              </OverlayTrigger>
            </Col>
            <Col md="3">
              <span className="ft-12 font-weight-500 grey-text mr-4">
                17:59
              </span>
              <span className="ft-12 font-weight-500 grey-text mr-4">
                02/01/2020
              </span>
              <span className="ft-12 font-weight-500 dark-grey-text mr-4">
                {" "}
                5 minutes ago
              </span>
            </Col>
            <Col md="6">
              {testData.map((item, idx) => (
                <ProgressBar
                  key={idx}
                  bgcolor={item.bgcolor}
                  completed={item.completed}
                />
              ))}
            </Col>
          </Row>
        </div> */}
            {activeButton != "" ? (
              !isEmpty(
                formdata.filter((payroll) => payroll.fileStatus == activeButton)
              ) ? (
                formdata
                  .filter((payroll) => payroll.fileStatus == activeButton)
                  .map((data, index) => (
                    <PayrollCard
                      index={index}
                      data={data}
                      history={history}
                      fixError={() => nextPage(data.id, 2, data.totalAmount)}
                      deleteUploadFile={() =>
                        deleteFile(data.id, data.totalAmount)
                      }
                      Submit={() => nextPage(data.id, 3, data.totalAmount)}
                      AwaitingFunding={() =>
                        nextPage(data.id, 4, data.totalAmount)
                      }
                      pageRefresh={pageRefresh}
                    />
                  ))
              ) : (
                <span>No results found</span>
              )
            ) : (
              <div>
                {!isEmpty(formdata) ? (
                  formdata.map((data, index) => (
                    <PayrollCard
                      index={index}
                      data={data}
                      history={history}
                      fixError={() => nextPage(data.id, 2, data.totalAmount)}
                      deleteUploadFile={() =>
                        deleteFile(data.id, data.totalAmount)
                      }
                      Submit={() => nextPage(data.id, 3, data.totalAmount)}
                      AwaitingFunding={() =>
                        nextPage(data.id, 4, data.totalAmount)
                      }
                      Continue={() =>
                        history.push(
                          getAdvancedPathWithParam({
                            path: MANAGE_PAYROLL_ROUTES.CREATE_PAYROLL_LISTING,
                            pathParam: [FLOW_TYPES.EDIT, data.id],
                          })
                        )
                      }
                      pageRefresh={pageRefresh}
                    />
                  ))
                ) : (
                  <span>No results found</span>
                )}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default ManagePayrollContainer;
