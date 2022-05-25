import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Form, Button } from "react-bootstrap";
import { Formik, Field } from "formik";
import { DatePicker, SearchableList, FieldDropSide } from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  MANAGE_PAYROLL_ROUTES,
  managePayrollFormNames,
  formFields,
  getPathWithParam,
  getFlowBasedFormValues,
  usDateFormat,
  clearFieldValues,
  toOptionValuesFromMapper,
  errors,
} from "../../../utils";
import {
  manageEligibilityStore,
  managePayrollStore,
  setManagePageLevelData,
} from "../../../contexts";

import { getCompaniesList, getPlanList } from "../../../services";
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";
import FileStatus from "../../../mocks/fileStatus.json";
var today = new Date();
const initialValues = {
  companyName: "All",
  planName: "All",
  rkPlanNumber: "All",
  fileStatus: 0,
  fromDate: new Date(today.setDate(today.getDate() - 60)),
  toDate: new Date(),
};

const allOption = { label: "All", value: null };

const PayrollFilterCard = (props) => {
  const { setFieldValues, setLoading, pageRefresh } = props;
  const { state, dispatch } = useContext(manageEligibilityStore);
  const { flow } = useRouterParams();
  const formName = managePayrollFormNames.PAYROLL_FILTER;
  const fields = formFields[formName];
  const [planList, setPlanList] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);

  const { response: companies, loading: companyLoading } = useRequest({
    method: getCompaniesList,
    payload: 1, //TenantId, Hardcoding should be removed
    defaultResponse: [],
  });

  useDeepEffect(() => {
    setPlanLoading(true);
    getPlanList(0)
      .then((response) => {
        setPlanList(response);
        setPlanLoading(false);
      })
      .catch((error) => {
        setPlanLoading(false);
      });
  }, []);

  useDeepEffect(() => {
    setLoading(companyLoading || planLoading);
  }, [companyLoading, planLoading]);

  const onSubmit = (values, { setFieldError }) => {
    if (
      Date.parse(values[fields.fromDate]) > Date.parse(values[fields.toDate])
    ) {
      setFieldError(
        fields.toDate,
        errors.payrollFilterDateOverlap.overlapError
      );
    } else {
      setFieldValues(values);
    }
    pageRefresh();
  };
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...getFlowBasedFormValues(get(state, formName, {}), flow),
      }}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        setFieldError,
        handleSubmit,
        setValues,
        values,
        ...rest
      }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };

        const onCompanyChange = (value, plan) => {
          setValues({
            ...clearFieldValues({
              values: values,
              fieldsToExculde: [
                fields.fromDate,
                fields.toDate,
                fields.fileStatus,
              ],
              fieldsToClear: plan
                ? [fields.rkPlanNumber, fields.planId, fields.planName]
                : [],
            }),
            [fields.companyId]:
              value || value === 0 ? parseInt(companies[value].id) : null,
            [fields.companyName]:
              value || value === 0 ? companies[value].name : "All",
            [fields.rkPlanNumber]: plan ? plan.rkPlanNumber : "All",
            [fields.planId]: plan ? plan.id : null,
            [fields.planName]: plan ? plan.name : "All",
          });
          setPlanLoading(true);
          getPlanList(get(companies[value], "id", 0))
            .then((response) => {
              setPlanList(response);
              setPlanLoading(false);
            })
            .catch((error) => {
              setPlanLoading(false);
              //Handle Error
            });
        };

        const onPlanChange = (value) => {
          if (value || value === 0) {
            setFieldValue(fields.planName, planList[value].name);
            setFieldValue(fields.planId, parseInt(planList[value].id));
            setFieldValue(fields.rkPlanNumber, planList[value].rkPlanNumber);

            if (planList[value].companyId !== values[fields.companyId]) {
              const requiredCompany = companies
                .filter((val) => parseInt(val.id) === planList[value].companyId)
                .shift();
              onCompanyChange(
                companies.indexOf(requiredCompany),
                planList[value]
              );
            }
          } else {
            setFieldValue(fields.planName, "All");
            setFieldValue(fields.planId, null);
            setFieldValue(fields.rkPlanNumber, "All");
          }
        };

        return (
          <Form
            autoComplete="off"
            className="mb-20 mt-10"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <div className="d-flex align-item-center pad-50-right justify-content-between">
              <div className="d-flex">
                <Field
                  size="smdd"
                  isRequired
                  label="Company name"
                  name={fields.companyName}
                  value={values[fields.companyName]}
                  placeholder="All"
                  direction="bottom"
                  popupContent={
                    <SearchableList
                      label="Select Company"
                      options={[
                        allOption,
                        ...companies.map((company, index) => ({
                          label: company.name,
                          value: index,
                        })),
                      ]}
                      onSelect={(value) => onCompanyChange(value, null)}
                      selectedValue={values[fields.companyName]}
                    />
                  }
                  component={FieldDropSide}
                />
                <div className="d-flex ml-2">
                  <Field
                    size="smdd"
                    label="Plan name"
                    isRequired
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
                </div>
                <div className="d-flex ml-1">
                  <Field
                    size="smdd"
                    label="Plan ID"
                    isRequired
                    noLabelTransform
                    name={fields.rkPlanNumber}
                    value={values[fields.rkPlanNumber]}
                    direction="bottom"
                    popupContent={
                      <SearchableList
                        label="Select Plan ID"
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
                </div>
                <div className="d-flex ml-2">
                  <Field
                    size="smdd"
                    isRequired
                    label="File status"
                    placeholder="All"
                    name={fields.fileStatus}
                    value={FileStatus.data[values[fields.fileStatus]]}
                    direction="bottom"
                    popupContent={
                      <SearchableList
                        label="Select Status"
                        options={toOptionValuesFromMapper(
                          OPTIONS_DATA_MAPPER.PAYROLL_FILE_STATUS_DATA
                        )}
                        onSelect={(value) => {
                          console.log("gg", value);
                          setFieldValue(fields.fileStatus, value);
                        }}
                        selectedValue={
                          FileStatus.data[values[fields.fileStatus]]
                        }
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
                <div className="d-flex ml-2 br-0">
                  <Field
                    size="sm"
                    isRequired
                    label="Date range"
                    name={fields.fromDate}
                    value={usDateFormat(values[fields.fromDate])}
                    isDatePicker
                    placeholder="From date"
                    direction="bottom"
                    onClear={() => onDaySelected(fields.fromDate, "")}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.fromDate, value)
                        }
                        value={values[fields.fromDate]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
                <div className="d-flex bl-0">
                  <Field
                    size="sm"
                    label=""
                    name={fields.toDate}
                    isRequired
                    placeholder="To date"
                    value={usDateFormat(values[fields.toDate])}
                    direction="bottom"
                    isDatePicker
                    onClear={() => {
                      onDaySelected(fields.toDate, "");
                      onDaySelected(fields.fromDate, "");
                    }}
                    onDefaultClearDisplay={values[fields.fromDate]}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.toDate, value)
                        }
                        value={values[fields.toDate]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
              </div>
              <Button
                className="ml-2 mt-12 sort-button"
                style={{ lineHeight: "19px" }}
                variant="secondary"
                type="submit"
              >
                Search
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PayrollFilterCard;
