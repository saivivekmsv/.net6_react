import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import { LoaderWrapper } from "../../../../shared/components";
import { ManagePayrollMenu } from "../../../components";
import { withAppLayout } from "../../../hoc";
import { managePayrollFormNames, MANAGE_PAYROLL_MENU } from "../../../../shared/utils"
import { ManagePayrollRoutes } from "../../../routes";
import {
  managePayrollStore,
  ManagePayrollProvider,
  setManagePayrollSelectedMenu,
} from "../../../contexts";

export const ManagePayroll = (props) => {
  const { location } = props;
  const { state, dispatch } = useContext(managePayrollStore);
  const { isFetching } = get(state, "api", {});
  const payrollId = get(state, "payrollId");
  const flow = get(state, "flow");

  // enven to handle location change
  useEffect(() => {
    dispatch(setManagePayrollSelectedMenu(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const payrollName = get(
    state,
    `${managePayrollFormNames.PAYROLL_PROCESS}.payrollName`,
    ""
  );

  const isLoading = get(state, "isLoading");
  return (
    <LoaderWrapper
      isLoading={isLoading || isFetching}
      className="row manage-payroll-wrapper"
    >
      <Row className="manage-payroll-container h-100 mt-1">
        {state.selectedMenu ===
          "/manage-payroll/create-payroll-listing/edit/123" ? (
          ""
        ) : (
          <Col md={3} className="upload-menu-container">
            <div className="tile-with-border padding-left-90 h-100">
            <ManagePayrollMenu
              menuList={MANAGE_PAYROLL_MENU}
              selectedMenu={get(state, "selectedMenu")}
              payrollId={payrollId}
              flow={flow}
            />
            </div>
          </Col>
        )}
        <Col md={9} >
          <div className="tile-with-border">
          <ManagePayrollRoutes payrollName={payrollName} />
          </div>
        </Col>
      </Row>
    </LoaderWrapper>
  );
};

const ManagePayrollWithProvider = (props) => {
  return (
    <ManagePayrollProvider>
      <ManagePayroll {...props} />
    </ManagePayrollProvider>
  );
};

export default withAppLayout(ManagePayrollWithProvider);
