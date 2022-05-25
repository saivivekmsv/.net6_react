import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVAlt } from "@fortawesome/pro-light-svg-icons";
import ClickToSelectSlideout from "./ClickToSelectSlideout";
import sampleData from "./sampleData";

export const UnmappedField = (props) => {
  const {
    provided,
    innerRef,
    columnName,
    isselected,
    dragStart,
    isDragging,
    isDraggingOver,
    destination,
    handleOnDragEnd,
    ssnExist,
    rkPlanNumberExist,
    id,
    characters,
    droppableId = null,
  } = props;

  const [selectedField, setselectedField] = useState(null);
  const [showSlideout, setshowSlideout] = useState(false);

  return (
    <div className="mt-3" {...provided.draggableProps} ref={innerRef}>
      <div className="mb-2" style={{ display: "flex" }}>
        <div
          className="m-0 mr-2"
          style={{ fontSize: "12px", fontWeight: "500" }}
        >
          {columnName ? columnName : "Column Name"}
        </div>
        {columnName == "SSN" || columnName == "RK PLAN NUMBER" ? (
          <div
            style={{
              fontSize: "10px",
              fontWeight: "400",
              display: "flex",
              alignSelf: "flex-end",
            }}
          >
            <div style={{ color: "red", fontSize: "14px", marginRight: "5px" }}>
              *
            </div>
          </div>
        ) : (
          <></>
        )}
        {(columnName == "SSN" || columnName == "RK PLAN NUMBER") &&
        !(ssnExist && rkPlanNumberExist) ? (
          <div
            style={{
              fontSize: "12px",
              fontWeight: "400",
              display: "flex",
              alignSelf: "flex-end",
              color: "red",
            }}
          >
            This field is Required
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {destination && (destination == id || destination.split(",")[0] == id) ? (
        <div className="layout-drop rounded p-2"></div>
      ) : (
        <div
          style={{
            width: "16.25rem",
            height: "2.875rem",
            borderStyle: "dotted",
            borderWidth: "thin",
            display: "inline-flex",
            alignItems: "center",
            color: "gray",
            backgroundColor: "#FFFFFF",
          }}
          className={`rounded p-2 ${
            (columnName == "SSN" || columnName == "RK PLAN NUMBER") &&
            !(ssnExist && rkPlanNumberExist)
              ? "border border-danger"
              : " "
          }`}
        >
          <div className="drop-icons">
            <FontAwesomeIcon icon={faEllipsisVAlt} size="1x" color="#BDBDBD" />
            <FontAwesomeIcon icon={faEllipsisVAlt} size="1x" color="#BDBDBD" />
          </div>
          <p style={{ fontSize: "10px" }} className="m-0">
            Drop here or
            <div
              onClick={() => {
                setshowSlideout(true);
              }}
              style={{ textDecoration: "none", cursor: "pointer" }}
              to="/home"
            >
              <span style={{ color: "#2F80ED" }}>
                {" "}
                {" " + "Click to select"}
              </span>
            </div>
          </p>
        </div>
      )}
      {showSlideout && (
        <ClickToSelectSlideout
          setselectFields={setshowSlideout}
          fields={characters}
          setfields={setselectedField}
          selectFields={showSlideout}
          selectedField={selectedField}
          columnName={columnName}
          handleOnDragEnd={handleOnDragEnd}
          id={id}
          droppableId={droppableId}
        />
      )}
    </div>
  );
};
