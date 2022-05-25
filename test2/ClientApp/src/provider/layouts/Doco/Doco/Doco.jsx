import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import { ManageMapperMenu, LoaderWrapper } from "../../../components";
import { withAppLayout } from "../../../hoc";
import { manageMapperFormNames, DOCO_MENU } from "../../../utils";
import { DocumentRoutes } from "../../../routes";
import {
  manageMapperStore,
  ManageMapperProvider,
  setManageMapperSelectedMenu,
} from "../../../contexts";

export const Mapper = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(manageMapperStore);
  const { isFetching } = get(state, "api", {});
  const maintenanceId = get(state, "maintenanceId");
  const flow = get(state, "flow");
  // console.log(location);
  // enven to handle location change
  useEffect(() => {
    dispatch(setManageMapperSelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const mapperName = get(
    state,
    `${manageMapperFormNames.MAP_AND_TRANSFORM}.mapperName`,
    ""
  );
  // console.log(state, "state");
  // console.log(maintenanceId, maintenanceName);

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
              {mapperName && (
                <div>
                  <div className="heading">Transformations</div>
                  <div>
                    <h6>{mapperName}</h6>
                  </div>
                </div>
              )}
            </div>
            <ManageMapperMenu
              menuList={DOCO_MENU}
              selectedMenu={get(state, "selectedMenu")}
              flow={flow}
            />
          </Col>
          <Col className="h-100 manage-menu-content">
            <DocumentRoutes mapperName={mapperName} />
          </Col>
        </Row>
      </Col>
    </LoaderWrapper>
  );
};

const ManageMapperWithProvider = (props) => {
  return (
    <ManageMapperProvider>
      <Mapper {...props} />
    </ManageMapperProvider>
  );
};

export default withAppLayout(ManageMapperWithProvider);
