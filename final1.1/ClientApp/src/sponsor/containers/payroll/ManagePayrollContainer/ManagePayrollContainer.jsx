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
import Sidebar from "./sidebar";
import PayrollFilterCard from "./PayrollFilterCard";
import { ProgressBar, LoaderWrapper } from "../../../../shared/components";
import PayrollAndCensusData from "../../../../shared/mocks/payrollAndCensusData.json";
import {
  MANAGE_PAYROLL_ROUTES,
  getPathWithParam,
  ROUTES,
  PAYROLL_RECORDS_TO_FETCH,
  getAdvancedPathWithParam,
  FLOW_TYPES,
} from "../../../../shared/utils";
import {
  deleteUploadedFile,
  getPayrollDetailsAction,
  managePayrollStore,
  refreshPayrollDetails,
} from "../../../contexts";
import PayrollCard from "./PayrollCard";
import { isEmpty, get } from "lodash";
import { faBullseyeArrow } from "@fortawesome/pro-solid-svg-icons";
import { useDeepEffect } from "../../../../shared/abstracts";
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

  useEffect(() => {
    dispatch(
      getPayrollDetailsAction(prepareFieldValues(fieldValues), dispatch, state)
    );
  }, [fieldValues]);

  useDeepEffect(
    () => {
      dispatch(
        refreshPayrollDetails(
          prepareFieldValues({
            ...fieldValues,
            itemsAlreadyFetched: 0,
            recordsToFetch: formdata.length,
          }),
          dispatch,
          state
        )
      );
    },
    [refresh],
    true
  );

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
  const content = {
    noOfActiveFiles: 5,
    upComingPayoll: today,
    sponsorLogo: "https://storageaccountcore2ad3a.blob.core.windows.net:443/companyimagecontainer/7",
    warnings: ["WC001 : The source contribution received is negative", "WC002 : IRS 402(g) contribution limit exceeded", "WC003 : Pay period recevied is greater than 56 for daily frequency"],
    errors: ["WC001 : The source contribution received is negative", "WC002 : IRS 402(g) contribution limit exceeded", "WC003 : Pay period recevied is greater than 56 for daily frequency"],
  }
  return (

    <LoaderWrapper isLoading={Loading || payrollFilterLoading}>
      <Row>
        <Col md={3}>
          <Sidebar content={content}></Sidebar>
        </Col>
        <Col md={9}>

          <Row className="mb-5">
            <Col>
              <PayrollFilterCard setFieldValues={setFieldValues}
                setLoading={setPayrollFilterLoading}></PayrollFilterCard>
            </Col>
          </Row>
          <div className="w-100 d-flex flex-column align-items-end pb-4">
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
          <Row>
            <Col>
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
              <Image src={require("shared/stylespload.png")} />
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
                          key={index}
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
                        />
                      ))
                    ) : (
                      <span>No results found</span>
                    )}
                  </div>
                )}
              </InfiniteScroll>
            </Col>
          </Row>
        </Col>
      </Row>
    </LoaderWrapper>
  );
};

export default ManagePayrollContainer;
