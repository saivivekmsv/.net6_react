import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { DataType } from "../../../utils";

const SourceFieldComponent = (props) => {
  const { item, selectedFields = [], setselectedFields } = props;
  const isChecked = selectedFields.includes(item);
  useEffect(() => {
    console.log("selectedFields", selectedFields);
  });
  return (
    <Card className="cardCss2" style={{ display: "flex", width: "400px" }}>
      <input
        className="mt-4 ml-1"
        type="checkbox"
        style={{
          width: "1.5rem",
        }}
        value=""
        onChange={() => {
          if (isChecked) {
            const ind1 = selectedFields.findIndex(
              (element) => element.id == item.id
            );
            const tempselectedFields = [...selectedFields];
            tempselectedFields.splice(ind1, 1);
            setselectedFields(tempselectedFields);
          } else {
            const tempselectedFields = [...selectedFields];
            tempselectedFields.push(item);
            setselectedFields(tempselectedFields);
          }
        }}
        checked={isChecked}
      ></input>
      <div>
        <div className="fieldTitle ml-2">
          <span className="fieldText">{item.fieldName.replace("/", "")}</span>
        </div>
        {/* <div className="columnTitle">
        <span className="columnText">{item.order}</span>
      </div> */}
        <div className="sampleData ml-2">
          <span className="sampleDataText">
            Value : <span className="sampleValueText">{item.datum}</span>
          </span>
        </div>
        <div className="dataType">
          <span className="dataTypeText mb-3">{DataType[item.type]}</span>{" "}
        </div>
      </div>
    </Card>
  );
};

export default SourceFieldComponent;
