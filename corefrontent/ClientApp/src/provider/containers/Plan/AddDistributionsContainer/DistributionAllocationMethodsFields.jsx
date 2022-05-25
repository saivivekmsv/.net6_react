import { Field } from "formik";
import { isEmpty } from "lodash";
import React from "react";
import {
  FieldInputNumber,
  FieldMultiSelectButtonGroup,
} from "../../../components";
import { required } from "../../../utils";

const DISTRIBUTION_COMMON = [
  {
    label: "Prorata of Choice",
    value: 1,
  },
];

const ONE_TIME_PAYMENT = [
  {
    label: "Allow me to choose",
    value: 1,
  },
];

const ORDER_OF_PERIODIC_PAYMENT = [
  {
    label: "Source Hierarchy",
    value: 1,
  },
  {
    label: "Investment Hierarchy",
    value: 2,
  },
];

const DistributionAllocationMethodsFields = (props) => {
  const {
    fields,
    values,
    isEdit,
    isSave,
    setFieldValue,
    handleChange,
    isHardShips,
  } = props;

  return (
    <div>
      <p className="plan-sub-heading">Distribution Allocation Methods</p>
      <Field
        isRequired
        size="smd"
        name={fields.distributionAllocationMethodCommon}
        label={"Common"}
        options={DISTRIBUTION_COMMON}
        selectedValue={values[fields.distributionAllocationMethodCommon]}
        value={values[fields.distributionAllocationMethodCommon]}
        onChange={(value) => {
          setFieldValue(fields.distributionAllocationMethodCommon, value);
        }}
        component={FieldMultiSelectButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        isRequired
        size="smd"
        name={fields.distributionAllocationMethodOntimePayment}
        label={"One time payment"}
        options={ONE_TIME_PAYMENT}
        selectedValue={values[fields.distributionAllocationMethodOntimePayment]}
        value={values[fields.distributionAllocationMethodOntimePayment]}
        onChange={(value) => {
          setFieldValue(
            fields.distributionAllocationMethodOntimePayment,
            value
          );
        }}
        component={FieldMultiSelectButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        isRequired
        size="lg"
        name={fields.orderOfPeriodicPayment}
        label={"Order of Periodic Payment"}
        options={ORDER_OF_PERIODIC_PAYMENT}
        selectedValue={values[fields.orderOfPeriodicPayment]}
        value={values[fields.orderOfPeriodicPayment]}
        onChange={(value) => {
          setFieldValue(fields.orderOfPeriodicPayment, value);
        }}
        component={FieldMultiSelectButtonGroup}
        disabled={isEdit && !isSave}
      />
      {!isHardShips && (
        <Field
          size="xs"
          isRequired
          name={fields.maximumNumberOfDirectRolloverPayees}
          label={"Maximum Number of direct rollover payees"}
          type="number"
          autoComplete="off"
          value={values[fields.maximumNumberOfDirectRolloverPayees]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInputNumber}
          min={0}
          max={99}
        />
      )}
      <br />
    </div>
  );
};

export default DistributionAllocationMethodsFields;
