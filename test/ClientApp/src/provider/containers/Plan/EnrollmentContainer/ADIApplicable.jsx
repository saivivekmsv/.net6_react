import { Field, FieldArray } from "formik";
import React, { useState, useContext } from "react";
import {
  clearLocalCacheByModel,
  createPlanStore,
  savePlanDetailsAction,
  setManagePageLevelData,
  setManagePlanLocalCache,
  setManagePlanToastInfo,
} from "../../../contexts";
import {
  FieldButtonGroup,
  CsplTable as Table,
  FieldInputDollar,
  FieldInputPercentage,
  FieldInputNumber,
} from "../../../components";
import {
  getPlanSourceInformation,
  getPlanInvestments,
} from "../../../services";
import {
  yesNoOptions,
  required,
  Enrollment_applyADITo,
  Enrollment_autoDeferralIncreaseApplicableTo,
  Enrollment_periodOfIncrease,
  Enrollment_allocationPercentageForReHire,
} from "../../../utils";
import { useRouterParams, useRequest } from "../../../abstracts";
import { get, isEmpty } from "lodash";

const columns = [
  {
    label: "Source",
    className: "column-source",
    columnName: "sourceName",
  },
  {
    label: "Auto Deferral Increase",
    className: "column-autoDeferralIncrease",
    columnName: "autoDeferralIncrease",
  },
  {
    label: "Minimum ADI",
    className: "column-minimumADI",
    columnName: "minimumADI",
  },
  {
    label: "Maximum ADI",
    className: "column-maximumADI",
    columnName: "maximumADI",
  },
];

