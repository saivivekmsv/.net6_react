import React from "react";

import { FormMaskedControl } from "../..";

const FieldInputSSN = ({ field, form, ...rest }) => {
  return <FormMaskedControl {...field} {...form} {...rest} />;
};

export default FieldInputSSN;
