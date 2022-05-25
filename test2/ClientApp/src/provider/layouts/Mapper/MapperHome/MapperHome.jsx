import { MapperHomeContainer } from "../../../containers";
import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import { ManageMapperMenu, LoaderWrapper } from "../../../components";
import { withAppLayout } from "../../../hoc";
import { manageMapperFormNames, MANAGE_MAPPER_MENU } from "../../../utils";
import { ManageMapperRoutes } from "../../../routes";
import {
  manageMapperStore,
  ManageMapperProvider,
  setManageMapperSelectedMenu,
} from "../../../contexts";

export const MapperHome = (props) => {
  return (
    <LoaderWrapper className="row manage-company-wrapper">
      <Col className="h-100">
        <Row sm="12" className="h-100">
          <Col className="h-100 manage-menu-content">
            <MapperHomeContainer {...props} />
          </Col>
        </Row>
      </Col>
    </LoaderWrapper>
  );
};

const ManageMapperWithProvider = (props) => {
  return (
    <ManageMapperProvider>
      <MapperHome {...props} />
    </ManageMapperProvider>
  );
};

export default withAppLayout(ManageMapperWithProvider);
