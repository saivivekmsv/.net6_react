import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Form } from "react-bootstrap";
import { FormControl } from "../";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";

const FormControlPassword = ({ field, form, ...rest }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [focusClass, setFocusClass] = useState("");
  const disabled = rest.disabled;
  const onDollarInputFocus = () => {
    setFocusClass("focus");
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const onDollarInputBlur = (e) => {
    const { handleBlur } = rest;
    setFocusClass("");
    handleBlur(e);
  };

  return (
    <FormControl {...field} {...form} {...rest}>
      <InputGroup className={`input-password-wrapper ${focusClass}`}>
        <Form.Control
          {...field}
          {...rest}
          type={passwordShown ? "text" : "password"}
          style={{
            borderRadius: "5px 0px 0px 5px",
            borderRight: "0px",
            flexGrow: 0,
            zIndex: 0,
          }}
          onFocus={onDollarInputFocus}
          onBlur={onDollarInputBlur}
          autoComplete="new-password"
        />
        <InputGroup.Prepend>
          <InputGroup.Text
            className={`input-password ${disabled ? "disabled" : ""}`}
          >
            {passwordShown === true ? (
              <FontAwesomeIcon onClick={togglePasswordVisiblity} icon={faEye} />
            ) : (
              <FontAwesomeIcon
                onClick={togglePasswordVisiblity}
                icon={faEyeSlash}
              />
            )}
          </InputGroup.Text>
        </InputGroup.Prepend>
      </InputGroup>
    </FormControl>
  );
};

export default FormControlPassword;
