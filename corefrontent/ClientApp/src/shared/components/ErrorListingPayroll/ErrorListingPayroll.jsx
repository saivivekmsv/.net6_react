import { get } from "lodash";
import React, { useState } from "react";

const ErrorListingPayroll = (props) => {
  const { head, content, errorItemClick, data, warningsTab } = props;
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleCheck = (item) => {
    item.checked = !item.checked;
  };

  const selectedValue = (index, tab) => {
    setSelectedIndex(index);
  };

  const checkboxForWarnings = (item, index) => {
    if (warningsTab) {
      selectedValue(index);
      errorItemClick(item);
      handleCheck(item);
    } else {
      selectedValue(index);
      errorItemClick(item);
    }
  };
  return (
    <>
      <div className="errors-card">
        <div className="error-head">{head}</div>
        <ul className="error-body">
          {content.map((item, index) => (
            <li
              className={
                `${item.active}${selectedIndex}` === `${data}${index}`
                  ? "active-text"
                  : "inactive-text"
              }
              onClick={() => checkboxForWarnings(item, index)}
            >
              <div style={{ display: "flex" }}>
                {warningsTab && (
                  <input
                    name={item.id}
                    type="checkbox"
                    //id={item.id}
                    value={item.id}
                    onChange={handleCheck}
                    checked={item.checked}
                  />
                )}
                &nbsp;&nbsp;
                {get(item, "messageCode", "") ||
                  get(item, "messageDescCode", "")}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ErrorListingPayroll;
