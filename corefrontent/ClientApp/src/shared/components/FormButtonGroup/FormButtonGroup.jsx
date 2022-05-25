import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const FormButtonGroup = ({
  options = [],
  onChange,
  selectedValue,
  label,
  name,
  disabled,
}) => {
  const className = disabled ? "disabled" : "";

  return (
    <div className={`form-control form-button-group ${className}`}>
      <ButtonGroup aria-label={label} name={name}>
        {options.map(({ label, value }, index) => {
          const selectedClass = selectedValue === value ? "selected" : "";
          let buttonProps = {};
          if (!disabled) {
            buttonProps = { onClick: () => onChange(value) };
          }
          if (label === "BASIC") {
            return (
              <Button
                key={index}
                type="button"
                className={selectedClass}
                {...buttonProps}
                disabled={disabled}
                data-attr={value}
              >
                <div className="display-flex">
                  <div className="marg-right-12">{label}</div>
                  <div className="tooltip-basic">
                    <i
                      class="fal fa-info-circle"
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        lineHeight: "12px",
                        color: "#3A3974",
                      }}
                    />
                    <span className="tooltiptext">
                      Basic (100% on first 3% + 50% on the next 2%)
                    </span>
                  </div>
                </div>
              </Button>
            );
          } else if (label === "QACA") {
            return (
              <Button
                key={index}
                type="button"
                className={selectedClass}
                {...buttonProps}
                disabled={disabled}
                data-attr={value}
              >
                <div className="display-flex">
                  <div className="marg-right-12">{label}</div>
                  <div className="tooltip-qaca">
                    <i
                      class="fal fa-info-circle"
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        lineHeight: "12px",
                        color: "#3A3974",
                      }}
                    />
                    <span className="tooltiptext">
                      QACA (100% on first 1% + 50% on the next 5%)
                    </span>
                  </div>
                </div>
              </Button>
            );
          } else {
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
          }
        })}
      </ButtonGroup>
    </div>
  );
};

export default FormButtonGroup;
