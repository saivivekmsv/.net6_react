import { toLower } from "lodash";
import React from "react";
import { Form } from "react-bootstrap";

import { FormControl } from "../../";

const FieldInput = ({ field, form, ...rest }) => {
  let autoCompleteAttr = {
    autoComplete: "off",
  };
  if (["name", "firstName", "lastName", "middleName"].includes(field.name)) {
    autoCompleteAttr = {
      autoComplete: "new-name",
    };
  }
  if (rest.type === "password") {
    autoCompleteAttr = {
      autoComplete: "new-password",
    };
  }
  if (field.name === "email") {
    autoCompleteAttr = {
      autoComplete: "new-email",
    };
  }

  if (
    toLower(field.name).indexOf("postal") !== -1 ||
    toLower(field.name).indexOf("zip") !== -1
  ) {
    autoCompleteAttr = {
      autoComplete: "new-zip",
    };
  }
  return (
    <FormControl {...field} {...form} {...rest}>
      <Form.Control {...field} {...rest} {...autoCompleteAttr} />
    </FormControl>
  );
};

export default FieldInput;
