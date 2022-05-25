import React, { useState, useRef } from "react";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import SourceFieldComponent from "./SourceFieldComponent";

const SourceContainer = ({
  fields,
  setfields,
  selectedFields,
  setselectedFields,
}) => {
  const numberOfFields = fields.length;
  const [searchBar, showSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setselectAll] = useState(false);
  const inputElem = useRef(null);
  const [showClear, setShowClear] = useState(false);
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
    setShowClear(true);
    setSearchTerm(e.target.value);
  };
  const closeButtonWrapperClass = showClear ? "active" : "";

  return (
    <div
      className="FilterSourceContainer  border border-2 p-2"
      style={{ height: "35rem" }}
    >
      <div
        className="FilterSourceSearchButtonContainer mt-2"
        style={{ width: "100%" }}
      >
        <div className="FilterSourceTextContainer">
          <p className="FilterSourceText">Headers</p>
        </div>
        <div className="FiltersearchIconContainer">
          <Button
            variant="link"
            className="search-with-api-button"
            onClick={() => showSearchBar(!searchBar)}
          >
            <Image
              className="FiltersearchIcon"
              src="/assets/icons/svg/search.svg"
            />
          </Button>
        </div>
      </div>

      <div className="FileNameContainer" style={{ width: "100%" }}>
        <div className="d-flex mt-2">
          <input
            className="mt-1"
            type="checkbox"
            style={{
              width: "1.5rem",
            }}
            value=""
            onChange={() => {
              // let newfields = [...fields];
              // for (let i in fields) {
              //   newfields[i]["selected"] = !selectAll;
              // }
              // setfields(newfields);
              if (!selectAll) {
                let tempselectedFields = [];
                for (let i in fields) {
                  tempselectedFields.push(fields[i]);
                }
                setselectedFields(tempselectedFields);
              } else if (selectAll) {
                setselectedFields([]);
              }
              setselectAll(!selectAll);
            }}
            checked={selectAll}
          />{" "}
          <div
            style={{
              fontSize: "12px",
              marginRight: "50%",
              whiteSpace: "nowrap",
            }}
          >
            {" "}
            Select All{" "}
          </div>
          {/* <div className="FilterNumberOfFieldsText mt-0">
            {fields.filter((item) => item.selected).length}/{numberOfFields}{" "}
            Fields
          </div> */}
        </div>

        <div className="FilterNumberOfFieldsText mb-2" id="NumberOfFields">
          {numberOfFields} Fields available in the file
        </div>
        <hr style={{ margin: "0px" }} />
      </div>
      {searchBar && (
        <div className="FilterSearchBarContainer">
          <Form>
            <InputGroup>
              <div className="Filtermapper-source-search-text">
                <Form.Control
                  ref={inputElem}
                  // {...rest}
                  size="sm"
                  id="source-search-box"
                  className="Map-and-transform-search-box"
                  style={{ width: "90%", alignSelf: "center" }}
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
      <div className="FilterCardRendering">
        <div>
          {fields &&
            fields.map((element, index) => {
              const show_element = (item) => {
                if (searchBar == "") {
                  return true;
                } else if (
                  item.fieldName
                    ? item.fieldName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : false
                ) {
                  return true;
                }
              };
              if (show_element(element)) {
                return (
                  <>
                    <SourceFieldComponent
                      fields={fields}
                      setfields={setfields}
                      index={index}
                      item={element}
                      selectedFields={selectedFields}
                      setselectedFields={setselectedFields}
                    />
                    <hr style={{ margin: "0px" }} />
                  </>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default SourceContainer;
