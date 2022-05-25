import { faEllipsisV, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "..";

const EditActionSlider = ({ editLink }) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  return (
    <div className="edit-action-slider">
      {!isSliderOpen && (
        <button
          className="edit-action"
          onClick={(e) => {
            e.preventDefault();
            setIsSliderOpen(true);
          }}
        >
          <FontAwesomeIcon
            icon={faEllipsisV}
            color="#828282"
            className="pointer"
          />
        </button>
      )}
      {isSliderOpen && (
        <div className="edit-flow">
          <div className="d-flex justify-content-between">
            <div>
              <Link to={editLink}>Edit</Link>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faTimes}
                size="18px"
                color="#828282"
                className="pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSliderOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditActionSlider;
