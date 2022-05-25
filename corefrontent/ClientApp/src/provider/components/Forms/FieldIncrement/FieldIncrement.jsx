import React from "react";

import { FormControl, FormControlIncrement } from "../../";

const FieldIncrement = ({ field, form, ...rest }) => {
  return (
    <FormControl {...field} {...form} {...rest}>
      <FormControlIncrement {...field} {...rest} />
    </FormControl>
  );
};

export default FieldIncrement;
