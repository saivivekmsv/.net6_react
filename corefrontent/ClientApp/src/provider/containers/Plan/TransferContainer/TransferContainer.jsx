import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import {
  ManagePlanLayout,
  FieldButtonGroup,
  FieldMultiSelectButtonGroup,
  FieldInput,
  ReadOnlyInput,
  FieldInputPercentage,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  yesNoOptions,
  required,
  ROUTES,
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

const typesPermitted = [
  {
    label: "Percentage",
    value: 1,
  },
  {
    label: "Dollars",
    value: 2,
  },
  {
    label: "Shares",
    value: 4,
  },
  {
    label: "Units",
    value: 8,
  },
];

const stockFundInvestment = [
  {
    label: "Yes",
    value: 1,
  },
  {
    label: "No",
    value: 2,
  },
  {
    label: "Not Applicable",
    value: 3,
  },
];

const timing = [
  {
    label: "Annually",
    value: 1,
  },
  {
    label: "Monthly",
    value: 2,
  },
  {
    label: "Quarterly",
    value: 3,
  },
  {
    label: "Semi Annually",
    value: 4,
  },
];

const transferTo = [
  {
    label: "Investment 3 for 401(k) plan",
  },
  {
    label: "Investment 1 for 401(k) plan",
  },
];

const isDollarTransferRuleApplicable = [
  {
    label: "Do not process",
    value: true,
  },
  {
    label: "Nearest Dollar",
    value: false,
  },
];

const initialValues = {};

const TransferContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const { planId, flow } = useRouterParams();
  const formName = managePlanFormNames.ADD_TRANSFER;
  const fields = formFields[formName];
  const apiData = get(state, "api.data", {});
  const transferData = get(apiData, "transfer", {});

  const schema = Yup.object().shape({
    // pctDollarAmount: Yup.string()
    //   .required("Required")
    //   .test("pctDollarAmount", "Percentage cannot be greater than 100", (val) =>
    //     val <= 100 ? true : false
    //   )
    //   .max(6, "Percentage cannot be greater than 6 characters"),
  });
  const buttons = [
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.TRANSFER,
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
            path: MANAGE_PLAN_ROUTES.TRANSFER,
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
    const { history } = props;
    savePlanDetailsAction(
      {
        transfer: {
          ...values,
          [fields.typesPermitted]: values[fields.isTransferAllowed]
            ? values[fields.typesPermitted]
            : [],
          [fields.rebalanceTypesPermitted]: values[fields.rebalanceAllowed]
            ? values[fields.rebalanceTypesPermitted]
            : [],
          [fields.timing]: values[fields.isAutoRebalanceAllowed]
            ? values[fields.timing]
            : 0,
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
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.TRANSFER,
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

  const initialValues = {
    [fields.showProspectusWithFirstTransfer]: false,
    [fields.showProsPectusWithEachTransfer]: false,
    [fields.isTransferAllowed]: false,
    [fields.rebalanceAllowed]: false,
    [fields.isReallocationAllowed]: false,
    [fields.isAutoRebalanceAllowed]: false,
    [fields.rebalanceWithoutStockFundInvestment]: 3,
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...transferData,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={schema}
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
                size="sm"
                name={fields.showProspectusWithFirstTransfer}
                label={"Show prospectus delivery method with first transfer?"}
                options={yesNoOptions}
                selectedValue={values[fields.showProspectusWithFirstTransfer]}
                value={values[fields.showProspectusWithFirstTransfer]}
                onChange={(value) => {
                  setFieldValue(fields.showProspectusWithFirstTransfer, value);
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.showProsPectusWithEachTransfer}
                label={"Show prospectus with each transfer?"}
                options={yesNoOptions}
                selectedValue={values[fields.showProsPectusWithEachTransfer]}
                value={values[fields.showProsPectusWithEachTransfer]}
                onChange={(value) => {
                  setFieldValue(fields.showProsPectusWithEachTransfer, value);
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />

              <div className="line-separator"></div>

              <p>Fund to Fund</p>
              <Field
                isRequired
                size="sm"
                name={fields.isTransferAllowed}
                label={"Transfer allowed?"}
                options={yesNoOptions}
                selectedValue={values[fields.isTransferAllowed]}
                value={values[fields.isTransferAllowed]}
                onChange={(value) => {
                  setFieldValue(fields.isTransferAllowed, value);
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />
              {values[fields.isTransferAllowed] && (
                <Field
                  size="sm"
                  name={fields.typesPermitted}
                  label={"Types permitted"}
                  options={typesPermitted}
                  selectedValue={values[fields.typesPermitted]}
                  value={values[fields.typesPermitted]}
                  onChange={(value) => {
                    setFieldValue(fields.typesPermitted, value);
                  }}
                  component={FieldMultiSelectButtonGroup}
                  disabled={isEdit && !isSave}
                />
              )}
              {values[fields.typesPermitted] != undefined &&
              values[fields.typesPermitted].includes(2) ? (
                <Field
                  size="xs"
                  isRequired
                  name={fields.pctDollarAmount}
                  label={"Percentage of Dollar Amount"}
                  value={values[fields.pctDollarAmount]}
                  type="number"
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={isEdit && !isSave}
                  component={FieldInputPercentage}
                  validate={required}
                />
              ) : (
                ""
              )}
              {values[fields.typesPermitted] != undefined &&
              values[fields.typesPermitted].includes(2) ? (
                <Field
                  isRequired
                  size="md"
                  name={fields.isDollarTransferRuleApplicable}
                  label={"Dollar transfer rule"}
                  options={isDollarTransferRuleApplicable}
                  selectedValue={values[fields.isDollarTransferRuleApplicable]}
                  value={values[fields.isDollarTransferRuleApplicable]}
                  onChange={(value) => {
                    setFieldValue(fields.isDollarTransferRuleApplicable, value);
                  }}
                  component={FieldButtonGroup}
                  validate={required}
                  disabled={isEdit && !isSave}
                />
              ) : (
                ""
              )}
              <Field
                isRequired
                size="sm"
                name={fields.isFlexibleTransferAllowed}
                label={"Flexible Transfer allowed by the source"}
                options={yesNoOptions}
                selectedValue={values[fields.isFlexibleTransferAllowed]}
                value={values[fields.isFlexibleTransferAllowed]}
                onChange={(value) => {
                  setFieldValue(fields.isFlexibleTransferAllowed, value);
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />

              <div className="line-separator"></div>

              <p>Rebalance</p>

              <Field
                isRequired
                size="sm"
                name={fields.rebalanceAllowed}
                label={"Rebalance allowed"}
                options={yesNoOptions}
                selectedValue={values[fields.rebalanceAllowed]}
                value={values[fields.rebalanceAllowed]}
                onChange={(value) => {
                  setFieldValue(fields.rebalanceAllowed, value);
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />
              {values[fields.rebalanceAllowed] && (
                <Field
                  size="sm"
                  name={fields.rebalanceTypesPermitted}
                  label={"Types permitted"}
                  options={typesPermitted}
                  selectedValue={values[fields.rebalanceTypesPermitted]}
                  value={values[fields.rebalanceTypesPermitted]}
                  onChange={(value) => {
                    setFieldValue(fields.rebalanceTypesPermitted, value);
                  }}
                  component={FieldMultiSelectButtonGroup}
                  disabled={isEdit && !isSave}
                />
              )}
              <Field
                isRequired
                size="md"
                name={fields.rebalanceWithoutStockFundInvestment}
                label={"Rebalance without Stock Fund Investment?"}
                options={stockFundInvestment}
                selectedValue={
                  values[fields.rebalanceWithoutStockFundInvestment]
                }
                value={values[fields.rebalanceWithoutStockFundInvestment]}
                onChange={(value) => {
                  setFieldValue(
                    fields.rebalanceWithoutStockFundInvestment,
                    value
                  );
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />

              <div className="line-separator"></div>

              <p>Auto Rebalance</p>

              <Field
                isRequired
                size="sm"
                name={fields.isAutoRebalanceAllowed}
                label={"Auto rebalance allowed?"}
                options={yesNoOptions}
                selectedValue={values[fields.isAutoRebalanceAllowed]}
                value={values[fields.isAutoRebalanceAllowed]}
                onChange={(value) => {
                  setFieldValue(fields.isAutoRebalanceAllowed, value);
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />

              {values[fields.isAutoRebalanceAllowed] && (
                <Field
                  isRequired
                  size="xl"
                  name={fields.timing}
                  label={"Timing"}
                  options={timing}
                  selectedValue={values[fields.timing]}
                  value={values[fields.timing]}
                  onChange={(value) => {
                    setFieldValue(fields.timing, value);
                  }}
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />
              )}

              <div className="line-separator"></div>

              <p>Reallocation</p>

              <Field
                isRequired
                size="sm"
                name={fields.isReallocationAllowed}
                label={"Reallocation allowed?"}
                options={yesNoOptions}
                selectedValue={values[fields.isReallocationAllowed]}
                value={values[fields.isReallocationAllowed]}
                onChange={(value) => {
                  setFieldValue(fields.isReallocationAllowed, value);
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />

              <div className="line-separator"></div>

              <p>Transfer Restriction</p>

              <ReadOnlyInput label="Transfer To" dataList={transferTo} />

              <Field
                size="md"
                name={fields.transferFrom}
                label={"Transfer From"}
                value={values[fields.transferFrom]}
                onChange={handleChange}
                autoComplete="off"
                disabled={true}
                component={FieldInput}
              />

              <Field
                size="md"
                name={fields.rebalanceExcludes}
                label={"Rebalance Excludes"}
                autoComplete="off"
                value={values[fields.rebalanceExcludes]}
                onChange={handleChange}
                disabled={true}
                component={FieldInput}
              />

              <Field
                size="md"
                name={fields.restrictedSourceCodes}
                autoComplete="off"
                label={"Restricted Source Code(s)"}
                value={values[fields.restrictedSourceCodes]}
                onChange={handleChange}
                disabled={true}
                component={FieldInput}
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TransferContainer;
