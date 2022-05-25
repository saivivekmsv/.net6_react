import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import {
  ManageCensusMenu,
  LoaderWrapper,
  CensusMenuEmployeeDetails,
} from "../../../components";
import { withAppLayout } from "../../../hoc";
import { manageCensusFormNames, MANAGE_CENSUS_MENU } from "../../../utils";
import { ManageCensusRoutes } from "../../../routes";
import {
  manageCensusStore,
  ManageCensusProvider,
  setManageCensusSelectedMenu,
} from "../../../contexts";

export const ManageCensus = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(manageCensusStore);
  const { isFetching } = get(state, "api", {});
  const censusId = get(state, "censusId");
  const flow = get(state, "flow");

  // enven to handle location change
  useEffect(() => {
    dispatch(setManageCensusSelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const censusName = get(
    state,
    `${manageCensusFormNames.CREATE_PLAN}.censusName`,
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
              {censusId && (
                <CensusMenuEmployeeDetails censusId={censusId} flow={flow} />
              )}
            </div>
            <ManageCensusMenu
              menuList={MANAGE_CENSUS_MENU}
              selectedMenu={get(state, "selectedMenu")}
              censusId={censusId}
              flow={flow}
            />
          </Col>
          <Col className="h-100 manage-menu-content">
            <ManageCensusRoutes censusName={censusName} />
          </Col>
        </Row>
      </Col>
    </LoaderWrapper>
  );
};

const ManageCensusWithProvider = (props) => {
  return (
    <ManageCensusProvider>
      <ManageCensus {...props} />
    </ManageCensusProvider>
  );
};

export default withAppLayout(ManageCensusWithProvider);
