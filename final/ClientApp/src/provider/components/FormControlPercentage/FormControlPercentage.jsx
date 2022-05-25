import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Form } from "react-bootstrap";
import { FormControl } from "../";

const FormControlPercentage = ({ field, form, ...rest }) => {
  const [focusClass, setFocusClass] = useState("");
  const disabled = rest.disabled;
  const onDollarInputFocus = () => {
    setFocusClass("focus");
  };

  const onDollarInputBlur = (e) => {
    const { handleBlur } = rest;
    setFocusClass("");
    handleBlur(e);
  };

  return (
    <FormControl {...field} {...form} {...rest}>
      <InputGroup
        className={`input-dollar-wrapper ${focusClass}`}
        style={{ maxWidth: "200px" }}
      >
        <Form.Control
          {...field}
          {...rest}
          style={{
            //borderLeft: "0px",
            borderRight: "0px",
            borderRadius: "5px 0px 0px 5px",
            flexGrow: 0,
          }}
          onFocus={onDollarInputFocus}
          onBlur={onDollarInputBlur}
        />
        <InputGroup.Append>
          <InputGroup.Text
            className={`input-dollar ${disabled ? "disabled" : ""}`}
          >
            %
          </InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </FormControl>
  );
};

export default FormControlPercentage;
