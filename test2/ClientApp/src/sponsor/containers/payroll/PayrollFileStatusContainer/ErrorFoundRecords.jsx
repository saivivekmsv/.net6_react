import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  Tab,
  Tabs,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import ErrorReports from "./ErrorReportsTypes/ErrorReports";
import WarningReports from "./ErrorReportsTypes/WarningReports";
import AllRecordReports from "./ErrorReportsTypes/AllRecordReports";

import { Link } from "react-router-dom";
import { MANAGE_PAYROLL_ROUTES } from "shared/utils";
import { get } from "lodash";
import upload from "../../../../shared/styles/upload.png";
import {
  getWarningsInECR,
  getErrorsInECR,
  getAllRecords,
} from "../../../services/payroll/index";
import { useParams } from "react-router-dom";

const ErrorFoundRecords = (props) => {
  const {
    onClick,
    countDetails,
    info,
    fileId,
    setRecordsListType,
    tabChange,
    toggleFileStatus,
  } = props;
  const [selectedTabIndex, setTabIndex] = useState("warning");
  // console.log(warningList, errorList, recordsList, graphData, info, "lists");
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [warningToggle, setWarningToggle] = useState(true);
  const [errorToggle, setErrorToggle] = useState(true);
  useEffect(() => {});
  useEffect(() => {
    getWarningsInECR(fileId).then((response) => {
      setWarnings(response);
      console.log(response, "WARNING RECORDS", fileId);
    });
  }, [toggle]);
  useEffect(() => {
    getErrorsInECR(fileId).then((response) => {
      setErrors(response);
      console.log(response, "ERROR RECORDS", fileId);
    });
  }, [toggle]);
  useEffect(() => {
    getAllRecords(fileId).then((response) => {
      setAllRecords(response);
      console.log(response, "ALL RECORDS", fileId);
    });
  }, [toggle]);
  const recordsType = {};
  const onTabSelect = (id) => {
    setTabIndex(id);
    setRecordsListType(id);
  };
  // const warningLength = warningReports.reduce((sum, current) => {
  //   return sum + current.warningCount;
  // }, 0);
  const toggleUseEffect = () => {
    setToggle(!toggle);
    toggleFileStatus();
  };
  return (
    <div className="file-information">
      <div className="d-flex justify-content-between">
        <div className="mt-10 payroll-sub-head">Errors Found in records</div>
        <div className="mt-20 ft-12 text-black font-weight-500">
          Total Records {get(info, "totalRecords", 0)}
        </div>
      </div>
      <div className="border-top" />
      <Row>
        <Col md="9" className="mt-20">
          {get(info, "fileName", "") &&
          get(info, "fileName", "").length >= 30 ? (
            <div>
              <p className="text-black ft-14 font-weight-500">
                <Image src={upload} className="mr-3" />
                <OverlayTrigger
                  overlay={<Tooltip>{get(info, "fileName", "")}</Tooltip>}
                >
                  <span className="mr-4">
                    {(get(info, "fileName", "") || "").slice(0, 30)}... .xlsx
                  </span>
                </OverlayTrigger>
                <Link to={MANAGE_PAYROLL_ROUTES.NEW_PAYROLL_UPLOAD}>
                  Reupload File
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-black ft-14 font-weight-500">
                <Image src={upload} className="mr-3" />
                <span className="mr-4">{get(info, "fileName", "")}</span>
                <Link to={MANAGE_PAYROLL_ROUTES.NEW_PAYROLL_UPLOAD}>
                  Reupload File
                </Link>
              </p>
            </div>
          )}
        </Col>
        <Col md="3" className="text-right mt-10">
          <Button variant="secondary">Revalidate</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs
            defaultActiveKey="warning"
            transition={false}
            className="errors-level-tab"
            onSelect={onTabSelect}
            activeKey={selectedTabIndex}
            mountOnEnter
            unmountOnExit
          >
            <Tab
              eventKey="warning"
              title={
                <div>
                  Warnings{" "}
                  <span className="pending-text">
                    {
                      //get(countDetails, "warningsCount", 0)
                      warnings.length
                    }
                  </span>
                </div>
              }
            >
              {warnings.length > 0 ? (
                <WarningReports
                  fileId={fileId}
                  toggleUseEffect={toggleUseEffect}
                  tabChange={tabChange}
                />
              ) : null}
            </Tab>
            <Tab
              eventKey="errors"
              title={
                <div>
                  Errors{" "}
                  <span className="error-text">
                    {
                      //get(countDetails, "errorsCount", 0)
                      errors.length
                    }
                  </span>
                </div>
              }
            >
              {errors.length > 0 ? (
                <ErrorReports
                  onClick={onClick}
                  fileId={fileId}
                  toggleUseEffect={toggleUseEffect}
                />
              ) : null}
            </Tab>
            <Tab
              eventKey="all_records"
              title={
                <div>
                  All records{" "}
                  <span className="black-text">{allRecords.length}</span>{" "}
                </div>
              }
            >
              {allRecords.length > 0 ? (
                <AllRecordReports
                  onClick={onClick}
                  fileId={fileId}
                  toggleUseEffect={toggleUseEffect}
                />
              ) : null}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default ErrorFoundRecords;
