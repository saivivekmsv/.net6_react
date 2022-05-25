import React from "react";
import { Field } from "formik";
import {
  FieldButtonGroup,
  FieldInputDecimal,
  FieldInputPercentage,
} from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  clearFieldValues,
  yesNoOptions,
} from "../../../utils";

const EmployerAllocationRules = (props) => {
  const {
    fields,
    isEdit,
    isSave,
    values,
    handleChange,
    setValues,
    isAdiApplicableToMatch,
    isSourceAditionalAllocation,
  } = props;

  const isSafeHarbourMatch = values[fields.isSafeHarbourMatch];
  const isSafeHarbourTypeEnhanced =
    values[fields.safeHarbourType] &&
    parseInt(values[fields.safeHarbourType], 10) === 3;
  const isTieredMatch =
    values[fields.employerContributionType] &&
    parseInt(values[fields.employerContributionType]) === 3;
  const handleSafeHarbourMatchChange = (value) => {
    setValues({
      ...clearFieldValues({
        values,
        fieldsToClear: [
          fields.safeHarbourType,
          fields.enhancedshMatchPercentage,
          fields.uptoPercentageOfDeferral,
          fields.employerContributionType,
        ],
      }),
      [fields.isSafeHarbourMatch]: value,
      [fields.isCatchApplicable]: value,
      [fields.safeHarbourType]: 1,
    });
  };

  const handleSafeHarbourTypeChange = (value) => {
    setValues({
      ...clearFieldValues({
        values,
        fieldsToClear: [
          fields.enhancedshMatchPercentage,
          fields.uptoPercentageOfDeferral,
          fields.firstTierCompensationMatchPercent,
          fields.firstTierMatchPercent,
          fields.secondTierCompensationMatchPercent,
          fields.secondTierMatchPercent,
          fields.thirdTierCompensationMatchPercent,
          fields.thirdTierMatchPercent,
        ],
      }),
      [fields.safeHarbourType]: value,
    });
  };

  const handleEmployerMatchContrChange = (value) => {
    setValues({
      ...clearFieldValues({
        values,
        fieldsToClear: [
          fields.percentageOfCalculation,
          fields.percentageOfCompensation,
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

  return (
    <div>
      {isAdiApplicableToMatch && (
        <Field
          isRequired
          name={fields.isLastDayRuleApplicable}
          label="Last Day Rule Applicable?"
          options={yesNoOptions}
          selectedValue={values[fields.isLastDayRuleApplicable]}
          // onChange={(value) => {
          //   setFieldValue(fields.isLastDayRuleApplicable, value);
          // }}
          disabled={true}
          component={FieldButtonGroup}
          size="sm"
        />
      )}
      <Field
        isRequired
        name={fields.isSafeHarbourMatch}
        label="Safe harbour match?"
        options={yesNoOptions}
        selectedValue={values[fields.isSafeHarbourMatch]}
        onChange={handleSafeHarbourMatchChange}
        disabled={isEdit && !isSave}
        component={FieldButtonGroup}
        size="sm"
        validate={
          isSourceAditionalAllocation
            ? (value) => {
                return [undefined, null, ""].includes(value)
                  ? "PL615 : Required"
                  : undefined;
              }
            : undefined
        }
      />
      {isSafeHarbourMatch === true && (
        <Field
          isRequired
          name={fields.safeHarbourType}
          label="Types of Safe harbour match"
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.SOURCE_SAFE_HARBOUR_TYPES
          )}
          selectedValue={values[fields.safeHarbourType]}
          onChange={handleSafeHarbourTypeChange}
          disabled={isEdit && !isSave}
          component={FieldButtonGroup}
          validate={
            isSourceAditionalAllocation
              ? (value) => {
                  return [undefined, null, ""].includes(value)
                    ? "PL618 : Required"
                    : undefined;
                }
              : undefined
          }
        />
      )}
      {isSafeHarbourMatch === true && isSafeHarbourTypeEnhanced === true && (
        <>
          <Field
            isRequired
            name={fields.enhancedshMatchPercentage}
            label="Enhanced Safe Harbour Match Percentage"
            type="number"
            min={0}
            autoComplete="off"
            value={values[fields.enhancedshMatchPercentage]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputPercentage}
            hasSuggestion
            // suggestionDefaultText="%"
            shouldDisplaySuggestion
            size="xxs"
            validate={
              isSourceAditionalAllocation
                ? (value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL616 : Required"
                      : undefined;
                  }
                : undefined
            }
          />
          <Field
            isRequired
            name={fields.uptoPercentageOfDeferral}
            label="Up to Percentage of Deferral"
            type="number"
            autoComplete="off"
            value={values[fields.uptoPercentageOfDeferral]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputPercentage}
            hasSuggestion
            // suggestionDefaultText="%"
            shouldDisplaySuggestion
            size="xxs"
            validate={
              isSourceAditionalAllocation
                ? (value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL617 : Required"
                      : undefined;
                  }
                : undefined
            }
          />
        </>
      )}
      {isSafeHarbourMatch === false && (
        <>
          <Field
            isRequired
            name={fields.employerContributionType}
            label="Employer Match Contribution Type"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.SOURCE_EMPLOYER_MATCH_CONTR_TYPE
            )}
            selectedValue={values[fields.employerContributionType]}
            onChange={handleEmployerMatchContrChange}
            disabled={isEdit && !isSave}
            component={FieldButtonGroup}
            size="lg"
            validate={
              isSourceAditionalAllocation
                ? (value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL619 : Required"
                      : undefined;
                  }
                : undefined
            }
          />
          {isTieredMatch === false && (
            <>
              <Field
                isRequired
                name={fields.percentageOfCalculation}
                label="Match percent"
                type="number"
                min={0}
                autoComplete="off"
                value={values[fields.percentageOfCalculation]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL622 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
              <Field
                isRequired
                name={fields.percentageOfCompensation}
                label="Percentage of compensation matched"
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
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL621 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
            </>
          )}
          {isTieredMatch === true && (
            <>
              <Field
                isRequired
                name={fields.firstTierMatchPercent}
                label="Tier#1 Match percent"
                type="number"
                min={0}
                autoComplete="off"
                value={values[fields.firstTierMatchPercent]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL623 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
              <Field
                isRequired
                name={fields.firstTierCompensationMatchPercent}
                label="Tier#1 Percentage of compensation matched"
                type="number"
                autoComplete="off"
                min={0}
                value={values[fields.firstTierCompensationMatchPercent]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL624 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
              <Field
                isRequired
                name={fields.secondTierMatchPercent}
                label="Tier#2 Match percent"
                type="number"
                autoComplete="off"
                min={0}
                value={values[fields.secondTierMatchPercent]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL625 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
              <Field
                isRequired
                name={fields.secondTierCompensationMatchPercent}
                label="Tier#2 Percentage of compensation matched"
                type="number"
                autoComplete="off"
                min={0}
                value={values[fields.secondTierCompensationMatchPercent]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL626 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
              <Field
                isRequired
                name={fields.thirdTierMatchPercent}
                label="Tier#3 Match percent"
                type="number"
                autoComplete="off"
                min={0}
                value={values[fields.thirdTierMatchPercent]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL627 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
              <Field
                isRequired
                name={fields.thirdTierCompensationMatchPercent}
                label="Tier#3 Percentage of compensation matched"
                type="number"
                autoComplete="off"
                min={0}
                value={values[fields.thirdTierCompensationMatchPercent]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
                size="xxs"
                validate={
                  isSourceAditionalAllocation
                    ? (value) => {
                        return [undefined, null, ""].includes(value)
                          ? "PL628 : Required"
                          : undefined;
                      }
                    : undefined
                }
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EmployerAllocationRules;
