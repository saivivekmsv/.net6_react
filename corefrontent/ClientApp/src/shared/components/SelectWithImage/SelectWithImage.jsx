import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const SelectWithImage = (props) => {
  const {
    onClick,
    id,
    optionsList = [],
    title,
    className,
    // id = '',
    data: selectedValue,
  } = props;
  return (
    <div className="dropdown-component">
      <DropdownButton
        alignRight
        title={title}
        id="dropdown-menu-align-right"
        className={className}
      >
        {optionsList.map(({ value, label, image }, i) => (
          <Dropdown.Item
            key={i}
            onClick={(e) => {
              let body = {};
              body = {
                target: {
                  // data:
                  //   typeof value === "undefined" ? (
                  //     <span>
                  //       <img src={optionsList[i].image} width="15px" alt="" />{" "}
                  //       {optionsList[i].label}
                  //     </span>
                  //   ) : (
                  //     <span>
                  //       <img src={optionsList[i].image} width="15px" alt="" />{" "}
                  //       {optionsList[i].label}
                  //     </span>
                  //   ),
                  data: optionsList[i],
                  id: id,
                },
              };
              // console.log(e, "value")
              // this.handleDropdown(id)
              onClick(body);
            }}
            className={selectedValue === value ? "selected" : ""}
          >
            <img src={image} width="15px" alt="" /> {label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
};

export default SelectWithImage;
