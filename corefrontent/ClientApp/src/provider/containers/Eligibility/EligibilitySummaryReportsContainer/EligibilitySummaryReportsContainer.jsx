import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { isEmpty, get } from "lodash";
import { Button, Form } from "react-bootstrap";
import { faShareSquare } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ManageEligibilityLayout,
  LoaderWrapper,
  CsplTable as Table,
  FieldDropSide,
  DatePicker,
  SearchableList,
  SliderPanel,
} from "../../../components";
import {
  manageEligibilityFormNames,
  MANAGE_ELIGIBILITY_ROUTES,
  getPathWithParam,
  formFields,
  getFlowBasedFormValues,
  usDateFormat,
  required,
} from "../../../utils";
import { useRouterParams, useRequest } from "../../../abstracts";
import {
  getCompaniesList,
  getEligibilitySummaryReport,
  getPlanList,
} from "../../../services";
import {
  manageEligibilityStore,
  setManagePageLevelData,
} from "../../../contexts";
import { Formik, Field } from "formik";
import company from "../../../mocks/company.json";
import plan from "../../../mocks/planName.json";
import { CSVLink } from "react-csv";
import RunEligibilityProcessSlider from "./RunEligibilityProcessSlider";
import { getSummaryReport } from "../../../services/payroll/index";
import { date } from "yup";
import moment from "moment";

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
    columnName: "rkPlanNumber",
  },
  {
    label: "Plan name",
    className: "column-planName",
    columnName: "planName",
  },
  {
    label: "Participants Eligible for Plan",
    className: "column-statusPlan",
    columnName: "planCount",
    link: `${MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT}`,
  },
  {
    label: "Participants Eligible for Sources",
    className: "column-statusSource",
    columnName: "sourceCount",
    link: `${MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT}`,
  },
  {
    label: "Process Date",
    className: "column-processDate",
    columnName: "processDate",
  },
];

const planOptions = ["Plan ID", "Plan Name"];

