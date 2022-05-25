import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Form } from "react-bootstrap";
import { FormControl } from "../";

export const FormControlDays = ({ field, form, ...rest }) => {
  const [focusClass, setFocusClass] = useState("");
  const disabled = rest.disabled;
  const onDaysInputFocus = () => {
    setFocusClass("focus");
  };

  const onDaysInputBlur = (e) => {
    const { handleBlur } = rest;
    setFocusClass("");
    handleBlur(e);
  };

  return (
    <FormControl {...field} {...form} {...rest}>
      <InputGroup className={`input-Days-wrapper ${focusClass}`}>
        <InputGroup.Text className={`input-Days ${disabled ? "disabled" : ""}`}>
          <InputGroup.Append>Days</InputGroup.Append>
        </InputGroup.Text>
        <Form.Control
          {...field}
          {...rest}
          style={{
            borderLeft: "0px",
            borderRadius: "0px 5px 5px 0px",
            flexGrow: 0,
          }}
          onFocus={onDaysInputFocus}
          onBlur={onDaysInputBlur}
        />
      </InputGroup>
    </FormControl>
  );
};

export default FormControlDays;
