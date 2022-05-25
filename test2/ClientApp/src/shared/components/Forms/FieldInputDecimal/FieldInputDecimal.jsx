import React, { useState } from "react";
import { Form } from "react-bootstrap";

import { FormControl } from "../..";

const FieldInputDecimal = ({ field, form, onChange, ...rest }) => {
  let prevValue;
  const { max = 100.01 } = rest;

  const [focusClass, setFocusClass] = useState("");
  const countDecimals = function (value) {
    if (Math.floor(value) === value) return 0;
    return value?.toString()?.split(".")[1]?.length || 0;
  };
  const onDecimalInputFocus = () => {
    setFocusClass("focus");
  };
  const onDecimalInputBlur = (e) => {
    if (e.target.value) e.target.value = parseFloat(e.target.value)?.toFixed(2);
    setFocusClass("");
  };
  return (
    <FormControl
      {...field}
      {...form}
      {...rest}
      autoComplete="off"
      type="number"
    >
      <Form.Control
        {...field}
        {...rest}
        step="any"
        onKeyDown={(evt) => {
          if (evt.key === "e" || evt.key === "E" || evt.key === "-")
            evt.preventDefault();
          prevValue = evt.target.value;
        }}
        onChange={(evt) => {
          if (countDecimals(evt.target.value) > 2 || evt.target.value >= max) {
            evt.target.value = prevValue;
          }
          onChange(evt);
        }}
        onFocus={onDecimalInputFocus}
        onBlur={onDecimalInputBlur}
      />
    </FormControl>
  );
};

export default FieldInputDecimal;
