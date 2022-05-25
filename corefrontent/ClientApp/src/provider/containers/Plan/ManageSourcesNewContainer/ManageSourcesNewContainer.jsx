import React, { useRef, useContext } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import { get, isEmpty, union } from "lodash";
import {
  faPencilAlt,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import {
  ManagePlanLayout,
  AddPlans,
  AddButton,
  CsplTable as Table,
  Link,
} from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  managePlanFormNames,
  formFields,
  usDateFormat,
  getSaveMessage,
  SOURCE_CATEGORY_NAME_MAPPING,
  toFormValue,
  toApiValue,
  getAdvancedPathWithParam,
  getNumber,
} from "../../../utils";
import { useDeepEffect, useRouterParams } from "../../../abstracts";
import AllocationRulesForm from "./AllocationRulesForm";
import BasicInformationForm from "./BasicInformationForm";
import {
  clearLocalCacheByModel,
  createPlanStore,
  savePlanDetailsAction,
  setManagePlanLocalCache,
  setManagePlanToastInfo,
} from "../../../contexts";
import AddToolTip from "../../../components/AddToolTip";

const columns = [
  {
    label: "Description",
    className: "column-rules-description",
    columnName: "allocationFormulaDescription",
    link: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_ADD_ADDITIONAL_RULES,
  },
  {
    label: "Effective Start Date",
    className: "column-rule-effectivestartdate",
    columnName: "allocationEffectiveStartDate",
    type: "date",
  },
];

