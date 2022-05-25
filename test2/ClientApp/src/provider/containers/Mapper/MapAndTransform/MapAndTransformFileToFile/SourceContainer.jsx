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
    //    e.preventDefault();
    setShowClear(true);
    // handleChange(e);
    setSearchTerm(e.target.value);
  };
  const closeButtonWrapperClass = showClear ? "active" : "";

  return (
    <div className="FilterSourceContainer" style={{ width: "23rem" }}>
      <div
        className="FilterSourceSearchButtonContainer"
        style={{ width: "100%" }}
      >
        <div className="FilterSourceTextContainer">
          <p className="FilterSourceText">Source</p>
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
        <div className="FilterFileNameText" id="MappingFileName">
          FP-Payroll.xls
        </div>
        <div className="d-flex mb-2 mt-2">
          <input
            className="mt-1"
            type="checkbox"
            style={{
              width: "1.5rem",
            }}
            value=""
            onChange={() => {
              let newfields = [...fields];
              for (let i in fields) {
                newfields[i]["selected"] = !selectAll;
              }
              setfields(newfields);
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
          <div
            className="MapperNumberOfFieldsText mt-0 ml-auto"
            style={{ width: "auto" }}
          >
            {fields.filter((item) => item.selected).length}/{numberOfFields}{" "}
            Fields
          </div>
        </div>

        {/* <div className="FilterNumberOfFieldsText" id="NumberOfFields">
          {numberOfFields} Fields available in source file
        </div> */}
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
                  className="Filtersource-search-box"
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
                  item.field
                    ? item.field
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : false
                ) {
                  return true;
                }
              };
              if (show_element(element)) {
                return (
                  <SourceFieldComponent
                    fields={fields}
                    setfields={setfields}
                    index={index}
                    item={element}
                    selectedFields={selectedFields}
                    setselectedFields={setselectedFields}
                  />
                  // <Card
                  //   style={{
                  //     display: "flex",
                  //     // border: "2px solid green",
                  //     background: "#F7F7F7",
                  //     width: "98%",
                  //     height: "3.5rem",
                  //     marginBottom: "0.5rem",
                  //     borderRadius: "5px",
                  //     justifyContent: "center",
                  //   }}
                  // >
                  //   <div style={{ display: "flex" }}>
                  //     <input
                  //       type="checkbox"
                  //       style={{
                  //         display: "flex",
                  //         alignSelf: "center",
                  //         width: "1.5rem",
                  //       }}
                  //       value=""
                  //       onChange={() => {
                  //         let newfields = [...fields];
                  //         newfields[index]["selected"] = !newfields[index][
                  //           "selected"
                  //         ];
                  //         setfields(newfields);
                  //       }}
                  //       checked={element.selected}
                  //     ></input>
                  //     <div>
                  //       <div style={{ display: "flex" }}>
                  //         <div
                  //           className=" Flabel"
                  //           style={{
                  //             top: "15%",
                  //             paddingLeft: "0.25rem",
                  //             position: "absolute",
                  //           }}
                  //         >
                  //           {element.field}
                  //         </div>
                  //         <div
                  //           className="Ftype"
                  //           style={{
                  //             position: "absolute",
                  //             top: "15%",
                  //             right: "0.25rem",
                  //             paddingRight: "0.25rem",
                  //           }}
                  //         >
                  //           {element.dataType}
                  //         </div>
                  //       </div>
                  //       <div
                  //         className="Ftype"
                  //         style={{
                  //           position: "absolute",
                  //           paddingLeft: "0.25rem",
                  //           bottom: "15%",
                  //         }}
                  //       >
                  //         {element.value}
                  //       </div>
                  //     </div>
                  //   </div>
                  // </Card>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default SourceContainer;
