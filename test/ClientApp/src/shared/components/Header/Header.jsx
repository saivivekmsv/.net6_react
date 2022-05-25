import React from "react";
import { Link } from "react-router-dom";
import { get } from "lodash";
import {
  Container,
  Navbar,
  Nav,
  Image,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { ROUTES } from "../../utils";
import { IconDropDown, HeaderPopover } from "../";
import { ReactComponent as UserIcon } from "./user-icon.svg";
import { ReactComponent as VerticalTripleDots } from "./vertical-triple-dots.svg";
import { LoginMenu } from "../api-authorization/LoginMenu";

const menuList = [
  {
    path: ROUTES.HOME,
    label: "Home",
    childRoutes: [
      ROUTES.COMPANY,
      ROUTES.MANAGE_COMPANY,
      ROUTES.PLAN,
      ROUTES.CREATE_PLAN,
      ROUTES.MANAGE_PLAN,
      ROUTES.MANAGE_ELIGIBILITY,
      ROUTES.MANAGE_EMPLOYEE,
      ROUTES.MANAGE_CENSUS,
      ROUTES.ENROLLMENT,
    ],
  },
  {
    path: ROUTES.DASHBOARD,
    label: "Dashboard",
  },
];

const Header = ({ onMenuChange, seletedRoute }) => {
  return (
    <Navbar bg="light" expand="md" sticky="top" className="header-nav">
      <Container fluid>
        <Row className="header-nav-row align-items-center">
          <Col xs={2}>
            <Navbar.Brand>
              <Link to={ROUTES.HOME}>
                <Image src={`/assets/icons/svg/core.svg`} height="31" />
              </Link>
            </Navbar.Brand>
          </Col>
          <Col xs={6}>
            <Nav>
              {menuList.map((item) => {
                let className = "";
                if (seletedRoute === item.path) {
                  className = "selected";
                } else {
                  className = get(item, "childRoutes", []).filter((route) => {
                    return seletedRoute.indexOf(route) !== -1;
                  }).length
                    ? "soft-selected"
                    : "";
                }
                return (
                  <Link key={item.path} to={item.path}>
                    <Nav.Link as="span" className={className}>
                      {item.label}
                    </Nav.Link>
                  </Link>
                );
              })}
            </Nav>
          </Col>
          <Col xs={4} className="d-flex justify-content-end">
            <IconDropDown icon={<UserIcon />}>
              <HeaderPopover>
                <LoginMenu />
              </HeaderPopover>
            </IconDropDown>

            <IconDropDown icon={<VerticalTripleDots />}>
              <HeaderPopover>
                <Link to={ROUTES.DOCO_CENTER}>
                  <Dropdown.Item as="button">Help</Dropdown.Item>
                </Link>
                <Link to={ROUTES.HOME}>
                  <Dropdown.Item as="button">Search</Dropdown.Item>
                </Link>
              </HeaderPopover>
            </IconDropDown>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
