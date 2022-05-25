import React, { useState } from "react";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-solid-svg-icons";
import { getPathWithParam } from "../../utils";
import { Accordion, Card } from "react-bootstrap";
import { useDeepEffect } from "../../abstracts";

const ManageReportMenu = ({ menuList = [], selectedMenu, flow, reportId }) => {
  const [select, setSelect] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [selectUl, setSelectUl] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [selectLi, setSelectLi] = useState("Status");
  const [activeULKey, setActiveULKey] = useState(1);

  const onIconClick = (i) => {
    setSelect((select) => ({ ...select, [i]: !select[i] }));
    // setSelectUl((selectUl) => ({ ...selectUl, 1:false, 2:false, 3:false, 4:false,5:false }));
    // setSelectUl((selectUl) => ({ ...selectUl, [i]: true }));
  };

  const onsubNavClick = (i, label) => {
    setSelectUl((selectUl) => ({
      ...selectUl,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    }));
    setSelectUl((selectUl) => ({ ...selectUl, [i]: true }));
    setSelectLi(label);
    setActiveULKey(i);
  };

  return (
    <div className="manage-report-menu">
      {menuList.map((item, i) => {
        // console.log(item.subNav, "itemsLidt");
        const subNav = get(item, "subNav", []);
        const childRoutes = get(item, "childRoutes", []);
        // console.log(i, "index");
        let className =
          selectedMenu.indexOf(item.path) !== -1 ||
          childRoutes.filter((route) => {
            return selectedMenu.indexOf(route) !== -1;
          }).length
            ? "selected"
            : "";
        return (
          <Accordion defaultActiveKey={activeULKey}>
            {i !== 0 && (
              <Accordion.Toggle
                as={Card.Header}
                eventKey={i}
                onClick={() => onIconClick(i)}
              >
                <FontAwesomeIcon
                  icon={select[i] ? faAngleUp : faAngleDown}
                  size="1x"
                />
                <span className={selectUl[i] ? "itemBold" : ""}>
                  {" " + item.label}
                </span>
              </Accordion.Toggle>
            )}
            <Accordion.Collapse eventKey={i}>
              <ul>
                {subNav.map((data, index) => {
                  // console.log(data, "data");
                  return (
                    <li key={index}>
                      <Link
                        to={getPathWithParam({
                          path: data.path,
                          pathParam: [flow, reportId],
                        })}
                      >
                        <span
                          onClick={() => onsubNavClick(i, data.label)}
                          className={selectLi == data.label ? "itemBold" : ""}
                        >
                          {data.label}
                        </span>
                      </Link>
                      <span className="open-rounded-corner-top" />
                      <span className="open-rounded-corner-bottom" />
                    </li>
                  );
                })}
              </ul>
            </Accordion.Collapse>
          </Accordion>
        );
      })}
    </div>

    // <ul className="manage-company-menu">
    // {menuList.map((item) => {
    //   const childRoutes = get(item, "childRoutes", []);
    //   let className =
    //     selectedMenu.indexOf(item.path) !== -1 ||
    //     childRoutes.filter((route) => {
    //       return selectedMenu.indexOf(route) !== -1;
    //     }).length
    //       ? "selected"
    //       : "";

    //     return (
    //       <li key={item.path} className={`${className} has-tick`}>
    //         <FontAwesomeIcon icon={select?faAngleUp:faAngleDown} size="1x" />
    //         &nbsp;&nbsp;&nbsp;&nbsp;
    //         {/* <Link
    // onClick = {()=>setSelect(!select)}
    // to={getPathWithParam({
    //   path: item.path,
    //   pathParam: [flow, eligibilityId],
    // })}
    //         >
    //           {item.label}
    //         </Link> */}

    //         <span className="open-rounded-corner-top" />
    //         <span className="open-rounded-corner-bottom" />
    //       </li>
    //     );
    //   })}
    // </ul>
  );
};

export default ManageReportMenu;
