import React, { useState } from "react";
import { Link } from "react-router-dom";

const FilterComponent = (props) => {
  const values = ["All", "Mapped", "UnMapped"];
  const [Filter, setFilter] = useState("All");
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
            checked={Filter == values[0]}
            onChange={(e) => setFilter(values[0])}
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
            checked={Filter == values[1]}
            onChange={(e) => setFilter(values[1])}
          />
          <label className={"optionLabel"} for={"Mapped"}>
            Mapped
          </label>

          <input
            type="radio"
            id={values[2]}
            className="optionBtn"
            name={"radioButton"}
            value={values[2]}
            checked={Filter == values[2]}
            onChange={(e) => setFilter(values[2])}
          />
          <label
            className={"optionLabel"}
            for={"UnMapped"}
            style={{ marginRight: "5px" }}
          >
            Un Mapped
          </label>
        </div>{" "}
      </form>
    </div>
  );
};

export default FilterComponent;
