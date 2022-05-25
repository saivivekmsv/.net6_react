import React, { useEffect, useContext, useState } from "react";
import {
  FormControlSearch,
  CsplTable as Table,
  LoaderWrapper,
} from "../../../components";
import { get, isEmpty } from "lodash";
import { MANAGE_CENSUS_ROUTES } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { Row, Col, Form, InputGroup, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Payroll from "../../../mocks/payrollAndSSN.json";
import { managePayrollStore, getAllData } from "../../../contexts";
import {
  addEmployeeToPayrollData,
  removeEmployeeFromPayrollData,
} from "../../../services";

const columnData = [
  {
    label: "Remove",
    className: "column-remove",
    columnName: "",
  },
  {
    label: "SSN & employee name",
    className: "column-ssnAndname",
    columnName: "Name",
  },
  {
    label: "Hours",
    className: "column-ytd",
    columnName: "ytd",
  },
  {
    label: "Compensation",
    className: "column-compensation",
    columnName: "compensation",
  },
  {
    label: "Total contribution",
    className: "column-totalContribution",
    columnName: "totalContribution",
  },
  {
    label: "Action",
    className: "column-Action",
    columnName: "edit",
  },
];
const EmployeeListing = (props) => {
  const {
    onViewButtonClick,
    onViewEmployeeWizard,
    payrollId,
    companyId,
  } = props;
  const { state, dispatch } = useContext(managePayrollStore);
  const [toggle, setToggle] = useState(false);
  const [list, setList] = useState();
  const [newList, setNewList] = useState();
  const [searchList, setSearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(list, "list");
  useEffect(() => {
    dispatch(getAllData({ payrollId, companyId }, dispatch, state));
    console.log("state asnoienwon");
  }, [payrollId, toggle]);
  console.log(state, "state component");
  console.log(newList, "payroll component");
  useEffect(() => {
    !isEmpty(list) ? setLoading(false) : setLoading(true);
  }, [list]);
  useEffect(() => {
    setList(get(state, "api.employeeDetails", {}));
    setNewList(get(state, "api.payrollData", {}));
  }, [get(state, "api.employeeDetails"), get(state, "api.payrollData")]);

  const addAll = () => {
    list.map((item) => {
      return addEmployeeToPayrollData({ id: item.id, payrollId })
        .then((res) => {
          if (res) {
            setToggle(!toggle);
          }
        })
        .catch((err) => {
          return err;
        });
    });
  };

  const addOne = (id) => {
    addEmployeeToPayrollData({ id, payrollId })
      .then((res) => {
        if (res) {
          setToggle(!toggle);
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const removeOne = (id) => {
    removeEmployeeFromPayrollData(id)
      .then((response) => {
        if (response) {
          setToggle(!toggle);
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;

    if (val) {
      const test = list.filter((team) => {
        return team.name.toLowerCase().includes(val.toLowerCase());
      });
      setSearchList(test);
    } else {
      setSearchList([]);
    }
  };
  console.log(searchList, "search List");
  console.log(newList);

  return (
    <LoaderWrapper isLoading={loading}>
      {!isEmpty(list) ? (
        <div className="search-bar">
          <Row>
            <Col sm="4">
              <Form>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text className="plan-search-button">
                      <Image src="/assets/icons/svg/search.svg" width="14px" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControlSearch
                    size="lg"
                    id="plan-search-box"
                    className="plan-search-box"
                    type="search"
                    autoComplete="off"
                    placeholder="Search SSN or employee name"
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Form>
              <div className="d-flex justify-content-between mt-10 mb-2">
                <Link to={MANAGE_CENSUS_ROUTES.EMPLOYEE_INFORMATION}>
                  <div className="link-text font-weight-500">
                    Create new employee
                  </div>
                </Link>
                <div className="ft-12 text-black font-weight-500">
                  {list.length} Employees
                </div>
              </div>
              <div className="table-new-style">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="column-ssnName">SSN & Name</Table.Th>
                      <Table.Th className="column-addAll link-text pointer">
                        {!isEmpty(searchList) ? (
                          searchList.length
                        ) : list.length > 0 ? (
                          <span onClick={addAll}>Add all</span>
                        ) : (
                          ""
                        )}
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {list && !isEmpty(searchList)
                      ? searchList.map((payroll, index) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td className="column-ssnName">
                                <div>
                                  <div className="table-ssn-text">
                                    {payroll && payroll.ssn}
                                  </div>
                                  <div className="table-name-text">
                                    {payroll && payroll.name}
                                  </div>
                                </div>
                              </Table.Td>
                              <Table.Td
                                className="column-addAll pointer"
                                onClick={() => addOne(payroll.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  color="#2F80ED"
                                />
                              </Table.Td>
                            </Table.Tr>
                          );
                        })
                      : list.map((payroll, index) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td className="column-ssnName">
                                <div>
                                  <div className="table-ssn-text">
                                    {payroll && payroll.ssn}
                                  </div>
                                  <div className="table-name-text">
                                    {payroll && payroll.name}
                                  </div>
                                </div>
                              </Table.Td>
                              <Table.Td
                                className="column-addAll pointer"
                                onClick={() => addOne(payroll.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  color="#2F80ED"
                                />
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                    <div className="pushed-records">
                      {list.length < 1 ? "All Employees added to Payroll" : ""}
                    </div>
                  </Table.Tbody>
                </Table>
              </div>
            </Col>
            <Col sm="8">
              <div className="d-flex justify-content-between mbb-5">
                <div className="ft-14 font-weight-500 text-black">
                  Payroll details
                </div>
                <div className="ft-12 text-black font-weight-500">
                  {newList.length} {list.length < 1 ? "(All)" : null} Employees
                  added for payroll
                </div>
              </div>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    {columnData.map((item, index) => {
                      return (
                        <Table.Th key={index} className={item.className}>
                          {item.label}
                        </Table.Th>
                      );
                    })}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {!isEmpty(newList) ? (
                    newList.map((payroll, index) => {
                      return (
                        <Table.Tr key={index}>
                          <Table.Td
                            className="column-remove pointer"
                            onClick={() => removeOne(payroll.id)}
                          >
                            <FontAwesomeIcon
                              icon={faArrowLeft}
                              color="#2F80ED"
                            />
                          </Table.Td>
                          <Table.Td className="column-ssnAndname">
                            <div>
                              <div className="table-ssn-text">
                                {payroll && payroll.ssn}
                              </div>
                              <div
                                className="table-name-text pointer link-text ft-14"
                                onClick={() => onViewEmployeeWizard(payroll.id)}
                              >
                                {payroll && payroll.name}
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td className="column-ytd">
                            {payroll && payroll.payPeriodHours} hrs
                          </Table.Td>
                          <Table.Td className="column-compensation">
                            $ {payroll && payroll.planPayPeriodCompensation}
                          </Table.Td>
                          <Table.Td className="column-totalContribution">
                            $ {payroll && payroll.totalContribution}
                          </Table.Td>
                          <Table.Td className="column-Action">
                            <span
                              className="link-text"
                              onClick={() => onViewButtonClick(payroll.id)}
                            >
                              Edit contribution
                            </span>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  ) : (
                    <span>No Data</span>
                  )}
                </Table.Tbody>
              </Table>
            </Col>
          </Row>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </LoaderWrapper>
  );
};

export default EmployeeListing;
