import React, { useState, useEffect, useRef } from "react";

import { isEmpty } from "lodash";
import {
  Image,
  Tabs,
  Tab,
  InputGroup,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/pro-light-svg-icons";
import { faPlus, faCog } from "@fortawesome/pro-solid-svg-icons";
import { UnmappedField } from "./UnmappedField";
import { AddCustomFields } from "./AddCustomFields";

import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ConfigureTransformations } from "./ConfigureTransformations";

const pageIndexes = [
  "Personal Information",
  "Contact Information",
  "Employment & Age details",
  "Employee Classification",
  "Hours and Compensation",
  "Loan",
  "Contribution",
];

const ContactInformation = [
  {
    label: "Address 1",
    length: 150,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Address 2",
    length: 150,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Address 3",
    length: 150,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "City",
    length: 15,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Country",
    length: 15,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "State",
    length: 15,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Zip code",
    length: 15,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Primary PHONE NUMBER",
    length: 15,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Secondary PHONE NUMBER",
    length: 15,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Primary email address",
    length: 50,
    dataType: "string",
    mandatory: false,
  },
];

const EmployementAge = [
  {
    label: "Hire Date",
    length: 50,
    dataType: "date",
    mandatory: true,
  },
  {
    label: "Most Recent Term Date",
    length: 50,
    dataType: "date",
    mandatory: true,
  },
  {
    label: "Most Recent Rehire",
    length: 50,
    dataType: "date",
    mandatory: false,
  },
  {
    label: "Payroll Frequency ",
    length: 50,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "HCE indicator",
    length: 50,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Employment status code",
    length: 15,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Pay Date ",
    length: 15,
    dataType: "date",
    mandatory: true,
  },
  {
    label: "Leave Start date ",
    length: 15,
    dataType: "date",
    mandatory: false,
  },
  {
    label: "Leave End Date ",
    length: 15,
    dataType: "date",
    mandatory: false,
  },
];
const Classification = [
  {
    label: "Classification Name",
    length: 150,
    dataType: "string",
    mandatory: true,
  },
  {
    label: "Start Date ",
    length: 150,
    dataType: "date",
    mandatory: false,
  },
  {
    label: "End Date ",
    length: 150,
    dataType: "date",
    mandatory: false,
  },
];

