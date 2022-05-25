import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import { ManageEligibilityMenu, LoaderWrapper } from "../../../components";
import { withAppLayout } from "../../../hoc";
import {
  manageEligibilityFormNames,
  MANAGE_ELIGIBILITY_MENU,
} from "../../../utils";
import { ManageEligibilityRoutes } from "../../../routes";
import {
  manageEligibilityStore,
  ManageEligibilityProvider,
  setManageEligibilitySelectedMenu,
} from "../../../contexts";

export const ManageEligibility = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(manageEligibilityStore);
  const { isFetching } = get(state, "api", {});
  const eligibilityId = get(state, "eligibilityId");
  const flow = get(state, "flow");

  // enven to handle location change
  useEffect(() => {
    dispatch(setManageEligibilitySelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const eligibilityName = get(
    state,
    `${manageEligibilityFormNames.ELIGIBILITY_PROCESS}.eligibilityName`,
    ""
  );

  const isLoading = get(state, "isLoading");
  return (
    <LoaderWrapper
      isLoading={isLoading || isFetching}
      className="row manage-company-wrapper"
    >
      <Col className="h-100">
        <Row sm="12" className="h-100">
          <Col className="manage-company-column manage-menu-items">
            <div className="company-name-component">
              {eligibilityName && (
                <div>
                  <div className="heading">Eligibility Name </div>
                  <div>
                    <h6>{eligibilityName}</h6>
                  </div>
                </div>
              )}
            </div>
            <ManageEligibilityMenu
              menuList={MANAGE_ELIGIBILITY_MENU}
              selectedMenu={get(state, "selectedMenu")}
              eligibilityId={eligibilityId}
              flow={flow}
            />
          </Col>
          <Col className="h-100 manage-menu-content">
            <ManageEligibilityRoutes eligibilityName={eligibilityName} />
          </Col>
        </Row>
      </Col>
    </LoaderWrapper>
  );
};

const ManageEligibilityWithProvider = (props) => {
  return (
    <ManageEligibilityProvider>
      <ManageEligibility {...props} />
    </ManageEligibilityProvider>
  );
};

export default withAppLayout(ManageEligibilityWithProvider);
