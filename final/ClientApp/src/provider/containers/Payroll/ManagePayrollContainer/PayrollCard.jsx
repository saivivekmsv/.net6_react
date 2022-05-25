import React, { useEffect, useState } from "react";
import { Row, Col, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ProgressFileStatus } from "../../../components";
import { get } from "lodash";
import {
  getAdvancedPathWithParam,
  numberWithCommas,
  ROUTES,
  usDateFormat,
} from "../../../utils";
import upload from "../../../styles/upload.png";
import ftp from "../../../styles/ftp.png";
import create from "../../../styles/create.png";
import moment from "moment";
import { useHistory } from "react-router-dom";

var status = {
  DuplicateRecordsFound: "DuplicateRecordsFound",
  CreationInProgress: "CreationInProgress",
  ErrorCorrectionRequired: "ErrorCorrectionRequired",
  PendingSubmission: "PendingSubmission",
  AwaitingFunding: "AwaitingFunding",
  UploadInProgress: "UploadInProgress",
  AwaitingTrade: "AwaitingTrade",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Deleted: "Deleted",
  StructuralValidationFailed: "StructuralValidationFailed",
  SystemFailure: "SystemFailure",
};

const PayrollCard = (props) => {
  const history = useHistory();
  const {
    data,
    fixError,
    deleteUploadFile,
    Submit,
    View,
    Continue,
    AwaitingFunding,
    pageRefresh,
  } = props;
  const [isShow, setShow] = useState(null);
  const [errorType, setErrorType] = useState("");
  var showTrashIcon = true;
  useEffect(() => {
    if (
      get(data, "totalNumberOfErrors", 0) ||
      get(data, "totalNumberOfWarnings", 0)
    ) {
      setErrorType(3);
    }
    if (get(data, "totalDuplicateRecordsCount", 0)) {
      setErrorType(2);
    }
  }, [data]);
  // console.log(
  //   get(data, "totalNumberOfErrors", 0),
  //   get(data, "totalNumberOfWarnings", 0),
  //   get(data, "totalNumberOfErrors", 0) && get(data, "totalNumberOfWarnings", 0)
  // );
  //   const values = get(data,"fileStatus",{});
  // const status = (values) => {

  //   switch(values)
  //   {
  //     case "ErrorCorrectionRequired" :
  //       return 1;
  //     case "AwaitingFunding" :
  //       return 2;
  //     case "PendingSubmission":
  //       return 3;
  //     case "CreationInProgress" :
  //       return 4;
  //     default :
  //       return null;
  //   }
  // };

  // console.log(status,"status");

  const showPopup = (id) => {
    setShow(id);
  };
  const completedView = () => {
    history.push(
      getAdvancedPathWithParam({
        path: ROUTES.PAYROLL_REPORTS,

        pathParam: [data.id],
      })
    );
  };

  return (
    <>
      <div className={`card-box border${data.fileStatus}`}>
        <Row>
          <Col md="9">
            {data.fileStatus === status.ErrorCorrectionRequired ? (
              <OverlayTrigger overlay={<Tooltip>Uploaded</Tooltip>}>
                <Image src={upload} />
              </OverlayTrigger>
            ) : data.fileStatus === status.PendingSubmission ? (
              <OverlayTrigger overlay={<Tooltip>Uploaded</Tooltip>}>
                <Image src={upload} />
              </OverlayTrigger>
            ) : data.fileStatus === status.CreationInProgress ? (
              <OverlayTrigger overlay={<Tooltip>Created</Tooltip>}>
                <Image src={create} />
              </OverlayTrigger>
            ) : (
              <OverlayTrigger overlay={<Tooltip>Uploaded via FTP</Tooltip>}>
                <Image src={upload} />
              </OverlayTrigger>
            )}
            {/* <OverlayTrigger overlay={<Tooltip>Uploaded</Tooltip>}>
              <Image src={upload} />
            </OverlayTrigger> */}
            <span className="excel-text">
              {data.fileName.length > 40 ? (
                <OverlayTrigger
                  placement="top-start"
                  overlay={<Tooltip>{data.fileName}</Tooltip>}
                >
                  <p className="ft-12 mt-10 para-wrap two-lines">
                    {(data.fileName || "").slice(0, 40)}...
                  </p>
                </OverlayTrigger>
              ) : (
                <p className="ft-12 mt-10 para-wrap two-lines">
                  {data.fileName}
                </p>
              )}
            </span>
            <Row>
              <Col md="4" className="br-1">
                {data.description != null && data.description.length > 100 ? (
                  <OverlayTrigger
                    overlay={<Tooltip>{data.description}</Tooltip>}
                  >
                    <p className="ft-12 mt-10 para-wrap two-lines">
                      {data.description}
                    </p>
                  </OverlayTrigger>
                ) : (
                  <p className="ft-12 mt-10 para-wrap two-lines">
                    {data.description}
                  </p>
                )}
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="ft-12 dark-grey-text font-weight-500">
                      {moment(new Date(data.uploadedOn)).fromNow()}
                    </p>
                  </div>
                  <div className="mr-2 ft-12 grey-text">
                    <p>{usDateFormat(data.uploadedOn).replaceAll("/", "-")}</p>
                  </div>
                </div>
              </Col>
              <Col md="4">
                {data.companyName?.length > 50 ? (
                  <OverlayTrigger
                    overlay={<Tooltip>{data.companyName}</Tooltip>}
                  >
                    <p className="ft-14 black-text font-weight-500 mt-100 mb-10">
                      {(data.companyName || "").slice(0, 30)}...
                    </p>
                  </OverlayTrigger>
                ) : (
                  <p className="ft-14 black-text font-weight-500 mt-100 mb-10">
                    {data.companyName}
                  </p>
                )}
                {/* {data.fileStatus==} */}
                <p className="ft-10 grey-text font-weight-400 mbb-5">
                  Plan name & ID{" "}
                </p>
                {data.planName && data.planName.length > 40 ? (
                  <OverlayTrigger overlay={<Tooltip>{data.planName}</Tooltip>}>
                    <p className="ft-12 black-text font-weight-400 title-wrap mbb-5">
                      {(data.planName || "").slice(0, 30)}...
                    </p>
                  </OverlayTrigger>
                ) : (
                  <p className="ft-12 black-text font-weight-400 title-wrap mbb-5">
                    {data.planName}
                  </p>
                )}
                <p className="ft-12 black-text font-weight-400 mbb-5">
                  <span className="grey-text">ID :</span> {data.rkPlanNumber}
                </p>
              </Col>
              <Col md="4">
                <div className="d-flex justify-content-between mt-100">
                  <div className="light-black ft-12 font-weight-500">
                    {data.payrollFrequencyName}
                  </div>
                  <div className="light-black ft-12 font-weight-500">
                    $ {parseFloat(data.totalAmount)?.toFixed(2)}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-10">
                  <div className="grey-text ft-10 font-weight-400">
                    Pay date
                  </div>
                  <div className="grey-text ft-10 font-weight-400">
                    No of records
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-10">
                  <div className="light-black ft-12 font-weight-500">
                    {data.payDate}
                  </div>
                  <div className="light-black ft-12 font-weight-500">
                    {data.totalNumberOfRecords}
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col md="3">
            {data.fileStatus === status.Completed
              ? (showTrashIcon = false)
              : (showTrashIcon = true)}
            <div className="ft-12 mt-10">
              <ProgressFileStatus
                showTrash={showTrashIcon}
                stepperDetails={data.progress}
                status={data.fileStatus}
                errorType={errorType}
                errors={get(data, "totalNumberOfErrors", 0)}
                warnings={get(data, "totalNumberOfWarnings", 0)}
                fileStatus={data.fileStatus}
                warningCount={data.totalNumberOfWarnings}
                errorCount={data.totalNumberOfErrors}
                duplicatesCount={data.totalDuplicateRecordsCount}
                onRemove={() => showPopup(data.id)}
              />
              {data.fileStatus === status.CreationInProgress ? (
                <button className="create-btn" onClick={Continue}>
                  Continue
                </button>
              ) : data.fileStatus === status.ErrorCorrectionRequired ? (
                <button
                  className="error-btn"
                  onClick={() => fixError(data.fileStatus)}
                >
                  Fix Error
                </button>
              ) : data.fileStatus === status.DuplicateRecordsFound ? (
                <button
                  className="error-btn"
                  onClick={() => fixError(data.fileStatus)}
                >
                  Fix Error
                </button>
              ) : data.fileStatus === status.PendingSubmission ? (
                <button className="pending-btn" onClick={Submit}>
                  Submit
                </button>
              ) : data.fileStatus === status.AwaitingFunding ? (
                <button className="awaiting-btn" onClick={AwaitingFunding}>
                  View
                </button>
              ) : data.fileStatus === status.AwaitingTrade ? (
                <button className="awaiting-btn" onClick={View}>
                  View
                </button>
              ) : data.fileStatus === status.Completed ? (
                <button className="awaiting-btn" onClick={completedView}>
                  View
                </button>
              ) : data.fileStatus === status.StructuralValidationFailed ? (
                <button
                  className="error-btn"
                  onClick={() => fixError(data.fileStatus)}
                >
                  View
                </button>
              ) : null}
            </div>
          </Col>
          {isShow === data.id ? (
            <div className={isShow === data.id ? "popup-block" : "close-anime"}>
              <div className="popup-bg">
                <p>Delete file?</p>
                <p>This file will be permanently deleted from payroll.</p>
                <button
                  className="cancel-btn mr-4"
                  onClick={() => showPopup(null)}
                >
                  Cancel
                </button>
                <button
                  className="danger-btn"
                  onClick={() => {
                    showPopup(null);
                    deleteUploadFile(data.fileStatus);
                    pageRefresh();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </Row>
      </div>
    </>
  );
};

export default PayrollCard;
