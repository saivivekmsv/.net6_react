import React, { useState } from "react";
import { Field, FieldArray } from "formik";
import { yesNoOptions, returnOnlyIfBoolean } from "../../../utils";
import {
  FieldButtonGroup,
  CsplTable as Table,
  FieldInput,
  FieldInputNumber,
} from "../../../components";
import { get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";

export const DeferralElection = (props) => {
  const {
    fields,
    isSave,
    isEdit,
    values,
    setFieldValue,
    handleChange,
    sourcesList,
    getDefaultElection,
    autoEnrollment,
  } = props;
  const [savedResponses, setSavedResponses] = useState({});
  const displayType = (amt, cont, number) => {
    let res;
    if (cont === "Dollar")
      res =
        number === 0
          ? "Minimum amount " + "$" + amt
          : "Maximum amount " + "$" + amt;
    else
      res =
        number === 0
          ? "Minimum percentage " + amt + "%"
          : "Maximum percentage " + amt + "%";
    return res;
  };

  return (
    <div>
      <Field
        isRequired
        name={fields.usePlanDefaultDeferralElection}
        label="Use plan default deferral election"
        size="sm"
        options={yesNoOptions}
        selectedValue={returnOnlyIfBoolean(
          values[fields.usePlanDefaultDeferralElection]
        )}
        onChange={(value) => {
          setFieldValue(fields.usePlanDefaultDeferralElection, value);
        }}
        disabled={isEdit && !isSave}
        component={FieldButtonGroup}
      />
      {values[fields.usePlanDefaultDeferralElection] === false ? (
        <FieldArray name="sourcesList">
          {(fieldArrayProps) => {
            return (
              <Table.Tbody>
                {sourcesList &&
                  sourcesList.map((e, i) => {
                    const toggleSavedResponseChecked = (id) => {
                      setSavedResponses((savedResponses) => ({
                        ...savedResponses,
                        [id]: savedResponses[id]
                          ? {
                              ...savedResponses[id],
                              checked: [savedResponses[id]?.checked]
                                ? false
                                : true,
                            }
                          : {
                              sourceId: id,
                              checked: true,
                            },
                      }));
                    };
                    const fieldName = `autoEnrollmentDeferralSources[${i}].deferralSourcePercentage`;
                    const checkBoxName = `autoEnrollmentDeferralSources[${i}].excludeFromEnrollment`;
                    //const sourceName= `autoEnrollmentDeferralSources[${i}].deferralSourceName`;
                    const AddName = (e, source, limitMaximum, limitMinimum) => {
                      if (!isEmpty(values.autoEnrollmentDeferralSources[i])) {
                        //values.autoEnrollmentDeferralSources=values.autoEnrollmentDeferralSources.map(obj=> ({ ...obj[i], deferralSourceName:source }))
                        values.autoEnrollmentDeferralSources[
                          i
                        ].deferralSourceName = source;
                        values.autoEnrollmentDeferralSources[
                          i
                        ].limitMaximum = limitMaximum;
                        values.autoEnrollmentDeferralSources[
                          i
                        ].limitMinimum = limitMinimum;
                      }
                      handleChange(e);
                    };

                    return (
                      <div key={i} className="d-flex">
                        <Field
                          size="xs"
                          isRequired
                          name={fieldName}
                          label={e.sourceName}
                          hasSuggestion
                          suggestionDefaultText={`${displayType(
                            e.limitMinimum,
                            e.contributionType,
                            0
                          )} / ${displayType(
                            e.limitMaximum,
                            e.contributionType,
                            1
                          )}`}
                          shouldDisplaySuggestion
                          component={FieldInputNumber}
                          type="number"
                          autoComplete="off"
                          defaultValue={parseInt(get(values, fieldName))}
                          onChange={(x) => {
                            AddName(
                              x,
                              e.sourceName,
                              e.maximumRate,
                              e.minimumRate
                            );
                          }}
                          disabled={isEdit && !isSave}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <div
                          style={{
                            paddingLeft: "20px",
                          }}
                        ></div>
                        <Form.Check
                          custom
                          name={checkBoxName}
                          type="checkbox"
                          id={checkBoxName}
                          value={get(values, checkBoxName)}
                          onChange={handleChange}
                          checked={get(values, checkBoxName)}
                          disabled={isEdit && !isSave}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <div
                          style={{
                            //marginBottom: "-4rem",
                            fontSize: "13px",
                            paddingTop: "40px",
                            //paddingLeft:"20px"
                          }}
                          //size="xs"
                        >
                          Exclude from Enrollment
                        </div>
                      </div>
                    );
                  })}
              </Table.Tbody>
            );
          }}
        </FieldArray>
      ) : null}
      {values[fields.usePlanDefaultDeferralElection] === true ? (
        <FieldArray name="getDefaultElection">
          {(fieldArrayProps) =>
            getDefaultElection.deferralSourceContribution &&
            getDefaultElection.deferralSourceContribution.map((e, i) => {
              return (
                <div key={i}>
                  <Field
                    size="xs"
                    isRequired
                    name={e.sourceName}
                    label={e.sourceName}
                    value={e.contributionRate}
                    disabled={true}
                    component={FieldInput}
                    type="number"
                    autoComplete="off"
                  />
                </div>
              );
            })
          }
        </FieldArray>
      ) : null}
    </div>
  );
};

export default DeferralElection;
