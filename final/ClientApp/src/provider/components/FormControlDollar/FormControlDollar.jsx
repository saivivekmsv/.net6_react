import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Form } from "react-bootstrap";
import { FormControl } from "../";

const FormControlDollar = ({ field, form, ...rest }) => {
  const [focusClass, setFocusClass] = useState("");
  const disabled = rest.disabled;
  const onDollarInputFocus = () => {
    setFocusClass("focus");
  };

  const onDollarInputBlur = (e) => {
    const { handleBlur } = rest;
    if (e.target.value) e.target.value = parseFloat(e.target.value)?.toFixed(2);
    setFocusClass("");
    handleBlur(e);
  };

  return (
    <FormControl {...field} {...form} {...rest} size="sm">
      <InputGroup
        className={`input-dollar-wrapper ${focusClass}`}
        style={{ maxWidth: "200px", flexWrap: "nowrap" }}
      >
        <InputGroup.Prepend>
          <InputGroup.Text
            className={`input-dollar ${disabled ? "disabled" : ""}`}
          >
            $
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          {...field}
          {...rest}
          style={{
            borderLeft: "0px",
            borderRadius: "0px 5px 5px 0px",
            flexGrow: 0.2,
          }}
          onFocus={onDollarInputFocus}
          onBlur={onDollarInputBlur}
        />
      </InputGroup>
    </FormControl>
  );
};

export default FormControlDollar;