const ADIApplicableFields = (props) => {
  const {
    fields,
    values,
    setFieldValue,
    isEdit,
    isSave,
    handleChange,
    planId,
  } = props;

  console.log(values);

  const sources = !isEmpty(get(values, "autoDeferralncreaseApplicable.adi", []))
    ? get(values, "autoDeferralncreaseApplicable.adi")
    : get(values, "adi");
  // const { response: sources, loading: isLoading } = useRequest({
  //   method: getPlanSourceInformation,
  //   payload: planId,
  //   defaultResponse: {},
  // });
  //  const checkMax=(name,percen)=>{
  //    if(percen>100)
  //    setFieldError(name, "Maximum percentage should not be greater than 100");
  //  }
  //console.log(sources);
  return (
    <div>
      <p className="mt-20 plan-sub-heading">ADI Applicable</p>
      <Field
        size="sm"
        isRequired
        name="autoDeferralncreaseApplicable.autoDeferralIncreaseProgram"
        label={"Auto Deferral increase program"}
        options={yesNoOptions}
        selectedValue={get(
          values,
          "autoDeferralncreaseApplicable.autoDeferralIncreaseProgram"
        )}
        value="autoDeferralncreaseApplicable.autoDeferralIncreaseProgram"
        onChange={(value) => {
          setFieldValue(
            `autoDeferralncreaseApplicable.autoDeferralIncreaseProgram`,
            value
          );
        }}
        component={FieldButtonGroup}
        validate={required}
        disabled={isEdit && !isSave}
      />
      {get(
        values,
        "autoDeferralncreaseApplicable.autoDeferralIncreaseProgram"
      ) === true ? (
        <>
          <Field
            size="sm"
            isRequired
            name="autoDeferralncreaseApplicable.autoDeferralIncrease"
            label={"Auto Deferral increase applicable to"}
            options={Enrollment_autoDeferralIncreaseApplicableTo}
            selectedValue={get(
              values,
              "autoDeferralncreaseApplicable.autoDeferralIncrease"
            )}
            value="autoDeferralncreaseApplicable.autoDeferralIncrease"
            onChange={(value) => {
              setFieldValue(
                `autoDeferralncreaseApplicable.autoDeferralIncrease`,
                value
              );
            }}
            component={FieldButtonGroup}
            validate={required}
            disabled={isEdit && !isSave}
          />
          <Field
            size="md"
            isRequired
            name="autoDeferralncreaseApplicable.periodOfIncrease"
            label={"Period of increase"}
            options={Enrollment_periodOfIncrease}
            selectedValue={get(
              values,
              "autoDeferralncreaseApplicable.periodOfIncrease"
            )}
            value="autoDeferralncreaseApplicable.periodOfIncrease"
            onChange={(value) => {
              setFieldValue(
                `autoDeferralncreaseApplicable.periodOfIncrease`,
                value
              );
            }}
            component={FieldButtonGroup}
            validate={required}
            disabled={isEdit && !isSave}
          />
          <div className="w-100">
            <div className="d-flex justify-content-between mb-4">
              <div className="">
                <div className="m-0 plan-sub-heading mt-2">
                  Auto Deferral Increase
                </div>
              </div>
            </div>
          </div>
          <Table className="auto-deferral-increase-table">
            <Table.Thead>
              <Table.Tr>
                {columns.map((item, index) => {
                  return (
                    <Table.Th
                      key={index}
                      className={(item.className, "col-md-3")}
                    >
                      {item.label}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <FieldArray name="adi">
              <Table.Tbody>
                {!isEmpty(sources) &&
                  sources.map((sourceDeferral, index) => {
                    return (
                      <Table.Tr key={index}>
                        {columns.map((item, cellIndex) => {
                          //console.log(item);
                          const getContent = () => {
                            if (item.columnName === "autoDeferralIncrease") {
                              const fieldName = !isEmpty(
                                get(
                                  values,
                                  "autoDeferralncreaseApplicable.adi",
                                  []
                                )
                              )
                                ? `autoDeferralncreaseApplicable.adi.${index}.autoDeferralIncrease`
                                : `adi.${index}.autoDeferralIncrease`;
                              return (
                                <Field
                                  size="sm"
                                  isRequired
                                  name={fieldName}
                                  type="number"
                                  autoComplete="off"
                                  value={get(values, fieldName)}
                                  onChange={handleChange(fieldName)}
                                  // component={
                                  //   sourceDeferral.contributionType === "Dollar"
                                  //     ? FieldInputDollar
                                  //     : FieldInputPercentage
                                  // }
                                  component={
                                    values.deferralSourceContributions[index]
                                      .contributionType === 1
                                      ? FieldInputDollar
                                      : FieldInputPercentage
                                  }
                                  validate={required}
                                  disabled={isEdit && !isSave}
                                />
                              );
                            }
                            if (item.columnName === "minimumADI") {
                              const fieldName = !isEmpty(
                                get(
                                  values,
                                  "autoDeferralncreaseApplicable.adi",
                                  []
                                )
                              )
                                ? `autoDeferralncreaseApplicable.adi.${index}.minimumADI`
                                : `adi.${index}.minimumADI`;
                              return (
                                <Field
                                  size="sm"
                                  isRequired
                                  name={fieldName}
                                  type="number"
                                  autoComplete="off"
                                  value={get(values, fieldName)}
                                  onChange={handleChange(fieldName)}
                                  component={
                                    sourceDeferral.contributionType === "Dollar"
                                      ? FieldInputDollar
                                      : FieldInputPercentage
                                  }
                                  validate={required}
                                  disabled={isEdit && !isSave}
                                />
                              );
                            }
                            if (item.columnName === "maximumADI") {
                              const fieldName = !isEmpty(
                                get(
                                  values,
                                  "autoDeferralncreaseApplicable.adi",
                                  []
                                )
                              )
                                ? `autoDeferralncreaseApplicable.adi.${index}.maximumADI`
                                : `adi.${index}.maximumADI`;
                              return (
                                <Field
                                  size="sm"
                                  isRequired
                                  name={fieldName}
                                  type="number"
                                  autoComplete="off"
                                  value={get(values, fieldName)}
                                  onChange={handleChange(fieldName)}
                                  component={
                                    sourceDeferral.contributionType === "Dollar"
                                      ? FieldInputDollar
                                      : FieldInputPercentage
                                  }
                                  validate={required}
                                  disabled={isEdit && !isSave}
                                />
                              );
                            }
                            //console.log(sourceDeferral.sourceName);
                            return sourceDeferral.sourceName;
                          };
                          return (
                            <Table.Td
                              key={cellIndex}
                              className={(item.className, "col-md-3")}
                              style="vertical-align-top"
                            >
                              {getContent()}
                            </Table.Td>
                          );
                        })}
                      </Table.Tr>
                    );
                  })}
              </Table.Tbody>
            </FieldArray>
          </Table>
          <Field
            size="sm"
            isRequired
            name="autoDeferralncreaseApplicable.allocationPercentageforRehire"
            label={"Allocation percentage for re-hire"}
            options={Enrollment_allocationPercentageForReHire}
            selectedValue={get(
              values,
              "autoDeferralncreaseApplicable.allocationPercentageforRehire"
            )}
            value="autoDeferralncreaseApplicable.allocationPercentageforRehire"
            onChange={(value) => {
              setFieldValue(
                `autoDeferralncreaseApplicable.allocationPercentageforRehire`,
                value
              );
            }}
            component={FieldButtonGroup}
            validate={required}
            disabled={isEdit && !isSave}
          />
          <Field
            size="sm"
            isRequired
            name="autoDeferralncreaseApplicable.rehireOtherPercentage"
            label={"Re-hire Other Percentage"}
            type="number"
            autoComplete="off"
            value={get(
              values,
              "autoDeferralncreaseApplicable.rehireOtherPercentage"
            )}
            onChange={handleChange}
            component={FieldInputDollar}
            validate={required}
            disabled={isEdit && !isSave}
          />
          <Field
            size="sm"
            isRequired
            name="autoDeferralncreaseApplicable.applyADITo"
            label={"Apply ADI To"}
            options={Enrollment_applyADITo}
            selectedValue={get(
              values,
              "autoDeferralncreaseApplicable.applyADITo"
            )}
            value="autoDeferralncreaseApplicable.applyADITo"
            onChange={(value) => {
              setFieldValue(`autoDeferralncreaseApplicable.applyADITo`, value);
            }}
            component={FieldButtonGroup}
            validate={required}
            disabled={isEdit && !isSave}
          />
        </>
      ) : null}
    </div>
  );
};

export default ADIApplicableFields;
