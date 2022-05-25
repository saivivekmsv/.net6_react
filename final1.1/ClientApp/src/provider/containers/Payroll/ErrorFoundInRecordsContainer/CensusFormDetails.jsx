import React from "react";
import { ErrorMessage, Field, FieldArray, useFormikContext } from "formik";
import {
  DatePicker,
  FieldDropSide,
  FieldInput,
  FieldInputDecimal,
  FieldInputSSN,
  SearchableList,
} from "../../../components";
import { get, isEmpty } from "lodash";
import {
  getFormattedSsn,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  usDateFormat,
  FORM_PLACEHOLDERS,
  getFormattedPhone,
  getFormattedZip,
} from "../../../utils";
import {
  getPayrollFrequencies,
  getEmploymentStatusList,
} from "../../../services";
import { manageCompanyStore } from "../../../contexts";
import { getStates, getStatesList, getCountriesList } from "../../../services";
import payrollFrequency from "../../../mocks/payrollFrequency.json";
import OtherInformationFields from "../../Employee/EmployeeInformationContainer/OtherInformation";
import CensusFormEmployeeClassification from "./CensusFormEmployeeClassification";
import { useEffect, useState } from "react";
import { useRequest } from "../../../abstracts";
const CensusFormDetails = ({
  fields,
  data,
  fileType,
  awaitingFunding,
  isStartDate,
  isEndDate,
}) => {
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
    getPayrollFrequencies(values.companyId).then((response) => {
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
      switch (_.controlName) {
        case "ytdHours":
          setFieldError("hoursDetails[0].ytdHours", _.messageDescCode);
          break;

        case "payPeriodHours":
          setFieldError("hoursDetails[0].payPeriodHours", _.messageDescCode);
          break;
        case "payPeriodGrossCompensation":
          setFieldError("compensations[0].payPeriodAmount", _.messageDescCode);
          break;
        case "payPeriodPlanCompensation":
          setFieldError("compensations[1].payPeriodAmount", _.messageDescCode);
          break;
        case "ytdGrossCompensation":
          setFieldError("compensations[0].ytdAmount", _.messageDescCode);
          break;
        case "ytdPlanCompensation":
          setFieldError("compensations[1].ytdAmount", _.messageDescCode);
          break;
        default:
          setFieldError(_.controlName, _.messageDescCode);
          break;
      }
    });
  }, [data]);

  const { response: employmentStatusList } = useRequest({
    method: getEmploymentStatusList,
    payload: get(values, "companyId", 0),
    defaultResponse: [],
  });
  console.log("awaitingFundingsss", awaitingFunding);
  const masterEmploymentStatusId = employmentStatusList.find(
    ({ id }) => id === values[fields.employmentStatusId]
  )
    ? employmentStatusList.find(
        ({ id }) => id === values[fields.employmentStatusId]
      ).employmentStatus
    : 0;
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
          disabled={awaitingFunding}
          isRequired
        />

        <Field
          name={fields.middleName}
          label={"Middle name/initial"}
          type="text"
          autoComplete="off"
          value={values[fields.middleName]}
          onChange={handleChange}
          component={FieldInput}
          disabled={awaitingFunding}
        />
        <Field
          name={fields.lastName}
          label={"Last name"}
          type="text"
          autoComplete="off"
          value={values[fields.lastName]}
          onChange={handleChange}
          component={FieldInput}
          disabled={awaitingFunding}
          isRequired
        />
        <Field
          label="Gender"
          size="md"
          placeholder="Select Gender"
          name={fields.gender}
          direction="right"
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
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
            disabled={awaitingFunding}
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
          disabled={awaitingFunding}
          type="text"
          autoComplete="off"
          value={getFormattedSsn(values[fields.uniquePersonalIdentification])}
          onChange={handleChange}
          component={FieldInputSSN}
          placeholder={FORM_PLACEHOLDERS.ssn}
          disableField={true}
          maxLength="11"
        />
        <div className="plan-sub-heading">Contact Information</div>
        <Field
          label="Email"
          name={fields.primaryEmailAddress}
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
          type="text"
          autoComplete="off"
          value={getFormattedPhone(values[fields.mobilePhoneNumber])}
          onChange={handleChange}
          component={FieldInput}
          placeholder={FORM_PLACEHOLDERS.phone}
          maxLength="12"
        />
        <div className="plan-sub-heading">Address</div>
        {/* <Field
          size="md"
          name={fields.address}
          label={"Address Name"}
          type="text"
          autoComplete="off"
          value={values[fields.address]}
          onChange={handleChange}
          component={FieldInput}
        /> */}
        <Field
          size="md"
          name={fields.address1}
          label={"Address 1"}
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
          type="text"
          autoComplete="off"
          value={values[fields.address2]}
          onChange={handleChange}
          component={FieldInput}
        />
        <Field
          size="md"
          name={fields.address3}
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
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
                setFieldValue(fields.zipCode, null);
                value == 1 &&
                  setFieldValue(fields.foreignCountry, null) &&
                  setFieldValue(fields.foreignState, null);
                value == 2 &&
                  setFieldValue(fields.state, null) &&
                  setFieldValue(fields.stateId, null);
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
              name={fields.stateId}
              label="State"
              disabled={awaitingFunding}
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
              disabled={awaitingFunding}
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
              disabled={awaitingFunding}
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
              disabled={awaitingFunding}
              type="text"
              autoComplete="off"
              value={values[fields.foreignState]}
              onChange={handleChange}
              component={FieldInput}
            />
            <Field
              size="md"
              isRequired
              name={fields.zipCode}
              label={"Foreign Zip Code"}
              disabled={awaitingFunding}
              type="text"
              autoComplete="off"
              onChange={handleChange}
              component={FieldInput}
              value={values[fields.zipCode]}
            />
          </>
        )}

        <div className="plan-sub-heading">Profile Information</div>
        <Field
          size="md"
          name={fields.companyName}
          value={values[fields.companyName]}
          label="Company Name"
          disabled={true}
          onChange={handleChange}
          component={FieldInput}
          isRequired
        />
        <Field
          size="md"
          name={fields.employeeNumber}
          label={"Employee ID"}
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
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
                let _ = employmentStatusList.find(({ id }) => id === value);
                if (!isStartDate && ![4, 5, 9].includes(_.employmentStatus)) {
                  setFieldValue(fields.leaveStartDate, null);
                }
                if (!isEndDate && ![4, 5, 9].includes(_.employmentStatus)) {
                  setFieldValue(fields.leaveEndDate, null);
                }
              }}
              selectedValue={values[fields.employmentStatusId]}
              value={values[fields.employmentStatusId]}
            />
          }
          component={FieldDropSide}
        />
        <Field
          label="Leave Start Date"
          isRequired
          size="md"
          name={fields.leaveStartDate}
          value={usDateFormat(values[fields.leaveStartDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.leaveStartDate, null)}
          popupContent={
            <DatePicker
              onDayClick={(value) =>
                onDaySelected(fields.leaveStartDate, value)
              }
              value={values[fields.leaveStartDate]}
            />
          }
          component={FieldDropSide}
          disabled={![4, 5, 9].includes(masterEmploymentStatusId)}
        />
        <Field
          label="Leave End Date"
          size="md"
          name={fields.leaveEndDate}
          value={usDateFormat(values[fields.leaveEndDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.leaveEndDate, null)}
          popupContent={
            <DatePicker
              onDayClick={(value) => onDaySelected(fields.leaveEndDate, value)}
              value={values[fields.leaveEndDate]}
            />
          }
          component={FieldDropSide}
          disabled={![4, 5, 9].includes(masterEmploymentStatusId)}
        />
        <Field
          label="Hire Date"
          size="md"
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
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
          disabled={awaitingFunding}
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
        {fileType == 1 && (
          <FieldArray name={fields.hoursDetails}>
            {() => {
              return (
                <>
                  <Field
                    size="xs"
                    name={"hoursDetails[0].payPeriodHours"}
                    autoComplete="off"
                    label="Hours"
                    noLabelTransform={true}
                    onChange={handleChange}
                    disabled={
                      values[fields.modeOfHours] != 1 || awaitingFunding
                    }
                    max={9999}
                    component={FieldInputDecimal}
                  />
                  <Field
                    size="xs"
                    name={"hoursDetails[0].ytdHours"}
                    label="YTD Hours"
                    noLabelTransform={true}
                    autoComplete="off"
                    onChange={handleChange}
                    disabled={
                      values[fields.modeOfHours] == 1 || awaitingFunding
                    }
                    max={9999}
                    component={FieldInputDecimal}
                  />
                </>
              );
            }}
          </FieldArray>
        )}
        <CensusFormEmployeeClassification
          id={values.companyId}
          awaitingFunding={awaitingFunding}
        />
        <OtherInformationFields
          {...formProps}
          fields={fields}
          awaitingFunding={awaitingFunding}
        />
      </div>
    </div>
  );
};

export default CensusFormDetails;
