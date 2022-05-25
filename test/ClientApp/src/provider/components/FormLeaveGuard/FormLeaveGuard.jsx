import React from "react";
import { Button } from "react-bootstrap";
import WarningModal from "../WarningModal";

const FormLeaveGuard = ({
  showModal,
  handleConfirmClick,
  handleCancelClick,
}) => {
  return (
    <WarningModal show={showModal} onHide={handleCancelClick}>
      <div className="remove-text">
        <h4>Are you sure?</h4>
        <p>Your changes may be lost. Do you want to continue ?</p>
        <Button className="remove-btn mr-4" onClick={handleConfirmClick}>
          Yes
        </Button>
        <Button className="cancel-btn" onClick={handleCancelClick}>
          No
        </Button>
      </div>
    </WarningModal>
  );
};
export default FormLeaveGuard;
