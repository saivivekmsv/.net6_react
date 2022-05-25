import React, { useState } from "react";
import { find, get } from "lodash";
import { Tab, Tabs } from "react-bootstrap";
import { ManageCensusLayout, TabLeavingGuard } from "../../../components";
import { useRouterParams, useRequest } from "../../../abstracts";
import Deferrals from "./Deferrals";
import DepositHistory from "./DepositHistory";
import EligibilityOverride from "./EligibilityOverride";
import Loans from "./Loans";
import PlanSummary from "./PlanSummary";
import Transactions from "./Transactions";
import { getNullTableItem, OPTIONS_DATA_MAPPER } from "../../../utils";
import { getPlanMetaData } from "../../../services";
import {
  FLOW_TYPES,
  ROUTES,
  MANAGE_CENSUS_ROUTES,
  getAdvancedPathWithParam,
} from "../../../utils";

const EmployeeManagePlansContainer = (props) => {
  const { history } = props;
  const [keyValue, setkeyValue] = useState("eligibility_override");
  const [nextkeyValue, setNextkeyValue] = useState(keyValue);
  const [isInnerFormDirty, setIsInnerFormDirty] = useState(false);
  const { flow, censusId = 1, planId } = useRouterParams();
  const [newFlow, setNewFlow] = useState();
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
      value: getNullTableItem(
        OPTIONS_DATA_MAPPER.PLAN_CATERGORY[get(planDetails, "planCategory")]
      ),
      // value: get(planDetails, "planCategory"),
    },
    {
      label: "Company Name",
      value: get(planDetails, "companyName"),
    },
  ];

  // const buttons =
  //   keyValue === "eligibility_override"
  //     ? [
  //         {
  //           link: ROUTES.MANAGE_EMPLOYEE,
  //           label: "Cancel",
  //           variant: "secondary",
  //           type: "button",
  //           flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
  //         },
  //         {
  //           label: "Save",
  //           variant: "primary",
  //           type: "submit",
  //           flow: [FLOW_TYPES.ADD],
  //           link: ROUTES.MANAGE_EMPLOYEE,
  //         },
  //         {
  //           label: "",
  //           variant: "link",
  //           type: "button",
  //           flow: [FLOW_TYPES.EDIT],
  //           icon: faTimes,
  //           link: ROUTES.MANAGE_EMPLOYEE,
  //         },
  //         {
  //           label: "",
  //           variant: "link",
  //           type: "button",
  //           flow: [FLOW_TYPES.EDIT],
  //           icon: faPencilAlt,
  //           onClick: () =>
  //             history.push(
  //               getAdvancedPathWithParam({
  //                 path: MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES,
  //                 pathParam: [FLOW_TYPES.SAVE, censusId, planId],
  //               })
  //             ),
  //         },
  //         {
  //           label: "Save",
  //           variant: "primary",
  //           type: "submit",
  //           flow: [FLOW_TYPES.SAVE],
  //           // link: ROUTES.MANAGE_EMPLOYEE,
  //         },
  //       ]
  //     : [];

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;

  const menuChange = (key) => {
    setNextkeyValue(key);
  };

  const onClickEdit = () => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES,
        pathParam: [FLOW_TYPES.SAVE, censusId, planId],
      })
    );
  };

  const onClickSave = () => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES,
        pathParam: [FLOW_TYPES.EDIT, censusId, planId],
      })
    );
  };

  return (
    <>
      <ManageCensusLayout
        //buttons={buttons}
        buttons={[]}
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
            defaultActiveKey="eligibility_override"
            transition={false}
            className="top-level-tab"
            onSelect={menuChange}
            activeKey={keyValue}
            mountOnEnter
            unmountOnExit
          >
            {/* <Tab eventKey="plan_summary" title="Plan summary">
              <PlanSummary />
            </Tab> */}
            <Tab eventKey="eligibility_override" title="Eligibility Override">
              <EligibilityOverride
                isEdit={isEdit}
                isSave={isSave}
                onClickEdit={onClickEdit}
                onClickSave={onClickSave}
                {...{ isInnerFormDirty, setIsInnerFormDirty }}
              />
            </Tab>
            {/* <Tab eventKey="deferrals" title="Deferrals">
              <Deferrals
                {...props}
                isEdit={isEdit}
                isSave={isSave}
                planName={get(planDetails, "planName")}
              />
            </Tab> */}
            <Tab eventKey="deposit_history" title="Deposit History">
              <DepositHistory {...{ isInnerFormDirty, setIsInnerFormDirty }} />
            </Tab>
            {/* <Tab eventKey="loans" title="Loans">
              <Loans />
            </Tab> */}
            {/* <Tab eventKey="Transactions" title="Transactions">
              <Transactions />
            </Tab> */}
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
