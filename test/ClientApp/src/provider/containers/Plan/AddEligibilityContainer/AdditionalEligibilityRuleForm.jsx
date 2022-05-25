import { Field, useFormikContext } from "formik";
import React from "react";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInputNumber,
  SearchableList,
  FieldInput,
} from "../../../components";
import {
  clearFieldValues,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  yesNoOptions,
} from "../../../utils";
import { createPlanStore } from "../../../contexts";

const AdditionalEligibilityRuleForm = ({ values, fields, isEdit, isSave }) => {
  const { setFieldValue, handleChange, setValues } = useFormikContext();
  const applicableEligibilityRequirement =
    values[fields.applicableEligibilityRequirement];
  const serviceRequirement =
    values[fields.eligibilityCalculationPeriod] == 2
      ? OPTIONS_DATA_MAPPER.ONE_YEAR_SERVICE_REQUIREMENT
      : OPTIONS_DATA_MAPPER.SERVICE_REQUIREMENT;

  const onExclusionRuleChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [
        fields.applicableEligibilityRequirement,
        fields.age,
        fields.yearsOfServiceDefinition,
        fields.hours,
        fields.eligibilityCalculationPeriod,
        fields.otherComputationalMonths,
        fields.yearsOfServiceRequirement,
        fields.serviceCreditPeriod,
        fields.daily,
        fields.weekly,
        fields.biweekly,
        fields.semiMonthly,
        fields.monthly,
        fields.quarterly,
        fields.semiAnnually,
        fields.annually,
      ],
    });
    setValues({
      ...updatedValues,
      [fields.immediateEligibility]: value,
    });
  };

  const onEligibilityRequirementChange = (value) => {
    let updatedValues = values;

    if (value === 1) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [
          fields.yearsOfServiceDefinition,
          fields.hours,
          fields.eligibilityCalculationPeriod,
          fields.otherComputationalMonths,
          fields.yearsOfServiceRequirement,
          fields.serviceCreditPeriod,
          fields.activeEmployee,
          fields.disabledEmployee,
          fields.deceasedEmployee,
          fields.deceasedEmployee,
          fields.retiredEmployee,
          fields.retiredEmployee,
          fields.daily,
          fields.weekly,
          fields.biweekly,
          fields.semiMonthly,
          fields.monthly,
          fields.quarterly,
          fields.semiAnnually,
          fields.annually,
          fields.age,
        ],
      });
    } else if (value === 2) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [fields.age],
      });
    } else if (value === 4) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [fields.age],
      });
    }
    setValues({
      ...updatedValues,
      [fields.applicableEligibilityRequirement]: value,
    });
  };

  const onEligibilityCalculationPeriod = (value) => {
    let updatedValues = values;
    updatedValues = clearFieldValues({
      values,
      fieldsToClear: [fields.otherComputationalMonths],
      fieldsToClear: [fields.yearsOfServiceRequirement],
    });
    setValues({
      ...updatedValues,
      [fields.eligibilityCalculationPeriod]: value,
      [fields.isBreakInService]: false,
    });
  };

  const onYearsOfServiceDefinition = (value) => {
    let updatedValues = values;
    if (value === 1) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [
          fields.lengthOfService,
          fields.daily,
          fields.weekly,
          fields.biweekly,
          fields.semiMonthly,
          fields.monthly,
          fields.quarterly,
          fields.semiAnnually,
          fields.annually,
          fields.period,
          fields.hours,
          fields.eligibilityCalculationPeriod,
          fields.otherComputationalMonths,
          fields.yearsOfServiceRequirement,
          fields.serviceCreditPeriod,
        ],
      });
    } else if (value === 2) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [
          fields.hours,
          fields.eligibilityCalculationPeriod,
          fields.otherComputationalMonths,
          fields.yearsOfServiceRequirement,
          fields.serviceCreditPeriod,
          fields.daily,
          fields.weekly,
          fields.biweekly,
          fields.semiMonthly,
          fields.monthly,
          fields.quarterly,
          fields.semiAnnually,
          fields.annually,
          fields.lengthOfService,
          fields.period,
        ],
      });
    } else if (value === 3) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [
          fields.period,
          fields.hours,
          fields.eligibilityCalculationPeriod,
          fields.otherComputationalMonths,
          fields.yearsOfServiceRequirement,
          fields.serviceCreditPeriod,
          fields.lengthOfService,
        ],
      });
    }
    setValues({
      ...updatedValues,
      [fields.yearsOfServiceDefinition]: value,
    });
  };
  const onLengthOfServiceChange = (value) => {
    let updatedValues = clearFieldValues({
      values,
      fieldsToClear: [fields.period, fields.age],
    });
    setValues({
      ...updatedValues,
      [fields.lengthOfService]: value,
    });
  };
  return (
    <div>
      <Field
        isRequired
        size="sm"
        name={fields.immediateEligibility}
        label={"Is this immediate eligibility?"}
        options={yesNoOptions}
        selectedValue={values[fields.immediateEligibility]}
        type="text"
        value={values[fields.immediateEligibility]}
        onChange={onExclusionRuleChange}
        component={FieldButtonGroup}
        validate={(value) => {
          return [undefined, null, ""].includes(value)
            ? "PL567 : Required"
            : undefined;
        }}
        disabled={isEdit && !isSave}
      />

      {values[fields.immediateEligibility] === false && (
        <Field
          isRequired
          size="lg"
          name={fields.applicableEligibilityRequirement}
          label={"Applicable Eligibility Requirement"}
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.ELIGIBILITY_REQUIREMENT
          )}
          selectedValue={applicableEligibilityRequirement}
          type="text"
          value={applicableEligibilityRequirement}
          onChange={onEligibilityRequirementChange}
          component={FieldButtonGroup}
          validate={(value) => {
            return [undefined, null, ""].includes(value)
              ? "PL569 : Required"
              : undefined;
          }}
          disabled={isEdit && !isSave}
        />
      )}

      {[1].includes(applicableEligibilityRequirement) && (
        <Field
          size="xxs"
          isRequired
          name={fields.age}
          label={"Age"}
          hasSuggestion
          shouldDisplaySuggestion
          suggestionDefaultText="Year"
          type="number"
          value={values[fields.age]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputNumber}
          validate={(value) => {
            return [undefined, null, ""].includes(value)
              ? "PL570 : Required"
              : values[fields.age] >= 18 && values[fields.age] <= 99
              ? undefined
              : "PL571 : Eligibility Age must be 18 - 99";
          }}
          min={1}
          max={99}
        />
      )}
      {[4].includes(applicableEligibilityRequirement) && (
        <Field
          size="xxs"
          isRequired
          name={fields.age}
          label={"Age"}
          hasSuggestion
          shouldDisplaySuggestion
          suggestionDefaultText="Year"
          type="number"
          value={values[fields.age]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputNumber}
          validate={(value) => {
            return [undefined, null, ""].includes(value)
              ? "PL570 : Required"
              : values[fields.age] >= 18 && values[fields.age] <= 99
              ? undefined
              : "PL571 : Eligibility Age must be 18 - 99";
          }}
          min={1}
          max={99}
        />
      )}

      {[2, 4].includes(applicableEligibilityRequirement) && (
        <>
          <Field
            isRequired
            size="lg"
            name={fields.yearsOfServiceDefinition}
            label={"Years of Service Definition"}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.SERVICE_DEFINITIONS
            )}
            selectedValue={values[fields.yearsOfServiceDefinition]}
            value={values[fields.yearsOfServiceDefinition]}
            onChange={onYearsOfServiceDefinition}
            component={FieldButtonGroup}
            validate={(value) => {
              return [undefined, null, ""].includes(value)
                ? "PL572 : Required"
                : undefined;
            }}
            disabled={isEdit && !isSave}
          />
          {values[fields.yearsOfServiceDefinition] === 3 && (
            <>
              <p className="plan-sub-heading">
                Equivalency Hours per Frequency
              </p>
              <Field
                isRequired
                size="sm"
                name={fields.daily}
                label={"Daily (hours)"}
                type="number"
                value={values[fields.daily]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={1}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL584 : Required"
                    : values[fields.daily] > 24
                    ? "PL592 : Daily hours should not exceed 24"
                    : undefined;
                }}
                max={99}
              />
              <Field
                isRequired
                size="sm"
                name={fields.weekly}
                label={"Weekly (hours)"}
                type="number"
                value={values[fields.weekly]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={1}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL585 : Required"
                    : values[fields.weekly] > 168
                    ? "PL593 : Weekly hours should not exceed 168"
                    : undefined;
                }}
                max={999}
              />
              <Field
                isRequired
                size="sm"
                name={fields.biweekly}
                label={"Bi-Weekly (hours)"}
                type="number"
                value={values[fields.biweekly]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL586 : Required"
                    : values[fields.biweekly] > 336
                    ? "PL594 : Biweekly hours should not exceed 336"
                    : undefined;
                }}
                min={1}
                max={999}
              />
              <Field
                isRequired
                size="sm"
                name={fields.semiMonthly}
                label={"Semi-monthly (hours)"}
                type="number"
                value={values[fields.semiMonthly]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL587 : Required"
                    : values[fields.semiMonthly] > 384
                    ? "PL595 : Semi-monthly hours should not exceed 384"
                    : undefined;
                }}
                min={1}
                max={999}
              />
              <Field
                isRequired
                size="sm"
                name={fields.monthly}
                label={"Monthly (hours)"}
                type="number"
                value={values[fields.monthly]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={1}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL588 : Required"
                    : values[fields.monthly] > 744
                    ? "PL596 : Monthly hours should not exceed 744"
                    : undefined;
                }}
                max={999}
              />
              <Field
                isRequired
                size="sm"
                name={fields.quarterly}
                label={"Quarterly (hours)"}
                type="number"
                value={values[fields.quarterly]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL589 : Required"
                    : values[fields.quarterly] > 2208
                    ? "PL597 : Quarterly hours should not exceed 2208"
                    : undefined;
                }}
                min={1}
                max={9999}
              />
              <Field
                isRequired
                size="sm"
                name={fields.semiAnnually}
                label={"Semi Annually (hours)"}
                type="number"
                value={values[fields.semiAnnually]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL590 : Required"
                    : values[fields.semiAnnually] > 4392
                    ? "PL598 : Semi Annually hours should not exceed 4392"
                    : undefined;
                }}
                min={1}
                max={9999}
              />
              <Field
                isRequired
                size="sm"
                name={fields.annually}
                label={"Annually (hours)"}
                type="number"
                value={values[fields.annually]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                validate={(value) => {
                  return [undefined, null, "", 0].includes(value)
                    ? "PL591 : Required"
                    : values[fields.annually] > 8760
                    ? "PL599 : Annually hours should not exceed 8760"
                    : undefined;
                }}
                min={1}
                max={9999}
              />
            </>
          )}
          {[1].includes(values[fields.yearsOfServiceDefinition]) && (
            <Field
              size="sm"
              isRequired
              name={fields.hours}
              label={"Actual Hours"}
              type="number"
              value={values[fields.hours]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputNumber}
              validate={(value) => {
                return [undefined, null, "", 0].includes(value)
                  ? "PL582 : Required"
                  : values[fields.hours] > 1000
                  ? "PL583 : Actual hours should not exceed 1000"
                  : undefined;
              }}
              min={1}
              max={9999}
            />
          )}
          {[3].includes(values[fields.yearsOfServiceDefinition]) && (
            <Field
              size="sm"
              isRequired
              name={fields.hours}
              label={"Actual Hours"}
              type="number"
              value={values[fields.hours]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputNumber}
              validate={(value) => {
                return [undefined, null, "", 0].includes(value)
                  ? "PL582 : Required"
                  : values[fields.hours] > 1000
                  ? "PL583 : Actual hours should not exceed 1000"
                  : undefined;
              }}
              nin={1}
              max={9999}
            />
          )}
          {[1, 3].includes(values[fields.yearsOfServiceDefinition]) && (
            <>
              <Field
                isRequired
                size="xl"
                name={fields.eligibilityCalculationPeriod}
                label={"Eligibility Calculation Period"}
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.ELIGIBILITY_CALCULATION
                )}
                selectedValue={values[fields.eligibilityCalculationPeriod]}
                value={values[fields.eligibilityCalculationPeriod]}
                onChange={onEligibilityCalculationPeriod}
                component={FieldButtonGroup}
                validate={(value) => {
                  return [undefined, null, ""].includes(value)
                    ? "PL579 : Required"
                    : undefined;
                }}
                disabled={isEdit && !isSave}
              />
              {values[fields.eligibilityCalculationPeriod] === 3 && (
                <Field
                  size="xxs"
                  isRequired
                  id="Other Computational Period"
                  name={fields.otherComputationalMonths}
                  label={"Other Computational Period"}
                  hasSuggestion
                  shouldDisplaySuggestion
                  suggestionDefaultText="months"
                  type="number"
                  autoComplete="off"
                  value={values[fields.otherComputationalMonths]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInput}
                  validate={(value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL568 : Required"
                      : undefined;
                  }}
                  min={1}
                  max={999}
                />
              )}
              {!(values[fields.eligibilityCalculationPeriod] === 3) && (
                <Field
                  isRequired
                  size="md"
                  name={fields.yearsOfServiceRequirement}
                  label={"Years of Service Requirement"}
                  options={toOptionValuesFromMapper(serviceRequirement)}
                  selectedValue={values[fields.yearsOfServiceRequirement]}
                  value={values[fields.yearsOfServiceRequirement]}
                  onChange={(value) => {
                    setFieldValue(fields.yearsOfServiceRequirement, value);
                  }}
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                  validate={(value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL580 : Required"
                      : undefined;
                  }}
                />
              )}
              <Field
                isRequired
                size="xxl"
                name={fields.serviceCreditPeriod}
                label={"Service Credit period"}
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.CREDIT_PERIOD
                )}
                selectedValue={values[fields.serviceCreditPeriod]}
                value={values[fields.serviceCreditPeriod]}
                onChange={(value) => {
                  setFieldValue(fields.serviceCreditPeriod, value);
                }}
                component={FieldButtonGroup}
                validate={(value) => {
                  return [undefined, null, ""].includes(value)
                    ? "PL581 : Required"
                    : undefined;
                }}
                disabled={isEdit && !isSave}
              />
            </>
          )}
        </>
      )}
      {values[fields.yearsOfServiceDefinition] === 2 && (
        <div className="d-flex">
          {values[fields.lengthOfService] === 1 && (
            <Field
              isRequired
              size="xs"
              name={fields.period}
              label="Length of service requirement"
              type="number"
              value={values[fields.period]}
              onChange={handleChange}
              component={FieldInputNumber}
              disabled={isEdit && !isSave}
              validate={(value) => {
                if (!value) return "PL574 : Required";
                else if (values[fields.lengthOfService] === 1 && value > 730)
                  return "PL575 : No. of days for length of service period should not exceed 730 days";
                else if (values[fields.lengthOfService] === 2 && value > 24)
                  return "PL576 : No. of Months for length of service period should not exceed 24 months";
                else if (values[fields.lengthOfService] === 3 && value > 2)
                  return "PL577 : No. of years for length of service period should not exceed 2 years";
                return null;
              }}
              min={1}
              max={999}
            />
          )}
          {values[fields.lengthOfService] === 2 && (
            <Field
              isRequired
              size="xs"
              name={fields.period}
              label="Length of service requirement"
              type="number"
              value={values[fields.period]}
              onChange={handleChange}
              component={FieldInputNumber}
              disabled={isEdit && !isSave}
              validate={(value) => {
                if (!value) return "PL574 : Required";
                else if (values[fields.lengthOfService] === 1 && value > 730)
                  return "PL575 : No. of days for length of service period should not exceed 730 days";
                else if (values[fields.lengthOfService] === 2 && value > 24)
                  return "PL576 : No. of Months for length of service period should not exceed 24 months";
                else if (values[fields.lengthOfService] === 3 && value > 2)
                  return "PL577 : No. of years for length of service period should not exceed 2 years";
                return null;
              }}
              min={1}
              max={99}
            />
          )}
          {values[fields.lengthOfService] !== 1 &&
            values[fields.lengthOfService] !== 2 && (
              <Field
                isRequired
                size="xs"
                name={fields.period}
                label="Length of service requirement"
                type="number"
                value={values[fields.period]}
                onChange={handleChange}
                component={FieldInputNumber}
                disabled={isEdit && !isSave}
                validate={(value) => {
                  if (!value) return "PL574 : Required";
                  else if (values[fields.lengthOfService] === 1 && value > 730)
                    return "PL575 : No. of days for length of service period should not exceed 730 days";
                  else if (values[fields.lengthOfService] === 2 && value > 24)
                    return "PL576 : No. of Months for length of service period should not exceed 24 months";
                  else if (values[fields.lengthOfService] === 3 && value > 2)
                    return "PL577 : No. of years for length of service period should not exceed 2 years";
                  return null;
                }}
                min={1}
                max={9}
              />
            )}

          <div
            style={{
              marginLeft: "-4.5rem",
            }}
          >
            <Field
              size="sm"
              label=" "
              name={fields.lengthOfService}
              value={values[fields.lengthOfService]}
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.LENGTH_OF_SERVICE
              )}
              popupContent={
                <SearchableList
                  isNotTypeAhead
                  label="Select a Length of service requirement"
                  name={fields.lengthOfService}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.LENGTH_OF_SERVICE
                  )}
                  onSelect={onLengthOfServiceChange}
                  selectedValue={values[fields.lengthOfService]}
                />
              }
              component={FieldDropSide}
              validate={(value) => {
                return [undefined, null, ""].includes(value)
                  ? "PL578 : Required"
                  : undefined;
              }}
              disabled={isEdit && !isSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalEligibilityRuleForm;
