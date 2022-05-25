import React, { useContext, useState } from "react";
import { find, get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldDropSide,
  DatePicker,
  MultiSelectDropdown,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  required,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  usDateFormat,
  toMultiSelectValue,
} from "../../../utils";
import {
  createPlanStore,
  savePlanDetailsAction,
  setManagePlanToastInfo,
} from "../../../contexts";
import { useRouterParams } from "../../../abstracts";

const initialValues = {};

const AddInvestmentContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, investmentId, restrictionId } = useRouterParams();
  const [newFlow, setNewFlow] = useState(restrictionId ? FLOW_TYPES.EDIT : "");
  const formName = managePlanFormNames.ADD_INVESTMENT_RESTRICTIONS;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const investmentsData = get(apiData, "investments", []);
  const intInvestmentId = parseInt(investmentId, 10);
  const filteredValues = find(investmentsData, {
    id: intInvestmentId,
  });

  const restrictionsList = get(filteredValues, "restrictions", []);
  const formValues = find(restrictionsList, {
    id: parseInt(restrictionId, 10),
  });

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
        pathParam: [flow, planId, investmentId],
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
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
        pathParam: [flow, planId, investmentId],
      }),
    },
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faPencilAlt,
      onClick: () => setNewFlow(FLOW_TYPES.SAVE),
    },
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
        pathParam: [flow, planId, investmentId],
      }),
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTrashAlt,
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const getDataForSave = (values) => {
    const updatedValues = {
      ...formValues,
      ...values,
    };
    return investmentsData.map((investmentsItem) => {
      if (investmentsItem.id === intInvestmentId) {
        if (isEmpty(formValues)) {
          return {
            ...investmentsItem,
            restrictions: [...restrictionsList, values],
          };
        }
        return {
          ...investmentsItem,
          restrictions: restrictionsList.map((item) => {
            if (item.id === restrictionId) {
              return { ...item, ...updatedValues };
            }
            return item;
          }),
        };
      }
      return investmentsItem;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    const { history } = props;
    savePlanDetailsAction(
      {
        investments: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS,
            pathParam: [planId, investmentId], // put the company id after crated
          })
        );

        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: `New Restriction has been created`,
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

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        setValues,
        setSubmitting,
        values,
        setTouched,
        ...rest
      }) => {
        const selectedApplicableTypes = values[fields.applicableTypes];
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <Field
                size="smd"
                isRequired
                name={fields.effectiveStartDate}
                label={"Effective Start Date"}
                value={usDateFormat(values[fields.effectiveStartDate])}
                isDatePicker
                onClear={() => setFieldValue(fields.effectiveStartDate, "")}
                popupContent={
                  <DatePicker
                    onDayClick={(value) =>
                      setFieldValue(fields.effectiveStartDate, value)
                    }
                    value={values[fields.effectiveStartDate]}
                  />
                }
                disabled={isEdit && !isSave}
                component={FieldDropSide}
                validate={required}
              />
              <Field
                size="smd"
                isRequired
                name={fields.effectiveEndDate}
                label={"Effective End Date"}
                value={usDateFormat(values[fields.effectiveEndDate])}
                isDatePicker
                onClear={() => setFieldValue(fields.effectiveEndDate, "")}
                popupContent={
                  <DatePicker
                    onDayClick={(value) =>
                      setFieldValue(fields.effectiveEndDate, value)
                    }
                    value={values[fields.effectiveEndDate]}
                  />
                }
                disabled={isEdit && !isSave}
                component={FieldDropSide}
                validate={required}
              />
              <Field
                isRequired
                name={fields.applicableTypes}
                label={"Applicable Types"}
                isMultiSelect
                value={toMultiSelectValue(
                  selectedApplicableTypes,
                  toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.TEMP_APPLICABLE_TYPES
                  )
                )}
                popupContent={
                  <MultiSelectDropdown
                    label="Select Applicable Types"
                    name={fields.suspendedSources}
                    onSelect={(value) =>
                      setFieldValue(fields.applicableTypes, value)
                    }
                    value={values[fields.applicableTypes] || []}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.TEMP_APPLICABLE_TYPES
                    )}
                    disabled={isEdit && !isSave}
                  />
                }
                validate={required}
                component={FieldDropSide}
                disabled={isEdit && !isSave}
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddInvestmentContainer;
