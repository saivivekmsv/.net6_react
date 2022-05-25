import React, { useState } from "react";
import { find, get } from "lodash";
import { Tab, Tabs } from "react-bootstrap";
import { ManageCensusLayout, TabLeavingGuard } from "../../../../shared/components"
import { FLOW_TYPES, OPTIONS_DATA_MAPPER, ROUTES } from "../../../../shared/utils";
import { useRouterParams, useRequest } from "../../../../shared/abstracts"

import Deferrals from "./Deferrals";
import DepositHistory from "./DepositHistory";
import EligibilityOverride from "./EligibilityOverride";
import Loans from "./Loans";
import PlanSummary from "./PlanSummary";
import Transactions from "./Transactions";
import { faPencilAlt, faTimes } from "@fortawesome/pro-light-svg-icons";
import { getPlanMetaData } from "../../../services";

const EmployeeManagePlansContainer = (props) => {
  const { history } = props;
  const [keyValue, setkeyValue] = useState("plan_summary");
  const [nextkeyValue, setNextkeyValue] = useState(keyValue);
  const [isInnerFormDirty, setIsInnerFormDirty] = useState(false);
  const { flow, censusId = 1, planId } = useRouterParams();
  const [newFlow, setNewFlow] = useState(censusId ? FLOW_TYPES.EDIT : "");
  const { response: planDetails } = useRequest({
    method: getPlanMetaData,
    payload: planId,
  });
  const topPlanDetails = [
    {
      label: "Plan name",
      value: get(planDetails, "planName"),
    },
    {
      label: "Plan ID",
      value: get(planDetails, "planId"),
    },
    {
      label: "Plan Category",
      // value:
      //   OPTIONS_DATA_MAPPER.PLAN_CATERGORY[get(planDetails, "planCategory")] ||
      //   "",
      value: get(planDetails, "planCategory"),
    },
    {
      label: "Company Name",
      value: get(planDetails, "companyName"),
    },
  ];

  const buttons =
    keyValue === "eligibility_override"
      ? [
          {
            link: ROUTES.MANAGE_EMPLOYEE,
            label: "Cancel",
            variant: "secondary",
            type: "button",
            flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
          },
          {
            label: "Save",
            variant: "primary",
            type: "submit",
            flow: [FLOW_TYPES.ADD],
            link: ROUTES.MANAGE_EMPLOYEE,
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faTimes,
            link: ROUTES.MANAGE_EMPLOYEE,
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faPencilAlt,
            onClick: () => setNewFlow(FLOW_TYPES.SAVE),
          },
          {
            label: "Save",
            variant: "primary",
            type: "submit",
            flow: [FLOW_TYPES.SAVE],
            link: ROUTES.MANAGE_EMPLOYEE,
          },
        ]
      : [];

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;

  const menuChange = (key) => {
    setNextkeyValue(key);
  };

  return (
    <>
      <ManageCensusLayout
        buttons={buttons}
        pageFlow={newFlow || flow}
        blockNavigation={isInnerFormDirty}
      >
        <div className="d-flex justify-content-between highlevel-plan-details w-50">
          {topPlanDetails.map((item) => (
            <div>
              <div className="plan-label">{item.label}</div>
              <div className="plan-value">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Tabs
            defaultActiveKey="plan_summary"
            transition={false}
            className="top-level-tab"
            onSelect={menuChange}
            activeKey={keyValue}
            mountOnEnter
            unmountOnExit
          >
            <Tab eventKey="plan_summary" title="Plan summary">
              <PlanSummary />
            </Tab>
            <Tab eventKey="eligibility_override" title="Eligibility Override">
              <EligibilityOverride
                isEdit={isEdit}
                isSave={isSave}
                {...{ isInnerFormDirty, setIsInnerFormDirty }}
              />
            </Tab>
            <Tab eventKey="deferrals" title="Deferrals">
              <Deferrals
                {...props}
                isEdit={isEdit}
                isSave={isSave}
                planName={get(planDetails, "planName")}
              />
            </Tab>
            <Tab eventKey="deposit_history" title="Deposit History">
              <DepositHistory {...{ isInnerFormDirty, setIsInnerFormDirty }} />
            </Tab>
            <Tab eventKey="loans" title="Loans">
              <Loans />
            </Tab>
            <Tab eventKey="Transactions" title="Transactions">
              <Transactions />
            </Tab>
          </Tabs>
        </div>
      </ManageCensusLayout>
      <TabLeavingGuard
        {...{
          isInnerFormDirty,
          setIsInnerFormDirty,
          setkeyValue,
          nextkeyValue,
          setNextkeyValue,
          keyValue,
        }}
      />
    </>
  );
};

export default EmployeeManagePlansContainer;
