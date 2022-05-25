import React, { useState, Fragment } from "react";
import { Field } from "formik";
import {
  FieldButtonGroup,
  DatePicker,
  FieldDropSide,
  SliderPanel,
  FieldInput,
  AddPlans,
  CsplTable as Table,
  Link,
} from "../../../components";
import { INVESTMENTS_BASED_ON, usDateFormat } from "../../../utils";
import { isEmpty, get, uniqBy, uniq, uniqWith, isEqual } from "lodash";
import { useDeepEffect } from "../../../abstracts";
import { Form, Button, InputGroup, Image, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";

export const DifferentInvestmentElection = (props) => {
  const {
    fields,
    isSave,
    isEdit,
    values,
    setFieldValue,
    handleChange,
    investmentList,
    sourcesList,
    setToggle,
    toggle,
    handleSubmit,
    autoEnrollment,
    setValues,
    deleteInvestment,
    planId,
  } = props;
  const [inputFields, setInputFields] = useState([{ from: "", to: "" }]);
  const [dateFields, setDateFields] = useState([{ from: "", to: "" }]);
  const [retirementFields, setRetirementFields] = useState([
    { from: "", to: "" },
  ]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredResponse, setFilteredResponse] = useState({});
  const [addedInvestments, setAddedInvestments] = useState({});
  const [searchString, setSearchString] = useState("");
  const [saveInvestments, setSaveInvestments] = useState({});
  const [totalInvestments, setTotalInvestments] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState();
  const [sourceIndex, setSourceIndex] = useState();
  const [Index, setIndex] = useState();

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "from") {
      values[index].from = event.target.value;
    } else {
      values[index].to = event.target.value;
    }
    setInputFields(values);
  };

  const handleAddAge = (from, to) => {
    handleAddFields();
  };

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ from: "", to: "" });
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    if (values.length > 1) {
      values.splice(index, 1);
      setInputFields(values);
    }
  };

  const handleDateAddFields = () => {
    const values = [...dateFields];
    values.push({ from: "", to: "" });
    setDateFields(values);
  };

  const handleDateInputChange = (index, event, action) => {
    const values = [...dateFields];
    if (action === "from") {
      values[index].from = event;
    } else {
      values[index].to = event;
    }
    setDateFields(values);
  };

  const handleDateRemoveFields = (index) => {
    const values = [...dateFields];
    if (values.length > 1) {
      values.splice(index, 1);
      setDateFields(values);
    }
  };

  const handleRetirementDateAddFields = () => {
    const values = [...retirementFields];
    values.push({ from: "", to: "" });
    setRetirementFields(values);
  };

  const handleRetirementDateInputChange = (index, event, action) => {
    const values = [...retirementFields];
    if (action === "from") {
      values[index].from = event;
    } else {
      values[index].to = event;
    }
    setRetirementFields(values);
  };

  const handleRetirementDateRemoveFields = (index) => {
    const values = [...retirementFields];
    if (values.length > 1) {
      values.splice(index, 1);
      setRetirementFields(values);
    }
  };

  let ageCat = [];
  if (!isEmpty(inputFields))
    inputFields.map((e, i) => {
      var c = {};
      c = null;
      if (e.from && e.to && e.to.length >= 2) {
        c = {
          label: e.from + "-" + e.to,
          className: "column-age",
          columnName: e.from + "-" + e.to,
        };
        ageCat.push(c);
      }
    });

  const ageTable = [
    {
      label: "Investment",
      className: "column-investment",
      columnName: "Investment",
    },
    ...ageCat,
    {
      label: "Action",
      className: "column-action",
      columnName: "Action",
    },
  ];

  const birthDateCat = [];
  if (!isEmpty(dateFields))
    dateFields.map((e, i) => {
      var c = {};
      c = null;
      if (e.from && e.to && e.to.length >= 2) {
        c = {
          label: e.from + "-" + e.to,
          className: "column-Birthdate",
          columnName: e.from + "-" + e.to,
        };
        birthDateCat.push(c);
      }
    });

  const dateTable = [
    {
      label: "Investment",
      className: "column-investment",
      columnName: "Investment",
    },
    ...birthDateCat,
    {
      label: "Action",
      className: "column-action",
      columnName: "Action",
    },
  ];

  const retirementCat = [];
  if (!isEmpty(retirementFields))
    retirementFields.map((e, i) => {
      var c = {};
      c = null;
      if (e.from && e.to && e.to.length >= 2) {
        c = {
          label: e.from + "-" + e.to,
          className: "column-Birthdate",
          columnName: e.from + "-" + e.to,
        };
        retirementCat.push(c);
      }
    });

  const retirementTable = [
    {
      label: "Investment",
      className: "column-investment",
      columnName: "Investment",
    },
    ...retirementCat,
    {
      label: "Action",
      className: "column-action",
      columnName: "Action",
    },
  ];

  const addInvestmentsToPlan = (investment) => {
    setAddedInvestments({
      ...addedInvestments,
      [categoryIndex]: {
        [sourceIndex]: [
          ...(addedInvestments[categoryIndex]?.[sourceIndex] || []),
          investment,
        ],
      },
    });
  };

  const onViewButtonClick = (index, sourceind) => {
    setModalOpen(true);
    setSourceIndex(sourceind);
    setCategoryIndex(index);
  };

  const onSubmit = (savedInvestments) => {
    console.log(savedInvestments);
    setSaveInvestments({
      ...saveInvestments,
      [categoryIndex]: {
        ...saveInvestments[categoryIndex],
        [sourceIndex]: savedInvestments,
      },
    });
    setModalOpen(false);
  };
  const onCancel = () => {
    setAddedInvestments({
      ...addedInvestments,
      [categoryIndex]: {
        ...addedInvestments[categoryIndex],
        [sourceIndex]: saveInvestments[categoryIndex]?.[sourceIndex],
      },
    });
    setModalOpen(false);
  };
  useDeepEffect(() => {
    (sourceIndex || sourceIndex == 0) &&
      setFilteredResponse({
        ...filteredResponse,
        [categoryIndex]: {
          [sourceIndex]: investmentList.filter((team) => {
            return team.investmentName
              .toLowerCase()
              .includes(searchString.toLowerCase());
          }),
        },
      });
  }, [searchString, investmentList, categoryIndex, sourceIndex]);

  useDeepEffect(() => {
    let defaults = !isEmpty(autoEnrollment.differentInvestmentElection)
      ? [...autoEnrollment?.differentInvestmentElection]
      : [];

    if (values.sameInvestmentBasedOn === 1) {
      setSaveInvestments({ 1: autoEnrollment.savedInvestments });
      setAddedInvestments({ 1: autoEnrollment.savedInvestments });
      if (!isEmpty(autoEnrollment.differentInvestmentElection))
        setInputFields(
          uniqWith(
            autoEnrollment.differentInvestmentElection
              .map((x) =>
                x
                  .map((y) => ({ from: y[0].ageFrom, to: y[0].ageTo }))
                  .filter((x) => x.from != null)
              )
              .flatMap((x) => x),
            isEqual
          )
        );
    } else if (values.sameInvestmentBasedOn === 2) {
      setSaveInvestments({ 2: autoEnrollment.savedInvestments });
      setAddedInvestments({ 2: autoEnrollment.savedInvestments });
      if (!isEmpty(autoEnrollment.differentInvestmentElection))
        setDateFields(
          uniqWith(
            autoEnrollment.differentInvestmentElection
              .map((x) =>
                x
                  .map((y) => ({
                    from: y[0].birthDateFrom,
                    to: y[0].birthDateTo,
                  }))
                  .filter((x) => x.from != null)
              )
              .flatMap((x) => x),
            isEqual
          )
        );
    } else if (values.sameInvestmentBasedOn === 3) {
      setSaveInvestments({ 3: autoEnrollment.savedInvestments });
      setAddedInvestments({ 3: autoEnrollment.savedInvestments });
      if (!isEmpty(autoEnrollment.differentInvestmentElection))
        setRetirementFields(
          uniqWith(
            autoEnrollment.differentInvestmentElection
              .map((x) =>
                x
                  .map((y) => ({
                    from: y[0].retirementDateFrom,
                    to: y[0].retirementDateTo,
                  }))
                  .filter((x) => x.from != null)
              )
              .flatMap((x) => x),
            isEqual
          )
        );
    }
  }, [autoEnrollment]);
  console.log(
    uniqWith(
      autoEnrollment.differentInvestmentElection
        .map((x) =>
          x
            .map((y) => ({ from: y[0].birthDateFrom, to: y[0].birthDateTo }))
            .filter((x) => x.from != null)
        )
        .flatMap((x) => x),
      isEqual
    )
  );

  console.log(values);
  const deletefunction = (name, index, sourceInd, cellIndex, sIndex) => {
    // var temp = totalInvestments.filter((e) => e.investmentName !== name);
    var temp = saveInvestments[index]?.[sourceInd].filter(
      (e) => e.investmentName !== name
    );
    // setTotalInvestments(temp);
    setAddedInvestments({
      ...addedInvestments,
      [index]: { [sourceInd]: temp },
    });
    setSaveInvestments({ ...saveInvestments, [index]: { [sourceInd]: temp } });
    //console.log( values.differentInvestmentElection[sourceInd][index-1][sIndex],index)
    for (var i = 0; i <= index; i++) {
      if (
        values.differentInvestmentElection[sourceInd] != null &&
        values.differentInvestmentElection[sourceInd][i] != null &&
        values.differentInvestmentElection[sourceInd][i][sIndex] != null
      ) {
        values.differentInvestmentElection[sourceInd][
          i
        ] = values.differentInvestmentElection[sourceInd][i].filter(
          (x) => x.investmentName != name
        );
      }
    }
  };

  const onDeleteClick = (name, index, sourceInd, cellIndex, sIndex) => {
    //setToggle(!toggle);
    // autoEnrollment.investmentDetails
    //   ? autoEnrollment.investmentDetails.forEach((e) =>
    //       e.investmentName === name
    //         ? deleteInvestment(planId, e.investmentId).then((response) => {
    //             if (response) deletefunction(name);
    //           })
    //         : deletefunction(name)
    //     )
    //   : deletefunction(name);
    //console.log( values.differentInvestmentElection[sourceInd][index])
    deletefunction(name, index, sourceInd, cellIndex, sIndex);
  };

  const sliderPanel = (
    <SliderPanel isOpen={isModalOpen} size="35" showCancel={false}>
      <div className="d-flex justify-content-between align-baseline">
        <div>
          <p className="plan-heading-plan">Plan Investments</p>
          <p className="enrollment-sub-heading">
            {(filteredResponse[categoryIndex]?.sourceIndex || []).length}{" "}
            Investments Available
          </p>
        </div>
        <div>
          <Button variant="secondary" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              onSubmit(addedInvestments[categoryIndex]?.[sourceIndex])
            }
            className="ml-4"
          >
            Save
          </Button>
        </div>
      </div>
      <div className="search-bar ">
        <Form>
          <InputGroup>
            <input
              size="m"
              style={{ width: "420px", height: "50px" }}
              type="search"
              placeholder="Search Investments"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <InputGroup.Append>
              <InputGroup.Text className="search-bar-button">
                <Image src="/assets/icons/svg/search.svg" width="14px" />
              </InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </div>

      <p className="enrollment-side-content">
        {(filteredResponse[categoryIndex]?.[sourceIndex] || []).length}{" "}
        Investments Available
      </p>
      <div className="scroll-body">
        {filteredResponse[categoryIndex]?.[sourceIndex] &&
          (filteredResponse[categoryIndex]?.[sourceIndex] || []).map((e, i) => (
            <div className="d-flex justify-content-between">
              <p>{e.investmentName}</p>
              {(addedInvestments[categoryIndex]?.[sourceIndex] || []).find(
                (y) => y.investmentName === e.investmentName
              ) ? (
                // <Button
                //   size="sm"
                //   style={{ width: "75px", margin: "0px 0px 8px 0px" }}
                //   variant="secondary"
                //   disabled
                //   classname="custom-added"
                // >
                //   Added
                // </Button>
                <div className="added-button-inside">
                  <div className="added-button-inner-text">Added</div>
                </div>
              ) : (
                <>
                  {/* <Button
                    style={{ width: "75px", margin: "0px 0px 8px 0px" }}
                    variant="secondary"
                    onClick={() => addInvestmentsToPlan(e)}
                  >
                    Add
                  </Button> */}
                  <div
                    className="add-button-inside"
                    onClick={() => addInvestmentsToPlan(e)}
                  >
                    <div className="add-button-inner-text">Add</div>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </SliderPanel>
  );

  const addInvestments = (index, sourceind) => (
    <div>
      <div className="mt-40">
        <p className="mt-20 plan-heading-plan">
          {sourcesList[sourceind].sourceName}
        </p>
        <AddPlans
          content="No Investments added."
          buttonLabel="Add Investment"
          onPrimaryClick={() => onViewButtonClick(index, sourceind)}
        />
      </div>
      {sliderPanel}
    </div>
  );
  const Invsum = (index, cellIndex) => {
    let sum1 = 0;
    if (
      !isEmpty(values.differentInvestmentElection) &&
      !isEmpty(values.differentInvestmentElection) &&
      !isEmpty(values.differentInvestmentElection[index]) &&
      !isEmpty(values.differentInvestmentElection[index][cellIndex])
    )
      values.differentInvestmentElection[index][cellIndex].map(
        (x) => (sum1 = sum1 + x.investmentPercentage)
      );
    return sum1;
  };
  const AddName = (
    e,
    investmentId,
    source,
    index,
    cellIndex,
    sourceInd,
    sName,
    sourceId,
    sourceName,
    category
  ) => {
    console.log("in");
    // console.log(values.differentInvestmentElection[index][cellIndex][
    //   sourceInd
    // ])
    if (
      !isEmpty(values.differentInvestmentElection) &&
      !isEmpty(values.differentInvestmentElection[index]) &&
      !isEmpty(values.differentInvestmentElection[index][cellIndex]) &&
      !isEmpty(values.differentInvestmentElection[index][cellIndex][sourceInd])
    ) {
      console.log("y");
      //if(!isEmpty(values.autoEnrollmentSouceInvestmentElections[index].investmentElection[ind])){
      values.differentInvestmentElection[index][cellIndex][
        sourceInd
      ].investmentName = source;
      values.differentInvestmentElection[index][cellIndex][
        sourceInd
      ].investmentId = investmentId;
      values.differentInvestmentElection[index][cellIndex][
        sourceInd
      ].sourceName = sourceName;
      values.differentInvestmentElection[index][cellIndex][
        sourceInd
      ].sourceId = sourceId;
      const x = sName.split("-");
      if (category === 1) {
        values.differentInvestmentElection[index][cellIndex][
          sourceInd
        ].ageFrom = x[0];
        values.differentInvestmentElection[index][cellIndex][sourceInd].ageTo =
          x[1];
      } else if (category === 2) {
        values.differentInvestmentElection[index][cellIndex][
          sourceInd
        ].birthDateFrom = x[0];
        values.differentInvestmentElection[index][cellIndex][
          sourceInd
        ].birthDateTo = x[1];
      } else if (category === 3) {
        values.differentInvestmentElection[index][cellIndex][
          sourceInd
        ].retirementDateFrom = x[0];
        values.differentInvestmentElection[index][cellIndex][
          sourceInd
        ].retirementDateTo = x[1];
      }
      // }
    }
    handleChange(e);
  };
  console.log(values);
  console.log(fields.sameInvestmentBasedOn);
  return (
    <div>
      <Field
        size="md"
        isRequired
        name={fields.sameInvestmentBasedOn}
        label={"Same Investment Election To All Participants"}
        options={INVESTMENTS_BASED_ON}
        value={values[fields.sameInvestmentBasedOn]}
        selectedValue={values[fields.sameInvestmentBasedOn]}
        onChange={(value) => {
          // values.differentInvestmentElection = [[[{}]]];
          // // setSaveInvestments({});
          // // setInputFields({});
          // // setTotalInvestments({});
          // // setAddedInvestments({});
          // // setTotalInvestments({});
          // console.log(values.differentInvestmentElection);
          // //values[fields.sameInvestmentBasedOn] = value;
          // setFieldValue(fields.sameInvestmentBasedOn, value);
          setValues({
            ...values,
            [fields.sameInvestmentBasedOn]: value,
            differentInvestmentElection: [[[{}]]],
          });
        }}
        component={FieldButtonGroup}
        //validate={required}
        disabled={isEdit && !isSave}
      />

      {values[fields.sameInvestmentBasedOn] === 1 ? (
        <div>
          <h5>Age</h5>
          <form>
            <div className="form-row">
              {isEmpty(inputFields)
                ? null
                : inputFields.map((inputField, index) => {
                    //console.log(inputFields)
                    return (
                      <Row
                        style={{
                          paddingLeft: "20px",
                        }}
                      >
                        <Fragment key={`${inputField}~${index}`}>
                          <Field
                            size="xs"
                            isRequired
                            label="From"
                            name="from"
                            placeholder="Enter age"
                            component={FieldInput}
                            type="number"
                            value={inputField.from}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                            disabled={isEdit && !isSave}
                            autoComplete="off"
                          />
                          <div
                            style={{
                              marginLeft: "2rem",
                            }}
                          ></div>
                          <Field
                            size="xs"
                            isRequired
                            label="To"
                            name="to"
                            placeholder="Enter age"
                            component={FieldInput}
                            type="number"
                            value={inputField.to}
                            onChange={(event) =>
                              handleInputChange(index, event)
                            }
                            disabled={isEdit && !isSave}
                            autoComplete="off"
                          />
                          <div className="form-group col-sm-2">
                            <button
                              className="btn btn-link"
                              type="button"
                              onClick={() =>
                                handleAddAge(
                                  inputField.from[index],
                                  inputField.to[index]
                                )
                              }
                            >
                              +
                            </button>
                            <button
                              className="btn btn-link"
                              type="button"
                              onClick={() => handleRemoveFields(index)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </button>
                          </div>
                        </Fragment>
                      </Row>
                    );
                  })}
            </div>
            <br />
          </form>
          <div>
            {(sourcesList || []).map((source, index) => {
              //console.log(saveInvestments[index])
              if (
                !isEmpty(saveInvestments[1]?.[index]) &&
                saveInvestments[1]?.[index][0].investmentName != null
              ) {
                //console.log(saveInvestments[1]?.[index][0].investmentName)
                return (
                  <div>
                    <div>
                      <div className="d-flex justify-content-between align-baseline">
                        <p className="mt-20 plan-heading-plan">
                          {source.sourceName}
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setModalOpen(true);
                            setSourceIndex(index);
                            setCategoryIndex(1);
                          }}
                        >
                          Add Investment
                        </Button>
                      </div>
                      <div>
                        <Table className="different-participants-election-table">
                          <Table.Thead>
                            <Table.Tr>
                              {ageTable.map((item, index) => {
                                return (
                                  <Table.Th
                                    key={index}
                                    className={item.className}
                                  >
                                    {item.label}
                                  </Table.Th>
                                );
                              })}
                              ;
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {(saveInvestments[1]?.[index]).map(
                              (investment, sourceInd) => {
                                //console.log(investment)
                                return (
                                  <Table.Tr key={sourceInd}>
                                    {ageTable.map((item, cellIndex) => {
                                      // console.log(investment)
                                      const fieldName = `differentInvestmentElection[${index}][${
                                        cellIndex - 1
                                      }][${sourceInd}].investmentPercentage`;
                                      //console.log(sourceInd)
                                      const getContent = () => {
                                        if (item.columnName == "Investment") {
                                          return investment.investmentName;
                                        }
                                        if (item.columnName == "Action") {
                                          return (
                                            <Link>
                                              <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                color="red"
                                                onClick={() =>
                                                  onDeleteClick(
                                                    investment.investmentName,
                                                    1,
                                                    index,
                                                    cellIndex,
                                                    sourceInd
                                                  )
                                                }
                                              />
                                            </Link>
                                          );
                                        }
                                        return (
                                          <Field
                                            size="xs"
                                            isRequired
                                            name={fieldName}
                                            hasSuggestion
                                            shouldDisplaySuggestion
                                            component={FieldInput}
                                            type="number"
                                            value={get(values, fieldName)}
                                            onChange={(e) => {
                                              AddName(
                                                e,
                                                investment.investmentId,
                                                investment.investmentName,
                                                index,
                                                cellIndex - 1,
                                                sourceInd,
                                                item.label,
                                                source.sourceId,
                                                source.sourceName,
                                                1
                                              );
                                            }}
                                            disabled={isEdit && !isSave}
                                            autoComplete="off"
                                          />
                                        );
                                      };

                                      return (
                                        <Table.Td
                                          key={cellIndex}
                                          className={item.className}
                                        >
                                          {getContent()}
                                        </Table.Td>
                                      );
                                    })}
                                  </Table.Tr>
                                );
                              }
                            )}
                          </Table.Tbody>
                          <div className="line-separator-total" />
                          <Table.Tbody>
                            <Table.Tr>
                              {ageTable.map((item, cellIndex) => {
                                const getContent = () => {
                                  if (item.columnName == "Investment") {
                                    return "Total";
                                  }
                                  if (item.columnName == "Action") {
                                    return null;
                                  }
                                  return (
                                    <Field
                                      size="xs"
                                      isRequired
                                      name="totalBox"
                                      hasSuggestion
                                      shouldDisplaySuggestion
                                      component={FieldInput}
                                      type="number"
                                      value={Invsum(index, cellIndex - 1)}
                                      autoComplete="off"
                                      disabled
                                    />
                                  );
                                };

                                return (
                                  <Table.Td
                                    key={cellIndex}
                                    className={item.className}
                                  >
                                    {getContent()}
                                  </Table.Td>
                                );
                              })}
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </div>
                    </div>
                    {sliderPanel}
                  </div>
                );
              } else {
                return addInvestments(1, index);
              }
            })}
          </div>
        </div>
      ) : null}

      {values[fields.sameInvestmentBasedOn] === 2 ? (
        <>
          <h5>Birthday</h5>
          <form>
            <div className="form-row">
              {dateFields.map((inputField, index) => (
                <Fragment key={`${inputField}~${index}`}>
                  <Field
                    isRequired
                    label="From"
                    size="md"
                    name="from"
                    value={usDateFormat(dateFields[index].from)}
                    placeholder="Select Birthdate"
                    isDatePicker
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          handleDateInputChange(
                            index,
                            usDateFormat(value),
                            "from"
                          )
                        }
                        value={values[fields.birthDateFrom]}
                      />
                    }
                    component={FieldDropSide}
                    disabled={isEdit && !isSave}
                  />
                  <div
                    style={{
                      marginLeft: "2rem",
                    }}
                  ></div>
                  <Field
                    isRequired
                    label="To"
                    size="md"
                    name="to"
                    value={usDateFormat(dateFields[index].to)}
                    placeholder="Select Birthdate"
                    isDatePicker
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          handleDateInputChange(
                            index,
                            usDateFormat(value),
                            "To"
                          )
                        }
                        value={values[fields.birthDateTo]}
                      />
                    }
                    component={FieldDropSide}
                    disabled={isEdit && !isSave}
                  />
                  <div className="form-group col-sm-2">
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => handleDateAddFields()}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => handleDateRemoveFields(index)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} color="red" />
                    </button>
                  </div>
                </Fragment>
              ))}
            </div>
            <br />
          </form>

          <div>
            {(sourcesList || []).map((source, index) => {
              if (
                !isEmpty(saveInvestments[2]?.[index]) &&
                saveInvestments[2]?.[index][0].investmentName != null
              ) {
                return (
                  <div>
                    <div>
                      <div className="d-flex justify-content-between align-baseline">
                        <p className="mt-20 plan-heading-plan">
                          {source.sourceName}
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setModalOpen(true);
                            setSourceIndex(index);
                            setCategoryIndex(2);
                          }}
                        >
                          Add Investment
                        </Button>
                      </div>
                      <div>
                        <Table className="different-participants-election-table">
                          <Table.Thead>
                            <Table.Tr>
                              {dateTable.map((item, index) => {
                                return (
                                  <Table.Th
                                    key={index}
                                    className={item.className}
                                  >
                                    {item.label}
                                  </Table.Th>
                                );
                              })}
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {(saveInvestments[2]?.[index]).map(
                              (investment, sourceInd) => {
                                return (
                                  <Table.Tr key={sourceInd}>
                                    {dateTable.map((item, cellIndex) => {
                                      const fieldName = `differentInvestmentElection[${index}][${
                                        cellIndex - 1
                                      }][${sourceInd}].investmentPercentage`;
                                      // "2" +
                                      // index +
                                      // "ID" +
                                      // cellIndex +
                                      // investment.investmentName;
                                      const getContent = () => {
                                        if (item.columnName == "Investment") {
                                          return investment.investmentName;
                                        }
                                        if (item.columnName == "Action") {
                                          return (
                                            <Link>
                                              <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                color="red"
                                                onClick={() =>
                                                  onDeleteClick(
                                                    investment.investmentName,
                                                    2,
                                                    index,
                                                    cellIndex,
                                                    sourceInd
                                                  )
                                                }
                                              />
                                            </Link>
                                          );
                                        }
                                        return (
                                          <Field
                                            size="xs"
                                            isRequired
                                            name={fieldName}
                                            hasSuggestion
                                            shouldDisplaySuggestion
                                            component={FieldInput}
                                            type="number"
                                            value={get(values, fieldName)}
                                            onChange={(e) => {
                                              AddName(
                                                e,
                                                investment.investmentId,
                                                investment.investmentName,
                                                index,
                                                cellIndex - 1,
                                                sourceInd,
                                                item.label,
                                                source.sourceId,
                                                source.sourceName,
                                                2
                                              );
                                            }}
                                            disabled={isEdit && !isSave}
                                            autoComplete="off"
                                          />
                                        );
                                      };

                                      return (
                                        <Table.Td
                                          key={cellIndex}
                                          className={item.className}
                                        >
                                          {getContent()}
                                        </Table.Td>
                                      );
                                    })}
                                  </Table.Tr>
                                );
                              }
                            )}
                          </Table.Tbody>
                          <div className="line-separator-total" />
                          <Table.Tbody>
                            <Table.Tr>
                              {dateTable.map((item, cellIndex) => {
                                const getContent = () => {
                                  if (item.columnName == "Investment") {
                                    return "Total";
                                  }
                                  if (item.columnName == "Action") {
                                    return null;
                                  }
                                  return (
                                    <Field
                                      size="xs"
                                      isRequired
                                      name="totalBox"
                                      hasSuggestion
                                      shouldDisplaySuggestion
                                      component={FieldInput}
                                      type="number"
                                      value={Invsum(index, cellIndex - 1)}
                                      autoComplete="off"
                                      disabled
                                    />
                                  );
                                };

                                return (
                                  <Table.Td
                                    key={cellIndex}
                                    className={item.className}
                                  >
                                    {getContent()}
                                  </Table.Td>
                                );
                              })}
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </div>
                    </div>
                    {sliderPanel}
                  </div>
                );
              } else {
                return addInvestments(2, index);
              }
            })}
          </div>
        </>
      ) : null}

      {values[fields.sameInvestmentBasedOn] === 3 ? (
        <>
          <h5>RetirementDate</h5>
          <form>
            <div className="form-row">
              {retirementFields.map((inputField, index) => (
                <Fragment key={`${inputField}~${index}`}>
                  <Field
                    isRequired
                    label="From"
                    size="md"
                    name="from"
                    value={usDateFormat(retirementFields[index].from)}
                    placeholder="Select Birthdate"
                    isDatePicker
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          handleRetirementDateInputChange(
                            index,
                            usDateFormat(value),
                            "from"
                          )
                        }
                        value={values[fields.RetirementDateFrom]}
                      />
                    }
                    component={FieldDropSide}
                    disabled={isEdit && !isSave}
                  />
                  <div
                    style={{
                      marginLeft: "2rem",
                    }}
                  ></div>
                  <Field
                    isRequired
                    label="To"
                    size="md"
                    name="to"
                    value={usDateFormat(retirementFields[index].to)}
                    placeholder="Select Birthdate"
                    isDatePicker
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          handleRetirementDateInputChange(
                            index,
                            usDateFormat(value),
                            "To"
                          )
                        }
                        value={values[fields.RetirementDateTo]}
                      />
                    }
                    component={FieldDropSide}
                    disabled={isEdit && !isSave}
                  />
                  <div className="form-group col-sm-2">
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => handleRetirementDateAddFields()}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => handleRetirementDateRemoveFields(index)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} color="red" />
                    </button>
                  </div>
                </Fragment>
              ))}
            </div>
            <br />
          </form>

          <div>
            {(sourcesList || []).map((source, index) => {
              if (
                !isEmpty(saveInvestments[3]?.[index]) &&
                saveInvestments[3]?.[index][0].investmentName != null
              ) {
                return (
                  <div>
                    <div>
                      <div className="d-flex justify-content-between align-baseline">
                        <p className="mt-20 plan-heading-plan">
                          {source.sourceName}
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setModalOpen(true);
                            setSourceIndex(index);
                            setCategoryIndex(3);
                          }}
                        >
                          Add Investment
                        </Button>
                      </div>
                      <div>
                        <Table className="different-participants-election-table">
                          <Table.Thead>
                            <Table.Tr>
                              {retirementTable.map((item, index) => {
                                return (
                                  <Table.Th
                                    key={index}
                                    className={item.className}
                                  >
                                    {item.label}
                                  </Table.Th>
                                );
                              })}
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {(saveInvestments[3]?.[index]).map(
                              (investment, sourceInd) => {
                                return (
                                  <Table.Tr key={sourceInd}>
                                    {retirementTable.map((item, cellIndex) => {
                                      const fieldName = `differentInvestmentElection[${index}][${
                                        cellIndex - 1
                                      }][${sourceInd}].investmentPercentage`;
                                      // "3" +
                                      // index +
                                      // "ID" +
                                      // cellIndex +
                                      // investment.investmentName;
                                      const getContent = () => {
                                        if (item.columnName == "Investment") {
                                          return investment.investmentName;
                                        }
                                        if (item.columnName == "Action") {
                                          return (
                                            <Link>
                                              <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                color="red"
                                                onClick={() =>
                                                  onDeleteClick(
                                                    investment.investmentName,
                                                    3,
                                                    index,
                                                    cellIndex
                                                  )
                                                }
                                              />
                                            </Link>
                                          );
                                        }
                                        return (
                                          <Field
                                            size="xs"
                                            isRequired
                                            name={fieldName}
                                            hasSuggestion
                                            shouldDisplaySuggestion
                                            component={FieldInput}
                                            type="number"
                                            value={get(values, fieldName)}
                                            onChange={(e) => {
                                              AddName(
                                                e,
                                                investment.investmentId,
                                                investment.investmentName,
                                                index,
                                                cellIndex - 1,
                                                sourceInd,
                                                item.label,
                                                source.sourceId,
                                                source.sourceName,
                                                3
                                              );
                                            }}
                                            disabled={isEdit && !isSave}
                                            autoComplete="off"
                                          />
                                        );
                                      };

                                      return (
                                        <Table.Td
                                          key={cellIndex}
                                          className={item.className}
                                        >
                                          {getContent()}
                                        </Table.Td>
                                      );
                                    })}
                                  </Table.Tr>
                                );
                              }
                            )}
                          </Table.Tbody>
                          <div className="line-separator-total" />
                          <Table.Tbody>
                            <Table.Tr>
                              {retirementTable.map((item, cellIndex) => {
                                const getContent = () => {
                                  if (item.columnName == "Investment") {
                                    return "Total";
                                  }
                                  if (item.columnName == "Action") {
                                    return null;
                                  }
                                  return (
                                    <Field
                                      size="xs"
                                      isRequired
                                      name="totalBox"
                                      hasSuggestion
                                      shouldDisplaySuggestion
                                      component={FieldInput}
                                      type="number"
                                      value={Invsum(index, cellIndex - 1)}
                                      autoComplete="off"
                                      disabled
                                    />
                                  );
                                };

                                return (
                                  <Table.Td
                                    key={cellIndex}
                                    className={item.className}
                                  >
                                    {getContent()}
                                  </Table.Td>
                                );
                              })}
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </div>
                    </div>
                    {sliderPanel}
                  </div>
                );
              } else {
                return addInvestments(3, index);
              }
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DifferentInvestmentElection;
