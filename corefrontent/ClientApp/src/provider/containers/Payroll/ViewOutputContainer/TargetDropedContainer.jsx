import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { DataType } from "../../../utils";
// import { ConfigureTransformations } from "./ConfigureTransformations";
const TargetDroppedContainer = ({ selectedItem }) => {
  return (
    <>
      <Card className="cardCss" style={{ border: "none" }}>
        <div className="d-flex">
          <i
            style={{ alignSelf: "center", marginTop: "1.5rem" }}
            className="fas fa-bars ml-2 mr-2"
          ></i>
          <div>
            <div className="fieldTitle">
              <span className="fieldText">{selectedItem.fieldName}</span>
            </div>
            <div className="columnTitle">
              <span className="columnText">{selectedItem.order}</span>
            </div>
            <div className="sampleData">
              <span className="sampleDataText">
                Value :{" "}
                <span className="sampleValueText">{selectedItem.datum}</span>
              </span>
            </div>
            <div className="dataType">
              <span className="dataTypeText">
                {DataType[selectedItem.type]}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
export default TargetDroppedContainer;
