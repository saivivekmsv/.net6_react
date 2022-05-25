import { Field, useFormikContext, FieldArray } from "formik";
import { get } from "lodash";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useDeepEffect, useRequest } from "../../../../shared/abstracts";
import {
  FieldSingleButton,
  FieldInput,
  FieldInputDollar,
} from "../../../../shared/components";
import {
  checkRkPlanNumberExists,
  getPayrollFrequencies,
} from "../../../services";
import { usDateFormat } from "../../../../shared/utils"
import PayrollCompensationDetails from "./PayrollCompensationDetails";
import PayrollContributionDetails from "./PayrollContributionDetails";
import PayrollErrorReport from "./PayrollErrorReport";
import PayrollLoanDetails from "./PayrollLoanDetails";

const PayrollFormDetails = ({ fields, data }) => {
  const formProps = useFormikContext();
  const { values, setFieldValue, setFieldError } = formProps;
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
        <Form.Group>
          <Form.Label>Annual salary</Form.Label>
          <div className="ft-14 font-weight-500">
            <Field
              size="xs"
              name={fields.annualSalary}
              type="text"
              autoComplete="off"
              disabled={true}
              value={parseFloat(values[fields.annualSalary])}
              component={FieldInputDollar}
            />
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Pay period hours</Form.Label>
          <div className="ft-14 font-weight-500">
            <Field
              size="xs"
              name="payPeriodHours"
              type="text"
              autoComplete="off"
              disabled={values[fields.modeOfHours] != 1}
              value={values.hoursDetails[0].payPeriodHours}
              component={FieldInput}
            />
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Calendar YTD hours</Form.Label>
          <div className="ft-14 font-weight-500">
            <Field
              size="xs"
              name="ytdHours"
              type="text"
              autoComplete="off"
              disabled={values[fields.modeOfHours] == 1}
              value={values.hoursDetails[0].ytdHours}
              component={FieldInput}
            />
          </div>
        </Form.Group>
        <p className="plan-sub-heading mtb5">Plan ID</p>
        <Field
          isRequired
          size="xs"
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
          data={get(data, "compensations", [])}
        />

        <PayrollContributionDetails
          fields={fields}
          data={get(data, "contributions", [])}
        />
        <PayrollLoanDetails
          fields={fields}
          data={get(data, "loanDetails", [])}
        />
        <PayrollErrorReport
          fields={fields}
          data={get(data, "errorReport", [])}
        />
      </div>
    </div>
  );
};

export default PayrollFormDetails;
