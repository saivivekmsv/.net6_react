import React from "react";
import { Card } from "react-bootstrap";
import { faEllipsisV } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataType } from "../../../../utils";

export const CTTargetComponent = (props) => {
  const { item } = props;
  console.log("items", item);
  return (
    <Card className="cardCss" style={{ background: "#F7F7F7" }}>
      <div className="ellipsis">
        <FontAwesomeIcon icon={faEllipsisV} size="2x" color="#828282" />
        <FontAwesomeIcon icon={faEllipsisV} size="2x" color="#828282" />
      </div>
      <div className="fieldTitle">
        <span className="fieldText">{item.object.field.replace("/", "")}</span>
      </div>
      <div className="columnTitle">
        <span className="columnText">{item.object.order}</span>
      </div>
      <div className="sampleData">
        <span className="sampleDataText">
          Value : <span className="sampleValueText">{item.object.value}</span>
        </span>
      </div>
      <div className="dataType">
        <span className="dataTypeText">{DataType[item.object.dataType]}</span>
      </div>
    </Card>
  );
};
