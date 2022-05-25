import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { get, toLower, trim, upperFirst } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/pro-solid-svg-icons";
import { Loader } from "../";
import { useComponentDidUpdate } from "../../abstracts";

const FormControl = ({
  label,
  name,
  children,
  isRequired,
  hasSuggestion,
  value,
  suggestionDefaultText,
  isSuggestionLoading,
  isValidSuggestion,
  suggestionErrorMessage,
  shouldDisplaySuggestion,
  size = "md",
  isSuggestionTextItalic,
  noLabelTransform,
  customErrorCode,
  customErrorMessage,
  showTickAlways = false,
  ignoreError = false,
  ...rest
}) => {
  const [showTick, setShowTick] = useState(showTickAlways);
  const [showClass, setShowClass] = useState(true);
  const { submitCount } = rest;

  useComponentDidUpdate(() => {
    if (!isSuggestionLoading) {
      setShowTick(true);
    }
  }, [isSuggestionLoading]);

  const fullText = () => {
    setShowClass(!showClass);
  };

  let className = label && isRequired ? "required" : "";
  const errors = get(rest, `errors`, {});
  const errorMessage = get(errors, name) || errors[name] || "";
  const isTouched = submitCount > 0 || get(rest, `touched.${name}`);
  const isInvalid =
    !!errorMessage || (showTick && hasSuggestion && !isValidSuggestion);
  className = isInvalid ? `${className} invalid` : className;
  const suggestionTextClass = isSuggestionTextItalic ? "italic" : "";
  let childControls = children;

  if (hasSuggestion) {
    const suggestionCheckClass = isValidSuggestion ? "valid" : "invalid";
    childControls = (
      <div className="d-flex">
        {children}
        {isSuggestionLoading && (
          <span className="check-cirle">
            <Loader size="sm" loaderText="" />
          </span>
        )}
        {(shouldDisplaySuggestion ||
          (!isSuggestionLoading && !value && suggestionDefaultText)) && (
          <span className={`suggest-text ${suggestionTextClass}`}>
            {suggestionDefaultText}
          </span>
        )}
        {!isSuggestionLoading && showTick && (
          <span className={`check-cirle ${suggestionCheckClass}`}>
            <FontAwesomeIcon
              icon={isValidSuggestion ? faCheckCircle : faTimesCircle}
              size="sm"
            />
          </span>
        )}
      </div>
    );
  }
  const transformedLabel = noLabelTransform
    ? label
    : upperFirst(toLower(label));
  return (
    <Form.Group className={`${className} ${size}`}>
      {label !== undefined && (
        <Form.Label>
          {transformedLabel}&nbsp;
          {!isRequired && trim(label) && (
            <span className="optional-side-text">(Optional)</span>
          )}
        </Form.Label>
      )}
      {childControls}
      {isInvalid && (
        <>
          {customErrorCode && (
            <Form.Control.Feedback className="invalid-feedback">
              {customErrorCode}
            </Form.Control.Feedback>
          )}
          <Form.Control.Feedback className="invalid-feedback">
            <div>{customErrorMessage || suggestionErrorMessage}</div>
          </Form.Control.Feedback>
          {errorMessage && !ignoreError && (
            <Form.Control.Feedback className="invalid-feedback">
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </>
      )}
    </Form.Group>
  );
};

export default FormControl;
