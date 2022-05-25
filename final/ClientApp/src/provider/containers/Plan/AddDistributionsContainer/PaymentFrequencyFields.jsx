import { Field } from "formik";
import React from "react";
import {
  DayDropdown,
  Dropside,
  FieldButtonGroup,
  FieldDropSide,
  FieldMultiSelectButtonGroup,
  FormControl,
  SearchableList,
} from "../../../components";
import {
  clearFieldValues,
  getMultiSelectListFromValue,
  inverseYesNoOptions,
  required,
  returnOnlyIfBoolean,
  toMultiSelectValue,
} from "../../../utils";
import months from "../../../mocks/months.json";
import weekdays from "../../../mocks/weekdays.json";
import { isEmpty } from "lodash";

const paymentFrequencyApplicable = [
  {
    value: 2,
    label: "Weekly",
  },
  {
    value: 3,
    label: "Semi Monthly",
  },
  {
    value: 4,
    label: "Monthly",
  },
  {
    value: 5,
    label: "Quarterly",
  },
  {
    value: 6,
    label: "Semi Annually",
  },
  {
    value: 7,
    label: "Annually",
  },
];

const calculationMethods = [
  {
    value: 1,
    label: "Specific Tenure",
  },
  {
    value: 2,
    label: "Specific Dollar",
  },
  {
    value: 4,
    label: "Amortization Method",
  },
  {
    value: 8,
    label: "Annuitization Method",
  },
];

const calculationMethodsApplicable = [
  {
    value: 1,
    label: "Specific Tenure",
  },
];

