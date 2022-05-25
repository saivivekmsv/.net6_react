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

export const SameInvestmentElection = (props) => {
  const {
    isSave,
    isEdit,
    values,
    handleChange,
    investmentList,
    setToggle,
    toggle,
    additionalAutoEnrollmentData,
    deleteInvestment,
    planId,
    setValues,
  } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredResponse, setFilteredResponse] = useState([]);
  const [addedInvestments, setAddedInvestments] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [saveInvestments, setSaveInvestments] = useState([]);
  const [totalInvestments, setTotalInvestments] = useState([]);
  const [sum, setSum] = useState(0);

  const addInvestmentsToPlan = (name) => {
    setAddedInvestments((e) => [...e, name]);
  };

  const onViewButtonClick = () => {
    setModalOpen(true);
  };

  const onSubmit = (savedInvestments) => {
    setSaveInvestments(savedInvestments);
    setModalOpen(false);
  };

  const onCancel = () => {
    setAddedInvestments(saveInvestments);
    setModalOpen(false);
  };

  console.log("Investment List ", investmentList);
  useDeepEffect(() => {
    setFilteredResponse(
      investmentList.filter((team) => {
        return team.name.toLowerCase().includes(searchString.toLowerCase());
      })
    );
  }, [searchString, investmentList]);
  console.log(values);
  useDeepEffect(() => {
    let defaults = !isEmpty(
      additionalAutoEnrollmentData.additionalAutoEnrollmentInvestmentElection
    )
      ? [
          ...additionalAutoEnrollmentData?.additionalAutoEnrollmentInvestmentElection,
        ]
      : [];
    setTotalInvestments(defaults);
    setSaveInvestments(defaults);
    setAddedInvestments(defaults);
  }, [additionalAutoEnrollmentData]);

  useDeepEffect(() => {
    setTotalInvestments(saveInvestments);
  }, [saveInvestments]);

  const deletefunction = (name, index) => {
    console.log(name);
    var temp = totalInvestments.filter((e) => e.investmentName !== name);
    // var temp = saveInvestments.filter((e) => e.investmentName !== name);
    setTotalInvestments(temp);
    setAddedInvestments(temp);
    setSaveInvestments(temp);
    setValues({
      ...values,
      additionalAutoEnrollmentInvestmentElection: values.additionalAutoEnrollmentInvestmentElection.filter(
        (x) => x.investmentName !== name
      ),
    });
  };

  const onDeleteClick = (name, index) => {
    setToggle(!toggle);
    // autoEnrollment.investmentDetails
    //   ? autoEnrollment.investmentDetails.forEach((e) =>
    //       e.investmentName === name
    //         ? deleteInvestment(planId, e.investmentId).then((response) => {
    //             if (response) deletefunction(name);
    //           })
    //         : deletefunction(name)
    //     )
    //   : deletefunction(name);
    deletefunction(name, index);
    setToggle(!toggle);
  };

  const Invsum = () => {
    let sum1 = 0;
    if (!isEmpty(values.additionalAutoEnrollmentInvestmentElection))
      values.additionalAutoEnrollmentInvestmentElection.map(
        (x) => (sum1 = sum1 + x.investmentPercentage)
      );
    return sum1;
  };
  const AddName = (e, source, i) => {
    if (!isEmpty(values.additionalAutoEnrollmentInvestmentElection[i])) {
      values.additionalAutoEnrollmentInvestmentElection[
        i
      ].investmentName = source;
    }
    //if(!isEmpty(values.additionalAutoEnrollmentInvestmentElection))values.additionalAutoEnrollmentInvestmentElection=[]
    handleChange(e);
  };

  return (
    <div>
      {!isEmpty(saveInvestments) ||
      !isEmpty(
        additionalAutoEnrollmentData.additionalAutoEnrollmentInvestmentElection
      ) ? (
        <>
          <div className="mt-40 table-size">
            <div className="d-flex justify-content-between align-baseline">
              <p className="mt-20 plan-heading-plan">
                List of Investment Election Added
              </p>
              <Button variant="secondary" onClick={() => setModalOpen(true)}>
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
                  {totalInvestments.map((source, index) => {
                    const fieldName = `additionalAutoEnrollmentInvestmentElection[${index}].investmentPercentage`;
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
                              onChange={(e) => {
                                AddName(e, source.investmentName, index);
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
                                onDeleteClick(source.investmentName, index)
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
        </>
      ) : (
        <div className="mt-40">
          <p className="mt-20 plan-heading-plan">Investment Election</p>
          <AddPlans
            content="No Investments added."
            buttonLabel="Add Investment"
            onPrimaryClick={onViewButtonClick}
          />
        </div>
      )}
      {
        (console.log("filteredResponse for Check", filteredResponse),
        console.log("AddedInvestments for Check", addedInvestments))
      }

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
          {filteredResponse.length} Investments Available
        </p>
        <div className="scroll-body">
          {filteredResponse &&
            filteredResponse.map((e, i) => (
              <div className="d-flex justify-content-between">
                <p>{e.name}</p>
                {addedInvestments.find((y) => y.name === e.name) ? (
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
    </div>
  );
};

export default SameInvestmentElection;
