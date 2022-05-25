import React from "react";
import { Card } from "react-bootstrap";
import { faEllipsisV } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SourceFieldComponent = (props) => {
  const { item } = props;
  return (
    <Card className="cardCss" style={{ background: "#F7F7F7" }}>
      <div className="ellipsis">
        <FontAwesomeIcon icon={faEllipsisV} size="2x" color="#828282" />
        <FontAwesomeIcon icon={faEllipsisV} size="2x" color="#828282" />
      </div>
      <div className="fieldTitle">
        <span className="fieldText">{item.field}</span>
      </div>
      <div className="columnTitle">
        <span className="columnText">{item.columnName}</span>
      </div>
      <div className="sampleData">
        <span className="sampleDataText">
          Value : <span className="sampleValueText">{item.value}</span>
        </span>
      </div>
      <div className="dataType">
        <span className="dataTypeText">{item.dataType}</span>
      </div>
    </Card>
  );
};
