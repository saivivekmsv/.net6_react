import React from "react";
import { get } from "lodash";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Image} from "react-bootstrap";
import { faCheckCircle  } from "@fortawesome/pro-solid-svg-icons";
import { getPathWithParam } from "../../../../shared/utils";

const ManagePayrollMenu = ({
  menuList = [],
  selectedMenu,
  flow,
  payrollId,
}) => {
  return (
    <>
    <div className="mt-3 mb-3">
      <Image src="https://storageaccountcore2ad3a.blob.core.windows.net:443/companyimagecontainer/7" height={100} />
    </div>
    <ul className="manage-company-menu list-unstyled">
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
            <FontAwesomeIcon style={{color:"#6FCF97"}} icon={faCheckCircle} size="1x" />
         
            <NavLink
              to={getPathWithParam({
                path: item.path,
                pathParam: [flow, payrollId],
              })}
            >
              {item.label}
            </NavLink>
            <span className="open-rounded-corner-top" />
            <span className="open-rounded-corner-bottom" />
          </li>
        );
      })}
    </ul>
    </>
  );
};

export default ManagePayrollMenu;
