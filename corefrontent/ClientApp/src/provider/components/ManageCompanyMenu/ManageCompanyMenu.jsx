import React from "react";
import { Link } from "react-router-dom";
import { get } from "lodash";
import tenantConfig from "../../mocks/tenantOne.json";
import {
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_COMPANY_ROUTES,
} from "../../utils";

const ManageCompanyMenu = ({
  menuList = [],
  selectedMenu,
  flow,
  companyId,
  isPayrollCalenderRequire,
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
        className =
          !companyId &&
          item.path !== MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS
            ? `${className} disabled`
            : className;

        className =
          !isPayrollCalenderRequire &&
          item.path === MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR
            ? `${className} d-none`
            : className;
        return (
          tenantConfig.companySubMenu.includes(item.id) && (
            <li key={item.path} className={className}>
              {!companyId ? (
                item.label
              ) : (
                <Link
                  to={getPathWithParam({
                    path: item.path,
                    pathParam: [FLOW_TYPES.EDIT, companyId],
                  })}
                >
                  {item.label}
                </Link>
              )}
              <span className="open-rounded-corner-top" />
              <span className="open-rounded-corner-bottom" />
            </li>
          )
        );
      })}
    </ul>
  );
};

export default ManageCompanyMenu;
