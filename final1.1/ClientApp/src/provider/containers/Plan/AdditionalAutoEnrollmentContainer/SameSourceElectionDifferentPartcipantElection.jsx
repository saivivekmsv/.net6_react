import React, { useState, Fragment } from "react";
import { Field } from "formik";
import {
  FieldInput,
  AddPlans,
  SliderPanel,
  FieldButtonGroup,
  DatePicker,
  FieldDropSide,
  CsplTable as Table,
  Link,
} from "../../../components";
import { INVESTMENTS_BASED_ON, usDateFormat } from "../../../utils";
import { isEmpty, get, uniqBy } from "lodash";
import { useDeepEffect } from "../../../abstracts";
import { Form, Button, InputGroup, Image, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";

const SameSourceElectionDifferentPartcipantElection = (props) => {
  const {
    fields,
    isSave,
    isEdit,
    values,
    setFieldValue,
    handleChange,
    handleSubmit,
    investmentList,
    setToggle,
    toggle,
    additionalAutoEnrollmentData,
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
  const [saveInvestments1, setSaveInvestments1] = useState([]);
  const [saveInvestments2, setSaveInvestments2] = useState([]);
  const [saveInvestments3, setSaveInvestments3] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState();

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "from") {
      values[index].from = event.target.value;
    } else {
      values[index].to = event.target.value;
    }
    setInputFields(values);
    console.log(values);
  };

  const handleAddAge = (from, to) => {
    if (!from.isEmpty && !to.isEmpty) {
      handleAddFields();
    }
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

  const ageCat = [];
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
      [categoryIndex]: [...(addedInvestments[categoryIndex] || []), investment],
    });
  };

  const onViewButtonClick = (index) => {
    setModalOpen(true);
    setCategoryIndex(index);
  };

  const onSubmit = (savedInvestments) => {
    setSaveInvestments({
      ...saveInvestments,
      [categoryIndex]: savedInvestments,
    });
    setModalOpen(false);
  };

  const onCancel = () => {
    setAddedInvestments({
      ...addedInvestments,
      [categoryIndex]: saveInvestments[categoryIndex],
    });
    setModalOpen(false);
  };

  useDeepEffect(() => {
    setFilteredResponse({
      ...filteredResponse,
      [categoryIndex]: investmentList.filter((team) => {
        return team.investmentName
          .toLowerCase()
          .includes(searchString.toLowerCase());
      }),
    });
  }, [searchString, investmentList, categoryIndex]);

  useDeepEffect(() => {
    let defaults = !isEmpty(
      additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment
    )
      ? [
          ...additionalAutoEnrollmentData?.additionalAutoEnrollmentCategorywiseInvestment,
        ]
      : [];
    setTotalInvestments(defaults);
    //setSaveInvestments(defaults);
    setAddedInvestments(defaults);

    if (values.investmentBasedOn === 1) {
      if (
        !isEmpty(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment
        )
      )
        setInputFields(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.map(
            (x) => ({
              from: x[0].ageFrom,
              to: x[0].ageTo,
            })
          )
        );
      setSaveInvestments({
        1: uniqBy(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.flatMap(
            (x) => x
          ),
          "investmentName"
        ),
      });
      setAddedInvestments({
        1: uniqBy(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.flatMap(
            (x) => x
          ),
          "investmentName"
        ),
      });
    } else if (values.investmentBasedOn === 2) {
      if (
        !isEmpty(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment
        )
      )
        setDateFields(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.map(
            (x) => ({
              from: x[0].birthDateFrom,
              to: x[0].birthDateTo,
            })
          )
        );
      setAddedInvestments({
        2: uniqBy(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.flatMap(
            (x) => x
          ),
          "investmentName"
        ),
      });
      setSaveInvestments({
        2: uniqBy(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.flatMap(
            (x) => x
          ),
          "investmentName"
        ),
      });
    } else if (values.investmentBasedOn === 3) {
      if (
        !isEmpty(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment
        )
      )
        setRetirementFields(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.map(
            (x) => ({
              from: x[0].retirementDateFrom,
              to: x[0].retirementDateTo,
            })
          )
        );
      setAddedInvestments({
        3: uniqBy(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.flatMap(
            (x) => x
          ),
          "investmentName"
        ),
      });
      setSaveInvestments({
        3: uniqBy(
          additionalAutoEnrollmentData.additionalAutoEnrollmentCategorywiseInvestment.flatMap(
            (x) => x
          ),
          "investmentName"
        ),
      });
    }
  }, [additionalAutoEnrollmentData]);

  useDeepEffect(() => {
    setTotalInvestments(saveInvestments);
  }, [saveInvestments]);
  //console.log(inputFields)
  const deletefunction = (name, index, cellIndex, ind) => {
    // var temp = totalInvestments.filter((e) => e.investmentName !== name);
    var temp = saveInvestments[index].filter((e) => e.investmentName !== name);
    // setTotalInvestments(temp);
    setAddedInvestments({ ...addedInvestments, [index]: temp });
    setSaveInvestments({ ...saveInvestments, [index]: temp });
    // values.additionalAutoEnrollmentCategorywiseInvestment[
    //   cellIndex - 1
    // ] = values.additionalAutoEnrollmentCategorywiseInvestment[cellIndex - 1].filter(
    //   (x) => x.investmentName !== name
    // );
    setValues({
      ...values,
      additionalAutoEnrollmentCategorywiseInvestment: values.additionalAutoEnrollmentCategorywiseInvestment.map(
        (y) => y.filter((x) => x.investmentName !== name)
      ),
    });
  };

  const onDeleteClick = (name, index, cellIndex, ind) => {
    setToggle(!toggle);
    // autoEnrollment.investmentDetails
    //   ? autoEnrollment.investmentDetails.forEach((e) =>
    //       e.investmentName === name
    //         ? deleteInvestment(planId, e.investmentId).then((response) => {
    //             if (response) deletefunction(name);
    //           })
    //         : deletefunction(name)
    //     )
    //   : deletefunction(name);
    deletefunction(name, index, cellIndex, ind);
  };
  console.log(values);
  // console.log(saveInvestments2, "sv");
  // console.log(saveInvestments);

  const sliderPanel = (
    <SliderPanel isOpen={isModalOpen} size="35" showCancel={false}>
      <div className="d-flex justify-content-between align-baseline">
        <div>
          <p className="plan-heading-plan">Plan Investments</p>
          <p className="enrollment-sub-heading">
            {(filteredResponse[categoryIndex] || []).length} Investments
            Available
          </p>
        </div>
        <div>
          <Button variant="secondary" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onSubmit(addedInvestments[categoryIndex])}
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
        {(filteredResponse[categoryIndex] || []).length} Investments Available
      </p>
      <div className="scroll-body">
        {filteredResponse[categoryIndex] &&
          (filteredResponse[categoryIndex] || []).map((e, i) => (
            <div className="d-flex justify-content-between">
              <p>{e.investmentName}</p>
              {(addedInvestments[categoryIndex] || []).find(
                (y) => y.investmentName === e.investmentName
              ) ? (
                <Button
                  size="sm"
                  style={{ width: "75px", margin: "0px 0px 8px 0px" }}
                  variant="secondary"
                  disabled
                  classname="custom-added"
                >
                  Added
                </Button>
              ) : (
                <>
                  <Button
                    style={{ width: "75px", margin: "0px 0px 8px 0px" }}
                    variant="secondary"
                    onClick={() => addInvestmentsToPlan(e)}
                  >
                    Add
                  </Button>
                </>
              )}
            </div>
          ))}
      </div>
    </SliderPanel>
  );

  const addInvestments = (index) => (
    <div>
      <div className="mt-40">
        <AddPlans
          content="No Investments added."
          buttonLabel="Add Investment"
          onPrimaryClick={() => onViewButtonClick(index)}
        />
      </div>
      {sliderPanel}
    </div>
  );
  const Invsum = (index) => {
    let sum1 = 0;
    if (
      !isEmpty(values.additionalAutoEnrollmentCategorywiseInvestment) &&
      !isEmpty(values.additionalAutoEnrollmentCategorywiseInvestment[index])
    )
      values.additionalAutoEnrollmentCategorywiseInvestment[index].map(
        (x) => (sum1 = sum1 + x.investmentPercentage)
      );
    return sum1;
  };
  const AddName = (e, source, index, ind, sName, category) => {
    console.log(values.additionalAutoEnrollmentCategorywiseInvestment[0][0]);
    if (
      !isEmpty(values.additionalAutoEnrollmentCategorywiseInvestment) &&
      !isEmpty(values.additionalAutoEnrollmentCategorywiseInvestment[index]) &&
      !isEmpty(
        values.additionalAutoEnrollmentCategorywiseInvestment[index][ind]
      )
    ) {
      //if(!isEmpty(values.autoEnrollmentSouceInvestmentElections[index].investmentElection[ind])){
      values.additionalAutoEnrollmentCategorywiseInvestment[index][
        ind
      ].investmentName = source;
      const x = sName.split("-");
      console.log(x);
      if (category === 1) {
        values.additionalAutoEnrollmentCategorywiseInvestment[index][
          ind
        ].ageFrom = x[0];
        values.additionalAutoEnrollmentCategorywiseInvestment[index][
          ind
        ].ageTo = x[1];
      } else if (category === 2) {
        values.additionalAutoEnrollmentCategorywiseInvestment[index][
          ind
        ].birthDateFrom = x[0];
        values.additionalAutoEnrollmentCategorywiseInvestment[index][
          ind
        ].birthDateTo = x[1];
      } else if (category === 3) {
        values.additionalAutoEnrollmentCategorywiseInvestment[index][
          ind
        ].retirementDateFrom = x[0];
        values.additionalAutoEnrollmentCategorywiseInvestment[index][
          ind
        ].retirementDateTo = x[1];
      }
      // }
    }
    handleChange(e);
  };

  return (
    <div>
      <Field
        size="md"
        isRequired
        name={fields.investmentBasedOn}
        label={"Same Investment Election To All Participants"}
        options={INVESTMENTS_BASED_ON}
        value={values[fields.investmentBasedOn]}
        selectedValue={values[fields.investmentBasedOn]}
        onChange={(value) => {
          // values.additionalAutoEnrollmentCategorywiseInvestment = [[]];
          // values[fields.investmentBasedOn] = value;
          // setFieldValue(fields.investmentBasedOn, value);
          setValues({
            ...values,
            [fields.investmentBasedOn]: value,
            additionalAutoEnrollmentCategorywiseInvestment: [[{}]],
          });
        }}
        component={FieldButtonGroup}
        //validate={required}
        disabled={isEdit && !isSave}
      />

      {values[fields.investmentBasedOn] === 1 ? (
        <div>
          <h5>Age</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              {(inputFields || []).map((inputField, index) => {
                const fieldName = `investmentBasedOn[index].fromAge`;
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
                        onChange={(event) => handleInputChange(index, event)}
                        disabled={isEdit && !isSave}
                        autoComplete="off"
                      />
                      &nbsp;&nbsp;&nbsp;
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
                        onChange={(event) => handleInputChange(index, event)}
                        disabled={isEdit && !isSave}
                        autoComplete="off"
                      />
                      <div className="form-group col-sm-2">
                        <button
                          className="btn btn-link"
                          type="button"
                          onClick={() => handleAddFields()}
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
                        &nbsp;&nbsp;&nbsp;
                      </div>
                    </Fragment>
                  </Row>
                );
              })}
            </div>
            <br />
          </form>

          <div>
            {!isEmpty(saveInvestments[1] || !isEmpty(saveInvestments1)) ? (
              <>
                <div>
                  <div className="d-flex justify-content-between align-baseline">
                    <p className="mt-20 plan-heading-plan">
                      List of Investment Election Added
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setModalOpen(true);
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
                              <Table.Th key={index} className={item.className}>
                                {item.label}
                              </Table.Th>
                            );
                          })}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {saveInvestments[1].map((investment, index) => {
                          return (
                            <Table.Tr key={index}>
                              {ageTable.map((item, cellIndex) => {
                                const fieldName = `additionalAutoEnrollmentCategorywiseInvestment[${
                                  cellIndex - 1
                                }][${index}].investmentPercentage`;
                                // "1" +
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
                                              1,
                                              cellIndex,
                                              index
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
                                          investment.investmentName,
                                          cellIndex - 1,
                                          index,
                                          item.label,
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
                        })}
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
                                  value={Invsum(cellIndex - 1)}
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
              </>
            ) : (
              addInvestments(1)
            )}
          </div>
        </div>
      ) : null}

      {values[fields.investmentBasedOn] === 2 ? (
        <>
          <h5>Birthday</h5>
          <form onSubmit={handleDateAddFields}>
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
            {!isEmpty(saveInvestments[2] || !isEmpty(saveInvestments2)) ? (
              <>
                <div>
                  <div className="d-flex justify-content-between align-baseline">
                    <p className="mt-20 plan-heading-plan">
                      List of Investment Election Added
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setModalOpen(true);
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
                              <Table.Th key={index} className={item.className}>
                                {item.label}
                              </Table.Th>
                            );
                          })}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {saveInvestments[2].map((investment, index) => {
                          return (
                            <Table.Tr key={index}>
                              {dateTable.map((item, cellIndex) => {
                                const fieldName = `additionalAutoEnrollmentCategorywiseInvestment[${
                                  cellIndex - 1
                                }][${index}].investmentPercentage`;
                                // "2" +
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
                                          investment.investmentName,
                                          cellIndex - 1,
                                          index,
                                          item.label,
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
                        })}
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
                                  value={Invsum(cellIndex - 1)}
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
              </>
            ) : (
              addInvestments(2)
            )}
          </div>
        </>
      ) : null}

      {values[fields.investmentBasedOn] == 3 ? (
        <>
          <h5>RetirementDate</h5>
          <form onSubmit={handleRetirementDateAddFields}>
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
                        value={values[fields.RetirementDate]}
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
            {!isEmpty(saveInvestments[3] || !isEmpty(saveInvestments3)) ? (
              <>
                <div>
                  <div className="d-flex justify-content-between align-baseline">
                    <p className="mt-20 plan-heading-plan">
                      List of Investment Election Added
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setModalOpen(true);
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
                              <Table.Th key={index} className={item.className}>
                                {item.label}
                              </Table.Th>
                            );
                          })}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {saveInvestments[3].map((investment, index) => {
                          return (
                            <Table.Tr key={index}>
                              {retirementTable.map((item, cellIndex) => {
                                const fieldName = `additionalAutoEnrollmentCategorywiseInvestment[${
                                  cellIndex - 1
                                }][${index}].investmentPercentage`;
                                // "3" +
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
                                          investment.investmentName,
                                          cellIndex - 1,
                                          index,
                                          item.label,
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
                        })}
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
                                  value={Invsum(cellIndex - 1)}
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
              </>
            ) : (
              addInvestments(3)
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SameSourceElectionDifferentPartcipantElection;
