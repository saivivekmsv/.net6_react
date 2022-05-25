import React, { useContext } from "react";
import { get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import { Formik, Field } from "formik";
import { FieldInputDollar, FieldInput } from "../../../../shared/components";
import {
  managePayrollFormNames,
  formFields,
  getFlowBasedFormValues,
  ssnMasking,
} from "../../../../shared/utils";
import { managePayrollStore, setManagePageLevelData } from "../../../../shared/contexts";
import { useRouterParams } from "../../../../shared/abstracts";

const initialValues = {};

const EditContribution = ({ data }) => {
  const { state, dispatch } = useContext(managePayrollStore);
  const { flow } = useRouterParams();
  const formName = managePayrollFormNames.EDIT_CONTRIBUTION;
  const fields = formFields[formName];
  const PayrollReport = get(data, [0]);

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
            <p className="mbbb-5 ft-12">{ssnMasking(PayrollReport.ssn)}</p>
            <p className="ft-12">{PayrollReport.employeeName}</p>
            <Field
              name={fields.afterTax}
              label={"After Tax"}
              type="text"
              autoComplete="off"
              value={PayrollReport.afterTax}
              onChange={handleChange}
              component={FieldInputDollar}
              disabled={true}
            />
            <Field
              name={fields.employerMatch}
              label={"Employer match"}
              type="text"
              autoComplete="off"
              value={PayrollReport.employerMatch}
              onChange={handleChange}
              component={FieldInputDollar}
              disabled={true}
            />
            <Field
              name={fields.nonElectiveContribution}
              label={"Non elective contribution"}
              type="text"
              autoComplete="off"
              value={PayrollReport.nonElectiveContribution}
              onChange={handleChange}
              component={FieldInputDollar}
              disabled={true}
            />
            <Field
              name={fields.preTax}
              label={"Pre Tax"}
              type="text"
              autoComplete="off"
              value={PayrollReport.preTax}
              onChange={handleChange}
              component={FieldInputDollar}
              disabled={true}
            />
            <Field
              name={fields.roth}
              label={"ROTH"}
              type="text"
              autoComplete="off"
              value={PayrollReport.roth}
              onChange={handleChange}
              component={FieldInputDollar}
              disabled={true}
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
                  value={PayrollReport.payPeriodHours}
                  onChange={handleChange}
                  component={FieldInput}
                  disabled={true}
                />
              </div>
              <div style={{ marginLeft: "-3.5rem" }}>
                <Field
                  name={fields.Compensation}
                  label=""
                  type="text"
                  autoComplete="off"
                  value={PayrollReport.Compensation}
                  onChange={handleChange}
                  component={FieldInputDollar}
                  disabled={true}
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
              value={PayrollReport.loanRepayment}
              onChange={handleChange}
              component={FieldInputDollar}
              disabled={true}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditContribution;
