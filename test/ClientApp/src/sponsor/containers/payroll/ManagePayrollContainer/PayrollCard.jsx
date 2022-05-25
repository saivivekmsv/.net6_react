import React, { useEffect, useState } from "react";
import { Row, Col, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ProgressFileStatus } from "../../../../shared/components";
import { get } from "lodash";
import { numberWithCommas, usDateFormat } from "../../../../shared/utils";
import upload from "../../../../shared/styles/upload.png";
import ftp from "../../../../shared/styles/ftp.png";
import create from "../../../../shared/styles/create.png";
import moment from "moment";

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
};

const PayrollCard = (props) => {
  const {
    data,
    fixError,
    deleteUploadFile,
    Submit,
    View,
    Continue,
    AwaitingFunding,
  } = props;
  const [isShow, setShow] = useState(null);
  const [errorType, setErrorType] = useState("");
  var showTrashIcon = true;
  useEffect(() => {
    if (
      get(data, "totalNumberOfErrors", 0) &&
      get(data, "totalNumberOfWarnings", 0)
    ) {
      setErrorType(3);
    }
    if (get(data, "totalDuplicateRecordsCount", 0)) {
      setErrorType(2);
    }
  }, [data]);

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

  const getCardStyleBasedOnStatus = (fileStatus) => {
    switch (fileStatus) {
      case "ErrorCorrectionRequired":

        return "error-border";
      default:
        return "success-border";
    }
  }


  const getFileStatusToolTip = (fileStatus) => {
    let toolTips = [
      {
        fileStatus: status.DuplicateRecordsFound,
        toolTip: "Duplicate records found",
      },
      {
        fileStatus: status.CreationInProgress,
        toolTip: "Creation in progress",
      },
      {
        fileStatus: status.ErrorCorrectionRequired,
        toolTip: "Error correction required",
      },
      {
        fileStatus: status.PendingSubmission,
        toolTip: "Pending submission",
      },
      {
        fileStatus: status.AwaitingFunding,
        toolTip: "Awaiting funding",
      },
      {
        fileStatus: status.UploadInProgress,
        toolTip: "Upload in progress",
      },
      {
        fileStatus: status.AwaitingTrade,
        toolTip: "Awaiting trade",
      },
      {
        fileStatus: status.Completed,
        toolTip: "Completed",
      },
      {
        fileStatus: status.Cancelled,
        toolTip: "Cancelled",
      },
      {
        fileStatus: status.Deleted,
        toolTip: "Deleted",
      }
    ]

    var t = toolTips.find(_ => _.toolTip === "fileStatus") ?? { fileStatus: "", Tooltip: "Uploaded via FTP" };
    return t.toolTip;
  }
  let masterStyle="tile-with-border payroll-card";
  if(get(data,"fileStatus",null)==="ErrorCorrectionRequired")
  {
    masterStyle="tile-with-border payroll-card error-border pt-3 pb-3";
  }
  else{
    masterStyle="tile-with-border payroll-card success-border pt-3 pb-3";
  }
  return (
    <div className={masterStyle}>
      <Row>
        <Col md={8} className="d-flex flex-column">
          <div>
            <OverlayTrigger overlay={<Tooltip>{getFileStatusToolTip(data.fileStatus)}</Tooltip>}>
              <Image src={upload} />
            </OverlayTrigger>
            <span className="excel-text">{data.fileName}</span>
          </div>
          <div className="date-container-parent">
            <ul className="date-container">
              <li>{moment(new Date(data.uploadedOn)).format('MM/DD/yyyy')}</li>
              <li className="for-now">{moment(new Date(data.uploadedOn)).fromNow()}</li>
            </ul>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <ul className="list-unstyled">
              <li className="grey-title">Paydate</li>
              <li>{data.payDate}</li>
            </ul>
            <ul className="list-unstyled" >
              <li className="grey-title">No of records</li>
              <li> {data.totalNumberOfRecords} </li>
            </ul>
            <ul className="list-unstyled">
              <li className="grey-title">Payroll Totals</li>
              <li>  $ {data.totalAmount}</li>
            </ul>
          </div>
        </Col>
        <Col md={4} class="progress-bar-container">
          <div className="progress-container">
            {data.fileStatus === status.Completed
              ? (showTrashIcon = false)
              : (showTrashIcon = true)}
            <ProgressFileStatus
              showTrash={showTrashIcon}
              stepperDetails={data.progress}
              status={data.fileStatus}
              errorType={errorType}
              fileStatus={data.fileStatus}
              warningCount={data.totalNumberOfWarnings}
              errorCount={data.totalNumberOfErrors}
              duplicatesCount={data.totalDuplicateRecordsCount}
              onRemove={() => showPopup(data.id)}
            />
          </div>
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
          ) : data.status === status.Completed ? (
            <button className="awaiting-btn" onClick={View}>
              View
            </button>
          ) : null}

        </Col>
      </Row>
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
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PayrollCard;
