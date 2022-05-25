import { faSpiderBlackWidow } from "@fortawesome/pro-light-svg-icons";
import "./CategorySelectionContainer.css";
import React, { Component, useState } from "react";
import sourceData from "./sourceData";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-light-svg-icons";
import { CustomAggregateFunction } from "./CustomAggregateFunction";

const CategorySelectionContainer = (props) => {
  const [show, setshow] = useState(false);
  const [CAFSlider, setCAFSlider] = useState(false);
  const [selectedItem, setselectedItem]= useState(null)
  
  const [Fields, setFields]= useState(sourceData.map(item=>{
    if(item.dataType=='String'){
      return {...item, "options":[["First", "Last"]], "selectedOption":0}
    }
    else if(item.dataType=='Number'){
      return {...item, "options":[["First", "Last", "Custom"], ["Min", "Max", "Avg", "Sum"]],"selectedOption":0, "selectedCustomOption":null}
    }                      //selectOption - is for selecting the Operation and selectCustomOption is for selecting custom Operation.
    else if (item.dataType=='Date'){
      return {...item, "options":[["First", "Last", "Custom"], ["Min", "Max"]], "selectedOption":0}
    }
    else{
      return item;
    }
  }));

  const handleChangeDisappear = (e) => {
    setshow(false);
  };

  const handleChange = (e) => {
    setshow(true);
  };

  const clickCustomField = (indexItem) => {
    setCAFSlider(!CAFSlider);
    setselectedItem(indexItem);
  };

  const cardDisplay = (item, indexItem) => {
    return (
      <Card className="category-selection-cardSolo">
        <div className="category-selection-titleField">{item.label}</div>
        <div onClick={()=>{clickCustomField(indexItem)}} className="category-selection-icon">
          <FontAwesomeIcon icon={faCog} />
        </div>
        <div className="category-selection-cardType" style={{overflow:'visible'}}>{item.dataType}</div>
        <div className="category-selection-exampleData">
          {item.length}
          {/* The variable to be substituted with the example data obtained from backend */}
        </div>
        <div className="category-selection-category">
          {item["options"]? item["options"][0][item['selectedOption']]: 'not found'}
          {/* Aggregate Category to be displayed over here */}
        </div>
      </Card>
    );
  };

  const slideinDisplay= (selectedItem) =>{
    return (
      CAFSlider && (
        <CustomAggregateFunction
          CAFSlider={CAFSlider}
          onCancel={()=>setCAFSlider(false)}
          Fields={Fields}
          setFields={setFields}
          setCAFSlider={setCAFSlider}
          selectedItem={selectedItem}
        />
      )
    );
  };

  return (
    <>
    <div className="category-selection-container">
      <div className="category-selection-title">Pick your de duplication strategy</div>
      <div className="category-selection-listOfCategory form-check">
        <div>
          <input
            className="form-check-input category-selection-selectFirstRecord"
            type="radio"
            name="flexRadioDefault"
            id="category-selection-selectFirstRecord"
            onChange={handleChangeDisappear}
          />
          <label for="category-selection-selectFirstRecord">Select first record</label>
        </div>
        <div>
          <input
            className="form-check-input category-selection-selectLastRecord"
            type="radio"
            name="flexRadioDefault"
            id="category-selection-selectLastRecord"
            onChange={handleChangeDisappear}
          />
          <label for="category-selection-selectLastRecord">Select last record</label>
        </div>
        <div>
          <input
            className="form-check-input selectCustomStrategy"
            type="radio"
            name="flexRadioDefault"
            id="selectCustomStrategy"
            onChange={handleChange}
          />
          <label for="selectCustomStrategy">Select custom strategy</label>
        </div>
      </div>
      <div>
        {show ? (
          <div className="category-selection-cardContainer">{Fields.map(cardDisplay)}</div>
        ) : null}
      </div>
    </div>
    {(selectedItem!=null)?slideinDisplay(selectedItem):<></>}
    </>
  );
};

export default CategorySelectionContainer;
