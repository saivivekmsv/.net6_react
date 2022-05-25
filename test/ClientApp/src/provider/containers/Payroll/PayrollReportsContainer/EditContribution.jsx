import React, { useContext } from "react";
import { get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import { Formik, Field } from "formik";
import { FieldInputDollar, FieldInput } from "../../../components";
import {
  managePayrollFormNames,
  formFields,
  getFlowBasedFormValues,
  ssnMasking,
} from "../../../utils";
import { managePayrollStore, setManagePageLevelData } from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const initialValues = {};

const EditContribution = ({ PayrollReport, ssn, name }) => {
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
            <p className="mbbb-5 ft-12">{ssn ? ssnMasking(ssn) : null}</p>
            <p className="ft-12">{name}</p>
            <Field
              name={fields.planName}
              label="Plan Name"
              type="text"
              isRequired
              autoComplete="off"
              value={PayrollReport.planName}
              onChange={handleChange}
              component={FieldInput}
              disabled={true}
            />
            {PayrollReport &&
              PayrollReport.sourceTransactions?.map((item, index) => (
                <Field
                  name={fields.item}
                  label={item.name}
                  type="text"
                  autoComplete="off"
                  value={item.amount}
                  onChange={handleChange}
                  component={FieldInputDollar}
                  disabled={true}
                  isRequired
                />
              ))}

            {PayrollReport.payperiodHours ? (
              <div className="d-flex">
                <div>
                  <Field
                    size="sm"
                    name={fields.payperiodHours}
                    label={"Pay period hours & compensation"}
                    type="text"
                    placeholder="Hrs"
                    autoComplete="off"
                    value={PayrollReport.payperiodHours + " Hrs"}
                    onChange={handleChange}
                    component={FieldInput}
                    disabled={true}
                    isRequired
                  />
                </div>
                <div style={{ marginLeft: "-3.5rem" }}>
                  <Field
                    name={fields.payperiodAmount}
                    label=""
                    type="text"
                    autoComplete="off"
                    value={PayrollReport.payperiodAmount}
                    onChange={handleChange}
                    component={FieldInputDollar}
                    disabled={true}
                    isRequired
                  />
                </div>
              </div>
            ) : null}

            {PayrollReport.ytdHours ? (
              <div>
                <p className="ft-12">YTD hours & compensation</p>
                <p className="ft-12">
                  <span className="mr-2 br-1">
                    {PayrollReport.ytdHours} Hrs
                  </span>
                  <span>$ {PayrollReport.ytdAmount}</span>
                </p>
              </div>
            ) : null}

            {PayrollReport &&
              PayrollReport.loanTransactions?.map((item, index) => (
                <Field
                  name={fields.loanRepayment}
                  label={"Loan Repayment - " + item.name}
                  type="text"
                  autoComplete="off"
                  value={item.amount}
                  onChange={handleChange}
                  component={FieldInputDollar}
                  disabled={true}
                  isRequired
                />
              ))}
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditContribution;
