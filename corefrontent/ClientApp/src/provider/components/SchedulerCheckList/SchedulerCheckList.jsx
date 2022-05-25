import { faTimes } from "@fortawesome/pro-light-svg-icons";

import React, { useState, useEffect } from "react";
import { Button, Image, Form, InputGroup } from "react-bootstrap";
import "../../styles/containers/SchedulerContainer.scss";

const SchedulerCheckList = ({
  data,
  setSelectedOptn,
  selectedOptn,
  timeOption,
  valuesOption,
  isselected,
}) => {
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    // setSelectedItem(null);
    setcheckedItemlabels([]);
    // setSelectedOptn(null);
  }, [timeOption]);

  const [items, setItem] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => setOpen(!isOpen);
  const [checkedItems, setcheckedItems] = useState([]);
  const [checkedItemlabels, setcheckedItemlabels] = useState([]);
  const [isListContains, setListContains] = useState(false);

  const handleItemClick = (id, label) => {
    if (checkedItemlabels.includes(label)) {
      // let n = checkedItems;
      // n.pop(id)
      // setcheckedItems(n)

      let m = checkedItemlabels;
      m = m.filter((itemLabel) => {
        if (label == itemLabel) {
          return false;
        } else {
          return true;
        }
      });

      if (m.length == 0) {
        setListContains(false);
      } else {
        setListContains(true);
        m.sort();
      }

      setcheckedItemlabels(m);
      let senText = checkedItemlabels.toString();
      setSelectedOptn(senText);
    } else {
      // let n = checkedItems;
      // n.push(id);
      // setcheckedItems(n);

      let m = checkedItemlabels;
      m.push(label);
      setListContains(true);
      m.sort();

      setcheckedItemlabels(m);
      let senText = checkedItemlabels.toString();
      setSelectedOptn(senText);
    }

    // setOpen(false);
  };

  const setLabel = () => {
    if (isselected) {
      if (selectedOptn != null) {
        let x = checkedItemlabels.toString();
        return selectedOptn;
      } else {
        return "Select";
      }
    } else {
      return "Select";
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="dropdown2CheckList" onMouseOut={() => setOpen(false)}>
        <div className="dropdown2Check-header" onClick={toggleDropdown}>
          {setLabel()}
          {/* {isListContains ? checkedItemlabels.toString() : "Select"} */}

          <i
            className={`fa fa-chevron-down icon ${isOpen && "open"}`}
            style={{ marginLeft: "80px" }}
          ></i>
        </div>
        <div
          className={`dropdown2Check-body ${isOpen && "open"}`}
          onMouseOver={() => setOpen(true)}
        >
          {items.map((item, index) => (
            <div className="dropdown2-item2">
              <label>
                <input
                  type="checkbox"
                  name="sliderOptions"
                  value={item.id}
                  onClick={(e) => handleItemClick(index, item.label)}
                  id={item.id}
                />
                {"\u00A0"} {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulerCheckList;
