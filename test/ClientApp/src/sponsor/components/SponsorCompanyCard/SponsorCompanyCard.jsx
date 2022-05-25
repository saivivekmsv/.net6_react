import React, { useState, useContext } from "react";
import logo from "../../assets/netflix-logo-0.png";
import { SponsorPlanDropdown } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faMinusCircle, faBan } from "@fortawesome/pro-solid-svg-icons";
import { Row, Image, Col } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import DoughnutEmployeeChart from "../../../shared/mocks/DoughnutEmployeeChart";
import { isEmpty } from "lodash";
import { useDeepEffect } from "../../../shared/abstracts";
import { appLayoutStore } from "../../../shared/contexts";
import { get } from "lodash";

const planStatuses = {
  0: "Under Construction",
  1: "Ready For",
  2: "Approved",
  3: "Active",
  4: "InActive",
  5: "Terminated"
};

const SponsorFieldview = (props) => {
  // const plans = [
  //   { planId: "783KCIUUNF01", planName: "783K Core Amazon_01 off 828731892", planStatus: 3 },
  //   { planId: "401KCORENF01", planName: "401K Core Netflix_01 get 9831712988", planStatus: 3 },
  //   { planId: "239KAJHFAJK3", planName: "239K Core Njfhaks_01 in 82173918", planStatus: 3 },
  //   { planId: "838KKAJSHDK2", planName: "838K Core Netflix_01 at 93484092", planStatus: 3 },
  // ];
  const { state, dispatch } = useContext(appLayoutStore);
  const logo = get(state, "companyDetails.logo", "");
  const getStatusIcon = (status) => {
    switch (status) {
      case 0: return faMinusCircle; break;
      case 1,2: return faMinusCircle; break;
      case 3: return faCheckCircle; break;
      case 4,5: return faBan; break;
      default: return null; break;
    }
  };

  const getColor = (status) => {
    switch (status) {
      case 0: return "orange"; break;
      case 1,2: return "orange"; break;
      case 3: return "green"; break;
      case 4,5: return "red"; break;
      default: return null; break;
    }
  };
  const [selectedPlan, setSelectedPlan] = useState();
  useDeepEffect(() => setSelectedPlan(!isEmpty(props.plans) ? props.plans[0] : null), [props.plans]);
  console.log(selectedPlan);
  return (
    <div className="tile-with-border d-flex flex-column justify-content-between dashboard-left-panel">
      <div className="d-flex flex-column align-items-center w-100">
        <Image src={logo} height={100} width={100} />
      </div>
      <div className="tile-alt-with-border">
        <SponsorPlanDropdown options={props.plans} screen="home" placeHolder="Select" setPlan={setSelectedPlan} />
        <span className="title" style={{ marginTop: "6px" }}>
          Plan Name
        </span>
      </div>

      <Row>
        <Col md={6}>
          <div className="d-flex flex-column tile-alt-with-border">
            <span>{selectedPlan?.planId}</span>
            <span>Plan Id</span>
          </div>
        </Col>
        <Col md={6}>
          <div className="d-flex flex-column tile-alt-with-border">
            <div className={`d-flex flex-row align-items-center flex-wrap`}>
              <FontAwesomeIcon icon={getStatusIcon(selectedPlan?.planStatus)} size="1.5x" color={`${getColor(selectedPlan?.planStatus)}`}></FontAwesomeIcon>
              <div style={{fontSize: "14px", color: getColor(selectedPlan?.planStatus)}}>{planStatuses[selectedPlan?.planStatus]}</div>
            </div>
            <span>Plan status</span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <div className="d-flex flex-column tile-alt-with-border">
            <span className="value">$ 253.73 M</span>
            <span className="title" style={{ marginTop: "6px" }}>
              Total plan balance
            </span>
          </div>
        </Col>
        <Col md={6}>
          <div className="d-flex flex-column tile-alt-with-border">
            <span className="value">$ 53.73 M</span>
            <span className="title" style={{ marginTop: "6px" }}>
              Vested balance
            </span>
          </div>
        </Col>
      </Row>

      <div className="d-flex flex-row justify-content-between w-100 tile-alt-with-border">
        <span>
          Forfieture balance
        </span>
        <span className="value">$ 16.45 K</span>
      </div>
      <div className="d-flex flex-row justify-content-between w-100 tile-alt-with-border">
        <span>
          Contribution rate
        </span>
        <span className="value">3.2%</span>
      </div>
      <div className="d-flex flex-row justify-content-between w-100 tile-alt-with-border">

        <div className="w-50">
          <DoughnutEmployeeChart />
        </div>
        <div className="w-50 p-3">
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#2F80ED" }}></div>
            <div className="tabs-text">Enrolled</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}650
            </div>
          </div>
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#27AE60" }}></div>
            <div className="tabs-text">Eligible</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}190
            </div>
          </div>
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#EB5757" }}></div>
            <div className="tabs-text">Opted Out</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}50
            </div>
          </div>
          <div className="flex-row " style={{ alignItems: "center" }}>
            <div className="dot" style={{ backgroundColor: "#BDBDBD" }}></div>
            <div className="tabs-text">Ineligible</div>
            <div className="marg-left-5" style={{ color: "#828282" }}>
              {/* {eligibleCount} */}100
            </div>
          </div>

        </div>
      </div>



    </div>












  );
};

export default SponsorFieldview;
