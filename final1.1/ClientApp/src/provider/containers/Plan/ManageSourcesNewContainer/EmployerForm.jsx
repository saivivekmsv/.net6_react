import React from "react";
import { Field } from "formik";
import {
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  usDateFormat,
  yesNoOptions,
  clearFieldValues,
  SOURCE_CATEGORY_NAME_MAPPING,
} from "../../../utils";
import {
  FieldInput,
  FieldButtonGroup,
  FieldDropSide,
  DatePicker,
} from "../../../components";

const EmployerForm = (props) => {
  const {
    fields,
    setValues,
    values,
    isEdit,
    isSave,
    setFieldValue,
    handleChange,
  } = props;

  const onDaySelected = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };

  const handleAdiApplicableToSelect = (value) => {
    setValues({
      ...clearFieldValues({
        values,
        fieldsToExculde: [
          fields.sourceType,
          fields.sourceName,
          fields.recordKeepingNumber,
        ],
      }),
      [fields.sourceCategory]: value,
      [fields.isNewContributionAllowed]: false,
      [fields.isDisplayToParticipantWebsite]: false,
      [fields.responsibleMode]: 1,
      [fields.qmacType]: 1,
    });
  };
  const isAdiApplicableToOther =
    values[fields.sourceCategory] &&
    parseInt(values[fields.sourceCategory], 10) ===
      SOURCE_CATEGORY_NAME_MAPPING.EmployerOther;
  return (
    <div>
      <Field
        isRequired
        name={fields.sourceCategory}
        label="Source Category"
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.SOURCES_EMPLOYER_CATERGORIES
        )}
        selectedValue={values[fields.sourceCategory]}
        onChange={handleAdiApplicableToSelect}
        disabled={isEdit || isSave}
        component={FieldButtonGroup}
        size="lg"
      />
      {isAdiApplicableToOther === true && (
        <Field
          isRequired
          name={fields.sourceSubCategory}
          label="Source Sub Category"
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.SOURCES_FORM_EMPLOYER_OTHER_SUB_CATEGORIES
          )}
          selectedValue={values[fields.sourceSubCategory]}
          onChange={(value) => {
            setFieldValue(fields.sourceSubCategory, value);
          }}
          disabled={isEdit || isSave}
          component={FieldButtonGroup}
          size="md"
        />
      )}
      <Field
        isRequired
        name={fields.sourceName}
        label="Source Name"
        type="text"
        autoComplete="off"
        value={values[fields.sourceName]}
        onChange={handleChange}
        disabled={isEdit}
        component={FieldInput}
        noLabelTransform
      />
      {/* <Field
        isRequired
        name={fields.recordKeepingNumber}
        label="Source ID"
        type="text"
        autoComplete="off"
        value={values[fields.recordKeepingNumber]}
        onChange={handleChange}
        disabled={isEdit}
        component={FieldInput}
        noLabelTransform
        size="sm"
      /> */}
      <Field
        isRequired
        label="Effective start date"
        name={fields.effectiveStartDate}
        value={usDateFormat(values[fields.effectiveStartDate])}
        isDatePicker
        onClear={() => setFieldValue(fields.effectiveStartDate, null)}
        popupContent={
          <DatePicker
            onDayClick={(value) =>
              onDaySelected(fields.effectiveStartDate, value)
            }
            value={values[fields.effectiveStartDate]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        label="Effective End date"
        name={fields.effectiveEndDate}
        value={usDateFormat(values[fields.effectiveEndDate])}
        isDatePicker
        onClear={() => setFieldValue(fields.effectiveEndDate, null)}
        popupContent={
          <DatePicker
            onDayClick={(value) =>
              onDaySelected(fields.effectiveEndDate, value)
            }
            value={values[fields.effectiveEndDate]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        isRequired
        name={fields.isNewContributionAllowed}
        label="New Contribution Allowed?"
        options={yesNoOptions}
        selectedValue={values[fields.isNewContributionAllowed]}
        onChange={(value) => {
          setFieldValue(fields.isNewContributionAllowed, value);
        }}
        disabled={isEdit && !isSave}
        component={FieldButtonGroup}
        size="sm"
      />
      <Field
        isRequired
        name={fields.isDisplayToParticipantWebsite}
        label="Display source to employee?"
        options={yesNoOptions}
        selectedValue={values[fields.isDisplayToParticipantWebsite]}
        onChange={(value) => {
          setFieldValue(fields.isDisplayToParticipantWebsite, value);
        }}
        disabled={isEdit && !isSave}
        component={FieldButtonGroup}
        size="sm"
      />
    </div>
  );
};

export default EmployerForm;
