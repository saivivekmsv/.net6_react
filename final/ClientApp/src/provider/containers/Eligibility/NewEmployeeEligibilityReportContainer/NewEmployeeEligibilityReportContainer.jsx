/* eslint-disable eqeqeq */
import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { faTimes, faShareSquare } from "@fortawesome/pro-light-svg-icons";
import { isEmpty, get, isNull } from "lodash";
import EligibilityPlanTable from "./EligibilityPlanTable";
import EligibilitySourceTable from "./EligibilitySourceTable";
import plans from "../../../mocks/newEmployeeEligibilityPlanReport.json";
import sources from "../../../mocks/newEmployeeEligibilitySourceReport.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import {
  ManageEligibilityLayout,
  CsplTable as Table,
  FieldDropSide,
  SearchableList,
  FieldInput,
} from "../../../components";
import {
  MANAGE_ELIGIBILITY_ROUTES,
  getPathWithParam,
  manageEligibilityFormNames,
  formFields,
  getFlowBasedFormValues,
  usDateFormat,
  getParamsFromQueryString,
} from "../../../utils";
import { useRouterParams, useRequest } from "../../../abstracts";
import {
  getnewEmployeeEligibilityPlanReport,
  getEmployeePlanSources,
} from "../../../services";
import { getDetailReport } from "../../../services/payroll/index";
import {
  manageEligibilityStore,
  setManagePageLevelData,
} from "../../../contexts";
import { Formik, Field } from "formik";
import company from "../../../mocks/company.json";
import { CSVLink } from "react-csv";

const initialValues = {};

const columns = [
  {
    label: "Company Name",
    className: "column-companyName",
    columnName: "companyName",
  },
  {
    label: "Plan ID",
    className: "column-planId",
    columnName: "planID",
  },
  {
    label: "Plan name",
    className: "column-planName",
    columnName: "planName",
  },
  {
    label: "Participants Eligible for Plan",
    className: "column-statusPlan",
    columnName: "statusForPlan",
  },
  {
    label: "Participants Eligible for Source",
    className: "column-statusSource",
    columnName: "statusForSource",
  },
  {
    label: "Process Date",
    className: "column-processDate",
    columnName: "processDate",
  },
  {
    label: "Hosted Mode",
    className: "column-hostedMode",
    columnName: "hostedMode",
  },
  {
    label: "Updated By",
    className: "column-updatedBy",
    columnName: "updatedBy",
  },
];

