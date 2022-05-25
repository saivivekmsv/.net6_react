import React from "react";
import { Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/pro-light-svg-icons";
import { ROUTES } from "../../utils";
import { Link } from "react-router-dom";

const SideBarContent = () => {
  const CoreIcon = (
    <span className="core-icon">
      <Image src={`/assets/icons/svg/core.svg`} width="60px" height="100%" />
    </span>
  );
  return (
    <div className="d-flex sidebar-content flex-column justify-content-between py-4 px-3">
      <Col className="maximized-content  h-1">
        <div>
          <ul>
            <li>
              <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
              <Link to={ROUTES.HOME}>Company</Link>
            </li>
          </ul>
        </div>
        <Col className="mt-auto">
          <div>{CoreIcon}</div>
        </Col>
      </Col>
      <Col className="minimized-content">
        <span className="core-icon white mt-auto" style={{ height: "40px" }}>
          <Image src={`/assets/icons/svg/core-white.svg`} />
        </span>
      </Col>
      <Col className="maximized-content">
        <span className="core-icon white mt-auto" style={{ height: "40px" }}>
          <Image src={`/assets/icons/svg/core-white.svg`} />
        </span>
      </Col>
    </div>
  );
};

export default SideBarContent;
