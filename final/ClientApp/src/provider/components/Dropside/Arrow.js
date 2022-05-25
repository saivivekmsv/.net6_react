import React from "react";
import { arrowButtonStyle } from "./style";

export default function Arrow(props) {
  const { showPopup, onClick, disabled, direction } = props;

  const isOpenClass = showPopup ? "is-open" : "";
  return (
    <span
      style={{ ...arrowButtonStyle }}
      onClick={onClick}
      disabled={disabled}
      className={`dropSide-custom-select-arrow ${direction} ${isOpenClass}`}
    >
      <span className="arrow-item">&#62;</span>
    </span>
  );
}
