import { faSpiderBlackWidow } from "@fortawesome/pro-light-svg-icons";
import "./CategorySelectionContainer.css";
import React, { Component, useState, useEffect, useContext } from "react";
import sourceData from "./sourceData";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-light-svg-icons";
import { CustomAggregateFunction } from "./CustomAggregateFunction";
import { manageMapperStore } from "../../../contexts";
import { isEmpty, get, isNull } from "lodash";

const CategorySelectionContainer = ({
  fields,
  values,
  setValues,
  setFieldValue,
}) => {
  // Getting the data from DB using the API
  const { state, dispatch } = useContext(manageMapperStore);
  // const [customFields, setCustomFields] = useState([]);
  const customFields = values.aggregationOperationEntities;
  const aggregationStrategy = values.aggregationStrategy;
  console.log("customFields", customFields);

  const fieldHeadersJson = get(state, "api.data.headerMapJson");
  // Populates the aggregationOperationEntities with the use of fields
  useEffect(() => {
    if (customFields.length == 0) {
      let temp = [];
      for (let i in fields) {
        let element = fields[i];
        const { path, ...filteredElement } = element;
        temp.push({ ...filteredElement, operation: "First" });
      }
      setFieldValue("aggregationOperationEntities", temp);
    }
  }, [fields]);
  //

  const [show, setshow] = useState(values.aggregationStrategy == "3");
  const [CAFSlider, setCAFSlider] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);

  const handleChangeDisappear = (e) => {
    setFieldValue("aggregationStrategy", e);
    e == "3" ? setshow(true) : setshow(false);
  };

  const clickCustomField = (indexItem) => {
    setCAFSlider(!CAFSlider);
    setselectedItem(indexItem);
  };

  const cardDisplay = (item, indexItem) => {
    return (
      <Card className="category-selection-cardSolo">
        <div className="category-selection-titleField">
          {item.fieldName.substring(1)}
        </div>
        <div
          onClick={() => {
            clickCustomField(indexItem);
          }}
          className="category-selection-icon"
        >
          <FontAwesomeIcon icon={faCog} />
        </div>
        <div
          className="category-selection-cardType"
          style={{ overflow: "visible" }}
        >
          {item.type}
        </div>
        <div className="category-selection-exampleData">
          {item.datum}
          {/* The variable to be substituted with the example data obtained from backend */}
        </div>
        <div className="category-selection-category">
          {item.operation.trim() != "" ? item.operation : "not found"}
          {/* Aggregate Category to be displayed over here */}
        </div>
      </Card>
    );
  };

  const slideinDisplay = (selectedItem) => {
    return (
      CAFSlider && (
        <CustomAggregateFunction
          CAFSlider={CAFSlider}
          onCancel={() => setCAFSlider(false)}
          Fields={customFields}
          // setFields={setCustomFields}
          setCAFSlider={setCAFSlider}
          selectedItem={selectedItem}
          setFieldValue={setFieldValue}
        />
      )
    );
  };

  return (
    <>
      <div className="category-selection-container">
        <div className="category-selection-title">
          Pick your de duplication strategy
        </div>
        <div className="category-selection-listOfCategory form-check">
          <div>
            <input
              className="form-check-input category-selection-selectFirstRecord"
              type="radio"
              name="flexRadioDefault"
              id="category-selection-selectFirstRecord"
              value="1"
              checked={values.aggregationStrategy == "1"}
              onChange={() => {
                handleChangeDisappear("1");
              }}
            />
            <label for="category-selection-selectFirstRecord">
              Select first record
            </label>
          </div>
          <div>
            <input
              className="form-check-input category-selection-selectLastRecord"
              type="radio"
              name="flexRadioDefault"
              id="category-selection-selectLastRecord"
              value="2"
              checked={values.aggregationStrategy == "2"}
              onChange={() => {
                handleChangeDisappear("2");
              }}
            />
            <label for="category-selection-selectLastRecord">
              Select last record
            </label>
          </div>
          <div>
            <input
              className="form-check-input selectCustomStrategy"
              type="radio"
              name="flexRadioDefault"
              id="selectCustomStrategy"
              value="3"
              checked={values.aggregationStrategy == "3"}
              onChange={() => {
                handleChangeDisappear("3");
              }}
            />
            <label for="selectCustomStrategy">Select custom strategy</label>
          </div>
        </div>
        <div>
          {show ? (
            <div className="category-selection-cardContainer">
              {customFields.length == 0 && "There are no fields to show"}
              {customFields.map(cardDisplay)}
            </div>
          ) : null}
          <div>{/* <pre>{JSON.stringify(customFields,null,2)} </pre> */}</div>
        </div>
      </div>
      {selectedItem != null ? slideinDisplay(selectedItem) : <></>}
    </>
  );
};

export default CategorySelectionContainer;
