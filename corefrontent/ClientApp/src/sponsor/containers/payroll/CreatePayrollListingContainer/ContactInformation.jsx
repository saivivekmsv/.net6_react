/* eslint-disable eqeqeq */
import { Field } from "formik";
import React, { useState } from "react";
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
} from "../../../../shared/utils";
import country from "../../../../shared/mocks/country.json";
import states from "../../../../shared/mocks/state.json";

const ContactInformationFields = (props) => {
  const [isAdd, setIsAdd] = useState(false);
  const toggle = () => {
    setIsAdd(!isAdd);
  };
  const { fields, values, setFieldValue, isEdit, isSave, handleChange } = props;
  return (
    <div>
      <p className="mt-20 plan-sub-heading">Contact Information</p>
      <Field
        size="md"
        isRequired
        name={fields.email}
        label={"Email"}
        type="text"
        autoComplete="off"
        value={values[fields.email]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />
      <Field
        size="md"
        name={fields.phoneNumber}
        label={"Phone Number"}
        type="text"
        autoComplete="off"
        value={getFormattedPhone(values[fields.phoneNumber])}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
        placeholder={FORM_PLACEHOLDERS.phone}
        maxLength="12"
      />
      <p className="mt-20 plan-sub-heading">Address</p>
      <Field
        size="md"
        name={fields.addressName}
        label={"Address Name"}
        type="text"
        autoComplete="off"
        value={values[fields.addressName]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />
      <Field
        size="md"
        name={fields.addressOne}
        label={"Address 1"}
        type="text"
        autoComplete="off"
        value={values[fields.addressOne]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />
      <Field
        size="md"
        name={fields.addressTwo}
        label={"Address 2"}
        type="text"
        autoComplete="off"
        value={values[fields.addressTwo]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
      />
      <Field
        size="md"
        name={fields.addressThree}
        label={"Address 3"}
        type="text"
        autoComplete="off"
        value={values[fields.addressThree]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        validate={required}
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
        validate={required}
      />
      <Field
        size="md"
        isRequired
        name={fields.country}
        value={values[fields.country]}
        label="Country"
        popupContent={
          <SearchableList
            label="Select Country"
            options={country.data.map((value) => ({
              label: value,
              value,
            }))}
            onSelect={(value) => setFieldValue(fields.country, value)}
            selectedValue={values[fields.country]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        isRequired
        name={fields.state}
        value={values[fields.state]}
        label="State"
        popupContent={
          <SearchableList
            label="Select State"
            options={states.data.map((value) => ({
              label: value,
              value,
            }))}
            onSelect={(value) => setFieldValue(fields.state, value)}
            selectedValue={values[fields.state]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
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
        validate={required}
        value={getFormattedZip(values[fields.zipCode])}
        placeholder={FORM_PLACEHOLDERS.zip}
        maxLength="10"
      />
      <p className="link-text font-weight-500" onClick={toggle}>
        {isAdd == true
          ? "Hide Additional Address"
          : isAdd === false
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
            validate={required}
          />
          <Field
            size="md"
            name={fields.additionalAddressOne}
            label={"Address 1"}
            type="text"
            autoComplete="off"
            value={values[fields.additionalAddressOne]}
            onChange={handleChange}
            disabled={isEdit && !isSave}
            component={FieldInput}
            validate={required}
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
            validate={required}
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
            validate={required}
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
            validate={required}
          />
          <Field
            size="sm"
            name={fields.additionalForeignAddress}
            label={"Foreign Address ?"}
            options={yesNoOptions}
            selectedValue={values[fields.additionalForeignAddress]}
            value={values[fields.additionalForeignAddress]}
            onChange={(value) => {
              setFieldValue(fields.additionalForeignAddress, value);
            }}
            component={FieldButtonGroup}
            validate={required}
            disabled={isEdit && !isSave}
          />
          <Field
            size="md"
            isRequired
            name={fields.additionalCountry}
            value={values[fields.additionalCountry]}
            label="Country"
            popupContent={
              <SearchableList
                label="Select Country"
                options={country.data.map((value) => ({
                  label: value,
                  value,
                }))}
                onSelect={(value) =>
                  setFieldValue(fields.additionalCountry, value)
                }
                selectedValue={values[fields.additionalCountry]}
              />
            }
            component={FieldDropSide}
            disabled={isEdit && !isSave}
          />
          <Field
            size="md"
            isRequired
            name={fields.additionalState}
            value={values[fields.additionalState]}
            label="State"
            popupContent={
              <SearchableList
                label="Select State"
                options={states.data.map((value) => ({
                  label: value,
                  value,
                }))}
                onSelect={(value) =>
                  setFieldValue(fields.additionalState, value)
                }
                selectedValue={values[fields.additionalState]}
              />
            }
            component={FieldDropSide}
            disabled={isEdit && !isSave}
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
            validate={required}
            value={getFormattedZip(values[fields.additionalZipCode])}
            placeholder={FORM_PLACEHOLDERS.zip}
            maxLength="10"
          />
        </div>
      ) : null}
    </div>
  );
};

export default ContactInformationFields;
