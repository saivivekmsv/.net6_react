import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Formik, Field } from "formik";
import { DatePicker, SearchableList, FieldDropSide } from "../../../../shared/components";
import { Link } from "react-router-dom";
import {
  MANAGE_PAYROLL_ROUTES,
  managePayrollFormNames,
  formFields,
  getPathWithParam,
  getFlowBasedFormValues,
  usDateFormat,
  clearFieldValues,
  errors,
} from "../../../../shared/utils";
import {
  manageEligibilityStore,
  managePayrollStore,
  setManagePageLevelData,
} from "../../../contexts";

import { getCompaniesList, getPlanList } from "../../../services";
import { useRouterParams, useRequest, useDeepEffect } from "../../../../shared/abstracts";
import FileStatus from "../../../../shared/mocks/fileStatus.json";

const initialValues = {
  companyName: "All",
  planName: "All",
  rkPlanNumber: "All",
  fileStatus: 0,
};

const allOption = { label: "All", value: null };

const PayrollFilterCard = (props) => {
  const { setFieldValues, setLoading } = props;

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
          <form className="tile-with-border payroll-search-container">
            <fieldset>
              <legend>Payroll</legend>
              <Row>
                <Col md={3}>
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
                        options={FileStatus.data.map((value, index) => ({
                          label: value,
                          value: index,
                        }))}
                        onSelect={(value) =>
                          setFieldValue(fields.fileStatus, value)
                        }
                        selectedValue={
                          FileStatus.data[values[fields.fileStatus]]
                        }
                      />
                    }
                    component={FieldDropSide}
                  />
                </Col>
                <Col>
                  <div className="d-flex flex-row justify-content-start align-items-center">
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
          
                    <Button type="submit" className="ml-4 mt-2 btn-outline-primary"    variant="outline-primary">
                      Search
                    </Button>
                  </div>
                 

                </Col>

                <Col md={2} className="offset-1 d-flex flex-row align-items-center">

                  <Link to={MANAGE_PAYROLL_ROUTES.NEW_PAYROLL_UPLOAD}>
                    <Button className="btn btn-primary" variant="primary">New Payroll</Button>
                  </Link>

                </Col>
              </Row>
            </fieldset>
          </form>
        );
      }}
    </Formik>
  );
};

export default PayrollFilterCard;
