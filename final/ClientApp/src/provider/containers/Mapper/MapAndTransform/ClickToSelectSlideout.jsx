import React, { useEffect, useState } from "react";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";

const ClickToSelectSlideout = ({
  fields,
  setfields,
  setselectFields,
  selectFields,
  selectedField,
  columnName,
  handleOnDragEnd,
  id,
  droppableId,
}) => {
  const [searchBar, setsearchBar] = useState("");
  const [cross, showcross] = useState(false);

  return (
    <div style={{ zIndex: "1" }} className="p-3 click-to-select-slideout">
      <div
        className="d-flex  align-items-center border-bottom"
        style={{
          paddingBottom: "20px",
          paddingTop: "20px",
          marginBottom: "20px",
        }}
      >
        <p className="font-weight-bold p-0 m-0" style={{ fontSize: "16px" }}>
          Select Source field to map
        </p>
        <button
          style={{ backgroundColor: "inherit" }}
          className="border-0 ml-auto"
          onClick={() => {
            setselectFields(false);
          }}
          type="button"
        >
          <FontAwesomeIcon icon={faTimes} size={"sm" || "2x"} />
        </button>
      </div>
      <div className="mt-3 mb-1" style={{ fontSize: "12px", color: "grey" }}>
        Target
      </div>
      <div className="font-weight-bold mb-3" style={{ fontSize: "16px" }}>
        {columnName}
      </div>
      <div style={{ fontSize: "12px" }}>
        <p className="pb-1 m-0" style={{ color: "grey" }}>
          Select Source Field
        </p>
        <Form>
          <InputGroup className="d-flex w-100 border-1 rounded">
            <Form.Control
              // {...rest}
              size="sm"
              id="source-search-box"
              className="border-0"
              placeholder="Search source fields here"
              onChange={(event) => {
                setsearchBar(event.target.value);
                event.target.value == "" ? showcross(false) : showcross(true);
              }}
              // onKeyPress={onKeyPress}
              //   onFocus={onMouseOut}
              type="text"
              value={searchBar}
            />

            {cross ? (
              <button
                style={{ backgroundColor: "inherit" }}
                className="border-0"
                onClick={() => {
                  setsearchBar("");
                  showcross(false);
                }}
                type="button"
              >
                <FontAwesomeIcon icon={faTimes} size={"sm" || "2x"} />
              </button>
            ) : (
              <></>
            )}
          </InputGroup>
          <div
            className="p-1 optionsDivSlideout"
            style={{
              overflow: "scroll",
              height: "34.375rem",
              width: "21.875rem",
            }}
          >
            {fields.map((element, index) => {
              const show_element = (item) => {
                if (searchBar == "") {
                  return true;
                } else if (
                  item.fieldName
                    ? item.fieldName
                        .replace("/", "")
                        .toLowerCase()
                        .includes(searchBar.toLowerCase())
                    : false
                ) {
                  return true;
                }
              };
              if (show_element(element)) {
                return (
                  <div className="d-flex border-bottom ">
                    <input
                      className="mr-3 optionBtnSlideout"
                      id={"SelectFields" + index}
                      style={{ alignSelf: "center" }}
                      type="radio"
                      value={index}
                      onChange={() => {
                        setfields(element.fieldName);
                        setselectFields(false);
                        handleOnDragEnd({
                          draggableId: element.fieldName,
                          mode: "FLUID",
                          reason: "DROP",
                          type: "DEFAULT",
                          destination: {
                            droppableId: droppableId ? droppableId : id,
                            index: index,
                          },
                          source: {
                            index: index,
                            droppableId: "source container",
                          },
                        });
                        // let newfields = [...fields];
                        // newfields[index]["selected"] = !newfields[index][
                        //   "selected"
                        // ];
                        // setfields(newfields);
                      }}
                      checked={selectedField == index}
                    />
                    <label
                      for={"SelectFields" + index}
                      className="font-weight-bold p-2 w-100 m-0 optionLabelSlideout"
                    >
                      {element.fieldName.replace("/", "")}
                    </label>
                  </div>
                );
              }
            })}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ClickToSelectSlideout;
