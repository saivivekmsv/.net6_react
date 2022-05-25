import React from "react";
import { Row, Col } from "react-bootstrap";
import { Field } from "formik";
import {
  FieldButtonGroup,
  FieldInputDecimal,
  FieldInputDollar,
  FieldInputPercentage,
} from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  yesNoOptions,
  clearFieldValues,
  required,
  requiredNumber,
} from "../../../utils";

const EmployeeAllocationRules = (props) => {
  const {
    fields,
    values,
    setFieldValue,
    isEdit,
    isSave,
    handleChange,
    setValues,
    isSourceAditionalAllocation,
  } = props;

  const validateLimitMinimum = (value) => {
    if ([undefined, null, ""].includes(value)) return "PL604 : Required";
    else if (value >= values[fields.limitMaximum])
      return "PL607 : Minimum limit amount should not greater than maximum limit";
    return null;
  };

  return (
    <div>
      {/* <Field
        isRequired
        name={fields.isContributionManatory}
        label="Is Contribution mandatory?"
        options={yesNoOptions}
        selectedValue={values[fields.isContributionManatory]}
        onChange={(value) => {
          setFieldValue(fields.isContributionManatory, value);
        }}
        disabled={isEdit && !isSave}
        component={FieldButtonGroup}
        size="sm"
        validate={required}
      /> */}
      <Field
        isRequired
        name={fields.contributionType}
        label="Contribution Type"
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.ALLOCATION_RULES_CONTRIBUTION_TYPE
        )}
        selectedValue={values[fields.contributionType]}
        onChange={(value) => {
          setFieldValue(fields.contributionType, value);
          setFieldValue(fields.limitMinimum, null);
          setFieldValue(fields.limitMaximum, null);
          setFieldValue(fields.maximumDollarCompensation, null);
        }}
        disabled={isEdit && !isSave}
        component={FieldButtonGroup}
        validate={
          isSourceAditionalAllocation
            ? (value) => {
                return [undefined, null, ""].includes(value)
                  ? "PL600 : Required"
                  : undefined;
              }
            : undefined
        }
      />
      {values[fields.contributionType] === 1 && (
        <>
          <Field
            isRequired
            name={fields.limitMinimum}
            label="Limit (Minimum)"
            type="number"
            autoComplete="off"
            min={0}
            value={values[fields.limitMinimum]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputPercentage}
            hasSuggestion={true}
            // suggestionDefaultText={"%"}
            shouldDisplaySuggestion={true}
            size="xs"
            validate={
              isSourceAditionalAllocation ? validateLimitMinimum : undefined
            }
          />
          <Field
            isRequired
            name={fields.limitMaximum}
            label="Limit (Maximum)"
            type="number"
            autoComplete="off"
            min={0}
            value={values[fields.limitMaximum]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputPercentage}
            hasSuggestion={true}
            // suggestionDefaultText={"%"}
            shouldDisplaySuggestion={true}
            size="xs"
            validate={
              isSourceAditionalAllocation
                ? (value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL601 : Required"
                      : undefined;
                  }
                : undefined
            }
          />
          <Field
            name={fields.maximumDollarCompensation}
            isRequired
            label="Maximum Compensation"
            type="number"
            autoComplete="off"
            min={0}
            value={values[fields.maximumDollarCompensation]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputPercentage}
            hasSuggestion={true}
            // suggestionDefaultText={"%"}
            shouldDisplaySuggestion={true}
            size="xs"
            validate={
              isSourceAditionalAllocation
                ? (value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL608 : Required"
                      : undefined;
                  }
                : undefined
            }
          />
        </>
      )}
      {values[fields.contributionType] === 2 && (
        <>
          <Field
            isRequired
            name={fields.limitMinimum}
            label="Limit (Minimum)"
            type="number"
            autoComplete="off"
            preventNegative
            min={0}
            value={values[fields.limitMinimum]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputDollar}
            validate={
              isSourceAditionalAllocation ? validateLimitMinimum : undefined
            }
          />
          <Field
            isRequired
            name={fields.limitMaximum}
            label="Limit (Maximum)"
            preventNegative
            type="number"
            autoComplete="off"
            min={0}
            value={values[fields.limitMaximum]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputDollar}
            validate={
              isSourceAditionalAllocation
                ? (value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL601 : Required"
                      : undefined;
                  }
                : undefined
            }
          />
          <Field
            name={fields.maximumDollarCompensation}
            isRequired
            label="Maximum Compensation"
            preventNegative
            type="number"
            autoComplete="off"
            min={0}
            value={values[fields.maximumDollarCompensation]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputDollar}
            validate={
              isSourceAditionalAllocation
                ? (value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL608 : Required"
                      : undefined;
                  }
                : undefined
            }
          />
        </>
      )}
      <Field
        name={fields.rehireDeferralPercentage}
        label="Deferral percentage for re-hires"
        //isRequired
        type="number"
        autoComplete="off"
        min={0}
        value={values[fields.rehireDeferralPercentage]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInputPercentage}
        hasSuggestion
        // suggestionDefaultText="%"
        shouldDisplaySuggestion
        size="xs"
        // validate={
        //   isSourceAditionalAllocation
        //     ? (value) => {
        //         return [undefined, null, ""].includes(value)
        //           ? "PL611 : Required"
        //           : undefined;
        //       }
        //     : undefined
        // }
      />
      {values[fields.sourceCategory] === 4 && (
        <Field
          isRequired
          name={fields.contributionMethod}
          label="Contribution method"
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.SOURCES_CONTRIBUTION_METHOD
          )}
          selectedValue={values[fields.contributionMethod]}
          onChange={(value) => {
            setFieldValue(fields.contributionMethod, value);
          }}
          disabled={isEdit && !isSave}
          component={FieldButtonGroup}
          validate={isSourceAditionalAllocation ? required : undefined}
        />
      )}
      {/* <div className="d-flex">
        <div>
          <Field
            isRequired
            size="lg"
            name={fields.allocationPercForRehires}
            label="Allocation percentage for re-hires"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.ALLOCATION_RULES_PRCNT_REHIRES
            )}
            selectedValue={values[fields.allocationPercForRehires]}
            onChange={handleAllocationPercForRehires}
            disabled={isEdit && !isSave}
            component={FieldButtonGroup}
          />
        </div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div className="md-ml-4">
          {values[fields.allocationPercForRehires] === 2 && (
            <Field
              isRequired
              name={fields.otherPercForRehires}
              label=" "
              type="number"
              autoComplete="off"
              value={values[fields.otherPercForRehires]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputDecimal}
              hasSuggestion
              suggestionDefaultText="%"
              shouldDisplaySuggestion
              size="xs"
            />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default EmployeeAllocationRules;
