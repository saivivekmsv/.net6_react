import React from "react";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const statuClassMapping = {
  todo: "todo",
  wip: "wip",
  done: "done",
};

const ReviewWizard = ({ steps }) => {
  return (
    <div className="d-flex w-75 align-items-center review-wizard-wrapper">
      {steps.map((item) => {
        const className = statuClassMapping[item.status];
        return (
          <div className={`w-100`}>
            <div className={`w-75 wizard-progress ${className}`}>
              <FontAwesomeIcon icon={faCheckCircle} />
              &nbsp;&nbsp;{item.stepName}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewWizard;
