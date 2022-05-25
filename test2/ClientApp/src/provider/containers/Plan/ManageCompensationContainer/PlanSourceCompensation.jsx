import React, { useContext, useEffect, useState } from "react";
import { get, isEmpty, values, isEqual } from "lodash";
import { Field } from "formik";
import {
  ManagePlanLayout,
  AddButton,
  CsplTable as Table,
  FieldInput,
  AddPlans,
  FieldButtonGroup,
  FieldDropSide,
  MultiSelectDropdown,
  Link,
  SliderPanel,
  LoaderWrapper,
  CompensationTable,
  ManageCompensationCategory,
  SearchableList,
} from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  includeExcludeIgnoreOptions,
  yesNoOptions,
  required,
  ROUTES,
  transformToMultiselectSave,
  toMultiSelectValueById,
  getAdvancedPathWithParam,
  toOptionValuesFromMapper,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanLocalCache,
  clearLocalCacheByModel,
} from "../../../contexts";
import CommmonSourcesFields from "./CommmonSourcesFields";
export const PlanSourceCompensation = (props) => {
  const {
    setFieldValue,
    values,
    fields,
    isEdit,
    isSave,
    setValues,
    setTouched,
    handleChange,
    clearFieldValues,
    sourceFields,
    sourceList,
    sourceFieldName,
    subName,
    subClassifications,
    employeeClassificationCate,
    sourceData,
  } = props;
  console.log(sourceData, "fwonvow");
  const [showError, setShowError] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const showPopup = () => {
    setModalOpen(true);
  };
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
      <div className="slide-scroll">
        <Field
          isRequired
          name={sourceFields.compensationName}
          label={"Category Name"}
          hasSuggestion
          isSuggestionLoading={false}
          type="text"
          autoComplete="off"
          value={values[sourceFields.compensationName]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInput}
          validate={required}
        />

        <Field
          size="md"
          isRequired
          label="Source Name"
          options={sourceList}
          name={sourceFieldName.name}
          value={toMultiSelectValueById(
            values[sourceFieldName.name],
            sourceList
          )}
          disabled={isEdit && !isSave}
          isMultiSelect
          popupContent={
            <MultiSelectDropdown
              label="Select employee classifications"
              options={sourceList}
              onSelect={(value) => setFieldValue(sourceFieldName.name, value)}
              name={sourceFieldName.name}
              value={values[sourceFieldName.name]}
              disabled={isEdit && !isSave}
            />
          }
          // validate={required}
          component={FieldDropSide}
        />

        <span>&nbsp;&nbsp;</span>
        <div>
          <p className="font-weight-500">Compensation categories</p>
          <ManageCompensationCategory
            {...props}
            category={get(values, "sourceCompensationCategories", {})}
            subName={subName}
          />
        </div>
        <span>&nbsp;&nbsp;</span>

        <Field
          isRequired
          size="sm"
          name={sourceFields.isDifferAtClassificationLevel}
          label={"Compensation differs for employee classification?"}
          options={yesNoOptions}
          selectedValue={values[sourceFields.isDifferAtClassificationLevel]}
          value={values[sourceFields.isDifferAtClassificationLevel]}
          onChange={(value) =>
            setFieldValue(sourceFields.isDifferAtClassificationLevel, value)
          }
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />

        {/* {values[sourceFields.isDifferAtClassificationLevel] &&
          isEmpty(sourceData) && (
            <AddPlans
              content="No employee classification added."
              buttonLabel="Add Employee Classification"
              className="h-auto"
              showError={showError}
              errorMessage="Employee Classification is required."
              disabled={isEdit && !isSave}
              onPrimaryClick={showPopup}
            />
          )} */}

        {values[sourceFields.isDifferAtClassificationLevel] &&
          isEmpty(sourceData) && (
            <div>
              <Field
                size="md"
                isRequired
                label="Employee classifications"
                options={employeeClassificationCate}
                name={fields.sourceEmployeeClassifications}
                value={toMultiSelectValueById(
                  values[fields.sourceEmployeeClassifications],
                  employeeClassificationCate
                )}
                disabled={isEdit && !isSave}
                isMultiSelect
                popupContent={
                  <MultiSelectDropdown
                    label="Select employee classifications"
                    options={employeeClassificationCate}
                    onSelect={(value) =>
                      setFieldValue(fields.sourceEmployeeClassifications, value)
                    }
                    name={fields.sourceEmployeeClassifications}
                    value={values[fields.sourceEmployeeClassifications]}
                    disabled={isEdit && !isSave}
                  />
                }
                // validate={required}
                component={FieldDropSide}
              />

              <ManageCompensationCategory
                {...props}
                category={get(
                  values,
                  "sourceCompensationClassificationCategories",
                  {}
                )}
                subName={subClassifications}
              />
            </div>
          )}

        <span>&nbsp;&nbsp;</span>
        <Field
          isRequired
          size="sm"
          name={sourceFields.isPreEntry}
          label={"Include Pre-enty compensation"}
          options={yesNoOptions}
          selectedValue={values[sourceFields.isPreEntry]}
          value={values[sourceFields.isPreEntry]}
          onChange={(value) => setFieldValue(sourceFields.isPreEntry, value)}
          component={FieldButtonGroup}
          disabled={isEdit && !isSave}
        />
      </div>
    </>
  );
};
