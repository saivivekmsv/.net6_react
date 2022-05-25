import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";
import { PLAN_STATUSES } from "../../utils";

const getStatusDescription = (status) => {
  if (status === PLAN_STATUSES.PENDING_APPROVAL) {
    return (
      <div>
        Setup in Progress <br /> All sections are complete. Plan is ready for
        Approval.
      </div>
    );
  }
  if (status === PLAN_STATUSES.PENDING_ACTIVATE) {
    return (
      <div>
        Plan Approved
        <br />
        This can now be activated anytime.
      </div>
    );
  }
  if (status === PLAN_STATUSES.ACTIVATED) {
    return "Plan Activated";
  }
  if (status === PLAN_STATUSES.TERMINATED) {
    return "Plan Terminated";
  }
};

const OtherStatuses = ({ status, onApprovePlanClick, onActivatePlanClick }) => {
  const checkColor = [PLAN_STATUSES.PENDING_APPROVAL].includes(status)
    ? "#BDBDBD"
    : "#3BB54A";
  return (
    <div className="d-flex align-items-center w-100 mt-5 other-statues-wrapper">
      <div className="align-self-start">
        <FontAwesomeIcon icon={faCheckCircle} size="3x" color={checkColor} />
      </div>
      <div className="ml-5">
        <div>
          <div className="status-desc">{getStatusDescription(status)}</div>
          {[
            PLAN_STATUSES.PENDING_APPROVAL,
            PLAN_STATUSES.PENDING_ACTIVATE,
          ].includes(status) && <div className="line-separator"></div>}
          {[PLAN_STATUSES.PENDING_APPROVAL].includes(status) && (
            <Button type="button" onClick={onApprovePlanClick}>
              Approve Plan
            </Button>
          )}
          {[PLAN_STATUSES.PENDING_ACTIVATE].includes(status) && (
            <Button type="button" onClick={onActivatePlanClick}>
              Activate Plan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherStatuses;
