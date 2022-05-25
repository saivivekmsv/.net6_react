import React, { useState, useRef, useEffect } from "react";
import FilterButtons from "./FilterButtons";
import TargetDropedContainer from "./TargetDropedContainer";
import { ConfigureTransformations } from "./ConfigureTransformations";
import { Image, Tabs, Tab, InputGroup, Button, Form } from "react-bootstrap";
import AddNewField from "./AddNewField";
import { isEmpty, get, isNull } from "lodash";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TargetContainer(props) {
  const {
    configurations = [],
    setFieldOperations,
    selectedFields,
    setselectedFields,
  } = props;
  console.log("configurations_tc", configurations);
  const [searchBar, showSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [addFieldSlider, setConfigure] = useState(false);
  const [isOpenAddNewField, setisOpenAddNewField] = useState(false);
  const [sliderItem, setItem] = useState(null);
  const inputElem = useRef(null);
  const [dest, setDestination] = useState("");
  const [dragStart, setDrag] = useState(false);
  const [fieldList, setfieldList] = useState([]);

  useEffect(() => {
    setfieldList(
      selectedFields
      // .filter(
      //   (item) =>
      //     item.selected &&
      //     item.field.toLowerCase().includes(searchTerm.toLowerCase())
      // )
    );
  }, [selectedFields]);

  const closeButtonWrapperClass = showClear ? "active" : "";
  const buttonClass =
    window.screen === "plan-group-home"
      ? "source-close-button-pg"
      : "source-close-button-wrapper";

  const handleChange = (e) => {
    setShowClear(true);
    setSearchTerm(e.target.value);
  };

  const onCancel = () => {
    setConfigure(false);
  };

  const onMouseOut = () => {
    setShowClear(false);
  };

  const onMouseMove = () => {
    if (inputElem.current.value) {
      setShowClear(true);
    }
  };

  const handleOnDragStart = () => {
    setDrag(true);
  };
  const handleOnDragUpdate = (update) => {
    const { destination } = update;
    if (!isNull(destination)) {
      setDestination(destination.droppableId);
    }
  };

  const handleOnDragEnd = (result) => {
    setDrag(false);
    const { source, destination } = result;
    console.log("dragged", source, destination);
    const [removed] = fieldList.splice(source.index, 1);
    const resultArray = fieldList.splice(destination.index, 0, removed);
    if (resultArray.length == fieldList.length) {
      setfieldList(resultArray);
    }

    console.log("dragged", fieldList);
  };

  return (
    <div className="FilterConditionContainer">
      <div className="d-flex">
        <div className="FilterConditionTitleText">Target</div>
        <Button
          variant="link"
          onClick={() => {
            showSearchBar(!searchBar);
          }}
          className="search-with-api-button ml-auto"
        >
          <Image className="searchIcon" src="/assets/icons/svg/search.svg" />
        </Button>
      </div>

      {searchBar && (
        <div className="FilterSearchBarContainer w-100">
          <Form>
            <InputGroup>
              <div className="w-100 d-flex border rounded">
                <Form.Control
                  ref={inputElem}
                  // {...rest}
                  size="sm"
                  id="source-search-box"
                  // className="Filtersource-search-box"
                  style={{ border: "none", boxShadow: "none", width: "100%" }}
                  value={searchTerm}
                  placeholder="Search target fields here"
                  onChange={handleChange}
                  // onKeyPress={onKeyPress}
                  onFocus={onMouseOut}
                  type="text"
                />
                <div
                  className={`${buttonClass} ${closeButtonWrapperClass}`}
                  onMouseMove={onMouseMove}
                >
                  {showClear && (
                    <button
                      style={{
                        border: "none",
                        color: "inherit",
                        backgroundColor: "inherit",
                        height: "100%",
                      }}
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setShowClear(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} size={"sm" || "2x"} />
                    </button>
                  )}
                </div>
              </div>
            </InputGroup>
          </Form>
        </div>
      )}

      <FilterButtons />
      <div
        className="w-100 border p-3 mt-2"
        style={{ overflow: "scroll", height: "28rem", display: "flex" }}
      >
        <div>
          <DragDropContext
            onDragStart={handleOnDragStart}
            onDragUpdate={handleOnDragUpdate}
            onDragEnd={handleOnDragEnd}
          >
            <Droppable droppableId={"column"}>
              {(provided) => (
                <div
                  // className="fieldContainer"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {fieldList
                    .filter((item) =>
                      item.field
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((mappedObject, index) => {
                      return (
                        <Draggable
                          key={mappedObject.field}
                          draggableId={mappedObject.field}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <TargetDropedContainer
                                configurations={
                                  !isEmpty(configurations) &&
                                  configurations.length > 1
                                    ? configurations.find(
                                        (f) => f.field == mappedObject.field
                                      )
                                    : !isEmpty(configurations)
                                    ? configurations.field == mappedObject.field
                                      ? configurations
                                      : null
                                    : null
                                }
                                setConfigure={setConfigure}
                                mappedObject={mappedObject}
                                setItem={setItem}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div
          onClick={() => {
            setisOpenAddNewField(true);
          }}
          style={{ cursor: "pointer" }}
          className="d-flex ml-auto"
        >
          <i style={{ color: "#4F4F4F" }} className="fas fa-plus mt-1"></i>{" "}
          <div style={{ color: "#2F80ED" }} className="ml-2">
            Add new field
          </div>
        </div>
      </div>

      <ConfigureTransformations
        itemConfigure={sliderItem}
        configuredValues={
          !isEmpty(configurations) && configurations.length > 1
            ? configurations.find(
                (f) => f.field == get(sliderItem, "object.field", "")
              )
            : !isEmpty(configurations)
            ? configurations.field == get(sliderItem, "object.field", "")
              ? configurations
              : null
            : null
        }
        addFieldSlider={addFieldSlider}
        onCancel={onCancel}
        setFieldSlider={setConfigure}
        setFieldOperations={setFieldOperations}
      />
      <AddNewField
        isOpen={isOpenAddNewField}
        setisOpen={setisOpenAddNewField}
      />
    </div>
  );
}

export default TargetContainer;
