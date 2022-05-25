import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import { SliderPanel } from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-solid-svg-icons";
import { DataType } from "../../../../utils";
// import { ConfigureTransformations } from "./ConfigureTransformations";
const TargetDroppedContainer = (props) => {
  const {
    item,
    setFieldOperations,
    setConfigure,
    configurations = [],
    mappedObject,
    setItem,
  } = props;
  // const [addFieldSlider, setConfigure] = useState(false);
  // console.log(item, "items");
  // const onCancel = () => {
  //   setConfigure(false);
  // };
  console.log("configurations", configurations);
  return (
    <>
      <div className="dropped-container">
        <div className="mb-2" style={{ display: "flex" }}>
          <p
            className="m-0 mr-2"
            style={{
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            {mappedObject.field}
          </p>
          {/* {get(item, "isRequired", false) && (
            <div
              style={{
                fontSize: "10px",
                fontWeight: "400",
                display: "flex",
                alignSelf: "flex-end",
              }}
            >
              (Required)
            </div> */}
        </div>
        {isEmpty(configurations) ? (
          <div className="configure-icon ml-auto mr-1">
            <FontAwesomeIcon
              icon={faCog}
              color="#BDBDBD"
              onClick={() => {
                // setConfigure(true);
                // setItem({ object: item, objectMap: mappedObject });
                // setItem(mappedObject)
                setConfigure(true);
                setItem({ object: mappedObject, objectMap: mappedObject });
              }}
            />
          </div>
        ) : (
          <>
            <div className="configure-icon ml-auto mr-1">
              <FontAwesomeIcon
                icon={faCog}
                color="#4F4F4F"
                onClick={() => {
                  // setConfigure(true);
                  // setItem({ object: item, objectMap: mappedObject });
                  setConfigure(true);
                  setItem({ object: mappedObject, objectMap: mappedObject });
                }}
              />
            </div>
            <div>CT</div>
          </>
        )}
      </div>
      {!isEmpty(mappedObject) && (
        <Card className="cardCss" style={{ background: "#F7F7F7" }}>
          <div className="d-flex">
            <i
              style={{
                alignSelf: "center",
                marginTop: "1.5rem",
              }}
              className="fas fa-bars ml-2 mr-2"
            ></i>
            <div>
              <div className="fieldTitle">
                <span style={{ marginLeft: "5px" }} className="fieldText">
                  {mappedObject.field.replace("/", "")}
                </span>
              </div>
              <div className="columnTitle">
                <span className="columnText">{mappedObject.order}</span>
              </div>
              <div className="sampleData">
                <span style={{ marginLeft: "5px" }} className="sampleDataText">
                  Value :{" "}
                  <span className="sampleValueText">{mappedObject.value}</span>
                </span>
              </div>
              <div className="dataType">
                <span className="dataTypeText">
                  {DataType[mappedObject.dataType]}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
export default TargetDroppedContainer;
