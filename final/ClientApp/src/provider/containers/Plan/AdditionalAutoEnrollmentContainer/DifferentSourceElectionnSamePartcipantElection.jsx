import React, { useState } from "react";
import { Field } from "formik";
import {
  CsplTable as Table,
  FieldInput,
  AddPlans,
  SliderPanel,
  Link,
} from "../../../components";
import { get, isEmpty } from "lodash";
import { useDeepEffect } from "../../../abstracts";
import { Form, Button, InputGroup, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";

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

export const DifferentSourceElectionnSamePartcipantElection = (props) => {
  const {
    fields,
    isSave,
    isEdit,
    values,
    setFieldValue,
    handleChange,
    investmentList,
    sourcesList,
    setToggle,
    toggle,
    handleSubmit,
    additionalAutoEnrollmentData,
    deleteInvestment,
    planId,
  } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [sourceIndex, setSourceIndex] = useState();
  const [filteredResponse, setFilteredResponse] = useState({});
  const [addedInvestments, setAddedInvestments] = useState({});
  const [searchString, setSearchString] = useState("");
  const [saveInvestments, setSaveInvestments] = useState({});
  const [totalInvestments, setTotalInvestments] = useState([]);

  const addInvestmentsToPlan = (investment) => {
    setAddedInvestments({
      ...addedInvestments,
      [sourceIndex]: [...(addedInvestments[sourceIndex] || []), investment],
    });
  };

  const onViewButtonClick = (index) => {
    setModalOpen(true);
    setSourceIndex(index);
  };

  const onSubmit = (savedInvestments) => {
    setSaveInvestments({ ...saveInvestments, [sourceIndex]: savedInvestments });
    setModalOpen(false);
  };
  console.log(values, "vl");
  const onCancel = () => {
    setAddedInvestments({
      ...addedInvestments,
      [sourceIndex]: saveInvestments[sourceIndex],
    });
    setModalOpen(false);
  };

  useDeepEffect(() => {
    (sourceIndex || sourceIndex == 0) &&
      setFilteredResponse({
        ...filteredResponse,
        [sourceIndex]: investmentList.filter((team) => {
          return team.name.toLowerCase().includes(searchString.toLowerCase());
        }),
      });
  }, [searchString, investmentList, sourceIndex]);

  useDeepEffect(() => {
    let defaults = !isEmpty(
      additionalAutoEnrollmentData.autoEnrollmentSouceInvestmentElections
    )
      ? [
          ...additionalAutoEnrollmentData?.autoEnrollmentSouceInvestmentElections,
        ]
      : [];
    setTotalInvestments(defaults);
    setSaveInvestments(defaults);
    setAddedInvestments(defaults);
  }, [additionalAutoEnrollmentData]);

  useDeepEffect(() => {
    setTotalInvestments(saveInvestments);
  }, [saveInvestments]);
  console.log(saveInvestments);
  const deletefunction = (name, index, ind) => {
    //var temp = totalInvestments.filter((e) => e.investmentName !== name);
    var temp = saveInvestments[index].filter((e) => e.investmentName !== name);
    setAddedInvestments({ ...addedInvestments, [index]: temp });
    setSaveInvestments({ ...saveInvestments, [index]: temp });
    // setTotalInvestments({ ...totalInvestments, [sourceIndex]: temp });
    values.additionalAutoEnrollmentSourceInvestmentElection[
      index
    ] = values.additionalAutoEnrollmentSourceInvestmentElection[index].filter(
      (x) => x.investmentName !== name
    );
  };
  //  console.log(autoEnrollment,'Auto')
  //  console.log(saveInvestments)
  const onDeleteClick = (name, index, ind) => {
    setToggle(!toggle);
    deletefunction(name, index, ind);
  };

  const Invsum = (index) => {
    let sum1 = 0;
    if (
      !isEmpty(values.additionalAutoEnrollmentSourceInvestmentElection[index])
    )
      values.additionalAutoEnrollmentSourceInvestmentElection[index].map(
        (x) => (sum1 = sum1 + x.investmentPercentage)
      );
    return sum1;
  };
  const AddName = (e, source, index, ind, sName) => {
    if (
      !isEmpty(
        values.additionalAutoEnrollmentSourceInvestmentElection[index]
      ) &&
      !isEmpty(
        values.additionalAutoEnrollmentSourceInvestmentElection[index][ind]
      )
    ) {
      //if(!isEmpty(values.autoEnrollmentSouceInvestmentElections[index].investmentElection[ind])){
      values.additionalAutoEnrollmentSourceInvestmentElection[index][
        ind
      ].investmentName = source;
      values.additionalAutoEnrollmentSourceInvestmentElection[index][
        ind
      ].sourceName = sName;
      // }
    }
    handleChange(e);
  };

  return (
    <div>
      <p className="mt-20 plan-heading-plan">List of sources</p>
      {(sourcesList || []).map((source, index) => {
        const sliderPanel = (
          <SliderPanel isOpen={isModalOpen} size="35" showCancel={false}>
            <div className="d-flex justify-content-between align-baseline">
              <div>
                <p className="plan-heading-plan">Plan Investments</p>
                <p className="enrollment-sub-heading">
                  {(filteredResponse[sourceIndex] || []).length} Investments
                  Available
                </p>
              </div>
              <div>
                <Button variant="secondary" onClick={() => onCancel()}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onSubmit(addedInvestments[sourceIndex])}
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
                    style={{ width: "420px", height: "50px" }}
                    type="search"
                    placeholder="Search Investments"
                    onChange={(e) => setSearchString(e.target.value)}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text className="search-bar-button">
                      <Image src="/assets/icons/svg/search.svg" width="14px" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </div>
            <p className="enrollment-side-content">
              {(filteredResponse[sourceIndex] || []).length} Investments
              Available
            </p>
            <div className="scroll-body">
              {filteredResponse[sourceIndex] &&
                (filteredResponse[sourceIndex] || []).map((e, i) => (
                  <div className="d-flex justify-content-between">
                    <p>{e.name}</p>
                    {(addedInvestments[sourceIndex] || []).find(
                      (y) => y.investmentName === e.investmentName
                    ) ? (
                      // <Button
                      //   size="sm"
                      //   style={{ width: "75px", margin: "0px 0px 8px 0px" }}
                      //   variant="secondary"
                      //   disabled
                      //   classname="custom-added"
                      // >
                      //   Added
                      // </Button>
                      <div className="added-button-inside">
                        <div className="added-button-inner-text">Added</div>
                      </div>
                    ) : (
                      <>
                        {/* <Button
                          style={{ width: "75px", margin: "0px 0px 8px 0px" }}
                          variant="secondary"
                          onClick={() => addInvestmentsToPlan(e)}
                        >
                          Add
                        </Button> */}
                        <div
                          className="add-button-inside"
                          onClick={() => addInvestmentsToPlan(e)}
                        >
                          <div className="add-button-inner-text">Add</div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </SliderPanel>
        );
        if (
          !isEmpty(saveInvestments[index]) &&
          saveInvestments[index][0].investmentName != null
          //!isEmpty(autoEnrollment.autoEnrollmentSouceInvestmentElections)
        ) {
          console.log(saveInvestments[index]);
          return (
            <div>
              <div className="mt-40 table-size">
                <div className="d-flex justify-content-between align-baseline">
                  <p className="mt-20 plan-heading-plan">{source.sourceName}</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setModalOpen(true);
                      setSourceIndex(index);
                    }}
                  >
                    Add Investment
                  </Button>
                </div>
                <div>
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
                      {(saveInvestments[index] || []).map((investment, ind) => {
                        const fieldName = `additionalAutoEnrollmentSourceInvestmentElection[${index}][${ind}].investmentPercentage`;
                        // console.log(
                        //   `autoEnrollmentSouceInvestmentElections[${index}][${ind}].investmentPercentage`
                        // );
                        // console.log(
                        //   values.autoEnrollmentSouceInvestmentElections[index][
                        //     ind
                        //   ].investmentPercentage
                        //);
                        return (
                          <Table.Tr key={ind}>
                            <Table.Td className="column-investment col-md-4">
                              {investment.investmentName}
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
                                  onChange={(e) => {
                                    AddName(
                                      e,
                                      investment.investmentName,
                                      index,
                                      ind,
                                      source.sourceName
                                    );
                                  }}
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
                                    onDeleteClick(
                                      investment.investmentName,
                                      index,
                                      ind
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
                              value={Invsum(index)}
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
              {sliderPanel}
            </div>
          );
        } else {
          return (
            <div>
              <div className="mt-40">
                <p className="mt-20 plan-heading-plan">{source.sourceName}</p>
                <AddPlans
                  content="No Investments added."
                  buttonLabel="Add Investment"
                  onPrimaryClick={() => onViewButtonClick(index)}
                />
              </div>
              {sliderPanel}
            </div>
          );
        }
      })}
    </div>
  );
};

export default DifferentSourceElectionnSamePartcipantElection;
