import React, { useState, useRef } from "react";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import FilterComponent from "./FilterButtons";
import { faEllipsisV, faCheckCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sampleData from "./sampleData";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Droppable, Draggable } from "react-beautiful-dnd";

const SourceContainer = (props) => {
  const { characters, column, setDrag, mapped } = props;
  const [searchBar, showSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const numberOfFields = sampleData.length;

  const [showClear, setShowClear] = useState(false);
  const inputElem = useRef(null);
  const onClear = () => {
    inputElem.current.value = "";
    handleChange({
      target: {
        value: "",
      },
    });
    setShowClear(false);
  };
  const buttonClass =
    window.screen === "plan-group-home"
      ? "source-close-button-pg"
      : "source-close-button-wrapper";
  const iconClass =
    window.screen === "plan-group-home"
      ? "source-icon-size"
      : "source-close-button";
  const onMouseMove = () => {
    if (inputElem.current.value) {
      setShowClear(true);
    }
  };

  const onMouseOut = () => {
    setShowClear(false);
  };

  const handleChange = (e) => {
    //    e.preventDefault();
    setShowClear(true);
    // handleChange(e);
    setSearchTerm(e.target.value);
  };
  const closeButtonWrapperClass = showClear ? "active" : "";

  return (
    <div className="SourceContainer">
      <div className="SourceSearchButtonContainer">
        <div className="SourceTextContainer">
          <p className="SourceText">Source</p>
        </div>
        <div className="searchIconContainer">
          <Button
            variant="link"
            className="search-with-api-button"
            onClick={() => showSearchBar(!searchBar)}
          >
            <Image className="searchIcon" src="/assets/icons/svg/search.svg" />
          </Button>
        </div>
      </div>

      <div className="FileNameContainer">
        <div className="FileNameText" id="MappingFileName">
          FP-Payroll.xls
        </div>
        <div className="NumberOfFieldsText" id="NumberOfFields">
          {numberOfFields} Fields available in source file
        </div>
      </div>

      {searchBar && (
        <div className="SearchBarContainer">
          <Form>
            <InputGroup>
              <div className="mapper-source-search-text">
                <Form.Control
                  ref={inputElem}
                  // {...rest}
                  size="sm"
                  id="source-search-box"
                  className="source-search-box"
                  placeholder="Search source fields here"
                  onChange={handleChange}
                  // onKeyPress={onKeyPress}
                  onFocus={onMouseOut}
                  type="text"
                />
                <div
                  className={`${buttonClass} ${closeButtonWrapperClass}`}
                  onMouseMove={onMouseMove}
                >
                  <button className={iconClass} type="button" onClick={onClear}>
                    <FontAwesomeIcon icon={faTimes} size={"sm" || "2x"} />
                  </button>
                </div>
              </div>
            </InputGroup>
          </Form>
        </div>
      )}

      <FilterComponent></FilterComponent>
      <Droppable droppableId={column}>
        {(provided) => (
          <ul
            className="fieldContainer"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {characters
              .filter((item) => {
                if (searchTerm == "") {
                  return item;
                } else if (
                  item.field.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return item;
                }
              })
              // .map((getFieldComponent, index) => {
              .map((item, index) => {
                return (
                  <Draggable
                    key={item.field}
                    draggableId={item.field}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Card
                          className="cardCss"
                          style={{
                            background: snapshot.isDragging
                              ? "#DFECFF"
                              : "#F7F7F7",
                          }}
                        >
                          <div className="ellipsis">
                            <FontAwesomeIcon
                              icon={faEllipsisV}
                              size="2x"
                              color="#828282"
                            />
                            <FontAwesomeIcon
                              icon={faEllipsisV}
                              size="2x"
                              color="#828282"
                            />
                          </div>
                          <div className="fieldTitle">
                            <span className="fieldText">{item.field}</span>

                            {item.field == mapped ? (
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                size="1x"
                                color="#3bb54a"
                              />
                            ) : null}
                          </div>
                          <div className="columnTitle">
                            <span className="columnText">
                              {item.columnName}
                            </span>
                          </div>
                          <div className="sampleData">
                            <span className="sampleDataText">
                              Value :{" "}
                              <span className="sampleValueText">
                                {item.value}
                              </span>
                            </span>
                          </div>
                          <div className="dataType">
                            <span className="dataTypeText">
                              {item.dataType}
                            </span>
                          </div>
                        </Card>
                      </li>
                    )}
                  </Draggable>
                );
              })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

export default SourceContainer;
