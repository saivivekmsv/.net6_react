import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldDropSide,
  FieldTextarea,
  DatePicker,
} from "../../../components";

import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  required,
  usDateFormat,
  transformToMultiselectSave,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanLocalCache,
  setManagePlanToastInfo,
} from "../../../contexts";
import {
  useRequest,
  useRouterParams,
  useTableChecboxSelect,
} from "../../../abstracts";
import AdditionalExclusionsForm from "../AddEligibilityContainer/AdditionalExclusionsForm";
import EligibilityRuleForm from "../AddEligibilityContainer/EligibilityRuleForm";
import {
  getPlanEligibilityMasterData,
  getClassificationCodes,
} from "../../../services";
import AdditionalEligibilityRuleForm from "../AddEligibilityContainer/AdditionalEligibilityRuleForm";

const initialValues = {};

const AdditionalEligibilityRuleContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { history } = props;
  const {
    flow,
    planId,
    eligibilityIndex,
    additionalEligibilityId,
  } = useRouterParams();
  const formName = managePlanFormNames.ADDITIONAL_ELIGIBILITY_RULE;
  const fields = formFields[formName];
  const intEligibilityIndex = parseInt(eligibilityIndex, 0);
  const eligibilityListData = get(state, "eligibilityRules", []);
  const eligibilityRulesFormValues = get(
    eligibilityListData,
    intEligibilityIndex,
    {}
  );
  const additionalEligibilityRulesData = get(
    eligibilityRulesFormValues,
    "additionalEligibilityRules",
    []
  );
  const formValues = get(
    additionalEligibilityRulesData,
    additionalEligibilityId,
    {}
  );
  const formValuesExcludedClassifications = get(
    formValues,
    "excludedClassifications",
    []
  );
  const [newFlow, setNewFlow] = useState(flow);

  const onDeleteClick = () => {
    var eligData = eligibilityListData.map((item, index) => {
      if (index === intEligibilityIndex) {
        let eligibility = {
          ...item,
          additionalEligibilityRules: additionalEligibilityRulesData.filter(
            (additionalEligibility, index) =>
              index !== parseInt(additionalEligibilityId)
          ),
        };
        return eligibility;
      }
      return item;
    });
    console.log(eligData, additionalEligibilityId, intEligibilityIndex);
    dispatch(
      setManagePlanLocalCache({
        model: "eligibilityRules",
        data: eligData,
      })
    );
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY,
        pathParam: [FLOW_TYPES.SAVE, planId, eligibilityIndex],
      })
    );
    dispatch(
      setManagePlanToastInfo({
        showToast: true,
        toastMessage: `Data deleted successfully`,
      })
    );
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY,
        pathParam: [newFlow, planId, eligibilityIndex],
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
      flow: [FLOW_TYPES.ADD],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY,
        pathParam: [newFlow, planId, eligibilityIndex],
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
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
      onClick: onDeleteClick,
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const getDataForSave = (values) => {
    const {
      // isBreakInService,
      // breakInServiceDefinition,
      // consecutiveBreaksInService,
      yearsOfServiceDefinition,
      age,
      hours,
      yearsOfServiceHours,
      eligibilityCalculationPeriod,
      otherComputationalMonths,
      yearsOfServiceRequirement,
      serviceCreditPeriod,
      period,
      lengthOfService,
      eligibilityBreakInServices,
      eligibilityType,
      immediateEligibility,
      isRevaluationRequired,
      daily,
      exclusionRuleId,
      weekly,
      biweekly,
      semiMonthly,
      monthly,
      quarterly,
      semiAnnually,
      annually,
      hireDateType,
      exclusionType,
      ...rest
    } = values;

    const formatedValues = {
      ...formValues,
      ...rest,
      immediateEligibility: immediateEligibility,
      eligibilityType: eligibilityType || undefined,
      yearsOfServiceDefinition: yearsOfServiceDefinition || undefined,
      age: age || undefined,
      isRevaluationRequired: isRevaluationRequired,
      exclusionType: exclusionType || undefined,
      hireDateType: hireDateType || undefined,
      actualHours: {
        [fields.hours]: values[fields.hours],
        [fields.eligibilityCalculationPeriod]:
          values[fields.eligibilityCalculationPeriod],
        [fields.yearsOfServiceRequirement]:
          values[fields.yearsOfServiceRequirement],
        [fields.serviceCreditPeriod]: values[fields.serviceCreditPeriod],
        [fields.otherComputationalMonths]:
          values[fields.otherComputationalMonths],
      },
      elapsedTime: {
        [fields.period]: values[fields.period],
        [fields.lengthOfService]: values[fields.lengthOfService],
      },
      equivalencyHours: {
        daily,
        weekly,
        biweekly,
        semiMonthly,
        monthly,
        quarterly,
        semiAnnually,
        annually,
      },
      [fields.excludedClassifications]: [
        ...transformToMultiselectSave(
          (values[fields.excludedClassifications] || []).filter(
            (val) =>
              !get(formValues, fields.excludedClassifications, [])
                .map((_) => _.employeeClassificationCodeId)
                .includes(val)
          ),
          "employeeClassificationCodeId"
        ),
        ...get(formValues, fields.excludedClassifications, [])?.filter((val) =>
          (values[fields.excludedClassifications] || []).includes(
            val.employeeClassificationCodeId
          )
        ),
      ],
    };

    var eligData = eligibilityListData.map((item, index) => {
      if (index === intEligibilityIndex) {
        let transformedData = {};
        if (isEmpty(formValues)) {
          transformedData = {
            ...item,
            additionalEligibilityRules: [
              ...(additionalEligibilityRulesData || []),
              formatedValues,
            ],
          };
          return transformedData;
        }
        transformedData = {
          ...item,
          additionalEligibilityRules: additionalEligibilityRulesData.map(
            (addtionEligibilityItem, addtionEligibilityIndex) => {
              if (
                addtionEligibilityIndex === parseInt(additionalEligibilityId)
              ) {
                return { ...addtionEligibilityItem, ...formatedValues };
              }
              return addtionEligibilityItem;
            }
          ),
        };
        return transformedData;
      }
      return item;
    });
    return eligData;
  };

  const onFormSubmit = (values) => {
    dispatch(
      setManagePlanLocalCache({
        model: "eligibilityRules",
        data: getDataForSave(values),
      })
    );
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_ELIGIBILITY,
        pathParam: [newFlow, planId, eligibilityIndex],
      })
    );
  };

  const isEdit = newFlow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        [fields.excludedClassifications]: formValuesExcludedClassifications?.map(
          (val) => val.employeeClassificationCodeId
        ),
        [fields.eligibilityDescription]: get(
          formValues,
          fields.eligibilityDescription
        ),
        [fields.effectiveStartDate]: get(formValues, `effectiveStartDate`),
        [fields.effectiveEndDate]: get(formValues, `effectiveEndDate`),
        [fields.exclusionType]: get(formValues, `exclusionType`, 2),
        [fields.hireDateType]: get(formValues, `hireDateType`),

        [fields.immediateEligibility]: get(
          formValues,
          fields.immediateEligibility
        ),
        [fields.isBreakInService]: get(formValues, fields.isBreakInService),
        [fields.applicableEligibilityRequirement]: get(
          formValues,
          `${fields.applicableEligibilityRequirement}`
        ),
        [fields.yearsOfServiceDefinition]: get(
          formValues,
          `${fields.yearsOfServiceDefinition}`
        ),
        [fields.age]: get(formValues, `age`),
        [fields.hours]: get(formValues, `actualHours.${fields.hours}`),
        [fields.otherComputationalMonths]: get(
          formValues,
          `actualHours.${fields.otherComputationalMonths}`
        ),
        [fields.eligibilityCalculationPeriod]: get(
          formValues,
          `actualHours.${fields.eligibilityCalculationPeriod}`
        ),
        [fields.yearsOfServiceRequirement]: get(
          formValues,
          `actualHours.${fields.yearsOfServiceRequirement}`
        ),
        [fields.serviceCreditPeriod]: get(
          formValues,
          `actualHours.${fields.serviceCreditPeriod}`
        ),
        [fields.consecutiveBreaksInService]: get(
          formValues,
          fields.consecutiveBreaksInService
        ),
        [fields.breakInServiceDefinition]: get(
          formValues,
          fields.breakInServiceDefinition
        ),
        [fields.startHireDate]: get(formValues, `startHireDate`),
        [fields.endHireDate]: get(formValues, `endHireDate`),
        [fields.lengthOfService]: get(
          formValues,
          `elapsedTime.${fields.lengthOfService}`,
          1
        ),
        [fields.period]: get(formValues, `elapsedTime.${fields.period}`),
        [fields.daily]: get(
          formValues,
          `equivalencyHours.${fields.daily}`,
          null
        ),
        [fields.monthly]: get(
          formValues,
          `equivalencyHours.${fields.monthly}`,
          null
        ),
        [fields.weekly]: get(
          formValues,
          `equivalencyHours.${fields.weekly}`,
          null
        ),
        [fields.biweekly]: get(
          formValues,
          `equivalencyHours.${fields.biweekly}`,
          null
        ),
        [fields.semiMonthly]: get(
          formValues,
          `equivalencyHours.${fields.semiMonthly}`,
          null
        ),
        [fields.quarterly]: get(
          formValues,
          `equivalencyHours.${fields.quarterly}`,
          null
        ),
        [fields.semiAnnually]: get(
          formValues,
          `equivalencyHours.${fields.semiAnnually}`,
          null
        ),
        [fields.annually]: get(
          formValues,
          `equivalencyHours.${fields.annually}`,
          null
        ),
        // [fields.employeePopulation]: get(formValues, `isRevaluationRequired`),
        // [fields.lengthOfServiceMonths]: get(
        //   formValues,
        //   `${fields.lengthOfServiceMonths}`
        // ),
        // [fields.lengthOfServiceYears]: get(
        //   formValues,
        //   `${fields.lengthOfServiceYears}`
        // ),

        // [fields.eligibilityBreakInServices]: get(
        //   formValues,
        //   fields.eligibilityBreakInServices,
        //   []
        // ).map((item) => item.breakInServiceRuleId),
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
        ...rest
      }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
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
              pageFlow={newFlow || flow}
              layoutHeader={
                additionalEligibilityId && "Additional Eligibility Rule"
              }
            >
              <p className="plan-sub-heading">Eligibility Details</p>
              <Row>
                <Col md="7">
                  <Field
                    isRequired
                    name={fields.eligibilityDescription}
                    label="Eligibility Description"
                    autoComplete="off"
                    value={values[fields.eligibilityDescription]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldTextarea}
                    validate={(value) => {
                      return [undefined, null, ""].includes(value)
                        ? "PL555 : Required"
                        : values[fields.eligibilityDescription].length > 50
                        ? "PL556 : Eligibility Description length should not Exceed 50 characters"
                        : undefined;
                    }}
                    size="lg"
                  />
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <Field
                    isRequired
                    label="Effective Start Date"
                    name={fields.effectiveStartDate}
                    value={usDateFormat(values[fields.effectiveStartDate])}
                    disabled={isEdit && !isSave}
                    isDatePicker
                    onClear={() =>
                      setFieldValue(fields.effectiveStartDate, null)
                    }
                    popupContent={
                      <DatePicker
                        onDayClick={(value) => {
                          onDaySelected(fields.effectiveStartDate, value);
                        }}
                        value={values[fields.effectiveStartDate]}
                      />
                    }
                    validate={(value) => {
                      return [undefined, null, ""].includes(value)
                        ? "PL557 : Required"
                        : undefined;
                    }}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    isRequired
                    label="Effective End Date"
                    name={fields.effectiveEndDate}
                    value={usDateFormat(values[fields.effectiveEndDate])}
                    disabled={isEdit && !isSave}
                    isDatePicker
                    onClear={() => setFieldValue(fields.effectiveEndDate, null)}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) => {
                          onDaySelected(fields.effectiveEndDate, value);
                        }}
                        value={values[fields.effectiveEndDate]}
                      />
                    }
                    validate={(value) => {
                      return [undefined, null, ""].includes(value)
                        ? "PL558 : Required"
                        : value <= values[fields.effectiveStartDate]
                        ? "PL559 : Eligibility Effective End Date should be greater than Eligibility Effective Start Date"
                        : undefined;
                    }}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>

              <AdditionalExclusionsForm
                {...{
                  fields,
                  values,
                  setValues,
                  isEdit,
                  isSave,
                  onDaySelected,
                  setFieldValue,
                  data: get(state, "api.data.companyId", 0),
                }}
              />

              <AdditionalEligibilityRuleForm
                {...{ values, fields, isEdit, isSave }}
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AdditionalEligibilityRuleContainer;
