import React from "react";
import { get, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { getPathWithParam } from "../../utils";

const ManageMapperMenu = ({ menuList = [], selectedMenu }) => {
  return (
    <ul className="manage-company-menu">
      {menuList.map((item) => {
        const childRoutes = get(item, "childRoutes", []);
        let className =
          selectedMenu.indexOf(item.path) !== -1 ||
          childRoutes.filter((route) => {
            return selectedMenu.indexOf(route) !== -1;
          }).length
            ? "selected"
            : "";
        if (!isEmpty(item.subNav)) {
          return (
            <li
              key={item.path}
              className={`${className} has-tick`}
              style={{ display: "block" }}
            >
              <FontAwesomeIcon icon={faCheckCircle} size="1x" />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Link
              to={getPathWithParam({
                path: item.path,
              })}
            >
              {item.label}
            </Link>
              <ul className="manage-company-menu">
                {item.subNav.map((i) => {
                  let selectedClassName =
                    selectedMenu.indexOf(i.path) !== -1 ||
                    childRoutes.filter((route) => {
                      return selectedMenu.indexOf(route) !== -1;
                    }).length
                      ? "selected"
                      : "";
                  return (
                    <li
                      key={i.path}
                      className={`${selectedClassName} has-tick`}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} size="1x" />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Link
                        to={getPathWithParam({
                          path: i.path,
                        })}
                      >
                        {i.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        }

        return (
          <li key={item.path} className={`${className} has-tick`}>
            <FontAwesomeIcon icon={faCheckCircle} size="1x" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link
              to={getPathWithParam({
                path: item.path,
              })}
            >
              {item.label}
            </Link>
            <span className="open-rounded-corner-top" />
            <span className="open-rounded-corner-bottom" />
          </li>
        );
      })}
    </ul>
  );
};

export default ManageMapperMenu;
