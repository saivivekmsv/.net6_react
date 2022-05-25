import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVAlt } from "@fortawesome/pro-light-svg-icons";

export const UnmappedField = (props) => {
  const {
    provided,
    innerRef,
    columnName,
    isselected,
    dragStart,
    isDragging,
    isDraggingOver,
  } = props;
  console.log(isDragging);
  console.log(isDraggingOver);
  return (
    <div className="mt-2" {...provided.draggableProps} ref={innerRef}>
      <div className="mb-2" style={{ display: "flex" }}>
        <div
          className="m-0 mr-2"
          style={{ fontSize: "12px", fontWeight: "500" }}
        >
          {columnName ? columnName : "Column Name"}
        </div>
        {isselected ? (
          <div
            style={{
              fontSize: "10px",
              fontWeight: "400",
              display: "flex",
              alignSelf: "flex-end",
            }}
          >
            (Required)
          </div>
        ) : (
          <></>
        )}
      </div>
      <div
        style={{
          width: "16.25rem",
          height: "2.875rem",
          borderStyle: "dotted",
          borderWidth: "thin",
          display: "inline-flex",
          alignItems: "center",
          color: "gray",
          backgroundColor: dragStart ? "#DFECFF" : "#FFFFFF",
        }}
        className="rounded p-2"
      >
        <div className="drop-icons">
          <FontAwesomeIcon icon={faEllipsisVAlt} size="1x" color="#BDBDBD" />
          <FontAwesomeIcon icon={faEllipsisVAlt} size="1x" color="#BDBDBD" />
        </div>
        <p style={{ fontSize: "10px" }} className="m-0">
          Drop here or
          <Link style={{ textDecoration: "none" }} to="/home">
            <span style={{ color: "#2F80ED" }}> {" " + "Click to select"}</span>
          </Link>
        </p>
      </div>
    </div>
  );
};
