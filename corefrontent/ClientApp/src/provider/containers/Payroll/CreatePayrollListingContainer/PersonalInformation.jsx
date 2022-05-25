import { Field } from "formik";
import React from "react";
import {
  FieldInput,
  FieldDropSide,
  SearchableList,
  FieldInputSSN,
} from "../../../components";
import {
  getFormattedSsn,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
} from "../../../utils";
import company from "../../../mocks/company.json";
import payrollFrequency from "../../../mocks/payrollFrequency.json";

const PersonalInformationFields = (props) => {
  const { fields, values, setFieldValue, isEdit, isSave, handleChange } = props;

  return (
    <div>
      <p className="mt-20 plan-sub-heading">Personal Information</p>
      <div className="d-flex">
        <Field
          size="md"
          isRequired
          name={fields.employeeFirstName}
          label={"Employee First Name"}
          type="text"
          autoComplete="off"
          value={values[fields.employeeFirstName]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInput}
          validate={required}
        />
        &nbsp;&nbsp;
        <Field
          size="md"
          isRequired
          name={fields.employeeMiddleName}
          label={"Employee Middle Name"}
          type="text"
          autoComplete="off"
          value={values[fields.employeeMiddleName]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInput}
          validate={required}
        />
        &nbsp;&nbsp;
        <Field
          size="md"
          isRequired
          name={fields.employeeLastName}
          label={"Employee Last Name"}
          type="text"
          autoComplete="off"
          value={values[fields.employeeLastName]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInput}
          validate={required}
        />
      </div>
      <Field
        size="md"
        isRequired
        name={fields.socialSecurityNumber}
        label={"Social Security Number"}
        type="text"
        autoComplete="off"
        value={getFormattedSsn(values[fields.socialSecurityNumber])}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInputSSN}
        validate={required}
        maxLength="11"
      />
      <Field
        size="md"
        name={fields.companyName}
        value={values[fields.companyName]}
        label="Company Name"
        popupContent={
          <SearchableList
            label="Select Company"
            options={company.data.map((value) => ({
              label: value,
              value,
            }))}
            onSelect={(value) => setFieldValue(fields.companyName, value)}
            selectedValue={values[fields.companyName]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        size="md"
        isRequired
        name={fields.employeeId}
        label={"Employee ID"}
        type="text"
        autoComplete="off"
        value={values[fields.employeeId]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />
      <Field
        label="Payroll frequency"
        size="md"
        placeholder="Select frequency"
        name={fields.payrollFrequency}
        value={values[fields.payrollFrequency]}
        direction="right"
        options={payrollFrequency.data}
        popupContent={
          <SearchableList
            label="Select a Payroll Frequency"
            options={payrollFrequency.data}
            onSelect={(value) => setFieldValue(fields.payrollFrequency, value)}
            selectedValue={values[fields.payrollFrequency]}
            name={fields.payrollFrequency}
            isNotTypeAhead
            isRadio
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        label="Gender"
        size="md"
        placeholder="Select Gender"
        name={fields.gender}
        value={values[fields.gender]}
        direction="right"
        options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.GENDER)}
        popupContent={
          <SearchableList
            label="Select Gender"
            options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.GENDER)}
            onSelect={(value) => setFieldValue(fields.gender, value)}
            selectedValue={values[fields.gender]}
            name={fields.gender}
            isNotTypeAhead
            isRadio
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        label="Marital Status"
        size="md"
        placeholder="Select Marital Status"
        name={fields.maritalStatus}
        value={values[fields.maritalStatus]}
        direction="right"
        options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.MARITAL_STATUS)}
        popupContent={
          <SearchableList
            label="Select Marital Status"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.MARITAL_STATUS
            )}
            onSelect={(value) => setFieldValue(fields.maritalStatus, value)}
            selectedValue={values[fields.maritalStatus]}
            name={fields.maritalStatus}
            isNotTypeAhead
            isRadio
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
    </div>
  );
};

export default PersonalInformationFields;
