import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const InnerLayoutHeaderTabs = ({ menuList }) => {
  return (
    <Nav className="inner-layout-header">
      {menuList.map((item) => {
        return (
          <Link key={item.path} to={item.disabled ? "#" : item.path}>
            <Nav.Link as="span" className={item.selected && "selected"}>
              {item.label}
            </Nav.Link>
          </Link>
        );
      })}
    </Nav>
  );
};

export default InnerLayoutHeaderTabs;
