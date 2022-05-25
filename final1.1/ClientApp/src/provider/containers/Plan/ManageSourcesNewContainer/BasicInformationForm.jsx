import React from "react";
import { Field } from "formik";
import { FieldButtonGroup } from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  clearFieldValues,
} from "../../../utils";
import EmployeeForm from "./EmployeeForm";
import EmployerForm from "./EmployerForm";

const BasicInformationForm = (props) => {
  const {
    fields,
    values,
    setValues,
    isEdit,
    isSave,
    setFieldValue,
    handleChange,
    hasAdditionalRules,
  } = props;

  const onSourceTypeChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToExculde: [fields.sourceType],
    });

    setValues({
      ...updatedValues,
      [fields.sourceType]: value,
      [fields.isNewContributionAllowed]: false,
      [fields.isDisplayToParticipantWebsite]: false,
      [fields.contributionType]: 1,
      [fields.isContributionManatory]: false,
      [fields.responsibleMode]: 1,
    });
  };

  const isEmployee = parseInt(values[fields.sourceType], 10) !== 2;
  return (
    <div>
      <Field
        isRequired
        name={fields.sourceType}
        label="Source Type"
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.SOURCES_FORM_TYPES
        )}
        selectedValue={values[fields.sourceType]}
        onChange={onSourceTypeChange}
        disabled={isEdit || isSave}
        size="smdd"
        component={FieldButtonGroup}
      />
      {isEmployee && (
        <EmployeeForm
          fields={fields}
          values={values}
          setFieldValue={setFieldValue}
          isEdit={isEdit}
          isSave={isSave}
          handleChange={handleChange}
          hasAdditionalRules={hasAdditionalRules}
          setValues={setValues}
        />
      )}
      {!isEmployee && (
        <EmployerForm
          fields={fields}
          values={values}
          setFieldValue={setFieldValue}
          isEdit={isEdit}
          isSave={isSave}
          handleChange={handleChange}
          hasAdditionalRules={hasAdditionalRules}
          setValues={setValues}
        />
      )}
    </div>
  );
};

export default BasicInformationForm;