const PaymentFrequencyFields = (props) => {
  const {
    fields,
    values,
    setFieldValue,
    isEdit,
    isSave,
    isRmd,
    setValues,
    ...rest
  } = props;

  const onPaymentFrequencyApplicable = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [
        fields.worksOnSaturday,
        fields.worksOnSunday,
        fields.startDay,
        fields.firstBeginDay,
        fields.secondBeginDay,
        fields.startMonth,
        fields.startMonthFirstQuarter,
        fields.startMonthFirstHalfYear,
        fields.startMonthFirstHalfYear,
      ],
    });
    setValues({
      ...updatedValues,
      [fields.paymentFrequencyApplicable]: value,
    });
  };

  return (
    <>
      <Field
        isRequired
        size="xxl"
        name={fields.paymentFrequencyApplicable}
        label={"Payment Frequency Applicable"}
        options={paymentFrequencyApplicable}
        selectedValue={values[fields.paymentFrequencyApplicable]}
        value={values[fields.paymentFrequencyApplicable]}
        onChange={onPaymentFrequencyApplicable}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />

      {values[fields.paymentFrequencyApplicable] === 1 && (
        <>
          <Field
            size="sm"
            name={fields.worksOnSaturday}
            label={"Exclude Saturdays?"}
            options={inverseYesNoOptions}
            selectedValue={values[fields.worksOnSaturday]}
            value={values[fields.worksOnSaturday]}
            onChange={(value) => {
              setFieldValue(fields.worksOnSaturday, value);
            }}
            component={FieldButtonGroup}
            disabled={isEdit && !isSave}
          />
          <Field
            size="sm"
            name={fields.worksOnSunday}
            label={"Exclude Sundays?"}
            options={inverseYesNoOptions}
            selectedValue={returnOnlyIfBoolean(values[fields.worksOnSunday])}
            value={values[fields.worksOnSunday]}
            onChange={(value) => {
              setFieldValue(fields.worksOnSunday, value);
            }}
            component={FieldButtonGroup}
            disabled={isEdit && !isSave}
          />
        </>
      )}
      {[2, 8].includes(values[fields.paymentFrequencyApplicable]) && (
        <FormControl
          label="Start day"
          name={fields.startDay}
          isRequired
          {...rest}
        >
          <Dropside
            name={fields.startDay}
            value={values[fields.startDay]}
            options={weekdays.data}
            popupContent={
              <SearchableList
                label="Select date"
                options={weekdays.data}
                selectedValue={values[fields.startDay]}
                onSelect={(value) => setFieldValue(fields.startDay, value)}
                isNotTypeAhead
                isRadio
              />
            }
            disabled={isEdit && !isSave}
          />
        </FormControl>
      )}
      {[3].includes(values[fields.paymentFrequencyApplicable]) && (
        <>
          <Field
            size="md"
            isRequired
            label="First begin day"
            name={fields.firstBeginDay}
            value={values[fields.firstBeginDay]}
            disabled={isEdit && !isSave}
            popupContent={
              <DayDropdown
                fromMonthDate={new Date(2020, 0)}
                onSelect={(value) =>
                  setFieldValue(fields.firstBeginDay, parseInt(value, 10))
                }
                value={values[fields.firstBeginDay]}
              />
            }
            component={FieldDropSide}
          />
          <Field
            size="md"
            isRequired
            label="Second begin day"
            name={fields.secondBeginDay}
            value={values[fields.secondBeginDay]}
            disabled={isEdit && !isSave}
            popupContent={
              <DayDropdown
                fromMonthDate={new Date(2020, 0)}
                onSelect={(value) =>
                  setFieldValue(fields.secondBeginDay, parseInt(value, 10))
                }
                value={values[fields.secondBeginDay]}
              />
            }
            component={FieldDropSide}
          />
        </>
      )}
      {[4].includes(values[fields.paymentFrequencyApplicable]) && (
        <Field
          size="md"
          isRequired
          label="Starting day of every month"
          name={fields.startDay}
          value={values[fields.startDay]}
          disabled={isEdit && !isSave}
          popupContent={
            <DayDropdown
              fromMonthDate={new Date(2020, 0)}
              onSelect={(value) =>
                setFieldValue(fields.startDay, parseInt(value, 10))
              }
              value={values[fields.startDay]}
            />
          }
          component={FieldDropSide}
        />
      )}
      {[5].includes(values[fields.paymentFrequencyApplicable]) && (
        <FormControl
          label="Starting month for first quarter"
          name={fields.startMonthFirstQuarter}
          isRequired
          {...rest}
        >
          <Dropside
            name={fields.startMonthFirstQuarter}
            value={values[fields.startMonthFirstQuarter]}
            options={months.data}
            popupContent={
              <SearchableList
                label="Select a month"
                options={months.data}
                onSelect={(value) =>
                  setFieldValue(fields.startMonthFirstQuarter, value)
                }
                isNotTypeAhead
                selectedValue={values[fields.startMonthFirstQuarter]}
              />
            }
            disabled={isEdit && !isSave}
          />
        </FormControl>
      )}
      {[6].includes(values[fields.paymentFrequencyApplicable]) && (
        <FormControl
          label="Starting month for the half-year"
          name={fields.startMonthFirstHalfYear}
          isRequired
          {...rest}
        >
          <Dropside
            name={fields.startMonthFirstHalfYear}
            value={values[fields.startMonthFirstHalfYear]}
            options={months.data}
            popupContent={
              <SearchableList
                label="Select a month"
                options={months.data}
                onSelect={(value) =>
                  setFieldValue(fields.startMonthFirstHalfYear, value)
                }
                isNotTypeAhead
                selectedValue={values[fields.startMonthFirstHalfYear]}
              />
            }
            disabled={isEdit && !isSave}
          />
        </FormControl>
      )}
      {[7].includes(values[fields.paymentFrequencyApplicable]) && (
        <div className="d-flex">
          <FormControl
            label="Starting date"
            name={fields.startMonth}
            isRequired
            size="sm"
            {...rest}
          >
            <Dropside
              name={fields.startMonth}
              value={values[fields.startMonth]}
              options={months.data}
              placeholder="Month"
              popupContent={
                <SearchableList
                  label="Select a month"
                  options={months.data}
                  onSelect={(value) => setFieldValue(fields.startMonth, value)}
                  isNotTypeAhead
                  selectedValue={values[fields.startMonth]}
                />
              }
              disabled={isEdit && !isSave}
            />
          </FormControl>
          &nbsp; &nbsp;
          <FormControl label=" " name={fields.startDay} size="xs" {...rest}>
            <Dropside
              name={fields.startDay}
              value={values[fields.startDay]}
              placeholder="Day"
              popupContent={
                <DayDropdown
                  fromMonthDate={
                    new Date(2020, values[fields.startMonth] - 1 || 0)
                  }
                  onSelect={(value) =>
                    setFieldValue(fields.startDay, parseInt(value, 10))
                  }
                  value={values[fields.startDay]}
                />
              }
              disabled={isEdit && !isSave}
            />
          </FormControl>
        </div>
      )}
      {!isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.calculationMethods}
          label={"Calculation Methods"}
          options={calculationMethods}
          selectedValue={values[fields.calculationMethods]}
          value={values[fields.calculationMethods]}
          onChange={(value) => {
            setFieldValue(fields.calculationMethods, value);
          }}
          component={FieldMultiSelectButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
      {isRmd && (
        <Field
          isRequired
          size="sm"
          name={fields.calculationMethods}
          label={"Calculation Methods Applicable"}
          options={calculationMethodsApplicable}
          selectedValue={values[fields.calculationMethods]}
          value={values[fields.calculationMethods]}
          onChange={(value) => {
            setFieldValue(fields.calculationMethods, value);
          }}
          component={FieldMultiSelectButtonGroup}
          disabled={isEdit && !isSave}
        />
      )}
    </>
  );
};

export default PaymentFrequencyFields;
