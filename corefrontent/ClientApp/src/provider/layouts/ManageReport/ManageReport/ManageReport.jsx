import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import { ManageReportMenu, LoaderWrapper } from "../../../components";
import { withAppLayout } from "../../../hoc";
import { manageReportsFormNames, MANAGE_REPORTS_MENU } from "../../../utils";
import { ManageReportRoutes } from "../../../routes";
import {
  manageReportsStore,
  ManageReportsProvider,
  setManageReportsSelectedMenu,
} from "../../../contexts";

export const ManageReport = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(manageReportsStore);
  const { isFetching } = get(state, "api", {});
  const reportId = get(state, "reportId", "");
  const flow = get(state, "flow");
  console.log(location);

  // enven to handle location change
  useEffect(() => {
    dispatch(setManageReportsSelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const reportName = get(
    state,
    `${manageReportsFormNames.ELIGIBILITY_FILTER}.reportName`,
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
          <Col className="manage-report-column manage-menu-items">
            <div className="report-name-component">
              {/* {reportName && ( */}
              <div>
                {/* <div className="heading">Report Name </div> */}
                <div>
                  <h6>Report Menu</h6>
                </div>
              </div>
              {/* )} */}
            </div>
            <ManageReportMenu
              menuList={MANAGE_REPORTS_MENU}
              selectedMenu={get(state, "selectedMenu")}
              reportId={reportId}
              flow={flow}
            />
            <div className="report-bottom-component"></div>
          </Col>
          <Col className="h-100 manage-menu-content">
            <ManageReportRoutes reportName={reportName} />
          </Col>
        </Row>
      </Col>
    </LoaderWrapper>
  );
};

const ManageReportWithProvider = (props) => {
  return (
    <ManageReportsProvider>
      <ManageReport {...props} />
    </ManageReportsProvider>
  );
};

export default withAppLayout(ManageReportWithProvider);
