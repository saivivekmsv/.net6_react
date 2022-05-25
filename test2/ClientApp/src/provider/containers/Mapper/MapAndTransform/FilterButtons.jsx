import React, { useState } from "react";
import { Link } from "react-router-dom";

const FilterComponent = (props) => {
  const { Filter, setFilter, setList, characters } = props;
  const values = ["All", "Mapped", "UnMapped"];
  const All = () => {
    setFilter(values[0]);
    setList(characters);
  };
  const Mapped = () => {
    setFilter(values[1]);
    setList(characters.filter((e) => e.mapped));
  };
  const UnMapped = () => {
    setFilter(values[2]);
    if (characters != null) {
      setList(characters.filter((e) => !e.mapped));
    }
  };

  return (
    <div>
      <form name="myform" className="form">
        <div className="optionsDiv" style={{ width: "306px", maxWidth: "90%" }}>
          <input
            type="radio"
            id={values[0]}
            className="optionBtn"
            name={"radioButton"}
            value={values[0]}
            checked={Filter == values[0]}
            onChange={All}
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
            onChange={Mapped}
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
            onChange={UnMapped}
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
