import { Field } from "formik";
import { isArray, isEmpty } from "lodash";
import React from "react";
import {
  FieldButtonGroup,
  FieldInputDollar,
  FieldMultiSelectButtonGroup,
} from "../../../components";
import {
  clearFieldValues,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  yesNoOptions,
} from "../../../utils";

const paymentMethod = [
  {
    label: "Check",
    value: 1,
  },
  {
    label: "EFT",
    value: 2,
  },
];
const paymentMethodsApplicableRMD = [
  {
    label: "Check",
    value: 1,
  },
];

const FeesFields = (props) => {
  const {
    fields,
    values,
    setFieldValue,
    isEdit,
    isSave,
    handleChange,
    isHardShips,
    isRmd,
    setValues,
    setTouched,
    initialValues,
  } = props;

  const paymentMethodValue = isArray(values[fields.paymentMethod])
    ? values[fields.paymentMethod]
    : [values[fields.paymentMethod]];

  const onPaymentMethodChange = (value) => {
    let updatedValues;
    if (value.length === 1) {
      if (value.includes(1)) {
        updatedValues = clearFieldValues({
          values,
          fieldsToClear: [fields.eftFee],
        });
        setTouched({
          [fields.eftFee]: false,
        });
      } else {
        updatedValues = clearFieldValues({
          values,
          fieldsToClear: [fields.checkFees],
        });
        setTouched({
          [fields.checkFees]: false,
        });
      }
    }
    if (value.length === 0) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [fields.checkFees, fields.eftFee],
      });
      setTouched({
        [fields.checkFees]: false,
        [fields.eftFee]: false,
      });
    }
    setValues({
      ...values,
      ...updatedValues,
      [fields.paymentMethod]: value,
    });
  };

  const showCheckFee = paymentMethodValue.includes(1);
  const showEftFee = paymentMethodValue.includes(2);

  return (
    <div>
      <p className="plan-sub-heading">Fees</p>
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.allowParticipantstoChooseFeesDeductedMethod}
          label={"Allow Participants to choose fee deduction method?"}
          options={yesNoOptions}
          selectedValue={
            values[fields.allowParticipantstoChooseFeesDeductedMethod]
          }
          value={values[fields.allowParticipantstoChooseFeesDeductedMethod]}
          onChange={(value) => {
            setFieldValue(
              fields.allowParticipantstoChooseFeesDeductedMethod,
              value
            );
            // setFieldValue(fields.feesToBeDeductedFrom, values.id ? initialValues[fields.feesToBeDeductedFrom] : null);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {!isRmd && !values[fields.allowParticipantstoChooseFeesDeductedMethod] && (
        <Field
          isRequired
          size="lg"
          name={fields.feesToBeDeductedFrom}
          label={"Deduct fees from"}
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.DISTRIBUTION_DETECT_FEES_FROM
          )}
          selectedValue={values[fields.feesToBeDeductedFrom]}
          value={values[fields.feesToBeDeductedFrom]}
          onChange={(value) => {
            setFieldValue(fields.feesToBeDeductedFrom, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {isRmd && (
        <Field
          isRequired
          size="smd"
          name={fields.feesToBeDeductedFrom}
          label={"Deduct fees from"}
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.DISTRIBUTION_DETECT_FEES_FROM_RMD
          )}
          selectedValue={values[fields.feesToBeDeductedFrom]}
          value={values[fields.feesToBeDeductedFrom]}
          onChange={(value) => {
            setFieldValue(fields.feesToBeDeductedFrom, value);
          }}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {!isRmd && (
        <Field
          isRequired
          name={fields.paymentMethod}
          label={"Payment Methods Applicable"}
          options={paymentMethod}
          selectedValue={values[fields.paymentMethod]}
          value={values[fields.paymentMethod]}
          onChange={(value) => {
            setFieldValue(fields.paymentMethod, value);
          }}
          component={FieldMultiSelectButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {isRmd && (
        <Field
          isRequired
          name={fields.paymentMethod}
          label={"Payment Methods Applicable"}
          options={paymentMethodsApplicableRMD}
          selectedValue={values[fields.paymentMethod]}
          value={values[fields.paymentMethod]}
          onChange={(value) => {
            setFieldValue(fields.paymentMethod, value);
          }}
          component={FieldMultiSelectButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {values[fields.paymentMethod]?.includes(1) && (
        <Field
          isRequired
          name={fields.checkFees}
          label={"Check Fee"}
          type="number"
          autoComplete="off"
          value={values[fields.checkFees]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputDollar}
        />
      )}
      {values[fields.paymentMethod]?.includes(2) && !isRmd && (
        <Field
          isRequired
          name={fields.eftFee}
          label={"EFT Fee"}
          type="number"
          autoComplete="off"
          value={values[fields.eftFee]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputDollar}
        />
      )}
      <Field
        isRequired
        name={fields.overnightExpressDeliveryFee}
        label={"Overnight / Express Delivery Fee"}
        type="number"
        autoComplete="off"
        value={values[fields.overnightExpressDeliveryFee]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInputDollar}
      />
      {isHardShips && (
        <Field
          isRequired
          name={fields.hardshipWithdrawalFee}
          label={"Hardship Withdrawal Fee"}
          type="number"
          autoComplete="off"
          value={values[fields.hardshipWithdrawalFee]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputDollar}
        />
      )}
      {!isHardShips && (
        <Field
          isRequired
          name={fields.withdrawalOneTimeOriginateFee}
          label={"Withdrawal / One time Origination Fee"}
          type="number"
          autoComplete="off"
          value={values[fields.withdrawalOneTimeOriginateFee]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputDollar}
        />
      )}
      {!isHardShips && !isRmd && (
        <Field
          isRequired
          name={fields.rollOverFee}
          label={"Rollover Fee"}
          type="number"
          autoComplete="off"
          value={values[fields.rollOverFee]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputDollar}
        />
      )}
      {isRmd && (
        <Field
          isRequired
          name={fields.recurringFee}
          label={"Recurring fees per payment"}
          type="number"
          autoComplete="off"
          value={values[fields.recurringFee]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputDollar}
        />
      )}
    </div>
  );
};

export default FeesFields;
