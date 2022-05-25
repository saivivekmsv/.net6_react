import React from "react";
import { OPTIONS_DATA_MAPPER } from "../../utils";
import AddToolTip from "../AddToolTip";

const PlanLeftPanelDetails = (props) => {
  const { planName = "", rkPlanNumber = "", id, planStatus } = props;

  if (!["number", "string"].includes(typeof id)) {
    return null;
  }
  const isTruncatedPlanName = planName.length > 23;
  const transformedPlanName = isTruncatedPlanName
    ? planName.slice(0, 23) + "..."
    : planName;

  return (
    <div className="d-flex flex-column plan-name-details">
      <div>Plan name & ID</div>
      <AddToolTip name={planName} className="plan-name" />
      {/* <div className="plan-id">{id && `(${id})`}</div> */}
      <div className="plan-id">{rkPlanNumber}</div>
      <div className="plan-status">
        {OPTIONS_DATA_MAPPER.PLAN_STATUS_LIST[planStatus] || "ReadyFor"}
      </div>
    </div>
  );
};

export default PlanLeftPanelDetails;
