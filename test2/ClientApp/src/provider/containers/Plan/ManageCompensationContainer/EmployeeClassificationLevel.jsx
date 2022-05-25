import React from "react";
import { isEmpty, get } from "lodash";
import { Field, FieldArray } from "formik";
import {
  FieldInput,
  FieldButtonGroup,
  FieldDropSide,
  MultiSelectDropdown,
  CompensationTable,
  ManageCompensationCategory,
} from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  required,
  toMultiSelectValueById,
  transformToMultiselectSave,
  toOptionValuesFromMapper,
} from "../../../utils";

export const EmployeeClassificationLevel = (props) => {
  const {
    setFieldValue,
    values,
    fields,
    isEdit,
    isSave,
    setValues,
    handleChange,
    clearFieldValues,
    subName,
    subClassifications,
    employeeClassificationCate,
    planCategories,
    wholeItem,
    formValues
  } = props;
   console.log({values,planCategories,employeeClassificationCate,wholeItem,empClassifications});
  
  const empClassifications = isEmpty(wholeItem) ? [
    ...transformToMultiselectSave(
      (values[fields.employeeClassifications] || []).filter(
        (val) =>
          !get(formValues, fields.employeeClassifications, [])
            .map((_) => _.id)
            .includes(val)
      ),
      "employeeClassificationCodeId"
    ),
    ...get(
      formValues,
      fields.employeeClassifications,
      []
    ).filter((val) =>
      (values[fields.employeeClassifications] || []).includes(val.id)
    ),
  ] : get(
    wholeItem ,
    "compensationClassifications",
    []
  ).map((e) => ({
    label: isEmpty(e.codeValue) ? employeeClassificationCate.filter((item) => item.value === e.employeeClassificationCodeId).label : e.codeValue.split("-")[1],
    value: e.employeeClassificationCodeId,
  }));
  //const selectedClassifications =  //employeeClassificationCate.filter(e => empClassifications.filter(f => f.employeeClassificationCodeId === e.code))
  return (
    <div className="slide-scroll">
      <Field
        isRequired
        name={fields.categoryName}
        label={"Category Name"}
        hasSuggestion
        isSuggestionLoading={false}
        type="text"
        autoComplete="off"
        value={wholeItem.name}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />

      <Field
        size="md"
        isRequired
        label="Excluded Employee Classifications"
        options={employeeClassificationCate}
        name={fields.employeeClassifications}
        value={toMultiSelectValueById(
          empClassifications,
          employeeClassificationCate
        )}
        disabled={isEdit && !isSave}
        isMultiSelect
        popupContent={
          <MultiSelectDropdown
            label="Select employee classifications"
            options={employeeClassificationCate}
            onSelect={(value) =>
              setFieldValue(fields.employeeClassifications, value)
            }
            name={fields.employeeClassifications}
            value={empClassifications}
            disabled={isEdit && !isSave}
          />
        }
        // validate={required}
        component={FieldDropSide}
      />
      <span>&nbsp;&nbsp;</span>

      <div className="w-75">
        <p className="font-weight-500">Compensation categories</p>
        {
          <ManageCompensationCategory
            {...props}
            category={get(
              values,
              "employeeClasificationCategories.compensationClassificationCategories",
              []
            )}
            subName={subClassifications}
          />
        }
      </div>
    </div>
  );
};
