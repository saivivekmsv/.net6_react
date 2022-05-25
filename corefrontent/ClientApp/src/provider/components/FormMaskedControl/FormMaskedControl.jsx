import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Form, Button } from "react-bootstrap";
import { FormControl } from "../";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { ssnMasking } from "../../utils";
import { useDeepEffect } from "../../abstracts";

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

const FormMaskedControl = ({ field, form, ...rest }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [focusClass, setFocusClass] = useState("");
  const [cursor, setCursor] = useState();
  const disabled = rest.disabled;

  const onDollarInputFocus = (e) => {
    setFocusClass("focus");
    if (!e.target.value) {
      setPasswordShown(true);
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const onDollarInputBlur = (e) => {
    const { handleBlur } = rest;
    setFocusClass("");
    setPasswordShown(false);
    handleBlur(e);
  };

  const maskingClass = !passwordShown ? "mask" : "";
  return (
    <FormControl {...field} {...form} {...rest}>
      <InputGroup
        className={`input-password-wrapper ${focusClass} ${maskingClass}`}
      >
        <Form.Control
          {...field}
          {...rest}
          style={{
            borderRadius: "5px 0px 0px 5px",
            borderRight: "0px",
            flexGrow: 0,
            zIndex: 0,
          }}
          onFocus={onDollarInputFocus}
          onBlur={onDollarInputBlur}
          autoComplete="new-password"
          onKeyDown={(e) => {
            if (e.keyCode == 37 || e.keyCode == 8)
              setCursor(e.target.selectionStart - 1);
            else if (
              numPadNumberKeyCodes.includes(e.keyCode) ||
              e.keyCode == 39
            ) {
              if (
                (e.target.selectionStart == 3 ||
                  e.target.selectionStart == 6) &&
                e.keyCode != 39
              )
                setCursor(e.target.selectionStart + 2);
              else setCursor(e.target.selectionStart + 1);
            } else setCursor(e.target.selectionStart);
          }}
          onKeyUp={(e) => {
            e.target.setSelectionRange(cursor, cursor);
          }}
          disabled={rest?.disableField ?? false}
          readOnly={!passwordShown}
        />
        <InputGroup.Prepend>
          <Button
            variant="link"
            onClick={togglePasswordVisiblity}
            className={`input-password ${disabled ? "disabled" : ""}`}
          >
            <FontAwesomeIcon icon={passwordShown ? faEye : faEyeSlash} />
          </Button>
        </InputGroup.Prepend>
        {!passwordShown && (
          <div className="ssn-masker">{ssnMasking(rest.value)}</div>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default FormMaskedControl;