const ManageSourcesNewContainer = (props) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { history } = props;
  const additionalRulesTableRef = useRef(null);
  const { flow, planId, sourceId } = useRouterParams();
  const formName = managePlanFormNames.BASIC_SOURCES;
  const fields = formFields[formName];
  const intSourceId = parseInt(sourceId, 10);
  const newFlow = sourceId ? FLOW_TYPES.EDIT : "";
  const sourcesApiData = get(state, "api.data.sources", []);
  const sourcesListData = get(state, "sources", sourcesApiData);
  const formValues = get(sourcesListData, intSourceId, {});
  const sourceCategory = get(formValues, "sourceCategory", 0);
  const isDeferral = sourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Deferral;
  const isEmployerDiscretionary =
    sourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Discretionary;
  const isEmployerMatch = sourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Match;

  const employeeDeferralSource = get(formValues, "employeeDeferralSource", {});
  const employerMatchSource = get(formValues, "employerMatchSource", {});

  const employerDiscretionarySource = get(
    formValues,
    "employerDiscretionarySource",
    {}
  );
  const additionalAllocationRulesData = isDeferral
    ? get(employeeDeferralSource, "additionalDeferralSource", [])
    : isEmployerMatch
    ? get(employerMatchSource, "additionalMatchSources", [])
    : isEmployerDiscretionary
    ? get(employerDiscretionarySource, "additionalDiscretionarySources", [])
    : [];

  const goBack = () => {
    dispatch(clearLocalCacheByModel("sources"));
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES,
        pathParam: [FLOW_TYPES.EDIT, planId],
      })
    );
  };
  const onDeleteClick = () => {
    savePlanDetailsAction(
      {
        sources: sourcesListData.filter((item, index) => index != intSourceId),
      },
      dispatch,
      state
    ).then((response) => {
      dispatch(
        setManagePlanToastInfo({
          showToast: true,
          toastMessage: `Source deleted successfully`,
        })
      );
      goBack();
    });
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
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_HISTORY,
        pathParam: [flow, planId, sourceId],
      }),
      label: "History",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      className: "color-black f-1rem",
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
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_NEW,
            pathParam: [FLOW_TYPES.SAVE, planId, sourceId],
          })
        ),
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
    const updatedValues = toApiValue(
      {
        ...formValues,
        ...values,
        sourceCategory: values[fields.sourceCategory] || undefined,
        sourceSubCategory: values[fields.sourceSubCategory] || undefined,

        sourceSubSubCategory: values[fields.sourceSubSubCategory] || undefined,
        //limitMaximum: values[fields.limitMaximum] || null,
        //limitMinimum: values[fields.limitMinimum] || null,
        // maximumDollarCompensation:
        //   values[fields.maximumDollarCompensation] || null,
        rehireDeferralPercentage:
          values[fields.rehireDeferralPercentage] || null,
        [fields.percentageOfCalculation]: getNumber(
          values[fields.percentageOfCalculation]
        ),
        [fields.percentageOfCompensation]: getNumber(
          values[fields.percentageOfCompensation]
        ),
        [fields.enhancedshMatchPercentage]: getNumber(
          values[fields.enhancedshMatchPercentage]
        ),
        [fields.uptoPercentageOfDeferral]: getNumber(
          values[fields.uptoPercentageOfDeferral]
        ),
      },
      fields,
      formValues
    );
    if (isEmpty(formValues)) {
      return [...sourcesListData, updatedValues];
    }

    return sourcesListData.map((item, index) => {
      if (index === intSourceId) {
        return { ...item, ...updatedValues };
      }
      return item;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    savePlanDetailsAction(
      {
        sources: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES,
            pathParam: [FLOW_TYPES.EDIT, planId],
          })
        );

        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: getSaveMessage(
              sourceId,
              `New Source ${values[fields.sourceName]} has been created`
            ),
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

  const onAdditionalRulesClick = () => {
    if (additionalRulesTableRef.current) {
      additionalRulesTableRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  // const initialValues = {
  //   [fields.isSafeHarbourMatch]: false,
  // };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  const layoutHeader = sourceId && "Source";
  return (
    <Formik
      initialValues={{
        [fields.isThresholdApplicable]: true,
        ...toFormValue(formValues, fields),
        [fields.contributionType]: get(
          employeeDeferralSource,
          "contributionType",
          []
        ),
        [fields.additionalDeferralSource]: get(
          employeeDeferralSource,
          "additionalDeferralSource",
          []
        ),
        [fields.additionalMatchSources]: get(
          employerMatchSource,
          "additionalMatchSources",
          []
        ),
        [fields.additionalDiscretionarySources]: get(
          employerDiscretionarySource,
          "additionalDiscretionarySources",
          []
        ),
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
          setSubmitting,
          ...rest
        } = formProps;
        const isEmployee = parseInt(values[fields.sourceType], 10) !== 2;
        const isCore = parseInt(values[fields.responsibleMode], 10) === 2;
        const isValidate = parseInt(values[fields.responsibleMode], 10) === 3;
        const isEmployerAdiApplicableDiscretionary =
          parseInt(values[fields.sourceCategory], 10) !==
          SOURCE_CATEGORY_NAME_MAPPING.EmployerOther;

        const hasAdditionalRules =
          parseInt(values[fields.sourceCategory], 10) ===
            SOURCE_CATEGORY_NAME_MAPPING.Deferral ||
          (!isEmployee && isCore && isEmployerAdiApplicableDiscretionary) ||
          (!isEmployee && isValidate && isEmployerAdiApplicableDiscretionary);
        const onAddClick = () => {
          setSubmitting(true);
          // const updatedData = union(sourcesListData, [
          //   toApiValue(values, fields),
          // ]);
          // const updatedData = union(sourcesListData, [
          //   { ...values, id: get(formValues, "id", undefined) },
          // ]);
          let updatedData = [];
          if (sourceId) {
            sourcesListData[sourceId] = {
              //...formValues,
              ...sourcesListData[sourceId],
              ...toApiValue({ ...formValues, ...values }, fields, formValues),
            };
            updatedData = sourcesListData;
          } else {
            updatedData = [
              ...sourcesListData,
              toApiValue({ ...formValues, ...values }, fields, formValues),
            ];
          }
          const newSourceId =
            sourceId === undefined ? updatedData.length - 1 : sourceId;
          dispatch(
            setManagePlanLocalCache({
              model: "sources",
              data: updatedData,
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: MANAGE_PLAN_ROUTES.MANAGE_SOURCES_ADD_ADDITIONAL_RULES,
                pathParam: [planId, newSourceId],
              })
            );
          }, 10);
        };

        const onEditAdditionRule = (item, index) => {
          setSubmitting(true);
          let updatedData = [];
          if (sourceId) {
            sourcesListData[sourceId] = {
              //...formValues,
              ...sourcesListData[sourceId],
              ...toApiValue({ ...formValues, ...values }, fields, formValues),
            };
            updatedData = sourcesListData;
          } else {
            updatedData = [
              ...sourcesListData,
              toApiValue({ ...formValues, ...values }, fields, formValues),
            ];
          }
          dispatch(
            setManagePlanLocalCache({
              model: "sources",
              data: updatedData,
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: item.link,
                pathParam: [
                  flow,
                  planId,
                  intSourceId, // TODO: To map as sourceId,
                  index,
                ],
              })
            );
          }, 10);
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
              <div className="d-flex">
                <div className="plan-heading">Basic Source Information</div>
                {hasAdditionalRules && (
                  <div className="ml-auto">
                    <Button
                      type="button"
                      variant="link"
                      onClick={onAdditionalRulesClick}
                      className="color-black f-1rem"
                    >
                      Additional Allocation Rules
                    </Button>
                  </div>
                )}
              </div>
              <Row>
                <Col>
                  <BasicInformationForm
                    {...formProps}
                    fields={fields}
                    isEdit={isEdit}
                    isSave={isSave}
                    hasAdditionalRules={hasAdditionalRules}
                  />

                  {values[fields.sourceCategory] != undefined ||
                  values[fields.sourceCategory] != null ? (
                    <>
                      <div className="line-separator"></div>
                      <AllocationRulesForm
                        {...formProps}
                        fields={fields}
                        isEdit={isEdit}
                        isSave={isSave}
                      />
                    </>
                  ) : null}
                  {hasAdditionalRules && (
                    <div
                      className="add-additional-allocation-rules"
                      ref={additionalRulesTableRef}
                    >
                      <Row>
                        <Col>
                          <div className="w-100 bg-white p-3 mt-5">
                            <div className="d-flex align-items-center">
                              <h5 className="m-0">
                                Additional Allocation Rules
                              </h5>
                              <div className="ml-auto">
                                <AddButton
                                  onAddClick={onAddClick}
                                  disabled={isEdit && !isSave}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      {isEmpty(additionalAllocationRulesData) && (
                        <Row className="mt-2">
                          <Col>
                            <AddPlans
                              content="No additional allocation rules have been created for this source"
                              buttonLabel="Add Allocation Rule"
                              onPrimaryClick={onAddClick}
                              disabled={isEdit && !isSave}
                            />
                          </Col>
                        </Row>
                      )}
                      {!isEmpty(additionalAllocationRulesData) && (
                        <Row className="mt-2">
                          <Col>
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
                                {additionalAllocationRulesData.map(
                                  (rule, index) => {
                                    return (
                                      <Table.Tr key={index}>
                                        {columns.map((item, cellIndex) => {
                                          return (
                                            <Table.Td
                                              key={cellIndex}
                                              className={item.className}
                                            >
                                              {!isEmpty(item.link) ? (
                                                <AddToolTip>
                                                  <Link
                                                    onClick={() =>
                                                      onEditAdditionRule(
                                                        item,
                                                        index
                                                      )
                                                    }
                                                  >
                                                    {rule[item.columnName]}
                                                  </Link>
                                                </AddToolTip>
                                              ) : item.type === "date" ? (
                                                usDateFormat(
                                                  rule[item.columnName]
                                                )
                                              ) : (
                                                rule[item.columnName]
                                              )}
                                            </Table.Td>
                                          );
                                        })}
                                      </Table.Tr>
                                    );
                                  }
                                )}
                              </Table.Tbody>
                            </Table>
                          </Col>
                        </Row>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ManageSourcesNewContainer;
