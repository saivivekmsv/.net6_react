import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import {
  ManagePlanMenu,
  LoaderWrapper,
  PlanLeftPanelDetails,
} from "../../../components";
import { withAppLayout } from "../../../hoc";
import { managePlanFormNames, MANAGE_PLAN_MENU } from "../../../utils";
import { ManagePlanRoutes } from "../../../routes";
import {
  createPlanStore,
  CreatePlanProvider,
  setManagePlanSelectedMenu,
} from "../../../contexts";

export const ManagePlan = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { isFetching } = get(state, "api", {});
  const planId = get(state, "planId");
  const companyId = get(state, "api.data.companyId");
  const flow = get(state, "flow");
  // console.log(state, "stateinMain");
  // console.log(companyId, "companyIdinMain");
  // enven to handle location change
  useEffect(() => {
    dispatch(setManagePlanSelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const planName = get(
    state,
    `${managePlanFormNames.CREATE_PLAN}.planName`,
    ""
  );
  const isLoading = get(state, "isLoading");
  const apiData = get(state, "api.data", {});
  const reviewDetails = get(apiData, "review", {});
  const completedModules = ["irslimit"];
  if (reviewDetails !== null) {
    console.log(apiData);
    Object.keys(reviewDetails).forEach((key) => {
      if (reviewDetails[key]) {
        completedModules.push(key);
      }
    });
    console.log(reviewDetails, completedModules);
  }
  return (
    <LoaderWrapper
      isLoading={isLoading || isFetching}
      className="row manage-company-wrapper"
    >
      <Col className="h-100">
        <Row sm="12" className="h-100">
          <Col
            className="manage-company-column manage-menu-items"
            style={{ maxWidth: "20%" }}
          >
            <div className="company-name-component">
              <PlanLeftPanelDetails {...apiData} />
            </div>
            <ManagePlanMenu
              menuList={MANAGE_PLAN_MENU}
              selectedMenu={get(state, "selectedMenu")}
              planId={planId}
              companyId={companyId}
              flow={flow}
              completedModules={completedModules}
            />
          </Col>
          <Col
            className="h-100 manage-menu-content"
            style={{ maxWidth: "80%" }}
          >
            <ManagePlanRoutes planName={planName} />
          </Col>
        </Row>
      </Col>
    </LoaderWrapper>
  );
};

const ManagePlanWithProvider = (props) => {
  return (
    <CreatePlanProvider>
      <ManagePlan {...props} />
    </CreatePlanProvider>
  );
};

export default withAppLayout(ManagePlanWithProvider);