const HoursAndCompensation = [
  {
    label: "Annual Salary ",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
  {
    label: "Gross Compensation ",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
  {
    label: "Plan Compensation ",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
  {
    label: "Hours",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
  {
    label: "Deferral %",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
  {
    label: "Match %",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
];

const Contribution = [
  {
    label: "RK Plan Number",
    length: 15,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Name",
    length: 50,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Amount",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
];

const Loans = [
  {
    label: "RK Plan Number",
    length: 15,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "LoanID",
    length: 15,
    dataType: "string",
    mandatory: false,
  },
  {
    label: "Loan Repayment ",
    length: 15,
    dataType: "number",
    mandatory: false,
  },
];
const indexMap = [
  ContactInformation,
  EmployementAge,
  Classification,
  HoursAndCompensation,
  Loans,
  Contribution,
];
const TargetContainer = (props) => {
  const { dragStart, PersonnalInformation, destination } = props;
  const [keyValue, setkeyValue] = useState(1);
  const [addFieldSlider, setFieldSlider] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [addConfigureSlider, setConfigureSlider] = useState(false);
  console.log(PersonnalInformation, "info");
  const myRef = useRef(null);
  // useEffect(()=>{
  //     switch(keyValue)
  //     {
  //         case 1 :
  //             setTabColor("Fa")
  //     }
  // })

  const slideLeft = (e) => {
    myRef.current.scrollLeft -= 100;
  };
  const slideRight = (e) => {
    myRef.current.scrollLeft += 100;
  };

  const addCustomField = () => {
    setFieldSlider(true);
  };
  const onCancel = () => {
    setFieldSlider(false);
  };
  const onCancelConfigure = () => {
    setConfigureSlider(false);
  };
  const setConfigure = () => {
    setConfigureSlider(true);
  };
  console.log(destination, "dest");
  const [searchBar, showSearchBar] = useState(false);
  const [dropdown, showdropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputElem = useRef(null);

  return (
    <div className="main-target-container">
      <div className="main-target">
        <p className="target-text">Target</p>
        <div className="searchIconContainer">
          <Button
            variant="link"
            onClick={() => {
              showSearchBar(!searchBar);
            }}
            className="search-with-api-button"
          >
            <Image className="searchIcon" src="/assets/icons/svg/search.svg" />
          </Button>
        </div>
      </div>

      {searchBar && (
        <Form style={{ zIndex: "1" }}>
          <InputGroup>
            <div className="d-flex w-100 border border-1 border-bottom-0 rounded shadow-sm">
              <Form.Control
                ref={inputElem}
                // {...rest}
                size="sm"
                id="target-search-box"
                list="dropdown"
                placeholder="Search target fields here"
                value={searchTerm}
                className="w-100 border-0"
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.keyCode === 13) {
                    e.preventDefault();
                  }
                }}
                // onFocus={onMouseOut}
                type="text"
                style={{ paddingRight: "auto" }}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  event.target.value == ""
                    ? showdropdown(false)
                    : showdropdown(true);
                  let array_value = event.target.value.split("\\");

                  if (array_value[1]) {
                    setkeyValue(pageIndexes[array_value[0].trim()]);
                  }
                }}
              />
              {searchTerm != "" ? (
                <button
                  type="button"
                  style={{ border: "none", backgroundColor: "inherit" }}
                  onClick={() => {
                    showdropdown(false);
                    setSearchTerm("");
                  }}
                >
                  <FontAwesomeIcon
                    className="mr-2 ml-2"
                    icon={faTimes}
                    size={"sm" || "2x"}
                  />
                </button>
              ) : (
                <></>
              )}
            </div>
          </InputGroup>

          {(() => {
            if (dropdown) {
              return (
                <div className="search-drop-down rounded-bottom border border-1 border-top-0 shadow-sm">
                  {pageIndexes.map((_name, _index) => (
                    <div className="border-top py-1">
                      <p className="pt-1 m-0 text-muted">{_name}</p>
                      <ul className="drop-down-ul">
                        {indexMap[_index]
                          .filter((element) => {
                            if (
                              element.label
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            ) {
                              return true;
                            }
                          })
                          .map((element) => (
                            <li
                              className="drop-down-li"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setkeyValue(_index + 1);
                                setSearchTerm(element.label);
                                showdropdown(false);
                              }}
                            >
                              {element.label}
                            </li>
                          ))}
                        {indexMap[_index].filter((element) => {
                          if (
                            element.label
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            return true;
                          }
                        }).length == 0 ? (
                          <li>
                            <p className="text-secondary p-0 m-0">
                              No records found
                            </p>{" "}
                          </li>
                        ) : (
                          <></>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            }
          })()}
        </Form>
      )}

      <div className="d-flex">
        <div className="left-arrow-div">
          <FontAwesomeIcon icon={faChevronLeft} onClick={(e) => slideLeft(e)} />
        </div>
        <div className="target-tabs" ref={myRef}>
          {Object.entries}
          <Tabs
            defaultActiveKey={1}
            transition={false}
            activeKey={keyValue}
            onSelect={(k) => setkeyValue(k)}
            className="top-level-tab-enrollment"
            //id={tabState}
            mountOnEnter
            unmountOnExit
          >
            <Tab
              eventKey={1}
              npm
              className="EnrollmentTabs"
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 1 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Personnel Information
                  <div>
                    {!isEmpty(PersonnalInformation) &&
                      PersonnalInformation.reduce((acc, val) => {
                        return acc || val.mandatory;
                      }, false) && <div style={{ color: "red" }}>*</div>}
                  </div>
                </span>
              }
            >
              <div className="target-fields-container">
                {!isEmpty(PersonnalInformation) &&
                  PersonnalInformation.map(
                    (e, i) => {
                      if (
                        searchTerm == "" ||
                        (searchTerm &&
                          e.label
                            .trim()
                            .toLowerCase()
                            .includes(searchTerm.trim().toLowerCase()))
                      ) {
                        return (
                          <Droppable droppableId={e.label}>
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {!isEmpty(e.data) ? (
                                  <>
                                    <div style={{ display: "flex" }}>
                                      <div
                                        className="mb-2"
                                        style={{ display: "flex" }}
                                      >
                                        <p
                                          className="m-0 mr-2"
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {e.label}
                                        </p>
                                        {e.mandatory && (
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
                                      <div className="ssn-header">
                                        <FontAwesomeIcon
                                          icon={faCog}
                                          color="#BDBDBD"
                                          onClick={setConfigure}
                                        />
                                      </div>
                                    </div>
                                    <Card
                                      className="cardCss"
                                      style={{ background: "#F7F7F7" }}
                                    >
                                      <div className="fieldTitle">
                                        <span className="fieldText">
                                          {e.data[0].field}
                                        </span>
                                      </div>
                                      <div className="columnTitle">
                                        <span className="columnText">
                                          {e.data[0].columnName}
                                        </span>
                                      </div>
                                      <div className="sampleData">
                                        <span className="sampleDataText">
                                          Value :{" "}
                                          <span className="sampleValueText">
                                            {e.data[0].value}
                                          </span>
                                        </span>
                                      </div>
                                      <div className="dataType">
                                        <span className="dataTypeText">
                                          {e.data[0].dataType}
                                        </span>
                                      </div>
                                    </Card>
                                  </>
                                ) : destination == e.label ? (
                                  <div className="layout-drop"></div>
                                ) : (
                                  <UnmappedField
                                    dragStart={dragStart}
                                    columnName={e.label}
                                    isselected={e.mandatory}
                                    provided={provided}
                                    isDragging={snapshot.isDragging}
                                    isDraggingOver={snapshot.isDraggingOver}
                                    innerRef={provided.innerRef}
                                  />
                                )}
                              </div>
                            )}
                          </Droppable>
                        );
                      }
                      // else if (searchTerm.split('\\')[1] && searchTerm.split('\\')[1].trim() == e.label.trim()) {
                      //   return <UnmappedField
                      //     columnName={e.label}
                      //     isselected={e.mandatory}
                      //   />
                    }
                    // }
                  )}
              </div>
              <ConfigureTransformations
                addFieldSlider={addConfigureSlider}
                onCancel={onCancelConfigure}
                setFieldSlider={setConfigureSlider}
              />
            </Tab>
            <Tab
              eventKey={2}
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 2 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Contact Information
                  {ContactInformation.reduce((acc, val) => {
                    return acc || val.mandatory;
                  }, false) && <div style={{ color: "red" }}>*</div>}
                </span>
              }
            >
              <div className="target-fields-container">
                {ContactInformation.map((e, i) => {
                  if (
                    searchTerm == "" ||
                    (searchTerm &&
                      e.label
                        .trim()
                        .toLowerCase()
                        .includes(searchTerm.trim().toLowerCase()))
                  ) {
                    return (
                      <Droppable droppableId="Contact Information">
                        {(provided) => (
                          <UnmappedField
                            columnName={e.label}
                            isselected={e.mandatory}
                            provided={provided}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Droppable>
                    );
                  }
                })}
              </div>
            </Tab>
            <Tab
              eventKey={3}
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 3 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Employment & Age Details
                  {EmployementAge.reduce((acc, val) => {
                    return acc || val.mandatory;
                  }, false) && <div style={{ color: "red" }}>*</div>}
                </span>
              }
            >
              <div className="target-fields-container">
                {EmployementAge.map((e, i) => {
                  if (
                    searchTerm == "" ||
                    (searchTerm &&
                      e.label
                        .trim()
                        .toLowerCase()
                        .includes(searchTerm.trim().toLowerCase()))
                  ) {
                    return (
                      <Droppable droppableId="Employment Age">
                        {(provided) => (
                          <UnmappedField
                            columnName={e.label}
                            isselected={e.mandatory}
                            provided={provided}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Droppable>
                    );
                  }
                })}
              </div>
            </Tab>
            <Tab
              eventKey={4}
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 4 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Employee Classification
                  {Classification.reduce((acc, val) => {
                    return acc || val.mandatory;
                  }, false) && <div style={{ color: "red" }}>*</div>}
                </span>
              }
            >
              <div className="target-fields-container">
                {Classification.map((e, i) => {
                  if (
                    searchTerm == "" ||
                    (searchTerm &&
                      e.label
                        .trim()
                        .toLowerCase()
                        .includes(searchTerm.trim().toLowerCase()))
                  ) {
                    return (
                      <Droppable droppableId="Classification">
                        {(provided) => (
                          <UnmappedField
                            columnName={e.label}
                            isselected={e.mandatory}
                            provided={provided}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Droppable>
                    );
                  }
                })}
              </div>
            </Tab>
            <Tab
              eventKey={5}
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 5 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Hours and Compensation
                  {HoursAndCompensation.reduce((acc, val) => {
                    return acc || val.mandatory;
                  }, false) && <div style={{ color: "red" }}>*</div>}
                </span>
              }
            >
              <div className="target-fields-container">
                {HoursAndCompensation.map((e, i) => {
                  if (
                    searchTerm == "" ||
                    (searchTerm &&
                      e.label
                        .trim()
                        .toLowerCase()
                        .includes(searchTerm.trim().toLowerCase()))
                  ) {
                    return (
                      <Droppable droppableId="Hours And Compensation">
                        {(provided) => (
                          <UnmappedField
                            columnName={e.label}
                            isselected={e.mandatory}
                            provided={provided}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Droppable>
                    );
                  }
                })}
              </div>
            </Tab>
            <Tab
              eventKey={6}
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 6 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Loan
                  {Loans.reduce((acc, val) => {
                    return acc || val.mandatory;
                  }, false) && <div style={{ color: "red" }}>*</div>}
                </span>
              }
            >
              <div className="target-fields-container">
                {Loans.map((e, i) => {
                  if (
                    searchTerm == "" ||
                    (searchTerm &&
                      e.label
                        .trim()
                        .toLowerCase()
                        .includes(searchTerm.trim().toLowerCase()))
                  ) {
                    return (
                      <Droppable droppableId="Loans">
                        {(provided) => (
                          <UnmappedField
                            columnName={e.label}
                            isselected={e.mandatory}
                            provided={provided}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Droppable>
                    );
                  }
                })}
              </div>
            </Tab>
            <Tab
              eventKey={7}
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 7 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Contribution
                  {Contribution.reduce((acc, val) => {
                    return acc || val.mandatory;
                  }, false) && <div style={{ color: "red" }}>*</div>}
                </span>
              }
            >
              <div className="target-fields-container">
                {Contribution.map((e, i) => {
                  if (
                    searchTerm == "" ||
                    (searchTerm &&
                      e.label
                        .trim()
                        .toLowerCase()
                        .includes(searchTerm.trim().toLowerCase()))
                  ) {
                    return (
                      <Droppable droppableId="Contribution">
                        {(provided) => (
                          <UnmappedField
                            columnName={e.label}
                            isselected={e.mandatory}
                            provided={provided}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Droppable>
                    );
                  }
                })}
              </div>
            </Tab>
            <Tab
              eventKey={8}
              title={
                <span
                  style={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    color: `${keyValue == 8 ? "#2F80ED" : "#BDBDBD"}`,
                  }}
                >
                  Custom Fields
                </span>
              }
            >
              <div className="target-custom-fields-container">
                <div className="custom-fields">
                  {!isEmpty(customFields) &&
                    customFields.map((e) => (
                      <UnmappedField columnName={e.label} />
                    ))}
                </div>

                <div className="add-custom-fields" onClick={addCustomField}>
                  <div className="plus-symbol">
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <div className="add-custom-field-text">
                    Click to add new field
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className="right-arrow-div">
          <FontAwesomeIcon
            icon={faChevronRight}
            onClick={(e) => slideRight(e)}
          />
        </div>
      </div>
      {addFieldSlider && (
        <AddCustomFields
          addFieldSlider={addFieldSlider}
          onCancel={onCancel}
          customFields={customFields}
          setCustomFields={setCustomFields}
          setFieldSlider={setFieldSlider}
        />
      )}
    </div>
  );
};

export default TargetContainer;
