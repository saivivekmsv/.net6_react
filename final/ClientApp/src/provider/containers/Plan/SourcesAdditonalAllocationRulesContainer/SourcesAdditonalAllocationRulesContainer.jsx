import React, { useContext, useState } from "react";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import {
  faPencilAlt,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  managePlanFormNames,
  formFields,
  transformToMultiselectSave,
  SOURCE_CATEGORY_NAME_MAPPING,
} from "../../../utils";
import { ManagePlanLayout } from "../../../components";
import { useRouterParams } from "../../../abstracts";
import EmployeeAdditionalAllocationRulesForm from "./EmployeeAdditionalAllocationRulesForm";
import EmployerAdditionalAllocationRulesForm from "./EmployerAdditionalAllocationRulesForm";
import { createPlanStore, setManagePlanLocalCache } from "../../../contexts";

const SourcesAdditonalAllocationRulesContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { history } = props;
  const { flow, planId, sourceId, ruleId } = useRouterParams();
  const [newFlow, setNewFlow] = useState(ruleId ? FLOW_TYPES.EDIT : "");
  const intSourceId = parseInt(sourceId);
  const intRuleId = parseInt(ruleId);
  const formName = managePlanFormNames.SOURCES_ADDITIONAL_RULES;
  const fields = formFields[formName];
  const sourcesListData = get(state, "sources", []);
  const sourcesFormValues = get(sourcesListData, intSourceId, {});
  const sourceCategory = get(sourcesFormValues, "sourceCategory", 0);
  const isDeferral = sourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Deferral;
  const isEmployerDiscretionary =
    sourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Discretionary;
  const isEmployerMatch = sourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Match;

  const employeeDeferralSource = get(
    sourcesFormValues,
    "employeeDeferralSource",
    {}
  );
  const employerMatchSource = get(sourcesFormValues, "employerMatchSource", {});

  const employerDiscretionarySource = get(
    sourcesFormValues,
    "employerDiscretionarySource",
    {}
  );

  var additionalAllocationRulesData = isDeferral
    ? get(employeeDeferralSource, "additionalDeferralSource", [])
    : isEmployerMatch
    ? get(employerMatchSource, "additionalMatchSources", [])
    : isEmployerDiscretionary
    ? get(employerDiscretionarySource, "additionalDiscretionarySources", [])
    : [];

  additionalAllocationRulesData =
    additionalAllocationRulesData === null ? [] : additionalAllocationRulesData;
  const formValues = get(additionalAllocationRulesData, intRuleId, {});

  const goBack = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
        pathParam: [flow, planId, sourceId],
      })
    );
  };

  const onDeleteClick = () => {
    const updatedSourceFormValues = {
      ...sourcesFormValues,
      employeeDeferralSource: isDeferral
        ? {
            ...employeeDeferralSource,
            additionalDeferralSource: additionalAllocationRulesData.filter(
              (item, ind) => ind !== intRuleId
            ),
          }
        : employeeDeferralSource,
      employerMatchSource: isEmployerMatch
        ? {
            ...employerMatchSource,
            additionalMatchSources: additionalAllocationRulesData.filter(
              (item, ind) => ind !== intRuleId
            ),
          }
        : employerMatchSource,
      employerDiscretionarySource: isEmployerDiscretionary
        ? {
            ...employerDiscretionarySource,
            additionalDiscretionarySources: additionalAllocationRulesData.filter(
              (item, ind) => ind !== intRuleId
            ),
          }
        : employerDiscretionarySource,
    };

    dispatch(
      setManagePlanLocalCache({
        model: "sources",
        data: sourcesListData.map((item, index) => {
          if (index === intSourceId) return updatedSourceFormValues;
          else return item;
        }),
      })
    );
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
        pathParam: [FLOW_TYPES.EDIT, planId, sourceId],
      })
    );
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
      onClick: () => setNewFlow(FLOW_TYPES.SAVE),
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

  const getDataForSave = (values) => {
    return sourcesListData.map((item, index) => {
      const updatedValues = {
        ...formValues,
        ...values,
        [fields.availableEmployeeClassifications]: [
          ...transformToMultiselectSave(
            (values[fields.availableEmployeeClassifications] || []).filter(
              (val) =>
                !get(formValues, fields.availableEmployeeClassifications, [])
                  .map((_) => _.employeeClassificationCodeId)
                  .includes(val)
            ),
            "employeeClassificationCodeId"
          ),
          ...get(
            formValues,
            fields.availableEmployeeClassifications,
            []
          )?.filter((val) =>
            (values[fields.availableEmployeeClassifications] || []).includes(
              val.employeeClassificationCodeId
            )
          ),
        ],
      };
      if (index === intSourceId) {
        let transformedData = {};
        if (isEmpty(formValues)) {
          if (isEmployerMatch) {
            transformedData = {
              ...item.employerMatchSource,
              additionalMatchSources: [
                ...additionalAllocationRulesData,
                updatedValues,
              ],
            };
            item.employerMatchSource = transformedData;
          }
          if (isEmployerDiscretionary) {
            transformedData = {
              ...item.employerDiscretionarySource,
              additionalDiscretionarySources: [
                ...additionalAllocationRulesData,
                updatedValues,
              ],
            };
            item.employerDiscretionarySource = transformedData;
          }
          if (isDeferral) {
            transformedData = {
              ...item.employeeDeferralSource,
              additionalDeferralSource: [
                ...additionalAllocationRulesData,
                updatedValues,
              ],
            };
            item.employeeDeferralSource = transformedData;
          }
          return item;
        }

        if (isDeferral) {
          transformedData = {
            ...item.employeeDeferralSource,
            additionalDeferralSource: additionalAllocationRulesData.map(
              (addtionEligibilityItem, addtionEligibilityIndex) => {
                if (addtionEligibilityIndex === intRuleId) {
                  return { ...addtionEligibilityItem, ...updatedValues };
                }
                return addtionEligibilityItem;
              }
            ),
          };
          item.employeeDeferralSource = transformedData;
        }

        if (isEmployerMatch) {
          transformedData = {
            ...item.employerMatchSource,
            additionalMatchSources: additionalAllocationRulesData.map(
              (addtionEligibilityItem, addtionEligibilityIndex) => {
                if (addtionEligibilityIndex === intRuleId) {
                  return {
                    ...addtionEligibilityItem,
                    ...updatedValues,
                    percentageOfCalculation:
                      updatedValues.percentageOfCalculation,
                  };
                }
                return addtionEligibilityItem;
              }
            ),
          };
          item.employerMatchSource = transformedData;
        }

        if (isEmployerDiscretionary) {
          transformedData = {
            ...item.employerDiscretionarySource,
            additionalDiscretionarySources: additionalAllocationRulesData.map(
              (addtionEligibilityItem, addtionEligibilityIndex) => {
                if (addtionEligibilityIndex === intRuleId) {
                  return { ...addtionEligibilityItem, ...updatedValues };
                }
                return addtionEligibilityItem;
              }
            ),
          };
          item.employerDiscretionarySource = transformedData;
        }
        return item;
      }
      return item;
    });
  };

  const onFormSubmit = (values) => {
    const { history } = props;
    dispatch(
      setManagePlanLocalCache({
        model: "sources",
        data: getDataForSave(values),
      })
    );
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
        pathParam: [FLOW_TYPES.SAVE, planId, intSourceId],
      })
    );
  };

  const isEdit = newFlow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;

  return (
    <Formik
      initialValues={{
        ...formValues,
        [fields.allocationFormulaAppliesTo]: 1,
        [fields.availableEmployeeClassifications]: get(
          formValues,
          fields.availableEmployeeClassifications,
          []
        )?.map((val) => val.employeeClassificationCodeId),
        [fields.percentageOfCalculation]: get(
          formValues,
          "percentageOfCalculation"
        ),
      }}
      onSubmit={onFormSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const { handleSubmit } = formProps;
        const sourceType = get(sourcesFormValues, "sourceType", "");
        const sourceCategory = get(sourcesFormValues, "sourceCategory", "");

        const isEmployee = parseInt(sourceType, 10) !== 2;
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={formProps.submitCount > 0}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <div className="plan-heading">Allocation Rules</div>
              {isEmployee === true && (
                <EmployeeAdditionalAllocationRulesForm
                  {...formProps}
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                />
              )}
              {isEmployee === false && (
                <EmployerAdditionalAllocationRulesForm
                  {...formProps}
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                  sourceCategory={sourceCategory}
                />
              )}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SourcesAdditonalAllocationRulesContainer;
