import React from "react";
import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { find } from "lodash";
import { Link } from "react-router-dom";
import { useRouterParams } from "../../abstracts";
import { getPathWithParam, MANAGE_PLAN_MENU } from "../../utils";
import { Col, Row } from "react-bootstrap";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons";

const SetupPending = ({ pendingModules = [] }) => {
  const { flow, planId } = useRouterParams();
  return (
    <div className="d-flex w-100 mt-5 setup-pending-wrapper">
      <div>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="3x"
          color="#F46E0D"
        />
      </div>
      <div className="ml-5">
        <div>
          <div className="pending-module-desc">
            The setup is partially complete <br />
            To activate, please complete the remaining{" "}
            <strong>{pendingModules.length} Sections</strong>
          </div>
        </div>
        <div className="my-5">
          <Row md={3} className="aling-items-center">
            {pendingModules.map((item, index) => {
              const menuDetails =
                find(MANAGE_PLAN_MENU, {
                  id: item,
                }) || {};
              return (
                <Col key={`setup-wiz-${index}`} className="my-1">
                  <FontAwesomeIcon icon={faCircleNotch} />
                  &nbsp;&nbsp;
                  <Link
                    className="pending-module-link"
                    to={getPathWithParam({
                      path: menuDetails.path,
                      pathParam: [flow, planId],
                    })}
                  >
                    {menuDetails.label}
                  </Link>
                </Col>
              );
            })}
          </Row>
        </div>
        <div>
          <i>Click and navigate to the section and complete the plan</i>
        </div>
      </div>
    </div>
  );
};

export default SetupPending;
