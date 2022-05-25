import React, { useState } from "react";
import GenericTable from "./GenericTable";
import { ManagePlanLayout } from "../../../components";
import ManageAdvisor from "../../../mocks/manageAdvisor.json";
import { getPathWithParam, MANAGE_PLAN_ROUTES } from "../../../utils";
import { useRouterParams } from "../../../abstracts";

const ManageAdvisorContainer = (props) => {
  const { planId } = useRouterParams();
  const [isMockLoading, setIsLoading] = useState(false);
  const newAdvisorLink = getPathWithParam({
    path: MANAGE_PLAN_ROUTES.ADD_ADVISOR_MASTER,
    pathParam: [planId],
  });

  const mockLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSortForGenericTable = (detail) => {
    mockLoading();
  };

  const scrollEndCallBack = () => {
    mockLoading();
  };

  const buttons = [
    {
      link: newAdvisorLink,
      label: "Add Advisor",
      variant: "primary",
      type: "button",
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons}>
      <div className="d-flex flex-column">
        <div className="plan-heading">Advisor Information</div>
        <GenericTable
          data={ManageAdvisor.data}
          isLoading={isMockLoading}
          handleSort={handleSortForGenericTable}
          totalRecords={ManageAdvisor.data.length}
          scrollEndCallBack={scrollEndCallBack}
        />
      </div>
    </ManagePlanLayout>
  );
};

export default ManageAdvisorContainer;
