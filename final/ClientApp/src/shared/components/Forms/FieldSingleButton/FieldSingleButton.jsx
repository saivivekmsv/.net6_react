import React from "react";

import { FormControl, FormSingleButtonGroup } from "../../";

const FieldSingleButton = ({ field, form, ...rest }) => {
  return (
    <FormControl {...field} {...form} {...rest}>
      <FormSingleButtonGroup {...field} {...rest} />
    </FormControl>
  );
};

export default FieldSingleButton;
