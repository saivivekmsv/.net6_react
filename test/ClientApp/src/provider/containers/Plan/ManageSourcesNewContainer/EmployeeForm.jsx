import React from "react";
import { Field } from "formik";
import {
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  usDateFormat,
  yesNoOptions,
  clearFieldValues,
} from "../../../utils";
import {
  FieldInput,
  FieldButtonGroup,
  FieldDropSide,
  DatePicker,
} from "../../../components";

const EmployeeForm = (props) => {
  const {
    fields,
    setValues,
    values,
    isEdit,
    isSave,
    setFieldValue,
    hasAdditionalRules,
    handleChange,
  } = props;

  const onSourceCatergoryChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToExculde: [
        fields.sourceType,
        fields.sourceName,
        fields.recordKeepingNumber,
      ],
    });

    setValues({
      ...updatedValues,
      [fields.sourceCategory]: value,
      [fields.isNewContributionAllowed]: false,
      [fields.isDisplayToParticipantWebsite]: false,
      [fields.isContributionManatory]: false,
      [fields.contributionType]: 1,
    });
  };

  const onDaySelected = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };

  const subCatergoryOptions = hasAdditionalRules
    ? OPTIONS_DATA_MAPPER.SOURCES_FORM_DEFERRAL_SUB_CATEGORIES
    : OPTIONS_DATA_MAPPER.SOURCES_FORM_OTHER_SUB_CATEGORIES;
  const subSubCategoryOptions =
    OPTIONS_DATA_MAPPER.SOURCES_FORM_DEFERRAL_SUB_SUB_CATEGORIES;
  return (
    <div>
      <Field
        isRequired
        name={fields.sourceCategory}
        label="Source Category"
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.SOURCES_FORM_EMPLOYEE_CATEGORIES
        )}
        selectedValue={values[fields.sourceCategory]}
        onChange={onSourceCatergoryChange}
        disabled={isEdit || isSave}
        component={FieldButtonGroup}
        size="smd"
      />
      {[2, 4].includes(values[fields.sourceCategory]) && (
        <Field
          isRequired
          name={fields.sourceSubCategory}
          label="Source Sub Category"
          options={toOptionValuesFromMapper(subCatergoryOptions)}
          selectedValue={values[fields.sourceSubCategory]}
          onChange={(value) => {
            setFieldValue(fields.sourceSubCategory, value);
            setFieldValue(setFieldValue(fields.sourceSubSubCategory, null));
          }}
          disabled={isEdit || isSave}
          component={FieldButtonGroup}
          size="lg"
        />
      )}
      {[4].includes(values[fields.sourceSubCategory]) && (
        <Field
          isRequired
          name={fields.sourceSubSubCategory}
          label="Catch Up"
          options={toOptionValuesFromMapper(subSubCategoryOptions)}
          selectedValue={values[fields.sourceSubSubCategory]}
          onChange={(value) => {
            setFieldValue(fields.sourceSubSubCategory, value);
          }}
          disabled={isEdit || isSave}
          component={FieldButtonGroup}
          size="lg"
        />
      )}
      {[5].includes(values[fields.sourceSubCategory]) && (
        <Field
          isRequired
          name={fields.sourceSubSubCategory}
          label="Catch Up"
          options={toOptionValuesFromMapper(subSubCategoryOptions)}
          selectedValue={values[fields.sourceSubSubCategory]}
          onChange={(value) => {
            setFieldValue(fields.sourceSubSubCategory, value);
          }}
          disabled={isEdit || isSave}
          component={FieldButtonGroup}
          size="lg"
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

export default EmployeeForm;
