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
  Modal,
} from "react-bootstrap";
import {
  faExclamationTriangle,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import ErrorReports from "./ErrorReportsTypes/ErrorReports";
import WarningReports from "./ErrorReportsTypes/WarningReports";
import AllRecordReports from "./ErrorReportsTypes/AllRecordReports";
import errorReports from "../../../mocks/errorReports.json";
import allRecordReports from "../../../mocks/allRecordReports.json";
import warningReports from "../../../mocks/warningReports.json";
import { Link } from "react-router-dom";
import { MANAGE_PAYROLL_ROUTES } from "../../../utils";
import { get } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import upload from "../../../styles/upload.png";
import {
  getWarningsInECR,
  getErrorsInECR,
  getAllRecords,
  getRevalidateFile,
  acceptEmployeeWarnings,
} from "../../../services/payroll/index";
import { useParams, useHistory } from "react-router-dom";

const ErrorFoundRecords = (props) => {
  const {
    onClick,
    countDetails,
    revalidateIds,
    info,
    fileId,
    fileType,
    setRecordsListType,
    tabChange,
    pendingSubmission,
    toggleFileStatus,
    toggleAcceptWarning,
    setEcrSubmit,
  } = props;
  const [selectedTabIndex, setTabIndex] = useState("warning");
  // console.log(warningList, errorList, recordsList, graphData, info, "lists");
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [warningToggle, setWarningToggle] = useState(true);
  const [errorToggle, setErrorToggle] = useState(true);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const revalidateFile = {
    userId: 1,
    uploadedFileType: info.fileType || fileType,
    fileUploadId: parseInt(fileId),
  };
  console.log("revalidate", revalidateFile);
  useEffect(() => {
    getWarningsInECR(fileId).then((response) => {
      setWarnings(response.filter((x) => x.referenceId !== 0).map((x) => x));
      var not = response.filter((x) => x.referenceId === 0);
      setNotification(not);
      if (not.length > 0) setisModalOpen(true);
    });
  }, [toggle]);
  console.log(
    notification,
    "WARNING RECORDS",
    notification.length,
    isModalOpen
  );
  useEffect(() => {
    getErrorsInECR(fileId).then((response) => {
      setErrors(response.map((x) => x.employeeErrors.length));
    });
  }, [toggle]);
  console.log(errors, "ERROR RECORDS");
  useEffect(() => {
    getAllRecords(fileId).then((response) => {
      setAllRecords(response);
      //console.log(response, "ALL RECORDS", fileId);
    });
  }, [toggle]);
  const history = useHistory();
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
  const handleClose = () => {
    setisModalOpen(false);
  };
  const AcceptNotificationClick = () => {
    //values.acceptWarning = true;
    setisModalOpen(false);
    console.log(notification.map((x) => x.lookUpId[0]));
    acceptEmployeeWarnings({
      acceptedWarningIds: notification.map((x) => x.lookUpId[0]),
      fileUploadId: fileId,
    });
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
        {fileType != 1 && (
          <Col md="3" className="text-right mt-10">
            <Button
              variant="secondary"
              onClick={() => {
                revalidateIds(revalidateFile);
              }}
            >
              Revalidate
            </Button>
          </Col>
        )}
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
                  setEcrSubmit={setEcrSubmit}
                  fileId={fileId}
                  toggleUseEffect={toggleUseEffect}
                  tabChange={tabChange}
                  toggleAcceptWarning={toggleAcceptWarning}
                />
              ) : (
                "No Records Found"
              )}
            </Tab>
            <Tab
              eventKey="errors"
              title={
                <div>
                  Errors{" "}
                  <span className="error-text">
                    {
                      //get(countDetails, "errorsCount", 0)
                      errors.reduce((result, number) => result + number, 0)
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
              ) : (
                "No Records Found"
              )}
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
                  pendingSubmission={pendingSubmission}
                  toggleUseEffect={toggleUseEffect}
                />
              ) : (
                "No Records Found"
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
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
              {notification.map((x) => (
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
    </div>
  );
};

export default ErrorFoundRecords;
