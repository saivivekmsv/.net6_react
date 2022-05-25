import React, { useState } from "react";
import { ManagePlanLayout } from "../../../components";
import GenericTable from "./GenericTable";
import SponsorInformation from "../../../mocks/sponsorInformation.json";
import { useRouterParams } from "../../../abstracts";

const SponsorInformationContainers = () => {
  const [isMockLoading, setIsLoading] = useState(false);

  const { flow } = useRouterParams();

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

  return (
    <ManagePlanLayout pageFlow={flow}>
      <div className="d-flex flex-column">
        <div className="plan-heading">Sponsor Information</div>
        <GenericTable
          data={SponsorInformation.data}
          isLoading={isMockLoading}
          handleSort={handleSortForGenericTable}
          totalRecords={SponsorInformation.data.length}
          scrollEndCallBack={scrollEndCallBack}
        />
      </div>
    </ManagePlanLayout>
  );
};

export default SponsorInformationContainers;
