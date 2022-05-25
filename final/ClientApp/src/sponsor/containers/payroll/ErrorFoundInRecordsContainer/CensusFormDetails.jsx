import React from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import {
  DatePicker,
  FieldDropSide,
  FieldInput,
  FieldInputSSN,
  SearchableList,
} from "../../../../shared/components";
import { get } from "lodash";
import {
  getFormattedSsn,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  usDateFormat,
  FORM_PLACEHOLDERS,
  getFormattedPhone,
  getFormattedZip,
} from "../../../../shared/utils";
import {
  getPayrollFrequencies,
  getEmploymentStatusList,
} from "../../../services";
import { manageCompanyStore } from "../../../contexts";
import { getStates, getStatesList, getCountriesList } from "../../../services";
import OtherInformationFields from "../../Employee/EmployeeInformationContainer/OtherInformation";
import CensusFormEmployeeClassification from "./CensusFormEmployeeClassification";
import { useEffect, useState } from "react";
import { useRequest } from "../../../../shared/abstracts";
const CensusFormDetails = ({ fields, data }) => {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [stateList, setStateList] = useState([]);

  const [frequencyList, setFrequencyList] = useState([]);
  const formProps = useFormikContext();
  const {
    values,
    handleChange,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    errors,
  } = formProps;

  const onDaySelected = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };
  useEffect(() => {
    getPayrollFrequencies(values[fields.companyId]).then((response) => {
      setFrequencyList(response);
    });
    getStates().then((response) => {
      setStates(response);
    });
    getCountriesList().then((response) => {
      setCountries(response);
    });

    console.log(errors, "log error");
    data.errorMessages.forEach((_) => {
      setFieldError(_.controlName, _.messageDescCode);
    });
  }, [data]);

  const { response: employmentStatusList } = useRequest({
    method: getEmploymentStatusList,
    payload: get(values, "companyId", 0),
    defaultResponse: [],
  });

  return (
    <div className="d-flex column-scroll">
      <div className="w-100">
        <div className="plan-sub-heading">Personal Details</div>
        <Field
          name={fields.firstName}
          label={"First name"}
          type="text"
          autoComplete="off"
          value={values[fields.firstName]}
          onChange={handleChange}
          component={FieldInput}
          isRequired
        />
        <Field
          name={fields.middleName}
          label={"Middle name"}
          type="text"
          autoComplete="off"
          value={values[fields.middleName]}
          onChange={handleChange}
          component={FieldInput}
        />
        <Field
          name={fields.lastName}
          label={"Last name"}
          type="text"
          autoComplete="off"
          value={values[fields.lastName]}
          onChange={handleChange}
          component={FieldInput}
          isRequired
        />
        <Field
          label="Gender"
          size="md"
          placeholder="Select Gender"
          name={fields.gender}
          direction="right"
          options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.GENDER)}
          popupContent={
            <SearchableList
              label="Select Gender"
              options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.GENDER)}
              onSelect={(value) => setFieldValue(fields.gender, value)}
              name={fields.gender}
              selectedValue={values[fields.gender]}
            />
          }
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
            />
          }
          component={FieldDropSide}
        />
        <div className="d-flex">
          <Field
            label="Date of Birth"
            size="md"
            name={fields.birthDate}
            value={usDateFormat(values[fields.birthDate])}
            isDatePicker
            onClear={() => onDaySelected(fields.birthDate, "")}
            popupContent={
              <DatePicker
                onDayClick={(value) => onDaySelected(fields.birthDate, value)}
                value={values[fields.birthDate]}
              />
            }
            component={FieldDropSide}
            required
          />
          {values.birthDate && (
            <div className="date-checker ml-4" style={{ alignSelf: "center" }}>
              {Math.abs(
                new Date(values.birthDate).getFullYear() -
                  new Date().getFullYear()
              )}{" "}
              year{" "}
              {Math.abs(
                new Date(values.birthDate).getMonth() - new Date().getMonth()
              )}{" "}
              Months
            </div>
          )}
        </div>
        <Field
          size="md"
          name={fields.uniquePersonalIdentification}
          label={"Social Security Number"}
          type="text"
          autoComplete="off"
          value={getFormattedSsn(values[fields.uniquePersonalIdentification])}
          onChange={handleChange}
          component={FieldInputSSN}
          placeholder={FORM_PLACEHOLDERS.ssn}
          maxLength="11"
        />
        <div className="plan-sub-heading">Contact Information</div>
        <Field
          label="Email"
          name={fields.primaryEmailAddress}
          type="text"
          value={values[fields.primaryEmailAddress]}
          onChange={handleChange}
          autoComplete="nope"
          component={FieldInput}
        />
        <Field
          size="md"
          name={fields.mobilePhoneNumber}
          label={"Primary Phone Number"}
          type="text"
          autoComplete="off"
          value={getFormattedPhone(values[fields.mobilePhoneNumber])}
          onChange={handleChange}
          component={FieldInput}
          placeholder={FORM_PLACEHOLDERS.phone}
          maxLength="12"
        />
        <div className="plan-sub-heading">Address</div>
        <Field
          size="md"
          name={fields.address1}
          label={"Address 1"}
          type="text"
          autoComplete="off"
          value={values[fields.address1]}
          onChange={handleChange}
          component={FieldInput}
          isRequired
        />
        <Field
          size="md"
          name={fields.address2}
          label={"Address 2"}
          type="text"
          autoComplete="off"
          value={values[fields.address2]}
          onChange={handleChange}
          component={FieldInput}
        />
        <Field
          size="md"
          name={fields.address3}
          label={"Address 3"}
          type="text"
          autoComplete="off"
          value={values[fields.address3]}
          onChange={handleChange}
          component={FieldInput}
        />
        <Field
          label="City"
          name={fields.city}
          type="text"
          value={values[fields.city]}
          onChange={handleChange}
          autoComplete="nope"
          component={FieldInput}
          isRequired
        />
        <Field
          size="md"
          isRequired
          name={fields.countryId}
          value={values[fields.countryId]}
          label="Country"
          options={
            countries &&
            countries.map((country, index) => ({
              label: country.code,
              value: country.id,
            }))
          }
          popupContent={
            <SearchableList
              label="Select Country"
              options={
                countries &&
                countries.map((country, index) => ({
                  label: country.code,
                  value: country.id,
                }))
              }
              onSelect={(value, label) => {
                setFieldValue(fields.country, label);
                setFieldValue(fields.countryId, value);
                setFieldValue(fields.countryCode, label);
                value == 1 &&
                  setFieldValue(fields.foreignCountry, null) &&
                  setFieldValue(fields.foreignState, null) &&
                  setFieldValue(fields.foreignZipCode, null);
                value == 2 &&
                  setFieldValue(fields.state, null) &&
                  setFieldValue(fields.stateId, null) &&
                  setFieldValue(fields.zipCode, null);
                getStatesList(fields.countryId)
                  .then((response) => {
                    setStateList(response);
                  })
                  .catch((error) => {
                    //Handle error
                  });
              }}
              value={values[fields.countryId]}
              selectedValue={values[fields.countryId]}
            />
          }
          component={FieldDropSide}
        />

        {values[fields.countryId] == 1 && (
          <>
            <Field
              size="md"
              name={fields.state}
              label="State"
              options={
                states &&
                states.map((state, index) => ({
                  label: state.stateDescription,
                  value: state.id,
                }))
              }
              value={values[fields.stateId]}
              isRequired
              popupContent={
                <SearchableList
                  options={
                    states &&
                    states.map((state, index) => ({
                      label: state.stateDescription,
                      value: state.id,
                    }))
                  }
                  onSelect={(value) => setFieldValue(fields.stateId, value)}
                  height="250px"
                  selectedValue={values[fields.stateId]}
                  value={values[fields.stateId]}
                />
              }
              component={FieldDropSide}
            />
            <Field
              size="smd"
              name={fields.zipCode}
              label={"Zip Code"}
              type="text"
              autoComplete="off"
              onChange={handleChange}
              component={FieldInput}
              value={getFormattedZip(values[fields.zipCode])}
              placeholder={FORM_PLACEHOLDERS.zip}
              maxLength="10"
              isRequired
            />
          </>
        )}

        {values[fields.countryId] == 2 && (
          <>
            <Field
              size="md"
              isRequired
              name={fields.foreignCountry}
              label={"Foreign Country"}
              type="text"
              autoComplete="off"
              value={values[fields.foreignCountry]}
              onChange={handleChange}
              component={FieldInput}
            />
            <Field
              size="md"
              isRequired
              name={fields.foreignState}
              label={"Foreign State"}
              type="text"
              autoComplete="off"
              value={values[fields.foreignState]}
              onChange={handleChange}
              component={FieldInput}
            />
            <Field
              size="md"
              isRequired
              name={fields.foreignZipCode}
              label={"Foreign Zip Code"}
              type="number"
              autoComplete="off"
              onChange={handleChange}
              component={FieldInput}
              value={values[fields.foreignZipCode]}
            />
          </>
        )}

        <div className="plan-sub-heading">Profile Information</div>
        <Field
          size="md"
          name={fields.companyName}
          value={values[fields.companyName]}
          label="Company Name"
          onChange={handleChange}
          component={FieldInput}
          isRequired
        />
        <Field
          size="md"
          name={fields.employeeNumber}
          label={"Employee ID"}
          noLabelTransform
          type="text"
          autoComplete="off"
          value={values[fields.employeeNumber]}
          onChange={handleChange}
          component={FieldInput}
        />

        <Field
          size="md"
          name={fields.payrollFrequencyId}
          label="Payroll Frequency"
          direction="right"
          isRequired
          options={
            frequencyList &&
            frequencyList.map((frequency, index) => ({
              label: frequency.name,
              value: frequency.id,
            }))
            //  [{label:"monthly",value:257}]
          }
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
              name={fields.payrollFrequencyId}
              onSelect={(value) => {
                setFieldValue(fields.payrollFrequencyId, value);
              }}
              selectedValue={values[fields.payrollFrequencyId]}
            />
          }
          component={FieldDropSide}
        />
        <Field
          size="md"
          isRequired
          name={fields.employmentStatus}
          label="Employment Status"
          isRequired
          popupContent={
            <SearchableList
              label="Select Employment Status"
              options={
                employmentStatusList &&
                employmentStatusList.map((status, index) => ({
                  label: status.employmentStatusName,
                  value: status.id,
                }))
              }
              onSelect={(value) => {
                setFieldValue(
                  fields.employmentStatus,
                  employmentStatusList.find((x) => x.id === value)
                    .employmentStatusName
                );
                setFieldValue(fields.employmentStatusId, value);
              }}
              selectedValue={values[fields.employmentStatusId]}
            />
          }
          component={FieldDropSide}
        />
        <Field
          label="Hire Date"
          size="md"
          name={fields.hireDate}
          value={usDateFormat(values[fields.hireDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.hireDate, null)}
          isRequired
          popupContent={
            <DatePicker
              onDayClick={(value) => onDaySelected(fields.hireDate, value)}
              value={values[fields.hireDate]}
            />
          }
          component={FieldDropSide}
        />
        <Field
          label="Most Recent Term Date"
          size="md"
          name={fields.mostRecentTermDate}
          value={usDateFormat(values[fields.mostRecentTermDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.mostRecentTermDate, null)}
          popupContent={
            <DatePicker
              onDayClick={(value) =>
                onDaySelected(fields.mostRecentTermDate, value)
              }
              value={values[fields.mostRecentTermDate]}
            />
          }
          component={FieldDropSide}
        />
        <Field
          label="Most Recent Rehire Date"
          size="md"
          name={fields.rehireDate}
          value={usDateFormat(values[fields.rehireDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.rehireDate, null)}
          popupContent={
            <DatePicker
              onDayClick={(value) => onDaySelected(fields.rehireDate, value)}
              value={values[fields.rehireDate]}
            />
          }
          component={FieldDropSide}
        />
        <CensusFormEmployeeClassification />
        <OtherInformationFields {...formProps} fields={fields} />
      </div>
    </div>
  );
};

export default CensusFormDetails;
