import React, { useEffect, useState } from "react";
import { Row, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ProgressFileStatus } from "../../components";
import { get } from "lodash";
import { usDateFormat } from "../../utils";
import upload from "../../styles/upload.png";
import create from "../../styles/create.png";
import moment from "moment";
import "../../styles/components/SponsorPayrollCard.scss";

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

const SponsorPayrollCard = (props) => {
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
      get(props.totalNumberOfErrors, "totalNumberOfErrors", 0) &&
      get(props.totalNumberOfWarnings, "totalNumberOfWarnings", 0)
    ) {
      setErrorType(3);
    }
    if (
      get(props.totalDuplicateRecordsCount, "totalDuplicateRecordsCount", 0)
    ) {
      setErrorType(2);
    }
  }, [props]);

  const showPopup = (id) => {
    setShow(id);
  };

  return (
    <>
      <div className={`card-box border${props.fileStatus}`}>
        <div className="payroll-card marg-r-40">
          {props.fileStatus === status.ErrorCorrectionRequired ? (
            <OverlayTrigger overlay={<Tooltip>Uploaded</Tooltip>}>
              <Image src={upload} />
            </OverlayTrigger>
          ) : props.fileStatus === status.PendingSubmission ? (
            <OverlayTrigger overlay={<Tooltip>Uploaded</Tooltip>}>
              <Image src={upload} />
            </OverlayTrigger>
          ) : props.fileStatus === status.AwaitingFunding ? (
            <OverlayTrigger overlay={<Tooltip>Uploaded via FTP</Tooltip>}>
              <Image src={upload} />
            </OverlayTrigger>
          ) : (
            <OverlayTrigger overlay={<Tooltip>Created</Tooltip>}>
              <Image src={create} />
            </OverlayTrigger>
          )}

          <span className="file-text">{props.fileName}</span>
          <span className="ft-10 grey-text">.xls</span>
          <div>
            <div className="flex-row justify-content-between date">
              <div className="ft-12 grey-text line-h-150">
                {usDateFormat(props.uploadedOn).replaceAll("-", "/")}
              </div>
              <div className="ellipse"></div>
              <div className="ft-12 dark-grey-text fw-500 line-h-150">
                {moment(new Date(props.uploadedOn)).fromNow()}
              </div>
            </div>
            <div className="border-line"></div>
            <div className="pay-date-card justify-content-between marg-r-40">
              <div classname="flex-col">
                <div className="grey-text ft-14 fw-400 line-h-150">
                  Pay Date
                </div>
                <div className="light-black ft-16 fw-500 line-h-150">
                  {props.payDate}
                </div>
              </div>
              <div classname="flex-col">
                <div className="grey-text ft-14 fw-400 line-h-150">
                  No of records
                </div>
                <div className="light-black ft-16 fw-500 line-h-150">
                  {props.totalNumberOfRecords}
                </div>
              </div>
              <div classname="flex-col">
                <div className="grey-text ft-14 fw-400 line-h-150">
                  Payroll Totals
                </div>
                <div className="light-black ft-16 fw-500 line-h-150">
                  $ {props.payrollTotals}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-col">
          <div className="progress-file-card">
            {props.fileStatus === status.Completed
              ? (showTrashIcon = false)
              : (showTrashIcon = true)}
            <ProgressFileStatus
              showTrash={showTrashIcon}
              stepperDetails={props.progress}
              status={props.fileStatus}
              errorType={errorType}
              fileStatus={props.fileStatus}
              warningCount={props.totalNumberOfWarnings}
              errorCount={props.totalNumberOfErrors}
              duplicatesCount={props.totalDuplicateRecordsCount}
              onRemove={() => showPopup(props.id)}
            />
            {props.fileStatus === status.CreationInProgress ? (
              <button className="create-btn" onClick={Continue}>
                Continue
              </button>
            ) : props.fileStatus === status.ErrorCorrectionRequired ? (
              <button
                className="error-btn"
                onClick={() => fixError(props.fileStatus)}
              >
                Fix Error
              </button>
            ) : props.fileStatus === status.DuplicateRecordsFound ? (
              <button
                className="error-btn"
                onClick={() => fixError(props.fileStatus)}
              >
                Fix Error
              </button>
            ) : props.fileStatus === status.PendingSubmission ? (
              <button className="pending-btn" onClick={Submit}>
                Submit
              </button>
            ) : props.fileStatus === status.AwaitingFunding ? (
              <button className="awaiting-btn" onClick={AwaitingFunding}>
                Fund
              </button>
            ) : props.fileStatus === status.AwaitingTrade ? (
              <button className="awaiting-btn" onClick={View}>
                View
              </button>
            ) : props.status === status.Completed ? (
              <button className="awaiting-btn" onClick={View}>
                View
              </button>
            ) : null}
          </div>
        </div>
        {isShow === props.id ? (
          <div className={isShow === props.id ? "popup-block" : "close-anime"}>
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
                  deleteUploadFile(props.fileStatus);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SponsorPayrollCard;
