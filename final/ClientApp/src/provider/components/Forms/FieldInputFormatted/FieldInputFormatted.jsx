import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Form, Button } from "react-bootstrap";
import FormControl from "../../FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const numPadNumberKeyCodes = [
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  96,
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105,
];

const FieldInputFormatted = ({ field, form, ...rest }) => {
  const [cursor, setCursor] = useState();
  const disabled = rest.disabled;

  return (
    <FormControl {...field} {...form} {...rest}>
      <InputGroup className={`input-password-wrapper`}>
        <Form.Control
          {...field}
          {...rest}
          style={{
            borderRadius: "5px",
            flexGrow: 0,
            zIndex: 0,
          }}
          // autoComplete="new-password"
          onKeyDown={(e) => {
            console.log(e.keyCode);
            if (e.keyCode == 37 || e.keyCode == 8)
              setCursor(e.target.selectionStart - 1);
            else if (
              numPadNumberKeyCodes.includes(e.keyCode) ||
              e.keyCode == 39
            )
              setCursor(e.target.selectionStart + 1);
            else setCursor(e.target.selectionStart);
          }}
          onKeyUp={(e) => {
            e.target.setSelectionRange(cursor, cursor);
          }}
          disabled={disabled}
        />
      </InputGroup>
    </FormControl>
  );
};

export default FieldInputFormatted;
