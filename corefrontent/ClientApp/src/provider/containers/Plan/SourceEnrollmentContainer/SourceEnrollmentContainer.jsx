import React, { useContext, useEffect, useState } from "react";
import { find, get, isEmpty } from "lodash";
import { Row, Col, Form, Button } from "react-bootstrap";
import { faPlus, faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldDropSide,
  FieldButtonGroup,
  SearchableList,
  DatePicker,
  DayDropdown,
  FieldTextarea,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  yesNoOptions,
  required,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  clearFieldValues,
  tranformListToDropdownValues,
  usDateFormat,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanLocalCache,
  setManagePlanToastInfo,
  deleteUploadedFile,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";
import months from "../../../mocks/months.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";

const SourceEnrollmentContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, sourceEnrollmentId } = useRouterParams();
  const formName = managePlanFormNames.ADD_SOURCE_ENROLLMENT;
  const fields = formFields[formName];
  const intSourceEnrollmentId = parseInt(sourceEnrollmentId, 10);
  const apiData = get(state, "api.data", {});
  // const initialValues = {
  //   //   [fields.entryDateRule]: 1,
  // };
  const enrollmentEffectiveDateRuleFormValues = get(
    state,
    "enrollmentEffectiveDateRule",
    {}
  );
  const sourceEnrollmentRulesData = get(
    enrollmentEffectiveDateRuleFormValues,
    "sourceEnrollmentRules",
    []
  );

  const formValues = get(sourceEnrollmentRulesData, sourceEnrollmentId, {});

  const sourceEnrollmentOtherEntryDates = get(
    formValues,
    "sourceEnrollmentOtherEntryDates",
    [{ month: null, day: null }]
  );
  const additionalSourceEnrollmentOtherDates = get(
    formValues,
    "additionalSourceEnrollmentOtherDates",
    [{ month: null, day: null }]
  );

  const [dates, setDates] = useState(sourceEnrollmentOtherEntryDates);
  const [additionalDates, setAdditionalDates] = useState(
    additionalSourceEnrollmentOtherDates
  );

  const [newFlow, setNewFlow] = useState(
    !isNaN(intSourceEnrollmentId) ? FLOW_TYPES.EDIT : ""
  );
  const sourcesList = tranformListToDropdownValues(
    get(apiData, "sources", []).filter(
      (_) =>
        !find(
          sourceEnrollmentRulesData.filter(
            (_, index) => index != sourceEnrollmentId
          ),
          { sourceId: _.id }
        )
    ),
    "sourceName",
    "id"
  );

  const initialValues = {
    [fields.additionalEntryDateRule]: null,
    [fields.additionalProspectiveOrRetrospective]: null,
    [fields.isCoincidingApplicableForAdditional]: null,
    [fields.additionalOtherDescription]: null,
    [fields.additionalSourceEnrollmentOtherDates]: [],
  };

  const onDeleteClick = () => {
    dispatch(
      setManagePlanLocalCache({
        model: "enrollmentEffectiveDateRule",
        data: {
          ...enrollmentEffectiveDateRuleFormValues,
          sourceEnrollmentRules: sourceEnrollmentRulesData.filter(
            (sourceEnrollment, index) => index !== intSourceEnrollmentId
          ),
        },
      })
    );
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ENTRYDATE,
        pathParam: [FLOW_TYPES.SAVE, planId],
      })
    );
    dispatch(
      setManagePlanToastInfo({
        showToast: true,
        toastMessage: `Enrollment Source deleted successfully`,
      })
    );
  };

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      onClick: () =>
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ENTRYDATE,
            pathParam: [flow, planId],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      onClick: () =>
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ENTRYDATE,
            pathParam: [flow, planId],
          })
        ),
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () => setNewFlow(FLOW_TYPES.SAVE),
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
      onClick: onDeleteClick,
    },
  ];
  const mystyle = { fontWeight: 500, fontSize: ".74rem", marginBottom: "7px" };

  const getDataForSave = (values) => {
    let transformedValues = {};
    if (isEmpty(formValues)) {
      transformedValues = {
        ...enrollmentEffectiveDateRuleFormValues,
        sourceEnrollmentRules: [...sourceEnrollmentRulesData, values],
      };
      return transformedValues;
    }
    transformedValues = {
      ...enrollmentEffectiveDateRuleFormValues,
      sourceEnrollmentRules: sourceEnrollmentRulesData.map(
        (sourceAllocationItem, sourceAllocationIndex) => {
          if (sourceAllocationIndex === intSourceEnrollmentId) {
            return { ...sourceAllocationItem, ...values };
          }
          return sourceAllocationItem;
        }
      ),
    };
    return transformedValues;
  };

  const findDuplicates = (list) => {
    let arr = Array(12)
      .fill()
      .map(() => Array(31));
    let duplicateIndices = [];
    list.forEach((element, index) => {
      if (!(element.month && element.day)) return;
      if (arr[element.month][element.day] == 1) duplicateIndices.push(index);
      else arr[element.month][element.day] = 1;
    });
    return duplicateIndices;
  };

  const onFormSubmit = (values, { setFieldError }) => {
    dispatch(
      setManagePlanLocalCache({
        model: "enrollmentEffectiveDateRule",
        data: getDataForSave(values),
      })
    );

    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ENTRYDATE,
        pathParam: [FLOW_TYPES.SAVE, planId],
      })
    );

    dispatch(
      setManagePlanToastInfo({
        showToast: true,
        toastMessage: `Data saved successfully`,
      })
    );
  };

  const isEdit = newFlow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validate={(values) => {
        let dateDuplicates = findDuplicates(dates);
        let additionalDateDuplicates = findDuplicates(additionalDates);
        let errors = {};
        dateDuplicates.forEach((i) => {
          errors[`month${i}`] =
            "PL538 : The entered day and month already exists for the plan";
          errors[`day${i}`] = " ";
        });
        additionalDateDuplicates.forEach((i) => {
          errors[`addMonth${i}`] =
            "PL540 : The entered day and month already exists for the plan";
          errors[`addDay${i}`] = " ";
        });
        return errors;
      }}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        setValues,
        setTouched,
        values,
        ...rest
      }) => {
        const onSourceChange = (value) => {
          setValues({
            ...clearFieldValues({
              values,
              fieldsToClear: [fields.entryDateRule],
            }),
            [fields.sourceId]: value,
          });
          setTouched({
            [fields.entryDateRule]: false,
          });
        };

        const onEmployerSourceEntryDateChange = (value) => {
          setValues({
            ...clearFieldValues({
              values,
              fieldsToClear: [fields.additionalEntryDateRule],
            }),
            [fields.isSwitchToPlanYearHaveDifferentEntryDates]: value,
          });
          setTouched({
            [fields.additionalEntryDateRule]: false,
          });
        };

        const handleAddClick = (i) => {
          setDates([...dates, { month: null, day: null }]);
        };

        const handleAdd = (i) => {
          setAdditionalDates([...additionalDates, { month: null, day: null }]);
        };

        const handleRemoveClick = (i) => {
          const list = [...dates];
          //const list1 = list.filter((_, index) => index != i);
          list.splice(i, 1);
          setDates(list);
          setFieldValue(fields.sourceEnrollmentOtherEntryDates, list);
        };
        const handleRemove = (i) => {
          const list = [...additionalDates];
          list.splice(i, 1);
          setAdditionalDates(list);
          setFieldValue(fields.additionalSourceEnrollmentOtherDates, list);
        };

        const handleInputChange = (name, value, index) => {
          const list = [...dates];
          list[index][name] = value;
          if (name === "month") {
            let startDate = list[index]["day"];
            startDate =
              startDate > 28
                ? value === 2
                  ? 28
                  : startDate === 31
                  ? value < 8
                    ? value % 2 !== 0
                      ? 31
                      : 30
                    : value % 2 === 0
                    ? 31
                    : 30
                  : startDate
                : startDate;
            list[index]["day"] = startDate;
          }
          setDates(list);
          setFieldValue(fields.sourceEnrollmentOtherEntryDates, dates);
        };

        const handleInputChange1 = (name, value, index) => {
          const list = [...additionalDates];
          list[index][name] = value;
          if (name === "month") {
            let startDate = list[index]["day"];
            startDate =
              startDate > 28
                ? value === 2
                  ? 28
                  : startDate === 31
                  ? value < 8
                    ? value % 2 !== 0
                      ? 31
                      : 30
                    : value % 2 === 0
                    ? 31
                    : 30
                  : startDate
                : startDate;
            list[index]["day"] = startDate;
          }
          setAdditionalDates(list);
          setFieldValue(
            fields.additionalSourceEnrollmentOtherDates,
            additionalDates
          );
        };

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <Field
                isRequired
                label="Source Name"
                name={fields.sourceId}
                value={values[fields.sourceId]}
                disabled={isEdit || isSave}
                options={sourcesList}
                popupContent={
                  <SearchableList
                    label="Select a source name"
                    isNotTypeAhead
                    options={sourcesList}
                    onSelect={onSourceChange}
                    selectedValue={values[fields.sourceId]}
                    isRadio
                  />
                }
                validate={(value) => {
                  return [undefined, null, ""].includes(value)
                    ? "PL529 : Required"
                    : undefined;
                }}
                component={FieldDropSide}
                dropdownClassName="auto-grow-dropdown"
              />
              {values[fields.sourceEnrollmentId] !== "" && (
                <>
                  <Field
                    name={fields.entryDateRule}
                    label="Source entry date is"
                    value={values[fields.entryDateRule]}
                    isRequired
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.ENROLLMENT_PLAN_ENTRYDATE
                    )}
                    popupContent={
                      <SearchableList
                        isRadio
                        isNotTypeAhead
                        label="Select a Source Entry Date"
                        selectedValue={values[fields.entryDateRule]}
                        options={toOptionValuesFromMapper(
                          OPTIONS_DATA_MAPPER.ENROLLMENT_PLAN_ENTRYDATE
                        )}
                        onSelect={(value) => {
                          setFieldValue(fields.entryDateRule, value);
                          //To empty these fields when immediate

                          value == 6 &&
                            setFieldValue(
                              fields.prospectiveOrRetrospective,
                              null
                            );
                          setFieldValue(fields.isCoincidingApplicable, null);

                          value == 7 &&
                            setFieldValue(
                              fields.prospectiveOrRetrospective,
                              null
                            );

                          value != 7 &&
                            setFieldValue(
                              fields.sourceEnrollmentOtherEntryDates,
                              []
                            );
                          setDates([{ month: null, day: null }]);
                          setFieldValue(fields.otherDescription, null);
                        }}
                      />
                    }
                    dropdownClassName="auto-grow-dropdown"
                    disabled={isEdit && !isSave}
                    component={FieldDropSide}
                    validate={(value) => {
                      return [undefined, null, ""].includes(value)
                        ? "PL530 : Required"
                        : undefined;
                    }}
                  />
                  {values[fields.entryDateRule] === 7 && (
                    <>
                      {/* <Field
                        name={fields.otherDescription}
                        isRequired
                        label="Other Description"
                        autoComplete="off"
                        value={values[fields.otherDescription]}
                        onChange={handleChange}
                        disabled={isEdit}
                        component={FieldTextarea}
                        size="lg"
                        validate={required}
                      /> */}

                      <div className="small mb-1">{"Other Entry date"}</div>
                      {dates.map((x, i) => {
                        return (
                          <>
                            <Row>
                              {i == 0 && (
                                <>
                                  <Col md="2">
                                    <div style={mystyle}>{"Month"}</div>
                                  </Col>
                                  <Col md="2">
                                    <div style={mystyle}>{"Day"}</div>
                                  </Col>
                                </>
                              )}
                            </Row>
                            <Row>
                              <Col md="2">
                                <Field
                                  isRequired
                                  name={`month${i}`}
                                  {...rest}
                                  size="sm"
                                  placeholder="Month"
                                  value={x.month}
                                  options={months.data}
                                  disabled={isEdit && !isSave}
                                  popupContent={
                                    <SearchableList
                                      label="Select a month"
                                      isNotTypeAhead
                                      options={months.data}
                                      onSelect={(value) => {
                                        handleInputChange("month", value, i);
                                      }}
                                      selectedValue={x.month}
                                    />
                                  }
                                  component={FieldDropSide}
                                  validate={(value) => {
                                    return [undefined, null, ""].includes(
                                      x.month
                                    )
                                      ? "PL537 : Required"
                                      : undefined;
                                  }}
                                />
                              </Col>
                              <Col md="2">
                                <Field
                                  name={`day${i}`}
                                  {...rest}
                                  size="xs"
                                  placeholder="Date"
                                  isRequired
                                  value={x.day}
                                  disabled={isEdit && !isSave}
                                  popupContent={
                                    <DayDropdown
                                      fromMonthDate={
                                        new Date(2019, x.month - 1 || 0)
                                      }
                                      onSelect={(value) => {
                                        handleInputChange("day", value, i);
                                      }}
                                      value={x.day}
                                    />
                                  }
                                  component={FieldDropSide}
                                  validate={(value) => {
                                    return [undefined, null, ""].includes(x.day)
                                      ? "PL631 : Required"
                                      : undefined;
                                  }}
                                />
                              </Col>
                              <Col md="1">
                                {dates.length - 1 === i && (
                                  <Button
                                    variant="link"
                                    style={{ marginLeft: "5px" }}
                                    disabled={
                                      isEdit ||
                                      x.month === null ||
                                      x.day === null
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faPlus}
                                      color="#212529"
                                      style={{
                                        fontSize: "1.4rem",
                                        color: "#3a3974",
                                        marginLeft: "5px",
                                      }}
                                      onClick={() => handleAddClick(i)}
                                    />
                                  </Button>
                                )}
                              </Col>
                              <Col md="1">
                                {dates.length !== 1 && (
                                  <>
                                    <Button
                                      variant="link"
                                      disabled={isEdit && !isSave}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        color="#212529"
                                        style={{
                                          fontSize: "1.2rem",
                                          color: "red",
                                          marginLeft: "5px",
                                        }}
                                        onClick={() => handleRemoveClick(i)}
                                      />
                                    </Button>
                                  </>
                                )}
                              </Col>
                            </Row>
                          </>
                        );
                      })}
                    </>
                  )}

                  {values[fields.entryDateRule] != 6 &&
                    values[fields.entryDateRule] != 7 && (
                      <>
                        <Field
                          name={fields.prospectiveOrRetrospective}
                          label="Prospective / Retrospective criteria is"
                          value={values[fields.prospectiveOrRetrospective]}
                          isRequired
                          options={toOptionValuesFromMapper(
                            OPTIONS_DATA_MAPPER.ENROLLMENT_PROSPECTIVEORRETROSPECTIVE
                          )}
                          popupContent={
                            <SearchableList
                              isRadio
                              isNotTypeAhead
                              label="Select a Prospective/Retrospective"
                              selectedValue={
                                values[fields.prospectiveOrRetrospective]
                              }
                              options={toOptionValuesFromMapper(
                                OPTIONS_DATA_MAPPER.ENROLLMENT_PROSPECTIVEORRETROSPECTIVE
                              )}
                              onSelect={(value) => {
                                setFieldValue(
                                  fields.prospectiveOrRetrospective,
                                  value
                                );
                                value == 3 &&
                                  setFieldValue(
                                    fields.isCoincidingApplicable,
                                    null
                                  );
                              }}
                            />
                          }
                          dropdownClassName="auto-grow-dropdown"
                          disabled={isEdit && !isSave}
                          component={FieldDropSide}
                          validate={(value) => {
                            return [undefined, null, ""].includes(value)
                              ? "PL532 : Required"
                              : undefined;
                          }}
                        />
                        {values[fields.prospectiveOrRetrospective] != 3 ? (
                          <>
                            <Field
                              size="sm"
                              name={fields.isCoincidingApplicable}
                              label={`Is "coinciding with" applicable?`}
                              isRequired
                              options={yesNoOptions}
                              selectedValue={
                                values[fields.isCoincidingApplicable]
                              }
                              value={values[fields.isCoincidingApplicable]}
                              onChange={(value) =>
                                setFieldValue(
                                  fields.isCoincidingApplicable,
                                  value
                                )
                              }
                              validate={(value) => {
                                return [undefined, null, ""].includes(value)
                                  ? "PL533 : Required"
                                  : undefined;
                              }}
                              component={FieldButtonGroup}
                              disabled={isEdit && !isSave}
                            />
                          </>
                        ) : null}
                      </>
                    )}
                </>
              )}
              <Field
                isRequired
                size="sm"
                name={fields.isSwitchToPlanYearHaveDifferentEntryDates}
                label={`Does "switch to plan year" have different entry dates?`}
                options={yesNoOptions}
                selectedValue={
                  values[fields.isSwitchToPlanYearHaveDifferentEntryDates]
                }
                value={values[fields.isSwitchToPlanYearHaveDifferentEntryDates]}
                onChange={onEmployerSourceEntryDateChange}
                component={FieldButtonGroup}
                validate={(value) => {
                  return [undefined, null, ""].includes(value)
                    ? "PL536 : Required"
                    : undefined;
                }}
                disabled={isEdit && !isSave}
              />
              {values[fields.isSwitchToPlanYearHaveDifferentEntryDates] && (
                <>
                  <Field
                    name={fields.additionalEntryDateRule}
                    label={`"Switch to plan year" entry date`}
                    value={values[fields.additionalEntryDateRule]}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.ENROLLMENT_PLAN_ENTRYDATE
                    )}
                    popupContent={
                      <SearchableList
                        isRadio
                        isNotTypeAhead
                        label="Select an plan year entry date"
                        selectedValue={values[fields.additionalEntryDateRule]}
                        options={toOptionValuesFromMapper(
                          OPTIONS_DATA_MAPPER.ENROLLMENT_PLAN_ENTRYDATE
                        )}
                        onSelect={(value) => {
                          setFieldValue(fields.additionalEntryDateRule, value);
                          value == 6 &&
                            setFieldValue(
                              fields.additionalProspectiveOrRetrospective,
                              null
                            );
                          setFieldValue(
                            fields.isCoincidingApplicableForAdditional,
                            null
                          );

                          value == 7 &&
                            setFieldValue(
                              fields.additionalProspectiveOrRetrospective,
                              null
                            );

                          value != 7 &&
                            setFieldValue(
                              fields.additionalSourceEnrollmentOtherDates,
                              []
                            );
                          setAdditionalDates([{ month: null, day: null }]);
                          setFieldValue(
                            fields.additionalOtherDescription,
                            null
                          );
                        }}
                      />
                    }
                    isRequired
                    dropdownClassName="auto-grow-dropdown"
                    disabled={isEdit && !isSave}
                    component={FieldDropSide}
                    validate={(value) => {
                      return [undefined, null, ""].includes(value)
                        ? "PL531 : Required"
                        : undefined;
                    }}
                  />
                  {values[fields.additionalEntryDateRule] === 7 && (
                    <>
                      {/* <Field
                        name={fields.additionalOtherDescription}
                        isRequired
                        label="Other Description"
                        autoComplete="off"
                        value={values[fields.additionalOtherDescription]}
                        onChange={handleChange}
                        disabled={isEdit}
                        component={FieldTextarea}
                        size="lg"
                        validate={required}
                      /> */}

                      <div className="small mb-1">
                        {`"Switch to plan year" other entry date`}
                      </div>
                      {additionalDates.map((x, i) => {
                        return (
                          <>
                            <Row>
                              {i == 0 && (
                                <>
                                  <Col md="2">
                                    <div style={mystyle}>{"Month"}</div>
                                  </Col>
                                  <Col md="2">
                                    <div style={mystyle}>{"Day"}</div>
                                  </Col>
                                </>
                              )}
                            </Row>
                            <Row>
                              <Col md="2">
                                <Field
                                  isRequired
                                  name={`addMonth${i}`}
                                  {...rest}
                                  size="sm"
                                  placeholder="Month"
                                  value={x.month}
                                  options={months.data}
                                  disabled={isEdit && !isSave}
                                  popupContent={
                                    <SearchableList
                                      label="Select a month"
                                      isNotTypeAhead
                                      options={months.data}
                                      onSelect={(value) => {
                                        handleInputChange1("month", value, i);
                                      }}
                                      selectedValue={x.month}
                                    />
                                  }
                                  component={FieldDropSide}
                                  validate={(value) => {
                                    return [undefined, null, ""].includes(
                                      x.month
                                    )
                                      ? "PL539 : Required"
                                      : undefined;
                                  }}
                                />
                              </Col>
                              <Col md="2">
                                <Field
                                  name={`addDay${i}`}
                                  {...rest}
                                  size="xs"
                                  placeholder="Date"
                                  isRequired
                                  value={x.day}
                                  disabled={isEdit && !isSave}
                                  popupContent={
                                    <DayDropdown
                                      fromMonthDate={
                                        new Date(2019, x.month - 1 || 0)
                                      }
                                      onSelect={(value) => {
                                        handleInputChange1("day", value, i);
                                      }}
                                      value={x.day}
                                    />
                                  }
                                  component={FieldDropSide}
                                  validate={(value) => {
                                    return [undefined, null, ""].includes(x.day)
                                      ? "PL632 : Required"
                                      : undefined;
                                  }}
                                />
                              </Col>
                              <Col md="1">
                                {additionalDates.length - 1 === i && (
                                  <Button
                                    variant="link"
                                    style={{ marginLeft: "5px" }}
                                    disabled={
                                      isEdit ||
                                      x.month === null ||
                                      x.day === null
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faPlus}
                                      color="#212529"
                                      style={{
                                        fontSize: "1.4rem",
                                        color: "#3a3974",
                                        marginLeft: "5px",
                                      }}
                                      onClick={() => handleAdd(i)}
                                    />
                                  </Button>
                                )}
                              </Col>
                              <Col md="1">
                                {additionalDates.length !== 1 && (
                                  <>
                                    <Button
                                      variant="link"
                                      disabled={isEdit && !isSave}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        color="#212529"
                                        style={{
                                          fontSize: "1.2rem",
                                          color: "red",
                                          marginLeft: "5px",
                                        }}
                                        onClick={() => handleRemove(i)}
                                      />
                                    </Button>
                                  </>
                                )}
                              </Col>
                            </Row>
                          </>
                        );
                      })}
                    </>
                  )}
                  {values[fields.additionalEntryDateRule] != 6 &&
                    values[fields.additionalEntryDateRule] != 7 && (
                      <>
                        <Field
                          name={fields.additionalProspectiveOrRetrospective}
                          label="Prospective / Retrospective criteria is"
                          value={
                            values[fields.additionalProspectiveOrRetrospective]
                          }
                          isRequired
                          options={toOptionValuesFromMapper(
                            OPTIONS_DATA_MAPPER.ENROLLMENT_PROSPECTIVEORRETROSPECTIVE
                          )}
                          popupContent={
                            <SearchableList
                              isRadio
                              isNotTypeAhead
                              label="Select a Prospective/Retrospective"
                              selectedValue={
                                values[
                                  fields.additionalProspectiveOrRetrospective
                                ]
                              }
                              options={toOptionValuesFromMapper(
                                OPTIONS_DATA_MAPPER.ENROLLMENT_PROSPECTIVEORRETROSPECTIVE
                              )}
                              onSelect={(value) => {
                                setFieldValue(
                                  fields.additionalProspectiveOrRetrospective,
                                  value
                                );
                                value == 3 &&
                                  setFieldValue(
                                    fields.isCoincidingApplicableForAdditional,
                                    null
                                  );
                              }}
                            />
                          }
                          dropdownClassName="auto-grow-dropdown"
                          //dropdownClassName="auto-grow-dropdown enrollment-dropdown"
                          disabled={isEdit && !isSave}
                          component={FieldDropSide}
                          validate={(value) => {
                            return [undefined, null, ""].includes(value)
                              ? "PL534 : Required"
                              : undefined;
                          }}
                        />
                        {values[fields.additionalProspectiveOrRetrospective] !=
                          3 && (
                          <>
                            <Field
                              size="sm"
                              name={fields.isCoincidingApplicableForAdditional}
                              label={`Is "coinciding with" applicable?`}
                              isRequired
                              options={yesNoOptions}
                              selectedValue={
                                values[
                                  fields.isCoincidingApplicableForAdditional
                                ]
                              }
                              value={
                                values[
                                  fields.isCoincidingApplicableForAdditional
                                ]
                              }
                              onChange={(value) =>
                                setFieldValue(
                                  fields.isCoincidingApplicableForAdditional,
                                  value
                                )
                              }
                              validate={(value) => {
                                return [undefined, null, ""].includes(value)
                                  ? "PL535 : Required"
                                  : undefined;
                              }}
                              component={FieldButtonGroup}
                              disabled={isEdit && !isSave}
                            />
                          </>
                        )}
                      </>
                    )}
                </>
              )}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SourceEnrollmentContainer;
