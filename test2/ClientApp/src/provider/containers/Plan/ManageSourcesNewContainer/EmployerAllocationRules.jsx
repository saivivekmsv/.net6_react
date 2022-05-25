import React, { useContext, useState } from "react";
import { Field } from "formik";
import {
  FieldInput,
  FieldButtonGroup,
  MultiSelectDropdown,
  FieldDropSide,
  FieldInputDecimal,
  FieldInputPercentage,
} from "../../../components";
import { useRequest, useDeepEffect } from "../../../abstracts";
import {
  getEmployeeEmployeeDeferrals,
  getEmploymentStatusList,
} from "../../../services";
import {
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  clearFieldValues,
  yesNoOptions,
  SOURCE_CATEGORY_NAME_MAPPING,
  SOURCE_SUB_CATEGORY_NAME_MAPPING,
  toMultiSelectValueById,
  tranformListToDropdownValues,
} from "../../../utils";
import SafeHarbourMatchRules from "./SafeHarbourMatchRules";
import { createPlanStore } from "../../../contexts";

import { get } from "lodash";

const EmployerAllocationRules = (props) => {
  const {
    fields,
    setFieldValue,
    isEdit,
    isSave,
    values,
    handleChange,
    setValues,
  } = props;
  const { loading, response } = useRequest({
    method: getEmployeeEmployeeDeferrals,
    defaultResponse: [],
  });
  const isCore = parseInt(values[fields.responsibleMode], 10) === 2;
  const isValidate = parseInt(values[fields.responsibleMode], 10) === 3;

  const isDiscretionary = parseInt(values[fields.sourceCategory], 10) === 5;
  const isAdiApplicableToMatch =
    parseInt(values[fields.sourceCategory], 10) ===
    SOURCE_CATEGORY_NAME_MAPPING.Match;
  const { state, dispatch } = useContext(createPlanStore);
  const sourcesApiData = get(state, "api.data.sources", []);
  const deferralSources = sourcesApiData
    ?.filter((val) => val.sourceCategory === 2)
    ?.map((source) => ({
      label: source.sourceName,
      value: source.id,
    }));
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
  const handleresponsibleMode = (value) => {
    setValues({
      ...clearFieldValues({
        values,
        fieldsToClear: [
          fields.eligiblePaymentType,
          fields.employerContributionType,
          fields.percentageOfCompensation,
          fields.periodForCalculation,
          fields.isCatchApplicable,
          fields.isCalculationSuspended,
          fields.isTrueUpApplicable,
          fields.isLastDayRuleApplicable,
          fields.isSafeHarbourMatch,
          fields.safeHarbourType,
          fields.enhancedshMatchPercentage,
          fields.uptoPercentageOfDeferral,
          fields.percentageOfCalculation,
          fields.percentageOfCompensationMatched,
          fields.firstTierMatchPercent,
          fields.secondTierMatchPercent,
          fields.thirdTierMatchPercent,
          fields.firstTierCompensationMatchPercent,
          fields.secondTierCompensationMatchPercent,
          fields.thirdTierCompensationMatchPercent,
          fields.sourceOfMatch,
        ],
      }),
      [fields.responsibleMode]: value,
      [fields.eligiblePaymentType]: 1,
      [fields.isCatchApplicable]: false,
      [fields.isThresholdApplicable]: true,
      [fields.isTrueUpApplicable]: false,
      [fields.isLastDayRuleApplicable]: false,
    });
  };
  const selectedSourceOfMatch = values[fields.sourceOfMatch];
  const sourceCategory = parseInt(values[fields.sourceCategory], 10);
  const isAdiApplicableToOther =
    sourceCategory &&
    sourceCategory === SOURCE_CATEGORY_NAME_MAPPING.EmployerOther;
  const isSubCatergoryQmac =
    values[fields.sourceSubCategory] &&
    parseInt(values[fields.sourceSubCategory], 10) ===
      SOURCE_SUB_CATEGORY_NAME_MAPPING.QMAC;
  const isSafeHarbourMatch = values[fields.isSafeHarbourMatch];
  const isCalculationSuspended = values[fields.isCalculationSuspended];
  const isCatchApplicableDisabled = (isEdit && !isSave) || isSafeHarbourMatch;
  const [filteredValues, setFilteredValues] = useState([]);
  useDeepEffect(() => {
    getEmploymentStatusList(get(state, "api.data.companyId", 0))
      .then((response) => {
        setFilteredValues(
          response
            .filter((x) => x.employmentStatusCode !== "P")
            .map((val) => ({
              label: val.employmentStatusName,
              value: val.id,
            }))
        );
      })
      .catch((error) => {
        //Handle Error
      });
  }, []);

  if (isAdiApplicableToOther === true) {
    return (
      <>
        {isSubCatergoryQmac === true && (
          <>
            <Field
              isRequired
              name={fields.qmacType}
              label="QMAC Type"
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.SOURCE_QMAC_QNEC_TYPE
              )}
              selectedValue={values[fields.qmacType]}
              onChange={(value) => {
                setFieldValue(fields.qmacType, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
            />
            <Field
              isRequired
              name={fields.qmacBefore1989}
              label="QMAC made before 1989"
              type="text"
              autoComplete="off"
              value={values[fields.qmacBefore1989]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInput}
            />
          </>
        )}
        {isSubCatergoryQmac === false && (
          <>
            <Field
              isRequired
              name={fields.qmacType}
              label="QNEC Type"
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.SOURCE_QMAC_QNEC_TYPE
              )}
              selectedValue={values[fields.qmacType]}
              onChange={(value) => {
                setFieldValue(fields.qmacType, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
            />
            <Field
              isRequired
              name={fields.qnecBefore1989}
              label="QNEC made before 1989"
              type="text"
              autoComplete="off"
              value={values[fields.qnecBefore1989]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInput}
            />
          </>
        )}
        {typeof isSubCatergoryQmac === "boolean" && (
          <Field
            isRequired
            name={fields.employeeGroupsApplicable}
            label="Employee groups applicable"
            type="text"
            autoComplete="off"
            value={values[fields.employeeGroupsApplicable]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
          />
        )}
      </>
    );
  }

  return (
    <div>
      {values[fields.sourceCategory] == 8 ? (
        <Field
          isRequired
          name={fields.responsibleMode}
          label="Responsible for calculation"
          options={toOptionValuesFromMapper({
            1: "Client",
          })}
          selectedValue={values[fields.responsibleMode]}
          onChange={handleresponsibleMode}
          disabled={isEdit && !isSave}
          component={FieldButtonGroup}
          size="md"
        />
      ) : (
        <Field
          isRequired
          name={fields.responsibleMode}
          label="Responsible for calculation"
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.SOURCES_EMPLOYER_RESPONSIBLE_FOR_CALC
          )}
          selectedValue={values[fields.responsibleMode]}
          onChange={handleresponsibleMode}
          disabled={isEdit && !isSave}
          component={FieldButtonGroup}
          size="md"
        />
      )}
      {isCore && (
        <div>
          {values[fields.sourceCategory] === 5 && (
            <Field
              name={fields.isSafeHarbourMatch}
              label="Safe harbour match?"
              options={yesNoOptions}
              selectedValue={values[fields.isSafeHarbourMatch]}
              onChange={(value) => {
                setFieldValue(fields.isSafeHarbourMatch, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
            />
          )}
          {values[fields.sourceCategory] === 5 && (
            <Field
              name={fields.isCalculationSuspended}
              label="Calculation Suspended?"
              options={yesNoOptions}
              selectedValue={values[fields.isCalculationSuspended]}
              onChange={(value) => {
                setFieldValue(fields.isCalculationSuspended, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
              size="sm"
            />
          )}
          {values[fields.sourceCategory] === 5 && (
            <Field
              isRequired
              name={fields.isTrueUpApplicable}
              label="is Trueup Applicable?"
              options={yesNoOptions}
              selectedValue={values[fields.isTrueUpApplicable]}
              onChange={(value) => {
                setFieldValue(fields.isTrueUpApplicable, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
              size="sm"
            />
          )}

          <Field
            isRequired
            name={fields.eligiblePaymentType}
            label="Eligible Pay Determination based on"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.SOURCES_ELIGIBLE_PAY_DETERMINATION
            )}
            selectedValue={values[fields.eligiblePaymentType]}
            onChange={(value) => {
              setFieldValue(fields.eligiblePaymentType, value);
            }}
            disabled={isEdit && !isSave}
            component={FieldButtonGroup}
          />
          {!isAdiApplicableToMatch && (
            <>
              <Field
                isRequired
                name={fields.employerContributionType}
                label="Employer Contribution Type"
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.SOURCE_EMPLOYER_DISCRETIONARY_CONTR_TYPE
                )}
                selectedValue={values[fields.employerContributionType]}
                onChange={handleEmployerMatchContrChange}
                disabled={isEdit && !isSave}
                component={FieldButtonGroup}
                size="lg"
              />
              <Field
                isRequired
                name={fields.percentageOfCompensation}
                label="Percentage of Compensation"
                type="number"
                min={0}
                autoComplete="off"
                value={values[fields.percentageOfCompensation]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
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
                size="smd"
              />
            </>
          )}
          {isAdiApplicableToMatch && (
            <>
              <Field
                isRequired
                label="Source of Match"
                name={fields.sourceOfMatch}
                value={toMultiSelectValueById(
                  selectedSourceOfMatch,
                  deferralSources
                )}
                isMultiSelect
                popupContent={
                  <MultiSelectDropdown
                    label="Select Sources of Match"
                    name={fields.sourceOfMatch}
                    onSelect={(value) =>
                      setFieldValue(fields.sourceOfMatch, value)
                    }
                    value={values[fields.sourceOfMatch]}
                    options={deferralSources}
                    isLoading={loading}
                    disabled={isEdit && !isSave}
                  />
                }
                disabled={isEdit && !isSave}
                component={FieldDropSide}
              />
              <Field
                name={fields.isLastDayRuleApplicable}
                label="Last Day Rule Applicable"
                options={yesNoOptions}
                selectedValue={values[fields.isLastDayRuleApplicable]}
                onChange={(value) => {
                  setFieldValue(fields.isLastDayRuleApplicable, value);
                }}
                disabled={isEdit && !isSave}
                component={FieldButtonGroup}
                size="sm"
                isRequired
              />

              {values[fields.isLastDayRuleApplicable] == true && (
                <div className="sources-select-employmentsources">
                  <div className="mb-15">
                    <Field
                      isRequired
                      name={fields.employmentStatus}
                      label={"Employment Status"}
                      value={toMultiSelectValueById(
                        values[fields.employmentStatus],
                        filteredValues
                      )}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          isTypeAhead
                          options={filteredValues}
                          maxHeight="180px"
                          height="160px"
                          label={"Search"}
                          hideSelectAll={false}
                          onSelect={(value) =>
                            setFieldValue(fields.employmentStatus, value)
                          }
                          value={values[fields.employmentStatus]}
                          disabled={isEdit && !isSave}
                        />
                      }
                      disabled={isEdit && !isSave}
                      component={FieldDropSide}
                    />
                  </div>
                </div>
              )}
              <SafeHarbourMatchRules {...props} />
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
                size="smd"
              />
              <Field
                name={fields.isCalculationSuspended}
                label="Calculation Suspended?"
                options={yesNoOptions}
                selectedValue={values[fields.isCalculationSuspended]}
                onChange={(value) => {
                  setFieldValue(fields.isCalculationSuspended, value);
                }}
                disabled={isEdit && !isSave}
                component={FieldButtonGroup}
                size="sm"
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
              <Field
                isRequired
                name={fields.isTrueUpApplicable}
                label="Is Trueup Applicable?"
                options={yesNoOptions}
                selectedValue={values[fields.isTrueUpApplicable]}
                onChange={(value) => {
                  setFieldValue(fields.isTrueUpApplicable, value);
                }}
                disabled={isEdit && !isSave}
                component={FieldButtonGroup}
                size="sm"
              />
            </>
          )}
        </div>
      )}

      {isValidate && (
        <div>
          {
            <Field
              isRequired
              name={fields.isThresholdApplicable}
              label="Threshold applicable?"
              options={yesNoOptions}
              selectedValue={values[fields.isThresholdApplicable]}
              onChange={(value) => {
                setFieldValue(fields.isThresholdApplicable, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
              size="sm"
            />
          }
          {values[fields.sourceCategory] === 5 && (
            <Field
              name={fields.isSafeHarbourMatch}
              label="Safe harbour match?"
              options={yesNoOptions}
              selectedValue={values[fields.isSafeHarbourMatch]}
              onChange={(value) => {
                setFieldValue(fields.isSafeHarbourMatch, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
            />
          )}

          {values[fields.sourceCategory] === 5 && (
            <Field
              name={fields.isCalculationSuspended}
              label="Calculation Suspended?"
              options={yesNoOptions}
              selectedValue={values[fields.isCalculationSuspended]}
              onChange={(value) => {
                setFieldValue(fields.isCalculationSuspended, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
              size="sm"
            />
          )}
          {values[fields.sourceCategory] === 5 && (
            <Field
              isRequired
              name={fields.isTrueUpApplicable}
              label="is Trueup Applicable?"
              options={yesNoOptions}
              selectedValue={values[fields.isTrueUpApplicable]}
              onChange={(value) => {
                setFieldValue(fields.isTrueUpApplicable, value);
              }}
              disabled={isEdit && !isSave}
              component={FieldButtonGroup}
              size="sm"
            />
          )}
          <Field
            isRequired
            name={fields.eligiblePaymentType}
            label="Eligible Pay Determination based on"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.SOURCES_ELIGIBLE_PAY_DETERMINATION
            )}
            selectedValue={values[fields.eligiblePaymentType]}
            onChange={(value) => {
              setFieldValue(fields.eligiblePaymentType, value);
            }}
            disabled={isEdit && !isSave}
            component={FieldButtonGroup}
          />
          {!isAdiApplicableToMatch && (
            <>
              <Field
                isRequired
                name={fields.employerContributionType}
                label="Employer Contribution Type"
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.SOURCE_EMPLOYER_DISCRETIONARY_CONTR_TYPE
                )}
                selectedValue={values[fields.employerContributionType]}
                onChange={handleEmployerMatchContrChange}
                disabled={isEdit && !isSave}
                component={FieldButtonGroup}
                size="lg"
              />
              <Field
                isRequired
                name={fields.percentageOfCompensation}
                label="Percentage of Compensation"
                type="number"
                min={0}
                autoComplete="off"
                value={values[fields.percentageOfCompensation]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                hasSuggestion
                // suggestionDefaultText="%"
                shouldDisplaySuggestion
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
                size="lg"
              />
            </>
          )}
          {isAdiApplicableToMatch && (
            <>
              <Field
                isRequired
                label="Source of Match"
                name={fields.sourceOfMatch}
                value={toMultiSelectValueById(
                  selectedSourceOfMatch,
                  deferralSources
                )}
                isMultiSelect
                popupContent={
                  <MultiSelectDropdown
                    label="Select Sources of Match"
                    name={fields.sourceOfMatch}
                    onSelect={(value) =>
                      setFieldValue(fields.sourceOfMatch, value)
                    }
                    value={values[fields.sourceOfMatch]}
                    options={deferralSources}
                    isLoading={loading}
                    disabled={isEdit && !isSave}
                  />
                }
                disabled={isEdit && !isSave}
                component={FieldDropSide}
              />
              <SafeHarbourMatchRules {...props} />
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
                size="lg"
              />
              <Field
                name={fields.isCalculationSuspended}
                label="Calculation Suspended?"
                options={yesNoOptions}
                selectedValue={values[fields.isCalculationSuspended]}
                onChange={(value) => {
                  setFieldValue(fields.isCalculationSuspended, value);
                }}
                disabled={isEdit && !isSave}
                component={FieldButtonGroup}
                size="sm"
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
              <Field
                isRequired
                name={fields.isTrueUpApplicable}
                label="is Trueup Applicable?"
                options={yesNoOptions}
                selectedValue={values[fields.isTrueUpApplicable]}
                onChange={(value) => {
                  setFieldValue(fields.isTrueUpApplicable, value);
                }}
                disabled={isEdit && !isSave}
                component={FieldButtonGroup}
                size="sm"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerAllocationRules;
