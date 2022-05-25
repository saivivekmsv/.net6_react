import { Field } from "formik";
import React from "react";
import {
  FieldInput,
  FieldDropSide,
  SearchableList,
  FieldButtonGroup,
} from "../../../components";
import { required, yesNoOptions } from "../../../utils";
import company from "../../../mocks/company.json";

const OtherInformationFields = (props) => {
  const { fields, values, setFieldValue, isEdit, isSave, handleChange } = props;
  return (
    <div>
      <p className="mt-20 plan-sub-heading">Other Information</p>
      <Field
        size="sm"
        name={fields.pendingQDRO}
        label={"Pending QDRO"}
        options={yesNoOptions}
        selectedValue={values[fields.pendingQDRO]}
        value={values[fields.pendingQDRO]}
        onChange={(value) => {
          setFieldValue(fields.pendingQDRO, value);
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        isRequired
        name={fields.ownership}
        label={"Ownership %"}
        type="text"
        autoComplete="off"
        value={values[fields.ownership]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />
      <Field
        size="sm"
        name={fields.familyMemberOfOwner}
        label={"Family Member of Owner ?"}
        options={yesNoOptions}
        selectedValue={values[fields.familyMemberOfOwner]}
        value={values[fields.familyMemberOfOwner]}
        onChange={(value) => {
          setFieldValue(fields.familyMemberOfOwner, value);
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        isRequired
        name={fields.SSNofOwner}
        label={"SSN of Owner / Family Member"}
        type="text"
        autoComplete="off"
        value={values[fields.SSNofOwner]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />
      <Field
        size="sm"
        name={fields.returnMailIndicator}
        label={"Return Mail Indicator ?"}
        options={yesNoOptions}
        selectedValue={values[fields.returnMailIndicator]}
        value={values[fields.returnMailIndicator]}
        onChange={(value) => {
          setFieldValue(fields.returnMailIndicator, value);
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />
      <Field
        size="sm"
        isRequired
        name={fields.officer}
        label={"Officer ?"}
        options={yesNoOptions}
        selectedValue={values[fields.officer]}
        value={values[fields.officer]}
        onChange={(value) => {
          setFieldValue(fields.officer, value);
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />
      <Field
        size="sm"
        name={fields.HCE}
        label={"HCE ?"}
        options={yesNoOptions}
        selectedValue={values[fields.HCE]}
        value={values[fields.HCE]}
        onChange={(value) => {
          setFieldValue(fields.HCE, value);
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />
      <Field
        size="sm"
        name={fields.keyEmployee}
        label={"Key Employee ?"}
        options={yesNoOptions}
        selectedValue={values[fields.keyEmployee]}
        value={values[fields.keyEmployee]}
        onChange={(value) => {
          setFieldValue(fields.keyEmployee, value);
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        name={fields.restrictedEmployee}
        value={values[fields.restrictedEmployee]}
        label="Insider / Restricted Employee ?"
        popupContent={
          <SearchableList
            label="Select Restricted Employee"
            options={company.data.map((value) => ({
              label: value,
              value,
            }))}
            onSelect={(value) =>
              setFieldValue(fields.restrictedEmployee, value)
            }
            selectedValue={values[fields.restrictedEmployee]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
      />
    </div>
  );
};

export default OtherInformationFields;
