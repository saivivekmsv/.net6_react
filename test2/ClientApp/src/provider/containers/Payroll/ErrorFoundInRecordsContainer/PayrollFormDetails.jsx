import { Field, useFormikContext, FieldArray } from "formik";
import { get, isEmpty } from "lodash";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useDeepEffect, useRequest } from "../../../abstracts";
import {
  FieldSingleButton,
  FieldInput,
  FieldInputDollar,
  FieldInputDecimal,
} from "../../../components";
import {
  checkRkPlanNumberExists,
  getPayrollFrequencies,
} from "../../../services";
import { usDateFormat } from "../../../utils";
import PayrollCompensationDetails from "./PayrollCompensationDetails";
import PayrollContributionDetails from "./PayrollContributionDetails";
import PayrollErrorReport from "./PayrollErrorReport";
import PayrollLoanDetails from "./PayrollLoanDetails";

const PayrollFormDetails = ({
  fields,
  data,
  pendingSubmission,
  setId,
  errors,
  setError,
  setHoursErrorId,
}) => {
  const formProps = useFormikContext();
  const { values, setFieldValue, setFieldError, handleChange } = formProps;
  const [plans, setPlans] = useState([]);

  useDeepEffect(() => {
    const contributionPlans = get(data, "contributions", []).map(
      (contribution) => contribution.rkPlanNumber
    );
    console.log(data);
    setPlans(
      contributionPlans.filter(
        (item, i, contributionPlans) => contributionPlans.indexOf(item) === i
      )
    );

    // data.compensation?.errorMessages?.forEach(_=> {
    //   setFieldError(_.controlName, _.messageCode)
    // })
  }, [data]);

  const [frequencyList, setFrequencyList] = useState([]);
  useEffect(() => {
    getPayrollFrequencies(values[fields.companyId]).then((response) => {
      setFrequencyList(response);
      console.log(response);
    });
  }, []);

  const payrollFrequecy = frequencyList.filter((_) => {
    return _.id === data.payrollFrequencyId;
  });

  const errorPayPeriod = errors.filter(
    (_) => _.controlName == "payPeriodHours"
  );

  const errorYtd = errors.filter((_) => _.controlName == "ytdHours");

  //console.log(values[fields.payPeriodHours])
  return (
    <div className="d-flex column-scroll">
      <div className="w-100">
        <div className="plan-sub-heading">Employee details</div>
        <Form.Group>
          <Form.Label>Employee Name</Form.Label>
          <div className="ft-14 font-weight-500">
            {get(data, "firstName", "") +
              " " +
              get(data, "middleName", "") +
              " " +
              get(data, "lastName", "")}
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Employee ID</Form.Label>
          <div className="ft-14 font-weight-500">
            {data.employeeNumber ? data.employeeNumber : "NA"}
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Employee status</Form.Label>
          <div className="ft-14 font-weight-500">
            {data.employmentStatus ? data.employmentStatus : "NA"}
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Most recent term date</Form.Label>
          <div className="ft-14 font-weight-500">
            {data.terminationDate ? usDateFormat(data.terminationDate) : "NA"}
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Payroll frequency</Form.Label>
          {payrollFrequecy && payrollFrequecy[0] ? (
            <div className="ft-14 font-weight-500">
              {payrollFrequecy[0].name}
            </div>
          ) : (
            <div className="ft-14 font-weight-500">{"NA"}</div>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Highly compensated</Form.Label>
          <div className="ft-14 font-weight-500">
            {data.hce === "Y" ? "Yes" : "No"}
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Hire date</Form.Label>
          <div className="ft-14 font-weight-500">
            {data.hireDate ? usDateFormat(data.hireDate) : "NA"}
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Most recent rehire date</Form.Label>
          <div className="ft-14 font-weight-500">
            {data.reHireDate ? usDateFormat(data.reHireDate) : "NA"}
          </div>
        </Form.Group>
        <Field
          size="xs"
          name={fields.annualSalary}
          type="text"
          autoComplete="off"
          label="Annual Salary"
          disabled={true || pendingSubmission}
          value={parseFloat(values[fields.annualSalary])}
          component={FieldInputDollar}
        />

        <FieldArray name={fields.hoursDetails}>
          {() => {
            return (
              <>
                <Field
                  size="xs"
                  name={"hoursDetails[0].payPeriodHours"}
                  autoComplete="off"
                  label="Pay Period Hours"
                  noLabelTransform={true}
                  onChange={handleChange}
                  disabled={
                    values[fields.modeOfHours] != 1 || pendingSubmission
                  }
                  errorId={!isEmpty(errorPayPeriod) && errorPayPeriod[0].id}
                  setErrorId={setHoursErrorId}
                  hide={
                    values[fields.modeOfHours] == 1 && !isEmpty(errorPayPeriod)
                  }
                  max={9999}
                  component={FieldInputDecimal}
                />
                <Field
                  size="xs"
                  name={"hoursDetails[0].ytdHours"}
                  label="YTD Hours"
                  noLabelTransform={true}
                  autoComplete="off"
                  onChange={handleChange}
                  disabled={
                    values[fields.modeOfHours] == 1 || pendingSubmission
                  }
                  errorId={!isEmpty(errorYtd) && errorYtd[0].id}
                  setErrorId={setHoursErrorId}
                  hide={values[fields.modeOfHours] != 1 && !isEmpty(errorYtd)}
                  max={9999}
                  component={FieldInputDecimal}
                />
              </>
            );
          }}
        </FieldArray>

        <p className="plan-sub-heading mtb5">Plan ID</p>
        <Field
          isRequired
          size="xs"
          disabled={pendingSubmission}
          name={fields.planId}
          noLabelTransform
          options={plans.map((plan) => ({
            label: plan,
            value: plan,
          }))}
          selectedValue={values[fields.planId]}
          value={values[fields.planId]}
          onChange={(value) => {
            setFieldValue(fields.planId, value);
          }}
          component={FieldSingleButton}
        />

        <PayrollCompensationDetails
          fields={fields}
          pendingSubmission={pendingSubmission}
          data={get(data, "compensations", [])}
          error={errors}
          compensationError={setError}
        />

        <PayrollContributionDetails
          fields={fields}
          pendingSubmission={pendingSubmission}
          data={get(data, "contributions", [])}
          contributionId={setId}
        />
        <PayrollLoanDetails
          fields={fields}
          data={get(data, "loanDetails", [])}
        />
        <PayrollErrorReport
          fields={fields}
          pendingSubmission={pendingSubmission}
          data={get(data, "payrollLoans", [])}
        />
      </div>
    </div>
  );
};

export default PayrollFormDetails;
