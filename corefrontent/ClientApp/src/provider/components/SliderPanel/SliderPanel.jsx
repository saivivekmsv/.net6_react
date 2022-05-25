import React from "react";
import SlidingPanel from "react-sliding-side-panel";
import { faTimes, faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";

const SliderPanel = ({
  isOpen,
  children,
  size,
  type = "right",
  onClose,
  showCancel = true,
  backdropClicked,
  screen,
  showEdit = false,
  onEdit,
  showSave = false,
  onSave,
  showCancelButton = false,
  onCancel,
}) => {
  const sliderClass =
    screen === "plan-group" ? "plan-group-slider-content" : "slider-content";
  return (
    <SlidingPanel
      isOpen={isOpen}
      size={size}
      type={type}
      backdropClicked={backdropClicked}
    >
      {showEdit === true ? (
        <div className="slider-edit-button" onClick={onEdit}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </div>
      ) : null}
      {showCancel === true ? (
        <div className="slider-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      ) : null}
      {showCancelButton === true ? (
        <div className="slider-cancel-button" onClick={onClose}>
          <Button variant="secondary">Cancel</Button>
        </div>
      ) : null}
      {showSave === true ? (
        <div className="slider-save-button" onClick={onSave}>
          <Button variant="primary">Save</Button>
        </div>
      ) : null}
      <div className={sliderClass}>{children}</div>
    </SlidingPanel>
  );
};

export default SliderPanel;
