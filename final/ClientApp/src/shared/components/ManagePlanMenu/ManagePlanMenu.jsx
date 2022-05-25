import React from "react";
import { get } from "lodash";
import { FLOW_TYPES, getPathWithParam, MANAGE_PLAN_ROUTES } from "../../utils";
import { Link } from "../";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";

const ManagePlanMenu = ({
  menuList = [],
  selectedMenu,
  flow,
  planId,
  companyId,
  completedModules,
}) => {
  // console.log(companyId, "companyIdinMenyu");

  return (
    <ul className="manage-company-menu">
      {menuList.map((item) => {
        // console.log(item.path, "companyIdinMenyu");
        const childRoutes = get(item, "childRoutes", []);
        let className =
          selectedMenu.indexOf(item.path) !== -1 ||
          childRoutes.filter((route) => {
            return selectedMenu.indexOf(route) !== -1;
          }).length
            ? "selected"
            : "";

        const tickStatus = completedModules.includes(item.id) ? "done" : "";
        className = `${className} ${tickStatus}`;
        const disabled =
          !planId && item.path !== MANAGE_PLAN_ROUTES.CREATE_PLAN;
        className = disabled ? `${className} disabled` : className;

        if (planId && item.path === MANAGE_PLAN_ROUTES.CREATE_PLAN) {
          return null;
        }

        if (!planId && item.path === MANAGE_PLAN_ROUTES.BASIC_DETAILS) {
          return null;
        }

        if (item.path === MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION) {
          return (
            <li key={item.path} className={`${className} has-tick`}>
              <FontAwesomeIcon icon={faCheckCircle} size="1x" />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Link
                disabled={disabled}
                to={getPathWithParam({
                  path: item.path,
                  pathParam: [FLOW_TYPES.EDIT, planId, companyId],
                })}
              >
                {item.label}
              </Link>
              <span className="open-rounded-corner-top" />
              <span className="open-rounded-corner-bottom" />
            </li>
          );
        }

        return (
          <li key={item.path} className={`${className} has-tick`}>
            <FontAwesomeIcon icon={faCheckCircle} size="1x" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link
              disabled={disabled}
              to={getPathWithParam({
                path: item.path,
                pathParam: [FLOW_TYPES.EDIT, planId],
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

export default ManagePlanMenu;
