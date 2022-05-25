import React, { useState } from "react";
import { Field } from "formik";
import {
  CsplTable as Table,
  FieldInput,
  AddPlans,
  SliderPanel,
  Link,
  FormControlSearch,
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
    autoEnrollment,
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

  useDeepEffect(() => {
    setFilteredResponse(
      investmentList.filter((team) => {
        return team.investmentName
          .toLowerCase()
          .includes(searchString.toLowerCase());
      })
    );
  }, [searchString, investmentList]);
  console.log(values);
  useDeepEffect(() => {
    let defaults = !isEmpty(autoEnrollment.autoEnrollmentInvestmentElections)
      ? [...autoEnrollment?.autoEnrollmentInvestmentElections]
      : [];
    setTotalInvestments(defaults);
    setSaveInvestments(defaults);
    setAddedInvestments(defaults);
  }, [autoEnrollment]);
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
      autoEnrollmentInvestmentElections: values.autoEnrollmentInvestmentElections.filter(
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
    if (!isEmpty(values.autoEnrollmentInvestmentElections))
      values.autoEnrollmentInvestmentElections.map(
        (x) => (sum1 = sum1 + x.investmentPercentage)
      );
    return sum1;
  };
  const AddName = (e, source, i) => {
    if (!isEmpty(values.autoEnrollmentInvestmentElections[i])) {
      values.autoEnrollmentInvestmentElections[i].investmentName = source;
    }
    //if(!isEmpty(values.autoEnrollmentInvestmentElections))values.autoEnrollmentInvestmentElections=[]
    handleChange(e);
  };

  return (
    <div>
      {!isEmpty(saveInvestments) ||
      !isEmpty(autoEnrollment.autoEnrollmentInvestmentElections) ? (
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
                    const fieldName = `autoEnrollmentInvestmentElections[${index}].investmentPercentage`;
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
                style={{ width: "420px", height: "50px" }}
                size="lg"
                type="search"
                width="100px"
                placeholder="Search Investments"
                onChange={(e) => setSearchString(e.target.value)}
              />
              <InputGroup.Append>
                <InputGroup.Text className="plan-search-button">
                  <Image src="/assets/icons/svg/search.svg" width="14px" />
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          {/* <Form>
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
            </Form> */}
        </div>
        {console.log("sfdsfs", filteredResponse)}
        <p className="enrollment-side-content">
          {filteredResponse.length} Investments Available
        </p>
        {console.log("filteredResponeses", filteredResponse)}
        <div className="scroll-body">
          {filteredResponse &&
            filteredResponse.map((e, i) => (
              <div className="d-flex justify-content-between">
                <p>{e.investmentName}</p>
                {addedInvestments.find(
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
    </div>
  );
};

export default SameInvestmentElection;
