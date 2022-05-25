import React from "react";
import { get, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { getPathWithParam, FLOW_TYPES } from "../../utils";

const menuItems = [
  "Filter",
  "Aggregate",
  "Target",
  "Map & Transform",
  "Verify Map",
  "Ruleset",
  "Scheduler",
  "Review & Confirm",
];
const ManageMapperMenu = ({
  menuList = [],
  flow,
  selectedMenu,
  profileId,
  linkDisable,
}) => {
  return (
    <ul className="manage-mapper-menu">
      {menuList.map((item) => {
        const childRoutes = get(item, "childRoutes", []);
        let className =
          selectedMenu.indexOf(item.path) !== -1 ||
          childRoutes.filter((route) => {
            return selectedMenu.indexOf(route) !== -1;
          }).length
            ? "selected"
            : "";
        const disabled = linkDisable && menuItems.includes(item.label);

        return (
          <li
            key={item.path}
            className={disabled ? "disabled has-tick" : `${className} has-tick`}
          >
            <FontAwesomeIcon icon={faCheckCircle} size="1x" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link
              disabled={disabled}
              to={getPathWithParam({
                path: item.path,
                pathParam: [flow, profileId],
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
