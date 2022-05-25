import React from "react";
import { Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHomeLgAlt,
  faSackDollar,
  faBuilding,
  faUserAlt,
  faMoneyCheckEditAlt,
  faUsers,
  faBell,
  faQuestionCircle,
  faMap,
  faArrowCircleRight,
  faArrowCircleLeft,
  faChartNetwork
} from "@fortawesome/pro-light-svg-icons";
import { ROUTES } from "../../../shared/utils";
import { NavLink, Link } from "react-router-dom";

const SideBarContent = () => {
  const CoreIcon = (
    <span className="core-icon">
      <Image src={`/assets/icons/svg/core.svg`} width="60px" height="100%" />
    </span>
  );
  return (
    <div className="sidebar-content">
      <div className="minimized-content">
        <div className="side-bar-manu-content">

          <div>
            <NavLink to={ROUTES.HOME}>
              <FontAwesomeIcon icon={faHomeLgAlt} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.PLAN}>
              <FontAwesomeIcon icon={faSackDollar} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.COMPANY}>
              <FontAwesomeIcon icon={faBuilding} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.MANAGE_EMPLOYEE}>
              <FontAwesomeIcon icon={faUserAlt} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.PAYROLL}>
              <FontAwesomeIcon icon={faMoneyCheckEditAlt} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.MAPPER_HOME}>
              <FontAwesomeIcon icon={faChartNetwork} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.COMMUNITY}>
              <FontAwesomeIcon icon={faUsers} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.NOTIFICATION}>
              <FontAwesomeIcon icon={faBell} />
            </NavLink>
          </div>
          <div>
            <NavLink to={ROUTES.HELP}>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </NavLink>
          </div>

        </div>
        <div>
          <Image src={`/assets/icons/svg/core-white-small.svg`} width={60} />
        </div>
      </div>
      <Col className="maximized-content">
        <div className="menu-container">
          <NavLink to={ROUTES.HOME}>
            <div><FontAwesomeIcon icon={faHomeLgAlt} /></div><div>Home</div>
          </NavLink>
          <NavLink to={ROUTES.PLAN}>
            <div><FontAwesomeIcon icon={faSackDollar} /></div><div>Plan</div>
          </NavLink>
          <NavLink to={ROUTES.COMPANY}>
            <div><FontAwesomeIcon icon={faBuilding} /></div><div>Company</div>
          </NavLink>
          <NavLink to={ROUTES.MANAGE_EMPLOYEE}>
            <div><FontAwesomeIcon icon={faUserAlt} /></div><div>Employees</div>
          </NavLink>
          <NavLink to={ROUTES.PAYROLL}>
            <div><FontAwesomeIcon icon={faMoneyCheckEditAlt} /></div><div>Payrolls</div>
          </NavLink>
          <NavLink to={ROUTES.MAPPER_HOME}>
            <div><FontAwesomeIcon icon={faChartNetwork} /></div><div>Mapper</div>
          </NavLink>
          <NavLink to={ROUTES.COMMUNITY}>
            <div><FontAwesomeIcon icon={faUsers} /></div><div>Community</div>
          </NavLink>
          <NavLink to={ROUTES.NOTIFICATION}>
            <div><FontAwesomeIcon icon={faBell} /></div><div>Notifications</div>
          </NavLink>
          <NavLink to={ROUTES.HELP}>
            <div><FontAwesomeIcon icon={faQuestionCircle} /></div><div>Help</div>
          </NavLink>
        </div>
        
          <Image src={`/assets/icons/svg/core-white-small.svg`} width={60} />
        
      </Col>
    </div>
  )
};

export default SideBarContent;
