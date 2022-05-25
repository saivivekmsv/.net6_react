import React, { useContext, useEffect, useState } from "react";
import { forEach, get, isEmpty } from "lodash";
import { Row, Col, Form, Button } from "react-bootstrap";
import {
  faPencilAlt,
  faTrashAlt,
  faTimes,
  faPlus,
} from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldDropSide,
  FieldButtonGroup,
  AddButton,
  CsplTable as Table,
  SearchableList,
  AddPlans,
  Link,
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
  getNullTableItem,
  getAdvancedPathWithParam,
  ROUTES,
  usDateFormat,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  setManagePlanFlow,
  setManagePageLevelData,
  savePlanDetailsAction,
  setManagePlanLocalCache,
} from "../../../contexts";
import { useRouterParams, useDeepEffect } from "../../../abstracts";
import months from "../../../mocks/months.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const columns = [
  // {
  //   label: "",
  //   className: "",
  //   columnName: "sourceId",
  // },
  {
    label: "Source Enrollment Name",
    className: "column-employee-classification-name",
    columnName: "sourceId",
    link: "MANAGE_PLAN_ROUTES.SOURCE_ENROLLMENT",
  },
];

const EntrydateContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const [isAddSourceEntryDateError, setIsAddSourceEntryDateError] = useState(
    false
  );
  const [addSourceEntryDateError, setAddSourceEntryDateError] = useState("");
  const { planId, flow } = useRouterParams();
  const formName = managePlanFormNames.ADD_ENROLLMENT;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const enrollmentEffectiveDateRuleApiData = get(
    apiData,
    "enrollmentEffectiveDateRule",
    {}
  );
  const formValues = get(state, "enrollmentEffectiveDateRule", {});
  const sourceEnrollmentRulesData = get(
    formValues,
    "sourceEnrollmentRules",
    []
  );
  var otherEntryDates = get(formValues, "otherEntryDates", [
    { month: 0, day: 0 },
  ]);

  const entryDate = get(formValues, "entryDateRule");

  const additionalEntryDate = get(formValues, "additionalEntryDateRule");
  const [dates, setDates] = useState(otherEntryDates);
  var additionalOtherEntryDates = get(formValues, "additionalOtherEntryDates", [
    { month: 0, day: 0 },
  ]);
  const [additionalDates, setAdditionalDates] = useState(
    additionalOtherEntryDates
  );
  const isDataEmpty = get(apiData, "enrollmentEffectiveDateRule", {});
  useEffect(() => {
    if (isDataEmpty != null) {
      if (!isEmpty(otherEntryDates) && entryDate == 7) {
        if (dates[0].month == null) setDates(otherEntryDates);
      }

      if (!isEmpty(additionalOtherEntryDates) && additionalEntryDate == 7) {
        if (additionalDates[0].month == null)
          setAdditionalDates(additionalOtherEntryDates);
      }
    }
  });

  useDeepEffect(() => {
    setDates(otherEntryDates);
  }, [otherEntryDates]);

  const sourcesList = get(apiData, "sources", []);
  const initialValues = {
    // [fields.entryDateRule]: 6,
    [fields.isSwitchToPlanYearHaveDifferentEntryDates]: false,
    [fields.isAllSourcesFollowSameEntryDates]: true,
  };

  useDeepEffect(() => {
    if (isEmpty(formValues)) {
      dispatch(
        setManagePlanLocalCache({
          model: "enrollmentEffectiveDateRule",
          data: enrollmentEffectiveDateRuleApiData,
        })
      );
    }
  }, [enrollmentEffectiveDateRuleApiData]);

  const buttons = [
    {
      // link: getAdvancedPathWithParam({
      //   path: MANAGE_PLAN_ROUTES.ENTRYDATE,
      //   pathParam: [FLOW_TYPES.EDIT, planId],
      // }),
      link: ROUTES.PLAN,
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: ROUTES.PLAN,
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ENTRYDATE,
            pathParam: [FLOW_TYPES.SAVE, planId],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];
  const mystyle = { fontWeight: 500, fontSize: ".74rem", marginBottom: "7px" };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    if (
      values[fields.isAllSourcesFollowSameEntryDates] === true &&
      !isEmpty(sourceEnrollmentRulesData)
    ) {
      values.sourceEnrollmentRules = [];
    } else if (
      values[fields.isAllSourcesFollowSameEntryDates] === false &&
      !isEmpty(sourceEnrollmentRulesData)
    ) {
      values.sourceEnrollmentRules = sourceEnrollmentRulesData;
    }
    savePlanDetailsAction(
      {
        enrollmentEffectiveDateRule: {
          ...values,
        },
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        //const newPlanId = get(response, "id");
        dispatch(
          setManagePlanFlow({
            planId: planId,
          })
        );
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        dispatch(
          setManagePlanLocalCache({
            model: "enrollmentEffectiveDateRule",
            data: values,
          })
        );
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ENTRYDATE,
            pathParam: [FLOW_TYPES.EDIT, planId],
          })
        );
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
      } else {
        setSubmitting(false);
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
          if (_.controlName === "sourceEntryDate") {
            setIsAddSourceEntryDateError(true);
            setAddSourceEntryDateError(`${_.errorCode} : ${_.message}`);
          }
        }
      }
    });
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
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
        setSubmitting,
        ...rest
      }) => {
        const onIsDifferentEntryDateChange = (value) => {
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

        const addSourceAllocationClick = () => {
          setSubmitting(true);
          dispatch(
            setManagePlanLocalCache({
              model: "enrollmentEffectiveDateRule",
              data: { ...formValues, ...values },
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: MANAGE_PLAN_ROUTES.SOURCE_ENROLLMENT,
                pathParam: [FLOW_TYPES.ADD, planId], // put the company id after crated
              })
            );
          }, 10);
        };

        const editSourceAllocationClick = (item, index) => {
          setSubmitting(true);
          dispatch(
            setManagePlanLocalCache({
              model: "enrollmentEffectiveDateRule",
              data: { ...formValues, ...values },
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: MANAGE_PLAN_ROUTES.SOURCE_ENROLLMENT,
                pathParam: [FLOW_TYPES.EDIT, planId, index], // put the company id after crated
              })
            );
          }, 10);
        };

        const handleAddClick = (i) => {
          setDates([...dates, { month: 0, day: 0 }]);
        };

        const handleAdd = (i) => {
          setAdditionalDates([...additionalDates, { month: 0, day: 0 }]);
        };

        const handleRemoveClick = (i) => {
          const list = [...dates];
          //const list1 = list.filter((_, index) => index != i);
          list.splice(i, 1);
          setDates(list);
          setFieldValue(fields.otherEntryDates, list);
        };
        const handleRemove = (i) => {
          const list = [...additionalDates];
          list.splice(i, 1);
          setAdditionalDates(list);
          setFieldValue(fields.additionalOtherEntryDates, list);
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
          setFieldValue(fields.otherEntryDates, dates);
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
          setFieldValue(fields.additionalOtherEntryDates, additionalDates);
        };

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <div className="plan-sub-heading mt-0">
                Plan Entry Date Information
              </div>
              <Field
                name={fields.entryDateRule}
                label="Plan entry date is"
                //value={values[fields.entryDateRule]}
                isRequired
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.ENROLLMENT_PLAN_ENTRYDATE
                )}
                popupContent={
                  <SearchableList
                    isRadio
                    isNotTypeAhead
                    label="Select a Entry Date"
                    selectedValue={values[fields.entryDateRule]}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.ENROLLMENT_PLAN_ENTRYDATE
                    )}
                    onSelect={(value) => {
                      setFieldValue(fields.entryDateRule, value);
                      //To empty these fields when immediate
                      value == 6 &&
                        setFieldValue(fields.prospectiveOrRetrospective, null);
                      setFieldValue(fields.isCoincidingApplicable, null);

                      value == 7 &&
                        setFieldValue(fields.prospectiveOrRetrospective, null);

                      value != 7 && setFieldValue(fields.otherEntryDates, []);
                      setDates([{ month: 0, day: 0 }]);
                      setFieldValue(fields.otherDescription, null);
                    }}
                  />
                }
                dropdownClassName="auto-grow-dropdown"
                disabled={isEdit && !isSave}
                component={FieldDropSide}
              />
              {values[fields.entryDateRule] === 7 && (
                <>
                  <Field
                    name={fields.otherDescription}
                    isRequired
                    label="Other Description"
                    autoComplete="off"
                    value={values[fields.otherDescription]}
                    onChange={handleChange}
                    disabled={isEdit}
                    component={FieldTextarea}
                    size="lg"
                  />
                  <div className="small mb-1">{"Other Entry date"}</div>
                  {dates.map((x, i) => {
                    console.log(dates);
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
                              key={i}
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
                            />
                          </Col>
                          <Col md="2">
                            <Field
                              name={`day${i}`}
                              key={i}
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
                            />
                          </Col>
                          <Col md="1">
                            {dates.length - 1 === i && (
                              <Button
                                variant="link"
                                style={{ marginLeft: "5px" }}
                                disabled={
                                  isEdit || x.month === 0 || x.day === 0
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
                      //dropdownClassName="auto-grow-dropdown enrollment-dropdown"
                      disabled={isEdit && !isSave}
                      component={FieldDropSide}
                    />
                    {values[fields.prospectiveOrRetrospective] != 3 ? (
                      <>
                        <Field
                          size="sm"
                          name={fields.isCoincidingApplicable}
                          label={`Is "coinciding with" applicable?`}
                          isRequired
                          options={yesNoOptions}
                          selectedValue={values[fields.isCoincidingApplicable]}
                          value={values[fields.isCoincidingApplicable]}
                          onChange={(value) =>
                            setFieldValue(fields.isCoincidingApplicable, value)
                          }
                          component={FieldButtonGroup}
                          disabled={isEdit && !isSave}
                        />
                      </>
                    ) : null}
                  </>
                )}

              <Field
                size="sm"
                isRequired
                name={fields.isSwitchToPlanYearHaveDifferentEntryDates}
                label={`Does "switch to plan year" have different entry dates?`}
                options={yesNoOptions}
                selectedValue={
                  values[fields.isSwitchToPlanYearHaveDifferentEntryDates]
                }
                value={values[fields.isSwitchToPlanYearHaveDifferentEntryDates]}
                onChange={onIsDifferentEntryDateChange}
                component={FieldButtonGroup}
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
                            setFieldValue(fields.additionalOtherEntryDates, []);
                          setAdditionalDates([{ month: 0, day: 0 }]);
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
                  />
                  {values[fields.additionalEntryDateRule] === 7 && (
                    <>
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
                                />
                              </Col>
                              <Col md="1">
                                {additionalDates.length - 1 === i && (
                                  <Button
                                    variant="link"
                                    style={{ marginLeft: "5px" }}
                                    disabled={
                                      isEdit || x.month === 0 || x.day === 0
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
                              component={FieldButtonGroup}
                              disabled={isEdit && !isSave}
                            />
                          </>
                        )}
                      </>
                    )}
                </>
              )}

              <Field
                size="sm"
                isRequired
                name={fields.isAllSourcesFollowSameEntryDates}
                label={"Do all sources follow the same entry date?"}
                options={yesNoOptions}
                selectedValue={values[fields.isAllSourcesFollowSameEntryDates]}
                value={values[fields.isAllSourcesFollowSameEntryDates]}
                onChange={(value) => {
                  setFieldValue(fields.isAllSourcesFollowSameEntryDates, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />

              {/* {values[fields.isAllSourcesFollowSameEntryDates] == true &&
                isEmpty(sourcesList) && (
                  <div className="small text-danger">
                    No sources available in the plan
                  </div>
                )} */}
              <br />
              {values[fields.isAllSourcesFollowSameEntryDates] === false && (
                <div className="w-100">
                  <div className="d-flex justify-content-between mb-4">
                    <div>
                      <div className="m-0 plan-sub-heading">
                        Source Entry Date Information
                      </div>
                    </div>
                    <div>
                      <AddButton
                        onAddClick={addSourceAllocationClick}
                        disabled={isEdit && !isSave}
                      />
                    </div>
                  </div>
                  {isEmpty(sourceEnrollmentRulesData) && (
                    <AddPlans
                      content="No source entry date has been created"
                      buttonLabel="ADD SOURCE ENTRY DATE"
                      onPrimaryClick={addSourceAllocationClick}
                      disabled={isEdit && !isSave}
                      showError={isAddSourceEntryDateError}
                      errorMessage={addSourceEntryDateError}
                    />
                  )}
                  {!isEmpty(sourceEnrollmentRulesData) && (
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          {columns.map((item, index) => {
                            return (
                              <Table.Th key={index} className={item.className}>
                                {item.label}
                              </Table.Th>
                            );
                          })}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {sourceEnrollmentRulesData.map((source, index) => {
                          return (
                            <Table.Tr key={index}>
                              {columns.map((item, cellIndex) => {
                                return (
                                  <Table.Td
                                    key={cellIndex}
                                    className={item.className}
                                  >
                                    {!isEmpty(item.link) ? (
                                      <Link
                                        onClick={() =>
                                          editSourceAllocationClick(item, index)
                                        }
                                      >
                                        {
                                          sourcesList.find(
                                            (s) =>
                                              s.id === source[item.columnName]
                                          ).sourceName
                                        }
                                      </Link>
                                    ) : item.dataMapper ? (
                                      item.dataMapper[source[item.columnName]]
                                    ) : (
                                      getNullTableItem(source[item.columnName])
                                    )}
                                  </Table.Td>
                                );
                              })}
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  )}
                </div>
              )}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EntrydateContainer;
