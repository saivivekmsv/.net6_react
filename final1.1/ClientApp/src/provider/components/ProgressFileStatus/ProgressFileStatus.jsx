import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import ErrorsWarnings from "../ErrorsWarnings";
import { get } from "lodash";

var fStatus = {
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

const ProgressFileStatus = (props) => {
  const {
    stepperDetails,
    fileStatus,
    errorType,
    onRemove,
    warnings,
    errors,
    duplicatesCount,
    status,
    showTrash,
  } = props;
  const [progress, setProgress] = useState();
  useEffect(() => {
    switch (status) {
      case fStatus.DuplicateRecordsFound:
        setProgress([
          {
            count: 1,
            status: "green",
          },
          {
            count: 2,
            status: "blue",
          },
          {
            count: 3,
            status: "grey",
          },
          {
            count: 4,
            status: "grey",
          },
        ]);
        break;
      case fStatus.ErrorCorrectionRequired:
        setProgress([
          {
            count: 1,
            status: "green",
          },
          {
            count: 2,
            status: "blue",
          },
          {
            count: 3,
            status: "grey",
          },
          {
            count: 4,
            status: "grey",
          },
        ]);
        break;
      case fStatus.CreationInProgress:
        setProgress([
          {
            count: 1,
            status: "green",
          },
          {
            count: 2,
            status: "green",
          },
          {
            count: 3,
            status: "green",
          },
          {
            count: 4,
            status: "green",
          },
        ]);
        break;
      case fStatus.StructuralValidationFailed:
        setProgress([
          {
            count: 1,
            status: "green",
          },
          {
            count: 2,
            status: "blue",
          },
          {
            count: 3,
            status: "grey",
          },
          {
            count: 4,
            status: "grey",
          },
        ]);
        break;
      case fStatus.SystemFailure:
        setProgress([
          {
            count: 1,
            status: "grey",
          },
          {
            count: 2,
            status: "grey",
          },
          {
            count: 3,
            status: "grey",
          },
          {
            count: 4,
            status: "grey",
          },
        ]);
        break;
      case fStatus.PendingSubmission:
        setProgress([
          {
            count: 1,
            status: "green",
          },
          {
            count: 2,
            status: "green",
          },
          {
            count: 3,
            status: "blue",
          },
          {
            count: 4,
            status: "grey",
          },
        ]);
        break;
      case fStatus.AwaitingFunding:
        setProgress([
          {
            count: 1,
            status: "green",
          },
          {
            count: 2,
            status: "green",
          },
          {
            count: 3,
            status: "green",
          },
          {
            count: 4,
            status: "blue",
          },
        ]);
        break;

      case fStatus.Completed:
        setProgress([
          {
            count: 1,
            status: "green",
          },
          {
            count: 2,
            status: "green",
          },
          {
            count: 3,
            status: "green",
          },
          {
            count: 4,
            status: "green",
          },
        ]);
        break;
      default:
        setProgress([]);
        break;
    }
    // console.log(status, "status");
    // console.log(progress, "progress");
  }, [status]);

  // console.log(errors, warnings, duplicatesCount, "counts");
  return (
    <>
      <div className="d-flex justify-content-between">
        {fileStatus === fStatus.Cancelled ? (
          ""
        ) : fileStatus === fStatus.Deleted ? (
          ""
        ) : (
          <div className="ft-12 black-text">
            <ul className="progress-status">
              Progress:
              {progress ? (
                progress.map((data, index) => (
                  <li
                    className={
                      data.count === status
                        ? "progress-active"
                        : data.status === "green"
                        ? "awaiting-bg"
                        : data.status === "blue"
                        ? "awaiting-blue"
                        : ""
                    }
                  >
                    {data.count}
                  </li>
                ))
              ) : (
                <span> No data</span>
              )}
            </ul>
          </div>
        )}
        {fileStatus === fStatus.Cancelled ? (
          ""
        ) : fileStatus === fStatus.Deleted ? (
          ""
        ) : (
          <div>
            {showTrash ? (
              <div onClick={onRemove}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  size="13px"
                  color="#FF0000"
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div>
        <p className="ft-12 font-weight-500 mt-10 mb-10 text-black">
          Status :{" "}
          {fileStatus === fStatus.ErrorCorrectionRequired ? (
            <span className="error-text">Error Corrections required</span>
          ) : fileStatus === fStatus.DuplicateRecordsFound ? (
            <span className="error-text">Error Corrections required</span>
          ) : fileStatus === fStatus.StructuralValidationFailed ? (
            <span className="error-text">Error in File Processor</span>
          ) : fileStatus === fStatus.SystemFailure ? (
            <span className="error-text">System Failure</span>
          ) : fileStatus === fStatus.PendingSubmission ? (
            <span className="pending-text">Pending Submission</span>
          ) : fileStatus === fStatus.AwaitingFunding ? (
            <span className="awaiting-text">Awaiting funding</span>
          ) : fileStatus === fStatus.CreationInProgress ? (
            <span className="creation-text">Creation in progress</span>
          ) : fileStatus === fStatus.Cancelled ? (
            "Cancelled"
          ) : fileStatus === fStatus.Deleted ? (
            "Deleted"
          ) : fileStatus === fStatus.AwaitingTrade ? (
            <span className="awaiting-text">Awaiting Trade</span>
          ) : fileStatus === fStatus.Completed ? (
            <span className="awaiting-text">Completed</span>
          ) : null}
        </p>
      </div>
      <div>
        <p className="ft-12 black-text font-weight-500 mb-10">
          {errorType === 2 ? (
            <span>
              <span className="error-text ft-14">{duplicatesCount}</span>{" "}
              Duplicates founds
            </span>
          ) : errorType === 3 ? (
            <ErrorsWarnings errors={errors} warnings={warnings} />
          ) : fileStatus === fStatus.CreationInProgress ? (
            "File creation in progress"
          ) : null}
        </p>
      </div>
    </>
  );
};

export default ProgressFileStatus;
