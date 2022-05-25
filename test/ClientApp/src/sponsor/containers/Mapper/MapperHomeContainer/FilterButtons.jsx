import React, { useState } from "react";
import { Link } from "react-router-dom";

const FilterComponent = (props) => {
  const values = ["All", "Generic", "Plan Specific"];
  return (
    <div>
      <form name="myform" className="form">
        <div className="optionsDiv" style={{ width: "306px" }}>
          <input
            type="radio"
            id={values[0]}
            className="optionBtn"
            name={"radioButton"}
            value={values[0]}
            checked={props.filterValue == values[0]}
            onChange={(e) => props.setfilterValue(values[0])}
          />
          <label className={"optionLabel"} for={"All"}>
            All
          </label>

          <input
            type="radio"
            id={values[1]}
            className="optionBtn"
            name={"radioButton"}
            value={values[1]}
            checked={props.filterValue == values[1]}
            onChange={(e) => props.setfilterValue(values[1])}
          />
          <label className={"optionLabel"} for={values[1]}>
            Generic
          </label>

          <input
            type="radio"
            id={values[2]}
            className="optionBtn"
            name={"radioButton"}
            value={values[2]}
            checked={props.filterValue == values[2]}
            onChange={(e) => props.setfilterValue(values[2])}
          />
          <label
            className={"optionLabel"}
            for={values[2]}
            style={{ marginRight: "5px" }}
          >
            Plan Specific
          </label>
        </div>{" "}
      </form>
    </div>
  );
};

export default FilterComponent;
