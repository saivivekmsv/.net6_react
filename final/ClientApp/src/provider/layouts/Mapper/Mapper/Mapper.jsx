import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import { ManageMapperMenu, LoaderWrapper } from "../../../components";
import { withAppLayout } from "../../../hoc";
import {
  manageMapperFormNames,
  MANAGE_MAPPER_MENU,
  MANAGE_MAPPER_MENU_WITH_OVERVIEW,
  FLOW_TYPES,
} from "../../../utils";
import { ManageMapperRoutes } from "../../../routes";
import {
  manageMapperStore,
  ManageMapperProvider,
  setManageMapperSelectedMenu,
} from "../../../contexts";

export const Mapper = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(manageMapperStore);
  const isFetching = get(state, "api.isFetching", {});
  const profileId = get(state, "api.data.id");
  const flow = get(state, "flow");
  const data = get(state, "api.data", {});
  const profileName = !isEmpty(data) && get(data, "name");
  const sourceData = get(state, "load_definition_source", []);
  useEffect(() => {
    dispatch(setManageMapperSelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const mapperName = get(
    state,
    `${manageMapperFormNames.MAP_AND_TRANSFORM}.mapperName`,
    ""
  );

  const isLoading = flow === FLOW_TYPES.ADD ? false : isFetching;
  const isEdit = flow === FLOW_TYPES.EDIT;

  return (
    <LoaderWrapper isLoading={isLoading} className="row manage-company-wrapper">
      <Col className="h-100">
        <Row sm="12" className="h-100">
          <Col className="manage-company-column manage-menu-items">
            <div className="company-name-component">
              {mapperName && (
                <div>
                  <div className="heading">Mapper</div>
                  <div>
                    <h6>{mapperName}</h6>
                  </div>
                </div>
              )}
              {profileName && (
                <div>
                  <div className="heading">Profile Name</div>
                  <div>
                    <h6>{profileName}</h6>
                  </div>
                </div>
              )}
            </div>
            <ManageMapperMenu
              linkDisable={isEmpty(data)}
              menuList={
                isEdit ? MANAGE_MAPPER_MENU_WITH_OVERVIEW : MANAGE_MAPPER_MENU
              }
              selectedMenu={get(state, "selectedMenu")}
              flow={flow}
              profileId={profileId}
            />
          </Col>
          <Col className="h-100 manage-menu-content w-50">
            <ManageMapperRoutes mapperName={mapperName} />
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
