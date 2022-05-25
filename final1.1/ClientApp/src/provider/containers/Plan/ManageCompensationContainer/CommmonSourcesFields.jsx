import React from "react";
import { Field } from "formik";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInput,
  FieldMultiSelectButtonGroup,
  SearchableList,
} from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  yesNoOptions,
  clearFieldValues,
} from "../../../utils";

const CommmonSourcesFields = (props) => {
  const {
    setFieldValue,
    values,
    fields,
    isEdit,
    isSave,
    setValues,
    setTouched,
  } = props;

  const onisExclusionsChange = (value) => {
    setValues({
      ...clearFieldValues({
        values,
        fieldsToClear: [fields.additionalEnrollmentInfo],
      }),
      [fields.isExclusions]: value,
    });
    setTouched({
      [fields.additionalEnrollmentInfo]: false,
    });
  };

  return (
    <>
      <Field
        isRequired
        name={fields.definition}
        label="Compensation Definition"
        value={values[fields.definition]}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.COMPENSATION_DEFINITIONS
        )}
        popupContent={
          <SearchableList
            isRadio
            isNotTypeAhead
            label="Select a Compensation Definition"
            selectedValue={values[fields.definition]}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.COMPENSATION_DEFINITIONS
            )}
            onSelect={(value) => setFieldValue(fields.definition, value)}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
        validate={required}
      />
      {/* <Field
        isRequired
        size="xxl"
        name={fields.calculationPeriod}
        label={"Compensation Calculation Period"}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.COMPENSATION_CALCULATIONS
        )}
        selectedValue={values[fields.calculationPeriod]}
        value={values[fields.calculationPeriod]}
        onChange={(value) => setFieldValue(fields.calculationPeriod, value)}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      /> */}
    </>
  );
};

export default CommmonSourcesFields;
