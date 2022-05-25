import React, { useContext, useState } from "react";
import { get, isEmpty } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field, FieldArray } from "formik";
import {
  ManagePlanLayout,
  FieldInput,
  FieldButtonGroup,
  DatePicker,
  FieldDropSide,
  FieldInputNumber,
  CsplTable as Table,
  MultiSelectDropdown,
  FieldTextarea,
} from "../../../components";
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";
import {
  getPlanSourceInformation,
  getDefaultElectionSetting,
  getEmployeeClassification,
  saveAdditionalAutoEnrollment,
  getPlanInvestments,
} from "../../../services";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  yesNoOptions,
  returnOnlyIfBoolean,
  usDateFormat,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  toMultiSelectValueById,
  getPathWithParam,
} from "../../../utils";
import { useLocation } from "react-router-dom";
import {
  createPlanStore,
  setManagePlanToastInfo,
  setManagePlanFlow,
  setManagePageLevelData,
  setManagePlanLocalCache,
} from "../../../contexts";
import ExcludedEmployeeClassficationFields from "../EnrollmentContainer/ExcludedEmployeeClassification";
import InvestmentElectionFields from "./InvestmentElection";

export const AdditionalAutoEnrollmentContainer = (props) => {
  //const { values, handleSubmit } = props;
  const { history, setToggle } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const [newFlow] = useState("");
  const { planId, flow } = useRouterParams();
  const formName = managePlanFormNames.ADD_ADDITIONAL_AUTO_ENROLLMENT;
  const fields = formFields[formName];

  const [
    excludedEmployeeClassifications,
    setExcludedEmployeeClassifications,
  ] = useState([]);
  console.log(excludedEmployeeClassifications, "classes");
  const [excludedEmploymentStatuses, setExcludedEmploymentStatuses] = useState(
    []
  );
  console.log(excludedEmploymentStatuses, "stated");
  const apiData = get(state, "api.data", {});
  const enrollment = get(apiData, "enrollment", {});
  const getDefaultElection = !isEmpty(enrollment)
    ? get(enrollment, "defaultElectionSetting", {})
    : Object.create(null);
  const autoEnrollment = get(enrollment, "autoEnrollment", []);
  const additionalAutoEnrollment = get(
    autoEnrollment,
    "additionalAutoEnrollment",
    []
  );
  //console.log(state)
  console.log(get(state, "AdditionalAutoEnrollment", []), "additotonalknalm");
  const AdditionalAutoEnrollmentData = isEmpty(
    get(state, "AdditionalAutoEnrollment", [])
  )
    ? !isEmpty(additionalAutoEnrollment)
      ? get(additionalAutoEnrollment)
      : []
    : get(state, "AdditionalAutoEnrollment", []);
  console.log(AdditionalAutoEnrollmentData, "addition data");
  const { response: sourcesList } = useRequest({
    method: getPlanSourceInformation,
    payload: planId,
  });

  const investmentList = get(apiData, "investments", []);
  const search = useLocation().search;
  const Id = new URLSearchParams(search).get("id");
  const formValues = get(AdditionalAutoEnrollmentData, Id, {});
  console.log(formValues, "form Values");

  useDeepEffect(() => {
    getEmployeeClassification(planId).then((response) => {
      setExcludedEmployeeClassifications(
        response.employeeClassifications &&
          response.employeeClassifications.map((val, ind) => ({
            label: val.codeName + val.code,
            value: val.code,
          }))
      );
      setExcludedEmploymentStatuses(
        response.employmentStatuses &&
          response.employmentStatuses.map((val, ind) => ({
            label: val.employmentStatusName + val.employmentStatusCode,
            value: val.employmentStatusCode,
          }))
      );
    });
  }, []);
  const initialValues = {
    id: 0,
    additionalAutoEnrollmentDeferralSources: [
      {
        id: 0,
        deferralSourceName: null,
        limitMaximum: 0,
        limitMinimum: 0,
      },
    ],
    additionalAutoEnrollmentInvestmentElection: [
      {
        investmentName: null,
      },
    ],
    additionalAutoEnrollmentSouceInvestmentElections: [
      [
        //investmentElection=
        {
          investmentName: null,
        },
      ],
    ],
    additionalAutoEnrollmentCategorywiseInvestment: [
      [
        {
          investmentName: null,
        },
      ],
    ],
    additionalAutoEnrollmentDifferentInvestmentElection: [
      [
        [
          {
            investmentName: null,
          },
        ],
      ],
    ],
  };
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      onClick: () =>
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_PLAN_ROUTES.ENROLLMENT,
            pathParam: [FLOW_TYPES.SAVE, planId],
          })
        ),
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
      link: MANAGE_PLAN_ROUTES.ADDITIONAL_AUTO_ENROLLMENT,
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
            path: MANAGE_PLAN_ROUTES.ADDITIONAL_AUTO_ENROLLMENT,
            pathParam: [FLOW_TYPES.SAVE, planId],
            queryParam: "?id=" + Id,
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
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const displayType = (amt, cont, number) => {
    let res;
    if (cont === "Dollar")
      res =
        number === 0
          ? "Minimum amount " + "$" + amt
          : "Maximum amount " + "$" + amt;
    else
      res =
        number === 0
          ? "Minimum percentage " + amt + "%"
          : "Maximum percentage " + amt + "%";
    return res;
  };
  const preData = (values) => {
    const excEmployeeStatus = !isEmpty(
      get(values, "excludedEmploymentStatuses", [])
    )
      ? get(values, "excludedEmploymentStatuses", []).map((e) => {
          const selected = excludedEmploymentStatuses.find(
            (f) => (e = f.value)
          );
          return {
            label: selected.label,
            employmentStatusCode: selected.value,
          };
        })
      : null;
    const excEmployeeClassifications = !isEmpty(
      get(values, "excludedEmployeeClassifications", [])
    )
      ? get(values, "excludedEmployeeClassifications", []).map((e) => {
          const selected = excludedEmployeeClassifications.find(
            (f) => (e = f.value)
          );
          return {
            label: selected.label,
            code: selected.value,
          };
        })
      : null;
    return {
      ...values,
      excludedEmployeeClassifications: excEmployeeClassifications,
      excludedEmploymentStatuses: excEmployeeStatus,
    };
  };
  const onFormSubmit = (values) => {
    console.log(preData(values), "preData");
    dispatch(
      setManagePlanLocalCache({
        model: "AdditionalAutoEnrollment",
        data: [...AdditionalAutoEnrollmentData, preData(values)],
      })
    );
    history.push(
      getPathWithParam({
        path: MANAGE_PLAN_ROUTES.ENROLLMENT,
        pathParam: [FLOW_TYPES.SAVE, planId],
      })
    );
  };
  console.log(get(formValues, "excludedEmployeeClassifications"), "faaaew");
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
        [fields.excludedEmploymentStatuses]: isEmpty(
          formValues.excludedEmploymentStatuses
        )
          ? null
          : formValues.excludedEmploymentStatuses?.map(
              (val, ind) => val.employmentStatusCode
            ),
        [fields.excludedEmployeeClassifications]: isEmpty(
          get(formValues, "excludedEmployeeClassifications")
        )
          ? null
          : get(formValues, "excludedEmployeeClassifications").map(
              (val, ind) => val.code
            ),
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
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
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };

        const selectedexcludedEmploymentStatuses =
          values[fields.excludedEmploymentStatuses];
        const selectedExcludedEmployeeClassifications =
          values[fields.excludedEmployeeClassifications];
        console.log(
          values[fields.excludedEmployeeClassifications],
          "classifications"
        );
        console.log(selectedexcludedEmploymentStatuses, "statueses");
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            //validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout buttons={buttons} pageFlow={newFlow || flow}>
              <div className="d-flex flex-column">
                <Field
                  name={fields.enrollmentDescription}
                  label="Enrollment description"
                  autoComplete="off"
                  value={values[fields.enrollmentDescription]}
                  onChange={handleChange}
                  component={FieldTextarea}
                  disabled={isEdit && !isSave}
                  isRequired
                  size="md"
                />

                <Field
                  label="Enrollment effective Start Date"
                  name={fields.enrollmentEffectiveStartDate}
                  isDatePicker
                  size="md"
                  value={usDateFormat(
                    values[fields.enrollmentEffectiveStartDate]
                  )}
                  selectedValue={values[fields.enrollmentEffectiveStartDate]}
                  component={FieldDropSide}
                  isRequired
                  onClear={() =>
                    setFieldValue(fields.enrollmentEffectiveStartDate, "")
                  }
                  disabled={isEdit && !isSave}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(
                          fields.enrollmentEffectiveStartDate,
                          value
                        )
                      }
                      value={values[fields.enrollmentEffectiveStartDate]}
                    />
                  }
                />
                <Field
                  label="Enrollment effective End Date"
                  name={fields.enrollmentEffectiveEndDate}
                  isDatePicker
                  isRequired
                  value={usDateFormat(
                    values[fields.enrollmentEffectiveEndDate]
                  )}
                  selectedValue={values[fields.enrollmentEffectiveEndDate]}
                  component={FieldDropSide}
                  onClear={() =>
                    setFieldValue(fields.enrollmentEffectiveEndDate, "")
                  }
                  disabled={isEdit && !isSave}
                  popupContent={
                    <DatePicker
                      onDayClick={(value) =>
                        onDaySelected(fields.enrollmentEffectiveEndDate, value)
                      }
                      value={values[fields.enrollmentEffectiveEndDate]}
                    />
                  }
                />

                <Field
                  isRequired
                  label="Additional Enrollment Options"
                  name={fields.exclusionType}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.ADDITIONAL_AUTO_ENROLLMENT_OPTIONS
                  )}
                  value={values[fields.exclusionType]}
                  selectedValue={values[fields.exclusionType]}
                  component={FieldButtonGroup}
                  onChange={(value) => {
                    setFieldValue(fields.exclusionType, value);
                  }}
                  disabled={isEdit && !isSave}
                  size="smd"
                />
                {values[fields.exclusionType] === 2 ? (
                  <>
                    <Field
                      size="md"
                      isRequired
                      label="Employee Classifications"
                      options={excludedEmployeeClassifications}
                      name={fields.excludedEmployeeClassifications}
                      value={toMultiSelectValueById(
                        selectedExcludedEmployeeClassifications,
                        excludedEmployeeClassifications
                      )}
                      disabled={isEdit && !isSave}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          label="Select an Employee Classifications"
                          options={excludedEmployeeClassifications}
                          onSelect={(value) =>
                            setFieldValue(
                              fields.excludedEmployeeClassifications,
                              value
                            )
                          }
                          name={fields.excludedEmployeeClassifications}
                          value={values[fields.excludedEmployeeClassifications]}
                          disabled={isEdit && !isSave}
                        />
                      }
                      // validate={required}
                      component={FieldDropSide}
                    />

                    <Field
                      size="md"
                      isRequired
                      label="Employment Status"
                      options={excludedEmploymentStatuses}
                      name={fields.excludedEmploymentStatuses}
                      value={toMultiSelectValueById(
                        selectedexcludedEmploymentStatuses,
                        excludedEmploymentStatuses
                      )}
                      disabled={isEdit && !isSave}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          label="Select as Employment Status"
                          options={excludedEmploymentStatuses}
                          onSelect={(value) =>
                            setFieldValue(
                              fields.excludedEmploymentStatuses,
                              value
                            )
                          }
                          selectedOptions={fields.excludedEmploymentStatuses}
                          name={fields.excludedEmploymentStatuses}
                          value={values[fields.excludedEmploymentStatuses]}
                          disabled={isEdit && !isSave}
                        />
                      }
                      // validate={required}
                      component={FieldDropSide}
                    />
                  </>
                ) : null}

                {values[fields.exclusionType] === 1 ? (
                  <>
                    <Field
                      label="Date of hire"
                      name={fields.dateOfHire}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.DATE_OF_HIRE
                      )}
                      value={values[fields.dateOfHire]}
                      selectedValue={values[fields.dateOfHire]}
                      component={FieldButtonGroup}
                      onChange={(value) => {
                        setFieldValue(fields.dateOfHire, value);
                      }}
                      disabled={isEdit && !isSave}
                      size="smd"
                    />
                    {values[fields.dateOfHire] === 1 ? (
                      <Field
                        label="Hired on or after date"
                        name={fields.hiredOnOrAfterDateAdditionalEnrollment}
                        isDatePicker
                        // {...rest}
                        value={usDateFormat(
                          values[fields.hiredOnOrAfterDateAdditionalEnrollment]
                        )}
                        selectedValue={
                          values[fields.hiredOnOrAfterDateAdditionalEnrollment]
                        }
                        component={FieldDropSide}
                        onClear={() =>
                          setFieldValue(
                            fields.hiredOnOrAfterDateAdditionalEnrollment,
                            ""
                          )
                        }
                        disabled={isEdit && !isSave}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(
                                fields.hiredOnOrAfterDateAdditionalEnrollment,
                                value
                              )
                            }
                            value={
                              values[
                                fields.hiredOnOrAfterDateAdditionalEnrollment
                              ]
                            }
                          />
                        }
                      />
                    ) : null}

                    {values[fields.dateOfHire] === 2 ? (
                      <Field
                        label="Hired on or before date"
                        name={fields.hiredOnOrBeforeDateAdditionalEnrollment}
                        isDatePicker
                        // {...rest}
                        value={usDateFormat(
                          values[fields.hiredOnOrBeforeDateAdditionalEnrollment]
                        )}
                        selectedValue={
                          values[fields.hiredOnOrBeforeDateAdditionalEnrollment]
                        }
                        component={FieldDropSide}
                        onClear={() =>
                          setFieldValue(
                            fields.hiredOnOrBeforeDateAdditionalEnrollment,
                            ""
                          )
                        }
                        disabled={isEdit && !isSave}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(
                                fields.hiredOnOrBeforeDateAdditionalEnrollment,
                                value
                              )
                            }
                            value={
                              values[
                                fields.hiredOnOrBeforeDateAdditionalEnrollment
                              ]
                            }
                          />
                        }
                      />
                    ) : null}

                    {values[fields.dateOfHire] === 3 ? (
                      <>
                        <p className="font-weight-500 text-black">
                          Hired Between(Inclusive)
                        </p>
                        <Row>
                          <Col md="4">
                            <Field
                              label="From"
                              name={fields.hiredBetweenFrom}
                              isDatePicker
                              size="md"
                              // {...rest}
                              value={usDateFormat(
                                values[fields.hiredBetweenFrom]
                              )}
                              selectedValue={values[fields.hiredBetweenFrom]}
                              component={FieldDropSide}
                              onClear={() =>
                                setFieldValue(fields.hiredBetweenFrom, "")
                              }
                              disabled={isEdit && !isSave}
                              popupContent={
                                <DatePicker
                                  onDayClick={(value) =>
                                    onDaySelected(
                                      fields.hiredBetweenFrom,
                                      value
                                    )
                                  }
                                  value={values[fields.hiredBetweenFrom]}
                                />
                              }
                            />
                          </Col>
                          <Col>
                            <Field
                              label="To"
                              name={fields.hiredBetweenTo}
                              isDatePicker
                              size="md"
                              // {...rest}
                              value={usDateFormat(
                                values[fields.hiredBetweenTo]
                              )}
                              selectedValue={values[fields.hiredBetweenTo]}
                              component={FieldDropSide}
                              onClear={() =>
                                setFieldValue(fields.hiredBetweenTo, "")
                              }
                              disabled={isEdit && !isSave}
                              popupContent={
                                <DatePicker
                                  onDayClick={(value) =>
                                    onDaySelected(fields.hiredBetweenTo, value)
                                  }
                                  value={values[fields.hiredBetweenTo]}
                                />
                              }
                            />
                          </Col>
                        </Row>
                      </>
                    ) : null}

                    <Field
                      size="md"
                      isRequired
                      label="Excluded Employment Status"
                      options={excludedEmploymentStatuses}
                      name={fields.excludedEmploymentStatuses}
                      value={toMultiSelectValueById(
                        selectedexcludedEmploymentStatuses,
                        excludedEmploymentStatuses
                      )}
                      disabled={isEdit && !isSave}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          label="Select as Employment Status"
                          options={excludedEmploymentStatuses}
                          onSelect={(value) =>
                            setFieldValue(
                              fields.excludedEmploymentStatuses,
                              value
                            )
                          }
                          selectedOptions={fields.excludedEmploymentStatuses}
                          name={fields.excludedEmploymentStatuses}
                          value={values[fields.excludedEmploymentStatuses]}
                          disabled={isEdit && !isSave}
                        />
                      }
                      // validate={required}
                      component={FieldDropSide}
                    />
                  </>
                ) : null}

                {values[fields.exclusionType] === 3 ? (
                  <>
                    <Field
                      size="md"
                      isRequired
                      label="Excluded Employee Classifications"
                      options={excludedEmployeeClassifications}
                      name={fields.excludedEmployeeClassifications}
                      value={toMultiSelectValueById(
                        selectedExcludedEmployeeClassifications,
                        excludedEmployeeClassifications
                      )}
                      disabled={isEdit && !isSave}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          label="Select an Employee Classifications"
                          options={excludedEmployeeClassifications}
                          onSelect={(value) =>
                            setFieldValue(
                              fields.excludedEmployeeClassifications,
                              value
                            )
                          }
                          name={fields.excludedEmployeeClassifications}
                          value={values[fields.excludedEmployeeClassifications]}
                          disabled={isEdit && !isSave}
                        />
                      }
                      // validate={required}
                      component={FieldDropSide}
                    />

                    <Field
                      label="Date of hire"
                      name={fields.dateOfHire}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.DATE_OF_HIRE
                      )}
                      value={values[fields.dateOfHire]}
                      selectedValue={values[fields.dateOfHire]}
                      component={FieldButtonGroup}
                      onChange={(value) => {
                        setFieldValue(fields.dateOfHire, value);
                      }}
                      disabled={isEdit && !isSave}
                      size="smd"
                    />

                    {values[fields.dateOfHire] === 1 ? (
                      <Field
                        label="Hired on or after date"
                        name={fields.hiredOnOrAfterDateAdditionalEnrollment}
                        isDatePicker
                        {...rest}
                        value={usDateFormat(
                          values[fields.hiredOnOrAfterDateAdditionalEnrollment]
                        )}
                        selectedValue={
                          values[fields.hiredOnOrAfterDateAdditionalEnrollment]
                        }
                        component={FieldDropSide}
                        onClear={() =>
                          setFieldValue(
                            fields.hiredOnOrAfterDateAdditionalEnrollment,
                            ""
                          )
                        }
                        disabled={isEdit && !isSave}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(
                                fields.hiredOnOrAfterDateAdditionalEnrollment,
                                value
                              )
                            }
                            value={
                              values[
                                fields.hiredOnOrAfterDateAdditionalEnrollment
                              ]
                            }
                          />
                        }
                      />
                    ) : null}

                    {values[fields.dateOfHire] === 2 ? (
                      <Field
                        label="Hired on or before date"
                        name={fields.hiredOnOrBeforeDateAdditionalEnrollment}
                        isDatePicker
                        {...rest}
                        value={usDateFormat(
                          values[fields.hiredOnOrBeforeDateAdditionalEnrollment]
                        )}
                        selectedValue={
                          values[fields.hiredOnOrBeforeDateAdditionalEnrollment]
                        }
                        component={FieldDropSide}
                        onClear={() =>
                          setFieldValue(
                            fields.hiredOnOrBeforeDateAdditionalEnrollment,
                            ""
                          )
                        }
                        disabled={isEdit && !isSave}
                        popupContent={
                          <DatePicker
                            onDayClick={(value) =>
                              onDaySelected(
                                fields.hiredOnOrBeforeDateAdditionalEnrollment,
                                value
                              )
                            }
                            value={
                              values[
                                fields.hiredOnOrBeforeDateAdditionalEnrollment
                              ]
                            }
                          />
                        }
                      />
                    ) : null}

                    {values[fields.dateOfHire] === 3 ? (
                      <>
                        <p className="font-weight-500 text-black">
                          Hired Between(Inclusive)
                        </p>
                        <Row>
                          <Col md="4">
                            <Field
                              label="From"
                              name={fields.hiredBetweenFrom}
                              isDatePicker
                              size="md"
                              // {...rest}
                              value={usDateFormat(
                                values[fields.hiredBetweenFrom]
                              )}
                              selectedValue={values[fields.hiredBetweenFrom]}
                              component={FieldDropSide}
                              onClear={() =>
                                setFieldValue(fields.hiredBetweenFrom, "")
                              }
                              disabled={isEdit && !isSave}
                              popupContent={
                                <DatePicker
                                  onDayClick={(value) =>
                                    onDaySelected(
                                      fields.hiredBetweenFrom,
                                      value
                                    )
                                  }
                                  value={values[fields.hiredBetweenFrom]}
                                />
                              }
                            />
                          </Col>
                          <Col>
                            <Field
                              label="To"
                              name={fields.hiredBetweenTo}
                              isDatePicker
                              size="md"
                              // {...rest}
                              value={usDateFormat(
                                values[fields.hiredBetweenTo]
                              )}
                              selectedValue={values[fields.hiredBetweenTo]}
                              component={FieldDropSide}
                              onClear={() =>
                                setFieldValue(fields.hiredBetweenTo, "")
                              }
                              disabled={isEdit && !isSave}
                              popupContent={
                                <DatePicker
                                  onDayClick={(value) =>
                                    onDaySelected(fields.hiredBetweenTo, value)
                                  }
                                  value={values[fields.hiredBetweenTo]}
                                />
                              }
                            />
                          </Col>
                        </Row>
                      </>
                    ) : null}

                    <Field
                      size="md"
                      isRequired
                      label="Excluded Employment Status"
                      options={excludedEmploymentStatuses}
                      name={fields.excludedEmploymentStatuses}
                      value={toMultiSelectValueById(
                        selectedexcludedEmploymentStatuses,
                        excludedEmploymentStatuses
                      )}
                      disabled={isEdit && !isSave}
                      isMultiSelect
                      popupContent={
                        <MultiSelectDropdown
                          label="Select as Employment Status"
                          options={excludedEmploymentStatuses}
                          onSelect={(value) =>
                            setFieldValue(
                              fields.excludedEmploymentStatuses,
                              value
                            )
                          }
                          selectedOptions={fields.excludedEmploymentStatuses}
                          name={fields.excludedEmploymentStatuses}
                          value={values[fields.excludedEmploymentStatuses]}
                          disabled={isEdit && !isSave}
                        />
                      }
                      // validate={required}
                      component={FieldDropSide}
                    />
                  </>
                ) : null}

                <Row>
                  <Col>
                    <p className="font-weight-500 text-black">
                      Deferral Election
                    </p>
                    <Field
                      isRequired
                      name={fields.usePlanDefaultDeferralElection}
                      label="Use plan default deferral election"
                      size="sm"
                      options={yesNoOptions}
                      selectedValue={returnOnlyIfBoolean(
                        values[fields.usePlanDefaultDeferralElection]
                      )}
                      onChange={(value) => {
                        setFieldValue(
                          fields.usePlanDefaultDeferralElection,
                          value
                        );
                      }}
                      disabled={isEdit && !isSave}
                      component={FieldButtonGroup}
                    />
                    {values[fields.usePlanDefaultDeferralElection] === false ? (
                      <FieldArray name="sourcesList">
                        {(fieldArrayProps) => {
                          return (
                            <Table.Tbody>
                              {sourcesList &&
                                sourcesList.map((e, i) => {
                                  const fieldName = `additionalAutoEnrollmentDeferralSources[${i}].deferralSourcePercentage`;
                                  const checkBoxName = `additionalAutoEnrollmentDeferralSources[${i}].excludeFromEnrollment`;
                                  //const sourceName= `additionalAutoEnrollmentDeferralSources[${i}].deferralSourceName`;
                                  const AddName = (
                                    e,
                                    source,
                                    limitMaximum,
                                    limitMinimum
                                  ) => {
                                    if (
                                      !isEmpty(
                                        values
                                          .additionalAutoEnrollmentDeferralSources[
                                          i
                                        ]
                                      )
                                    ) {
                                      //values.additionalAutoEnrollmentDeferralSources=values.additionalAutoEnrollmentDeferralSources.map(obj=> ({ ...obj[i], deferralSourceName:source }))
                                      values.additionalAutoEnrollmentDeferralSources[
                                        i
                                      ].deferralSourceName = source;
                                      values.additionalAutoEnrollmentDeferralSources[
                                        i
                                      ].limitMaximum = limitMaximum;
                                      values.additionalAutoEnrollmentDeferralSources[
                                        i
                                      ].limitMinimum = limitMinimum;
                                    }
                                    handleChange(e);
                                  };

                                  return (
                                    <div key={i} className="d-flex">
                                      <Field
                                        size="xs"
                                        isRequired
                                        name={fieldName}
                                        label={e.sourceName}
                                        hasSuggestion
                                        suggestionDefaultText={`${displayType(
                                          e.limitMinimum,
                                          e.contributionType,
                                          0
                                        )} / ${displayType(
                                          e.limitMaximum,
                                          e.contributionType,
                                          1
                                        )}`}
                                        shouldDisplaySuggestion
                                        component={FieldInputNumber}
                                        type="number"
                                        autoComplete="off"
                                        defaultValue={parseInt(
                                          get(values, fieldName)
                                        )}
                                        onChange={(x) => {
                                          AddName(
                                            x,
                                            e.sourceName,
                                            e.limitMaximum,
                                            e.limitMinimum
                                          );
                                        }}
                                        disabled={isEdit && !isSave}
                                      />
                                      &nbsp;&nbsp;&nbsp;
                                      <div
                                        style={{
                                          marginLeft: "2rem",
                                        }}
                                      ></div>
                                      <Form.Check
                                        custom
                                        name={checkBoxName}
                                        type="checkbox"
                                        id={checkBoxName}
                                        value={get(values, checkBoxName)}
                                        onChange={handleChange}
                                        checked={get(values, checkBoxName)}
                                        disabled={isEdit && !isSave}
                                      />
                                      &nbsp;&nbsp;&nbsp;
                                      <div
                                        style={{
                                          //marginBottom: "-4rem",
                                          fontSize: "13px",
                                          paddingTop: "40px",
                                        }}
                                        //size="xs"
                                      >
                                        Exclude from Enrollment
                                      </div>
                                    </div>
                                  );
                                })}
                            </Table.Tbody>
                          );
                        }}
                      </FieldArray>
                    ) : null}
                    {values[fields.usePlanDefaultDeferralElection] === true ? (
                      <FieldArray name="getDefaultElection">
                        {(fieldArrayProps) =>
                          !isEmpty(
                            getDefaultElection.deferralSourceContribution
                          ) &&
                          getDefaultElection.deferralSourceContribution.map(
                            (e, i) => {
                              return (
                                <div key={i}>
                                  <Field
                                    size="xs"
                                    isRequired
                                    name={e.sourceName}
                                    label={e.sourceName}
                                    value={e.contributionRate}
                                    disabled={true}
                                    component={FieldInput}
                                    type="number"
                                    autoComplete="off"
                                  />
                                </div>
                              );
                            }
                          )
                        }
                      </FieldArray>
                    ) : null}
                  </Col>
                </Row>

                <Row>
                  <Col>
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
                        additionalAutoEnrollmentData={
                          AdditionalAutoEnrollmentData
                        }
                        planId={planId}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AdditionalAutoEnrollmentContainer;
