import { Field } from "formik";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  FieldInput,
  FieldDropSide,
  SearchableList,
  FieldInputSSN,
} from "../../../../shared/components";
import {
  getFormattedSsn,
  required,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
} from "../../../../shared/utils";

import { useRequest, useDeepEffect } from "../../../../shared/abstracts"
import { getCompaniesList, getPayrollFrequencies } from "../../../services";

const PersonalInformationFields = (props) => {
  const { fields, values, setFieldValue, isEdit, isSave, handleChange } = props;
  const [frequencyList, setFrequencyList] = useState([]);
  const { response: companies } = useRequest({
    method: getCompaniesList,
    payload: 1, //TenantId, HardCoding should be removed
    defaultResponse: [],
  });
  useDeepEffect(() => {
    if (values[fields.companyId]) {
      getPayrollFrequencies(values[fields.companyId])
        .then((response) => {
          setFrequencyList(response);
        })
        .catch((error) => {
          //Handle Error
        });
    }
  }, [values[fields.companyId]]);
  return (
    <div>
      <p className="mt-20 plan-sub-heading">Personal Information</p>
      <div className="d-flex">
        <Field
          size="md"
          isRequired
          name={fields.firstName}
          label={"First Name"}
          type="text"
          autoComplete="off"
          value={values[fields.firstName]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInput}
        />
        &nbsp;&nbsp;
        <Field
          size="xs"
          isRequired
          name={fields.middleName}
          label={"Middle Name"}
          type="text"
          autoComplete="off"
          value={values[fields.middleName]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInput}
        />
        &nbsp;&nbsp;
        <Field
          size="md"
          isRequired
          name={fields.lastName}
          label={"Last Name"}
          type="text"
          autoComplete="off"
          value={values[fields.lastName]}
          onChange={handleChange}
          disabled={isEdit && !isSave}
          component={FieldInput}
        />
      </div>
      <Field
        size="md"
        isRequired
        name={fields.uniquePersonalIdentification}
        label={"Social Security Number"}
        type="text"
        autoComplete="off"
        value={getFormattedSsn(values[fields.uniquePersonalIdentification])}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInputSSN}
        maxLength="11"
      />
      <Field
        size="md"
        isRequired
        name={fields.companyId}
        options={
          companies &&
          companies.map((company, index) => ({
            label: company.name,
            value: parseInt(company.id),
          }))
        }
        value={values[fields.companyId]}
        label="Company Name"
        popupContent={
          <SearchableList
            label="Select Company"
            options={
              companies &&
              companies.map((company, index) => ({
                label: company.name,
                value: parseInt(company.id),
              }))
            }
            onSelect={(value, label) => {
              setFieldValue(fields.companyName, label);
              setFieldValue(fields.companyId, value);
            }}
            selectedValue={values[fields.companyId]}
            value={values[fields.companyId]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        size="md"
        isRequired
        name={fields.employeeNumber}
        label={"Employee ID"}
        type="text"
        noLabelTransform
        autoComplete="off"
        value={values[fields.employeeNumber]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
      />
      <Field
        size="md"
        isRequired
        name={fields.payrollFrequencyId}
        value={values[fields.payrollFrequencyId]}
        options={
          frequencyList &&
          frequencyList.map((frequency, index) => ({
            label: frequency.name,
            value: frequency.id,
          }))
          //  [{label:"monthly",value:257}]
        }
        label="Payroll Frequency"
        popupContent={
          <SearchableList
            label="Select Payroll Frequency"
            options={
              frequencyList &&
              frequencyList.map((frequency, index) => ({
                label: frequency.name,
                value: frequency.id,
              }))
            }
            onSelect={(value) => {
              // setFieldValue(
              //   fields.payrollFrequency,
              //   frequencyList[value].name
              // );
              setFieldValue(fields.payrollFrequencyId, value);
            }}
            selectedValue={values[fields.payrollFrequencyId]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        size="md"
        name={fields.gender}
        value={values[fields.gender]}
        selectedValue={values[fields.gender]}
        label="Gender"
        options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.GENDER)}
        popupContent={
          <SearchableList
            label="Select Gender"
            options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.GENDER)}
            onSelect={(value) => setFieldValue(fields.gender, value)}
            selectedValue={values[fields.gender]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      <Field
        size="md"
        name={fields.maritalStatus}
        value={values[fields.maritalStatus]}
        selectedValue={values[fields.gender]}
        label="Marital Status"
        placeholder="Select Marital Status"
        options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.MARITAL_STATUS)}
        popupContent={
          <SearchableList
            label="Select Marital Status"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.MARITAL_STATUS
            )}
            onSelect={(value) => setFieldValue(fields.maritalStatus, value)}
            selectedValue={values[fields.maritalStatus]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
    </div>
  );
};

export default PersonalInformationFields;
