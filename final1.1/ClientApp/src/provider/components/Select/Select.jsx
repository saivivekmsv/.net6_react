import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const Select = (props) => {
  const {
    onClick,
    id,
    optionsList = [],
    title,
    className,
    // id = ''
    value: selectedValue,
    size,
  } = props;
  return (
    <div className="dropdown-component" style={size}>
      <DropdownButton
        alignRight
        title={title}
        id="dropdown-menu-align-right"
        className={className + " w-100 border-0"}
      >
        {optionsList.map(({ value, label }, i) => (
          <Dropdown.Item
            key={i}
            onClick={(e) => {
              let body = {};
              body = {
                target: {
                  value: typeof value === "undefined" ? label : value,
                  data: optionsList[i],
                  id: id,
                },
              };
              // this.handleDropdown(id)
              onClick(body);
            }}
            className={selectedValue === value ? "selected" : ""}
          >
            {label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
};

export default Select;
