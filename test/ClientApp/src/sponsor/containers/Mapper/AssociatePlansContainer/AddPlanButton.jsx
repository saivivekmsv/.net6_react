import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "../../../../shared/components/index";
const AddPlanButton = ({
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
    <div className="d-flex">
      {secondaryButtonLabel && (
        <>
          <Link to={secondaryButtonLink} disabled={secondaryDisabled}>
            <Button
              className="AddPlan"
              type="button"
              variant="secondary"
              disabled={secondaryDisabled}
            >
              {secondaryButtonLabel}
            </Button>
          </Link>
          {/* &nbsp;&nbsp;&nbsp; */}
        </>
      )}

      {buttonLabel && (
        <Link to={link} disabled={disabled}>
          <Button
            className={className}
            type="button"
            disabled={disabled}
            onClick={onPrimaryClick}
          >
            {buttonLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default AddPlanButton;
