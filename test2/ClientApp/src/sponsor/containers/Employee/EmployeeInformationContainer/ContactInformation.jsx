/* eslint-disable eqeqeq */
import { Field } from "formik";
import React, { useState, useEffect } from "react";
import {
  FieldInput,
  FieldDropSide,
  SearchableList,
  FieldButtonGroup,
} from "../../../../shared/components";
import {
  FORM_PLACEHOLDERS,
  getFormattedPhone,
  getFormattedZip,
  required,
  yesNoOptions,
} from "../../../../shared/utils"

import country from "../../../../shared/mocks/country.json";
import states from "../../../../shared/mocks/state.json";
import { getStates } from "../../../services";
import { getCountriesList, getStatesList } from "../../../services";
//import { response } from "express";
import { useDeepEffect } from "../../../../shared/abstracts";

const ContactInformationFields = (props) => {
  const [isAdd, setIsAdd] = useState(false);
  const toggle = () => {
    setIsAdd(!isAdd);
  };
  const { fields, values, setFieldValue, isEdit, isSave, handleChange } = props;
  const [stateList, setStateList] = useState([]);
  //const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  // const { response: countries } = useRequest({
  //   method: getCountriesList,
  //   //payload: 1, //TenantId, HardCoding should be removed
  //   defaultResponse: [],
  // });
  useDeepEffect(() => {
    getCountriesList().then((response) => {
      setCountries(response);
    });
  }, [countries]);

  useDeepEffect(() => {
    getStates().then((response) => {
      setStateList(response);
    });
  }, [stateList]);
  return (
    <div>
      <p className="mt-20 plan-sub-heading">Contact Information</p>
      <Field
        size="md"
        isRequired
        name={fields.primaryEmailAddress}
        label={"Email"}
        type="text"
        autoComplete="off"
        value={values[fields.primaryEmailAddress]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
      />
      <Field
        size="md"
        isRequired
        name={fields.mobilePhoneNumber}
        label={"Phone Number"}
        type="text"
        autoComplete="off"
        value={getFormattedPhone(values[fields.mobilePhoneNumber])}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        placeholder={FORM_PLACEHOLDERS.phone}
        maxLength="12"
        isRequired
      />
      <p className="mt-20 plan-sub-heading">Address</p>
      <Field
        size="md"
        name={fields.address}
        label={"Address Name"}
        type="text"
        autoComplete="off"
        value={values[fields.address]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
      />
      <Field
        size="md"
        name={fields.address1}
        label={"Address 1"}
        type="text"
        autoComplete="off"
        value={values[fields.address1]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
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
        disabled={isEdit && !isSave}
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
        disabled={isEdit && !isSave}
        component={FieldInput}
      />
      <Field
        size="md"
        isRequired
        name={fields.city}
        label={"City"}
        type="text"
        autoComplete="off"
        value={values[fields.city]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
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
        disabled={isEdit && !isSave}
        component={FieldDropSide}
      />
      {values[fields.countryId] == 1 && (
        <>
          <Field
            size="md"
            isRequired
            name={fields.stateId}
            options={
              stateList &&
              stateList.map((state, index) => ({
                label: state.stateDescription,
                value: state.id,
              }))
            }
            value={values[fields.stateId]}
            label="State"
            popupContent={
              <SearchableList
                label="Select State"
                options={
                  stateList &&
                  stateList.map((state, index) => ({
                    label: state.stateDescription,
                    value: state.id,
                  }))
                }
                onSelect={(value, label) => {
                  setFieldValue(fields.state, label);
                  setFieldValue(fields.stateId, value);
                }}
                selectedValue={values[fields.stateId]}
                height="250px"
                value={values[fields.stateId]}
              />
            }
            disabled={isEdit && !isSave}
            component={FieldDropSide}
          />
          <Field
            size="md"
            isRequired
            name={fields.zipCode}
            label={"Zip Code"}
            type="text"
            autoComplete="off"
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
            value={getFormattedZip(values[fields.zipCode])}
            placeholder={FORM_PLACEHOLDERS.zip}
            maxLength="10"
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
            disabled={isEdit && !isSave}
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
            disabled={isEdit && !isSave}
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
            disabled={isEdit && !isSave}
            component={FieldInput}
            value={values[fields.foreignZipCode]}
          />
        </>
      )}
      <p className="link-text font-weight-500" onClick={toggle}>
        {isEdit == true
          ? "View Additional Address"
          : isAdd === true
          ? "Remove Additional Address"
          : "Add Additional Address"}
      </p>
      {isAdd === true ? (
        <div className="border-box">
          <Field
            size="md"
            name={fields.additionalAddressName}
            label={"Address Name"}
            type="text"
            autoComplete="off"
            value={values[fields.additionalAddressName]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
          />
          <Field
            size="md"
            name={fields.additionalAddressOne}
            label={"Address 1"}
            type="text"
            isRequired
            autoComplete="off"
            value={values[fields.additionalAddressOne]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
          />
          <Field
            size="md"
            name={fields.additionalAddressTwo}
            label={"Address 2"}
            type="text"
            autoComplete="off"
            value={values[fields.additionalAddressTwo]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
          />
          <Field
            size="md"
            name={fields.additionalAddressThree}
            label={"Address 3"}
            type="text"
            autoComplete="off"
            value={values[fields.additionalAddressThree]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
          />
          <Field
            size="md"
            isRequired
            name={fields.additionalCity}
            label={"City"}
            type="text"
            autoComplete="off"
            value={values[fields.additionalCity]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
          />
          <Field
            size="md"
            isRequired
            name={fields.additionalCountryId}
            value={values[fields.additionalCountryId]}
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
                  setFieldValue(fields.additionalCountry, label);
                  setFieldValue(fields.additionalCountryId, value);
                  setFieldValue(fields.additionalCountryCode, label);
                  value == 1 &&
                    setFieldValue(fields.additionalForeignCountry, null) &&
                    setFieldValue(fields.additionalForeignState, null) &&
                    setFieldValue(fields.additionalForeignZipCode, null);
                  value == 2 &&
                    setFieldValue(fields.additionalState, null) &&
                    setFieldValue(fields.additionalStateId, null) &&
                    setFieldValue(fields.additionalZipCode, null);
                  getStatesList(fields.additionalCountryId)
                    .then((response) => {
                      setStateList(response);
                    })
                    .catch((error) => {
                      //Handle error
                    });
                }}
                value={values[fields.additionalCountryId]}
                selectedValue={values[fields.additionalCountryId]}
              />
            }
            disabled={isEdit && !isSave}
            component={FieldDropSide}
          />
          {values[fields.additionalCountryId] == 1 && (
            <>
              <Field
                size="md"
                isRequired
                name={fields.additionalStateId}
                options={
                  stateList &&
                  stateList.map((state, index) => ({
                    label: state.stateDescription,
                    value: state.id,
                  }))
                }
                value={values[fields.additionalStateId]}
                label="State"
                popupContent={
                  <SearchableList
                    label="Select State"
                    options={
                      stateList &&
                      stateList.map((state, index) => ({
                        label: state.stateDescription,
                        value: state.id,
                      }))
                    }
                    onSelect={(value, label) => {
                      setFieldValue(fields.additionalState, label);
                      setFieldValue(fields.additionalStateId, value);
                    }}
                    selectedValue={values[fields.additionalStateId]}
                    height="250px"
                    value={values[fields.additionalStateId]}
                  />
                }
                disabled={isEdit && !isSave}
                component={FieldDropSide}
              />
              <Field
                size="md"
                isRequired
                name={fields.additionalZipCode}
                label={"Zip Code"}
                type="text"
                autoComplete="off"
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInput}
                value={getFormattedZip(values[fields.additionalZipCode])}
                placeholder={FORM_PLACEHOLDERS.zip}
                maxLength="10"
              />
            </>
          )}

          {values[fields.additionalCountryId] == 2 && (
            <>
              <Field
                size="md"
                isRequired
                name={fields.additionalForeignCountry}
                label={"Additional Foreign Country"}
                type="text"
                autoComplete="off"
                value={values[fields.additionalForeignCountry]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInput}
              />
              <Field
                size="md"
                isRequired
                name={fields.additionalForeignState}
                label={"Additional Foreign State"}
                type="text"
                autoComplete="off"
                value={values[fields.additionalForeignState]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInput}
              />
              <Field
                size="md"
                isRequired
                name={fields.additionalForeignZipCode}
                label={"Additional Foreign Zip Code"}
                type="number"
                autoComplete="off"
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInput}
                value={values[fields.additionalForeignZipCode]}
              />
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ContactInformationFields;
