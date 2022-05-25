import React from "react";
import { Field } from "formik";
import {
  yesNoOptions,
  toOptionValuesFromMapper,
  returnOnlyIfBoolean,
  required,
  ENROLLMENT_DROPDOWN_OPTIONS,
} from "../../../utils";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInputNumber,
  SearchableList,
} from "../../../components";

export const WindowPeriodFields = (props) => {
  const {
    fields,
    isSave,
    isEdit,
    values,
    setFieldValue,
    handleChange,
    autoEnrollment,
  } = props;
  return (
    <div>
      <Field
        isRequired
        name={fields.isWindowPeriod}
        label="Does plan have an enrollment window period"
        size="sm"
        options={yesNoOptions}
        selectedValue={returnOnlyIfBoolean(values[fields.isWindowPeriod])}
        onChange={(value) => {
          setFieldValue(fields.isWindowPeriod, value);
        }}
        disabled={isEdit && !isSave}
        component={FieldButtonGroup}
      />
      {values[fields.isWindowPeriod] === true ? (
        <div>
          <div className="d-flex">
            <Field
              size="sm"
              name={fields.numberOfDaysWindowIsOpenNumber}
              label={"Number Of Days Window Is Open"}
              type="number"
              autoComplete="off"
              value={values[fields.numberOfDaysWindowIsOpenNumber]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputNumber}
            />
            &nbsp;&nbsp;&nbsp;
            <div
              style={{
                marginLeft: "-2rem",
              }}
            >
              <Field
                size="lg"
                label=""
                isRequired
                name={fields.numberOfDaysWindowIsOpen}
                value={values[fields.numberOfDaysWindowIsOpen]}
                selectedValue={values[fields.numberOfDaysWindowIsOpen]}
                disabled={isEdit && !isSave}
                placeholder="Select a window period"
                options={toOptionValuesFromMapper(
                  ENROLLMENT_DROPDOWN_OPTIONS.WINDOW_PERIOD
                )}
                popupContent={
                  <SearchableList
                    label="Select Window is Open"
                    isNotTypeAhead
                    options={toOptionValuesFromMapper(
                      ENROLLMENT_DROPDOWN_OPTIONS.WINDOW_PERIOD
                    )}
                    onSelect={(value) => {
                      setFieldValue(fields.numberOfDaysWindowIsOpen, value);
                    }}
                    selectedValue={values[fields.numberOfDaysWindowIsOpen]}
                  />
                }
                validate={required}
                component={FieldDropSide}
              />
            </div>
          </div>

          <p className="font-weight-500 text-black">
            Window Period for Re-enrollment
          </p>
          <div className="d-flex">
            <Field
              size="sm"
              name={fields.numberOfDaysWindowIsOpenReEnrollmentNumber}
              label={"Number Of Days Window Is Open"}
              type="number"
              autoComplete="off"
              value={values[fields.numberOfDaysWindowIsOpenReEnrollmentNumber]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputNumber}
            />
            &nbsp;&nbsp;&nbsp;
            <div
              style={{
                marginLeft: "-2rem",
              }}
            >
              <Field
                size="lg"
                label=""
                isRequired
                name={fields.numberOfDaysWindowIsOpenReEnrollment}
                value={values[fields.numberOfDaysWindowIsOpenReEnrollment]}
                selectedValue={
                  values[fields.numberOfDaysWindowIsOpenReEnrollment]
                }
                disabled={isEdit && !isSave}
                placeholder="Select a window period"
                options={toOptionValuesFromMapper(
                  ENROLLMENT_DROPDOWN_OPTIONS.WINDOW_PERIOD_FOR_REENROLLMENT
                )}
                popupContent={
                  <SearchableList
                    label="Select Window is Open"
                    isNotTypeAhead
                    options={toOptionValuesFromMapper(
                      ENROLLMENT_DROPDOWN_OPTIONS.WINDOW_PERIOD_FOR_REENROLLMENT
                    )}
                    onSelect={(value) => {
                      setFieldValue(
                        fields.numberOfDaysWindowIsOpenReEnrollment,
                        value
                      );
                    }}
                    selectedValue={
                      values[fields.numberOfDaysWindowIsOpenReEnrollment]
                    }
                  />
                }
                validate={required}
                component={FieldDropSide}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WindowPeriodFields;
