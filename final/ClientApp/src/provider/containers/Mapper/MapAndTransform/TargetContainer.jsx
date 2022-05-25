import React, { useState, useRef } from "react";
import { isEmpty, get } from "lodash";
import { Image, Tabs, Tab, InputGroup, Button, Form } from "react-bootstrap";
import { ConfigureTransformations } from "./ConfigureTransformations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import { FormControlSearch } from "../../../components";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/pro-light-svg-icons";
import { UnmappedField } from "./UnmappedField";
import { AddCustomFields } from "./AddCustomFields";
import { Droppable } from "react-beautiful-dnd";
import { TargetDroppedContainer } from "./TargetDropedContainer";
import { default as uuid } from "uuid";

const pageIndexes = [
  "Personal Information",
  "Contact Information",
  "Employment & Age details",
  "Employee Classification",
  "Hours and Compensation",
  "Loan",
  "Contribution",
];

const TargetContainer = (props) => {
  const {
    dragStart,
    requiredData,
    destination,
    characters,
    configurations,
    onCancelConfigure,
    addConfigureSlider,
    setFieldOperations,
    setTargetField,
    ssnExist,
    rkPlanNumberExist,
    deleteCT,
  } = props;
  const [keyValue, setkeyValue] = useState("Personal Information");
  const [customFields, setCustomFields] = useState([]);
  const [addFieldSlider, setConfigure] = useState(false);
  const [sliderItem, setItem] = useState(null);
  const onCancel = () => {
    setConfigure(false);
  };

  const MappingInformation =
    !isEmpty(requiredData) &&
    requiredData.reduce((res, data) => {
      if (!res[data.groupName]) {
        res[data.groupName] = [];
      }
      res[data.groupName].push(data);
      return res;
    }, {});
  const addGroups = (item) => {
    const childObjects = requiredData
      .find((e) => e.tId == item.tId)
      .childObjectMaps.map((f) => {
        if (!isEmpty(f)) {
          return {
            ...f,
            tId: uuid.v4(),
            fieldOperations: [],
            path: null,
            id: 0,
          };
        }
        return { ...f, id: 0, tId: uuid.v4() };
      });

    const addGroup = [
      ...requiredData,
      {
        tId: uuid.v4(),
        isCollection: true,
        isCollectionStart: false,
        isCollectionEnd: false,
        childObjectMaps: childObjects,
        groupName: item.groupName,
        propertyName: item.propertyName,
        dataType: 1,
        format: "",
        fieldLength: 15,
        sortOrder: item.sortOrder,
      },
    ];
    const collections = addGroup.filter((e) => e.groupName == item.groupName);
    const collectionsData = collections.map((e, i) => {
      if (i === 0) {
        return {
          ...e,
          isCollectionStart: true,
          isCollectionEnd: false,
        };
      }

      if (i === collections.length - 1) {
        return {
          ...e,
          isCollectionStart: false,
          isCollectionEnd: true,
        };
      }
      return {
        ...e,
        isCollectionStart: false,
        isCollectionEnd: false,
      };
    });
    setTargetField([
      ...addGroup.filter((e) => e.groupName != item.groupName),
      ...collectionsData,
    ]);
  };

  const deleteGroups = (item) => {
    const remaining = requiredData.filter((e) => e.tId != item.tId);
    let other = requiredData.filter((e) => e.groupName != item.groupName);
    // if(other.length == 0){

    //   other = [
    //     ...requiredData,
    //     {
    //       tId: uuid.v4(),
    //       isCollection: true,
    //       isCollectionStart: false,
    //       isCollectionEnd: false,
    //       childObjectMaps: [],
    //       groupName: item.groupName,
    //       propertyName: item.propertyName,
    //       dataType: 1,
    //       format: "",
    //       fieldLength: 15,
    //     },
    //   ]
    // }
    const collections = remaining.filter((e) => e.groupName == item.groupName);
    const collectionsData = collections.map((e, i) => {
      if (i === 0) {
        return {
          ...e,
          isCollectionStart: true,
          isCollectionEnd: false,
        };
      }

      if (i === collections.length - 1) {
        return {
          ...e,
          isCollectionStart: false,
          isCollectionEnd: true,
        };
      }
      return {
        ...e,
        isCollectionStart: false,
        isCollectionEnd: false,
      };
    });
    setTargetField([...other, ...collectionsData]);
  };

  const myRef = useRef(null);

  const slideLeft = (e) => {
    myRef.current.scrollLeft -= 100;
  };
  const slideRight = (e) => {
    myRef.current.scrollLeft += 100;
  };

  const [searchBar, showSearchBar] = useState(false);
  const [dropdown, showdropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    isEmpty(event.target.value) ? showdropdown(false) : showdropdown(true);
    let array_value = event.target.value.split("\\");

    if (array_value[1]) {
      setkeyValue(pageIndexes[array_value[0].trim()]);
    }
  };

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
              <FormControlSearch
                size="sm"
                id="target-search-box"
                type="text"
                className="w-100 border-0"
                placeholder="Search target fields here"
                autoComplete="off"
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.keyCode === 13) {
                    e.preventDefault();
                  }
                }}
                onChange={handleChange}
              />
            </div>
          </InputGroup>

          {(() => {
            if (dropdown) {
              return (
                <div className="search-drop-down rounded-bottom border border-1 border-top-0 shadow-sm">
                  {Object.entries(MappingInformation).map(
                    ([groupName, data1]) => (
                      <div className="border-top py-1">
                        <p className="pt-1 m-0 text-muted">{groupName}</p>
                        <ul className="drop-down-ul">
                          {data1
                            .filter((element) => {
                              if (
                                "displayName" in element &&
                                element.displayName
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
                                  setkeyValue(groupName);
                                  setSearchTerm(element.displayName);
                                  showdropdown(false);
                                }}
                              >
                                {element.displayName}
                              </li>
                            ))}
                          {data1.filter((element) => {
                            if (
                              "displayName" in element &&
                              element.displayName
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
                    )
                  )}
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
          <Tabs
            defaultActiveKey="Personal Information"
            transition={false}
            activeKey={keyValue}
            onSelect={(k) => setkeyValue(k)}
            className="top-level-tab-enrollment"
            mountOnEnter
            unmountOnExit
          >
            {Object.entries(MappingInformation).map(([groupName, data]) => {
              return (
                <Tab
                  eventKey={groupName}
                  title={
                    <span
                      style={{
                        display: "inline-flex",
                        whiteSpace: "nowrap",
                        color: `${
                          keyValue == groupName ? "#2F80ED" : "#BDBDBD"
                        }`,
                      }}
                    >
                      {groupName}
                      <div>
                        {!isEmpty(data) &&
                          data.reduce((acc, val) => {
                            return (
                              acc || val.groupName == "Personal Information"
                            );
                          }, false) && <div style={{ color: "red" }}>*</div>}
                      </div>
                    </span>
                  }
                >
                  <div className="target-fields-container">
                    {data.map((e, i) => {
                      if (
                        searchTerm == "" ||
                        ("displayName" in e &&
                          searchTerm &&
                          e.displayName
                            .trim()
                            .toLowerCase()
                            .includes(searchTerm.trim().toLowerCase()))
                      ) {
                        if (!e.isCollection) {
                          return (
                            <>
                              <Droppable droppableId={e.tId}>
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="mw-100"
                                  >
                                    {!isEmpty(e.path) ? (
                                      !isEmpty(characters) && (
                                        <TargetDroppedContainer
                                          item={e}
                                          mappedObject={
                                            !isEmpty(characters) &&
                                            characters.find((f) => {
                                              return f.fieldName == e.path;
                                            })
                                          }
                                          configurations={
                                            !isEmpty(configurations) &&
                                            configurations.length > 1
                                              ? configurations.find(
                                                  (f) =>
                                                    f.propertyName ==
                                                    e.propertyName
                                                )
                                              : !isEmpty(configurations)
                                              ? configurations.find(
                                                  (f) =>
                                                    f.propertyName ==
                                                    e.propertyName
                                                )
                                                ? configurations
                                                : null
                                              : null
                                          }
                                          setConfigure={setConfigure}
                                          setItem={setItem}
                                          configuredTransformations={
                                            configurations
                                          }
                                          initialData={requiredData}
                                          deleteCT={deleteCT}
                                          setTargetField={setTargetField}
                                          addFieldSlider={addConfigureSlider}
                                          onCancel={onCancelConfigure}
                                          setFieldOperations={
                                            setFieldOperations
                                          }
                                        />
                                      )
                                    ) : (
                                      <UnmappedField
                                        dragStart={dragStart}
                                        columnName={e.displayName}
                                        isselected={e.isRequired}
                                        provided={provided}
                                        ssnExist={ssnExist}
                                        rkPlanNumberExist={rkPlanNumberExist}
                                        isDragging={snapshot.isDragging}
                                        isDraggingOver={snapshot.isDraggingOver}
                                        ref={provided.innerRef}
                                        destination={destination}
                                        characters={characters}
                                        handleOnDragEnd={props.handleOnDragEnd}
                                        id={e.tId}
                                      />
                                    )}
                                  </div>
                                )}
                              </Droppable>
                            </>
                          );
                        }
                        if (e.isCollection) {
                          return (
                            <>
                              {e.isCollectionStart ? (
                                <div
                                  style={{
                                    color: "#2F80ED",
                                    cursor: "pointer",
                                    // position:'sticky',
                                    // left:'auto'
                                    // marginLeft:'auto'
                                  }}
                                  className="add-group-style"
                                  onClick={() => addGroups(e)}
                                >
                                  <i
                                    style={{
                                      color: "#4F4F4F",
                                      marginLeft: "80%",
                                    }}
                                    className="fas fa-plus mt-1"
                                  ></i>{" "}
                                  Add Group
                                </div>
                              ) : null}
                              {!isEmpty(e.childObjectMaps) &&
                                e.childObjectMaps.map((f, ind) => {
                                  return (
                                    <>
                                      <Droppable
                                        droppableId={f.tId + "," + e.tId}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="mw-100"
                                          >
                                            {!isEmpty(f.path) ? (
                                              !isEmpty(characters) && (
                                                <TargetDroppedContainer
                                                  item={f}
                                                  mappedObject={
                                                    !isEmpty(characters) &&
                                                    characters.find(
                                                      (g) =>
                                                        g.fieldName == f.path
                                                    )
                                                  }
                                                  collectionId={e.tId}
                                                  setConfigure={setConfigure}
                                                  setItem={setItem}
                                                  configuredTransformations={
                                                    configurations
                                                  }
                                                  initialData={requiredData}
                                                  deleteCT={deleteCT}
                                                  setTargetField={
                                                    setTargetField
                                                  }
                                                  addFieldSlider={
                                                    addConfigureSlider
                                                  }
                                                  onCancel={onCancelConfigure}
                                                  setFieldOperations={
                                                    setFieldOperations
                                                  }
                                                />
                                              )
                                            ) : (
                                              <UnmappedField
                                                dragStart={dragStart}
                                                columnName={f.displayName}
                                                isselected={f.isRequired}
                                                provided={provided}
                                                isDragging={snapshot.isDragging}
                                                isDraggingOver={
                                                  snapshot.isDraggingOver
                                                }
                                                ssnExist={ssnExist}
                                                rkPlanNumberExist={
                                                  rkPlanNumberExist
                                                }
                                                ref={provided.innerRef}
                                                destination={destination}
                                                characters={characters}
                                                handleOnDragEnd={
                                                  props.handleOnDragEnd
                                                }
                                                id={f.tId}
                                                droppableId={
                                                  f.tId + "," + e.tId
                                                }
                                              />
                                            )}
                                          </div>
                                        )}
                                      </Droppable>
                                    </>
                                  );
                                })}
                              {e.isCollectionStart &&
                              e.isCollectionEnd ? null : (
                                <div className="d-flex">
                                  {data.length != 1 && (
                                    <FontAwesomeIcon
                                      style={{
                                        marginLeft: "16.8rem",
                                        cursor: "pointer",
                                      }}
                                      icon={faTrash}
                                      size="20px"
                                      color="#EB5757"
                                      onClick={() => deleteGroups(e)}
                                    />
                                  )}
                                  {/* <div
                                    className="transform-target-text"
                                    style={{
                                      color: "#2F80ED",
                                      cursor: "pointer",
                                      marginLeft: "auto",
                                    }}
                                    onClick={() => addGroups(e)}
                                  >
                                    <i
                                      style={{ color: "#4F4F4F" }}
                                      className="fas fa-plus mt-1"
                                    ></i>{" "}
                                    Add Group
                                  </div> */}
                                </div>
                              )}
                              <hr style={{ width: "100%" }} />
                            </>
                          );
                        }
                        //}
                      }
                    })}
                  </div>
                </Tab>
              );
            })}
          </Tabs>
        </div>
        <div className="right-arrow-div">
          <FontAwesomeIcon
            icon={faChevronRight}
            onClick={(e) => slideRight(e)}
          />
        </div>
      </div>
      {addFieldSlider && !isEmpty(sliderItem) && (
        <ConfigureTransformations
          setTargetField={setTargetField}
          initialData={requiredData}
          itemConfigure={sliderItem}
          configuredValues={
            !isEmpty(configurations)
              ? configurations.find(
                  (f) =>
                    f.propertyName == get(sliderItem, "object.propertyName")
                )
              : null
          }
          addFieldSlider={addFieldSlider}
          onCancel={onCancel}
          setFieldSlider={setConfigure}
          setFieldOperations={setFieldOperations}
        />
      )}
      {/* {addFieldSlider && (
        <AddCustomFields
          addFieldSlider={addFieldSlider}
          onCancel={onCancel}
          customFields={customFields}
          setCustomFields={setCustomFields}
          //setFieldSlider={setFieldSlider}
        />
      )} */}
    </div>
  );
};

export default TargetContainer;
