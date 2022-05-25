import { toLower } from "lodash";
import React from "react";
import { Form } from "react-bootstrap";

import { FormControl } from "../..";

const FieldInputNumber = ({ field, form, onChange, ...rest }) => {
  const { max } = rest;
  const { min = 0 } = rest;
  return (
    <FormControl
      {...field}
      {...form}
      {...rest}
      autoComplete="off"
      type="number"
      step="1"
    >
      <Form.Control
        {...field}
        {...rest}
        type="number"
        step="1"
        onKeyDown={(evt) => {
          if (
            evt.key === "e" ||
            evt.key === "E" ||
            evt.key === "." ||
            evt.key === "-"
          ) {
            evt.preventDefault();
          }
          if (
            max &&
            (parseInt(evt.target.value.toString() + evt.key.toString(), 10) >
              max ||
              parseInt(evt.target.value.toString() + evt.key.toString(), 10) <
                min)
          ) {
            evt.preventDefault();
          }
        }}
        onChange={(evt) => {
          if (evt.target.value == "") {
            evt.target.value = null;
          }
          onChange(evt);
        }}
      />
    </FormControl>
  );
};

export default FieldInputNumber;
