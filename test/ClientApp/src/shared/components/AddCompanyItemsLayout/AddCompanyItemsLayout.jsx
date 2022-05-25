import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const AddCompanyItemsLayout = ({
  content,
  buttonLabel,
  link,
  className,
  disabled,
  showError,
  errorMessage,
  onPrimaryClick,
}) => {
  return (
    <div
      className={`add-module-items d-flex align-items-center justify-content-start h-75 bg-white ${className} add-items`}
    >
      <div className="p-5">
        <h4 className="mb-3">{content}</h4>
        {!link && (
          <Button type="button" disabled={disabled} onClick={onPrimaryClick}>
            {buttonLabel}
          </Button>
        )}
        {link && (
          <Link to={link} disabled={disabled}>
            <Button type="button" disabled={disabled} onClick={onPrimaryClick}>
              {buttonLabel}
            </Button>
          </Link>
        )}
        {showError && (
          <div className="invalid-feedback d-block">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default AddCompanyItemsLayout;
