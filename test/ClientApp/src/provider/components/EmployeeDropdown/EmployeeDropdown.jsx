import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import EmployeeDropdownOption from "../EmployeeDropdownOption";

const EmployeeDropdown = (props) => {
  const { sortOrder, setSortOrder } = props;
  const [selectedTitle, setSelectedTitle] = useState();

  const optionClick = (item) => {
    setSelectedTitle(item);
    switch (item) {
      case "Name(A-Z)":
        setSortOrder(1);
        break;
      case "Recently Edited":
        setSortOrder(2);
        break;
      case "Name(Z-A)":
        setSortOrder(3);
        break;
    }
  };

  return (
    <div>
      {" "}
      <Dropdown>
        {" "}
        <Dropdown.Toggle className="sponsor-dropdown-toggle">
          {" "}
          <div className="dropdown-placeholder">
            {props.icon ? props.icon : ""}
            {sortOrder ? selectedTitle : "Select"}
          </div>{" "}
        </Dropdown.Toggle>{" "}
        <Dropdown.Menu className="dropdown-menu">
          {/*                                      {" "} */}
          {props.options?.map((data, index) => (
            <div>
              <Dropdown.Item
                className="dropdown-item"
                onClick={() => {
                  optionClick(data.title);
                }}
              >
                {" "}
                <EmployeeDropdownOption title={data.title} />{" "}
              </Dropdown.Item>
              <Dropdown.Divider />
              {/* {" "} */}
            </div>
          ))}{" "}
        </Dropdown.Menu>{" "}
      </Dropdown>{" "}
    </div>
  );
};

export default EmployeeDropdown;
