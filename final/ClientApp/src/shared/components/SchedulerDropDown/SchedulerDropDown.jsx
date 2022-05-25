import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toLower, values } from "lodash";
import React, { useState, useEffect } from "react";
import { Button, Image, Form, InputGroup } from "react-bootstrap";
import "../../styles/containers/SchedulerContainer.scss";

const SchedulerDropDown = ({
  data,
  setSelectedOptn,
  selectedOptn,
  timeOption,
  valuesOption,
  isselected,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setSelectedItem(null);
  }, [timeOption]);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (id, label) => {
    selectedItem == label ? setSelectedItem(null) : setSelectedItem(label);
    setOpen(false);
    setSelectedOptn(label);
  };
  const setLabel = () => {
    if (isselected) {
      if (selectedOptn != null) {
        return selectedOptn;
      } else {
        return "Select";
      }
    } else {
      return "Select";
    }

    // isselected ? selectedOptn ? selectedOptn : selectedItem
    //   ? items.find((item) => item.label == selectedItem).label
    //   : "Select" : "Select"
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="dropdown" onMouseOut={() => setOpen(false)}>
        <div className="dropdown-header" onClick={toggleDropdown}>
          {setLabel()}
          <i className={`fa fa-chevron-down icon ${isOpen && "open"}`}></i>
        </div>
        <div
          className={`dropdown-body ${isOpen && "open"}`}
          onMouseOver={() => setOpen(true)}
        >
          {items.map((item) => (
            <div
              className="dropdown-item"
              onClick={(e) => handleItemClick(item.id, item.label)}
              id={item.id}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SchedulerDropDown;
