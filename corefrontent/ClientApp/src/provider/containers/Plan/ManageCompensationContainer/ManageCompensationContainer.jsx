import React, { useContext, useEffect, useState } from "react";
import { get, isEmpty, values, isEqual, constant } from "lodash";
import { Form } from "react-bootstrap";
import { faCheck, faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Field, FieldArray } from "formik";
import { Button } from "react-bootstrap";
import { PlanSourceCompensation } from "./PlanSourceCompensation";
import { EmployeeClassificationLevel } from "./EmployeeClassificationLevel";

import {
  ManagePlanLayout,
  AddButton,
  CsplTable as Table,
  FieldInput,
  AddPlans,
  FieldButtonGroup,
  FieldDropSide,
  MultiSelectDropdown,
  Link,
  SliderPanel,
  LoaderWrapper,
  CompensationTable,
  ManageCompensationCategory,
} from "../../../components";
import {
  OPTIONS_DATA_MAPPER,
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  includeExcludeIgnoreOptions,
  yesNoOptions,
  required,
  ROUTES,
  tranformListToDropdownValues,
  transformToMultiselectSave,
  toMultiSelectValueById,
  getAdvancedPathWithParam,
  toOptionValuesFromMapper,
  getNullTableItem,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanLocalCache,
  clearLocalCacheByModel,
  setManagePlanLoader,
  setManagePlanFlow,
} from "../../../contexts";
import { useDeepEffect, useRequest, useRouterParams } from "../../../abstracts";
import CommmonSourcesFields from "./CommmonSourcesFields";
import {
  getPlanCompensationCategories,
  getClassificationCodes,
} from "../../../services";

const columns = [
  {
    label: "Category name",
    className: "column-source-copensation-name",
    columnName: "name",
    link: MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION,
  },
  {
    label: "Employee classification names",
    className: "column-source-copensation-name",
    columnName: "codeValue",
  },
];
const columndata = [
  {
    label: "Compensation name",
    className: "column-source-copensation-name",
    columnName: "name",
    link: MANAGE_PLAN_ROUTES.MANAGE_SOURCE_COMPENSATION,
  },
  {
    label: "Sources",
    className: "column-source-copensation-name",
    columnName: "sources",
  },
];
const initialValues = {
  isDiffersForPlanSources: false,
};
const fieldNames = {
  planCategory: "planCompensationCategories",
  classifications: {
    name: "",
    classificationCategory:
      "employeeClasificationCategories.compensationClassificationCategories",
  },
  postSeverence: "postSeveranceCompensationCategories",
  sourceCompensations: "sourceCompensationCategories",
  sourceClassficationCompensations:
    "sourceCompensationClassificationCategories",
};

const ManageCompensationContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);

  const { flow, planId, companyId } = useRouterParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  //const [newFlow, setNewFlow] = useState(compensationId ? flow : "");
  const formName = managePlanFormNames.MANAGE_COMPENSATION;
  const planCompCategories =
    managePlanFormNames.MANAGE_PLAN_COMPENSATION_CATEGORY;
  const planCompfields = formFields[planCompCategories];
  const sourceCategories = managePlanFormNames.MANAGE_SOURCE_COMPENSATION;
  const sourceFields = formFields[sourceCategories];
  const sourceCategoryName =
    managePlanFormNames.MANAGE_SOURCE_COMPENSATION_CATEGORY;
  const sourceFieldName = formFields[sourceCategoryName];
  const fields = formFields[formName];
  const [codeVal, setcodeVal] = useState("");
  const [compensationApiData] = useState(
    get(state, `api.data.compensation`, {})
  );
  const sourceEmployeeClassifications =
    managePlanFormNames.MANAGE_SOURCE_COMPENSATION_CLASSIFICATION;
  const sourceClassificationFields = formFields[sourceEmployeeClassifications];
  const classificationFields =
    managePlanFormNames.MANAGE_EMPLOYEE_CLASSIFICATION_CATEGORY;
  const classificationFieldVals = formFields[classificationFields];
  const [showError, setShowError] = useState(false);
  const formValues = get(state, `api.data.compensation`, {});
  console.log(formValues, "formaValues");
  const [planCategories, setPlanCategories] = useState([]);
  const sourceCompensationData = get(formValues, "sourceCompensations", []);
  const [employeeClassificationCate, setCate] = useState([]);
  const [load, setLoad] = useState(true);
  const sourceCompensationEdited = get(state, "sourceCompensations", []);

  const sourceList = tranformListToDropdownValues(
    get(state, "api.data.sources", []),
    "sourceName",
    "id"
  );
  const employeeClasificationCategoriesData = get(
    formValues,
    "employeeClasificationCategories",
    []
  );
  const [classifications, setClassifications] = useState([]);
  
  const compAnyId = parseInt(companyId, 10);
 
  const planGrossCategories = get(formValues, "planCompensationCategories", [])
    ? get(formValues, "planCompensationCategories", []).map((e) => {
        const nameVal = planCategories
          .filter((f) => (f.id === e.compensationCategoryId ? f.name : null))
          .map((g) => g.name);
        const vls = {
          id: e.id,
          name: nameVal[0],
          compensationId: e.compensationId,
          compensationCategoryId: e.compensationCategoryId,
          calculationType: e.calculationType,
        };
        return vls;
      })
    : [];    
  
  const postSeveranceCategories = get(
    formValues,
    "postSeveranceCompensationCategories",
    []
  )
    ? get(formValues, "postSeveranceCompensationCategories", []).map((e) => {
        const nameVal = planCategories
          .filter((f) => (f.id === e.compensationCategoryId ? f.name : null))
          .map((g) => g.name);
        const vls = {
          id: e.id,
          name: nameVal[0],
          compensationId: e.compensationId,
          compensationCategoryId: e.compensationCategoryId,
          calculationType: e.calculationType,
        };
        return vls;
      })
    : [];
  const employeeClassifications = get(
    formValues,
    "employeeClasificationCategories",
    empClassifications
  );

  useEffect(() => {
    getClassificationCodes(compAnyId)
      .then((res) => {
        if (res) {
          setClassifications(res);
          setCate(
            res.map((val) => ({
              label: val.classificationName,
              value: val.id,
            }))
          );
        }
      })
      .catch((err) => err);
    getPlanCompensationCategories(compAnyId)
      .then((res) => {
        if (res) {
          setPlanCategories(() =>
            res.map((e) => ({ id: e.id, name: e.name, calculationType: 1 }))
          );
          setLoad(false);
        }
      })
      .catch((err) => err);
  }, [compAnyId]);

  const buttons = [
    {
      link: ROUTES.PLAN,
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
            path: MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION,
            pathParam: [FLOW_TYPES.SAVE, planId, companyId],
          })
        ),
    },
  ];
  console.log(state, "stateVlaues");

  // useDeepEffect(() => {
  //   if (isEmpty(formValues)) {
  //     dispatch(
  //       setManagePlanLocalCache({
  //         model: "compensation",
  //         data: compensationApiData,
  //       })
  //     );
  //   }
  // }, [compensationApiData]);
  //console.log('Torf',JSON.stringify(compensationApiData))

  const getDataForSave = (values) => {
    const newValues = get(values, "planCompensationCategories", []).map(
      (e) => ({
        id: e.compensationCategoryId ? e.id : 0,
        compensationId: e.compensationId ? e.compensationId : 0,
        compensationCategoryId: e.compensationCategoryId
          ? e.compensationCategoryId
          : e.id,
        name: e.name,
        calculationType: e.calculationType,
      })
    );
    const postSevValues = get(values, "isPostSeverance")
      ? get(values, "postSeveranceCompensationCategories", []).map((e) => ({
          id: e.compensationCategoryId ? e.id : 0,
          compensationId: e.compensationId
            ? e.compensationId
            : get(values, "id", 0),
          compensationCategoryId: e.compensationCategoryId
            ? e.compensationCategoryId
            : e.id,
          //name: e.name,
          calculationType: e.calculationType,
        }))
      : [];

    const compensation = {
      id: get(values, "id", 0),
      definition: get(values, "definition"),
      isDifferAtClassificationLevel: get(
        values,
        "isDifferAtClassificationLevel"
      ),
      isDiffersForPlanSources: get(values, "isDiffersForPlanSources"),
      isPreEntry: get(values, "isPreEntry"),
      isPostSeverance: get(values, "isPostSeverance"),
      calculationPeriod: get(values, "calculationPeriod"),
      planCompensationCategories: newValues,
      employeeClasificationCategories: empClassifications,
      postSeveranceCompensationCategories: postSevValues,
      sourceCompensations: !isEmpty(sourceCompensationEdited)
        ? [sourceCompensationEdited]
        : [],
    };

    return compensation;
  };

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    // if (
    //   values[fields.isDiffersForPlanSources] &&
    //   isEmpty(sourceCompensationData)
    // ) {
    //   setShowError(true);
    //   return;
    // }
    // setShowError(false);

    savePlanDetailsAction(
      {
        compensation: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        const newPlanId = get(response, "plan.id");
        const newCompanyId = get(response, "plan.companyId");
        console.log(newPlanId);
        console.log(newCompanyId);
        console.log(response, "response");
        dispatch(
          setManagePlanFlow({
            planId: newPlanId,
            companyId: newCompanyId,
          })
        );
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION,
            pathParam: [FLOW_TYPES.EDIT, newPlanId, newCompanyId],
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
  const isSave = flow === FLOW_TYPES.SAVE;

  const showPopup = () => {
    setModalOpen(true);
  };

  const closePopup = () => {
    setModalOpen(false);
  };

  console.log(sourceCompensationEdited, "sorcess");
  const [empClassifications, setEmpClassifications] = useState(
    employeeClasificationCategoriesData
  );
  console.log(empClassifications, "empClassifc");
  const [sourCompensations, setSource] = useState([]);
  console.log(sourCompensations, "kjsjfjejw");
  const employeeClassificationData = [];
  const [empClassificationItem, setItem] = useState([]);
  console.log(empClassificationItem, "vwojfowjowjojow");
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
        planCompensationCategories: isEmpty(planGrossCategories)
          ? planCategories
          : planGrossCategories,
        employeeClasificationCategories: {
          compensationClassificationCategories: isEmpty(
            get(
              employeeClasificationCategoriesData,
              "compensationClassificationCategories",
              []
            )
          )
            ? planCategories
            : get(
                employeeClasificationCategoriesData,
                "compensationClassificationCategories",
                []
              ),
        },
        postSeveranceCompensationCategories: isEmpty(postSeveranceCategories)
          ? planCategories
          : postSeveranceCategories,
        sourceCompensationCategories: planCategories,
        sourceCompensationClassificationCategories: planCategories,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const {
          handleChange,
          setFieldValue,
          handleSubmit,
          setValues,
          setTouched,
          values,
          setSubmitting,
          ...rest
        } = formProps;
        // const isEqual=()=>{
        //   return values.calculationPeriod===compensationApiData.calculationPeriod && values.definition===compensationApiData.definition
        //   && values.employeeExcludedTypesOfCompensation===compensationApiData.employeeExcludedTypesOfCompensation
        // }
        console.log(values, "values");
        const addSourceClick = () => {
          console.log(companyId, "companyId");
          console.log(planId, "planId");
          setSubmitting(true);
          dispatch(
            setManagePlanLocalCache({
              model: "compensation",
              data: getDataForSave(values),
            })
          );

          window.setTimeout(() => {
            history.push(
              getAdvancedPathWithParam({
                path: MANAGE_PLAN_ROUTES.MANAGE_SOURCE_COMPENSATION,
                pathParam: [
                  FLOW_TYPES.ADD,
                  planId,
                  companyId,
                  get(values, "sourceCompensationCategories.id"),
                ],
              })
            );
          }, 10);
        };

        const addSourceCompensationClick = () => {
          setSubmitting(true);

          dispatch(
            setManagePlanLocalCache({
              model: "compensation",
              data: { ...formValues, ...values },
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: MANAGE_PLAN_ROUTES.MANAGE_SOURCE_COMPENSATION,
                pathParam: [
                  FLOW_TYPES.ADD,
                  planId,
                  (sourceCompensationData || []).length,
                ], // put the company id after crated
              })
            );
          }, 10);
        };
        const addEmployeeClassification = () => {
          setModalOpen(false);
          const classificationsnew = [
            ...transformToMultiselectSave(
              (values[fields.employeeClassifications] || []).filter(
                (val) =>
                  !get(formValues, fields.employeeClassifications, [])
                    .map((_) => _.id)
                    .includes(val)
              ),
              "employeeClassificationCodeId"
            ),
            ...get(
              formValues,
              fields.employeeClassifications,
              []
            ).filter((val) =>
              (values[fields.employeeClassifications] || []).includes(val.id)
            ),
          ];
          const compClassifications = get(
            values,
            "employeeClasificationCategories.compensationClassificationCategories",
            []
          )
            ? get(
                values,
                "employeeClasificationCategories.compensationClassificationCategories",
                []
              ).map((e) => ({
                id: e.compensationCategoryId ? e.id : 0,
                employeeClasificationCategoryId: e.employeeClasificationCategoryId
                  ? e.employeeClasificationCategoryId
                  : get(values, "employeeClasificationCategories.id", 0),
                compensationCategoryId: e.compensationCategoryId
                  ? e.compensationCategoryId
                  : e.id,
                //name: e.name,
                calculationType: e.calculationType,
              }))
            : [];
          const setData = {
            id: get(values, "employeeClasificationCategories.id", 0),
            compensationId: get(values, "id", 0),
            name: get(values, "name", ""),
            compensationClassifications: classificationsnew.map((e) => ({
              id: e.id,
              employeeClasificationCategoryId: get(
                values,
                "employeeClasificationCategories.id",
                0
              ),
              employeeClassificationCodeId: e.employeeClassificationCodeId,
            })),
            compensationClassificationCategories: compClassifications,
          };

          setEmpClassifications([...empClassifications, setData]);
        };
        console.log(empClassifications, "svnonevwo");
        const addSourceCompensation = () => {
          setSourceOpen(false);
          const sourcesAdded = [
            ...transformToMultiselectSave(
              (values[sourceFieldName.name] || []).filter(
                (val) =>
                  !get(formValues, sourceFieldName.name, [])
                    .map((_) => _.id)
                    .includes(val)
              ),
              "sourceId"
            ),
            ...get(formValues, sourceFieldName.name, []).filter((val) =>
              (values[sourceFieldName.name] || []).includes(val.id)
            ),
          ];

          const addSourceCompensations = get(
            values,
            "sourceCompensationCategories",
            []
          )
            ? get(values, "sourceCompensationCategories", []).map((e) => ({
                id: e.id,
                sourceCompensationId: get(
                  values,
                  "sourceCompensationCategories.id",
                  0
                ),
                compensationCategoryId: get(
                  values,
                  "sourceCompensationCategories.compensationCategoryId",
                  0
                ),
                name: e.name,
                calculationType: e.calculationType,
              }))
            : [];

          const classificationsnew = [
            ...transformToMultiselectSave(
              (values[fields.sourceEmployeeClassifications] || []).filter(
                (val) =>
                  !get(formValues, fields.sourceEmployeeClassifications, [])
                    .map((_) => _.id)
                    .includes(val)
              ),
              "employeeClassificationCodeId"
            ),
            ...get(
              formValues,
              fields.sourceEmployeeClassifications,
              []
            ).filter((val) =>
              (values[fields.sourceEmployeeClassifications] || []).includes(
                val.id
              )
            ),
          ];

          const addSourceClassifications = get(
            values,
            "sourceCompensationClassificationCategories",
            []
          )
            ? get(values, "sourceCompensationClassificationCategories", []).map(
                (e) => ({
                  id: e.id,
                  sourceCompensationId: get(
                    values,
                    "sourceCompensationClassificationCategories.id",
                    0
                  ),
                  compensationCategoryId: get(
                    values,
                    "sourceCompensationClassificationCategories.compensationCategoryId",
                    0
                  ),
                  name: e.name,
                  calculationType: e.calculationType,
                })
              )
            : [];

          const setData = {
            id: get(values, "sourceCompensations.id", 0),
            compensationName: get(values, "compensationName", ""),
            isDifferAtClassificationLevel: get(
              values,
              "isDifferAtClassificationLevel"
            ),
            source_SourceCompensations: sourcesAdded.map((e) => ({
              id: e.id,
              sourceId: e.sourceId,
              sourceCompensationId: get(values, "sourceCompensations.id", 0),
            })),
            sourceCompensationCategories: addSourceCompensations,
            sourceCompensationClassifications: classificationsnew.map((e) => ({
              id: e.id,
              sourceCompensationId: get(values, "sourceCompensations.id", 0),
              employeeClassificationCodeId: e.employeeClassificationCodeId,
            })),
            sourceCompensationClassificationCategories: addSourceClassifications,
          };

          setSource([...sourCompensations, setData]);
        };
        const editCompensationClick = (e, index, item, source) => {
          setItem(source);
          console.log(source, "3woinoi3");
          e.preventDefault();
          setSubmitting(true);
          setModalOpen(true);
        };
        const editSourceCompensationClick = (e, item, index) => {
          e.preventDefault();
          setSubmitting(true);
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: item.link,
                pathParam: [FLOW_TYPES.EDIT, planId, companyId], // put the company id after crated
              })
            );
          }, 10);
        };
        console.log(classifications, "classLILst");
        const displayCompensationName = (source) => {
          var name = [];

          // !isEmpty(employeeClassifications) ? source.compensationClassifications.map((e, i) => {
          //   name.push(e.codeValue);
          // }):
          isEmpty(employeeClasificationCategoriesData)
            ? source.compensationClassifications.map((e, i) => {
                classifications.map((d, j) => {
                  console.log(d, "classificationslist");
                  console.log(e, "sourceClassificaions");
                  if (d.id === e.employeeClassificationCodeId) {
                    name.push(d.code + " - " + d.classificationName);
                  }
                });
              })
            : get(source, "compensationClassifications").map((e) =>
                name.push(e.codeValue)
              );

          console.log(name, "names");
          return name.join(",");
        };

        const displaySourceCompensationName = (source) => {
          var name = [];
          source.source_SourceCompensations.map((e, i) => {
            sourceList.map((d, j) => {
              if (d.value === e.sourceId) {
                name.push(d.label);
              }
            });
          });
          return name.join(",");
        };

        console.log(
          get(state, "employeeClasificationCategories", []),
          "employeeClasificationCategories"
        );
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <LoaderWrapper isLoading={load}>
              <ManagePlanLayout buttons={buttons} pageFlow={flow}>
                <Field
                  isRequired
                  name={fields.modeOfHoursAndCompensation}
                  label="Mode of hours and Compensation Submission"
                  type="text"
                  autoComplete="off"
                  value={values[fields.modeOfHoursAndCompensation]}
                  disabled
                  component={FieldInput}
                  size="sm"
                />
                <CommmonSourcesFields
                  {...formProps}
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                />

                <div className="w-50">
                  <p className="font-weight-500">Compensation categories</p>
                  {!isEmpty(planCategories) ? (
                    <ManageCompensationCategory
                      {...formProps}
                      category={get(values, "planCompensationCategories", {})}
                      subName={fieldNames.planCategory}
                    />
                  ) : (
                    <span>No data</span>
                  )}
                </div>

                <span>&nbsp;</span>

                <Field
                  isRequired
                  size="sm"
                  name={fields.isDifferAtClassificationLevel}
                  label={"Compensation differs for employee classification?"}
                  options={yesNoOptions}
                  selectedValue={values[fields.isDifferAtClassificationLevel]}
                  value={values[fields.isDifferAtClassificationLevel]}
                  onChange={(value) =>
                    setFieldValue(fields.isDifferAtClassificationLevel, value)
                  }
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />

                {/* <span>&nbsp;&nbsp;</span> */}

                {values[fields.isDifferAtClassificationLevel] &&
                  isEmpty(empClassifications) && (
                    <AddPlans
                      content="No employee classification added."
                      buttonLabel="Add Employee Classification"
                      className="h-auto"
                      showError={showError}
                      errorMessage="Employee Classification is required."
                      disabled={isEdit && !isSave}
                      onPrimaryClick={showPopup}
                    />
                  )}

                <SliderPanel
                  isOpen={isModalOpen}
                  size="45"
                  showCancel={false}
                  backdropClicked={closePopup}
                >
                  <div className="d-flex justify-content-between">
                    {flow === "save" ? (
                      <div className="ft-20 font-weight-500">
                        Add employee classification category
                      </div>
                    ) : (
                      <div className="ft-20 font-weight-500">
                        Edit employee classification category
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        disabled={isEdit && !isSave}
                        variant="secondary"
                        onClick={closePopup}
                      >
                        Cancel
                      </Button>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <Button
                        onClick={addEmployeeClassification}
                        type="button"
                        disabled={isEdit && !isSave}
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  <EmployeeClassificationLevel
                    {...formProps}
                    formValues={formValues}
                    subName={fieldNames.employeeClasificationCategories}
                    subClassifications={
                      fieldNames.classifications.classificationCategory
                    }
                    wholeItem={empClassificationItem}
                    planCategories={planCategories}
                    employeeClassificationCate={employeeClassificationCate}
                    fields={fields}
                    isEdit={isEdit}
                    isSave={isSave}
                  />
                  <span>&nbsp;&nbsp;</span>
                </SliderPanel>

                {!isEmpty(empClassifications) && (
                  <div className="w-50%">
                    <div className="d-flex justify-content-space-between">
                      <div className="w-50">
                        <p className="font-weight-500">
                          Employee compensation level
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline-primary"
                        disabled={isEdit && !isSave}
                        onClick={showPopup}
                      >
                        Add Classification
                      </Button>
                    </div>
                    <span>&nbsp;&nbsp;</span>
                    <div>
                      <CompensationTable className="compensation-table compensation-table_category">
                        <CompensationTable.Thead>
                          <CompensationTable.Tr>
                            {columns.map((item, index) => {
                              return (
                                <CompensationTable.Th
                                  key={index}
                                  className={item.className}
                                >
                                  {item.label}
                                </CompensationTable.Th>
                              );
                            })}
                          </CompensationTable.Tr>
                        </CompensationTable.Thead>
                        <CompensationTable.Tbody>
                          {empClassifications.map((source, index) => {
                            return (
                              <CompensationTable.Tr key={index}>
                                {columns.map((item, ind) => {
                                  console.log(source, "vwoow");
                                  return (
                                    <CompensationTable.Td
                                      key={1}
                                      className="plan-added-tables"
                                    >
                                      {!isEmpty(item.link) ? (
                                        <Link
                                          className="compensation-link"
                                          onClick={(e) =>
                                            editCompensationClick(
                                              e,
                                              item.link,
                                              index,
                                              source
                                            )
                                          }
                                        >
                                          {source.name}
                                        </Link>
                                      ) : (
                                        displayCompensationName(source)
                                      )}
                                    </CompensationTable.Td>
                                  );
                                })}
                              </CompensationTable.Tr>
                            );
                          })}
                        </CompensationTable.Tbody>
                      </CompensationTable>
                    </div>
                  </div>
                )}

                <Field
                  isRequired
                  size="sm"
                  name={fields.isPreEntry}
                  label={"Include Pre-enty compensation"}
                  options={yesNoOptions}
                  selectedValue={values[fields.isPreEntry]}
                  value={values[fields.isPreEntry]}
                  onChange={(value) => setFieldValue(fields.isPreEntry, value)}
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />

                <Field
                  isRequired
                  size="sm"
                  name={fields.isPostSeverance}
                  label={"Include Post-severance compensation"}
                  options={yesNoOptions}
                  selectedValue={values[fields.isPostSeverance]}
                  value={values[fields.isPostSeverance]}
                  onChange={(value) =>
                    setFieldValue(fields.isPostSeverance, value)
                  }
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />
                {values[fields.isPostSeverance] && (
                  <div className="w-50">
                    <p className="font-weight-500">
                      Post-severance compensation categories
                    </p>
                    <ManageCompensationCategory
                      {...formProps}
                      category={get(
                        values,
                        "postSeveranceCompensationCategories",
                        {}
                      )}
                      subName={fieldNames.postSeverence}
                    />
                    <span>&nbsp;&nbsp;</span>
                  </div>
                )}

                <Field
                  isRequired
                  size="xxl"
                  name={fields.calculationPeriod}
                  label={"Compensation Calculation Period"}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.COMPENSATION_CALCULATIONS
                  )}
                  selectedValue={values[fields.calculationPeriod]}
                  value={values[fields.calculationPeriod]}
                  onChange={(value) =>
                    setFieldValue(fields.calculationPeriod, value)
                  }
                  component={FieldButtonGroup}
                  validate={required}
                  disabled={isEdit && !isSave}
                />

                <Field
                  isRequired
                  size="sm"
                  name={fields.isDiffersForPlanSources}
                  label={"Compensation differs for plan sources?"}
                  options={yesNoOptions}
                  selectedValue={values[fields.isDiffersForPlanSources]}
                  value={values[fields.isDiffersForPlanSources]}
                  onChange={(value) =>
                    setFieldValue(fields.isDiffersForPlanSources, value)
                  }
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />

                {values[fields.isDiffersForPlanSources] &&
                  isEmpty(sourCompensations) && (
                    <AddPlans
                      content="No sources compensation added"
                      buttonLabel="Add Compensation"
                      className="h-auto"
                      disabled={isEdit && !isSave}
                      onPrimaryClick={addSourceClick}
                    />
                  )}

                {!isEmpty(sourceCompensationEdited) && (
                  <div className="w-50%">
                    <div class="d-flex justify-content-space-between">
                      <div className="w-50">
                        <p className="font-weight-500">
                          Source compensation information
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline-primary"
                        disabled={isEdit && !isSave}
                        onClick={addSourceClick}
                      >
                        Add Compensation
                      </Button>
                    </div>
                    <span>&nbsp;&nbsp;</span>
                    <div>
                      <CompensationTable className="compensation-table compensation-table_category">
                        <CompensationTable.Thead>
                          <CompensationTable.Tr>
                            {columns.map((item, index) => {
                              return (
                                <CompensationTable.Th
                                  key={index}
                                  className={item.className}
                                >
                                  {item.label}
                                </CompensationTable.Th>
                              );
                            })}
                          </CompensationTable.Tr>
                        </CompensationTable.Thead>
                        <CompensationTable.Tbody>
                          {!isEmpty(sourceCompensationEdited) &&
                            [sourceCompensationEdited].map((source, index) => {
                              console.log(source, "yujgiuhlij");
                              return (
                                <CompensationTable.Tr key={index}>
                                  {columndata.map((item, ind) => {
                                    return (
                                      <CompensationTable.Td
                                        key={1}
                                        className="plan-added-tables"
                                      >
                                        {getNullTableItem(
                                          !isEmpty(item.link) ? (
                                            <Link
                                              to={getPathWithParam({
                                                path: item.link,
                                                pathParam: [
                                                  FLOW_TYPES.EDIT,
                                                  planId,
                                                  companyId,
                                                  source.id === 0
                                                    ? index
                                                    : source.id,
                                                ],
                                              })}
                                            >
                                              {source.compensationName}
                                            </Link>
                                          ) : (
                                            displaySourceCompensationName(
                                              source
                                            )
                                          )
                                        )}
                                      </CompensationTable.Td>
                                    );
                                  })}
                                </CompensationTable.Tr>
                              );
                            })}
                        </CompensationTable.Tbody>
                      </CompensationTable>
                    </div>
                  </div>
                )}
              </ManagePlanLayout>
            </LoaderWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ManageCompensationContainer;