const EligibilitySummaryReportsContainer = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { flow, planId } = useRouterParams();
  const { state, dispatch } = useContext(manageEligibilityStore);
  const [isLoading, setIsLoading] = useState(false);
  const [planList, setPlanList] = useState([]);
  const allOption = { label: "All", value: null };
  const [plan, setPlan] = useState();
  const [eligibilitySummaryReport, setEligibilitySummaryReport] = useState([]);
  const [planOption, setPlanOption] = useState(0);

  const { response, loading } = useRequest({
    method: getEligibilitySummaryReport,
    defaultResponse: [],
  });

  const { response: companies } = useRequest({
    method: getCompaniesList,
    payload: 1, //TenantId. HardCoding should be removed
    defaultResponse: [],
  });
  console.log("com", companies);
  const formName = manageEligibilityFormNames.ELIGIBILITY_SUMMARY_FILTER;
  const fields = formFields[formName];

  const onAddClick = () => {};

  const buttons = [
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
  // const initialValues = {
  //   [fields.startDate]: new Date(),
  //   [fields.endDate]: new Date(new Date(). getFullYear(), new Date(). getMonth(), new Date(). getDate()+7),
  // };
  const onFilter = (values) => {
    setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);
    const a = {
      companyId: parseInt(values.companyId),
      planId: values.planId,
      fromDate: values.startDate,
      toDate: values.endDate,
    };
    console.log(a);
    getSummaryReport(a)
      .then((response) => {
        setIsLoading(false);
        setEligibilitySummaryReport(response);
        console.log("res", response);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };
  console.log("hello", eligibilitySummaryReport);
  const onViewButtonClick = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <ManageEligibilityLayout buttons={buttons}>
      <div className="eligibility-container">
        <CSVLink data={response}>
          <FontAwesomeIcon icon={faShareSquare} color="#212529" />
        </CSVLink>
      </div>
      {!loading && isEmpty(response) && <p>No Data Found</p>}
      <LoaderWrapper isLoading={loading} className="">
        {!loading && !isEmpty(response) && (
          <div className="w-100">
            <div className="d-flex w-100 align-items-center justify-content-between mb-4">
              <div className="m-0 plan-heading font-weight-500">
                Summary Reports
              </div>
              <div className="m-0 plan-heading font-weight-500">
                <Button onClick={onViewButtonClick}>
                  Run Eligibility Process
                </Button>
              </div>
            </div>

            <Formik
              initialValues={{
                ...initialValues,
                ...getFlowBasedFormValues(get(state, formName, {}), flow),
              }}
              onSubmit={onFormSubmit}
              enableReinitialize
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({
                handleChange,
                setFieldValue,
                handleSubmit,
                values,
                ...rest
              }) => {
                const onDaySelected = (fieldName, value) => {
                  setFieldValue(fieldName, value);
                };
                const onCompanyChange = (value, plan) => {
                  setFieldValue(
                    fields.companyName,
                    value || value === null ? "All" : companies[value].name
                  );
                  if (value !== null) {
                    setFieldValue(fields.companyName, companies[value].name);
                    setFieldValue(fields.companyId, companies[value].id);
                    setFieldValue(fields.rkPlanNumber, "All");
                    setFieldValue(fields.planName, "All");
                    getPlanList(companies[value].id)
                      .then((response) => {
                        setPlanList(response);
                      })
                      .catch((error) => {
                        //Handle Error
                      });
                  }
                };

                const onPlanChange = (value, plan) => {
                  setFieldValue(
                    fields.planName,
                    value || value === null ? "All" : planList[value].name
                  );
                  setFieldValue(
                    fields.rkPlanNumber,
                    value || value === null
                      ? "All"
                      : planList[value].rkPlanNumber
                  );
                  setFieldValue(
                    fields.planId,
                    value || value === null ? "All" : planList[value].id
                  );
                  if (value !== null) {
                    setFieldValue(fields.planName, planList[value].name);
                    setFieldValue(
                      fields.rkPlanNumber,
                      planList[value].rkPlanNumber
                    );
                    setFieldValue(fields.planId, planList[value].id);
                  }
                };
                return (
                  <Form
                    autoComplete="off"
                    className="h-100"
                    onSubmit={handleSubmit}
                    validated={!isEmpty(rest.errors)}
                  >
                    <div className="d-flex">
                      <div className="d-flex mr-2 border-cut">
                        <label className="label-sort br-0">Company</label>
                        <Field
                          size="sm"
                          name={fields.companyName}
                          value={values[fields.companyName]}
                          direction="bottom"
                          popupContent={
                            <SearchableList
                              label="Select Company"
                              options={
                                companies && [
                                  allOption,
                                  ...companies.map((company, index) => ({
                                    label: company.name,
                                    value: index,
                                  })),
                                ]
                              }
                              onSelect={(value) => onCompanyChange(value, null)}
                              selectedValue={values[fields.companyName]}
                            />
                          }
                          component={FieldDropSide}
                        />

                        <div className="d-flex ml-2 mr-2 census-border-cut eligibility-placeholder-color">
                          <div className="br-0">
                            <Field
                              size="sm"
                              value={planOptions[planOption]}
                              placeholder="Plan ID"
                              direction="bottom"
                              popupContent={
                                <SearchableList
                                  label="Plan ID"
                                  options={planOptions.map((option, index) => {
                                    return {
                                      label: option,
                                      value: index,
                                    };
                                  })}
                                  onSelect={(value) => setPlanOption(value)}
                                  selectedValue={planOption}
                                />
                              }
                              component={FieldDropSide}
                            />
                          </div>
                          <div className="bl-0">
                            {planOption === 1 && (
                              <Field
                                size="sm"
                                name={fields.planName}
                                value={values[fields.planName]}
                                direction="bottom"
                                popupContent={
                                  <SearchableList
                                    label="Select Plan"
                                    options={
                                      planList && [
                                        allOption,
                                        ...planList.map((plan, index) => ({
                                          label: plan.name,
                                          value: index,
                                        })),
                                      ]
                                    }
                                    onSelect={(value) => onPlanChange(value)}
                                    selectedValue={values[fields.planName]}
                                  />
                                }
                                component={FieldDropSide}
                              />
                            )}
                            {planOption === 0 && (
                              <Field
                                size="sm"
                                name={fields.rkPlanNumber}
                                value={values[fields.rkPlanNumber]}
                                direction="bottom"
                                popupContent={
                                  <SearchableList
                                    label="Select Plan"
                                    options={
                                      planList && [
                                        allOption,
                                        ...planList.map((plan, index) => ({
                                          label: plan.rkPlanNumber,
                                          value: index,
                                        })),
                                      ]
                                    }
                                    onSelect={(value) => onPlanChange(value)}
                                    selectedValue={values[fields.rkPlanNumber]}
                                  />
                                }
                                component={FieldDropSide}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="d-flex mr-2 border-cut">
                          <label className="label-sort br-0">Date range</label>
                          <Field
                            size="sm"
                            name={fields.startDate}
                            value={usDateFormat(values[fields.startDate])}
                            isDatePicker
                            placeholder="From"
                            direction="bottom"
                            onClear={() => onDaySelected(fields.startDate, "")}
                            popupContent={
                              <DatePicker
                                onDayClick={(value) =>
                                  onDaySelected(fields.startDate, value)
                                }
                                value={values[fields.startDate]}
                              />
                            }
                            component={FieldDropSide}
                          />
                        </div>
                        <div className="mr-2">
                          <Field
                            size="sm"
                            name={fields.endDate}
                            placeholder="To"
                            value={usDateFormat(values[fields.endDate])}
                            direction="bottom"
                            isDatePicker
                            onClear={() => onDaySelected(fields.endDate, "")}
                            popupContent={
                              <DatePicker
                                onDayClick={(value) =>
                                  onDaySelected(fields.endDate, value)
                                }
                                value={values[fields.endDate]}
                              />
                            }
                            component={FieldDropSide}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          onFilter(values);
                        }}
                        className="ml-2 sort-button"
                      >
                        Go
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>

            <div className="text-right mr-4 mb-10">
              <p> {eligibilitySummaryReport.length} Records </p>
            </div>

            <div className="eligibility-table">
              <Table isLoading={isLoading}>
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
                  {eligibilitySummaryReport.map((source, index) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td className="column-companyName">
                          {source.companyName}
                        </Table.Td>
                        <Table.Td className="column-planId">
                          {source.rkPlanNumber}
                        </Table.Td>
                        <Table.Td className="column-planName">
                          {source.planName}
                        </Table.Td>
                        <Table.Td className="column-statusPlan">
                          <Link
                            to={getPathWithParam({
                              path: `${MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT}`,
                              // pathParam: [flow],
                              queryParam: `?planId=${source.planID}&processId=${
                                source.eligibilityProcessId
                              }&eligiblefor=${1}`,
                            })}
                          >
                            {source.planCount}
                          </Link>
                        </Table.Td>
                        <Table.Td className="column-statusSource">
                          <Link
                            to={getPathWithParam({
                              path: `${MANAGE_ELIGIBILITY_ROUTES.NEW_EMPLOYEE_ELIGIBILITY_REPORT}`,
                              // pathParam: [flow],
                              queryParam: `?planId=${source.planID}&processId=${
                                source.eligibilityProcessId
                              }&eligiblefor=${2}`,
                            })}
                          >
                            {source.sourceCount}
                          </Link>
                        </Table.Td>
                        <Table.Td className="column-processDate">
                          {usDateFormat(source.processDate) +
                            " " +
                            moment(new Date(source.processDate)).format(
                              "hh:mm:ss"
                            )}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        )}
      </LoaderWrapper>
      <SliderPanel
        isOpen={isModalOpen}
        size="30"
        onClose={() => setModalOpen(false)}
        backdropClicked={false}
      >
        <RunEligibilityProcessSlider
          onCancel={onViewButtonClick}
          onSubmitted={onViewButtonClick}
        />
      </SliderPanel>
    </ManageEligibilityLayout>
  );
};

export default EligibilitySummaryReportsContainer;
