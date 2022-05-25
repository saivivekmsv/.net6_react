import React, { useContext } from "react";
import { Field, Formik } from "formik";
import { get } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";

import * as Yup from "yup";
import { ManageCompanyLayout, FieldButtonGroup } from "../../components";
import {
  manageCompanyStore,
  saveCompanyDetails,
  setManageCompanyToastInfo,
} from "../../contexts";
import { useRouterParams } from "../../abstracts";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  FLOW_TYPES,
  yesNoOptions,
  getAdvancedPathWithParam,
  getFlowBasedFormValues,
  returnOnlyIfBoolean,
} from "../../utils";

const modeOfHoursOptions = [
  {
    label: "Pay Period",
    value: 1,
  },
  {
    label: "Year To Date",
    value: 2,
  },
];

const modeOfCompensationOptions = [...modeOfHoursOptions];

const modeOfFundingOptions = [
  {
    label: "ACH Credit/Wire",
    value: 1,
  },
  {
    label: "Debit",
    value: 2,
  },
];

const schema = Yup.object().shape({});

const CompanySettingsContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(manageCompanyStore);
  const { companyId, flow } = useRouterParams();
  const formName = manageCompanyFormNames.SETTINGS_MANAGE_COMPANY;
  const fields = formFields[formName];

  const onFormSubmit = (values) => {
    saveCompanyDetails(
      {
        ...values,
      },
      dispatch,
      state
    ).then(() => {
      dispatch(
        setManageCompanyToastInfo({
          showToast: true,
          toastMessage: "Data saved successfully",
        })
      );
      history.push(
        getAdvancedPathWithParam({
          path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY,
          pathParam: [flow, companyId],
        })
      );
    });
  };

  const buttons = [
    {
      link: ROUTES.COMPANY,
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE, FLOW_TYPES.ADD],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: ROUTES.COMPANY,
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.SETTINGS,
            pathParam: [FLOW_TYPES.SAVE, companyId],
          })
        ),
    },
  ];
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;

  const formValues = getFlowBasedFormValues(get(state, formName, {}));
  return (
    <Formik
      initialValues={{
        [fields.modeOfHours]: get(formValues, fields.modeOfHours) || 1,
        [fields.modeOfCompensation]:
          get(formValues, fields.modeOfCompensation) || 1,
        [fields.isPayrollCalenderRequire]:
          get(formValues, fields.isPayrollCalenderRequire) || false,
        [fields.isFileGenerationRequire]:
          get(formValues, fields.isFileGenerationRequire) || false,
        [fields.modeOfFunding]: get(formValues, fields.modeOfFunding) || 2,
        [fields.isFileGenerationRequire]: true,
      }}
      validationSchema={schema}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={rest.submitCount > 0}
          >
            <ManageCompanyLayout buttons={buttons} pageFlow={flow}>
              <Row>
                <Col>
                  <Field
                    isRequired
                    name={fields.modeOfHours}
                    label="Mode of hours submission"
                    size="smdd"
                    options={modeOfHoursOptions}
                    selectedValue={values[fields.modeOfHours]}
                    onChange={(value) => {
                      setFieldValue(fields.modeOfHours, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />

                  <Field
                    isRequired
                    name={fields.modeOfCompensation}
                    label="Mode of compensation"
                    size="smdd"
                    options={modeOfCompensationOptions}
                    selectedValue={values[fields.modeOfCompensation]}
                    onChange={(value) => {
                      setFieldValue(fields.modeOfCompensation, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />

                  <Field
                    isRequired
                    name={fields.isPayrollCalenderRequire}
                    label="Payroll Calendar Required?"
                    size="sm"
                    options={yesNoOptions}
                    selectedValue={returnOnlyIfBoolean(
                      values[fields.isPayrollCalenderRequire]
                    )}
                    onChange={(value) => {
                      setFieldValue(fields.isPayrollCalenderRequire, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />

                  {/* <Field
                    isRequired
                    name={fields.isFileGenerationRequire}
                    label="Census and payroll file generation required?"
                    size="sm"
                    options={yesNoOptions}
                    selectedValue={returnOnlyIfBoolean(
                      values[fields.isFileGenerationRequire]
                    )}
                    onChange={(value) => {
                      setFieldValue(fields.isFileGenerationRequire, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  /> */}

                  <Field
                    isRequired
                    name={fields.modeOfFunding}
                    label="Mode of Funding"
                    options={modeOfFundingOptions}
                    selectedValue={values[fields.modeOfFunding]}
                    onChange={(value) => {
                      setFieldValue(fields.modeOfFunding, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />
                </Col>
              </Row>
            </ManageCompanyLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CompanySettingsContainer;
