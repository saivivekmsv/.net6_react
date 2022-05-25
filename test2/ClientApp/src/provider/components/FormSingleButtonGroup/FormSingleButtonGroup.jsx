import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const FormSingleButtonGroup = ({
  options = [],
  onChange,
  selectedValue,
  label,
  name,
  disabled,
}) => {
  const className = disabled ? "disabled" : "";

  return (
    <div className="single-button">
      <div className={`form-control form-button-group ${className}`}>
        <ButtonGroup aria-label={label} name={name}>
          {options.map(({ label, value }, index) => {
            const selectedClass = selectedValue === value ? "selected" : "";
            let buttonProps = {};
            if (!disabled) {
              buttonProps = { onClick: () => onChange(value) };
            }
            return (
              <Button
                key={index}
                type="button"
                className={selectedClass}
                {...buttonProps}
                disabled={disabled}
                data-attr={value}
              >
                {label}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default FormSingleButtonGroup;
