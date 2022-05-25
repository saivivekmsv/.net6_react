import React from "react";

import { FormControl, FormButtonGroup } from "../../";

const FieldButtonGroup = ({ field, form, ...rest }) => {
  return (
    <FormControl {...field} {...form} {...rest}>
      <FormButtonGroup {...field} {...rest} />
    </FormControl>
  );
};

export default FieldButtonGroup;
