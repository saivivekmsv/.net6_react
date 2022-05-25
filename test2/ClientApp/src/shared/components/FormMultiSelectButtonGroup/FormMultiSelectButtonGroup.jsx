import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

const FormMultiSelectButtonGroup = ({
  options = [],
  selectedValue,
  onChange,
  disabled,
}) => {
  return (
    <ToggleButtonGroup
      className="multi-select-button"
      type="checkbox"
      value={selectedValue}
      onChange={onChange}
    >
      {options.map(({ label, value }, index) => (
        <ToggleButton
          className={"selected-button"}
          key={index}
          value={value}
          disabled={disabled}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default FormMultiSelectButtonGroup;
