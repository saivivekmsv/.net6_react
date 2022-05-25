import React from "react";
import { Button } from "react-bootstrap";
import { isEqual } from "lodash";

const ChipButtonGroup = ({ buttonList, onSelect, selectedItem = {} }) => {
  return (
    <div className="chip-button-group d-flex align-items-center">
      {buttonList.map((item, index) => {
        const className = isEqual(selectedItem.value, item.value)
          ? "selected"
          : "";
        return (
          <Button
            key={index}
            id={`chip-buttons-${item.value}`}
            className={`chip-buttons ${className}`}
            onClick={() => onSelect(item)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};

ChipButtonGroup.defaultProps = {
  buttonList: [],
};

export default ChipButtonGroup;
