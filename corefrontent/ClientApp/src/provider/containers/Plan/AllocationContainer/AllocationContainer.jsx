import React, { useContext, useState } from "react";
import { find, get, isEmpty } from "lodash";
import { Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldButtonGroup,
  FieldDropSide,
  SearchableList,
  AddPlans,
  AddButton,
  Link,
  CsplTable as Table,
  FieldInputDecimal,
  FieldInputPercentage,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  yesNoOptions,
  required,
  tranformListToDropdownValues,
  getNullTableItem,
  getAdvancedPathWithParam,
  ROUTES,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanLocalCache,
  clearLocalCacheByModel,
} from "../../../contexts";
import { useDeepEffect, useRouterParams } from "../../../abstracts";
import AllocationFrequency from "../../../mocks/allocationFrequency.json";

const allocationIncrements = [
  {
    value: 1,
    label: "Anniversary of Enrolment Date",
  },
  {
    value: 2,
    label: "Start of Plan Year",
  },
  {
    value: 3,
    label: "Start of Calendar Year",
  },
];

const columns = [
  {
    label: "Source Name",
    className: "column-addtional-vesting-description",
    columnName: "sourceId",
    link: MANAGE_PLAN_ROUTES.ADD_SOURCE_ALLOCATION,
  },
];

const initialValues = {};

const AllocationContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow, setNewFlow] = useState("");
  const { planId, flow } = useRouterParams();
  const formName = managePlanFormNames.ALLOCATION;
  const fields = formFields[formName];
  const { history } = props;
  const apiData = get(state, "api.data", {});
  const allocationApiData = get(apiData, "allocation", {});
  let formValues = get(state, "allocation", {});
  const sourceAllocationData = get(formValues, "sourceAllocations", []);
  const sourcesList = tranformListToDropdownValues(
    get(apiData, "sources", []),
    "sourceName",
    "id"
  );
  const sourceAllocations = get(state, "allocation.sourceAllocations", []);
  useDeepEffect(() => {
    if (isEmpty(formValues)) {
      dispatch(
        setManagePlanLocalCache({
          model: "allocation",
          data: allocationApiData,
        })
      );
    }
  }, [allocationApiData]);

  const buttons = [
    {
      link: getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.ALLOCATION,
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
            path: MANAGE_PLAN_ROUTES.ALLOCATION,
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

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    savePlanDetailsAction(
      {
        allocation: {
          ...formValues,
          ...values,
        },
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        //dispatch(clearLocalCacheByModel("allocation"));
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.ALLOCATION,
            pathParam: [FLOW_TYPES.EDIT, planId],
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
        [fields.doesInvestmentAllocationDifferBySource]: false,
        [fields.doesInvestmentsApplicableDifferBySource]: false,
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
        values,
        setSubmitting,
        ...rest
      }) => {
        const addSourceAllocationClick = () => {
          setSubmitting(true);
          dispatch(
            setManagePlanLocalCache({
              model: "allocation",
              data: { ...formValues, ...values },
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: MANAGE_PLAN_ROUTES.ADD_SOURCE_ALLOCATION,
                pathParam: [FLOW_TYPES.ADD, planId], // put the company id after crated
              })
            );
          }, 10);
        };

        const editSourceAllocationClick = (item, index) => {
          setSubmitting(true);
          dispatch(
            setManagePlanLocalCache({
              model: "allocation",
              data: { ...formValues, ...values },
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: item.link,
                pathParam: [FLOW_TYPES.EDIT, planId, index], // put the company id after crated
              })
            );
          }, 10);
        };

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <Field
                size="xxs"
                isRequired
                name={fields.increments}
                label={"Allocation Increments"}
                // hasSuggestion
                // suggestionDefaultText="%"
                // shouldDisplaySuggestion
                type="number"
                autoComplete="off"
                value={values[fields.increments]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputPercentage}
                validate={required}
              />
              <Field
                isRequired
                size="xxl"
                name={fields.frequencyOfIncrements}
                label={"Frequency of allocation increments"}
                options={allocationIncrements}
                selectedValue={values[fields.frequencyOfIncrements]}
                value={values[fields.frequencyOfIncrements]}
                onChange={(value) => {
                  setValues({
                    ...values,
                    [fields.frequencyOfIncrements]: value,
                  });
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                label="Frequency of allocation changes"
                name={fields.frequencyOfChanges}
                value={values[fields.frequencyOfChanges]}
                disabled={isEdit && !isSave}
                options={AllocationFrequency.data}
                popupContent={
                  <SearchableList
                    label="Select a month"
                    isNotTypeAhead
                    options={AllocationFrequency.data}
                    onSelect={(value) =>
                      setFieldValue(fields.frequencyOfChanges, value)
                    }
                    selectedValue={values[fields.frequencyOfChanges]}
                    isRadio
                  />
                }
                validate={required}
                component={FieldDropSide}
              />
              <Field
                isRequired
                size="sm"
                name={fields.doesInvestmentAllocationDifferBySource}
                label={"Investment Allocation differs by source ?"}
                options={yesNoOptions}
                selectedValue={
                  values[fields.doesInvestmentAllocationDifferBySource]
                }
                type="text"
                autoComplete="off"
                value={values[fields.doesInvestmentAllocationDifferBySource]}
                onChange={(value) => {
                  setValues({
                    ...values,
                    [fields.doesInvestmentAllocationDifferBySource]: value,
                  });
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.doesInvestmentsApplicableDifferBySource}
                label={"Investments Applicable differs by source ?"}
                options={yesNoOptions}
                selectedValue={
                  values[fields.doesInvestmentsApplicableDifferBySource]
                }
                value={values[fields.doesInvestmentsApplicableDifferBySource]}
                onChange={(value) => {
                  setValues({
                    ...values,
                    [fields.doesInvestmentsApplicableDifferBySource]: value,
                  });
                }}
                component={FieldButtonGroup}
                validate={required}
                disabled={isEdit && !isSave}
              />

              {values[fields.doesInvestmentsApplicableDifferBySource] ===
              true ? (
                <>
                  <div className="line-separator"></div>
                  <div className="d-flex justify-content-between bg-title">
                    <div>
                      <h4 className="ft-20">Source Allocation Information</h4>
                    </div>
                    <div>
                      <AddButton
                        disabled={isEdit && !isSave}
                        onAddClick={addSourceAllocationClick}
                      />
                    </div>
                  </div>

                  {isEmpty(sourceAllocationData) && (
                    <AddPlans
                      content="No source allocations have been created."
                      buttonLabel="Add Source Allocation"
                      className="h-auto"
                      disabled={isEdit && !isSave}
                      onPrimaryClick={addSourceAllocationClick}
                    />
                  )}
                  {!isEmpty(sourceAllocationData) && (
                    <div className="w-100">
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            {columns.map((item, index) => {
                              return (
                                <Table.Th
                                  key={index}
                                  className={item.className}
                                >
                                  {item.label}
                                </Table.Th>
                              );
                            })}
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {sourceAllocationData.map(
                            (additionalVesting, index) => {
                              const sourceName = get(
                                find(sourcesList, {
                                  value: additionalVesting.sourceId,
                                }),
                                "label",
                                ""
                              );
                              return (
                                <Table.Tr key={index}>
                                  {columns.map((item, cellIndex) => {
                                    return (
                                      <Table.Td
                                        key={cellIndex}
                                        className={item.className}
                                      >
                                        <Link
                                          onClick={() => {
                                            editSourceAllocationClick(
                                              item,
                                              index
                                            );
                                          }}
                                        >
                                          {getNullTableItem(sourceName)}
                                        </Link>
                                      </Table.Td>
                                    );
                                  })}
                                </Table.Tr>
                              );
                            }
                          )}
                        </Table.Tbody>
                      </Table>
                    </div>
                  )}
                </>
              ) : null}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AllocationContainer;
