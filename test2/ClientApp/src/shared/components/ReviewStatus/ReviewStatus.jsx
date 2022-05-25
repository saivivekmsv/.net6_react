import React from "react";
import { PLAN_STATUSES } from "../../utils";

import OtherStatuses from "./OtherStatuses";
import SetupPending from "./SetupPending";

// const onApprovePlanClick = () => {
//   savePlanDetailsAction(
//     {
//       planStatus: 2,
//     },
//     dispatch,
//     state
//   ).then((response) => {
//       dispatch(
//         setManageCreateData({
//           formName: formName,
//           fieldData: values,
//         })
//       );
//   });
// }

const ReviewStatus = ({
  status,
  pendingModules,
  onActivatePlanClick,
  onApprovePlanClick,
}) => {
  console.log(status);
  if (status !== PLAN_STATUSES.UnderConstruction) {
    return (
      <OtherStatuses
        status={status}
        onActivatePlanClick={onActivatePlanClick}
        onApprovePlanClick={onApprovePlanClick}
      />
    );
  }
  return <SetupPending pendingModules={pendingModules} />;
};

export default ReviewStatus;
