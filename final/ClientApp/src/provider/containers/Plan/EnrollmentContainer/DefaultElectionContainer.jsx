import React, { useEffect, useState } from "react";
import { get, isEmpty, merge } from "lodash";
import { Form, Button, InputGroup, Image } from "react-bootstrap";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Field, FieldArray } from "formik";
import {
  getPlanSourceInformation,
  getPlanInvestments,
  deleteInvestment,
} from "../../../services";
import {
  FieldInput,
  SliderPanel,
  CsplTable as Table,
  AddPlans,
  Link,
  FieldInputDollar,
  FieldInputPercentage,
  FormControlSearch,
} from "../../../components";
import { useDeepEffect, useRequest } from "../../../abstracts";

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
  {
    label: "Action",
    className: "column-action",
    columnName: "action",
  },
];

export const DefaultElectionContainer = (props) => {
  const {
    values,
    fields,
    setFieldValue,
    isEdit,
    isSave,
    handleChange,
    planId,
    setToggle,
    toggle,
    commonError,
    saveInvestments,
    setSaveInvestments,
  } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredResponse, setFilteredResponse] = useState([]);

  const investmentList = get(values, "investmentList", []);
  const sourceList = get(values, "sourceList", []);

  const getDefaultElection = get(values, "defaultElectionSetting", []);
  const [total, setTotal] = useState(0);
  const [addedInvestments, setAddedInvestments] = useState([]);
  const [searchString, setSearchString] = useState("");
  const planInvestment = get(values, "planInvestment", []);

  console.log(sourceList, "sources");
  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      const searchList = investmentList.filter((f) =>
        f.investmentName.toLowerCase().includes(val.toLowerCase())
      );
      return setFilteredResponse(searchList);
    }
    setFilteredResponse([]);
  };

  const addInvestmentsToPlan = (inv) => {
    setAddedInvestments((e) => [...e, inv]);
  };

  console.log(addedInvestments, "investments");
  console.log(saveInvestments, "savedinvestments");

  const onViewButtonClick = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const total = planInvestment.reduce(
      (ini, cur) => cur.investmentPercentage + ini,
      0
    );
    setTotal(total);
  }, [planInvestment]);

  const displayType = (amt, cont, number) => {
    let res;
    if (cont === 2)
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

  // useDeepEffect(() => {
  //   setFilteredResponse(
  //     investmentList.filter((team) => {
  //       return team.investmentName
  //         .toLowerCase()
  //         .includes(searchString.toLowerCase());
  //     })
  //   );
  // }, [searchString, investmentList]);

  // useDeepEffect(() => {
  //   let defaults = !isEmpty(getDefaultElection)
  //     ? [...getDefaultElection?.investmentDetails]
  //     : [];
  //   setTotalInvestments(defaults);
  //   setSaveInvestments(defaults);
  //   setAddedInvestments(defaults);
  // }, [getDefaultElection]);

  // useDeepEffect(() => {
  //   setTotalInvestments(saveInvestments);
  // }, [saveInvestments]);

  const onSubmit = () => {
    setSaveInvestments(
      !isEmpty(saveInvestments)
        ? [...saveInvestments, ...addedInvestments]
        : addedInvestments
    );
    setFilteredResponse("");
    setModalOpen(false);
    setAddedInvestments([]);
  };

  const onCancel = () => {
    setFilteredResponse("");
    setAddedInvestments([]);
    setModalOpen(false);
  };

  // const deletefunction = (name) => {
  //   var temp = totalInvestments.filter((e) => e.investmentName !== name);
  //   setTotalInvestments(temp);
  //   setAddedInvestments(temp);
  //   setSaveInvestments(temp);
  //   values["ID" + name] = null;
  // };
  console.log(values, "values");
  const onDeleteClick = (name) => {
    setToggle(!toggle);
    // getDefaultElection.investmentDetails.length > 0
    //   ? getDefaultElection.investmentDetails.forEach((e) =>
    //       e.investmentName === name
    //         ? deleteInvestment(planId, e.investmentId).then((response) => {
    //             if (response) deletefunction(name);
    //             setToggle(!toggle);
    //           })
    //         : deletefunction(name)
    //     )
    //   : deletefunction(name);

    setToggle(!toggle);
  };

  // const Invsum = () => {
  //   let sum1 = 0;
  //   Object.keys(values).map((source) => {
  //     if (values[source]) sum1 = sum1 + values[source];

  //     return sum1;
  //   });
  //   return sum1;
  // };

  return (
    <div>
      <p className="mt-20 main-contribution-heading">Contribution Rate</p>
      <p className="contribution-sub-title">
        Please enter the percentage/amount to contribute to the plan.
      </p>
      <p style={{ color: "Red" }}>{commonError}</p>
      {!isEmpty(get(values, "deferralSourceContributions")) && (
        <FieldArray name="deferralSourceContributions">
          {/* <Field name="commonError" component={HiddenSelect} value='' onChange={handleChange}/> */}
          {(fieldArrayProps) =>
            get(values, "deferralSourceContributions").map((e, i) => {
              console.log(e, "source contributions");
              const fieldName = `deferralSourceContributions.${i}.contributionRate`;
              const DScontrolType =
                e.contributionType === 2
                  ? FieldInputDollar
                  : FieldInputPercentage;
              const minMaxDescription =
                e.contributionType === 2
                  ? "Minimum $" +
                    e.minimumRate +
                    " / " +
                    "Maximum $" +
                    e.maximumRate
                  : "Minimum " +
                    e.minimumRate +
                    "% / " +
                    "Maximum " +
                    e.maximumRate +
                    "%";
              //var x=getDefaultElection.sourceList.map((x,i)=>`sourceList[${i}].${x.sourceName}:${x.contributionRate}`);
              return (
                <Field
                  size="sm"
                  isRequired
                  name={fieldName}
                  label={e.sourceName}
                  hasSuggestion
                  suggestionDefaultText={minMaxDescription}
                  shouldDisplaySuggestion
                  component={DScontrolType}
                  autoComplete="off"
                  defaultValue={get(values, fieldName)}
                  onChange={handleChange(fieldName)}
                  disabled={isEdit && !isSave}
                />
              );
            })
          }
        </FieldArray>
      )}

      {!isEmpty(planInvestment) ? (
        <div className="mt-40 table-size">
          <div className="d-flex justify-content-between align-baseline">
            <p className="mt-20 List-investment-heading">
              List of Investment Election Added
            </p>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(true)}
              disabled={isEdit && !isSave}
            >
              Add Investment
            </Button>
          </div>
          <div>
            <FieldArray name="planInvestment">
              {(push, remove) => {
                console.log(total, "total");
                return (
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        {columns.map((item, index) => {
                          return (
                            <Table.Th
                              key={index}
                              className={(item.className, "col-md-4")}
                            >
                              {item.label}
                            </Table.Th>
                          );
                        })}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {planInvestment.map((source, index) => {
                        const fieldName = `planInvestment.${index}.investmentPercentage`;

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
                                  component={FieldInputPercentage}
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
                                  onClick={() => onDeleteClick(source)}
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
                              component={FieldInputPercentage}
                              type="number"
                              value={total}
                              autoComplete="off"
                              disabled
                            />
                          </Form>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                );
              }}
            </FieldArray>
          </div>
        </div>
      ) : (
        <>
          <p className="investment-heading">Investment Election</p>
          <AddPlans
            content="No Investment added"
            buttonLabel="Add Investment"
            className="h-auto"
            disabled={isEdit && !isSave}
            onPrimaryClick={onViewButtonClick}
          />
        </>
      )}

      <SliderPanel
        isOpen={isModalOpen}
        size="35"
        onClose={() => onCancel()}
        showCancel={false}
      >
        <div className="inside-content">
          <div className="d-flex justify-content-between align-baseline">
            <div>
              <p className="investment-heading">Plan Investments</p>
              <p className="investment-sub-heading">
                {investmentList && investmentList.length} Investments Available
              </p>
            </div>
            <div>
              <Button variant="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => onSubmit()}
                className="ml-4"
              >
                Save
              </Button>
            </div>
          </div>
          <div className="search-bar-investment">
            <Form>
              <InputGroup>
                <FormControlSearch
                  size="lg"
                  id="plan-search-box"
                  className="plan-search-box"
                  type="search"
                  autoComplete="off"
                  placeholder="Search Investment"
                  onChange={handleSearchChange}
                />
                <InputGroup.Append>
                  <InputGroup.Text className="plan-search-button">
                    <Image src="/assets/icons/svg/search.svg" width="14px" />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </div>
          <div className="d-flex content-end">
            <p className="investment-side-content">
              {!isEmpty(filteredResponse)
                ? filteredResponse.length
                : investmentList && investmentList.length}{" "}
              Investments Available
            </p>
          </div>

          <div className="scroll-body">
            {!isEmpty(filteredResponse)
              ? filteredResponse.map((e, i) => {
                  const allResponses = [
                    ...saveInvestments,
                    ...addedInvestments,
                  ];

                  console.log(allResponses, "all responses");
                  return (
                    <div className="d-flex justify-content-between">
                      {allResponses.find(
                        (y) => y.investmentName === e.investmentName
                      ) ? (
                        <>
                          <p className="investment-name">{e.investmentName}</p>
                          <div className="added-button-inside">
                            <div className="added-button-inner-text">Added</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>{e.investmentName}</p>
                          <div
                            className="add-button-inside"
                            onClick={() => addInvestmentsToPlan(e)}
                          >
                            <div className="add-button-inner-text">Add</div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              : investmentList?.map((e, i) => {
                  const allResponses = [
                    ...saveInvestments,
                    ...addedInvestments,
                  ];

                  console.log(allResponses, "all responses");
                  return (
                    <div className="d-flex justify-content-between">
                      {allResponses.find(
                        (y) => y.investmentName === e.investmentName
                      ) ? (
                        <>
                          <p className="investment-name">{e.investmentName}</p>
                          <div className="added-button-inside">
                            <div className="added-button-inner-text">Added</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>{e.investmentName}</p>
                          <div
                            className="add-button-inside"
                            onClick={() => addInvestmentsToPlan(e)}
                          >
                            <div className="add-button-inner-text">Add</div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </SliderPanel>
    </div>
  );
};
