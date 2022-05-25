import React from "react";

import { FormControl, Dropside } from "../../";

const FieldDropSide = ({ field, form, ...rest }) => {
  return (
    <FormControl {...field} {...form} {...rest}>
      <Dropside {...field} {...rest} />
    </FormControl>
  );
};

export default FieldDropSide;
