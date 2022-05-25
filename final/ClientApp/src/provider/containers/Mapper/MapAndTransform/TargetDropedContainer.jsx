import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import { SliderPanel } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-solid-svg-icons";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import { DataType } from "../../../utils";
import { ConfigureTransformations } from "./ConfigureTransformations";
export const TargetDroppedContainer = (props) => {
  const {
    item,
    setFieldOperations,
    setConfigure,
    setItem,
    configurations,
    mappedObject,
    initialData,
    setTargetField,
    deleteCT,
    configuredTransformations,
    collectionId,
    path,
  } = props;

  // const [addFieldSlider, setConfigure] = useState(false);
  // const onCancel = () => {
  //   setConfigure(false);
  // };
  const deleteDropped = () => {
    const data = initialData.map((e) => {
      if (collectionId == e.tId) {
        const childObjectMapsTemp = e.childObjectMaps.map((eve) => {
          if (eve.tId == item.tId) {
            return {
              ...eve,
              fieldOperations: [],
              path: null,
              constantValue: "",
              dataSource: 1,
            };
          }
          return eve;
        });
        return {
          ...e,
          childObjectMaps: childObjectMapsTemp,
        };
      } else if (e.tId == item.tId) {
        return {
          ...e,
          fieldOperations: [],
          path: null,
          constantValue: "",
          dataSource: 1,
        };
      }
      return e;
    });
    setTargetField(data);
  };

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
            {item.displayName}
          </p>
          {get(item, "isRequired", false) && (
            <div
              style={{
                fontSize: "10px",
                fontWeight: "400",
                display: "flex",
                alignSelf: "flex-end",
              }}
            >
              (Required)
            </div>
          )}
        </div>
        {isEmpty(item.fieldOperations) ? (
          <div className="configure-icon ml-auto mr-1">
            <FontAwesomeIcon
              icon={faCog}
              color="#BDBDBD"
              onClick={() => {
                setConfigure(true);
                setItem(
                  !isEmpty(collectionId)
                    ? {
                        object: item,
                        objectMap: mappedObject,
                        tId: collectionId,
                      }
                    : { object: item, objectMap: mappedObject }
                );
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
                  setConfigure(true);
                  setItem(
                    !isEmpty(collectionId)
                      ? {
                          object: item,
                          objectMap: mappedObject,
                          tId: collectionId,
                        }
                      : { object: item, objectMap: mappedObject }
                  );
                }}
              />
            </div>
            <div>CT</div>
          </>
        )}
      </div>
      {!isEmpty(mappedObject) && (
        <div className="dropped-card">
          <Card
            className={`cardCss ${
              // item.dataSource === 2 ||
              // item.dataSource === 3 ||
              // item.dataSource === 6
              //   ? mappedObject.type != 2:
              item.dataType != (item.transformedType || mappedObject.type)
                ? "border border-danger"
                : ""
            }`}
            style={{ background: "#F7F7F7" }}
          >
            <div className="fieldTitle">
              <span className="fieldText">
                {mappedObject.fieldName.replace("/", "")}
              </span>
            </div>
            <div className="columnTitle">
              <span className="columnText">{mappedObject.order}</span>
            </div>
            <div className="sampleData">
              <span className="sampleDataText">
                Value :{" "}
                <span className="sampleValueText">{mappedObject.datum}</span>
              </span>
            </div>
            <div className="dataType">
              <span className="dataTypeText">
                {DataType[mappedObject.type]}
              </span>
            </div>
          </Card>

          <div className="delete-dropped-icon">
            <FontAwesomeIcon
              icon={faTrash}
              size="25px"
              color="#EB5757"
              onClick={() => deleteDropped()}
            />
          </div>
        </div>
      )}
    </>
  );
};
