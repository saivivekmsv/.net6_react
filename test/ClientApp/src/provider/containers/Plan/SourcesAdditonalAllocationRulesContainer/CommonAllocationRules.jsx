import React, { useState, useContext } from "react";
import { get } from "lodash";
import { Field } from "formik";
import {
  OPTIONS_DATA_MAPPER,
  required,
  toMultiSelectValue,
  toOptionValuesFromMapper,
  usDateFormat,
  toMultiSelectValueById,
} from "../../../utils";
import {
  FieldDropSide,
  FieldInput,
  FieldTextarea,
  MultiSelectDropdown,
  DatePicker,
  FieldButtonGroup,
  DropdownWithImage,
} from "../../../components";
import { createPlanStore } from "../../../contexts";
import { getClassificationCodes } from "../../../services";
import { useDeepEffect } from "../../../abstracts";

const CommonAllocationRules = (props) => {
  const { state } = useContext(createPlanStore);
  const [employeeClassifications, setEmployeeClassifications] = useState([]);

  useDeepEffect(() => {
    getClassificationCodes(get(state, "api.data.companyId", 0))
      .then((response) => {
        setEmployeeClassifications(
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
  const { fields, values, handleChange, isEdit, isSave, setFieldValue } = props;

  const validateEndDate = (value) => {
    if (!value) return "PL253 : Required";
    else if (value <= values[fields.allocationEffectiveStartDate])
      return "PL254 : Effective Start Date should be prior to Effective End Date";
    return null;
  };

  const onDaySelected = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };
  const selectedAvailableEmployeeClassifications =
    values[fields.availableEmployeeClassifications];

  function ValidateAlphaNumeric(value) {
    if (/^[-\w\s]+$/.test(value)) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <div>
      <Field
        isRequired
        name={fields.allocationForumlaDesc}
        label="Allocation Formula Description"
        autoComplete="off"
        value={values[fields.allocationForumlaDesc]}
        onChange={handleChange}
        disabled={isEdit}
        component={FieldTextarea}
        validate={(value) => {
          return [undefined, null, ""].includes(value)
            ? "PL211 : Required"
            : values[fields.allocationForumlaDesc].length > 150
            ? "PL210 : Allocation Formula Description should not Exceed 150 characters"
            : !ValidateAlphaNumeric(values[fields.allocationForumlaDesc])
            ? "PL269 : Allocation Formula description should not accept special characters"
            : undefined;
        }}
        //placeholder="Pre Tax Additional Rule For Auto Enrolled"
      />
      <Field
        isRequired
        label="Allocation effective Start date"
        name={fields.allocationEffectiveStartDate}
        value={usDateFormat(values[fields.allocationEffectiveStartDate])}
        isDatePicker
        onClear={() => setFieldValue(fields.allocationEffectiveStartDate, "")}
        popupContent={
          <DatePicker
            onDayClick={(value) =>
              onDaySelected(fields.allocationEffectiveStartDate, value)
            }
            value={values[fields.allocationEffectiveStartDate]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
        validate={(value) => {
          return [undefined, null, ""].includes(value)
            ? "PL252 : Required"
            : undefined;
        }}
      />
      <Field
        isRequired
        label="Allocation Effective End date"
        name={fields.allocationEffectiveEndDate}
        value={usDateFormat(values[fields.allocationEffectiveEndDate])}
        isDatePicker
        onClear={() => setFieldValue(fields.allocationEffectiveEndDate, "")}
        popupContent={
          <DatePicker
            onDayClick={(value) =>
              onDaySelected(fields.allocationEffectiveEndDate, value)
            }
            value={values[fields.allocationEffectiveEndDate]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
        validate={validateEndDate}
      />
      <Field
        isRequired
        size="smd"
        name={fields.allocationFormulaAppliesTo}
        label={"Allocation Formula applies to"}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.ALLOCATION_FORMULA_APPLIES_TO
        )}
        selectedValue={values[fields.allocationFormulaAppliesTo]}
        value={values[fields.allocationFormulaAppliesTo]}
        onChange={(value) => {
          setFieldValue(fields.allocationFormulaAppliesTo, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit}
      />
      <Field
        isRequired
        label="Employee Classifications Applicable"
        name={fields.availableEmployeeClassifications}
        value={toMultiSelectValueById(
          selectedAvailableEmployeeClassifications,
          employeeClassifications
        )}
        isMultiSelect
        popupContent={
          employeeClassifications.length != 0 ? (
            <MultiSelectDropdown
              label="Select Employee Classifications"
              name={fields.availableEmployeeClassifications}
              onSelect={(value) =>
                setFieldValue(fields.availableEmployeeClassifications, value)
              }
              value={values[fields.availableEmployeeClassifications]}
              options={employeeClassifications}
              disabled={isEdit && !isSave}
            />
          ) : (
            <DropdownWithImage
              label="Select Employee Classifications"
              name={fields.availableEmployeeClassifications}
              value={values[fields.availableEmployeeClassifications]}
              disabled={isEdit && !isSave}
            />
          )
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
        validate={(value) => {
          return value.length === 0 ? "PL256 : Required" : undefined;
        }}
      />
    </div>
  );
};

export default CommonAllocationRules;
