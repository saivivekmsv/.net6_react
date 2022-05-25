import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/pro-light-svg-icons";

const AddButton = ({ onAddClick, disabled }) => {
  return (
    <button
      type="button"
      className="add-icon"
      onClick={onAddClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={faPlusSquare} size="lg" />
    </button>
  );
};

export default AddButton;