const NewEmployeeEligibilityReport = (props) => {
  // const { flow, planId, processId } = useRouterParams();
  const [filteredResponse] = useState([]);
  const [isMockLoading, setIsLoading] = useState(false);
  const [isPlan, setIsPlan] = useState(true);
  const [eligibilityDetailReport, setEligibilityDetailReport] = useState([]);
  const [detailReport, setDetailReport] = useState([]);
  const [sources, setSources] = useState([]);
  const { state, dispatch } = useContext(manageEligibilityStore);
  const { response, loading } = useRequest({
    method: getnewEmployeeEligibilityPlanReport,
    defaultResponse: filteredResponse,
  });
  const formName = manageEligibilityFormNames.EMPLOYEE_ELIGIBILITY_FILTER;
  const fields = formFields[formName];
  const allOption = { label: "All", value: null };
  const onAddClick = () => {
    const { history } = props;

    history.push(
      getPathWithParam({
        path: MANAGE_ELIGIBILITY_ROUTES.ADD_ELIGIBILITY,
        // pathParam: [planId],
      })
    );
  };
  useEffect(() => {
    const planId = getParamsFromQueryString("planId");
    const processId = getParamsFromQueryString("processId");
    const eligiblefor = getParamsFromQueryString("eligiblefor");
    getEmployeePlanSources({
      planId: parseInt(planId),
      companyId: 0,
    })
      .then((response) => {
        setSources(response);
      })
      .catch((error) => {
        //Handle Error
      });

    if (eligiblefor == 1) {
      setIsPlan(true);
    } else {
      setIsPlan(false);
    }
    const a = {
      eligibilityProcessId: parseInt(processId),
      planId: parseInt(planId),
      eligibilityRuleFor: parseInt(eligiblefor),
      isEligible: true,
      sourceId: 0,
    };
    console.log(a);
    getDetailReport(a)
      .then((response) => {
        console.log("res", response);
        var eligibilityDetailReportData = response;
        // delete eligibilityDetailReportData.eligibilityDetailReportData;
        const detailReportData = [
          {
            id: 1,
            companyName: eligibilityDetailReportData.companyName,
            planId: eligibilityDetailReportData.planID,
            planName: eligibilityDetailReportData.planName,
            statusForPlan: eligibilityDetailReportData.planCount,
            statusForSource: eligibilityDetailReportData.sourceCount,
            processDate:
              usDateFormat(eligibilityDetailReportData.processDate) +
              " " +
              moment(new Date(eligibilityDetailReportData.processDate)).format(
                "hh:mm"
              ),
            hostedMode: eligibilityDetailReportData.updatedThrough,
            UpdatedBy: eligibilityDetailReportData.updatedBy,
          },
        ];
        console.log("bb", detailReportData);
        setDetailReport(detailReportData);
        setEligibilityDetailReport(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const mockLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSortForGenericTable = (detail) => {
    mockLoading();
  };

  const scrollEndCallBack = () => {
    mockLoading();
  };

  const buttons = [
    {
      link: MANAGE_ELIGIBILITY_ROUTES.ELIGIBILITY,
      label: "",
      variant: "secondary",
      type: "button",
      icon: faTimes,
    },
    {
      label: "",
      variant: "secondary",
      type: "button",
      icon: faShareSquare,
      onClick: onAddClick,
    },
  ];

  const onFormSubmit = (values) => {
    dispatch(
      setManagePageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
  };
  const initialValues = {
    [fields.eligibilityType]: "Eligible",
  };
  const planId = getParamsFromQueryString("planId");
  const processId = getParamsFromQueryString("processId");
  const eligiblefor = getParamsFromQueryString("eligiblefor");
  const onFilter = (values) => {
    // setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);
    var ss = sources.filter((item) => {
      return item.name == values[fields.source];
    });
    const a = {
      eligibilityProcessId: parseInt(processId),
      planId: parseInt(planId),
      eligibilityRuleFor: isPlan ? 1 : 2,
      isEligible: values[fields.eligibilityType] == "Eligible" ? true : false,
      sourceId: values[fields.source] == null ? 0 : ss[0].id,
    };
    console.log(a);
    getDetailReport(a)
      .then((response) => {
        console.log("go-res", eligibilityDetailReport);
        setEligibilityDetailReport(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log("EligibilityDetailReport", eligibilityDetailReport);
  console.log("eligibilityDetailReportData", detailReport);
  console.log("sources", sources);
  return (
    <ManageEligibilityLayout buttons={buttons}>
      <div className="eligibility-container">
        <CSVLink data={detailReport}>
          <FontAwesomeIcon icon={faShareSquare} color="#212529" />
        </CSVLink>
      </div>
      {!loading && isEmpty(eligibilityDetailReport) && <p>No Data Found</p>}
      {!loading && !isEmpty(eligibilityDetailReport) && (
        <div className="w-100 new-employee-report">
          <div className="d-flex w-100 align-items-center justify-content-between mb-4">
            <div className="m-0 plan-heading font-weight-500">
              New Employee Eligibility Report {/* (ACME 7777 Plan 1234) */}
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
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className="column-companyName">
                  {eligibilityDetailReport.companyName}
                </Table.Td>
                <Table.Td className="column-planId">
                  {eligibilityDetailReport.rkPlanNumber}
                </Table.Td>
                <Table.Td className="column-planName">
                  {eligibilityDetailReport.planName}
                </Table.Td>
                <Table.Td className="column-statusPlan">
                  {eligibilityDetailReport.planCount}
                </Table.Td>
                <Table.Td className="column-statusSource">
                  {eligibilityDetailReport.sourceCount}
                </Table.Td>
                <Table.Td className="column-processDate">
                  {usDateFormat(eligibilityDetailReport.processDate) +
                    " " +
                    moment(
                      new Date(eligibilityDetailReport.processDate)
                    ).format("hh:mm:ss")}
                </Table.Td>
                <Table.Td className="column-hostedMode">
                  {eligibilityDetailReport.updatedThrough}
                </Table.Td>
                <Table.Td className="column-updatedBy">
                  {eligibilityDetailReport.updatedBy}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      )}

      <div className="mt-20">
        <Formik
          initialValues={{
            ...initialValues,
            ...getFlowBasedFormValues(get(state, formName, {})),
          }}
          onSubmit={onFormSubmit}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
            // const setSourceOption = (value, source) => {
            //   setFieldValue(fields.source, value || value === 0 ? values[fields.source] : 0)
            // }

            return (
              <Form
                autoComplete="off"
                className="h-100 new-employee-report"
                onSubmit={handleSubmit}
                validated={!isEmpty(rest.errors)}
              >
                <div className="d-flex justify-content-between">
                  <div className="btn-size-sm mr-2">
                    <div className="btn-group">
                      <button
                        type="button"
                        className={`"btn btn-primary" ${
                          isPlan == true
                            ? "active-border br-4"
                            : "btn btn-primary"
                        }`}
                        onClick={() => setIsPlan(true)}
                      >
                        Plan
                      </button>
                      <button
                        type="button"
                        className={`"btn btn-primary" ${
                          isPlan == false
                            ? "active-border bl-4"
                            : "btn btn-primary"
                        }`}
                        onClick={() => setIsPlan(false)}
                      >
                        Source
                      </button>
                    </div>
                  </div>

                  <div className="d-flex mr-2 border-cut">
                    <label className="label-sort br-0">Eligibility</label>
                    <Field
                      size="sm"
                      name={fields.eligibilityType}
                      value={values[fields.eligibilityType]}
                      placeholder="Eligible"
                      defaultValue={company.data[0]}
                      popupContent={
                        <SearchableList
                          label="Select Company"
                          options={company.data.map((value) => ({
                            label: value,
                            value,
                          }))}
                          onSelect={(value) =>
                            setFieldValue(fields.eligibilityType, value)
                          }
                          selectedValue={values[fields.eligibilityType]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </div>
                  {!isPlan ? (
                    <div className="d-flex mr-2 border-cut">
                      <label className="label-sort br-0">Source</label>
                      {eligibilityDetailReport.eligibilityDetailReportData !=
                      null ? (
                        <Field
                          size="sm"
                          name={fields.source}
                          value={values[fields.source]}
                          placeholder="All"
                          popupContent={
                            <SearchableList
                              label="Select Company"
                              options={[
                                allOption,
                                ...sources.map((value, index) => ({
                                  label: isNull(value.name) ? "" : value.name,
                                  value: value.name,
                                })),
                              ]}
                              onSelect={(value) =>
                                setFieldValue(fields.source, value)
                              }
                              selectedValue={values[fields.source]}
                            />
                          }
                          component={FieldDropSide}
                        />
                      ) : null}
                    </div>
                  ) : null}

                  <div className="d-flex mr-2">
                    {/* <Field
                      size="lg"
                      name={fields.search}
                      placeholder="Search Employee with name, ID, SSN etc."
                      type="text"
                      autoComplete="off"
                      value={values[fields.search]}
                      onChange={handleChange}
                      component={FieldInput}
                    /> */}
                  </div>

                  <Button
                    className="ml-2 sort-button"
                    onClick={() => onFilter(values)}
                  >
                    Go
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className="text-right mr-2 mb-10">
        <p>
          {isPlan == true
            ? eligibilityDetailReport.length
            : eligibilityDetailReport.length}{" "}
          records{" "}
        </p>
      </div>
      {isPlan === true ? (
        <EligibilityPlanTable
          data={eligibilityDetailReport.eligibilityDetailReportData}
          isLoading={isMockLoading}
          handleSort={handleSortForGenericTable}
          scrollEndCallBack={scrollEndCallBack}
        />
      ) : (
        <EligibilitySourceTable
          data={eligibilityDetailReport.eligibilityDetailReportData}
          isLoading={isMockLoading}
          handleSort={handleSortForGenericTable}
          scrollEndCallBack={scrollEndCallBack}
        />
      )}
    </ManageEligibilityLayout>
  );
};

export default NewEmployeeEligibilityReport;
