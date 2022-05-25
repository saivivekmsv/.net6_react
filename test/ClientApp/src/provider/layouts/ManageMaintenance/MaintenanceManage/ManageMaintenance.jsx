import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import { ManageMaintenanceMenu, LoaderWrapper } from "../../../components";
import { withAppLayout } from "../../../hoc";
import {
  manageMaintenanceFormNames,
  MANAGE_MAINTENANCE_MENU,
} from "../../../utils";
import { ManageMaintenanceRoutes } from "../../../routes";
import {
  manageMaintenanceStore,
  ManageMaintenanceProvider,
  setManageMaintenanceSelectedMenu,
} from "../../../contexts";

export const ManageMaintenance = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(manageMaintenanceStore);
  const { isFetching } = get(state, "api", {});
  const maintenanceId = get(state, "maintenanceId");
  const flow = get(state, "flow");
  // console.log(location);
  // enven to handle location change
  useEffect(() => {
    dispatch(setManageMaintenanceSelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const maintenanceName = get(
    state,
    `${manageMaintenanceFormNames.HOLIDAY_CALENDAR}.maintenanceName`,
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
              {maintenanceName && (
                <div>
                  <div className="heading">Maintenance Name </div>
                  <div>
                    <h6>{maintenanceName}</h6>
                  </div>
                </div>
              )}
            </div>
            <ManageMaintenanceMenu
              menuList={MANAGE_MAINTENANCE_MENU}
              selectedMenu={get(state, "selectedMenu")}
              maintenanceId={maintenanceId}
              flow={flow}
            />
          </Col>
          <Col className="h-100 manage-menu-content">
            <ManageMaintenanceRoutes maintenanceName={maintenanceName} />
          </Col>
        </Row>
      </Col>
    </LoaderWrapper>
  );
};

const ManageMaintenanceWithProvider = (props) => {
  return (
    <ManageMaintenanceProvider>
      <ManageMaintenance {...props} />
    </ManageMaintenanceProvider>
  );
};

export default withAppLayout(ManageMaintenanceWithProvider);
