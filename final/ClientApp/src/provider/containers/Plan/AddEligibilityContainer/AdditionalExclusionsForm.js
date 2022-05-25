import { Field, useFormikContext } from "formik";
import React, { useContext } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { createPlanStore } from "../../../contexts";
import {
  clearFieldValues,
  getPathWithParam,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  usDateFormat,
  tranformListToDropdownValues,
  toMultiSelectValueById,
} from "../../../utils";
import {
  DatePicker,
  FieldDropSide,
  CsplTable as Table,
  Link,
  FieldButtonGroup,
  SearchableList,
  MultiSelectDropdown,
} from "../../../components";
import { isEmpty, get } from "lodash";
import { useDeepEffect, useRouterParams } from "../../../abstracts";
import { useState } from "react";
import { getClassificationCodes } from "../../../services";

const AdditionalExclusionsForm = ({
  fields,
  values,
  setValues,
  isEdit,
  isSave,
  onDaySelected,
  setFieldValue,
  data,
}) => {
  const { planId, flow } = useRouterParams();
  const selectedsourceEligibilities = values[fields.sourceEligibilities];
  const exclusionTypeValue = values[fields.exclusionType];
  // const isNone = exclusionTypeValue === 0;
  const isDateOfHide = exclusionTypeValue === 1;

  const isEmployeeClassification = exclusionTypeValue === 2;
  const isBoth = exclusionTypeValue === 3;
  const dateOfHire = values[fields.hireDateType];
  const isDateOfHireBefore = dateOfHire === 2;
  const isDateOfHireAfter = dateOfHire === 1;
  const isDateOfHireBetween = dateOfHire === 3;
  const [
    excludedEmployeeClassifications,
    setExcludedEmployeeClassifications,
  ] = useState([]);

  useDeepEffect(() => {
    getClassificationCodes(data)
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

  const onExclusionRuleChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [
        fields.hireDateType,
        fields.startHireDate,
        fields.endHireDate,
        fields.excludedClassifications,
      ],
    });
    setValues({
      ...updatedValues,
      [fields.exclusionType]: value,
    });
  };

  const onDateOfHireChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [fields.startHireDate, fields.endHireDate],
    });
    setValues({
      ...updatedValues,
      [fields.hireDateType]: value,
    });
  };
  console.log(values[fields.excludedClassifications]);
  return (
    <div>
      <Field
        isRequired
        size="md"
        name={fields.exclusionType}
        label={"Additional Eligibility Option"}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.ADDITIONAL_ELIGIBILITY_RULES
        )}
        selectedValue={values[fields.exclusionType]}
        value={values[fields.exclusionType]}
        onChange={(value) => onExclusionRuleChange(value)}
        component={FieldButtonGroup}
        validate={(value) => {
          return [undefined, null, ""].includes(value)
            ? "PL560 : Required"
            : undefined;
        }}
        disabled={isEdit && !isSave}
      />

      {(isDateOfHide || isBoth) && (
        <Row className="justify-content-start">
          <Col sm={4}>
            <Field
              size="md"
              isRequired
              label="Date of Hire"
              name={fields.hireDateType}
              value={values[fields.hireDateType]}
              disabled={isEdit && !isSave}
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.DATE_OF_HIRE
              )}
              popupContent={
                <SearchableList
                  isNotTypeAhead
                  label="Select a Date of Hire"
                  name={fields.hireDateType}
                  onSelect={(value) => onDateOfHireChange(value)}
                  selectedValue={values[fields.hireDateType]}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.DATE_OF_HIRE
                  )}
                  disabled={isEdit && !isSave}
                />
              }
              validate={(value) => {
                return [undefined, null, ""].includes(value)
                  ? "PL561 : Required"
                  : undefined;
              }}
              component={FieldDropSide}
            />
          </Col>
          {isDateOfHireAfter && (
            <Col sm={4}>
              <Field
                size="smd"
                isRequired
                label="On or after date"
                name={fields.startHireDate}
                value={usDateFormat(values[fields.startHireDate])}
                disabled={isEdit && !isSave}
                isDatePicker
                onClear={() => onDaySelected(fields.startHireDate, null)}
                popupContent={
                  <DatePicker
                    onDayClick={(value) =>
                      onDaySelected(fields.startHireDate, value)
                    }
                    value={values[fields.startHireDate]}
                  />
                }
                validate={(value) => {
                  return [undefined, null, ""].includes(value)
                    ? "PL562 : Required"
                    : undefined;
                }}
                component={FieldDropSide}
              />
            </Col>
          )}
          {isDateOfHireBefore && (
            <Col sm={4}>
              <Field
                size="smd"
                isRequired
                label="On or before date"
                name={fields.endHireDate}
                value={usDateFormat(values[fields.endHireDate])}
                disabled={isEdit && !isSave}
                isDatePicker
                onClear={() => onDaySelected(fields.endHireDate, null)}
                popupContent={
                  <DatePicker
                    onDayClick={(value) =>
                      onDaySelected(fields.endHireDate, value)
                    }
                    value={values[fields.endHireDate]}
                  />
                }
                validate={(value) => {
                  return [undefined, null, ""].includes(value)
                    ? "PL563 : Required"
                    : undefined;
                }}
                component={FieldDropSide}
              />
            </Col>
          )}
          {isDateOfHireBetween && (
            <>
              <Col sm={3}>
                <Field
                  size="smd"
                  isRequired
                  label="Start Date"
                  name={fields.startHireDate}
                  value={usDateFormat(values[fields.startHireDate])}
                  disabled={isEdit && !isSave}
                  isDatePicker
                  onClear={() => onDaySelected(fields.startHireDate, null)}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.startHireDate, value)
                      }
                      value={values[fields.startHireDate]}
                    />
                  }
                  validate={(value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL562 : Required"
                      : undefined;
                  }}
                  component={FieldDropSide}
                />
              </Col>
              <Col>
                <Field
                  size="smd"
                  isRequired
                  label="End Date"
                  name={fields.endHireDate}
                  value={usDateFormat(values[fields.endHireDate])}
                  disabled={isEdit && !isSave}
                  isDatePicker
                  onClear={() => onDaySelected(fields.endHireDate, null)}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.endHireDate, value)
                      }
                      value={values[fields.endHireDate]}
                    />
                  }
                  validate={(value) => {
                    return [undefined, null, ""].includes(value)
                      ? "PL563 : Required"
                      : values[fields.endHireDate] <=
                        values[fields.startHireDate]
                      ? "PL564 : Start date should not be greater than End date"
                      : undefined;
                  }}
                  component={FieldDropSide}
                />
              </Col>
            </>
          )}
        </Row>
      )}

      {(isEmployeeClassification || isBoth) && (
        <Field
          size="md"
          isRequired
          label="Additional Rule Employee Classifications"
          name={fields.excludedClassifications}
          value={toMultiSelectValueById(
            values[fields.excludedClassifications],
            excludedEmployeeClassifications
          )}
          disabled={isEdit && !isSave}
          isMultiSelect
          popupContent={
            <MultiSelectDropdown
              label="Select Additional Rule Employee Classifications"
              options={excludedEmployeeClassifications}
              name={fields.excludedClassifications}
              onSelect={(value) =>
                setFieldValue(fields.excludedClassifications, value)
              }
              value={values[fields.excludedClassifications]}
              disabled={isEdit && !isSave}
            />
          }
          validate={() =>
            isEmpty(values[fields.excludedClassifications])
              ? "PL565 : Required"
              : undefined
          }
          component={FieldDropSide}
        />
      )}
    </div>
  );
};

export default AdditionalExclusionsForm;
