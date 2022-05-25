import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import { ManagePlanLayout, FieldButtonGroup } from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  yesNoOptions,
  required,
  getAdvancedPathWithParam,
  getPathWithParam,
} from "../../../utils";
import {
  createPlanStore,
  setManagePageLevelData,
  setManagePlanFlow,
  setManagePlanToastInfo,
  savePlanDetailsAction,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const RolloverContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, rolloverId } = useRouterParams();
  const [newFlow, setNewFlow] = useState("");
  const formName = managePlanFormNames.ADD_ROLLOVERS;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const rolloverData = get(apiData, "rollover", {});

  const buttons = [
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.ROLLOVER,
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
      onClick: () => {
        //setNewFlow(FLOW_TYPES.SAVE);
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ROLLOVER,
            pathParam: [FLOW_TYPES.SAVE, planId],
          })
        );
      },
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    let objectKeys = Object.keys(values);
    let requestObject = {};
    objectKeys.forEach((key) => {
      if (values[key] || values[key] === false) {
        requestObject[key] = values[key];
      }
    });
    savePlanDetailsAction(
      {
        rollover: { ...requestObject },
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
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `Data saved successfully`,
          })
        );
        //setNewFlow(FLOW_TYPES.EDIT);
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ROLLOVER,
            pathParam: [FLOW_TYPES.EDIT, planId],
          })
        );
      } else {
        setSubmitting(false);
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
    });
  };

  const initialValues = {
    [fields.rollOversAllowed]: false,
    [fields.rollOversAllowedPriorToEligibility]: false,
    [fields.rollOversAllowedPriorToDistribution]: false,
    [fields.rollOversAllowedPriorToLoans]: false,
  };
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...rolloverData,
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
              <Row>
                <Col>
                  <Field
                    isRequired
                    size="sm"
                    name={fields.rollOversAllowed}
                    label={"Rollovers allowed?"}
                    options={yesNoOptions}
                    selectedValue={values[fields.rollOversAllowed]}
                    value={values[fields.rollOversAllowed]}
                    onChange={(value) => {
                      setFieldValue(fields.rollOversAllowed, value);
                    }}
                    component={FieldButtonGroup}
                    validate={required}
                    disabled={isEdit && !isSave}
                  />
                </Col>
              </Row>

              {values[fields.rollOversAllowed] === true ? (
                <>
                  <Row>
                    <Col>
                      <Field
                        isRequired
                        size="sm"
                        name={fields.rollOversAllowedPriorToEligibility}
                        label={"Rollover prior to eligibility allowed?"}
                        options={yesNoOptions}
                        selectedValue={
                          values[fields.rollOversAllowedPriorToEligibility]
                        }
                        value={
                          values[fields.rollOversAllowedPriorToEligibility]
                        }
                        onChange={(value) => {
                          setFieldValue(
                            fields.rollOversAllowedPriorToEligibility,
                            value
                          );
                        }}
                        component={FieldButtonGroup}
                        validate={required}
                        disabled={isEdit && !isSave}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Field
                        isRequired
                        size="sm"
                        name={fields.rollOversAllowedPriorToDistribution}
                        label={"Distribution prior to eligibility allowed?"}
                        options={yesNoOptions}
                        selectedValue={
                          values[fields.rollOversAllowedPriorToDistribution]
                        }
                        value={
                          values[fields.rollOversAllowedPriorToDistribution]
                        }
                        onChange={(value) => {
                          setFieldValue(
                            fields.rollOversAllowedPriorToDistribution,
                            value
                          );
                        }}
                        component={FieldButtonGroup}
                        validate={required}
                        disabled={isEdit && !isSave}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Field
                        isRequired
                        size="sm"
                        name={fields.rollOversAllowedPriorToLoans}
                        label={"Loans prior to eligibility allowed?"}
                        options={yesNoOptions}
                        selectedValue={
                          values[fields.rollOversAllowedPriorToLoans]
                        }
                        value={values[fields.rollOversAllowedPriorToLoans]}
                        onChange={(value) => {
                          setFieldValue(
                            fields.rollOversAllowedPriorToLoans,
                            value
                          );
                        }}
                        component={FieldButtonGroup}
                        validate={required}
                        disabled={isEdit && !isSave}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RolloverContainer;
