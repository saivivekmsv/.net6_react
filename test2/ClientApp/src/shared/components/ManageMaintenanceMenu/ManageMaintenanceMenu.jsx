import React from "react";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { getPathWithParam } from "../../utils";

const ManageMaintenanceMenu = ({
  menuList = [],
  selectedMenu,
  flow,
  eligibilityId,
}) => {
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

        return (
          <li key={item.path} className={`${className} has-tick`}>
            <FontAwesomeIcon icon={faCheckCircle} size="1x" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link
              to={getPathWithParam({
                path: item.path,
                pathParam: [flow, eligibilityId],
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

export default ManageMaintenanceMenu;
