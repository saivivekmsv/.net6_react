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
const columns = [
  {
    label: "",
    className: "",
    columnName: "",
  },
  {
    label: "Employee classifications",
    className: "column-employee-classification-name",
    columnName: "employeeClassification",
  },
];

const ExclusionsForm = ({
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
  const formProps = useFormikContext();
  const { setFieldError } = formProps;
  const isEmployeeClassification = exclusionTypeValue === 2;
  const isBoth = exclusionTypeValue === 3;
  const dateOfHire = values[fields.hire];
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
        fields.hire,
        fields.hiredOnOrAfterDate,
        fields.hiredOnOrBeforeDate,
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
      fieldsToClear: [fields.hiredOnOrAfterDate, fields.hiredOnOrBeforeDate],
    });
    setFieldError(fields.hiredOnOrBeforeDate, "");
    setFieldError(fields.hiredOnOrAfterDate, "");
    setValues({
      ...updatedValues,
      [fields.hire]: value,
    });
  };

  return (
    <div>
      <Field
        isRequired
        size="xxl"
        name={fields.exclusionType}
        label={"Select an exclusion type"}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.ELIGIBILITY_RULES
        )}
        selectedValue={values[fields.exclusionType]}
        value={values[fields.exclusionType]}
        onChange={onExclusionRuleChange}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />

      {(isDateOfHide || isBoth) && (
        <Row className="justify-content-start">
          <Col sm={4}>
            <Field
              size="md"
              isRequired
              label="Date of Hire"
              name={fields.hire}
              value={values[fields.hire]}
              disabled={isEdit && !isSave}
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.DATE_OF_HIRE
              )}
              popupContent={
                <SearchableList
                  isNotTypeAhead
                  label="Select a Date of Hire"
                  name={fields.hire}
                  onSelect={onDateOfHireChange}
                  selectedValue={values[fields.hire]}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.DATE_OF_HIRE
                  )}
                  disabled={isEdit && !isSave}
                />
              }
              component={FieldDropSide}
            />
          </Col>
          {isDateOfHireAfter && (
            <Col sm={4}>
              <Field
                size="smd"
                isRequired
                label="On or after date"
                name={fields.hiredOnOrAfterDate}
                value={usDateFormat(values[fields.hiredOnOrAfterDate])}
                disabled={isEdit && !isSave}
                isDatePicker
                onClear={() => onDaySelected(fields.hiredOnOrAfterDate, null)}
                popupContent={
                  <DatePicker
                    onDayClick={(value) =>
                      onDaySelected(fields.hiredOnOrAfterDate, value)
                    }
                    value={values[fields.hiredOnOrAfterDate]}
                  />
                }
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
                name={fields.hiredOnOrBeforeDate}
                value={usDateFormat(values[fields.hiredOnOrBeforeDate])}
                disabled={isEdit && !isSave}
                isDatePicker
                onClear={() => onDaySelected(fields.hiredOnOrBeforeDate, null)}
                popupContent={
                  <DatePicker
                    onDayClick={(value) =>
                      onDaySelected(fields.hiredOnOrBeforeDate, value)
                    }
                    value={values[fields.hiredOnOrBeforeDate]}
                  />
                }
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
                  name={fields.hiredOnOrAfterDate}
                  value={usDateFormat(values[fields.hiredOnOrAfterDate])}
                  disabled={isEdit && !isSave}
                  isDatePicker
                  onClear={() => onDaySelected(fields.hiredOnOrAfterDate, null)}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.hiredOnOrAfterDate, value)
                      }
                      value={values[fields.hiredOnOrAfterDate]}
                    />
                  }
                  component={FieldDropSide}
                />
              </Col>
              <Col>
                <Field
                  size="smd"
                  isRequired
                  label="End Date"
                  name={fields.hiredOnOrBeforeDate}
                  value={usDateFormat(values[fields.hiredOnOrBeforeDate])}
                  disabled={isEdit && !isSave}
                  isDatePicker
                  onClear={() =>
                    onDaySelected(fields.hiredOnOrBeforeDate, null)
                  }
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.hiredOnOrBeforeDate, value)
                      }
                      value={values[fields.hiredOnOrBeforeDate]}
                    />
                  }
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
          label="Excluded Employee Classifications"
          name={fields.excludedClassifications}
          value={toMultiSelectValueById(
            values[fields.excludedClassifications],
            excludedEmployeeClassifications
          )}
          disabled={isEdit && !isSave}
          isMultiSelect
          popupContent={
            <MultiSelectDropdown
              label="Select Excluded Employee Classifications"
              options={excludedEmployeeClassifications}
              name={fields.excludedClassifications}
              onSelect={(value) =>
                setFieldValue(fields.excludedClassifications, value)
              }
              value={values[fields.excludedClassifications]}
              disabled={isEdit && !isSave}
            />
          }
          component={FieldDropSide}
        />
      )}
    </div>
  );
};

export default ExclusionsForm;
