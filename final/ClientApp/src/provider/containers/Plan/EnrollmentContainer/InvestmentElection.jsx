import React from "react";
import { Field } from "formik";
import { yesNoOptions, returnOnlyIfBoolean } from "../../../utils";
import {
  FieldButtonGroup,
  CsplTable as Table,
  FieldInput,
} from "../../../components";
import { Form } from "react-bootstrap";
import { SameInvestmentElection } from "./SameInvestmentElection";
import DifferentInvestmentElection from "./DifferentInvestmentElection";
import DifferentSourceElectionnSamePartcipantElection from "./DifferentSourceElectionnSamePartcipantElection";
import SameSourceElectionDifferentPartcipantElection from "./SameSourceElectionDifferentPartcipantElection";
import { deleteInvestment } from "../../../services";

export const InvestmentElectionFields = (props) => {
  const {
    fields,
    isSave,
    isEdit,
    values,
    setFieldValue,
    getDefaultElection,
    investmentList,
    handleSubmit,
    sourcesList,
    setToggle,
    toggle,
    autoEnrollment,
    planId,
    setValues,
  } = props;

  const columns = [
    {
      label: "Investment",
      className: "column-investment",
      columnName: "investmentName",
    },
    {
      label: "Percentage",
      className: "column-percentage",
      columnName: "percentage",
    },
  ];

  const Invsum = () => {
    let sum1 = 0;
    getDefaultElection.planInvestment.map((source) => {
      sum1 = sum1 + source.investmentPercentage;
    });
    return sum1;
  };

  return (
    <div>
      <div>
        <Field
          isRequired
          name={fields.usePlanDefaultInvestmentElection}
          label="Use plan default investment election"
          size="sm"
          options={yesNoOptions}
          selectedValue={returnOnlyIfBoolean(
            values[fields.usePlanDefaultInvestmentElection]
          )}
          onChange={(value) => {
            setFieldValue(fields.usePlanDefaultInvestmentElection, value);
          }}
          disabled={isEdit && !isSave}
          component={FieldButtonGroup}
        />
        {values[fields.usePlanDefaultInvestmentElection] === true ? (
          <div className="mt-40 table-size">
            <p className="mt-20 plan-heading-plan">
              List of Investment Election Added
            </p>
            <div>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    {columns.map((item, index) => {
                      return (
                        <Table.Th
                          key={index}
                          className={(item.className, "col-md-5")}
                        >
                          {item.label}
                        </Table.Th>
                      );
                    })}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {getDefaultElection.planInvestment &&
                    getDefaultElection.planInvestment.map((source, index) => {
                      return (
                        <Table.Tr key={index} className="">
                          <Table.Td className="column-investment col-md-5">
                            {source.investmentName}
                          </Table.Td>
                          <Table.Td className="column-percentage">
                            <Form
                              autoComplete="off"
                              className="h-100 percentage-field"
                            >
                              <Field
                                size="xs"
                                isRequired
                                name="employeeTax"
                                hasSuggestion
                                shouldDisplaySuggestion
                                value={source.investmentPercentage}
                                disabled={true}
                                component={FieldInput}
                                type="number"
                                autoComplete="off"
                              />
                            </Form>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                </Table.Tbody>
                <div className="line-separator-total" />
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td className="column-investment col-md-5">
                      Total
                    </Table.Td>
                    <Table.Td className="column-percentage col-md-5">
                      <Form
                        autoComplete="off"
                        className="h-100 percentage-field"
                      >
                        <Field
                          size="xs"
                          isRequired
                          name="totalBox"
                          hasSuggestion
                          shouldDisplaySuggestion
                          component={FieldInput}
                          type="number"
                          value={Invsum()}
                          autoComplete="off"
                          disabled
                        />
                      </Form>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </div>
        ) : null}

        {values[fields.usePlanDefaultInvestmentElection] === false ? (
          <>
            <Field
              size="sm"
              isRequired
              name={fields.sameInvestmentElectionToAllSources}
              label={"Same Investment Election To All Sources"}
              options={yesNoOptions}
              selectedValue={returnOnlyIfBoolean(
                values[fields.sameInvestmentElectionToAllSources]
              )}
              //value={values[fields.sameInvestmentElectionToAllSources]}
              onChange={(value) => {
                setFieldValue(fields.sameInvestmentElectionToAllSources, value);
              }}
              component={FieldButtonGroup}
              //validate={required}
              disabled={isEdit && !isSave}
            />

            <Field
              size="sm"
              isRequired
              name={fields.sameInvestmentElectionToAllParticipants}
              label={"Same Investment Election To All Participants"}
              options={yesNoOptions}
              value={values[fields.sameInvestmentElectionToAllParticipants]}
              selectedValue={
                values[fields.sameInvestmentElectionToAllParticipants]
              }
              onChange={(value) => {
                setFieldValue(
                  fields.sameInvestmentElectionToAllParticipants,
                  value
                );
              }}
              component={FieldButtonGroup}
              //validate={required}
              disabled={isEdit && !isSave}
            />

            {values[fields.sameInvestmentElectionToAllSources] === true &&
            values[fields.sameInvestmentElectionToAllParticipants] === true ? (
              <div>
                <SameInvestmentElection
                  {...props}
                  deleteInvestment={deleteInvestment}
                />
              </div>
            ) : null}

            {values[fields.sameInvestmentElectionToAllSources] === false &&
            values[fields.sameInvestmentElectionToAllParticipants] === false ? (
              <div>
                <DifferentInvestmentElection
                  {...props}
                  deleteInvestment={deleteInvestment}
                />
              </div>
            ) : null}

            {values[fields.sameInvestmentElectionToAllSources] === false &&
            values[fields.sameInvestmentElectionToAllParticipants] === true ? (
              <div>
                <DifferentSourceElectionnSamePartcipantElection
                  {...props}
                  deleteInvestment={deleteInvestment}
                />
              </div>
            ) : null}

            {values[fields.sameInvestmentElectionToAllSources] === true &&
            values[fields.sameInvestmentElectionToAllParticipants] === false ? (
              <div>
                <SameSourceElectionDifferentPartcipantElection
                  {...props}
                  deleteInvestment={deleteInvestment}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InvestmentElectionFields;
