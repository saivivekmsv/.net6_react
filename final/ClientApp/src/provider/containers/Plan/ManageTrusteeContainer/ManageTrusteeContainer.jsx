import React, { useState } from "react";
import GenericTable from "./GenericTable";
import { ManagePlanLayout } from "../../../components";
import { getPathWithParam, MANAGE_PLAN_ROUTES } from "../../../utils";
import ManageTrustee from "../../../mocks/manageTrustee.json";
import { useRouterParams } from "../../../abstracts";

const ManageTrusteeContainer = (props) => {
  const { planId } = useRouterParams();
  const [isMockLoading, setIsLoading] = useState(false);
  const newTrusteeLink = getPathWithParam({
    path: MANAGE_PLAN_ROUTES.ADD_TRUSTEE_MASTER,
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
      link: newTrusteeLink,
      label: "Add Trustee",
      variant: "primary",
      type: "button",
    },
  ];

  return (
    <ManagePlanLayout buttons={buttons}>
      <div className="d-flex flex-column">
        <div className="plan-heading">Trustee Information</div>
        <GenericTable
          data={ManageTrustee.data}
          isLoading={isMockLoading}
          handleSort={handleSortForGenericTable}
          totalRecords={ManageTrustee.data.length}
          scrollEndCallBack={scrollEndCallBack}
        />
      </div>
    </ManagePlanLayout>
  );
};

export default ManageTrusteeContainer;
