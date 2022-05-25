import React, { useEffect, useState } from "react";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";

const SelectFields = ({
  fields = [],
  values,
  setValues,
  setselectFields,
  selectFields,
  setFieldValue,
}) => {
  const [searchBar, setsearchBar] = useState("");
  const [cross, showcross] = useState(false);
  return (
    <div style={{ zIndex: "1" }}>
      <div
        className="d-flex  align-items-center border-bottom"
        style={{
          paddingBottom: "20px",
          paddingTop: "20px",
          marginBottom: "20px",
        }}
      >
        <p className="font-weight-bold p-0 m-0" style={{ fontSize: "16px" }}>
          Select fields
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
      <div style={{ fontSize: "12px" }}>
        <p className="pb-1 m-0">Select Field</p>
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
        </Form>
        <div
          className="p-1"
          style={{
            overflow: "scroll",
            height: "34.375rem",
            width: "21.875rem",
          }}
        >
          {fields &&
            fields.map((element, index) => {
              const indexOfElement = values.aggregationEntites
                .map((el) => el.fieldName)
                .indexOf(element.fieldName);
              const isSelected = indexOfElement != -1 ? true : false;
              const show_element = (item) => {
                if (searchBar == "") {
                  return true;
                } else if (
                  item.fieldName
                    ? item.fieldName
                        .toLowerCase()
                        .includes(searchBar.toLowerCase())
                    : false
                ) {
                  return true;
                }
              };
              if (show_element(element)) {
                return (
                  <div className="d-flex">
                    <input
                      className="mr-3"
                      style={{ alignSelf: "center" }}
                      type="checkbox"
                      value=""
                      onChange={() => {
                        // let newfields = [...fields];
                        // newfields[index]["selected"] = !newfields[index][
                        //   "selected"
                        // ];
                        // setfields(newfields);
                        if (isSelected) {
                          let temp = [...values.aggregationEntites];
                          temp.splice(indexOfElement, 1);
                          setFieldValue("aggregationEntites", temp);
                        } else {
                          let temp = [...values.aggregationEntites];
                          temp.push(element);
                          setFieldValue("aggregationEntites", temp);
                        }
                      }}
                      checked={isSelected}
                    ></input>
                    <p className=" p-2 w-100 m-0 border-bottom">
                      {element.fieldName.substring(1)}
                    </p>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default SelectFields;
