import { Field, FieldArray } from "formik";
import React, { useState } from "react";
import { useDeepEffect } from "../../../abstracts";
import {
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  toMultiSelectValueById,
  required,
  usDateFormat,
} from "../../../utils";
import {
  FieldButtonGroup,
  MultiSelectDropdown,
  FieldDropSide,
  DatePicker,
} from "../../../components";
import { Row, Col } from "react-bootstrap";
import { getEmployeeClassification } from "../../../services";
export const ExcludedEmployeeClassficationFields = (props) => {
  const { fields, values, setFieldValue, isEdit, isSave, planId } = props;
  const [
    excludedEmployeeClassifications,
    setExcludedEmployeeClassifications,
  ] = useState([]);
  const [excludedEmploymentStatuses, setExcludedEmploymentStatuses] = useState(
    []
  );
  useDeepEffect(() => {
    getEmployeeClassification(planId).then((response) => {
      setExcludedEmployeeClassifications(
        response.employeeClassifications &&
          response.employeeClassifications.map(
            (val, ind) => (
              console.log(val),
              {
                label: val.codeName + val.code,
                value: val.code,
              }
            )
          )
      );
      setExcludedEmploymentStatuses(
        response.employmentStatuses &&
          response.employmentStatuses.map((val, ind) => ({
            label: val.employmentStatusName + val.employmentStatusCode,
            value: val.employmentStatusCode,
          }))
      );
    });
  }, []);

  const selectedexcludedEmploymentStatuses =
    values[fields.excludedEmploymentStatuses];
  const selectedExcludedEmployeeClassifications =
    values[fields.excludedEmployeeClassifications];
  const { ...rest } = values;
  const onDaySelected = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };

  return (
    <div>
      <Field
        size="smd"
        isRequired
        name={fields.exclusionType}
        label={"Exclusion Type"}
        options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.EXCUSION_TYPE)}
        selectedValue={values[fields.exclusionType]}
        value={values[fields.exclusionType]}
        onChange={(value) => {
          setFieldValue(fields.exclusionType, value);
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />

      {values[fields.exclusionType] === 2 ? (
        <>
          <Field
            size="md"
            isRequired
            label="Excluded Employee Classifications"
            options={excludedEmployeeClassifications}
            name={fields.excludedEmployeeClassifications}
            value={toMultiSelectValueById(
              selectedExcludedEmployeeClassifications,
              excludedEmployeeClassifications
            )}
            disabled={isEdit && !isSave}
            isMultiSelect
            popupContent={
              <MultiSelectDropdown
                label="Select an Employee Classifications"
                options={excludedEmployeeClassifications}
                onSelect={(value) =>
                  setFieldValue(fields.excludedEmployeeClassifications, value)
                }
                name={fields.excludedEmployeeClassifications}
                value={values[fields.excludedEmployeeClassifications]}
                disabled={isEdit && !isSave}
              />
            }
            // validate={required}
            component={FieldDropSide}
          />

          <Field
            size="md"
            isRequired
            label="Excluded Employment Status"
            options={excludedEmploymentStatuses}
            name={fields.excludedEmploymentStatuses}
            value={toMultiSelectValueById(
              selectedexcludedEmploymentStatuses,
              excludedEmploymentStatuses
            )}
            disabled={isEdit && !isSave}
            isMultiSelect
            popupContent={
              <MultiSelectDropdown
                label="Select as Employment Status"
                options={excludedEmploymentStatuses}
                onSelect={(value) =>
                  setFieldValue(fields.excludedEmploymentStatuses, value)
                }
                selectedOptions={fields.excludedEmploymentStatuses}
                name={fields.excludedEmploymentStatuses}
                value={values[fields.excludedEmploymentStatuses]}
                disabled={isEdit && !isSave}
              />
            }
            // validate={required}
            component={FieldDropSide}
          />
        </>
      ) : null}

      {values[fields.exclusionType] === 1 ? (
        <>
          <Field
            label="Date of hire"
            name={fields.dateOfHire}
            options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.DATE_OF_HIRE)}
            value={values[fields.dateOfHire]}
            selectedValue={values[fields.dateOfHire]}
            component={FieldButtonGroup}
            onChange={(value) => {
              setFieldValue(fields.dateOfHire, value);
            }}
            disabled={isEdit && !isSave}
            size="smd"
          />
          {values[fields.dateOfHire] === 1 ? (
            <Field
              label="Hired on or after date"
              name={fields.hiredOnOrAfterDateEnrollment}
              isDatePicker
              // {...rest}
              value={usDateFormat(values[fields.hiredOnOrAfterDateEnrollment])}
              selectedValue={values[fields.hiredOnOrAfterDateEnrollment]}
              component={FieldDropSide}
              onClear={() =>
                setFieldValue(fields.hiredOnOrAfterDateEnrollment, "")
              }
              disabled={isEdit && !isSave}
              popupContent={
                <DatePicker
                  onDayClick={(value) =>
                    onDaySelected(fields.hiredOnOrAfterDateEnrollment, value)
                  }
                  value={values[fields.hiredOnOrAfterDateEnrollment]}
                />
              }
            />
          ) : null}

          {values[fields.dateOfHire] === 2 ? (
            <Field
              label="Hired on or before date"
              name={fields.hiredOnOrBeforeDateEnrollment}
              isDatePicker
              // {...rest}
              value={usDateFormat(values[fields.hiredOnOrBeforeDateEnrollment])}
              selectedValue={values[fields.hiredOnOrBeforeDateEnrollment]}
              component={FieldDropSide}
              onClear={() =>
                setFieldValue(fields.hiredOnOrBeforeDateEnrollment, "")
              }
              disabled={isEdit && !isSave}
              popupContent={
                <DatePicker
                  onDayClick={(value) =>
                    onDaySelected(fields.hiredOnOrBeforeDateEnrollment, value)
                  }
                  value={values[fields.hiredOnOrBeforeDateEnrollment]}
                />
              }
            />
          ) : null}

          {values[fields.dateOfHire] === 3 ? (
            <>
              <p className="font-weight-500 text-black">
                Hired Between(Inclusive)
              </p>
              <Row>
                <Col md="4">
                  <Field
                    label="From"
                    name={fields.hiredBetweenFrom}
                    isDatePicker
                    size="md"
                    // {...rest}
                    value={usDateFormat(values[fields.hiredBetweenFrom])}
                    selectedValue={values[fields.hiredBetweenFrom]}
                    component={FieldDropSide}
                    onClear={() => setFieldValue(fields.hiredBetweenFrom, "")}
                    disabled={isEdit && !isSave}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.hiredBetweenFrom, value)
                        }
                        value={values[fields.hiredBetweenFrom]}
                      />
                    }
                  />
                </Col>
                <Col>
                  <Field
                    label="To"
                    name={fields.hiredBetweenTo}
                    isDatePicker
                    size="md"
                    // {...rest}
                    value={usDateFormat(values[fields.hiredBetweenTo])}
                    selectedValue={values[fields.hiredBetweenTo]}
                    component={FieldDropSide}
                    onClear={() => setFieldValue(fields.hiredBetweenTo, "")}
                    disabled={isEdit && !isSave}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.hiredBetweenTo, value)
                        }
                        value={values[fields.hiredBetweenTo]}
                      />
                    }
                  />
                </Col>
              </Row>
            </>
          ) : null}

          <Field
            size="md"
            isRequired
            label="Excluded Employment Status"
            options={excludedEmploymentStatuses}
            name={fields.excludedEmploymentStatuses}
            value={toMultiSelectValueById(
              selectedexcludedEmploymentStatuses,
              excludedEmploymentStatuses
            )}
            disabled={isEdit && !isSave}
            isMultiSelect
            popupContent={
              <MultiSelectDropdown
                label="Select as Employment Status"
                options={excludedEmploymentStatuses}
                onSelect={(value) =>
                  setFieldValue(fields.excludedEmploymentStatuses, value)
                }
                selectedOptions={fields.excludedEmploymentStatuses}
                name={fields.excludedEmploymentStatuses}
                value={values[fields.excludedEmploymentStatuses]}
                disabled={isEdit && !isSave}
              />
            }
            // validate={required}
            component={FieldDropSide}
          />
        </>
      ) : null}

      {values[fields.exclusionType] === 3 ? (
        <>
          <Field
            size="md"
            isRequired
            label="Excluded Employee Classifications"
            options={excludedEmployeeClassifications}
            name={fields.excludedEmployeeClassifications}
            value={toMultiSelectValueById(
              selectedExcludedEmployeeClassifications,
              excludedEmployeeClassifications
            )}
            disabled={isEdit && !isSave}
            isMultiSelect
            popupContent={
              <MultiSelectDropdown
                label="Select an Employee Classifications"
                options={excludedEmployeeClassifications}
                onSelect={(value) =>
                  setFieldValue(fields.excludedEmployeeClassifications, value)
                }
                name={fields.excludedEmployeeClassifications}
                value={values[fields.excludedEmployeeClassifications]}
                disabled={isEdit && !isSave}
              />
            }
            // validate={required}
            component={FieldDropSide}
          />

          <Field
            label="Date of hire"
            name={fields.dateOfHire}
            options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.DATE_OF_HIRE)}
            value={values[fields.dateOfHire]}
            selectedValue={values[fields.dateOfHire]}
            component={FieldButtonGroup}
            onChange={(value) => {
              setFieldValue(fields.dateOfHire, value);
            }}
            disabled={isEdit && !isSave}
            size="smd"
          />

          {values[fields.dateOfHire] === 1 ? (
            <Field
              label="Hired on or after date"
              name={fields.hiredOnOrAfterDateEnrollment}
              isDatePicker
              {...rest}
              value={usDateFormat(values[fields.hiredOnOrAfterDateEnrollment])}
              selectedValue={values[fields.hiredOnOrAfterDateEnrollment]}
              component={FieldDropSide}
              onClear={() =>
                setFieldValue(fields.hiredOnOrAfterDateEnrollment, "")
              }
              disabled={isEdit && !isSave}
              popupContent={
                <DatePicker
                  onDayClick={(value) =>
                    onDaySelected(fields.hiredOnOrAfterDateEnrollment, value)
                  }
                  value={values[fields.hiredOnOrAfterDateEnrollment]}
                />
              }
            />
          ) : (
            <div></div>
          )}

          {values[fields.dateOfHire] === 2 ? (
            <Field
              label="Hired on or before date"
              name={fields.hiredOnOrBeforeDateEnrollment}
              isDatePicker
              {...rest}
              value={usDateFormat(values[fields.hiredOnOrBeforeDateEnrollment])}
              selectedValue={values[fields.hiredOnOrBeforeDateEnrollment]}
              component={FieldDropSide}
              onClear={() =>
                setFieldValue(fields.hiredOnOrBeforeDateEnrollment, "")
              }
              disabled={isEdit && !isSave}
              popupContent={
                <DatePicker
                  onDayClick={(value) =>
                    onDaySelected(fields.hiredOnOrBeforeDateEnrollment, value)
                  }
                  value={values[fields.hiredOnOrBeforeDateEnrollment]}
                />
              }
            />
          ) : (
            <div></div>
          )}

          {values[fields.dateOfHire] === 3 ? (
            <>
              <p className="font-weight-500 text-black">
                Hired Between(Inclusive)
              </p>
              <Row>
                <Col md="4">
                  <Field
                    label="From"
                    name={fields.hiredBetweenFrom}
                    isDatePicker
                    size="md"
                    // {...rest}
                    value={usDateFormat(values[fields.hiredBetweenFrom])}
                    selectedValue={values[fields.hiredBetweenFrom]}
                    component={FieldDropSide}
                    onClear={() => setFieldValue(fields.hiredBetweenFrom, "")}
                    disabled={isEdit && !isSave}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.hiredBetweenFrom, value)
                        }
                        value={values[fields.hiredBetweenFrom]}
                      />
                    }
                  />
                </Col>
                <Col>
                  <Field
                    label="To"
                    name={fields.hiredBetweenTo}
                    isDatePicker
                    size="md"
                    // {...rest}
                    value={usDateFormat(values[fields.hiredBetweenTo])}
                    selectedValue={values[fields.hiredBetweenTo]}
                    component={FieldDropSide}
                    onClear={() => setFieldValue(fields.hiredBetweenTo, "")}
                    disabled={isEdit && !isSave}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.hiredBetweenTo, value)
                        }
                        value={values[fields.hiredBetweenTo]}
                      />
                    }
                  />
                </Col>
              </Row>
            </>
          ) : null}

          <Field
            size="md"
            isRequired
            label="Excluded Employment Status"
            options={excludedEmploymentStatuses}
            name={fields.excludedEmploymentStatuses}
            value={toMultiSelectValueById(
              selectedexcludedEmploymentStatuses,
              excludedEmploymentStatuses
            )}
            disabled={isEdit && !isSave}
            isMultiSelect
            popupContent={
              <MultiSelectDropdown
                label="Select as Employment Status"
                options={excludedEmploymentStatuses}
                onSelect={(value) =>
                  setFieldValue(fields.excludedEmploymentStatuses, value)
                }
                selectedOptions={fields.excludedEmploymentStatuses}
                name={fields.excludedEmploymentStatuses}
                value={values[fields.excludedEmploymentStatuses]}
                disabled={isEdit && !isSave}
              />
            }
            // validate={required}
            component={FieldDropSide}
          />
        </>
      ) : null}
    </div>
  );
};

export default ExcludedEmployeeClassficationFields;
