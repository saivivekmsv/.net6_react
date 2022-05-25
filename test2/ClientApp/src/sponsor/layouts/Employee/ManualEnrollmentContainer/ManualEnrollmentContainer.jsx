import React, { useState } from "react";
import {
  LoaderWrapper,
  CsplTable as Table,
  ManageCensusLayout,
  Link,
  FieldButtonGroup,
  FieldInput,
  SliderPanel,
  AddPlans,
} from "shared/components
import {
  getAdvancedPathWithParam,
  FLOW_TYPES,
  MANAGE_CENSUS_ROUTES,
  manageCensusFormNames,
  yesNoOptions,
  returnOnlyIfBoolean,
  formFields,
} from "shared/utils"
import { useRouterParams, useRequest, useDeepEffect } from "shared/abstracts";
import { Formik, Field, FieldArray } from "formik";
import { Form, Button, InputGroup, Image } from "react-bootstrap";
import {
  getDefaultElectionSetting,
  getPlanSourceInformation,
  getPlanInvestments,
} from "sponsor/services
import { get, isEmpty } from "lodash";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

const ManualEnrollmentContainer = (props) => {
  const { history } = props;
  const [newFlow] = useState("");
  const { censusId, flow, planId } = useRouterParams();
  const search = useLocation().search;
  const name = new URLSearchParams(search).get("name");
  const planName = name.replace("%", " ");
  const formName = manageCensusFormNames.MANUAL_ENROLLMENT;
  const fields = formFields[formName];
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredResponse, setFilteredResponse] = useState([]);
  const [addedInvestments, setAddedInvestments] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [saveInvestments, setSaveInvestments] = useState([]);
  const [totalInvestments, setTotalInvestments] = useState([]);
  const [toggle, setToggle] = useState(false);

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_CENSUS_ROUTES.EMPLOYEE_MANAGE_PLAN_MODULES,
            pathParam: [FLOW_TYPES.EDIT, censusId, planId],
          })
        ),
    },
    {
      label: "Save and Confirm",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD],
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;

  const { response: investmentList } = useRequest({
    method: getPlanInvestments,
    payload: planId,
    defaultResponse: [],
  });

  const { response: sourcesList } = useRequest({
    method: getPlanSourceInformation,
    payload: planId,
  });

  const { response: getDefaultElection } = useRequest({
    method: getDefaultElectionSetting,
    payload: planId,
  });

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

  const addInvestmentsToPlan = (name) => {
    setAddedInvestments((e) => [...e, name]);
  };

  const onViewButtonClick = () => {
    setModalOpen(true);
  };

  const Invsum = () => {
    let sum1 = 0;
    getDefaultElection.investmentDetails.map((source) => {
      sum1 = sum1 + source.investmentPercentage;
    });
    return sum1;
  };

  useDeepEffect(() => {
    setFilteredResponse(
      investmentList.filter((team) => {
        return team.investmentName
          .toLowerCase()
          .includes(searchString.toLowerCase());
      })
    );
  }, [searchString, investmentList]);

  useDeepEffect(() => {
    let defaults = !isEmpty(getDefaultElection)
      ? [...getDefaultElection?.investmentDetails]
      : [];
    setTotalInvestments(defaults);
    setSaveInvestments(defaults);
    setAddedInvestments(defaults);
  }, [getDefaultElection]);

  useDeepEffect(() => {
    setTotalInvestments(saveInvestments);
  }, [saveInvestments]);

  const onSubmit = (savedInvestments) => {
    setSaveInvestments(savedInvestments);
    setModalOpen(false);
  };

  const onCancel = () => {
    setAddedInvestments(saveInvestments);
    setModalOpen(false);
  };

  return (
    <ManageCensusLayout buttons={buttons} pageFlow={newFlow || flow}>
      <div>
        <Formik initialValues={{}} enableReinitialize>
          {(formProps) => {
            const {
              setFieldValue,
              values,
              handleChange,
              handleSubmit,
              setValues,
              setSubmitting,
              ...rest
            } = formProps;
            const onDaySelected = (fieldName, value) => {
              setFieldValue(fieldName, value);
            };

            const Invsum1 = () => {
              let sum1 = 0;
              Object.keys(values).map((source) => {
                if (source.includes("ID") && values[source])
                  sum1 = sum1 + values[source];
              });
              return sum1;
            };

            const deletefunction = (name) => {
              var temp = totalInvestments.filter(
                (e) => e.investmentName !== name
              );
              setTotalInvestments(temp);
              setAddedInvestments(temp);
              setSaveInvestments(temp);
              values["ID" + name] = null;
            };

            return (
              <Form
                autoComplete="off"
                className="h-100"
                onSubmit={handleSubmit}
              >
                <p className="font-weight-500 text-black">Contribution Rate</p>
                <p
                  className="planTitle-text enrollment-sub-heading"
                  style={{ fontSize: "12px", color: "lightslategrey" }}
                >
                  Plan Name
                </p>
                <p
                  className="planTitle-text enrollment-sub-heading"
                  style={{ color: "darkslategray" }}
                >
                  {planName}
                </p>
                <p className="font-weight-500 text-black">Deferral Election</p>

                <Field
                  isRequired
                  name={fields.usePlanDefaultDeferralElection}
                  label="Use plan default deferral election"
                  size="sm"
                  options={yesNoOptions}
                  selectedValue={values[fields.usePlanDefaultDeferralElection]}
                  onChange={(value) => {
                    setFieldValue(fields.usePlanDefaultDeferralElection, value);
                  }}
                  disabled={isEdit && !isSave}
                  component={FieldButtonGroup}
                />

                {values[fields.usePlanDefaultDeferralElection] === true ? (
                  <FieldArray name="getDefaultElection">
                    <p className="planTitle-text enrollment-sub-heading">
                      Contribution Percentage/Amount
                    </p>
                    {(fieldArrayProps) =>
                      getDefaultElection.sourceList &&
                      getDefaultElection.sourceList.map((e, i) => {
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

                {values[fields.usePlanDefaultDeferralElection] === false ? (
                  <FieldArray name="deferralSourceContributions">
                    {(fieldArrayProps) =>
                      sourcesList.map((e, i) => {
                        const fieldName = "SC" + e.sourceName;
                        return (
                          <div>
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
                              component={FieldInput}
                              type="number"
                              autoComplete="off"
                              defaultValue={get(values, fieldName)}
                              onChange={handleChange(fieldName)}
                              disabled={isEdit && !isSave}
                            />
                          </div>
                        );
                      })
                    }
                  </FieldArray>
                ) : null}

                <p className="font-weight-500 text-black">
                  Investment Election
                </p>
                <Field
                  isRequired
                  name={fields.investmentsElection}
                  label="Use plan default investment election"
                  size="sm"
                  options={yesNoOptions}
                  selectedValue={returnOnlyIfBoolean(
                    values[fields.investmentsElection]
                  )}
                  onChange={(value) => {
                    setFieldValue(fields.investmentsElection, value);
                  }}
                  disabled={isEdit && !isSave}
                  component={FieldButtonGroup}
                />

                {values[fields.investmentsElection] === true ? (
                  <div className="mt-40 table-size">
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
                          {getDefaultElection.investmentDetails &&
                            getDefaultElection.investmentDetails.map(
                              (source, index) => {
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
                              }
                            )}
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

                {values[fields.investmentsElection] === false ? (
                  <div>
                    {!isEmpty(getDefaultElection?.investmentDetails) ||
                    !isEmpty(saveInvestments) ? (
                      <div className="mt-40 table-size">
                        <div className="d-flex justify-content-between align-baseline">
                          <p className="mt-20 plan-heading-plan">
                            List of Investment Election Added
                          </p>
                          <Button
                            variant="secondary"
                            onClick={() => setModalOpen(true)}
                          >
                            Add Investment
                          </Button>
                        </div>
                        <div>
                          <FieldArray name="investmentList">
                            {(fieldArrayProps) => (
                              <Table>
                                <Table.Thead>
                                  <Table.Tr>
                                    {columns.map((item, index) => {
                                      return (
                                        <Table.Th
                                          key={index}
                                          className={
                                            (item.className, "col-md-4")
                                          }
                                        >
                                          {item.label}
                                        </Table.Th>
                                      );
                                    })}
                                  </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                  {totalInvestments.map((source, index) => {
                                    const fieldName =
                                      "ID" + source.investmentName;
                                    return (
                                      <Table.Tr key={index}>
                                        <Table.Td className="column-investment col-md-4">
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
                                              name={fieldName}
                                              hasSuggestion
                                              shouldDisplaySuggestion
                                              component={FieldInput}
                                              type="number"
                                              value={get(values, fieldName)}
                                              //defaultValue={get(values, fieldName)}
                                              onChange={handleChange}
                                              disabled={isEdit && !isSave}
                                              autoComplete="off"
                                            />
                                          </Form>
                                        </Table.Td>
                                        <Table.Td className="column-action col-md-4">
                                          <Link>
                                            <FontAwesomeIcon
                                              icon={faTrashAlt}
                                              color="red"
                                              onClick={() =>
                                                deletefunction(
                                                  source.investmentName
                                                )
                                              }
                                            />
                                          </Link>
                                        </Table.Td>
                                      </Table.Tr>
                                    );
                                  })}
                                </Table.Tbody>

                                <div className="line-separator-total" />
                                <Table.Tbody>
                                  <Table.Tr>
                                    <Table.Td className="column-investment col-md-4">
                                      Total
                                    </Table.Td>
                                    <Table.Td className="column-percentage col-md-4">
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
                                          value={Invsum1()}
                                          autoComplete="off"
                                          disabled
                                        />
                                      </Form>
                                    </Table.Td>
                                  </Table.Tr>
                                </Table.Tbody>
                              </Table>
                            )}
                          </FieldArray>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-40">
                        <p className="mt-20 plan-heading-plan">
                          Investment Election
                        </p>
                        <AddPlans
                          content="No Investments added."
                          buttonLabel="Add Investment"
                          onPrimaryClick={onViewButtonClick}
                        />
                      </div>
                    )}
                  </div>
                ) : null}

                <SliderPanel isOpen={isModalOpen} size="35" showCancel={false}>
                  <div className="d-flex justify-content-between align-baseline">
                    <div>
                      <p className="plan-heading-plan">Plan Investments</p>
                      <p className="enrollment-sub-heading">
                        {filteredResponse.length} Investments Available
                      </p>
                    </div>
                    <div>
                      <Button variant="secondary" onClick={() => onCancel()}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => onSubmit(addedInvestments)}
                        className="ml-4"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="search-bar ">
                    <Form>
                      <InputGroup>
                        <input
                          size="m"
                          type="search"
                          placeholder="Search Investments"
                          onChange={(e) => setSearchString(e.target.value)}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text className="search-bar-button">
                            <Image
                              src="/assets/icons/svg/search.svg"
                              width="14px"
                            />
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form>
                  </div>
                  <p className="enrollment-side-content">
                    {filteredResponse.length} Investments Available
                  </p>

                  <div className="scroll-body">
                    {filteredResponse &&
                      filteredResponse.map((e, i) => (
                        <div className="d-flex justify-content-between">
                          <p>{e.investmentName}</p>
                          {addedInvestments.find(
                            (y) => y.investmentName === e.investmentName
                          ) ? (
                            <Button
                              size="sm"
                              style={{
                                width: "75px",
                                margin: "0px 0px 8px 0px",
                              }}
                              variant="secondary"
                              disabled
                              classname="custom-added"
                            >
                              Added
                            </Button>
                          ) : (
                            <>
                              <Button
                                style={{
                                  width: "75px",
                                  margin: "0px 0px 8px 0px",
                                }}
                                variant="secondary"
                                onClick={() => addInvestmentsToPlan(e)}
                              >
                                Add
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </SliderPanel>

                <Field
                  isRequired
                  name={fields.autoDeferralIncrease}
                  label="Auto Deferral Increase"
                  size="sm"
                  options={yesNoOptions}
                  selectedValue={returnOnlyIfBoolean(
                    values[fields.autoDeferralIncrease]
                  )}
                  onChange={(value) => {
                    setFieldValue(fields.autoDeferralIncrease, value);
                  }}
                  disabled={isEdit && !isSave}
                  component={FieldButtonGroup}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </ManageCensusLayout>
  );
};

export default ManualEnrollmentContainer;
