import { Field } from "formik";
import { get, isEmpty } from "lodash";
import React, { useState } from "react";
import { useContext } from "react";
import { useDeepEffect, useRequest } from "../../../abstracts";
import {
  FieldButtonGroup,
  SearchableList,
  FieldDropSide,
  FieldInput,
  FieldInputDollar,
  MultiSelectDropdown,
  FieldMultiSelectButtonGroup,
  FieldInputNumber,
} from "../../../components";
import { createPlanStore } from "../../../contexts";
import { getClassificationCodes } from "../../../services";
import { getEmploymentStatusList } from "../../../services/census";
import {
  required,
  yesNoOptions,
  calendarFrequencyOptions,
  clearFieldValues,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  toMultiSelectValue,
  contextSharing,
  toMultiSelectValueById,
} from "../../../utils";
import PaymentFrequencyFields from "./PaymentFrequencyFields";

const paymentFrequencyRMD = [
  {
    value: 1,
    label: "FixedDate",
  },
];

const distributionAllocationRmd = [
  {
    value: 1,
    label: "Prorata By Choice",
  },
];

const DistributionsOptionsFormFields = (props) => {
  const {
    fields,
    values,
    handleChange,
    isEdit,
    isSave,
    setFieldValue,
    isRmd,
    isInService,
    isHardShips,
    setValues,
    setTouched,
    isSfs,
    initialValues,
  } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [excludedEmploymentStatus, setExcludedEmploymentStatus] = useState([]);
  const [
    excludedEmployeeClassifications,
    setExcludedEmployeeClassifications,
  ] = useState([]);
  const suspendedSources = get(state, "api.data.sources", [])
    ?.filter((val) => val.sourceCategory === 2)
    ?.map((source) => ({
      label: source.sourceName,
      value: source.id,
    }));

  useDeepEffect(() => {
    getEmploymentStatusList(get(state, "api.data.companyId", 0))
      .then((response) =>
        setExcludedEmploymentStatus(
          response.map((val) => ({
            label: val.employmentStatusCode + "-" + val.employmentStatusName,
            value: val.id,
          }))
        )
      )
      .catch((error) => {
        //Handle Error
      });
    getClassificationCodes(get(state, "api.data.companyId", 0))
      .then((response) => {
        setExcludedEmployeeClassifications(
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

  const onIsSuspensionLengthApplicableChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [
        fields.suspensionPeriodYears,
        fields.suspensionPeriodMonths,
        fields.suspendedSources,
      ],
    });
    setValues({
      ...updatedValues,
      [fields.lengthOfSuspensionApplicable]: value,
    });
    setTouched({
      [fields.suspensionPeriodYears]: false,
      [fields.suspensionPeriodMonths]: false,
      [fields.suspendedSources]: false,
    });
  };

  const onRestricNumberOfHardshipsChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [
        fields.restrictedPeriodValue,
        fields.restrictedPeriodTypeFrequency,
        fields.maximumNoOfHardShips,
        fields.totalMaximumNoOfHardShips,
      ],
    });
    setValues({
      ...updatedValues,
      [fields.restrictNumberOfHardshipsInDefinedPeriod]: value,
    });
    setTouched({
      [fields.restrictedPeriodValue]: false,
      [fields.restrictedPeriodTypeFrequency]: false,
      [fields.maximumNoOfHardShips]: false,
      [fields.totalMaximumNoOfHardShips]: false,
    });
  };

  const selectedExcludedEmploymentStatus =
    values[fields.excludedEmploymentStatuses];
  const selectedExcludedEmployeeClassifications =
    values[fields.excludedEmployeeClassifications];
  const selectedSuspendedSources = values[fields.suspendedSources];

  return (
    <div>
      <p className="plan-sub-heading">Distribution Options</p>
      {isInService && (
        <>
          <Field
            isRequired
            size="sm"
            label="Age Restriction Applicable"
            name={fields.ageLimitApplicable}
            options={yesNoOptions}
            selectedValue={values[fields.ageLimitApplicable]}
            component={FieldButtonGroup}
            disabled={isEdit && !isSave}
            onChange={(value) => {
              setFieldValue(fields.ageLimitApplicable, value);
            }}
          />
          {values[fields.ageLimitApplicable] && (
            <div className="d-flex">
              <Field
                size="xxs"
                isRequired
                name={fields.years}
                label={"Age Restriction"}
                hasSuggestion
                shouldDisplaySuggestion
                suggestionDefaultText="Years"
                type="number"
                autoComplete="off"
                value={values[fields.years]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={0}
                max={99}
              />
              &nbsp;&nbsp;&nbsp;
              <div
                style={{
                  marginLeft: "0",
                }}
              >
                <Field
                  size="xxs"
                  isRequired
                  name={fields.months}
                  label=""
                  hasSuggestion
                  shouldDisplaySuggestion
                  suggestionDefaultText="Months"
                  type="number"
                  autoComplete="off"
                  value={values[fields.months]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInputNumber}
                  min={0}
                  max={11}
                />
              </div>
            </div>
          )}
        </>
      )}
      {!isRmd && (
        <div>
          <Field
            isRequired
            size="sm"
            name={fields.waiveOffLimitApplicable}
            label={
              isHardShips
                ? "Early Waive Off Limit Applicable"
                : "Waive Off Limit if Applicable"
            }
            options={yesNoOptions}
            selectedValue={values[fields.waiveOffLimitApplicable]}
            value={values[fields.waiveOffLimitApplicable]}
            onChange={(value) => {
              setFieldValue(fields.waiveOffLimitApplicable, value);
              // setFieldValue(
              //   fields.waiveOffLimit,
              //   values.id ? initialValues[fields.waiveOffLimit] : null
              // );
            }}
            component={FieldButtonGroup}
            disabled={isEdit && !isSave}
          />
          {values[fields.waiveOffLimitApplicable] && (
            <Field
              isRequired
              name={fields.waiveOffLimit}
              label={isHardShips ? "Early Waive Off Limit" : "Waive off Limit"}
              type="number"
              autoComplete="off"
              value={values[fields.waiveOffLimit]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputDollar}
            />
          )}
        </div>
      )}
      {
        <Field
          isRequired
          name={fields.minimumWithDrawalLimitAmount}
          label={"Minimum Withdrawal Limit"}
          type="number"
          autoComplete="off"
          value={values[fields.minimumWithDrawalLimitAmount]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputDollar}
        />
      }
      {!isHardShips && (
        <div className="d-flex">
          <Field
            size="md"
            isRequired
            label="Withdrawal Limit per period"
            name={fields.withdrawalLimitPerPeriod}
            value={values[fields.withdrawalLimitPerPeriod]}
            disabled={isEdit && !isSave}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.WITHDRAWAL_LIMIT_PERIOD
            )}
            popupContent={
              <SearchableList
                label="Select a Type"
                isNotTypeAhead
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.WITHDRAWAL_LIMIT_PERIOD
                )}
                onSelect={(value) => {
                  setFieldValue(fields.withdrawalLimitPerPeriod, value);
                  // setFieldValue(fields.numberOfWithdrawalAllowed, values.id ? initialValues[fields.numberOfWithdrawalAllowed] : null);
                }}
                selectedValue={values[fields.withdrawalLimitPerPeriod]}
              />
            }
            component={FieldDropSide}
          />
          {/* &nbsp;&nbsp;&nbsp;
          <Field
            size="xs"
            isRequired
            name={fields.withdrawalLimitPerPeriodValue}
            type="number"
            label=""
            autoComplete="off"
            value={values[fields.withdrawalLimitPerPeriodValue]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
            
          /> */}
        </div>
      )}
      {!isHardShips &&
        values[fields.withdrawalLimitPerPeriod] &&
        values[fields.withdrawalLimitPerPeriod] !== 5 && (
          <Field
            size="sm"
            isRequired
            name={fields.numberOfWithdrawalAllowed}
            label="Number of Withdrawals allowed"
            type="number"
            autoComplete="off"
            value={values[fields.numberOfWithdrawalAllowed]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInputNumber}
            min={0}
            max={99}
          />
        )}
      {/* {isHardShips && (
        <div className="d-flex">
          <Field
            isRequired
            label={"Minimum Withdrawal Limit"}
            name={fields.minimumWithdrawalType}
            value={values[fields.minimumWithdrawalType]}
            disabled={isEdit && !isSave}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.DISTRIBUTION_WITHDRAWAL_TYPE
            )}
            popupContent={
              <SearchableList
                label="Select a Withdrawal Limit"
                isNotTypeAhead
                isRadio
                selectedValue={values[fields.minimumWithdrawalType]}
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.DISTRIBUTION_WITHDRAWAL_TYPE
                )}
                onSelect={(value) =>
                  setFieldValue(fields.minimumWithdrawalType, value)
                }
              />
            }
            size="smd"
            component={FieldDropSide}
          /> */}
      {/* &nbsp;&nbsp;&nbsp;
          {values[fields.minimumWithdrawalType] === 1 ? (
            <Field
              size="xxs"
              name={fields.minimumWithdrawalLimitValue}
              label={" "}
              type="number"
              autoComplete="off"
              value={values[fields.minimumWithdrawalLimitValue]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputDollar}
            />
          ) : (
            <Field
              size="xxs"
              name={fields.minimumWithdrawalLimitValue}
              label={" "}
              type="number"
              autoComplete="off"
              value={values[fields.minimumWithdrawalLimitValue]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInput}
              hasSuggestion
              shouldDisplaySuggestion
              suggestionDefaultText="%"
            />
          )} */}
      {/* </div>
      )} */}
      {isHardShips && (
        <Field
          isRequired
          size="sm"
          name={fields.requiresInServiceWithdrawalPriorToHardshipRequest}
          label={"Requires In-Service Withdrawal Prior to Hardship Request?"}
          options={yesNoOptions}
          selectedValue={
            values[fields.requiresInServiceWithdrawalPriorToHardshipRequest]
          }
          value={
            values[fields.requiresInServiceWithdrawalPriorToHardshipRequest]
          }
          onChange={(value) => {
            setFieldValue(
              fields.requiresInServiceWithdrawalPriorToHardshipRequest,
              value
            );
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {isHardShips && (
        <Field
          isRequired
          size="sm"
          name={fields.requiresLoanRequestPriorToHardshipRequest}
          label={"Requires Loan Request Prior to Hardship Request?"}
          options={yesNoOptions}
          selectedValue={
            values[fields.requiresLoanRequestPriorToHardshipRequest]
          }
          value={values[fields.requiresLoanRequestPriorToHardshipRequest]}
          onChange={(value) => {
            setFieldValue(
              fields.requiresLoanRequestPriorToHardshipRequest,
              value
            );
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      <br />
      <Field
        isRequired
        size="sm"
        name={fields.processLesserAmountIfMaximumIsNotAvailable}
        label={"Process Lesser Amount if Maximum is Not Available?"}
        options={yesNoOptions}
        selectedValue={
          values[fields.processLesserAmountIfMaximumIsNotAvailable]
        }
        value={values[fields.processLesserAmountIfMaximumIsNotAvailable]}
        onChange={(value) => {
          setFieldValue(
            fields.processLesserAmountIfMaximumIsNotAvailable,
            value
          );
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      <br />
      <Field
        isRequired
        size="sm"
        name={fields.spouseConsentRequired}
        label={"Spousal Consent Required?"}
        options={yesNoOptions}
        selectedValue={values[fields.spouseConsentRequired]}
        value={values[fields.spouseConsentRequired]}
        onChange={(value) => {
          setFieldValue(fields.spouseConsentRequired, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        isRequired
        size="sm"
        name={fields.sponsorApprovalRequired}
        label={"Sponsor Approval Required?"}
        options={yesNoOptions}
        selectedValue={values[fields.sponsorApprovalRequired]}
        value={values[fields.sponsorApprovalRequired]}
        onChange={(value) => {
          setFieldValue(fields.sponsorApprovalRequired, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      {isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.defaultPaymentFrequnecyForAutoRMD}
          label={"Default Payment Frequency for Auto RMD"}
          options={paymentFrequencyRMD}
          selectedValue={values[fields.defaultPaymentFrequnecyForAutoRMD]}
          value={values[fields.defaultPaymentFrequnecyForAutoRMD]}
          onChange={(value) => {
            setFieldValue(fields.defaultPaymentFrequnecyForAutoRMD, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {(isRmd || isSfs) && <PaymentFrequencyFields {...props} />}
      {isRmd && (
        <Field
          isRequired
          size="smd"
          name={fields.distributionAllocationMethodCommon}
          label={"Default Distribution Allocation Methods for Auto RMD"}
          options={distributionAllocationRmd}
          selectedValue={values[fields.distributionAllocationMethodCommon]}
          value={values[fields.distributionAllocationMethodCommon]}
          onChange={(value) => {
            setFieldValue(fields.distributionAllocationMethodCommon, value);
          }}
          component={FieldMultiSelectButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.availableToBeneficiaries}
          label={"Available to Beneficiaries?"}
          options={yesNoOptions}
          selectedValue={values[fields.availableToBeneficiaries]}
          value={values[fields.availableToBeneficiaries]}
          onChange={(value) => {
            setFieldValue(fields.availableToBeneficiaries, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.availableToAlternatePayees}
          label={"Available to Alternate Payees?"}
          options={yesNoOptions}
          selectedValue={values[fields.availableToAlternatePayees]}
          value={values[fields.availableToAlternatePayees]}
          onChange={(value) => {
            setFieldValue(fields.availableToAlternatePayees, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      <br />
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.allowOptingOutOfFederlWithholdingTax}
          label={"Allow opting out of Federal Withholding Tax?"}
          options={yesNoOptions}
          selectedValue={values[fields.allowOptingOutOfFederlWithholdingTax]}
          value={values[fields.allowOptingOutOfFederlWithholdingTax]}
          onChange={(value) => {
            setFieldValue(fields.allowOptingOutOfFederlWithholdingTax, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.allowOptingOutOfStateWithholdingTax}
          label={"Allow opting out of State Withholding Tax?"}
          options={yesNoOptions}
          selectedValue={values[fields.allowOptingOutOfStateWithholdingTax]}
          value={values[fields.allowOptingOutOfStateWithholdingTax]}
          onChange={(value) => {
            setFieldValue(fields.allowOptingOutOfStateWithholdingTax, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.allowChangingOfFederalWithholdingTax}
          label={"Allow changing of Federal Withholding Tax?"}
          options={yesNoOptions}
          selectedValue={values[fields.allowChangingOfFederalWithholdingTax]}
          value={values[fields.allowChangingOfFederalWithholdingTax]}
          onChange={(value) => {
            setFieldValue(fields.allowChangingOfFederalWithholdingTax, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.allowChangingOfStateWithholdingTax}
          label={"Allow changing of State Withholding Tax?"}
          options={yesNoOptions}
          selectedValue={values[fields.allowChangingOfStateWithholdingTax]}
          value={values[fields.allowChangingOfStateWithholdingTax]}
          onChange={(value) => {
            setFieldValue(fields.allowChangingOfStateWithholdingTax, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      <br />
      {isSfs && (
        <Field
          isRequired
          size="smd"
          name={fields.dateOfAnnuityPayments}
          label={"Date of Annuity Payments"}
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.ANNUITY_PAYMENTS
          )}
          selectedValue={values[fields.dateOfAnnuityPayments]}
          value={values[fields.dateOfAnnuityPayments]}
          onChange={(value) => {
            setFieldValue(fields.dateOfAnnuityPayments, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {/* {isSfs && <PaymentFrequencyFields {...props} />}
      <Field
        size="xs"
        name={fields.interestRate}
        label={"Interest Rate"}
        type="number"
        autoComplete="off"
        value={values[fields.interestRate]}
        selectedValue={values[fields.interestRate]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        
        hasSuggestion
        shouldDisplaySuggestion
        suggestionDefaultText="%"
      /> */}
      {isHardShips && (
        <div className="hardshipsadditional-form-flied">
          <Field
            isRequired
            size="sm"
            name={fields.lengthOfSuspensionApplicable}
            label={"Length of Suspension Applicable?"}
            options={yesNoOptions}
            selectedValue={values[fields.lengthOfSuspensionApplicable]}
            value={values[fields.lengthOfSuspensionApplicable]}
            onChange={onIsSuspensionLengthApplicableChange}
            component={FieldButtonGroup}
            disabled={isEdit && !isSave}
          />
          {values[fields.lengthOfSuspensionApplicable] && (
            <>
              <div className="d-flex">
                <Field
                  size="xxs"
                  isRequired
                  name={fields.suspensionPeriodYears}
                  label={"Length of suspension Period"}
                  hasSuggestion
                  shouldDisplaySuggestion
                  suggestionDefaultText="Years"
                  type="number"
                  autoComplete="off"
                  value={values[fields.suspensionPeriodYears]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInputNumber}
                  min={0}
                  max={99}
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "-3rem",
                  }}
                >
                  <Field
                    size="xxs"
                    isRequired
                    label=""
                    name={fields.suspensionPeriodMonths}
                    hasSuggestion
                    shouldDisplaySuggestion
                    suggestionDefaultText="Months"
                    type="number"
                    autoComplete="off"
                    value={values[fields.suspensionPeriodMonths]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputNumber}
                    min={0}
                    max={11}
                  />
                </div>
              </div>
              <Field
                label="Suspended Sources"
                name={fields.suspendedSources}
                value={toMultiSelectValueById(
                  selectedSuspendedSources,
                  suspendedSources
                )}
                disabled={isEdit && !isSave}
                isMultiSelect
                popupContent={
                  <MultiSelectDropdown
                    label="Select Suspended Sources"
                    name={fields.suspendedSources}
                    onSelect={(value) =>
                      setFieldValue(fields.suspendedSources, value)
                    }
                    value={values[fields.suspendedSources]}
                    options={suspendedSources}
                    disabled={isEdit && !isSave}
                  />
                }
                component={FieldDropSide}
              />
            </>
          )}
          <br />
          <Field
            isRequired
            size="sm"
            name={fields.restrictNumberOfHardshipsInDefinedPeriod}
            label={"Restrict Number of Hardships in defined Period?"}
            options={yesNoOptions}
            selectedValue={
              values[fields.restrictNumberOfHardshipsInDefinedPeriod]
            }
            value={values[fields.restrictNumberOfHardshipsInDefinedPeriod]}
            onChange={onRestricNumberOfHardshipsChange}
            component={FieldButtonGroup}
            disabled={isEdit && !isSave}
          />
          {values[fields.restrictNumberOfHardshipsInDefinedPeriod] && (
            <>
              <div className="d-flex">
                <Field
                  size="xxs"
                  isRequired
                  name={fields.restrictedPeriodValue}
                  label={"Type of Restricted Period for Restricted Number"}
                  type="number"
                  autoComplete="off"
                  value={values[fields.restrictedPeriodValue]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInputNumber}
                  max={
                    values[fields.restrictedPeriodTypeFrequency] === 1 ? 99 : 11
                  }
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "-14rem",
                  }}
                >
                  <Field
                    size="sm"
                    label=" "
                    name={fields.restrictedPeriodTypeFrequency}
                    value={values[fields.restrictedPeriodTypeFrequency]}
                    disabled={isEdit && !isSave}
                    options={calendarFrequencyOptions}
                    popupContent={
                      <SearchableList
                        label="Select a Type"
                        isNotTypeAhead
                        isRadio
                        selectedValue={
                          values[fields.restrictedPeriodTypeFrequency]
                        }
                        options={calendarFrequencyOptions}
                        onSelect={(value) =>
                          setValues({
                            ...values,
                            restrictedPeriodTypeFrequency: value,
                            restrictedPeriodValue: "",
                          })
                        }
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
              </div>
              <Field
                size="xxs"
                isRequired
                name={fields.maximumNoOfHardShips}
                label={"Maximum Number of hardships defined in this period"}
                type="number"
                autoComplete="off"
                value={values[fields.maximumNoOfHardShips]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={0}
                max={10}
              />
              <Field
                size="xxs"
                isRequired
                name={fields.totalMaximumNoOfHardShips}
                label={
                  "Total Maximum Number of hardship withdrawal(for life of participant)"
                }
                type="number"
                autoComplete="off"
                value={values[fields.totalMaximumNoOfHardShips]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={0}
                max={999}
              />
            </>
          )}
        </div>
      )}
      <br />
      <Field
        size="md"
        label="Excluded Employee Classifications"
        name={fields.excludedEmployeeClassifications}
        value={toMultiSelectValueById(
          selectedExcludedEmployeeClassifications,
          excludedEmployeeClassifications
        )}
        disabled={isEdit && !isSave}
        isMultiSelect
        popupContent={
          <MultiSelectDropdown
            label="Select Employee Classifications"
            options={excludedEmployeeClassifications}
            name={fields.excludedEmployeeClassifications}
            onSelect={(value) =>
              setFieldValue(fields.excludedEmployeeClassifications, value)
            }
            value={values[fields.excludedEmployeeClassifications]}
            disabled={isEdit && !isSave}
          />
        }
        //
        component={FieldDropSide}
      />
      <Field
        size="md"
        label="Excluded Employment Status"
        name={fields.excludedEmploymentStatuses}
        value={toMultiSelectValueById(
          selectedExcludedEmploymentStatus,
          excludedEmploymentStatus
        )}
        disabled={isEdit && !isSave}
        isMultiSelect
        popupContent={
          <MultiSelectDropdown
            label="Select Employment Status"
            options={excludedEmploymentStatus}
            name={fields.excludedEmploymentStatuses}
            onSelect={(value) =>
              setFieldValue(fields.excludedEmploymentStatuses, value)
            }
            value={values[fields.excludedEmploymentStatuses]}
            disabled={isEdit && !isSave}
          />
        }
        //
        component={FieldDropSide}
      />
      <br />
    </div>
  );
};

export default DistributionsOptionsFormFields;
