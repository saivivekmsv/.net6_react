import React from "react";

import { FormControl, FormMultiSelectButtonGroup } from "../../";

const FieldMultiSelectButtonGroup = ({ field, form, ...rest }) => {
  return (
    <FormControl {...field} {...form} {...rest}>
      <FormMultiSelectButtonGroup {...field} {...rest} />
    </FormControl>
  );
};

export default FieldMultiSelectButtonGroup;
