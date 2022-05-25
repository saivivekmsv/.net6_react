import React, { useState } from "react";
import { Link } from "react-router-dom";

const FilterComponent = ({ filterValue = 0 }) => {
  const values = ["All", "Direct Fields", "Collection Fields"];
  return (
    <div>
      <form name="myform" className="form">
        <div className="optionsDiv" style={{ width: "350px" }}>
          {values.map((filterName, index) => (
            <>
              <input
                type="radio"
                id={index}
                className="optionBtn"
                name={"radioButton"}
                value={index}
                checked={filterValue == index}
                onChange={(e) => {
                  // props.setFieldValue("filterValue", index);
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
