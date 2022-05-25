import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { isEmpty, get, parseInt } from "lodash";
import {
  AddPlans,
  LoaderWrapper,
  CsplTable as Table,
  FieldDropSide,
  FieldInput,
  SearchableList,
  AddButton,
} from "../../../../shared/components"
import { Button, Form } from "react-bootstrap";
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
} from "../../../../shared/utils"
import {
  getManageEmployeeMaster,
  getCompaniesList,
  getEmploymentStatusList,
  getPlanList,
  getMasterEmploymentStatuses,
} from "../../../services"
import { useRouterParams, useRequest, useDeepEffect } from "../../../../shared/abstracts"
import { Formik, Field } from "formik";
import { manageCensusStore, setManagePageLevelData } from "../../../contexts";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AddToolTip from "../../../../shared/components/AddToolTip";

const initialValues = {};

const columns = [
  {
    label: "Employee Name",
    className: "column-employeeName",
    columnName: "employeeName",
    link: `${ROUTES.MANAGE_CENSUS}/employee-information/edit`,
  },
  {
    label: "Employee ID",
    className: "column-employeeId",
    columnName: "employeeId",
  },
  {
    label: "Employee Status",
    className: "column-employeeStatus",
    columnName: "employmentStatus",
  },
  {
    label: "SSN",
    className: "column-ssn",
    columnName: "ssn",
  },
  {
    label: "Company",
    className: "column-company",
    columnName: "companyName",
  },
  {
    label: "Plans",
    className: "column-plan",
    columnName: "planNames",
  },
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

const allOption = { label: "All", value: null };

const ManageEmployeeContainer = () => {
  const { state, dispatch } = useContext(manageCensusStore);
  const { flow, censusId = 123 } = useRouterParams();
  const [isLoading, setIsLoading] = useState(false);
  const [employmentStatusList, setEmploymentStatusList] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [employeesList, setEmployees] = useState([]);
  const stringLimit = 12;

  const { response: companies } = useRequest({
    method: getCompaniesList,
    payload: 1, //TenantId, Hardcoding should be removed
    defaultResponse: [],
  });

  useDeepEffect(() => {
    getPlanList(0)
      .then((response) => setPlanList(response))
      .catch((error) => {});
    getMasterEmploymentStatuses(0)
      .then((response) => setEmploymentStatusList(response))
      .catch((error) => {});
  }, []);

  const { response: employees, loading } = useRequest({
    method: getManageEmployeeMaster,
    payload: {},
    defaultResponse: [],
  });

  useDeepEffect(() => setIsLoading(loading), [loading]);
  useDeepEffect(() => {
    setEmployees(employees);
  }, [employees]);

  const formName = manageCensusFormNames.CENSUS_FILTER;
  const fields = formFields[formName];
  // console.log('employeeList',employeesList)

  const onFormSubmit = (values) => {
    setIsLoading(true);
    getManageEmployeeMaster({
      planId: values.planId,
      companyId: values.companyId,
      masterEmploymentStatusId: values.employmentStatusId,
      searchBySSNEmpIdName: values.searchBySSNEmpIdName,
    })
      .then((response) => {
        setEmployees(response);
        setIsLoading(false);
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
      })
      .catch((error) => {
        //Handle Errors
      });
  };

  const onFilter = (values) => {
    // setIsLoading(true);
  };

  const getData = (item, source) => {
    let dataItem;
    if (!isEmpty(item.link)) {
      dataItem = (
        <Link
          to={getPathWithParam({
            path: item.link,
            pathParam: [flow, source.id],
          })}
        >
          {source[item.columnName]}
        </Link>
      );
      return <AddToolTip name={source[item.columnName]}>{dataItem}</AddToolTip>;
    } else if (item.columnName == "employmentStatus") {
      dataItem = source[item.columnName];
      return dataItem;
    } else if (item.dataMapper) {
      dataItem = item.dataMapper[source[item.columnName]];
    } else if (item.columnName == "ssn") {
      dataItem = ssnMasking(source[item.columnName]);
      return dataItem;
    } else if (item.columnName == "planNames") {
      dataItem = source[item.columnName].toString();
    } else {
      dataItem = source[item.columnName];
    }
    return <AddToolTip name={dataItem} />;
  };

  return (
    <div className="employee-container">
      <div className="d-flex justify-content-between">
        <div className="mt-20 plan-heading font-weight-500">
          Manage Employees
        </div>
        <div className="mt-20">
          <Link to={`${ROUTES.MANAGE_CENSUS}/employee-information`}>
            <AddButton />
          </Link>
        </div>
      </div>
      {!loading && isEmpty(employees) && (
        <AddPlans
          content={<>No Employees</>}
          buttonLabel="Add Employee"
          link={`${ROUTES.MANAGE_CENSUS}/employee-information`}
        />
      )}
      <LoaderWrapper isLoading={isLoading}>
        {!isEmpty(employees) && (
          <div className="w-100">
            <p className="font-weight-500">Employees</p>
            <Formik
              initialValues={{
                ...initialValues,
                ...getFlowBasedFormValues(get(state, formName, {}), flow),
                [fields.companyName]: "All",
                [fields.rKPlanNumber]: "All",
                [fields.planName]: "All",
                [fields.employmentStatusName]: "All",
                [fields.planSearchOption]: "Plan ID",
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
                const onCompanyChange = (value, plan) => {
                  setValues({
                    ...clearFieldValues({
                      values: values,
                      fieldsToExculde: [fields.searchBySSNEmpIdName],
                      fieldsToClear: plan
                        ? [
                            fields.rKPlanNumber,
                            fields.planId,
                            fields.planName,
                            fields.employmentStatusId,
                            fields.employmentStatusName,
                          ]
                        : [
                            fields.employmentStatusId,
                            fields.employmentStatusName,
                          ],
                    }),
                    [fields.companyId]:
                      value || value === 0
                        ? parseInt(companies[value].id)
                        : null,
                    [fields.companyName]:
                      value || value === 0 ? companies[value].name : "All",
                    [fields.rKPlanNumber]: plan ? plan.rkPlanNumber : null,
                    [fields.planId]: plan ? plan.id : null,
                    [fields.planName]: plan ? plan.name : null,
                    [fields.employmentStatusName]: "All",
                  });
                  setIsLoading(true);
                  getPlanList(get(companies[value], "id", 0))
                    .then((response) => {
                      setPlanList(response);
                      setIsLoading(false);
                    })
                    .catch((error) => {
                      //Handle Error
                      setIsLoading(false);
                    });
                  getMasterEmploymentStatuses(get(companies[value], "id", 0))
                    .then((response) => {
                      setEmploymentStatusList(response);
                    })
                    .catch((error) => {
                      //Handle Error
                    });
                };

                const onPlanChange = (value) => {
                  if (value || value === 0) {
                    setFieldValue(fields.planName, planList[value].name);
                    setFieldValue(fields.planId, parseInt(planList[value].id));
                    setFieldValue(
                      fields.rKPlanNumber,
                      planList[value].rkPlanNumber
                    );

                    if (
                      planList[value].companyId !== values[fields.companyId]
                    ) {
                      const requiredCompany = companies
                        .filter(
                          (val) =>
                            parseInt(val.id) === planList[value].companyId
                        )
                        .shift();
                      onCompanyChange(
                        companies.indexOf(requiredCompany),
                        planList[value]
                      );
                    }
                  } else {
                    setFieldValue(fields.planName, "All");
                    setFieldValue(fields.planId, null);
                    setFieldValue(fields.rKPlanNumber, "All");
                  }
                };

                return (
                  <Form
                    autoComplete="off"
                    className="h-100"
                    onSubmit={handleSubmit}
                    validated={!isEmpty(rest.errors)}
                  >
                    <div className="d-flex justify-content-between">
                      <Field
                        size="smd"
                        placeholder="Search"
                        name={fields.searchBySSNEmpIdName}
                        type="text"
                        autoComplete="off"
                        value={values[fields.searchBySSNEmpIdName]}
                        onChange={handleChange}
                        component={FieldInput}
                      />
                      <div className="d-flex ml-2 border-cut">
                        <label className="label-sort br-0">Company</label>
                        <Field
                          size="smd"
                          name={fields.companyName}
                          value={values[fields.companyName]}
                          direction="bottom"
                          placeholder="All"
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
                      <div className="d-flex ml-2 census-border-cut placeholder-color">
                        <div className="br-0">
                          <Field
                            size="sm"
                            name={fields.planSearchOption}
                            value={values[fields.planSearchOption]}
                            options={planSearchOptions}
                            direction="bottom"
                            placeholder="Plan ID"
                            popupContent={
                              <SearchableList
                                label="Select a Field"
                                isNotTypeAhead
                                isRadio
                                options={planSearchOptions}
                                onSelect={(value) => {
                                  setValues({
                                    ...clearFieldValues({
                                      values: values,
                                      fieldsToExculde: [
                                        fields.searchBySSNEmpIdName,
                                        fields.employmentStatusId,
                                        fields.employmentStatusName,
                                        fields.companyId,
                                        fields.companyName,
                                      ],
                                      fieldsToClear: [
                                        fields.rKPlanNumber,
                                        fields.planId,
                                        fields.planName,
                                      ],
                                    }),
                                    [fields.planSearchOption]: value,
                                  });
                                }}
                                selectedValue={values[fields.planSearchOption]}
                              />
                            }
                            component={FieldDropSide}
                          />
                        </div>
                        <div className="bl-0">
                          <Field
                            size="smd"
                            name={fields.planName}
                            value={
                              values[fields.planSearchOption] === 2
                                ? values[fields.planName]
                                : values[fields.rKPlanNumber]
                            }
                            direction="bottom"
                            placeholder="All"
                            popupContent={
                              <SearchableList
                                label="Select Plan"
                                options={
                                  planList && [
                                    allOption,
                                    ...(values[fields.planSearchOption] === 2
                                      ? planList.map((plan, index) => ({
                                          label: plan.name,
                                          value: index,
                                        }))
                                      : planList.map((plan, index) => ({
                                          label: plan.rkPlanNumber,
                                          value: index,
                                        }))),
                                  ]
                                }
                                onSelect={(value) => onPlanChange(value)}
                                selectedValue={
                                  values[fields.planSearchOption] === 2
                                    ? values[fields.planName]
                                    : values[fields.rKPlanNumber]
                                }
                              />
                            }
                            component={FieldDropSide}
                          />
                        </div>
                      </div>
                      <div className="d-flex ml-2 border-cut">
                        <label className="label-sort br-0">Status</label>
                        <Field
                          size="smd"
                          name={fields.employmentStatusId}
                          value={values[fields.employmentStatusName]}
                          direction="bottom"
                          popupContent={
                            <SearchableList
                              label="Select Status"
                              options={
                                employmentStatusList && [
                                  allOption,
                                  ...employmentStatusList.map(
                                    (status, index) => ({
                                      label: status.name,
                                      value: index,
                                    })
                                  ),
                                ]
                              }
                              onSelect={(value) => {
                                if (value || value === 0) {
                                  setFieldValue(
                                    fields.employmentStatusId,
                                    employmentStatusList[value].id
                                  );
                                  setFieldValue(
                                    fields.employmentStatusName,
                                    employmentStatusList[value].name
                                  );
                                } else {
                                  setFieldValue(
                                    fields.employmentStatusId,
                                    null
                                  );
                                  setFieldValue(
                                    fields.employmentStatusName,
                                    "All"
                                  );
                                }
                              }}
                              selectedValue={
                                values[fields.employmentStatusName]
                              }
                            />
                          }
                          component={FieldDropSide}
                        />
                        <div>
                          <Button
                            onClick={onFilter(values)}
                            type="submit"
                            className="ml-4 sort-button"
                          >
                            Search
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <div className="line-separator" />
            <div className="text-right records-text ft-14 mr-3">
              {employeesList.length} Employees
            </div>
            <Table className="cspl-table">
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
                {employeesList &&
                  employeesList.map((source, index) => {
                    return (
                      <Table.Tr key={index}>
                        {columns.map((item, cellIndex) => {
                          return (
                            <Table.Td
                              key={cellIndex}
                              className={item.className}
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
        )}
      </LoaderWrapper>
    </div>
  );
};

export default ManageEmployeeContainer;
