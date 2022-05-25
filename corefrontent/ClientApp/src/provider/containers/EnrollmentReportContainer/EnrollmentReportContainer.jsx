import React, { useContext, useState, useEffect } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Formik, Field } from "formik";
import { isEmpty, get, parseInt } from "lodash";
import {
  AddPlans,
  LoaderWrapper,
  CsplTable as Table,
  FieldDropSide,
  FieldInput,
  SearchableList,
  AddButton,
  DatePicker,
  Link,
  SliderPanel,
} from "../../components";
import {
  manageCensusFormNames,
  getPathWithParam,
  formFields,
  getFlowBasedFormValues,
  ROUTES,
  ssnMasking,
  clearFieldValues,
  toMultiSelectValue,
  tranformListToDropdownValues,
  usDateFormat,
  MANAGE_ENROLLMENT_ROUTES,
} from "../../utils";
import {
  getManageEmployeeMaster,
  getCompaniesList,
  getEmploymentStatusList,
  getPlanList,
  autoEnrollmentGeneration,
  EnrollmentSummaryReport,
  postCompanyGridView,
  postPlanGridDetails,
} from "../../services";
import { manageCensusStore, setManagePageLevelData } from "../../contexts";
import { useRouterParams, useRequest, useDeepEffect } from "../../abstracts";
import AddToolTip from "../../components/AddToolTip";
const columns = [
  {
    label: "Company Name",
    className: "column-companyname",
    columnName: "companyName",
  },
  {
    label: "Plan Name",
    className: "column-planname",
    columnName: "planName",
  },
  {
    label: "No Of Participants",
    className: "column-noOfParticipants",
    columnName: "noOfParticipants",
    link: `${MANAGE_ENROLLMENT_ROUTES.ENROLLMENT_DETAIL_REPORT}/edit`,
  },
  // {
  //   label: "Process Date",
  //   className: "column-processdate",
  //   columnName: "processDate",
  // },
];

const planSearchOptions = [
  {
    label: "Plan ID",
    value: 1,
  },
  {
    label: "Plan Name",
    value: 2,
  },
];
const initialValues = {};

