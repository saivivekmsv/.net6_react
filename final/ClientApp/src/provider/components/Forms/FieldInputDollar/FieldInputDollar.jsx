import React from "react";

import { FormControlDollar } from "../../";

const FieldInputDollar = ({
  field,
  form,
  onChange,
  preventNegative,
  ...rest
}) => {
  let prevValue;
  const { max = 99999999999.99 } = rest;
  const countDecimals = function (value) {
    if (Math.floor(value) === value) return 0;
    return value?.toString()?.split(".")[1]?.length || 0;
  };

  return (
    <FormControlDollar
      {...field}
      {...form}
      {...rest}
      autoComplete="off"
      type="number"
      step="any"
      onKeyDown={(evt) => {
        if (!preventNegative && (evt.key === "e" || evt.key === "E")) {
          evt.preventDefault();
          prevValue = evt.target.value;
        } else if (
          preventNegative &&
          (evt.key === "e" || evt.key === "E" || evt.key === "-")
        ) {
          evt.preventDefault();
        }
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

export default FieldInputDollar;
