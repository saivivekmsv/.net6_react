import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "../../../components/index";
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
              className="mr-2"
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
            className="mr-2"
            disabled={disabled}
            onClick={onPrimaryClick}
            variant="secondary"
          >
            {buttonLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default AddPlanButton;
