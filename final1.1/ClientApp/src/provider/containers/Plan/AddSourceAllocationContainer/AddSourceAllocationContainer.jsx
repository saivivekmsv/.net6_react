import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form, Button } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldInput,
  CsplTable as Table,
  FieldDropSide,
  SearchableList,
  Link,
  FieldInputDecimal,
  MultiSelectDropdown,
  FieldInputPercentage,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  required,
  tranformListToDropdownValues,
  toMultiSelectValueById,
  transformToMultiselectSave,
} from "../../../utils";
import { createPlanStore, setManagePlanLocalCache } from "../../../contexts";
import {
  useRouterParams,
  useTableChecboxSelect,
  useDeepEffect,
} from "../../../abstracts";
// import { getAllocationPlanInvestmentMasterData } from "../../../services";
import AllocationFrequency from "../../../mocks/allocationFrequency.json";
import { getInvestmentsMasterData } from "../../../services";
// import SourceNames from "../../../mocks/allocationSourceName.json";

const columns = [
  {
    label: "",
    className: "",
    columnName: "",
  },
  {
    label: "Plan Investment",
    className: "column-employee-classification-name",
    columnName: "name",
  },
];

const initialValues = {};

const AddSourceAllocationContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, sourceAllocationId } = useRouterParams();
  const formName = managePlanFormNames.SOURCES_ALLOCATION;
  const fields = formFields[formName];

  const intSourceAllocationId = parseInt(sourceAllocationId, 10);
  const allocationData = get(state, "allocation", {});
  const apiData = get(state, "api.data", {});
  const allocationApiData = get(apiData, "allocation", {});
  const sourcesList = tranformListToDropdownValues(
    get(apiData, "sources", []),
    "sourceName",
    "id"
  );
  const investmentsList = tranformListToDropdownValues(
    get(apiData, "investments", []),
    "name",
    "id"
  );

  const sourceAllocationsData = get(allocationData, "sourceAllocations", []);
  const formValues = get(sourceAllocationsData, sourceAllocationId, {});
  const [newFlow, setNewFlow] = useState(
    !isNaN(intSourceAllocationId) ? FLOW_TYPES.EDIT : ""
  );

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ALLOCATION,
        pathParam: [flow, planId],
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
        path: MANAGE_PLAN_ROUTES.ALLOCATION,
        pathParam: [flow, planId],
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
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
    },
  ];

  const getDataForSave = (values) => {
    const investment = [
      ...transformToMultiselectSave(
        (values[fields.investments] || []).filter(
          (val) =>
            !get(formValues, fields.investments, [])
              .map((_) => _.investmentId)
              .includes(val)
        ),
        "investmentId"
      ),
      ...get(formValues, fields.investments, []).filter((val) =>
        (values[fields.investments] || []).includes(val.investmentId)
      ),
    ];
    values[fields.investments] = investment;
    let transformedValues = {};
    if (isEmpty(formValues)) {
      transformedValues = {
        ...allocationData,
        frequencyOfChange: values[fields.frequencyAllocationChanges],
        sourceAllocations: [...sourceAllocationsData, values],
      };
      return transformedValues;
    }
    transformedValues = {
      ...allocationData,
      sourceAllocations: sourceAllocationsData.map(
        (sourceAllocationItem, sourceAllocationIndex) => {
          if (sourceAllocationIndex === intSourceAllocationId) {
            return { ...sourceAllocationItem, ...values };
          }
          return sourceAllocationItem;
        }
      ),
    };
    return transformedValues;
  };

  const onFormSubmit = (values) => {
    const { history } = props;

    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ALLOCATION,
        pathParam: [flow, planId],
      })
    );
    dispatch(
      setManagePlanLocalCache({
        model: "allocation",
        data: getDataForSave(values),
      })
    );
  };

  const isEdit = newFlow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
        [fields.investments]: get(formValues, fields.investments, [])?.map(
          (val) => val.investmentId
        ),
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
        values,
        ...rest
      }) => {
        const selectedInvestments = values[fields.investments];
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <Row>
                <Col md="4">
                  <Field
                    size="md"
                    isRequired
                    label="Source Name"
                    name={fields.sourceId}
                    value={values[fields.sourceId]}
                    disabled={isEdit || isSave}
                    options={sourcesList}
                    popupContent={
                      <SearchableList
                        label="Select a month"
                        isNotTypeAhead
                        options={sourcesList}
                        onSelect={(value) =>
                          setFieldValue(fields.sourceId, value)
                        }
                        selectedValue={values[fields.sourceId]}
                        isRadio
                      />
                    }
                    validate={required}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    size="xxs"
                    isRequired
                    name={fields.allocationIncrement}
                    label={"Allocation increments"}
                    // hasSuggestion
                    // suggestionDefaultText="%"
                    // shouldDisplaySuggestion
                    type="number"
                    autoComplete="off"
                    value={values[fields.allocationIncrement]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputPercentage}
                    validate={required}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Field
                    isRequired
                    label="Frequency of allocation changes"
                    name={fields.frequencyAllocationChanges}
                    value={values[fields.frequencyAllocationChanges]}
                    disabled={isEdit && !isSave}
                    options={AllocationFrequency.data}
                    popupContent={
                      <SearchableList
                        label="Select a source"
                        isNotTypeAhead
                        options={AllocationFrequency.data}
                        onSelect={(value) =>
                          setFieldValue(
                            fields.frequencyAllocationChanges,
                            value
                          )
                        }
                        selectedValue={
                          values[fields.frequencyAllocationChanges]
                        }
                        isRadio
                      />
                    }
                    validate={required}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>

              <p className="font-weight-500 text-black">
                Investments applicable for this source allocation
              </p>
              <Field
                size="md"
                isRequired
                label="Investments"
                options={investmentsList}
                name={fields.investments}
                value={toMultiSelectValueById(
                  selectedInvestments,
                  investmentsList
                )}
                disabled={isEdit && !isSave}
                isMultiSelect
                popupContent={
                  <MultiSelectDropdown
                    label="Select investments"
                    options={investmentsList}
                    onSelect={(value) =>
                      setFieldValue(fields.investments, value)
                    }
                    name={fields.investments}
                    value={values[fields.investments]}
                    disabled={isEdit && !isSave}
                  />
                }
                component={FieldDropSide}
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddSourceAllocationContainer;
