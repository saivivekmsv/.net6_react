import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";

const FormControlSearch = ({
  size,
  id,
  className,
  placeholder,
  onChange,
  onKeyPress,
  screen,
  ...rest
}) => {
  const [showClear, setShowClear] = useState(false);
  const inputElem = useRef(null);
  const onClear = () => {
    inputElem.current.value = "";
    onChange({
      target: {
        value: "",
      },
    });
    setShowClear(false);
  };

  const buttonClass =
    screen === "plan-group-home" ? "close-button-pg" : "close-button-wrapper";
  const iconClass = screen === "plan-group-home" ? "icon-size" : "close-button";
  const onMouseMove = () => {
    if (inputElem.current.value) {
      setShowClear(true);
    }
  };
  const onMouseOut = () => {
    setShowClear(false);
  };
  const handleChange = (e) => {
    e.preventDefault();
    setShowClear(true);
    onChange(e);
  };

  const closeButtonWrapperClass = showClear ? "active" : "";
  return (
    <div className="form-control-seach-text">
      <Form.Control
        ref={inputElem}
        {...rest}
        size={size}
        id={id}
        className={className}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyPress={onKeyPress}
        onFocus={onMouseOut}
        type="input"
      />
      <div
        className={`${buttonClass} ${closeButtonWrapperClass}`}
        onMouseMove={onMouseMove}
      >
        <button className={iconClass} type="button" onClick={onClear}>
          <FontAwesomeIcon icon={faTimes} size={size || "2x"} />
        </button>
      </div>
    </div>
  );
};

export default FormControlSearch;
