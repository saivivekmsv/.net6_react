import React from "react";
import { Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/pro-light-svg-icons";
import { ROUTES } from "../../utils";
import { Link } from "react-router-dom";

const SideBarContent = ({ onClickLeft, onClickRight }) => {
  const CoreIcon = (
    <span className="core-icon">
      <Image src={`/assets/icons/svg/core.svg`} width="60px" height="100%" />
    </span>
  );
  return (
    <div className="d-flex sidebar-content flex-column justify-content-between py-4 px-3">
      <Col className="minimized-content">
        <span className="core-icon white">
          <Image src={`/assets/icons/svg/core-white.svg`} />
        </span>
        <div className="arrow-icon-right pointer">
          <FontAwesomeIcon icon={faArrowCircleRight} onClick={onClickRight} />
        </div>
      </Col>
      <Col className="maximized-content">
        <div>{CoreIcon}</div>
      </Col>
      <Col className="maximized-content  h-1">
        <div className="mt-auto">
          <ul>
            <li>
              <Link to={ROUTES.HOME}>Reference & Enquiry</Link>
            </li>
            <li>
              <Link to={ROUTES.HOME}>Privacy Policy</Link>
            </li>
          </ul>
          <br />
          <br />
          <br />
          <div>© Congruent Solutions Inc.</div> <div>All Rights Reserved</div>
          <br />
          <br />
          <br />
          <div className="congruent-icon d-flex justify-content-between margin-bottom-5">
            <div>
              <Image
                src={`/assets/icons/svg/congruent-full.svg`}
                className="mr-4"
              />
            </div>
            <div className="arrow-icon-left pointer">
              <FontAwesomeIcon icon={faArrowCircleLeft} onClick={onClickLeft} />
            </div>
          </div>
        </div>
      </Col>
    </div>
  );
};

export default SideBarContent;
