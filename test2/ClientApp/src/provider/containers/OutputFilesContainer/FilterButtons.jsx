import React, { useState } from "react";
import { Link } from "react-router-dom";

const FilterComponent = (props) => {
  const values = [
    "All",
    "New",
    "Generated",
    "Success",
    "Error",
    "Pass Through",
  ];
  return (
    <div>
      <form name="myform" className="form">
        <div className="optionsDiv" style={{ width: "706px" }}>
          {values.map((filterName, index) => (
            <>
              <input
                type="radio"
                id={index}
                className="optionBtn"
                name={"radioButton"}
                value={index}
                checked={props.filterValue == index}
                onChange={(e) => {
                  props.setFieldValue("filterValue", index);
                }}
              />
              <label className={"optionLabel"} for={index}>
                {filterName}
              </label>
            </>
          ))}
        </div>{" "}
      </form>
    </div>
  );
};

export default FilterComponent;
