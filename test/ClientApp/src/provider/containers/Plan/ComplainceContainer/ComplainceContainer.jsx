import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  SearchableList,
  DayDropdown,
  FieldDropSide,
  FieldButtonGroup,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  yesNoOptions,
  required,
  getAdvancedPathWithParam,
} from "../../../utils";
import {
  createPlanStore,
  setManagePageLevelData,
  setManagePlanFlow,
  setManagePlanToastInfo,
  savePlanDetailsAction,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";
import months from "../../../mocks/months.json";

const testingType = [
  {
    label: "ACP Testing",
    value: 1,
  },
  {
    label: "ADP Testing",
    value: 2,
  },
  {
    label: "Coverage",
    value: 3,
  },
  {
    label: "Top heavy",
    value: 4,
  },
];

const testingMethod = [
  {
    label: "Current Year",
    value: 1,
  },
  {
    label: "Prior Year",
    value: 2,
  },
];

const ComplainceContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const { planId, flow } = useRouterParams();
  const formName = managePlanFormNames.ADD_COMPLAINCE;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const complianceData = get(apiData, "compliance", {});
  const initialValues = {
    testingType: 0,
    testingMethod: 0,
    [fields.hceIndicator]: false,
    [fields.qmac]: false,
    [fields.qnec]: false,
    [fields.safeHarbourIndicator]: false,
    documents: [],
  };
  const buttons = [
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.COMPLAINCE,
        pathParam: [FLOW_TYPES.EDIT, planId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: ROUTES.PLAN,
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
            path: MANAGE_PLAN_ROUTES.COMPLAINCE,
            pathParam: [FLOW_TYPES.SAVE, planId],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    console.log("required");
    const { day, month, ...rest } = values;
    const form5500DueDate = {
      month,
      day,
    };
    savePlanDetailsAction(
      {
        compliance: {
          ...rest,
          form5500DueDate,
        },
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        const newPlanId = get(response, "plan.id");
        dispatch(
          setManagePlanFlow({
            planId: newPlanId,
          })
        );
        dispatch(
          setManagePlanFlow({
            planId: newPlanId,
          })
        );
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.COMPLAINCE,
            pathParam: [FLOW_TYPES.EDIT, newPlanId],
          })
        );
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
      } else {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
    });
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...complianceData,
        day: get(complianceData, "form5500DueDate.day", 1),
        month: get(complianceData, "form5500DueDate.month", 1),
      }}
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
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <Field
                isRequired
                size="xl"
                name={fields.testingType}
                label={"Required Complaince testing type"}
                options={testingType}
                selectedValue={values[fields.testingType]}
                value={values[fields.testingType]}
                onChange={(value) => {
                  setFieldValue(fields.testingType, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                name={fields.testingMethod}
                label={"Testing Method"}
                options={testingMethod}
                selectedValue={values[fields.testingMethod]}
                value={values[fields.testingMethod]}
                onChange={(value) => {
                  setFieldValue(fields.testingMethod, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.hceIndicator}
                label={"HCE defined?"}
                options={yesNoOptions}
                selectedValue={values[fields.hceIndicator]}
                value={values[fields.hceIndicator]}
                onChange={(value) => {
                  setFieldValue(fields.hceIndicator, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.qmac}
                label={"QMAC"}
                options={yesNoOptions}
                selectedValue={values[fields.qmac]}
                value={values[fields.qmac]}
                onChange={(value) => {
                  setFieldValue(fields.qmac, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.qnec}
                label={"QNEC"}
                options={yesNoOptions}
                selectedValue={values[fields.qnec]}
                value={values[fields.qnec]}
                onChange={(value) => {
                  setFieldValue(fields.qnec, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.safeHarbourIndicator}
                label={"Safe harbour"}
                options={yesNoOptions}
                selectedValue={values[fields.safeHarbourIndicator]}
                value={values[fields.safeHarbourIndicator]}
                onChange={(value) => {
                  setFieldValue(fields.safeHarbourIndicator, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />

              <div className="d-flex">
                <Field
                  size="sm"
                  label="Filing due date for Form 5500"
                  isRequired
                  name={fields.month}
                  value={values[fields.month]}
                  disabled={isEdit && !isSave}
                  placeholder="Month"
                  options={months.data}
                  popupContent={
                    <SearchableList
                      label="Select a month"
                      isNotTypeAhead
                      options={months.data}
                      onSelect={(value) => setFieldValue(fields.month, value)}
                      selectedValue={values[fields.month]}
                    />
                  }
                  component={FieldDropSide}
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "-3rem",
                  }}
                >
                  <Field
                    size="xxs"
                    name={fields.day}
                    label=""
                    value={values[fields.day]}
                    disabled={isEdit && !isSave}
                    placeholder="Date"
                    popupContent={
                      <DayDropdown
                        fromMonthDate={
                          new Date(2020, values[fields.month] - 1 || 0)
                        }
                        onSelect={(value) => setFieldValue(fields.day, value)}
                        value={values[fields.day]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
              </div>
              <Row className="mt-20">
                <Col md="3">
                  <p className="form-label-text">Summary Plan Description</p>
                </Col>
                <Col md="1">
                  <button className="btn-primary-view" disabled>
                    VIEW
                  </button>
                </Col>
              </Row>
              <Row className="mt-20">
                <Col md="3">
                  <p className="form-label-text">Plan Legal Document </p>
                </Col>
                <Col md="1">
                  <button className="btn-primary-view" disabled>
                    VIEW
                  </button>
                </Col>
              </Row>
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ComplainceContainer;
