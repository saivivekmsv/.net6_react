import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Form } from "react-bootstrap";
import { FormControl } from "../";
import { faChevronUp, faChevronDown } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const FormControlIncrement = ({ field, form, ...rest }) => {
  const [focusClass, setFocusClass] = useState("");
  const [initialValue, setInitialValue] = useState(0);
  const disabled = rest.disabled;

  const Increment = () => {
    initialValue ? setInitialValue(initialValue + 1) : setInitialValue(0);
  };
  const decrement = () => {
    initialValue ? setInitialValue(0) : setInitialValue(initialValue - 1);
  };
  const onDollarInputFocus = () => {
    setFocusClass("focus");
  };

  //   const onDollarInputBlur = (e) => {
  //     const { handleBlur } = rest;
  //     if (e.target.value) e.target.value = parseFloat(e.target.value)?.toFixed(2);
  //     setFocusClass("");
  //     handleBlur(e);
  //   };

  return (
    <FormControl {...field} {...form} {...rest} size="xs">
      <InputGroup className={`input-dollar-wrapper ${focusClass}`}>
        <Form.Control
          {...field}
          {...rest}
          style={{
            borderRight: "0px",
            borderRadius: "5px 0px 0px 5px",
            flexGrow: 0,
          }}
          onFocus={onDollarInputFocus}
        />
        <InputGroup.Append>
          <div className="field-arrows">
            <FontAwesomeIcon icon={faChevronUp} onClick={Increment} />
            <FontAwesomeIcon icon={faChevronDown} onClick={decrement} />
          </div>
        </InputGroup.Append>
      </InputGroup>
    </FormControl>
  );
};

export default FormControlIncrement;
