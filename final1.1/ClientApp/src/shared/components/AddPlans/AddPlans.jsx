import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "../";

const AddPlans = ({
  content,
  buttonLabel,
  link,
  className,
  disabled,
  secondaryButtonLabel,
  secondaryButtonLink,
  secondaryDisabled,
  onPrimaryClick,
  errorMessage,
  showError,
}) => {
  return (
    <div
      className={`add-module-items d-flex align-items-center justify-content-start h-75 bg-white ${className} add-items`}
    >
      <div className="p-5">
        <h4 className="mb-3">{content}</h4>
        <div className="d-flex">
          {secondaryButtonLabel && (
            <>
              <Link to={secondaryButtonLink} disabled={secondaryDisabled}>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={secondaryDisabled}
                >
                  {secondaryButtonLabel}
                </Button>
              </Link>
              &nbsp;&nbsp;&nbsp;
            </>
          )}

          {buttonLabel && (
            <Link to={link} disabled={disabled}>
              <Button
                type="button"
                disabled={disabled}
                onClick={onPrimaryClick}
              >
                {buttonLabel}
              </Button>
            </Link>
          )}
        </div>
        {showError && (
          <div className="invalid-feedback d-block">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default AddPlans;
