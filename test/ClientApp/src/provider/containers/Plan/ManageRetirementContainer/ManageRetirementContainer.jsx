import React, { useContext } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Formik, Field } from "formik";
import {
  faPencilAlt,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { get } from "lodash";
import {
  ManagePlanLayout,
  FieldButtonGroup,
  SearchableList,
  FieldDropSide,
  FieldInputNumber,
} from "../../../components";
import {
  FLOW_TYPES,
  getPathWithParam,
  managePlanFormNames,
  formFields,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  ROUTES,
  MANAGE_PLAN_ROUTES,
  clearFieldValues,
  getAdvancedPathWithParam,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  setManagePlanFlow,
  setManagePageLevelData,
  savePlanDetailsAction,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const initialValues = {};

const ManageRetirementContainer = (props) => {
  const { history } = props;
  const { flow, planId, fundId } = useRouterParams();
  const { state, dispatch } = useContext(createPlanStore);
  const formName = managePlanFormNames.MANAGE_RETIREMENT;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const retirementData = get(apiData, "retirement", {});

  const goBack = () => {
    history.push(
      getPathWithParam({
        path: ROUTES.PLAN,
      })
    );
  };

  const onDeleteClick = () => {
    goBack();
  };

  const buttons = [
    {
      onClick: goBack,
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      onClick: goBack,
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () => {
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_RETIREMENT,
            pathParam: [planId],
          })
        );
      },
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
      onClick: onDeleteClick,
    },
  ];

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    let objectKeys = Object.keys(values);
    let requestObject = {};
    objectKeys.forEach((key) => {
      if (values[key]) {
        requestObject[key] = values[key];
      }
    });
    savePlanDetailsAction(
      {
        retirement: {
          ...requestObject,
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
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_RETIREMENT,
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
        setSubmitting(false);
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, _.message);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      }
    });
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  const layoutHeader = fundId && "Funding";
  return (
    <Formik
      initialValues={{
        ...initialValues,
        [fields.normalRetirement]: 1,
        [fields.earlyRetirement]: 1,
        ...retirementData,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const {
          setFieldValue,
          values,
          handleChange,
          handleSubmit,
          setValues,
          setTouched,
          setSubmitting,
          ...rest
        } = formProps;

        const handleEarlyRetirementTypeChange = (value) => {
          setValues({
            ...clearFieldValues({
              values,
              fieldsToClear: [fields.earlyServiceYears],
            }),
            [fields.earlyRetirement]: value,
          });
          setTouched({
            [fields.earlyServiceYears]: false,
          });
        };

        const handleNormalRetirementTypeChange = (value) => {
          setValues({
            ...clearFieldValues({
              values,
              fieldsToClear: [fields.normalServiceYears],
            }),
            [fields.normalRetirement]: value,
          });
          setTouched({
            [fields.normalServiceYears]: false,
          });
        };
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={rest.submitCount > 0}
          >
            <ManagePlanLayout
              layoutHeader={layoutHeader}
              buttons={buttons}
              pageFlow={flow}
            >
              <Row>
                <Col>
                  <Field
                    label="Early Retirement"
                    name={fields.earlyRetirement}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.RETIREMENT_TYPE
                    )}
                    selectedValue={values[fields.earlyRetirement]}
                    onChange={handleEarlyRetirementTypeChange}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                    size="lg"
                    isRequired
                  />
                  <div className="d-flex">
                    <Field
                      label="Age (years, months)"
                      name={fields.earlyAgeYears}
                      type="number"
                      autoComplete="off"
                      value={values[fields.earlyAgeYears]}
                      onChange={handleChange}
                      component={FieldInputNumber}
                      disabled={isEdit && !isSave}
                      size="xxs"
                      hasSuggestion
                      suggestionDefaultText="years"
                      shouldDisplaySuggestion
                      min={0}
                      max={999}
                      isRequired
                    />
                    <Field
                      label=" "
                      name={fields.earlyAgeMonths}
                      type="number"
                      autoComplete="off"
                      value={values[fields.earlyAgeMonths]}
                      onChange={handleChange}
                      component={FieldInputNumber}
                      disabled={isEdit && !isSave}
                      size="xxs"
                      hasSuggestion
                      suggestionDefaultText="months"
                      shouldDisplaySuggestion
                      min={0}
                      max={99}
                      isRequired
                    />
                  </div>
                  {[2].includes(values[fields.earlyRetirement]) && (
                    <Field
                      label="Service (Years)"
                      name={fields.earlyServiceYears}
                      type="number"
                      autoComplete="off"
                      value={values[fields.earlyServiceYears]}
                      onChange={handleChange}
                      component={FieldInputNumber}
                      disabled={isEdit && !isSave}
                      size="xxs"
                      hasSuggestion
                      suggestionDefaultText="years"
                      shouldDisplaySuggestion
                      min={0}
                      max={999}
                      isRequired
                    />
                  )}
                  <Field
                    label="Early Retirement Date"
                    name={fields.earlyRetirementDateRule}
                    value={values[fields.earlyRetirementDateRule]}
                    disabled={isEdit && !isSave}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.RETIREMENT_DATE_OPTIONS
                    )}
                    popupContent={
                      <SearchableList
                        isNotTypeAhead
                        isRadio
                        selectedValue={values[fields.earlyRetirementDateRule]}
                        label="Select an Early Retirement Date"
                        options={toOptionValuesFromMapper(
                          OPTIONS_DATA_MAPPER.RETIREMENT_DATE_OPTIONS
                        )}
                        onSelect={(value) =>
                          setFieldValue(fields.earlyRetirementDateRule, value)
                        }
                      />
                    }
                    component={FieldDropSide}
                    size="lg"
                    isRequired
                  />
                  <div className="line-separator"></div>
                  <Field
                    label="Normal Retirement"
                    name={fields.normalRetirement}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.RETIREMENT_TYPE
                    )}
                    selectedValue={values[fields.normalRetirement]}
                    onChange={handleNormalRetirementTypeChange}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                    size="lg"
                    isRequired
                  />
                  <div className="d-flex">
                    <Field
                      label="Age (years, months)"
                      name={fields.normalAgeYears}
                      type="number"
                      autoComplete="off"
                      value={values[fields.normalAgeYears]}
                      onChange={handleChange}
                      component={FieldInputNumber}
                      disabled={isEdit && !isSave}
                      size="xxs"
                      hasSuggestion
                      suggestionDefaultText="years"
                      shouldDisplaySuggestion
                      min={0}
                      max={999}
                      isRequired
                    />
                    <Field
                      label=" "
                      name={fields.normalAgeMonths}
                      type="number"
                      autoComplete="off"
                      value={values[fields.normalAgeMonths]}
                      onChange={handleChange}
                      component={FieldInputNumber}
                      disabled={isEdit && !isSave}
                      size="xxs"
                      hasSuggestion
                      suggestionDefaultText="months"
                      shouldDisplaySuggestion
                      min={0}
                      max={99}
                      isRequired
                    />
                  </div>
                  {[2].includes(values[fields.normalRetirement]) && (
                    <Field
                      label="Service (Years)"
                      name={fields.normalServiceYears}
                      type="number"
                      autoComplete="off"
                      value={values[fields.normalServiceYears]}
                      onChange={handleChange}
                      component={FieldInputNumber}
                      disabled={isEdit && !isSave}
                      size="xxs"
                      hasSuggestion
                      suggestionDefaultText="years"
                      shouldDisplaySuggestion
                      min={0}
                      max={999}
                      isRequired
                    />
                  )}
                  <Field
                    label="Normal Retirement Date"
                    name={fields.normalRetirementDateRule}
                    value={values[fields.normalRetirementDateRule]}
                    disabled={isEdit && !isSave}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.NORMAL_RETIREMENT_DATE_OPTIONS
                    )}
                    popupContent={
                      <SearchableList
                        isNotTypeAhead
                        isRadio
                        label="Select a Normal Retirement Date"
                        selectedValue={values[fields.normalRetirementDateRule]}
                        options={toOptionValuesFromMapper(
                          OPTIONS_DATA_MAPPER.NORMAL_RETIREMENT_DATE_OPTIONS
                        )}
                        onSelect={(value) =>
                          setFieldValue(fields.normalRetirementDateRule, value)
                        }
                      />
                    }
                    component={FieldDropSide}
                    size="lg"
                    isRequired
                  />
                </Col>
              </Row>
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ManageRetirementContainer;
