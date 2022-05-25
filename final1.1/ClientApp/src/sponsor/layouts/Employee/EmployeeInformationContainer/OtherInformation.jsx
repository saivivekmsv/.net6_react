import { Field } from "formik";
import React from "react";
import {
  FieldInput,
  FieldDropSide,
  SearchableList,
  FieldButtonGroup,
  FieldInputSSN,
  FieldInputDecimal,
} from "../../../../shared/components";
import { required, yesNoOptions, getFormattedSsn } from "../../../../shared/utils"
import company from "../../../../shared/mocks/company.json";

const OtherInformationFields = (props) => {
  const { fields, values, setFieldValue, isEdit, isSave, handleChange } = props;
  return (
    <div>
      <p className="mt-20 plan-sub-heading">Other Information</p>
      <Field
        size="sm"
        name={fields.pendingQDROIndicator}
        label={"Pending QDRO"}
        noLabelTransform
        options={yesNoOptions}
        selectedValue={values[fields.pendingQDROIndicator]}
        value={values[fields.pendingQDROIndicator]}
        onChange={(value) => {
          setFieldValue(fields.pendingQDROIndicator, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        name={fields.ownerShip}
        label={"Ownership %"}
        type="number"
        autoComplete="off"
        value={values[fields.ownerShip]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        maxLength={100}
        component={FieldInputDecimal}
      />
      <Field
        size="sm"
        name={fields.familyMemberOfOwnerIndicator}
        label={"Family Member of Owner ?"}
        options={yesNoOptions}
        selectedValue={values[fields.familyMemberOfOwnerIndicator]}
        value={values[fields.familyMemberOfOwnerIndicator]}
        onChange={(value) => {
          setFieldValue(fields.familyMemberOfOwnerIndicator, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        name={fields.relationUniquePersonalIdentification}
        label={"SSN of owner / family member"}
        noLabelTransform
        type="text"
        autoComplete="off"
        value={getFormattedSsn(
          values[fields.relationUniquePersonalIdentification]
        )}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInputSSN}
        maxLength="11"
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
        disabled={isEdit && !isSave}
      />
      <Field
        size="sm"
        name={fields.officerIndicator}
        label={"Officer ?"}
        options={yesNoOptions}
        selectedValue={values[fields.officerIndicator]}
        value={values[fields.officerIndicator]}
        onChange={(value) => {
          setFieldValue(fields.officerIndicator, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        size="sm"
        name={fields.hceIndicator}
        label={"HCE ?"}
        noLabelTransform
        options={yesNoOptions}
        selectedValue={values[fields.hceIndicator]}
        onChange={(value) => {
          setFieldValue(fields.hceIndicator, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        size="sm"
        name={fields.keyEmployeeIndicator}
        label={"Key Employee ?"}
        options={yesNoOptions}
        selectedValue={values[fields.keyEmployeeIndicator]}
        value={values[fields.keyEmployeeIndicator]}
        onChange={(value) => {
          setFieldValue(fields.keyEmployeeIndicator, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        name={fields.insiderOrRestrictedEmployeeIndicator}
        value={values[fields.insiderOrRestrictedEmployeeIndicator]}
        label="Insider / Restricted Employee ?"
        options={yesNoOptions}
        selectedValue={values[fields.insiderOrRestrictedEmployeeIndicator]}
        value={values[fields.insiderOrRestrictedEmployeeIndicator]}
        onChange={(value) => {
          setFieldValue(fields.insiderOrRestrictedEmployeeIndicator, value);
        }}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
      />
    </div>
  );
};

export default OtherInformationFields;
