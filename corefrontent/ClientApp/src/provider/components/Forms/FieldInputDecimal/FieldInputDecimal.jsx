import React from "react";

import { FormControlDecimal } from "../../";

const FieldInputDecimal = ({ field, form, onChange, ...rest }) => {
  let prevValue;
  const { max = 999.99 } = rest;
  const countDecimals = function (value) {
    if (Math.floor(value) === value) return 0;
    return value?.toString()?.split(".")[1]?.length || 0;
  };

  return (
    <FormControlDecimal
      {...field}
      {...form}
      {...rest}
      autoComplete="off"
      type="number"
      step="any"
      onKeyDown={(evt) => {
        if (evt.key === "e" || evt.key === "E") evt.preventDefault();
        prevValue = evt.target.value;
      }}
      onChange={(evt) => {
        if (countDecimals(evt.target.value) > 2 || evt.target.value > max) {
          evt.target.value = prevValue;
        }
        onChange(evt);
      }}
    />
  );
};

export default FieldInputDecimal;
