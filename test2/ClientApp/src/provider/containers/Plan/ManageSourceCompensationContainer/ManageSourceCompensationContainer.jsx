import React, { useContext, useEffect, useState } from "react";
import { get, isEmpty, values, isEqual, constant } from "lodash";
import { Form } from "react-bootstrap";
import { faCheck, faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Field, FieldArray } from "formik";
import { Button } from "react-bootstrap";
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
  SearchableList,
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
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanLocalCache,
  clearLocalCacheByModel,
  setManagePlanLoader,
} from "../../../contexts";
import { useDeepEffect, useRequest, useRouterParams } from "../../../abstracts";

import {
  getPlanCompensationCategories,
  getClassificationCodes,
} from "../../../services";
import * as Yup from "yup";

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
    link: MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION,
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
  sourceCompensations: "sourceCompensationCategories",
  sourceClassficationCompensations:
    "sourceCompensationClassificationCategories",
};

const ManageSourceCompensationContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  console.log(state);
  const { flow, planId, companyId, sourceId } = useRouterParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  //const [newFlow, setNewFlow] = useState(compensationId ? flow : "");
  const sourceID = parseInt(sourceId);
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
  const [showError, setShowError] = useState(false);
  const formValues = get(state, `api.data.compensation`, {});
  // const planId = get(state, "api.data.id");
  // const companyId = get(state, "api.data.companyId");
  const [planCategories, setPlanCategories] = useState([]);
  const sourceCompensationData = !isEmpty(
    get(formValues, "sourceCompensations", [])
  )
    ? get(formValues, "sourceCompensations", [])
    : get(state, "sourceCompensations", []);
  //const sourceCompensationData = sourceCompensationDetails.filter(e => e.id === sourceID);
  const [employeeClassificationCate, setCate] = useState([]);
  const [load, setLoad] = useState(true);

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
  const sourceCompensationName = tranformListToDropdownValues(
    get(sourceCompensationData, "source_SourceCompensations", []),
    "sourceName",
    "sourceId"
  );
  const sourceClassification = tranformListToDropdownValues(
    get(
      sourceCompensationData,
      "sourceEmployeeClassificationViewModel.sourceCompensationClassifications",
      []
    ),
    "label",
    "employeeClassificationCodeId"
  );

  const [classificationsList, setClassifications] = useState([]);
  const [classifications, setClassificationList] = useState([]);
  const alreadyExists = (value) => {
    var res = false;
    if (value != null && value != undefined && value != "") {
      return !sourceCompensationData.some(
        (_, index) => _.compensationName === value && index != sourceID
      );
    }
    return false;
  };
  const validationSchema = Yup.object().shape({
    compensationName: Yup.string()
      .required("Required")
      .max(128, "compensation name length should not exceed 128 characters")
      .matches(
        "^[A-Za-z0-9_ ]+$",
        "Compensation name can contain alphabets, numbers , space and underscore."
      )
      .test("compensationName", "compensation name already exists", (value) =>
        alreadyExists(value)
      ),
  });

  useEffect(() => {
    getClassificationCodes(companyId)
      .then((res) => {
        if (res) {
          setClassificationList(res);
          setClassifications(
            res.map((val) => ({
              label: val.classificationName,
              value: val.id,
            }))
          );
        }
      })
      .catch((err) => err);
    getPlanCompensationCategories(companyId)
      .then((res) => {
        if (res) {
          setPlanCategories(() =>
            res.map((e) => ({ id: e.id, name: e.name, calculationType: 1 }))
          );
          setLoad(false);
        }
      })
      .catch((err) => err);
  }, [companyId]);

  const onDeleteClick = () => {
    // savePlanDetailsAction(
    //   {
    //     eligibilityRules: eligibilityListData,
    //   },
    //   dispatch,
    //   state
    // ).then((response) => {
    //   if (response.isSuccessful) {
    //     //const newPlanId = get(response, "plan.id");
    //     history.push(
    //       getPathWithParam({
    //         path: MANAGE_PLAN_ROUTES.ELIGIBILITY,
    //         pathParam: [FLOW_TYPES.EDIT, planId],
    //       })
    //     );
    //     clearCache();
    //   }
    // });
  };

  const clearCache = () => {
    dispatch(clearLocalCacheByModel(""));
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION,
        pathParam: [FLOW_TYPES.ADD, planId, companyId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      onClick: clearCache,
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
        path: MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION,
        pathParam: [planId, companyId],
      }),
      onClick: clearCache,
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
            path: MANAGE_PLAN_ROUTES.MANAGE_SOURCE_COMPENSATION,
            pathParam: [FLOW_TYPES.SAVE, planId, companyId],
          })
        ),
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE],
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
  const [classificationItem, setItem] = useState([]);
  const getDataForSave = (values) => {
    const sourceSelection = [
      ...transformToMultiselectSave(
        (values[sourceFields.source_SourceCompensations] || []).filter(
          (val) =>
            !get(formValues, sourceFields.source_SourceCompensations, [])
              .map((_) => _.id)
              .includes(val)
        ),
        "sourceId"
      ),
      ...get(
        formValues,
        sourceFields.source_SourceCompensations,
        []
      ).filter((val) =>
        (values[sourceFields.source_SourceCompensations] || []).includes(val.id)
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

    const sourceData = {
      id: get(values, "id", 0),
      compensationName: get(values, "compensationName", ""),
      compensationId: get(formValues, "id", 0),
      definition: get(values, "definition", 0),

      isDifferAtClassificationLevel: get(
        values,
        "isDifferAtClassificationLevel",
        []
      ),
      isPreEntry: get(values, "isPreEntry", []),
      source_SourceCompensations: sourceSelection.map((e) => ({
        id: get(values, "sourceCompensations.source_SourceCompensations.id", 0),
        sourceId: e.sourceId,
        sourceCompensationId: get(values, "sourceCompensations.id", 0),
      })),
      sourceCompensationCategories: addSourceCompensations,
      sourceEmployeeClassificationViewModel: empClassifications,
    };

    console.log(sourceData, "sourceData");
    return sourceData;
  };

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    dispatch(
      setManagePlanLocalCache({
        model: "sourceCompensations",
        data: getDataForSave(values),
      })
    );
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_COMPENSATION,
        pathParam: [flow, planId, companyId],
      })
    );
  };

  const addSourceClick = () => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCE_COMPENSATION,
        pathParam: [FLOW_TYPES.EDIT, planId],
      })
    );
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;

  const showPopup = () => {
    setModalOpen(true);
  };

  const closePopup = () => {
    setModalOpen(false);
  };

  const [empClassifications, setEmpClassifications] = useState([]);

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...sourceCompensationData,
        [sourceFields.source_SourceCompensations]: sourceCompensationName,
        sourceCompensationCategories: isEmpty(sourceCompensationData)
          ? planCategories
          : get(sourceCompensationData, "sourceCompensationCategories"),
        sourceCompensationClassificationCategories: planCategories,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={validationSchema}
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

        const addEmployeeClassification = () => {
          closePopup();
          const classificationsnew = [
            ...transformToMultiselectSave(
              (get(values, "employeeClassifications") || []).filter(
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
            id: get(
              values,
              "sourceCompensations.sourceEmployeeClassificationViewModel.id",
              0
            ),
            name: get(values, "name"),
            sourceCompensationId: get(values, "id", 0),
            sourceCompensationClassifications: classificationsnew.map((e) => ({
              id: get(
                values,
                "sourceCompensations.sourceEmployeeClassificationViewModel.sourceCompensationClassifications.id",
                0
              ),
              sourceEmployeeClassificationId: get(
                values,
                "sourceCompensations.sourceEmployeeClassificationViewModel.id",
                0
              ),
              employeeClassificationCodeId: e.employeeClassificationCodeId,
            })),
            sourceCompensationClassificationCategories: addSourceClassifications,
          };

          setEmpClassifications([...empClassifications, setData]);
          console.log(setData, "setData");
        };
        console.log(values, "souenceaw");
        const editCompensationClick = (e, item, index, source) => {
          setItem(source);
          e.preventDefault();
          setSubmitting(true);
          setModalOpen(true);
          // window.setTimeout(() => {
          //   history.push(
          //     getPathWithParam({
          //       path: item.link,
          //       pathParam: [FLOW_TYPES.EDIT, planId, companyId], // put the company id after crated
          //     })
          //   );
          // }, 10);
        };
        const displayCompensationName = (source) => {
          var name = [];
          source.sourceCompensationClassifications.map((e, i) => {
            classifications.map((d, j) => {
              if (d.id === e.employeeClassificationCodeId) {
                name.push(d.classificationName + " - " + d.code);
              }
            });
          });
          console.log(name, "names");
          return name.join(",");
        };
        console.log(classifications, "classLIst");
        console.log(empClassifications.length, "wfnoiwnowifjowi");
        console.log(empClassifications, "emp");

        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <LoaderWrapper>
              <ManagePlanLayout buttons={buttons} pageFlow={flow}>
                <Field
                  isRequired
                  name={sourceFields.compensationName}
                  label={"Category Name"}
                  hasSuggestion
                  isSuggestionLoading={false}
                  type="text"
                  autoComplete="off"
                  value={values[sourceFields.compensationName]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInput}
                  validate={required}
                />

                <Field
                  size="md"
                  isRequired
                  label="Source Name"
                  options={sourceList}
                  name={sourceFields.source_SourceCompensations}
                  value={toMultiSelectValueById(
                    values[sourceFields.source_SourceCompensations],
                    sourceList
                  )}
                  disabled={isEdit && !isSave}
                  isMultiSelect
                  popupContent={
                    <MultiSelectDropdown
                      label="Select source"
                      options={sourceList}
                      onSelect={(value) =>
                        setFieldValue(
                          sourceFields.source_SourceCompensations,
                          value
                        )
                      }
                      name={sourceFields.source_SourceCompensations}
                      value={values[sourceFields.source_SourceCompensations]}
                      disabled={isEdit && !isSave}
                    />
                  }
                  // validate={required}
                  component={FieldDropSide}
                />

                <Field
                  isRequired
                  name={fields.definition}
                  label="Compensation Definition"
                  value={values[fields.definition]}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.COMPENSATION_DEFINITIONS
                  )}
                  popupContent={
                    <SearchableList
                      isRadio
                      isNotTypeAhead
                      label="Select a Compensation Definition"
                      selectedValue={values[fields.definition]}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.COMPENSATION_DEFINITIONS
                      )}
                      onSelect={(value) =>
                        setFieldValue(fields.definition, value)
                      }
                    />
                  }
                  disabled={isEdit && !isSave}
                  component={FieldDropSide}
                  validate={required}
                />

                <span>&nbsp;&nbsp;</span>
                <div className="w-50">
                  <p className="font-weight-500">Compensation categories</p>

                  <ManageCompensationCategory
                    {...formProps}
                    category={get(values, "sourceCompensationCategories", {})}
                    subName={fieldNames.sourceCompensations}
                  />
                </div>
                <span>&nbsp;&nbsp;</span>

                <Field
                  isRequired
                  size="sm"
                  name={sourceFields.isDifferAtClassificationLevel}
                  label={"Compensation differs for employee classification?"}
                  options={yesNoOptions}
                  selectedValue={
                    values[sourceFields.isDifferAtClassificationLevel]
                  }
                  value={values[sourceFields.isDifferAtClassificationLevel]}
                  onChange={(value) =>
                    setFieldValue(
                      sourceFields.isDifferAtClassificationLevel,
                      value
                    )
                  }
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />

                {values[fields.isDifferAtClassificationLevel] &&
                  isEmpty(
                    get(
                      sourceCompensationData,
                      "sourceEmployeeClassificationViewModel",
                      []
                    )
                  ) &&
                  isEmpty(empClassifications) && (
                    <AddPlans
                      content="No employee classification added."
                      buttonLabel="Add Classification"
                      className="h-auto"
                      showError={showError}
                      errorMessage="Employee Classification is required."
                      disabled={isEdit && !isSave}
                      onPrimaryClick={showPopup}
                    />
                  )}
                {!isEmpty(
                  get(
                    sourceCompensationData,
                    "sourceEmployeeClassificationViewModel",
                    []
                  )
                ) &&
                  isEmpty(empClassifications) && (
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
                            {!isEmpty(
                              get(
                                sourceCompensationData,
                                "sourceEmployeeClassificationViewModel",
                                []
                              )
                            )
                              ? get(
                                  sourceCompensationData,
                                  "sourceEmployeeClassificationViewModel",
                                  []
                                ).map((source, index) => {
                                  return (
                                    <CompensationTable.Tr key={index}>
                                      {columns.map((item, ind) => {
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
                                })
                              : null}
                          </CompensationTable.Tbody>
                        </CompensationTable>
                      </div>
                    </div>
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

                  <Field
                    isRequired
                    name={fields.categoryName}
                    label={"Category Name"}
                    hasSuggestion
                    isSuggestionLoading={false}
                    type="text"
                    autoComplete="off"
                    value={classificationItem.name}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                    validate={required}
                  />

                  <Field
                    size="md"
                    isRequired
                    label="Excluded Employee Classifications"
                    options={classificationsList}
                    name={fields.employeeClassifications}
                    value={toMultiSelectValueById(
                      sourceClassification,
                      classificationsList
                    )}
                    disabled={isEdit && !isSave}
                    isMultiSelect
                    popupContent={
                      <MultiSelectDropdown
                        label="Select employee classifications"
                        options={classificationsList}
                        onSelect={(value) =>
                          setFieldValue(fields.employeeClassifications, value)
                        }
                        name={fields.employeeClassifications}
                        value={sourceClassification}
                        disabled={isEdit && !isSave}
                      />
                    }
                    // validate={required}
                    component={FieldDropSide}
                  />
                  <span>&nbsp;&nbsp;</span>

                  <div className="w-75">
                    <p className="font-weight-500">Compensation categories</p>

                    <ManageCompensationCategory
                      {...formProps}
                      category={get(
                        values,
                        "sourceCompensationClassificationCategories",
                        {}
                      )}
                      subName={fieldNames.sourceClassficationCompensations}
                    />
                  </div>
                  <span>&nbsp;&nbsp;</span>
                </SliderPanel>

                <span>&nbsp;&nbsp;</span>
                <Field
                  isRequired
                  size="sm"
                  name={sourceFields.isPreEntry}
                  label={"Include Pre-enty compensation"}
                  options={yesNoOptions}
                  selectedValue={values[sourceFields.isPreEntry]}
                  value={values[sourceFields.isPreEntry]}
                  onChange={(value) =>
                    setFieldValue(sourceFields.isPreEntry, value)
                  }
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />
              </ManagePlanLayout>
            </LoaderWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ManageSourceCompensationContainer;