const allOption = { label: "All", value: null };
const EnrollmentReportContainer = () => {
  const { state, dispatch } = useContext(manageCensusStore);
  const { flow, censusId = 123 } = useRouterParams();
  const [isLoading, setIsLoading] = useState(false);
  const [employmentStatusList, setEmploymentStatusList] = useState([]);
  //const [planList, setPlanList] = useState([]);
  const [employeesList, setEmployees] = useState([]);
  const formName = manageCensusFormNames.CENSUS_FILTER;
  const fields = formFields[formName];

  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    EnrollmentSummaryReport({
      planId: null,
      companyId: null,
      startDate: null,
      endDate: null,
    }).then((response) => {
      setEmployees(response);
    });
  }, []);
  const { response: companies } = useRequest({
    method: postCompanyGridView,
    payload: {
      id: 0,
      searchString: "",
      from: 1,
      to: 20,
    },
    defaultResponse: [],
  });
  const { response: planList } = useRequest({
    method: postPlanGridDetails,
    payload: {
      searchString: "",
      sortOn: "",
      orderDescending: true,
      from: 1,
      to: 20,
    },
    defaultResponse: [],
  });

  // const { response: employeesList, loading } = useRequest({
  //   method: EnrollmentSummaryReport,
  //   payload: { planId: 7, companyId: 6 },
  //   defaultResponse: [],
  // });

  console.log(employeesList);
  const getData = (item, source) => {
    let dataItem;
    if (!isEmpty(item.link)) {
      dataItem = (
        <Link
          to={getPathWithParam({
            path: item.link,
            pathParam: [flow, source.planId, source.companyId],
          })}
        >
          {source[item.columnName]}
        </Link>
      );
      return <AddToolTip name={source[item.columnName]}>{dataItem}</AddToolTip>;
    } else {
      dataItem = source[item.columnName];
    }
    return <AddToolTip name={dataItem} />;
  };

  const onFormSubmit = (values) => {
    autoEnrollmentGeneration({
      planId: values.planId,
      companyId: values.companyId,
    })
      .then((response) => {
        setIsLoading(false);
        setModalOpen(false);
        dispatch(setModalOpen(false));
      })
      .catch((error) => {
        //Handle Errors
      });
    setModalOpen(false);
  };
  const onSearch = (values) => {
    console.log(values);
    EnrollmentSummaryReport({
      planId: values.planId,
      companyId: values.companyId,
      processDateFrom: values.startDate,
      processDateTo: values.endDate,
    }).then((response) => {
      setEmployees(response);
    });
  };
  return (
    <div className="employee-container">
      <div className="d-flex justify-content-between">
        <div className="mt-20 plan-heading font-weight-500">Enrollment</div>
        <div className="mt-20">
          <Button
            type="button"
            className="add-btn"
            variant="primary"
            onClick={() => setModalOpen(true)}
          >
            Start Auto Enrollment
          </Button>
        </div>
      </div>
      <div className="line-separator" />
      <LoaderWrapper isLoading={isLoading}>
        {/* {!isEmpty(employees) && ( */}
        <div className="w-100">
          <p className="font-weight-500">Enrollment Summary Report</p>
          <Formik
            initialValues={{
              ...initialValues,
              ...getFlowBasedFormValues(get(state, formName, {}), flow),
              [fields.companyName]: null,
              [fields.planName]: null,
              [fields.startDate]: null,
              [fields.endDate]: null,
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
              setValues,
              values,
              ...rest
            }) => {
              const onDaySelected = (fieldName, value) => {
                setFieldValue(fieldName, value);
              };
              const onCompanyChange = (value, plan) => {
                console.log(value);
                setValues({
                  ...values,
                  [fields.companyId]:
                    value === null ? null : parseInt(companies[value].id),
                  [fields.companyName]:
                    value === null ? null : companies[value].name,
                });
              };

              console.log(values);
              return (
                <Form
                  autoComplete="off"
                  className="h-100"
                  onSubmit={handleSubmit}
                  validated={!isEmpty(rest.errors)}
                >
                  <div className="d-flex w-100">
                    <div className="d-flex  w-2">
                      <Field
                        label="company Name"
                        name={fields.companyName}
                        value={values[fields.companyName]}
                        direction="bottom"
                        placeholder="All"
                        size="md"
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
                    </div>

                    <div className="d-flex ml-2 border-cut">
                      <Field
                        label="Plan Name"
                        name={fields.planName}
                        value={values[fields.planName]}
                        direction="bottom"
                        size="md"
                        placeholder="All"
                        popupContent={
                          <SearchableList
                            label="Select Plan"
                            options={
                              planList && [
                                allOption,
                                ...planList.map((plan, index) => ({
                                  label: plan.planName,
                                  value: index,
                                })),
                              ]
                            }
                            onSelect={(value, ind) =>
                              setValues({
                                ...values,
                                planName:
                                  value || value === 0
                                    ? planList[value].planName
                                    : "All",
                                [fields.planId]:
                                  value || value === 0
                                    ? parseInt(planList[value].id)
                                    : null,
                              })
                            }
                            selectedValue={values[fields.planName]}
                          />
                        }
                        component={FieldDropSide}
                      />
                    </div>

                    <div className="d-flex ml-5 border-cut">
                      <Field
                        label="Process Date Range"
                        name={fields.startDate}
                        value={usDateFormat(values[fields.startDate])}
                        isDatePicker
                        isRequired
                        size="sm"
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
                    <div className="d-flex ml-5 border-cut">
                      <Field
                        label="Process Date Range"
                        name={fields.endDate}
                        value={usDateFormat(values[fields.endDate])}
                        isDatePicker
                        size="sm"
                        isRequired
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
                    <div
                      className="d-flex ml-3 border-cut"
                      style={{ marginTop: "30px" }}
                    >
                      <Button
                        onClick={() => onSearch(values)}
                        type="button"
                        className="ml-4 sort-button"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                  <SliderPanel
                    isOpen={isModalOpen}
                    size="35"
                    showCancel={false}
                  >
                    <div className="d-flex justify-content-between align-baseline">
                      <div></div>
                      <div className="d-flex">
                        <Button
                          variant="secondary"
                          onClick={() => setModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => onFormSubmit(values)}
                          className="ml-4"
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                    <div className="d-flex">
                      <p className="font-weight-500">
                        Start auto enrollment Process
                      </p>
                    </div>

                    <div className="d-flex  w-2">
                      <Field
                        label="company Name"
                        name={fields.companyName}
                        value={values[fields.companyName]}
                        direction="bottom"
                        placeholder=""
                        popupContent={
                          <SearchableList
                            label="Select Company"
                            options={
                              companies && [
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
                    </div>

                    <div className="d-flex">
                      <Field
                        label="Plan Name"
                        name={fields.planName}
                        value={values[fields.planName]}
                        direction="bottom"
                        placeholder=""
                        popupContent={
                          <SearchableList
                            label="Select Plan"
                            options={
                              planList && [
                                ...planList.map((plan, index) => ({
                                  label: plan.planName,
                                  value: index,
                                })),
                              ]
                            }
                            onSelect={(value, ind) =>
                              setValues({
                                ...values,
                                planName: planList[value].planName,
                                [fields.planId]: parseInt(planList[value].id),
                              })
                            }
                            selectedValue={values[fields.planName]}
                          />
                        }
                        component={FieldDropSide}
                      />
                    </div>
                  </SliderPanel>
                </Form>
              );
            }}
          </Formik>
          <div className="text-right records-text ft-14 mr-3"></div>
          <Table className="cspl-table">
            <Table.Thead>
              <Table.Tr>
                {columns.map((item, index) => {
                  return (
                    <Table.Th
                      key={index}
                      className={(item.className, "col-md-3")}
                    >
                      {item.label}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {employeesList &&
                employeesList.map((source, index) => {
                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        return (
                          <Table.Td
                            key={cellIndex}
                            className={(item.className, "col-md-3")}
                          >
                            {getData(item, source)}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
        </div>
        {/* )} */}
      </LoaderWrapper>
    </div>
  );
};

export default EnrollmentReportContainer;
