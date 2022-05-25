import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FormControl } from "../";
import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons";

const FormControlDecimal = ({ field, form, ...rest }) => {
  const [focusClass, setFocusClass] = useState("");
  const disabled = rest.disabled;
  const onDollarInputFocus = () => {
    setFocusClass("focus");
  };

  const onDollarInputBlur = (e) => {
    const { handleBlur } = rest;
    if (e.target.value) e.target.value = parseFloat(e.target.value)?.toFixed(2);
    setFocusClass("");
    handleBlur(e);
  };
  const { hide, errorId, setErrorId } = rest;
  return (
    <FormControl {...field} {...form} {...rest} size="sm">
      <InputGroup style={{ maxWidth: "150px", flexWrap: "nowrap" }}>
        <Form.Control
          {...field}
          {...rest}
          onFocus={onDollarInputFocus}
          onBlur={onDollarInputBlur}
          style={{
            borderRadius: "5px",
            flexGrow: 0.2,
          }}
        />
        {hide && (
          <InputGroup.Append>
            <FontAwesomeIcon
              icon={faCheck}
              size="md"
              color="green"
              className="pointer"
              style={{ marginLeft: "15px", marginTop: "9px" }}
              onClick={() => setErrorId(errorId)}
            />
          </InputGroup.Append>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default FormControlDecimal;
