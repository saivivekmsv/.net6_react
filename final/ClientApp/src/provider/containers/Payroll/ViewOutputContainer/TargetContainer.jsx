import React, { useState, useRef, useEffect } from "react";
import TargetDropedContainer from "./TargetDropedContainer";
import { isEmpty, get, isNull } from "lodash";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TargetContainer(props) {
  const { selectedFields, setselectedFields } = props;
  // const [searchBar, showSearchBar] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
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

  // const closeButtonWrapperClass = showClear ? "active" : "";
  // const buttonClass =
  //   window.screen === "plan-group-home"
  //     ? "source-close-button-pg"
  //     : "source-close-button-wrapper";

  // const handleChange = (e) => {
  //   setShowClear(true);
  //   setSearchTerm(e.target.value);
  // };

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
  };

  return (
    <div className="FilterConditionContainer" style={{ height: "35rem" }}>
      <div className="d-flex w-100">
        <div className="FilterConditionTitleText">Selected Fields</div>
        <div
          className="FilterNumberOfFieldsText ml-auto"
          style={{ width: "auto" }}
        >
          {selectedFields.length} Fields Selected
        </div>
      </div>
      <div
        className="w-100 border p-3 mt-2"
        style={{ overflow: "scroll", height: "33rem", display: "flex" }}
      >
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
                {fieldList.map((mappedObject, index) => {
                  return (
                    <Draggable
                      key={mappedObject.id.toString()}
                      draggableId={mappedObject.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <TargetDropedContainer selectedItem={mappedObject} />
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
    </div>
  );
}

export default TargetContainer;
