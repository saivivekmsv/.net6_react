import React, { useContext, useEffect } from "react";
import { get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import { Formik, Field, FieldArray } from "formik";
import { FieldInputDollar, FieldInput } from "../../../components";
import {
  managePayrollFormNames,
  formFields,
  getFlowBasedFormValues,
} from "../../../utils";
import { managePayrollStore, setManagePageLevelData } from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const initialValues = {};

const EditContribution = (props) => {
  const { data } = props;
  const { state, dispatch } = useContext(managePayrollStore);
  const { flow } = useRouterParams();
  const formName = managePayrollFormNames.EDIT_CONTRIBUTION;
  const fields = formFields[formName];

  const onSubmit = (values) => {
    dispatch(
      setManagePageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
  };
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...getFlowBasedFormValues(get(state, formName, {}), flow),
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
        return (
          <Form
            autoComplete="off"
            className="mb-20"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <Field
              name={fields.afterTax}
              label={"After Tax"}
              type="text"
              autoComplete="off"
              value={values[fields.afterTax]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
            <Field
              name={fields.employerMatch}
              label={"Employer match"}
              type="text"
              autoComplete="off"
              value={values[fields.employerMatch]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
            <Field
              name={fields.nonElectiveContribution}
              label={"Non elective contribution"}
              type="text"
              autoComplete="off"
              value={values[fields.nonElectiveContribution]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
            <Field
              name={fields.preTax}
              label={"Pre Tax"}
              type="text"
              autoComplete="off"
              value={values[fields.preTax]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
            <Field
              name={fields.roth}
              label={"ROTH"}
              type="text"
              autoComplete="off"
              value={values[fields.roth]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
            <div className="d-flex">
              <div>
                <Field
                  size="sm"
                  name={fields.payPeriodHours}
                  label={"Pay period hours & compensation"}
                  type="text"
                  placeholder="Hrs"
                  autoComplete="off"
                  value={values[fields.payPeriodHours]}
                  onChange={handleChange}
                  component={FieldInput}
                />
              </div>
              <div className="mlres">
                <Field
                  name={fields.Compensation}
                  label=""
                  type="text"
                  autoComplete="off"
                  value={values[fields.Compensation]}
                  onChange={handleChange}
                  component={FieldInputDollar}
                />
              </div>
            </div>
            <p className="ft-12">YTD hours & compensation</p>
            <p className="ft-12">
              <span className="mr-2 br-1">36 Hrs</span>
              <span>$ 200.00</span>
            </p>
            <Field
              name={fields.loanRepayment}
              label={"Loan repayment 01"}
              type="text"
              autoComplete="off"
              value={values[fields.loanRepayment]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
            <Field
              name={fields.loanRepayment}
              label={"Loan repayment 02"}
              type="text"
              autoComplete="off"
              value={values[fields.loanRepayment]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
            <Field
              name={fields.loanRepayment}
              label={"Loan repayment 03"}
              type="text"
              autoComplete="off"
              value={values[fields.loanRepayment]}
              onChange={handleChange}
              component={FieldInputDollar}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditContribution;
