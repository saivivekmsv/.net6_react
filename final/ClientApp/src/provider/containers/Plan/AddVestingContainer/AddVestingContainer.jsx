import React, { useContext, useState } from "react";
import { get, isEmpty, union } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldInput,
  FieldButtonGroup,
  FieldTextarea,
  FieldDropSide,
  SearchableList,
  AddPlans,
  AddButton,
  Link,
  CsplTable as Table,
  FieldInputNumber,
} from "../../../components";
import {
  ROUTES,
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  yesNoOptions,
  required,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  getNumber,
} from "../../../utils";
import {
  createPlanStore,
  savePlanDetailsAction,
  setManagePlanLocalCache,
  setManagePlanToastInfo,
  setManagePageLevelData,
  setManagePlanFlow,
} from "../../../contexts";
import { useDeepEffect, useRouterParams } from "../../../abstracts";
import excludedYears from "../../../mocks/vestingExcludedYear.json";
import timingForfeitures from "../../../mocks/vestingTimingForfeitures.json";
import defaultInvestments from "../../../mocks/vestingDefaultInvestments.json";
import CommonVestingRules from "./CommonVestingRules";

const initialValues = {};

const columns = [
  {
    label: "Description",
    className: "column-addtional-vesting-description",
    columnName: "description",
    link: MANAGE_PLAN_ROUTES.ADD_VESTING_RULE,
  },
];

const AddVestingContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, vestingId } = useRouterParams();
  const formName = managePlanFormNames.ADD_VESTING;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const vestingsApiData = get(apiData, "vestings", []);
  const vestingsListData = get(state, "vestings", []);
  const investmentsList = get(state, "api.data.investments", []).map(
    (investment) => {
      return {
        value: investment.id,
        label: investment.name,
      };
    }
  );
  const formValues = get(vestingsListData, vestingId, {});
  const intVestingId = parseInt(get(formValues, "id"), 10);
  const additionalVestingsData = get(formValues, "additionalVestings", []);
  const [newFlow, setNewFlow] = useState(flow);
  useDeepEffect(() => {
    if (isEmpty(formValues)) {
      dispatch(
        setManagePlanLocalCache({
          model: "vestings",
          data: vestingsApiData,
        })
      );
    }
  }, [vestingsApiData]);

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.VESTING,
        pathParam: [flow, planId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
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
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.VESTING,
        pathParam: [flow, planId],
      }),
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () => setNewFlow(FLOW_TYPES.SAVE),
    },
  ];

  const getDataForSave = (values) => {
    const updatedValues = {
      ...formValues,
      ...values,
      id: intVestingId || undefined,
      description: values[fields.vestingDescription],
      name: values[fields.vestingName] || undefined,
      method: values[fields.vestingMethod] || undefined,
      schedule: values[fields.vestingSchedule] || undefined,
      hoursOfService: getNumber(values[fields.hoursOfService]),
      vestingScheduleTable:
        values[fields.vestingSchedule] === 7
          ? {
              [fields.firstYear]: parseFloat(values[fields.firstYear]),
              [fields.secondYear]: parseFloat(values[fields.secondYear]),
              [fields.thirdYear]: parseFloat(values[fields.thirdYear]),
              [fields.fourthYear]: parseFloat(values[fields.fourthYear]),
              [fields.fifthYear]: parseFloat(values[fields.fifthYear]),
              sixthYear: 100,
            }
          : undefined,
      [fields.disregardYearsOfServiceAfterHowManyBreakInService]: getNumber(
        values[fields.disregardYearsOfServiceAfterHowManyBreakInService]
      ),
      [fields.freezeVestingPercentageAfterHowManyBreakInService]: getNumber(
        values[fields.freezeVestingPercentageAfterHowManyBreakInService]
      ),
    };
    if (isEmpty(formValues)) {
      return [...vestingsListData, updatedValues];
    }

    return vestingsListData.map((item, index) => {
      if (index === parseInt(vestingId)) {
        return { ...item, ...updatedValues };
      }
      return item;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    savePlanDetailsAction(
      {
        vestings: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
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
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.VESTING,
            pathParam: [flow, planId], // put the company id after crated
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
        [fields.vestingDescription]: get(formValues, "description"),
        [fields.yearsOfServiceExcludedIndicator]: false,
        [fields.immediateVestingIndicator]: true,
        [fields.breakInServiceApplicable]: false,
        ...formValues,
        [fields.vestingName]: get(formValues, "name"),
        [fields.vestingMethod]: get(formValues, "method"),
        [fields.vestingSchedule]: get(formValues, "schedule"),
        [fields.firstYear]: get(formValues, "vestingScheduleTable.firstYear"),
        [fields.secondYear]: get(formValues, "vestingScheduleTable.secondYear"),
        [fields.thirdYear]: get(formValues, "vestingScheduleTable.thirdYear"),
        [fields.fourthYear]: get(formValues, "vestingScheduleTable.fourthYear"),
        [fields.fifthYear]: get(formValues, "vestingScheduleTable.fifthYear"),
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
        setSubmitting,
        values,
        ...rest
      }) => {
        const addVestingRuleClick = () => {
          setSubmitting(true);
          const updatedData = getDataForSave(values);
          const newVestingId =
            vestingId === undefined ? vestingId + 1 : vestingId;
          dispatch(
            setManagePlanLocalCache({
              model: "vestings",
              data: updatedData,
            })
          );
          window.setTimeout(
            () =>
              history.push(
                getPathWithParam({
                  path: MANAGE_PLAN_ROUTES.ADD_VESTING_RULE,
                  pathParam: [
                    FLOW_TYPES.ADD,
                    planId,
                    newVestingId,
                    additionalVestingsData.length,
                  ], // put the company id after crated
                })
              ),
            10
          );
        };

        const editVestingRuleClick = (item, index) => {
          setSubmitting(true);
          const updatedData = getDataForSave(values);
          dispatch(
            setManagePlanLocalCache({
              model: "vestings",
              data: updatedData,
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: item.link,
                pathParam: [FLOW_TYPES.EDIT, planId, vestingId, index], // put the company id after crated
              })
            );
          }, 10);
        };
        const immediateVestingIndicator =
          values[fields.immediateVestingIndicator];
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <p className="plan-sub-heading">Vesting Details</p>
              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    name={fields.vestingName}
                    label={"Vesting Name"}
                    value={values[fields.vestingName]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                    isRequired
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <Field
                    name={fields.vestingDescription}
                    label="Vesting Description"
                    autoComplete="off"
                    value={values[fields.vestingDescription]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldTextarea}
                    size="lg"
                  />
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <Field
                    size="sm"
                    name={fields.yearsOfServiceExcludedIndicator}
                    label={"Years of Service Excluded?"}
                    options={yesNoOptions}
                    selectedValue={
                      values[fields.yearsOfServiceExcludedIndicator]
                    }
                    type="text"
                    autoComplete="off"
                    value={values[fields.yearsOfServiceExcludedIndicator]}
                    onChange={(value) => {
                      setValues({
                        ...values,
                        [fields.yearsOfServiceExcludedIndicator]: value,
                      });
                    }}
                    isRequired
                    component={FieldButtonGroup}
                    disabled={isEdit && !isSave}
                  />
                </Col>
              </Row>

              {values[fields.yearsOfServiceExcludedIndicator] === true ? (
                <Row>
                  <Col md="4">
                    <Field
                      size="md"
                      label="Excluded Years"
                      name={fields.excludedYears}
                      value={values[fields.excludedYears]}
                      options={excludedYears.data}
                      disabled={isEdit && !isSave}
                      popupContent={
                        <SearchableList
                          label="Select Excluded Years definition"
                          isNotTypeAhead
                          options={excludedYears.data}
                          onSelect={(value) =>
                            setFieldValue(fields.excludedYears, value)
                          }
                          selectedValue={values[fields.excludedYears]}
                          isRadio
                        />
                      }
                      isRequired
                      component={FieldDropSide}
                    />
                  </Col>
                </Row>
              ) : null}

              <p className="py-3 plan-sub-heading">Default Vesting Rule</p>
              <CommonVestingRules
                fields={fields}
                isEdit={isEdit}
                isSave={isSave}
              />
              {immediateVestingIndicator === false && (
                <>
                  <h4 className="ft-20 py-3">Break In Service & Termination</h4>
                  <Field
                    size="sm"
                    name={fields.breakInServiceApplicable}
                    label={"Years of Service Applicable?"}
                    options={yesNoOptions}
                    selectedValue={values[fields.breakInServiceApplicable]}
                    value={values[fields.breakInServiceApplicable]}
                    onChange={(value) => {
                      setValues({
                        ...values,
                        [fields.breakInServiceApplicable]: value,
                        [fields.breakInServiceRules]: null,
                      });
                    }}
                    component={FieldButtonGroup}
                    disabled={isEdit && !isSave}
                    isRequired
                  />
                  {values[fields.breakInServiceApplicable] === true && (
                    <>
                      <Field
                        size="xs"
                        name={fields.hours}
                        label={"Break in service Definition"}
                        value={values[fields.hours]}
                        type="number"
                        onChange={handleChange}
                        hasSuggestion
                        suggestionDefaultText="Hours"
                        disabled={isEdit && !isSave}
                        component={FieldInputNumber}
                        min={0}
                        max={9999}
                        isRequired
                      />
                      <Field
                        size="md"
                        name={fields.breakInServiceRules}
                        label={"Break in Service Rules"}
                        options={toOptionValuesFromMapper(
                          OPTIONS_DATA_MAPPER.BASIC_SERVER_RULES
                        )}
                        selectedValue={values[fields.breakInServiceRules]}
                        value={values[fields.breakInServiceRules]}
                        onChange={(value) => {
                          setValues({
                            ...values,
                            [fields.breakInServiceRules]: value,
                          });
                        }}
                        component={FieldButtonGroup}
                        disabled={isEdit && !isSave}
                        isRequired
                      />
                    </>
                  )}
                  {values[fields.breakInServiceRules] === 2 && (
                    <Field
                      size="sm"
                      name={
                        fields.disregardYearsOfServiceAfterHowManyBreakInService
                      }
                      label={
                        "Disregard prior service after how many consecutive breaks in service"
                      }
                      value={
                        values[
                          fields
                            .disregardYearsOfServiceAfterHowManyBreakInService
                        ]
                      }
                      type="number"
                      onChange={handleChange}
                      disabled={isEdit && !isSave}
                      component={FieldInputNumber}
                      min={0}
                      max={99}
                      isRequired
                    />
                  )}
                  {values[fields.breakInServiceRules] === 3 && (
                    <Field
                      size="sm"
                      name={
                        fields.freezeVestingPercentageAfterHowManyBreakInService
                      }
                      type="number"
                      label={
                        "Freeze Vesting Percentage after how many consecutive breaks in service"
                      }
                      value={
                        values[
                          fields
                            .freezeVestingPercentageAfterHowManyBreakInService
                        ]
                      }
                      onChange={handleChange}
                      disabled={isEdit && !isSave}
                      component={FieldInputNumber}
                      min={0}
                      max={99}
                      isRequired
                    />
                  )}
                  <Field
                    size="md"
                    label="Timing of Forfeitures"
                    name={fields.forfeitureTimings}
                    value={values[fields.forfeitureTimings]}
                    disabled={isEdit && !isSave}
                    options={timingForfeitures.data}
                    popupContent={
                      <SearchableList
                        label="Select a Timing of Forfeitures"
                        isNotTypeAhead
                        options={timingForfeitures.data}
                        onSelect={(value) =>
                          setFieldValue(fields.forfeitureTimings, value)
                        }
                        selectedValue={values[fields.forfeitureTimings]}
                        isRadio
                      />
                    }
                    component={FieldDropSide}
                    isRequired
                  />
                  <Field
                    size="lg"
                    name={fields.forfeitureTreatment}
                    label={"Forfeiture Treatment"}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.FORFEITURE_TREATMENTS
                    )}
                    selectedValue={values[fields.forfeitureTreatment]}
                    onChange={(value) => {
                      setValues({
                        ...values,
                        [fields.forfeitureTreatment]: value,
                      });
                    }}
                    component={FieldButtonGroup}
                    disabled={isEdit && !isSave}
                    isRequired
                  />
                  <Field
                    size="md"
                    label="Default Investment (for Forfeitures)"
                    name={fields.defaultInvestmentId}
                    value={values[fields.defaultInvestmentId]}
                    disabled={isEdit && !isSave}
                    options={investmentsList}
                    popupContent={
                      <SearchableList
                        label="Select a Default Investment"
                        isNotTypeAhead
                        options={investmentsList}
                        onSelect={(value) =>
                          setFieldValue(fields.defaultInvestmentId, value)
                        }
                        selectedValue={values[fields.defaultInvestmentId]}
                        isRadio
                      />
                    }
                    component={FieldDropSide}
                    isRequired
                  />
                  <div className="line-separator"></div>
                </>
              )}
              <div className="d-flex justify-content-between bg-title">
                <div>
                  <h4 className="ft-20">Additional Vesting Rules</h4>
                </div>
                <div>
                  <Link>
                    <AddButton
                      disabled={isEdit && !isSave}
                      onAddClick={addVestingRuleClick}
                    />
                  </Link>
                </div>
              </div>

              {isEmpty(additionalVestingsData) && (
                <AddPlans
                  content="No additional rules"
                  buttonLabel="ADD ADDITIONAL VESTING RULE"
                  className="h-auto"
                  disabled={isEdit && !isSave}
                  onPrimaryClick={addVestingRuleClick}
                />
              )}
              {!isEmpty(additionalVestingsData) && (
                <div className="w-100">
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
                      {additionalVestingsData.map(
                        (additionalVesting, index) => {
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
                                        onClick={() => {
                                          editVestingRuleClick(item, index);
                                        }}
                                      >
                                        {additionalVesting[item.columnName]}
                                      </Link>
                                    ) : item.dataMapper ? (
                                      item.dataMapper[
                                        additionalVesting[item.columnName]
                                      ]
                                    ) : (
                                      additionalVesting[item.columnName]
                                    )}
                                  </Table.Td>
                                );
                              })}
                            </Table.Tr>
                          );
                        }
                      )}
                    </Table.Tbody>
                  </Table>
                </div>
              )}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddVestingContainer;
