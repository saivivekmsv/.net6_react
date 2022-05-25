import React, { useContext } from "react";
import { get, isEmpty, union } from "lodash";
import { Form, Dropdown } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import {
  ManagePlanLayout,
  FieldTextarea,
  AddPlans,
  FieldInput,
  FieldButtonGroup,
  FieldDropSide,
  AddButton,
  MultiSelectDropdown,
  Link,
  FieldMultiSelectButtonGroup,
  CsplTable as Table,
  DropdownWithImage,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  required,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  ELIGIBILITY_RULE_MAPPING,
  yesNoOptions,
  clearFieldValues,
  transformToMultiselectSave,
  tranformListToDropdownValues,
  toMultiSelectValueById,
  getAdvancedPathWithParam,
} from "../../../utils";
import {
  clearLocalCacheByModel,
  createPlanStore,
  savePlanDetailsAction,
  setManagePageLevelData,
  setManagePlanLocalCache,
  setManagePlanToastInfo,
} from "../../../contexts";
import {
  useDeepEffect,
  useRequest,
  useRouterParams,
  useTableChecboxSelect,
} from "../../../abstracts";
import ExclusionsForm from "./ExclusionsForm";
import EligibilityRuleForm from "./EligibilityRuleForm";
import {
  getClassificationCodes,
  getPlanEligibilityMasterData,
} from "../../../services";
import { faTrashAlt } from "@fortawesome/pro-regular-svg-icons";

const initialValues = {};

const columns = [
  {
    label: "Description",
    className: "column-addtional-Eligibility-description",
    columnName: "description",
    link: MANAGE_PLAN_ROUTES.ADDITIONAL_ELIGIBILITY_RULE,
  },
];

const AddEligibilityContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, eligibilityIndex } = useRouterParams();
  const formName = managePlanFormNames.ADD_ELIGIBILITY;
  const intEligibilityIndex = parseInt(eligibilityIndex, 10);
  const apiData = get(state, "api.data", {});
  const eligibilityApiData = get(apiData, "eligibilityRules", []);
  const eligibilityListData = get(state, "eligibilityRules", []);
  const formValues = get(eligibilityListData, intEligibilityIndex, {});
  const additionalEligibilityRulesData = get(
    formValues,
    "additionalEligibilityRules",
    []
  );

  const eligibilitySourcesList = eligibilityApiData
    .filter(
      (eligibility) =>
        OPTIONS_DATA_MAPPER.ELIGIBILITY_TYPE[
          eligibility["eligibilityRuleFor"]
        ] === "Source" && eligibility.id != get(formValues, "id", 0)
    )
    .map((eligibility) => eligibility["sourceEligibilities"])
    .reduce(
      (previous, current) => [
        ...previous,
        ...current.reduce((prev, curr) => [...prev, curr["sourceId"]], []),
      ],
      []
    );

  const sourcesList = tranformListToDropdownValues(
    get(apiData, "sources", []),
    "sourceName",
    "id"
  ).filter((source) => !eligibilitySourcesList.includes(source.value));

  const fields = formFields[formName];
  const formValuesExcludedClassifications = get(
    formValues,
    "exclusionFromRule.excludedClassifications",
    []
  );
  useDeepEffect(() => {
    if (isEmpty(formValues)) {
      dispatch(
        setManagePlanLocalCache({
          model: "eligibilityRules",
          data: eligibilityApiData,
        })
      );
    }
  }, [eligibilityApiData]);

  const onDeleteClick = () => {
    eligibilityListData.splice(intEligibilityIndex, 1);
    savePlanDetailsAction(
      {
        eligibilityRules: eligibilityListData,
        runEligibility: true,
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        //const newPlanId = get(response, "plan.id");
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ELIGIBILITY,
            pathParam: [FLOW_TYPES.EDIT, planId],
          })
        );
        clearCache();
      }
    });
  };

  const clearCache = () => {
    dispatch(clearLocalCacheByModel("eligibilityRules"));
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ELIGIBILITY,
        pathParam: [FLOW_TYPES.ADD, planId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      onClick: clearCache,
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
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ELIGIBILITY,
        pathParam: [planId],
      }),
      onClick: clearCache,
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
            path: MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY,
            pathParam: [FLOW_TYPES.SAVE, planId, intEligibilityIndex],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
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

  const getDataForSave = (values) => {
    const {
      exclusionType,
      hire,
      hiredOnOrAfterDate,
      hiredOnOrBeforeDate,
      isBreakInService,
      breakInServiceDefinition,
      consecutiveBreaksInService,
      yearsOfServiceDefinition,
      age,
      hours,
      eligibilityCalculationPeriod,
      yearsOfServiceRequirement,
      serviceCreditPeriod,
      period,
      lengthOfService,
      otherComputationalMonths,
      elapsedTimePeriod,
      eligibilityBreakInServices,
      eligibilityType,
      immediateEligibility,
      isRevaluationRequired,
      dailyHours,
      weeklyHours,
      biWeeklyHours,
      semiMonthlyHours,
      monthlyHours,
      quarterlyHours,
      semiAnnuallyHours,
      annuallyHours,
      exclusionRuleId,
      eligibilityRuleFor,
      sourceEligibilities,
      ...rest
    } = values;

    const updatedValues = {
      ...formValues,
      ...rest,
      eligibilityRuleFor: eligibilityRuleFor || undefined,
      eligibilityToBeChecked: 0,
      immediateEligibility: immediateEligibility,
      eligibilityType: eligibilityType || undefined,
      yearsOfServiceDefinition: yearsOfServiceDefinition || undefined,
      age: age || undefined,
      isRevaluationRequired: isRevaluationRequired,
      period: period || undefined,
      lengthOfService: lengthOfService || undefined,
      hours: hours || undefined,
      dailyHours: dailyHours == 0 ? 0 : dailyHours || undefined,
      weeklyHours: weeklyHours == 0 ? 0 : weeklyHours || undefined,
      biWeeklyHours: biWeeklyHours == 0 ? 0 : biWeeklyHours || undefined,
      semiMonthlyHours:
        semiMonthlyHours == 0 ? 0 : semiMonthlyHours || undefined,
      monthlyHours: monthlyHours == 0 ? 0 : monthlyHours || undefined,
      quarterlyHours: quarterlyHours == 0 ? 0 : quarterlyHours || undefined,
      semiAnnuallyHours:
        semiAnnuallyHours == 0 ? 0 : semiAnnuallyHours || undefined,
      annuallyHours: annuallyHours == 0 ? 0 : annuallyHours || undefined,
      eligibilityCalculationPeriod: eligibilityCalculationPeriod || undefined,
      otherComputationalMonths: otherComputationalMonths || undefined,
      yearsOfServiceRequirement: yearsOfServiceRequirement || undefined,
      serviceCreditPeriod: serviceCreditPeriod || undefined,
      isBreakInService: isBreakInService,
      [fields.sourceEligibilities]: [
        ...transformToMultiselectSave(
          (values[fields.sourceEligibilities] || []).filter(
            (val) =>
              !get(formValues, fields.sourceEligibilities, [])
                .map((_) => _.sourceId)
                .includes(val)
          ),
          "sourceId"
        ),
        ...get(formValues, fields.sourceEligibilities, [])?.filter((val) =>
          (values[fields.sourceEligibilities] || []).includes(val.sourceId)
        ),
      ],
      exclusionFromRule: {
        id: exclusionRuleId,
        exclusionType: exclusionType,
        [fields.excludedClassifications]: [
          ...transformToMultiselectSave(
            (values[fields.excludedClassifications] || []).filter(
              (val) =>
                !get(
                  formValues,
                  "exclusionFromRule.excludedClassifications",
                  []
                )
                  .map((_) => _.employeeClassificationCodeId)
                  .includes(val)
            ),
            "employeeClassificationCodeId"
          ),
          ...(
            get(formValues, "exclusionFromRule.excludedClassifications", []) ||
            []
          )?.filter((val) =>
            (values[fields.excludedClassifications] || []).includes(
              val.employeeClassificationCodeId
            )
          ),
        ],
        dateOfHireType: hire || undefined,
        hiredOnOrAfterDate: hiredOnOrAfterDate || undefined,
        hiredOnOrBeforeDate: hiredOnOrBeforeDate || undefined,
      },
    };

    if (isEmpty(formValues)) {
      return [...eligibilityListData, updatedValues];
    }
    return eligibilityListData.map((eligibilityRule, index) => {
      if (index === intEligibilityIndex) {
        return {
          ...eligibilityRule,
          ...updatedValues,
        };
      }
      return eligibilityRule;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    var data = getDataForSave(values);
    savePlanDetailsAction(
      {
        eligibilityRules: data,
        runEligibility: data == apiData.eligibilityRules,
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        //const newPlanId = get(response, "plan.id");
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ELIGIBILITY,
            pathParam: [FLOW_TYPES.EDIT, planId],
          })
        );
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
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
  const isSave = flow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        [fields.excludedClassifications]: formValuesExcludedClassifications?.map(
          (val) => val.employeeClassificationCodeId
        ),
        [fields.additionalEligibilityRules]: get(
          formValues,
          "additionalEligibilityRules",
          []
        ),
        [fields.eligibilityRule]: get(formValues, fields.eligibilityRule),
        [fields.eligibilityName]: get(formValues, fields.eligibilityName),
        [fields.hours]: get(formValues, `${fields.hours}`, null),
        [fields.sourceEligibilities]: get(
          formValues,
          fields.sourceEligibilities,
          []
        )?.map((val) => val.sourceId),
        [fields.hours]: get(formValues, `${fields.hours}`, null),
        [fields.eligibilityDescription]: get(
          formValues,
          fields.eligibilityDescription
        ),
        [fields.exclusionType]: get(
          formValues,
          `exclusionFromRule.exclusionType`,
          null
        ),
        [fields.hire]: get(formValues, `exclusionFromRule.dateOfHireType`),
        [fields.immediateEligibility]: get(
          formValues,
          fields.immediateEligibility,
          null
        ),
        [fields.period]: get(formValues, `${fields.period}`, null),
        [fields.isBreakInService]: get(formValues, fields.isBreakInService),
        [fields.applicableEligibilityRequirement]: get(
          formValues,
          `${fields.applicableEligibilityRequirement}`,
          null
        ),

        [fields.yearsOfServiceDefinition]: get(
          formValues,
          `${fields.yearsOfServiceDefinition}`,
          null
        ),
        [fields.age]: get(formValues, `age`),
        [fields.yearsOfServiceHours]: get(
          formValues,
          `${fields.yearsOfServiceHours}`,
          null
        ),
        [fields.eligibilityCalculationPeriod]: get(
          formValues,
          `${fields.eligibilityCalculationPeriod}`,
          null
        ),
        [fields.hours]: get(formValues, `${fields.hours}`),
        [fields.otherComputationalMonths]: get(
          formValues,
          `${fields.otherComputationalMonths}`
        ),
        [fields.yearsOfServiceRequirement]: get(
          formValues,
          `${fields.yearsOfServiceRequirement}`,
          null
        ),
        [fields.serviceCreditPeriod]: get(
          formValues,
          `${fields.serviceCreditPeriod}`,
          null
        ),
        [fields.consecutiveBreaksInService]: get(
          formValues,
          fields.consecutiveBreaksInService
        ),
        [fields.breakInServiceDefinition]: get(
          formValues,
          fields.breakInServiceDefinition
        ),
        [fields.exclusionRuleId]: get(formValues, `exclusionFromRule.id`, 0),
        [fields.hiredOnOrAfterDate]: get(
          formValues,
          `exclusionFromRule.hiredOnOrAfterDate`
        ),
        [fields.hiredOnOrBeforeDate]: get(
          formValues,
          `exclusionFromRule.hiredOnOrBeforeDate`
        ),
        [fields.lengthOfServiceRequirement]: get(
          formValues,
          `${fields.lengthOfServiceRequirement}`,
          1
        ),
        [fields.daily]: get(formValues, `${fields.daily}`, null),
        [fields.monthly]: get(formValues, `${fields.monthly}`, null),
        [fields.weekly]: get(formValues, `${fields.weekly}`, null),
        [fields.biweekly]: get(formValues, `${fields.biweekly}`, null),
        [fields.semiMonthly]: get(formValues, `${fields.semiMonthly}`, null),
        [fields.quarterly]: get(formValues, `${fields.quarterly}`, null),
        [fields.semiAnnually]: get(formValues, `${fields.semiAnnually}`, null),
        [fields.annually]: get(formValues, `${fields.annually}`, null),
        [fields.employeePopulation]: get(
          formValues,
          `isRevaluationRequired`,
          false
        ),
        [fields.lengthOfService]: get(
          formValues,
          `${fields.lengthOfService}`,
          null
        ),
        [fields.period]: get(formValues, `${fields.period}`, null),
        [fields.eligibilityBreakInServices]: get(
          formValues,
          fields.eligibilityBreakInServices,
          []
        ).map((item) => item.breakInServiceRuleId),
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
        values,
        setSubmitting,
        ...rest
      }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };

        const onBreakInServiceChange = (value) => {
          const updatedValues = clearFieldValues({
            values,
            fieldsToClear: [
              fields.breakInServiceDefinition,
              fields.consecutiveBreaksInService,
            ],
          });
          setValues({
            ...updatedValues,
            [fields.isBreakInService]: value,
          });
        };

        const addAdditionalEligiblityClick = () => {
          setSubmitting(true);
          const newEligibilityId = eligibilityIndex;
          const additionalEligibilityId = (additionalEligibilityRulesData || [])
            .length;
          dispatch(
            setManagePlanLocalCache({
              model: "eligibilityRules",
              data: getDataForSave(values),
            })
          );
          window.setTimeout(() => {
            history.push(
              getAdvancedPathWithParam({
                path: MANAGE_PLAN_ROUTES.ADDITIONAL_ELIGIBILITY_RULE,
                pathParam: [
                  FLOW_TYPES.ADD,
                  planId,
                  newEligibilityId,
                  additionalEligibilityId,
                ],
              })
            );
          }, 10);
        };

        const editAdditionalEligibilityRuleClick = (item, index) => {
          setSubmitting(true);
          dispatch(
            setManagePlanLocalCache({
              model: "eligibilityRules",
              data: getDataForSave(values),
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: item.link,
                pathParam: [
                  FLOW_TYPES.EDIT,
                  planId,
                  intEligibilityIndex,
                  index,
                ],
              })
            );
          }, 10);
        };

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout
              buttons={buttons}
              pageFlow={flow}
              layoutHeader={eligibilityIndex && "Eligibility Rule"}
            >
              <Field
                isRequired
                name={fields.eligibilityRule}
                label={"Eligibility Rule for"}
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.ELIGIBILITY_TYPE
                )}
                selectedValue={values[fields.eligibilityRule]}
                value={values[fields.eligibilityRule]}
                onChange={(value) => {
                  setValues({
                    ...values,
                    [fields.eligibilityRule]: value,
                  });
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
                size="smd"
              />
              <p className="plan-sub-heading">Eligibility Details</p>
              <Field
                isRequired
                name={fields.eligibilityName}
                label={"Eligibility Name"}
                hasSuggestion
                isSuggestionLoading={false}
                type="text"
                autoComplete="off"
                value={values[fields.eligibilityName]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInput}
              />
              <Field
                name={fields.eligibilityDescription}
                label="Eligibility Description"
                autoComplete="off"
                value={values[fields.eligibilityDescription]}
                onChange={handleChange}
                disabled={isEdit}
                component={FieldTextarea}
                size="lg"
              />
              {values[fields.eligibilityRule] ===
                ELIGIBILITY_RULE_MAPPING.Source && (
                <Field
                  isRequired
                  label="Select Applicable sources for Eligibility rules."
                  name={fields.sourceEligibilities}
                  value={toMultiSelectValueById(
                    values[fields.sourceEligibilities],
                    sourcesList
                  )}
                  disabled={isEdit && !isSave}
                  isMultiSelect
                  popupContent={
                    sourcesList != 0 ? (
                      <MultiSelectDropdown
                        label={
                          sourcesList.length === 0
                            ? "No data available"
                            : "Select applicable sources"
                        }
                        name={fields.sourceEligibilities}
                        onSelect={(value) =>
                          setFieldValue(fields.sourceEligibilities, value)
                        }
                        value={values[fields.sourceEligibilities]}
                        options={sourcesList}
                        disabled={isEdit && !isSave}
                      />
                    ) : (
                      <DropdownWithImage
                        label="Select Applicable sources for Eligibility rules."
                        name={fields.sourceEligibilities}
                        value={values[fields.sourceEligibilities]}
                        disabled={isEdit && !isSave}
                      />
                    )
                  }
                  component={FieldDropSide}
                />
              )}

              <p className="plan-sub-heading">Exclusions</p>
              <ExclusionsForm
                {...{
                  fields,
                  values,
                  setValues,
                  isEdit,
                  isSave,
                  setFieldValue,
                  onDaySelected,
                  data: get(state, "api.data.companyId", 0),
                }}
              />
              <p className="plan-sub-heading mt-40">Default Eligibility Rule</p>
              <EligibilityRuleForm {...{ values, fields, isEdit, isSave }} />
              <p className="plan-sub-heading">Eligibility Re-Evaluation</p>
              <Field
                isRequired
                size="sm"
                name={fields.employeePopulation}
                label="Re-evaluate Eligibility while moving among different employee populations?"
                options={yesNoOptions}
                selectedValue={values[fields.employeePopulation]}
                type="text"
                autoComplete="off"
                value={values[fields.employeePopulation]}
                onChange={(value) => {
                  setFieldValue(fields.employeePopulation, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <p className="plan-sub-heading">
                Break In Service And Termination
              </p>
              <Field
                isRequired
                size="sm"
                name={fields.isBreakInService}
                label={"Break in service applicable?"}
                options={yesNoOptions}
                selectedValue={values[fields.isBreakInService]}
                type="text"
                autoComplete="off"
                value={values[fields.isBreakInService]}
                onChange={onBreakInServiceChange}
                component={FieldButtonGroup}
                disabled={
                  (isEdit && !isSave) ||
                  values[fields.eligibilityCalculationPeriod] === 3
                }
              />
              <div className="line-separator"></div>
              <div className="d-flex justify-content-between bg-title">
                <div>
                  <h4 className="ft-20">Additional Eligibility Rules</h4>
                </div>
                <div>
                  <AddButton
                    disabled={isEdit && !isSave}
                    onAddClick={addAdditionalEligiblityClick}
                  />
                </div>
              </div>

              {isEmpty(additionalEligibilityRulesData) && (
                <AddPlans
                  content="No additional rules"
                  buttonLabel="Add Additional Eligibility Rule"
                  className="h-auto"
                  disabled={isEdit && !isSave}
                  onPrimaryClick={addAdditionalEligiblityClick}
                />
              )}
              {!isEmpty(additionalEligibilityRulesData) && (
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
                      {additionalEligibilityRulesData.map(
                        (additionalEligibility, index) => {
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
                                          editAdditionalEligibilityRuleClick(
                                            item,
                                            index
                                          );
                                        }}
                                      >
                                        {additionalEligibility[item.columnName]}
                                      </Link>
                                    ) : item.dataMapper ? (
                                      item.dataMapper[
                                        additionalEligibility[item.columnName]
                                      ]
                                    ) : (
                                      additionalEligibility[item.columnName]
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

export default AddEligibilityContainer;
