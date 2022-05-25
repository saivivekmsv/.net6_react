import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Formik, Field } from "formik";
import {
  faPencilAlt,
  faTimes,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { ExcludedEmployeeClassficationFields } from "./ExcludedEmployeeClassification";
import { WindowPeriodFields } from "./WindowPeriod";
import { DeferralElection } from "./DeferralElection";
import { isEmpty, get, indexOf, uniqBy } from "lodash";
import {
  FieldButtonGroup,
  LoaderWrapper,
  AddPlans,
  CsplTable as Table,
  Link,
} from "../../../components";
import {
  FLOW_TYPES,
  MANAGE_PLAN_ROUTES,
  getPathWithParam,
  managePlanFormNames,
  formFields,
  yesNoOptions,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  returnOnlyIfBoolean,
  ENROLLMENT_DROPDOWN_OPTIONS,
  INVESTMENTS_BASED_ON,
  getAdvancedPathWithParam,
} from "../../../utils";
import {
  createPlanStore,
  setManagePageLevelData,
  setManagePlanLocalCache,
  setManagePlanToastInfo,
  clearLocalCacheByModel,
} from "../../../contexts";
import {
  useRouterParams,
  useRequest,
  useTableChecboxSelect,
  useDeepEffect,
} from "../../../abstracts";
import {
  getPlanSourceInformation,
  getAutoEnrollment,
  getPlanInvestments,
  getAdditionalAutoEnrollment,
} from "../../../services";
import InvestmentElectionFields from "./InvestmentElection";

// let investmentElection=[

// ]
const formName = managePlanFormNames.ADD_AUTO_ENROLLMENT;
const fields = formFields[formName];
const initialValues = {
  autoEnrollmentDeferralSources: [
    {
      id: 0,
      deferralSourceName: null,
      limitMaximum: 0,
      limitMinimum: 0,
    },
  ],
  autoEnrollmentInvestmentElections: [
    {
      investmentName: null,
    },
  ],
  autoEnrollmentSouceInvestmentElections: [
    [
      //investmentElection=
      {
        investmentName: null,
      },
    ],
  ],
  categorywiseInvestments: [
    [
      {
        investmentName: null,
      },
    ],
  ],
  differentInvestmentElection: [
    [
      [
        {
          investmentName: null,
        },
      ],
    ],
  ],
};

const columns = [
  {
    label: "Enrollment Description",
    className: "column-addtional-Enrollment-description",
    columnName: "enrollmentDescription",
  },
  {
    label: "Action",
    className: "column-action",
    columnName: "action",
    link: MANAGE_PLAN_ROUTES.ADDITIONAL_AUTO_ENROLLMENT,
  },
];

export const AutoEnrollment = (props) => {
  const {
    history,
    setAvalues,
    getDefaultElection,
    setAdditionalAutoEnrollment,
    setToggle,
    planId,
    isEdit,
    isSave,
    setValues,
    toggle,
  } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { flow, fundId } = useRouterParams();
  const [newFlow, setNewFlow] = useState(fundId ? FLOW_TYPES.EDIT : "");

  //const [autoEnrollment, setAutoEnrollment] = useState({});
  const [inputFields, setInputFields] = useState([
    { from: "", to: "", subjecttoAutoEnrollment: "N" },
  ]);
  const apiData = get(state, "api.data", {});
  let formValues = {};
  const enrollment = get(state, "api.data.enrollment", {});
  const autoEnrollment =
    get(enrollment, "autoEnrollment", {}) === null
      ? {}
      : get(enrollment, "autoEnrollment", {});
  //formValues=autoEnrollment;

  const { response: AdditionalAutoEnrollment } = useRequest({
    method: getAdditionalAutoEnrollment,
    payload: planId,
    defaultResponse: [],
  });

  const additionalEnrollmentRules = isEmpty(
    get(state, "AdditionalAutoEnrollment", [])
  )
    ? []
    : get(state, "AdditionalAutoEnrollment", []);
  var uniq = uniqBy(
    [...AdditionalAutoEnrollment, ...additionalEnrollmentRules],
    "enrollmentDescription"
  );

  //  console.log(state,'st')
  //  console.log(uniq)
  useDeepEffect(() => {
    dispatch(
      setManagePlanLocalCache({
        model: "AdditionalAutoEnrollment",
        data: uniq,
      })
    );
    //}
  }, [AdditionalAutoEnrollment]);

  const [DateFields, setDateFields] = useState([{ from: "", to: "" }]);
  const [investmentListedit, setinvestmentListedit] = useState([]);

  const { response: investmentList } = useRequest({
    method: getPlanInvestments,
    payload: planId,
    defaultResponse: [],
  });

  const { response: sourcesList } = useRequest({
    method: getPlanSourceInformation,
    payload: planId,
  });
  console.log(sourcesList);
  // useDeepEffect(() => {
  //   getAutoEnrollment(planId).then((response) => setAutoEnrollment(response));
  // }, [isEdit]);

  const clearCache = () => {
    dispatch(clearLocalCacheByModel("AutoEnrollment"));
  };

  if (!isEmpty(autoEnrollment) && autoEnrollment !== null)
    formValues = autoEnrollment;

  const goBack = () => {
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.MANAGE_FUNDING,
        pathParam: planId,
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

  useDeepEffect(() => {
    setAdditionalAutoEnrollment(additionalEnrollmentRules);
  }, [additionalEnrollmentRules]);
  // useDeepEffect(() => {
  //   setAvalues(values);
  // }, [toggle]);
  return (
    <div>
      <Formik
        initialValues={{
          ...initialValues,
          [fields.subjecttoAutoEnrollment]: false,
          [fields.minimumWithdrawallimit]: 3,
          [fields.isAutoReEnroll]: false,
          [fields.usePlanDefaultInvestmentElection]: false,
          [fields.sameInvestmentElectionToAllParticipants]: true,
          [fields.sameInvestmentElectionToAllSources]: true,
          ...formValues,

          [fields.excludedEmploymentStatuses]: isEmpty(
            formValues.excludedEmploymentStatuses
          )
            ? null
            : formValues.excludedEmploymentStatuses?.map(
                (val, ind) => val.employmentStatusCode
              ),
          [fields.excludedEmployeeClassifications]: isEmpty(
            formValues.excludedEmployeeClassifications
          )
            ? null
            : formValues.excludedEmployeeClassifications?.map(
                (val, ind) => val.code
              ),
        }}
        enableReinitialize
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
          const onDaySelected = (fieldName, value) => {
            setFieldValue(fieldName, value);
          };
          console.log(values);
          const excludedEmploymentStatuses =
            ENROLLMENT_DROPDOWN_OPTIONS.EXCLUDED_EMPLOYEMENT_STATUS;
          const excludedEmployeeClassifications =
            ENROLLMENT_DROPDOWN_OPTIONS.EXCLUDED_EMPLOYEE_CLASSIFICATION;
          const selectedexcludedEmploymentStatuses =
            values[fields.excludedEmploymentStatuses];
          const selectedExcludedEmployeeClassifications =
            values[fields.excludedEmployeeClassifications];

          setinvestmentListedit(investmentList);

          setAvalues(values);
          //setAdditionalAutoEnrollment(additionalEnrollmentRules);
          const addAdditionalEnrollmentClick = () => {
            const additionalEnrollmentId = (additionalEnrollmentRules || [])
              .length;
            dispatch(
              setManagePlanLocalCache({
                model: "AutoEnrollment",
                data: values,
              })
            );
            window.setTimeout(() => {
              history.push(
                getAdvancedPathWithParam({
                  path: MANAGE_PLAN_ROUTES.ADDITIONAL_AUTO_ENROLLMENT,
                  pathParam: [FLOW_TYPES.ADD, planId],
                  queryParam: ["?id=" + additionalEnrollmentId],
                })
              );
            }, 10);
          };

          const editAdditionalEnrollmentRuleClick = (index) => {
            setSubmitting(true);
            window.setTimeout(() => {
              history.push(
                getPathWithParam({
                  path: MANAGE_PLAN_ROUTES.ADDITIONAL_AUTO_ENROLLMENT,
                  pathParam: [FLOW_TYPES.EDIT, planId],
                  queryParam: ["?id=" + index],
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
              <Row>
                {" "}
                <Col>
                  {" "}
                  <div className="plan-sub-heading mt-0"></div>{" "}
                </Col>
              </Row>
              <Row>
                {" "}
                <Col>
                  {" "}
                  <div className="plan-sub-heading mt-0">
                    Auto Enrollment
                  </div>{" "}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    isRequired
                    name={fields.subjecttoAutoEnrollment}
                    label="Subject to Auto-Enrollment"
                    size="sm"
                    options={yesNoOptions}
                    selectedValue={returnOnlyIfBoolean(
                      values[fields.subjecttoAutoEnrollment]
                    )}
                    onChange={(value) => {
                      setFieldValue(fields.subjecttoAutoEnrollment, value);
                    }}
                    disabled={isEdit && !isSave}
                    value={values[fields.subjecttoAutoEnrollment]}
                    component={FieldButtonGroup}
                  />
                  {values[fields.subjecttoAutoEnrollment] === true ? (
                    <>
                      <Field
                        label="Minimum withdrawal limit"
                        name={fields.minimumWithdrawallimit}
                        options={toOptionValuesFromMapper(
                          OPTIONS_DATA_MAPPER.MINIMUM_WITHDRAWAL_LIMIT
                        )}
                        component={FieldButtonGroup}
                        selectedValue={values[fields.minimumWithdrawallimit]}
                        onChange={(value) => {
                          setFieldValue(fields.minimumWithdrawallimit, value);
                        }}
                        disabled={isEdit && !isSave}
                        size="smd"
                      />
                      <Field
                        isRequired
                        name={fields.isAutoReEnroll}
                        label="Auto re-enroll"
                        size="sm"
                        options={yesNoOptions}
                        selectedValue={returnOnlyIfBoolean(
                          values[fields.isAutoReEnroll]
                        )}
                        onChange={(value) => {
                          setFieldValue(fields.isAutoReEnroll, value);
                        }}
                        disabled={isEdit && !isSave}
                        component={FieldButtonGroup}
                      />
                      {values[fields.isAutoReEnroll] === true ? (
                        <Field
                          label="Optout Reset Frequency"
                          name={fields.frequencyOptoutIndicator}
                          options={toOptionValuesFromMapper(
                            OPTIONS_DATA_MAPPER.OPTOUT_RESET_FREQUENCY
                          )}
                          component={FieldButtonGroup}
                          selectedValue={
                            values[fields.frequencyOptoutIndicator]
                          }
                          onChange={(value) => {
                            setFieldValue(
                              fields.frequencyOptoutIndicator,
                              value
                            );
                          }}
                          disabled={isEdit && !isSave}
                          size="smd"
                        />
                      ) : null}
                      <p className="font-weight-500 text-black">
                        {" "}
                        Window Period
                      </p>
                      <div>
                        <WindowPeriodFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                          autoEnrollment={autoEnrollment}
                        />
                      </div>

                      <p className="font-weight-500 text-black">Exclusions</p>
                      <div>
                        <ExcludedEmployeeClassficationFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                          autoEnrollment={autoEnrollment}
                          //employeeClassification={employeeClassification}
                          planId={planId}
                        />
                      </div>
                      <div></div>
                      <p className="font-weight-500 text-black">
                        Deferral Election
                      </p>
                      <div>
                        <DeferralElection
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                          sourcesList={sourcesList}
                          getDefaultElection={getDefaultElection}
                          autoEnrollment={autoEnrollment}
                        />
                      </div>

                      <p className="font-weight-500 text-black">
                        Investment Election
                      </p>
                      <div>
                        <InvestmentElectionFields
                          {...formProps}
                          fields={fields}
                          isEdit={isEdit}
                          isSave={isSave}
                          sourcesList={sourcesList}
                          investmentList={investmentList}
                          getDefaultElection={getDefaultElection}
                          setToggle={setToggle}
                          autoEnrollment={autoEnrollment}
                          planId={planId}
                        />
                      </div>

                      {!isEmpty(additionalEnrollmentRules) ? (
                        <div>
                          <div className="d-flex justify-content-between bg-title">
                            <p
                              className="font-weight-500 text-black"
                              style={{ paddingRight: "40px" }}
                            >
                              Additional Auto Enrollment Rules
                            </p>
                            <div className="add-rules-button">
                              <Link disabled={isEdit && !isSave}>
                                <Button
                                  disabled={isEdit && !isSave}
                                  variant="secondary"
                                  onClick={addAdditionalEnrollmentClick}
                                >
                                  Add Rules
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div>
                            <Table className="additional-enrollment-table">
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
                                {additionalEnrollmentRules &&
                                  additionalEnrollmentRules.map(
                                    (additionalEnrollment, index) => {
                                      return (
                                        <Table.Tr key={index}>
                                          {columns.map((item, cellIndex) => {
                                            const getContent = () => {
                                              if (item.link) {
                                                return (
                                                  <Link
                                                    onClick={() => {
                                                      editAdditionalEnrollmentRuleClick(
                                                        //item,
                                                        index
                                                      );
                                                    }}
                                                  >
                                                    View
                                                  </Link>
                                                );
                                              }
                                              return additionalEnrollment[
                                                item.columnName
                                              ];
                                            };

                                            return (
                                              <Table.Td
                                                key={cellIndex}
                                                className={item.className}
                                              >
                                                {getContent()}
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
                        </div>
                      ) : (
                        <div>
                          <LoaderWrapper>
                            <AddPlans
                              content={<>Additional Auto Enrollment Rules.</>}
                              buttonLabel="Add Enrollment Rules"
                              onPrimaryClick={addAdditionalEnrollmentClick}
                            />
                          </LoaderWrapper>
                        </div>
                      )}
                    </>
                  ) : null}
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
