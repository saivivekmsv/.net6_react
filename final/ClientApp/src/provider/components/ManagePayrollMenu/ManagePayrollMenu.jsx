import React from "react";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { getPathWithParam } from "../../utils";

const ManagePayrollMenu = ({
  menuList = [],
  selectedMenu,
  flow,
  payrollId,
}) => {
  return (
    <ul className="manage-company-menu">
      {menuList.map((item) => {
        const childRoutes = get(item, "childRoutes", []);
        const subRoutes = get(item, "subRoutes", []);
        let className =
          subRoutes.length == 0 &&
          (selectedMenu.indexOf(item.path) !== -1 ||
            childRoutes.filter((route) => {
              return selectedMenu.indexOf(route) !== -1;
            }).length)
            ? "selected"
            : "";

        return (
          <>
            <li key={item.path} className={`${className} has-tick`}>
              <FontAwesomeIcon icon={faCheckCircle} size="1x" />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Link
                to={getPathWithParam({
                  path: item.path,
                  pathParam: [flow, payrollId],
                })}
                onClick={(event) => {
                  subRoutes.length != 0 && event.preventDefault();
                }}
              >
                {item.label}
              </Link>
              <span className="open-rounded-corner-top" />
              <span className="open-rounded-corner-bottom" />
            </li>
            {subRoutes.map((item) => {
              let classNameSubRoute =
                selectedMenu.indexOf(item.path) !== -1 ||
                item.childRoutes.filter((route) => {
                  return selectedMenu.indexOf(route) !== -1;
                }).length
                  ? "selected"
                  : "";

              return (
                <li key={item.path} className={`${classNameSubRoute} has-tick`}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ fontSize: "15px" }}
                    className=" ml-3"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Link
                    to={getPathWithParam({
                      path: item.path,
                      pathParam: [flow, payrollId],
                    })}
                  >
                    {item.label}
                  </Link>
                  <span className="open-rounded-corner-top" />
                  <span className="open-rounded-corner-bottom" />
                </li>
              );
            })}
          </>
        );
      })}
    </ul>
  );
};

export default ManagePayrollMenu;
