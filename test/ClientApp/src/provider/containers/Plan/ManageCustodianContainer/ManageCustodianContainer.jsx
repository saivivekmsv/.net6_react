import React, { useState } from "react";
import GenericTable from "./GenericTable";
import { ManagePlanLayout } from "../../../components";
import ManageCustodian from "../../../mocks/manageCustodian.json";
import { getPathWithParam, MANAGE_PLAN_ROUTES } from "../../../utils";
import { useRouterParams } from "../../../abstracts";

const ManageCustodianContainer = (props) => {
  const { planId } = useRouterParams();
  const [isMockLoading, setIsLoading] = useState(false);
  const newCustodianLink = getPathWithParam({
    path: MANAGE_PLAN_ROUTES.ADD_CUSTODIAN_MASTER,
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
      link: newCustodianLink,
      label: "ADD CUSTODIAN",
      variant: "primary",
      type: "button",
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons}>
      <div className="d-flex flex-column">
        <div className="plan-heading">Custodian Information</div>
        <GenericTable
          data={ManageCustodian.data}
          isLoading={isMockLoading}
          handleSort={handleSortForGenericTable}
          totalRecords={ManageCustodian.data.length}
          scrollEndCallBack={scrollEndCallBack}
        />
      </div>
    </ManagePlanLayout>
  );
};

export default ManageCustodianContainer;
