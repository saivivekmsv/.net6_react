import React from "react";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { getPathWithParam } from "../../utils";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ManageCensusMenu = ({ menuList = [], selectedMenu, flow, censusId }) => {
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
                pathParam: [flow, censusId],
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

export default ManageCensusMenu;
