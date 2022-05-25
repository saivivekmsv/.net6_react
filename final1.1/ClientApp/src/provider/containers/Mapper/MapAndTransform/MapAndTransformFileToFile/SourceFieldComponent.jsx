import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { faEllipsisV } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataType } from "../../../../utils";
import EditSourceField from "./EditSourceField";

const SourceFieldComponent = (props) => {
  const {
    item,
    fields,
    setfields,
    index,
    selectedFields = [],
    setselectedFields,
  } = props;
  const [isOpen, setisOpen] = useState(false);
  return (
    <Card
      className="cardCss"
      style={{
        background: "#F7F7F7",
        display: "flex",
        width: "400px",
        cursor: "auto",
      }}
    >
      <input
        className="mt-4 ml-1"
        type="checkbox"
        style={{
          width: "1.5rem",
        }}
        value=""
        onChange={() => {
          let newfields = [...fields];

          if (newfields[index]["selected"] == true) {
            const ind1 = selectedFields.findIndex(
              (element) => element.id == item.id
            );
            const tempselectedFields = [...selectedFields];
            tempselectedFields.splice(ind1, 1);
            setselectedFields(tempselectedFields);
          } else if (newfields[index]["selected"] == false) {
            const tempselectedFields = [...selectedFields];
            tempselectedFields.push(item);
            setselectedFields(tempselectedFields);
          }
          newfields[index]["selected"] = !newfields[index]["selected"];
          setfields(newfields);
        }}
        checked={item.selected}
      ></input>
      <div>
        <div className="fieldTitle ml-2">
          <span className="fieldText">{item.field.replace("/", "")}</span>
        </div>
        {/* <div className="columnTitle">
        <span className="columnText">{item.order}</span>
      </div> */}
        <div className="sampleData ml-2">
          <span className="sampleDataText">
            Value : <span className="sampleValueText">{item.value}</span>
          </span>
        </div>
        <div className="dataType">
          <span className="dataTypeText mb-3">{DataType[item.dataType]}</span>{" "}
          <i
            onClick={() => {
              setisOpen(true);
            }}
            style={{ color: "#307BF6", cursor: "pointer" }}
            className="far fa-edit ml-2 mb-3"
          ></i>
        </div>
      </div>
      <EditSourceField
        fieldHeader={item.field.replace("/", "")}
        dataType={item.dataType}
        isOpen={isOpen}
        setisOpen={setisOpen}
        fields={fields}
        setfields={setfields}
        index={index}
      />
    </Card>
  );
};

export default SourceFieldComponent;
