import React from "react";
import { Form } from "react-bootstrap";

import { FormControl } from "../../";

const FieldTextarea = ({ field, form, ...rest }) => {
  return (
    <FormControl {...field} {...form} {...rest}>
      <Form.Control
        as="textarea"
        rows={3}
        {...field}
        {...rest}
        autoComplete="off"
      />
    </FormControl>
  );
};

export default FieldTextarea;
