import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { get } from "lodash";
import { ManagePayrollMenu, LoaderWrapper } from "../../../components";
import { withAppLayout } from "../../../hoc";
import { managePayrollFormNames, MANAGE_PAYROLL_MENU } from "../../../utils";
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
      <Col className="h-100">
        <Row sm="12" className="h-100">
          {state.selectedMenu ===
          "/manage-payroll/create-payroll-listing/edit/123" ? (
            ""
          ) : (
            <Col className="manage-company-column manage-menu-items">
              <div className="company-name-component">
                {payrollName && (
                  <div>
                    <div className="heading">Payroll Name </div>
                    <div>
                      <h6>{payrollName}</h6>
                    </div>
                  </div>
                )}
              </div>
              <ManagePayrollMenu
                menuList={MANAGE_PAYROLL_MENU}
                selectedMenu={get(state, "selectedMenu")}
                payrollId={payrollId}
                flow={flow}
              />
            </Col>
          )}
          <Col className="h-100 manage-menu-content">
            <ManagePayrollRoutes payrollName={payrollName} />
          </Col>
        </Row>
      </Col>
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
