import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MANAGE_PLAN_ROUTES } from "../../../utils";

const PlanSuccessContainer = (props) => {
  const onNextPage = () => {
    const { history } = props;
    const dummyPlanId = 1234;
    history.push(`${MANAGE_PLAN_ROUTES.BASIC_DETAILS}/${dummyPlanId}`);
  };
  return (
    <Row>
      <Col className="h-100 overflow-auto">
        <div className="plan-success">
          <span className="check-cirle green ft-72">
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
          <h1>Plan Reg 401K MM1</h1>
          <h4>(ABC123456)</h4>
          <p className="mb-30">has been created successfully.</p>
          <p className="mb-60">
            This is a <b>Regular</b> Plan of <b>401k</b> created for{" "}
            <b>Megamagic Inc.</b>
          </p>
          <p className="text-grey">Next steps include:</p>
          <p className="text-grey">
            providing required information to set up this plan and the approval.
          </p>
          <Button variant="primary" type="submit" onClick={onNextPage}>
            CONTINUE
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default PlanSuccessContainer;
