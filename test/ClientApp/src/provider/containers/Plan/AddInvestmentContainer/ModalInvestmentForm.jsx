import React from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { get } from "lodash";
import {
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_PLAN_ROUTES,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  yesNoOptions,
  toMultiSelectValueById,
} from "../../../utils";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInput,
  MultiSelectDropdown,
  CsplTable as Table,
  Link,
} from "../../../components";
import { useRouterParams } from "../../../abstracts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { Button } from "react-bootstrap";
const columns = [
  {
    label: "Investment Name",
    className: "column-investment-name",
    columnName: "investmentName",
  },
  {
    label: "Allocation %",
    className: "column-allocation-perc",
    columnName: "allocationPerc",
  },
  {
    label: "New Allocation %",
    className: "column-new-allocation-perc",
    columnName: "newAllocationPerc",
  },
];

const NonModalInvestmentForm = ({
  fields,
  isEdit,
  isSave,
  investmentsList,
}) => {
  const { planId, investmentId } = useRouterParams();
  const intInvestmentId = parseInt(investmentId, 10);
  const { values, handleChange, setFieldValue } = useFormikContext();
  const allocationsList = get(values, "allocations") || [];
  const selectApplicableInvestments = values[fields.applicableInvestments];
  const totalAllocationPerc = allocationsList.reduce((total, current) => {
    return total + parseInt(current.allocationPerc, 10);
  }, 0);
  const totalNewAllocationPerc = allocationsList.reduce((total, current) => {
    return total + parseInt(current.newAllocationPercentage || "0", 10);
  }, 0);
  const disabled = isEdit && !isSave;
  return (
    <div>
      <Field
        size="md"
        isRequired
        name={fields.investmentName}
        label={"Investment Name"}
        type="text"
        autoComplete="off"
        value={values[fields.investmentName]}
        onChange={handleChange}
        disabled={disabled}
        component={FieldInput}
        // validate={required}
      />
      <Field
        isRequired
        name={fields.CUSIP}
        label={"CUSIP"}
        type="text"
        autoComplete="off"
        value={values[fields.CUSIP]}
        onChange={handleChange}
        disabled={disabled}
        component={FieldInput}
        // validate={required}
      />
      <Field
        size="smd"
        isRequired
        name={fields.tickerSymbol}
        label={"Ticker Symbol"}
        type="text"
        autoComplete="off"
        value={values[fields.tickerSymbol]}
        onChange={handleChange}
        disabled={disabled}
        component={FieldInput}
        //validate={required}
      />
      <Field
        size="lg"
        isRequired
        name={fields.riskType}
        label={"Risk Type"}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.MODEL_INV_RISK_TYPE
        )}
        selectedValue={values[fields.riskType]}
        value={values[fields.riskType]}
        onChange={(value) => {
          setFieldValue(fields.riskType, value);
        }}
        component={FieldButtonGroup}
        // validate={required}
        disabled={disabled}
      />
      <Field
        size="sm"
        isRequired
        name={fields.is100PercAllocated}
        label={"Is this a 100% Allocated Model?"}
        options={yesNoOptions}
        selectedValue={values[fields.is100PercAllocated]}
        value={values[fields.is100PercAllocated]}
        onChange={(value) => {
          setFieldValue(fields.is100PercAllocated, value);
        }}
        component={FieldButtonGroup}
        // validate={required}
        disabled={disabled}
      />
      <Field
        size="sm"
        isRequired
        name={fields.isReallocationAllowed}
        label={"Reallocation Allowed?"}
        options={yesNoOptions}
        selectedValue={values[fields.isReallocationAllowed]}
        value={values[fields.isReallocationAllowed]}
        onChange={(value) => {
          setFieldValue(fields.isReallocationAllowed, value);
        }}
        component={FieldButtonGroup}
        //validate={required}
        disabled={disabled}
      />
      <Field
        size="sm"
        isRequired
        name={fields.isRebalanceAllowed}
        label={"Rebalance Allowed?"}
        options={yesNoOptions}
        selectedValue={values[fields.isRebalanceAllowed]}
        value={values[fields.isRebalanceAllowed]}
        onChange={(value) => {
          setFieldValue(fields.isRebalanceAllowed, value);
        }}
        component={FieldButtonGroup}
        //validate={required}
        disabled={disabled}
      />
      <Field
        isRequired
        name={fields.applicableInvestments}
        label={"Applicable Investments"}
        isMultiSelect
        value={toMultiSelectValueById(
          selectApplicableInvestments,
          investmentsList
        )}
        popupContent={
          <MultiSelectDropdown
            label="Select Applicable Investments"
            name={fields.applicableInvestments}
            onSelect={(value) =>
              setFieldValue(fields.applicableInvestments, value)
            }
            value={values[fields.applicableInvestments]}
            options={investmentsList}
            disabled={disabled}
            height="400px"
            isTypeAhead
          />
        }
        disabled={disabled}
        //validate={required}
        component={FieldDropSide}
      />
      <br />
      {!isNaN(intInvestmentId) && (
        <div>
          <div className="w-100">
            <div className="d-flex justify-content-between mb-4">
              <div className="">
                <div className="m-0 plan-sub-heading">% Election</div>
              </div>
            </div>
          </div>
          <Table>
            <Table.Thead>
              <Table.Tr>
                {columns.map((item, index) => {
                  return (
                    <Table.Th key={index} className={item.className}>
                      {item.label}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Thead className="mt-2">
              <Table.Tr>
                {columns.map((item, index) => {
                  const getContent = () => {
                    if (index === 0) {
                      return "TOTAL";
                    }
                    if (index === 1) {
                      return totalAllocationPerc;
                    }
                    if (totalNewAllocationPerc && index === 2) {
                      return totalNewAllocationPerc;
                    }
                  };
                  return (
                    <Table.Th key={index} className={item.className}>
                      {getContent()}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <FieldArray name="allocations">
              {(fieldArrayProps) => {
                const { remove } = fieldArrayProps;
                return (
                  <Table.Tbody>
                    {allocationsList.map((restriction, index) => {
                      return (
                        <Table.Tr key={index}>
                          {columns.map((item, cellIndex) => {
                            const newAllocationPercentageName = `allocations[${index}].newAllocationPercentage`;

                            const getContent = () => {
                              if (cellIndex === 2 && !disabled) {
                                return (
                                  <div className="d-flex align-items-center justify-content-between w-75">
                                    <Field
                                      size="xxs"
                                      isRequired
                                      name={newAllocationPercentageName}
                                      type="text"
                                      autoComplete="off"
                                      value={get(
                                        values,
                                        newAllocationPercentageName
                                      )}
                                      onChange={(e) => {
                                        setFieldValue(
                                          newAllocationPercentageName,
                                          e.target.value
                                        );
                                      }}
                                      disabled={disabled}
                                      component={FieldInput}
                                      validate={required}
                                    />
                                    <Button
                                      variant="link"
                                      onClick={() => remove(index)}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        color="#000"
                                      />
                                    </Button>
                                  </div>
                                );
                              }
                              return restriction[item.columnName];
                            };

                            return (
                              <Table.Td
                                key={cellIndex}
                                className={item.className}
                              >
                                {getContent()}
                              </Table.Td>
                            );
                          })}
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                );
              }}
            </FieldArray>
          </Table>
          <br />
          <Link
            to={getPathWithParam({
              path: MANAGE_PLAN_ROUTES.VIEW_INV_ASSOCIATED_PLANS,
              pathParam: [FLOW_TYPES.EDIT, planId, intInvestmentId],
            })}
            disabled={isEdit && !isSave}
            className="blue-link"
          >
            View Associated Plans
          </Link>
        </div>
      )}
    </div>
  );
};

export default NonModalInvestmentForm;
