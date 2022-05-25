import React from "react";
import { Field } from "formik";
import {
  FieldButtonGroup,
  FieldInputDecimal,
  FieldInputPercentage,
  FieldInputNumber,
} from "../../../components";

import CommonAllocationRules from "./CommonAllocationRules";
import SafeHarbourMatchRules from "../ManageSourcesNewContainer/SafeHarbourMatchRules";
import {
  OPTIONS_DATA_MAPPER,
  SOURCE_CATEGORY_NAME_MAPPING,
  toOptionValuesFromMapper,
  clearFieldValues,
  yesNoOptions,
} from "../../../utils";

const EmployeeAdditionalAllocationRulesForm = (props) => {
  const {
    sourceCategory,
    handleChange,
    setFieldValue,
    isEdit,
    isSave,
    fields,
    values,
    setValues,
  } = props;

  const handleEmployerMatchContrChange = (value) => {
    setValues({
      ...clearFieldValues({
        values,
        fieldsToClear: [
          fields.percentageOfCalculation,
          fields.percentageOfCompensationMatched,
          fields.firstTierMatchPercent,
          fields.secondTierMatchPercent,
          fields.thirdTierMatchPercent,
          fields.firstTierCompensationMatchPercent,
          fields.secondTierCompensationMatchPercent,
          fields.thirdTierCompensationMatchPercent,
        ],
      }),
      [fields.employerContributionType]: value,
    });
  };
  const isSafeHarbourMatch = values[fields.isSafeHarbourMatch];
  const isCatchApplicableDisabled = (isEdit && !isSave) || isSafeHarbourMatch;
  const isAdiApplicableToDiscretionary =
    parseInt(sourceCategory, 10) === SOURCE_CATEGORY_NAME_MAPPING.Discretionary;
  const isAdiApplicableToMatch =
    parseInt(sourceCategory, 10) === SOURCE_CATEGORY_NAME_MAPPING.Match;
  return (
    <div>
      <CommonAllocationRules {...props} />
      {isAdiApplicableToDiscretionary && (
        <>
          <Field
            name={fields.employerContributionType}
            label="Employer Contribution Type"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.SOURCE_EMPLOYER_MATCH_CONTR_TYPE
            )}
            selectedValue={values[fields.employerContributionType]}
            onChange={handleEmployerMatchContrChange}
            disabled={isEdit && !isSave}
            component={FieldButtonGroup}
            validate={(value) => {
              return [undefined, null, ""].includes(value)
                ? "PL613 : Required"
                : undefined;
            }}
            size="lg"
          />
          <Field
            name={fields.percentageOfCompensation}
            label="Percentage of Compensation"
            type="number"
            autoComplete="off"
            min={0}
            value={values[fields.percentageOfCompensation]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputPercentage}
            hasSuggestion
            // suggestionDefaultText="%"
            shouldDisplaySuggestion
            validate={(value) => {
              return [undefined, null, ""].includes(value)
                ? "PL387 : Required"
                : undefined;
            }}
            size="xxs"
          />
          <Field
            isRequired
            name={fields.periodForCalculation}
            label="Period of calculation"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.PERIOD_OF_CALCULATION
            )}
            selectedValue={values[fields.periodForCalculation]}
            onChange={(value) => {
              setFieldValue(fields.periodForCalculation, value);
            }}
            disabled={isEdit && !isSave}
            component={FieldButtonGroup}
            validate={(value) => {
              return [undefined, null, ""].includes(value)
                ? "PL614 : Required"
                : undefined;
            }}
            size="smd"
          />
        </>
      )}
      {isAdiApplicableToMatch && (
        <>
          <SafeHarbourMatchRules
            {...props}
            isAdiApplicableToMatch
            isSourceAditionalAllocation={true}
          />
          <Field
            isRequired
            name={fields.isCatchApplicable}
            label="Is Catchup Applicable?"
            options={yesNoOptions}
            selectedValue={values[fields.isCatchApplicable]}
            onChange={(value) => {
              setFieldValue(fields.isCatchApplicable, value);
            }}
            disabled={isCatchApplicableDisabled}
            component={FieldButtonGroup}
            size="sm"
          />
        </>
      )}
    </div>
  );
};

export default EmployeeAdditionalAllocationRulesForm;
