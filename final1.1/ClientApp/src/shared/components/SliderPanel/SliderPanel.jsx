import React from "react";
import SlidingPanel from "react-sliding-side-panel";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SliderPanel = ({
  isOpen,
  children,
  size,
  type = "right",
  onClose,
  showCancel = true,
  backdropClicked,
  screen,
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
      {showCancel === true ? (
        <div className="slider-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      ) : null}
      <div className={sliderClass}>{children}</div>
    </SlidingPanel>
  );
};

export default SliderPanel;
