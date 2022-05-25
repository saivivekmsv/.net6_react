import React, { useContext, useState } from "react";
import { find, get } from "lodash";
import { createPlanStore } from "../../../contexts";
import { useRouterParams } from "../../../abstracts";
import { ReviewStatus, ReviewWizard } from "../../../components";
import planStatus from "../../../mocks/planStatus.json";
import { PLAN_STATUSES } from "../../../utils";
import { setPlanStatus } from "../../../services";
import { setPageLevelPlanStatus } from "../../../contexts/reducers";
const getApprovalStepStatus = (status) => {
  if ([PLAN_STATUSES.UnderConstruction].includes(status)) {
    return "todo";
  }

  if (
    [
      PLAN_STATUSES.PENDING_ACTIVATE,
      PLAN_STATUSES.ACTIVATED,
      PLAN_STATUSES.TERMINATED,
    ].includes(status)
  ) {
    return "done";
  }
  return "wip";
};

const getActivateStepStatus = (status) => {
  if (
    [PLAN_STATUSES.UnderConstruction, PLAN_STATUSES.PENDING_APPROVAL].includes(
      status
    )
  ) {
    return "todo";
  }

  if ([PLAN_STATUSES.ACTIVATED, PLAN_STATUSES.TERMINATED].includes(status)) {
    return "done";
  }
  return "wip";
};

const getPlanStatusStep = (status) => {
  if (
    [
      PLAN_STATUSES.UnderConstruction,
      PLAN_STATUSES.PENDING_APPROVAL,
      PLAN_STATUSES.PENDING_ACTIVATE,
    ].includes(status)
  ) {
    return "todo";
  }

  return "wip";
};

const ReviewContainer = (props) => {
  const { planId } = useRouterParams();
  const { state, dispatch } = useContext(createPlanStore);
  const apiData = get(state, "api.data", {});
  const reviewDetails = get(apiData, "review", {});
  const pendingModules = [];
  const [planStatus, setStatus] = useState(get(apiData, "planStatus", 0));
  Object.keys(reviewDetails).forEach((key) => {
    if (!reviewDetails[key]) {
      pendingModules.push(key);
    }
  });
  const onApprovePlanClick = () => {
    setPlanStatus(parseInt(planId, 10), 2).then((response) => {
      setStatus(2);
      dispatch(
        setPageLevelPlanStatus({
          planStatus: 2,
        })
      );
      var s = get(state, "api.data", {});
      console.log(s);
    });
  };
  const onActivatePlanClick = () => {
    setPlanStatus(parseInt(planId, 10), 3).then((response) => {
      setStatus(3);
      dispatch(
        setPageLevelPlanStatus({
          planStatus: 3,
        })
      );
      var s = get(state, "api.data", {});
      console.log(s);
    });
  };
  const { status = PLAN_STATUSES.UnderConstruction } = planStatus || {};
  return (
    <div className="review-container">
      <div className="plan-heading">Plan Status</div>
      <ReviewWizard
        steps={[
          {
            status: [
              PLAN_STATUSES.PENDING_APPROVAL,
              PLAN_STATUSES.PENDING_ACTIVATE,
              PLAN_STATUSES.ACTIVATED,
              PLAN_STATUSES.TERMINATED,
            ].includes(planStatus)
              ? "done"
              : "wip",
            stepName: "Plan Setup",
          },
          {
            status: getApprovalStepStatus(planStatus),
            stepName: "Approval",
          },
          {
            status: getActivateStepStatus(planStatus),
            stepName: "Activate",
          },
          {
            status: getPlanStatusStep(planStatus),
            stepName: "Plan Status",
          },
        ]}
      />
      <ReviewStatus
        pendingModules={pendingModules}
        status={planStatus}
        onApprovePlanClick={onApprovePlanClick}
        onActivatePlanClick={onActivatePlanClick}
      />
    </div>
  );
};

export default ReviewContainer;
