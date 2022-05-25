import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldTextarea,
  FieldDropSide,
  SearchableList,
  MultiSelectDropdown,
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
  clearFieldValues,
  toMultiSelectValue,
  toMultiSelectValueById,
  transformToMultiselectSave,
  getNumber,
} from "../../../utils";
import { createPlanStore, setManagePlanLocalCache } from "../../../contexts";
import { useDeepEffect, useRouterParams } from "../../../abstracts";
import participationPeriods from "../../../mocks/vestingParticipationPeriod.json";
import hirePeriods from "../../../mocks/vestingHirePeriod.json";
import additionalVestingOptions from "../../../mocks/additionalVestingOptions.json";
import vestingEmployeeClassification from "../../../mocks/vestingEmployeeClassification.json";
import CommonVestingRules from "../AddVestingContainer/CommonVestingRules";
import { getClassificationCodes } from "../../../services";

const initialValues = {};

const AddVestingRuleContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, vestingId, additionalRuleId } = useRouterParams();
  const formName = managePlanFormNames.ADD_VESTING_RULE;
  const fields = formFields[formName];
  const vestingsListData = get(state, "vestings", []);
  const intVestingId = parseInt(vestingId, 10);
  const intAdditionalVestingId = parseInt(additionalRuleId);
  const vestingFormValues = get(vestingsListData, vestingId, {});
  const additionalVestingsData = get(
    vestingFormValues,
    "additionalVestings",
    []
  );
  const [newFlow, setNewFlow] = useState(flow);
  const formValues = get(additionalVestingsData, additionalRuleId, {});
  const [employeeClassifications, setEmployeeClassifications] = useState([]);

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_VESTING,
        pathParam: [flow, planId, vestingId], // put the company id after crated
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
        path: MANAGE_PLAN_ROUTES.ADD_VESTING,
        pathParam: [flow, planId, vestingId], // put the company id after crated
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
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  useDeepEffect(() => {
    getClassificationCodes(get(state, "api.data.companyId", 0))
      .then((response) => {
        setEmployeeClassifications(
          response.map((val) => ({
            label: val.code + "-" + val.classificationName,
            value: val.id,
          }))
        );
      })
      .catch((error) => {
        //Handle Error
      });
  }, []);

  const getDataForSave = (values) => {
    return vestingsListData.map((item, index) => {
      const updatedValues = {
        ...formValues,
        ...values,
        dateOfHire: {
          rule: getNumber(values[fields.hirePeriod]),
          startDate: values[fields.hireDate]
            ? values[fields.hireDate]
            : values[fields.hireStartDate],
          endDate: values[fields.hireDate]
            ? values[fields.hireDate]
            : values[fields.hireEndDate],
        },
        dateOfParticipation: {
          participationRule: getNumber(values[fields.participationPeriod]),
          startDate: values[fields.participationDate]
            ? values[fields.participationDate]
            : values[fields.participationStartDate],
          endDate: values[fields.participationDate]
            ? values[fields.participationDate]
            : values[fields.participationEndDate],
        },
        [fields.includedClassifications]: [
          ...transformToMultiselectSave(
            (values[fields.includedClassifications] || []).filter(
              (val) =>
                !get(formValues, fields.includedClassifications, [])
                  .map((_) => _.employeeClassificationCodeId)
                  .includes(val)
            ),
            "employeeClassificationCodeId"
          ),
          ...get(
            formValues,
            fields.includedClassifications,
            []
          )?.filter((val) =>
            (values[fields.includedClassifications] || []).includes(
              val.employeeClassificationCodeId
            )
          ),
        ],
      };
      if (index === intVestingId) {
        let transformedData = {};
        if (isEmpty(formValues)) {
          transformedData = {
            ...item,
            additionalVestings: [...additionalVestingsData, updatedValues],
          };
          return transformedData;
        }

        transformedData = {
          ...item,
          additionalVestings: additionalVestingsData.map(
            (addtionVestingItem, addtionVestingIndex) => {
              if (addtionVestingIndex === intAdditionalVestingId) {
                return { ...addtionVestingItem, ...updatedValues };
              }
              return addtionVestingItem;
            }
          ),
        };
        return transformedData;
      }
      return item;
    });
  };

  const onFormSubmit = (values) => {
    const { history } = props;
    dispatch(
      setManagePlanLocalCache({
        model: "vestings",
        data: getDataForSave(values),
      })
    );

    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_VESTING,
        pathParam: [flow, planId, vestingId],
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
        [fields.hirePeriod]: get(formValues, "dateOfHire.rule"),
        [fields.hireStartDate]: get(formValues, "dateOfHire.startDate"),
        [fields.hireEndDate]: get(formValues, "dateOfHire.endDate"),
        [fields.hireDate]:
          get(formValues, "dateOfHire.rule") !== 1
            ? get(formValues, "dateOfHire.startDate") ||
              get(formValues, "dateOfHire.endDate")
            : null,
        [fields.participationPeriod]: get(
          formValues,
          "dateOfParticipation.participationRule"
        ),
        [fields.participationStartDate]: get(
          formValues,
          "dateOfParticipation.startDate"
        ),
        [fields.participationEndDate]: get(
          formValues,
          "dateOfParticipation.endDate"
        ),
        [fields.participationDate]:
          get(formValues, "dateOfParticipation.participationRule") !== 1
            ? get(formValues, "dateOfParticipation.startDate") ||
              get(formValues, "dateOfParticipation.endDate")
            : null,
        [fields.includedClassifications]: get(
          formValues,
          fields.includedClassifications,
          []
        )?.map((val) => val.employeeClassificationCodeId),
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

        const validateVestingDescription = (value) => {
          if (!value) return "Required";
          else if (value?.length > 150)
            return "Vesting Description length should not Exceed  150 characters";
          if (!new RegExp("^[a-zA-z0-9.' ]+$").test(value))
            return "Vesting Description should contain only Alphabets, Numbers, Space, Dot and Apostrophe";
          return null;
        };

        const validateStartDate = (value) => {
          if (!value) return "Required";
          else if (value > values[fields.vestingEffectiveEnddate])
            return "Vesting Effective Start Date should not exceed Vesting Effective End Date";
          return null;
        };

        const selectedApplicableEmployeeClassification =
          values[fields.includedClassifications];

        const onVestingOptionChange = (value) => {
          const updatedValues = clearFieldValues({
            values,
            fieldsToClear: [
              fields.hirePeriod,
              fields.hireStartDate,
              fields.hireEndDate,
              fields.hireDate,
              fields.participationPeriod,
              fields.participationStartDate,
              fields.participationEndDate,
              fields.participationDate,
              fields.includedClassifications,
            ],
          });
          setValues({
            ...updatedValues,
            [fields.vestingOption]: value,
          });
        };
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <p className="plan-sub-heading">Additional Vesting Rules</p>
              <Row>
                <Col md="7">
                  <Field
                    isRequired
                    name={fields.vestingDescription}
                    label="Vesting Description"
                    autoComplete="off"
                    value={values[fields.vestingDescription]}
                    onChange={handleChange}
                    disabled={isEdit}
                    component={FieldTextarea}
                    validate={validateVestingDescription}
                    size="lg"
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    isRequired
                    label="Vesting Effective Start Date"
                    name={fields.vestingEffectiveStartDate}
                    value={usDateFormat(
                      values[fields.vestingEffectiveStartDate]
                    )}
                    disabled={isEdit && !isSave}
                    isDatePicker
                    onClear={() =>
                      setFieldValue(fields.vestingEffectiveStartDate, "")
                    }
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.vestingEffectiveStartDate, value)
                        }
                        value={values[fields.vestingEffectiveStartDate]}
                      />
                    }
                    validate={validateStartDate}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    isRequired
                    label="Vesting Effective End Date"
                    name={fields.vestingEffectiveEnddate}
                    value={usDateFormat(values[fields.vestingEffectiveEnddate])}
                    disabled={isEdit && !isSave}
                    isDatePicker
                    onClear={() =>
                      setFieldValue(fields.vestingEffectiveEnddate, "")
                    }
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.vestingEffectiveEnddate, value)
                        }
                        value={values[fields.vestingEffectiveEnddate]}
                      />
                    }
                    validate={required}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    isRequired
                    label="Additional Vesting Option"
                    name={fields.vestingOption}
                    value={values[fields.vestingOption]}
                    disabled={isEdit && !isSave}
                    options={additionalVestingOptions.data}
                    popupContent={
                      <SearchableList
                        label="Select a Default Investment"
                        isNotTypeAhead
                        options={additionalVestingOptions.data}
                        onSelect={onVestingOptionChange}
                        selectedValue={values[fields.vestingOption]}
                        isRadio
                      />
                    }
                    validate={required}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                {[1, 4].includes(values[fields.vestingOption]) && (
                  <Col md="4">
                    <Field
                      size="md"
                      isRequired
                      label="Hire period"
                      name={fields.hirePeriod}
                      value={values[fields.hirePeriod]}
                      disabled={isEdit && !isSave}
                      options={hirePeriods.data}
                      popupContent={
                        <SearchableList
                          label="Select a Hire period"
                          isNotTypeAhead
                          options={hirePeriods.data}
                          onSelect={(value) =>
                            setFieldValue(fields.hirePeriod, value)
                          }
                          selectedValue={values[fields.hirePeriod]}
                          isRadio
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  </Col>
                )}
                {values[fields.hirePeriod] === 1 ? (
                  <>
                    <Col md="2">
                      <Field
                        size="sm"
                        isRequired
                        label="Start Date"
                        name={fields.hireStartDate}
                        value={usDateFormat(values[fields.hireStartDate])}
                        disabled={isEdit && !isSave}
                        isDatePicker
                        onClear={() => setFieldValue(fields.hireStartDate, "")}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.hireStartDate, value)
                            }
                            value={values[fields.hireStartDate]}
                          />
                        }
                        validate={(value) => {
                          if (!value) return "Required";
                          else if (value > values[fields.hireEndDate])
                            return "Hire Period Start Date should not exceed Hire Period End Date";
                          return null;
                        }}
                        component={FieldDropSide}
                      />
                    </Col>
                    <Col md="2">
                      <Field
                        size="sm"
                        isRequired
                        label="End Date"
                        name={fields.hireEndDate}
                        value={usDateFormat(values[fields.hireEndDate])}
                        disabled={isEdit && !isSave}
                        isDatePicker
                        onClear={() => setFieldValue(fields.hireEndDate, "")}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.hireEndDate, value)
                            }
                            value={values[fields.hireEndDate]}
                          />
                        }
                        validate={required}
                        component={FieldDropSide}
                      />
                    </Col>
                  </>
                ) : null}
                {values[fields.hirePeriod] === 2 ? (
                  <Col md="2">
                    <Field
                      size="sm"
                      isRequired
                      label="Hire Date"
                      name={fields.hireDate}
                      value={usDateFormat(values[fields.hireDate])}
                      disabled={isEdit && !isSave}
                      isDatePicker
                      onClear={() => setFieldValue(fields.hireDate, "")}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            onDaySelected(fields.hireDate, value)
                          }
                          value={values[fields.hireDate]}
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  </Col>
                ) : null}
                {values[fields.hirePeriod] === 3 ? (
                  <Col md="2">
                    <Field
                      size="sm"
                      isRequired
                      label="Hire Date"
                      name={fields.hireDate}
                      value={usDateFormat(values[fields.hireDate])}
                      disabled={isEdit && !isSave}
                      isDatePicker
                      onClear={() => setFieldValue(fields.hireDate, "")}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            onDaySelected(fields.hireDate, value)
                          }
                          value={values[fields.hireDate]}
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  </Col>
                ) : null}
              </Row>
              <Row>
                {[2, 5].includes(values[fields.vestingOption]) ? (
                  <Col md="4">
                    <Field
                      size="md"
                      isRequired
                      label="Participation period"
                      name={fields.participationPeriod}
                      value={values[fields.participationPeriod]}
                      disabled={isEdit && !isSave}
                      options={participationPeriods.data}
                      popupContent={
                        <SearchableList
                          label="Select a Participation period"
                          isNotTypeAhead
                          options={participationPeriods.data}
                          onSelect={(value) =>
                            setFieldValue(fields.participationPeriod, value)
                          }
                          selectedValue={values[fields.participationPeriod]}
                          isRadio
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  </Col>
                ) : null}
                {values[fields.participationPeriod] === 1 ? (
                  <>
                    <Col md="2">
                      <Field
                        size="sm"
                        isRequired
                        label="Start Date"
                        name={fields.participationStartDate}
                        value={usDateFormat(
                          values[fields.participationStartDate]
                        )}
                        disabled={isEdit && !isSave}
                        isDatePicker
                        onClear={() =>
                          setFieldValue(fields.participationStartDate, "")
                        }
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(
                                fields.participationStartDate,
                                value
                              )
                            }
                            value={values[fields.participationStartDate]}
                          />
                        }
                        validate={(value) => {
                          if (!value) return "Required";
                          else if (value > values[fields.participationEndDate])
                            return "Participation Period Start Date should not exceed Participation Period End Date";
                          return null;
                        }}
                        component={FieldDropSide}
                      />
                    </Col>
                    <Col md="2">
                      <Field
                        size="sm"
                        isRequired
                        label="End Date"
                        name={fields.participationEndDate}
                        value={usDateFormat(
                          values[fields.participationEndDate]
                        )}
                        disabled={isEdit && !isSave}
                        isDatePicker
                        onClear={() =>
                          setFieldValue(fields.participationEndDate, "")
                        }
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(fields.participationEndDate, value)
                            }
                            value={values[fields.participationEndDate]}
                          />
                        }
                        validate={required}
                        component={FieldDropSide}
                      />
                    </Col>
                  </>
                ) : null}
                {values[fields.participationPeriod] === 2 ? (
                  <Col md="2">
                    <Field
                      size="sm"
                      isRequired
                      label="Participation Date"
                      name={fields.participationDate}
                      value={usDateFormat(values[fields.participationDate])}
                      disabled={isEdit && !isSave}
                      isDatePicker
                      onClear={() =>
                        setFieldValue(fields.participationDate, "")
                      }
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            onDaySelected(fields.participationDate, value)
                          }
                          value={values[fields.participationDate]}
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  </Col>
                ) : null}
                {values[fields.participationPeriod] === 3 ? (
                  <Col md="2">
                    <Field
                      size="sm"
                      isRequired
                      label="Participation Date"
                      name={fields.participationDate}
                      value={usDateFormat(values[fields.participationDate])}
                      disabled={isEdit && !isSave}
                      isDatePicker
                      onClear={() =>
                        setFieldValue(fields.participationDate, "")
                      }
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            onDaySelected(fields.participationDate, value)
                          }
                          value={values[fields.participationDate]}
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  </Col>
                ) : null}
              </Row>
              {[3, 4, 5].includes(values[fields.vestingOption]) ? (
                <Row>
                  <Col md="4">
                    <Field
                      size="md"
                      isRequired
                      label="Applicable Employee Classifications"
                      name={fields.includedClassifications}
                      value={toMultiSelectValueById(
                        selectedApplicableEmployeeClassification,
                        employeeClassifications
                      )}
                      disabled={isEdit && !isSave}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          label="Select Employee Classifications"
                          name={fields.includedClassifications}
                          onSelect={(value) =>
                            setFieldValue(fields.includedClassifications, value)
                          }
                          value={values[fields.includedClassifications]}
                          options={employeeClassifications}
                          disabled={isEdit && !isSave}
                        />
                      }
                      validate={required}
                      component={FieldDropSide}
                    />
                  </Col>
                </Row>
              ) : null}
              <CommonVestingRules
                fields={fields}
                isEdit={isEdit}
                isSave={isSave}
                isAdditionalVesting
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddVestingRuleContainer;
