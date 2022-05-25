import React, { useContext, useState } from "react";
import { get, isEmpty, isArray, find } from "lodash";
import { Form } from "react-bootstrap";
import { getClassificationCodes, getPlanSources } from "../../../services";
import { getEmploymentStatusList } from "../../../services/census";
import { faTimes, faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  FieldButtonGroup,
  FieldMultiSelectButtonGroup,
  FieldInput,
  SearchableList,
  FieldDropSide,
  FieldInputDollar,
  MultiSelectDropdown,
  FieldInputNumber,
  FieldInputDecimal,
  CsplTable as Table,
  FieldIncrement,
  FieldInputPercentage,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  clearFieldValues,
  yesNoOptions,
  required,
  ROUTES,
  tranformListToDropdownValues,
  transformToMultiselectSave,
  getAdvancedPathWithParam,
  toMultiSelectValue,
  toMultiSelectValueById,
  getNumber,
} from "../../../utils";
import {
  createPlanStore,
  setManagePlanToastInfo,
  savePlanDetailsAction,
} from "../../../contexts";
import { useDeepEffect, useRouterParams, useRequest } from "../../../abstracts";
import months from "../../../mocks/months.json";
import { getLoanTypes } from "../../../services";
import { SourceHierarchyList } from "./SourceHierarchyList";
import LoanTypeDropdown from "../../../components/LoanTypeDropdown";

const minimumLength = [
  {
    label: "3 Months",
    value: 1,
  },
  {
    label: "6 Months",
    value: 2,
  },
  {
    label: "12 Months",
    value: 3,
  },
];

const withdrawalBasis = [
  {
    label: "Source Pro-Rata/Investment Pro-Rata",
    value: 1,
  },
  {
    label: "Source Hierarchical/Investment Pro-Rata",
    value: 2,
  },
];

const applicablePaymentMethodsLoan = [
  {
    label: "Direct Payments",
    value: 1,
  },
  {
    label: "Payroll Deductions",
    value: 2,
  },
];

const defaultMethod = [
  {
    label: "Benefit Offset",
    value: 1,
  },
  {
    label: "Deemed Distribution",
    value: 2,
  },
];

const loanApportioningMethod = [
  {
    label: "Prorata",
    value: 1,
  },
  {
    label: "Loan Status Cum Loan Age",
    value: 2,
  },
];

const interestRateUpdateFrequecy = [
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
    label: "Semi-Annually",
    value: 4,
  },
];

const loanFeeTypeDeductedFrom = [
  {
    label: "Account Balance",
    value: 1,
  },
  {
    label: "Loan Amount",
    value: 2,
  },
];

const feesPaymentMethodsApplicable = [
  {
    label: "Check",
    value: 1,
  },
  {
    label: "EFT",
    value: 2,
  },
];

const timingOfRecurringLoanFee = [
  {
    label: "Loan Anniversary Date",
    value: 1,
  },
  {
    label: "Plan Year End",
    value: 2,
  },
];

const columns = [
  {
    label: "Sources hierarchy ",
    className: "row-hierarchy",
    columnName: "sourcesHierarchy",
  },
];
const initialValues = {
  isShared: true,
  spousalConsentRequired: false,
  sponsorApprovalRequired: false,
  refinancingAllowed: false,
  recurringLoanApplicable: false,
  isServiceRequirementApplicable: false,
  allowLoansIfAnotherLoanIsDelinquentDefaultDeemed: false,
  allowParticipantsToChooseLoanFeeType: false,
  withdrawalBasis: 1,
  loansAllowed: true,
};

const AddLoanContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, loanId } = useRouterParams();
  const loans = get(state, "api.data.loans", []);
  const apiLoanData = loans[loanId];
  const apiData = get(state, "api.data", {});
  const sourcesList = tranformListToDropdownValues(
    get(apiData, "sources", []),
    "sourceName",
    "id"
  );
  console.log(sourcesList, "sourcesList");
  const formValues = get(loans, loanId, {});
  const investmentsList = tranformListToDropdownValues(
    get(apiData, "investments", []),
    "name",
    "id"
  );
  const [excludedEmploymentStatuses, setExcludedEmploymentStatus] = useState(
    []
  );
  const [
    excludedEmployeeClassifications,
    setExcludedEmployeeClassifications,
  ] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);

  useDeepEffect(() => {
    getEmploymentStatusList(get(state, "api.data.companyId", 0))
      .then((response) =>
        setExcludedEmploymentStatus(
          response.map((val) => ({
            label: val.employmentStatusCode,
            value: val.id,
          }))
        )
      )
      .catch((error) => {
        //Handle Error
      });
    getClassificationCodes(get(state, "api.data.companyId", 0))
      .then((response) => {
        setExcludedEmployeeClassifications(
          response.map((val) => ({
            label: val.code,
            value: val.id,
          }))
        );
      })
      .catch((error) => {
        //Handle Error
      });
  }, []);

  const intloansId = parseInt(loanId, 0);
  const [newFlow, setNewFlow] = useState(!isNaN(loanId) ? FLOW_TYPES.EDIT : "");
  const formName = managePlanFormNames.ADD_LOANS;
  const fields = formFields[formName];

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.LOANS,
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
        path: MANAGE_PLAN_ROUTES.LOANS,
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
    const updatedValues = {
      ...formValues,
      ...values,
      [fields.numberOfLoansAllowed]: getNumber(
        values[fields.numberOfLoansAllowed]
      ),
      [fields.loanPerPlanYear]: getNumber(values[fields.loanPerPlanYear]),
      [fields.minimumAmount]: getNumber(values[[fields.minimumAmount]]),
      [fields.maximumAmountPercentageValue]: getNumber(
        values[fields.maximumAmountPercentageValue]
      ),
      [fields.maximumAmountOtherValue]: getNumber(
        values[fields.maximumAmountOtherValue]
      ),
      [fields.maximumLengthYears]: getNumber(values[fields.maximumLengthYears]),
      [fields.maximumLengthMonths]: getNumber(
        values[fields.maximumLengthMonths]
      ),
      [fields.processingTimeForLoan]: getNumber(
        values[fields.processingTimeForLoan]
      ),
      [fields.waitingPeriodBetweenLoansPayoffAndLoanRequest]: getNumber(
        values[fields.waitingPeriodBetweenLoansPayoffAndLoanRequest]
      ),
      [fields.loanReAmortizationFee]: getNumber(
        values[fields.loanReAmortizationFee]
      ),
      [fields.numberOfLoansAllowed]: getNumber(
        values[fields.numberOfLoansAllowed]
      ),
      [fields.minimumLoanRepaymentAmount]: getNumber(
        values[fields.minimumLoanRepaymentAmount]
      ),
      [fields.achFee]: getNumber(values[fields.achFee]),
      [fields.curePeriodFixedNumberOfDays]: getNumber(
        values[fields.curePeriodFixedNumberOfDays]
      ),
      [fields.overnightDeliveryFees]: getNumber(
        values[fields.overnightDeliveryFees]
      ),
      [fields.loanFeeAmount]: getNumber(values[fields.loanFeeAmount]),
      [fields.recurringLoanFees]: getNumber(values[fields.recurringLoanFees]),
      [fields.restrictedInvestments]: [
        ...transformToMultiselectSave(
          (values[fields.restrictedInvestments] || []).filter(
            (val) =>
              !get(formValues, fields.restrictedInvestments, [])
                .map((_) => _.restrictedInvestmentId)
                .includes(val)
          ),
          "restrictedInvestmentId"
        ),
        ...get(formValues, fields.restrictedInvestments, []).filter((val) =>
          (values[fields.restrictedInvestments] || []).includes(
            val.restrictedInvestmentId
          )
        ),
      ],

      [fields.sourceHierarchies]: [
        ...transformToMultiselectSave(
          (values[fields.sourceHierarchies] || []).filter(
            (val) =>
              !get(formValues, fields.sourceHierarchies, [])
                .map((_) => _.sourceId)
                .includes(val)
          ),
          "sourceId"
        ),
        ...get(formValues, fields.sourceHierarchies, []).filter((val) =>
          (values[fields.sourceHierarchies] || []).includes(val.sourceId)
        ),
      ],

      [fields.excludedEmployeeClassifications]: [
        ...transformToMultiselectSave(
          (values[fields.excludedEmployeeClassifications] || []).filter(
            (val) =>
              !get(formValues, fields.excludedEmployeeClassifications, [])
                .map((_) => _.employeeClassificationId)
                .includes(val)
          ),
          "employeeClassificationId"
        ),
        ...get(
          formValues,
          fields.excludedEmployeeClassifications,
          []
        ).filter((val) =>
          (values[fields.excludedEmployeeClassifications] || []).includes(
            val.employeeClassificationId
          )
        ),
      ],

      [fields.excludedEmploymentStatuses]: [
        ...transformToMultiselectSave(
          (values[fields.excludedEmploymentStatuses] || []).filter(
            (val) =>
              !get(formValues, fields.excludedEmploymentStatuses, [])
                .map((_) => _.employmentStatusId)
                .includes(val)
          ),
          "employmentStatusId"
        ),
        ...get(
          formValues,
          fields.excludedEmploymentStatuses,
          []
        ).filter((val) =>
          (values[fields.excludedEmploymentStatuses] || []).includes(
            val.employmentStatusId
          )
        ),
      ],
      [fields.masterLoanTypeId]: values[fields.loanType],
      // [fields.masterLoanType]:
      //   values[fields.loanType] === 3
      //     ? {
      //         id: 0,
      //         loanType: values[fields.loanType],
      //         description: values[fields.loanDescription],
      //         companyId: get(apiData, "companyId", 0),
      //         planId: get(apiData, "id", 0),
      //         isMaster: true,
      //       }
      //     : null,
    };

    if (loanId === undefined) {
      return [...loans, updatedValues];
    }

    return loans.map((loan, index) => {
      if (index === intloansId) {
        return {
          ...loan,
          ...updatedValues,
        };
      }
      return loan;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    savePlanDetailsAction(
      {
        loans: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.LOANS,
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
  const formInitialValues = get(state, managePlanFormNames.ADD_LOANS, {});

  // const loansFormValues = find(loans, {
  //   id: intloansId,
  // });

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  const layoutHeader = loanId && "Loan";

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...apiLoanData,
        [fields.excludedEmployeeClassifications]: get(
          apiLoanData,
          fields.excludedEmployeeClassifications,
          []
        )?.map((val) => val.employeeClassificationId),
        [fields.excludedEmploymentStatuses]: get(
          apiLoanData,
          fields.excludedEmploymentStatuses,
          []
        )?.map((val) => val.employmentStatusId),
        [fields.sourceHierarchies]: get(
          apiLoanData,
          fields.sourceHierarchies,
          []
        )?.map((val) => val.sourceId),
        [fields.restrictedInvestments]: get(
          apiLoanData,
          fields.restrictedInvestments,
          []
        )?.map((val) => val.restrictedInvestmentId),
        [fields.loanType]: get(apiLoanData, "masterLoanTypeId", 0),
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
        setTouched,
        values,
        setSubmitting,
        ...rest
      }) => {
        const onLoanTypeChange = (value) => {
          const updatedValues = clearFieldValues({
            values,
            fieldsToExculde: [
              fields.loanType,
              fields.spousalConsentRequired,
              fields.sponsorApprovalRequired,
              fields.refinancingAllowed,
              fields.isServiceRequirementApplicable,
              fields.allowLoansIfAnotherLoanIsDelinquentDefaultDeemed,
              fields.allowParticipantsToChooseLoanFeeType,
              fields.recurringLoanApplicable,
            ],
          });
          setValues({
            ...updatedValues,
            [fields.loanType]: value,
          });
          setTouched({});
        };

        const paymentMethodValue = isArray(
          values[fields.feesPaymentMethodsApplicable]
        )
          ? values[fields.feesPaymentMethodsApplicable]
          : [values[fields.feesPaymentMethodsApplicable]];
        const showCheckFee = paymentMethodValue.includes(1);
        const showEftFee = paymentMethodValue.includes(2);
        const onPaymentMethodChange = (value) => {
          let updatedValues;
          if (value.length === 1) {
            if (value.includes(1)) {
              updatedValues = clearFieldValues({
                values,
                fieldsToClear: [fields.eftFees],
              });
              setTouched({
                [fields.eftFees]: false,
              });
            } else {
              updatedValues = clearFieldValues({
                values,
                fieldsToClear: [fields.checkFee],
              });
              setTouched({
                [fields.checkFee]: false,
              });
            }
          }
          if (value.length === 0) {
            updatedValues = clearFieldValues({
              values,
              fieldsToClear: [fields.checkFee, fields.eftFees],
            });
            setTouched({
              [fields.checkFee]: false,
              [fields.eftFees]: false,
            });
          }
          setValues({
            ...values,
            ...updatedValues,
            [fields.feesPaymentMethodsApplicable]: value,
          });
        };

        const selectedsourceHierarchies = values[fields.sourceHierarchies];

        const selectedrestrictedInvestments =
          values[fields.restrictedInvestments];
        const selectedexcludedEmploymentStatuses =
          values[fields.excludedEmploymentStatuses];
        const selectedExcludedEmployeeClassifications =
          values[fields.excludedEmployeeClassifications];

        const selectedSources =
          values[fields.sourceHierarchies] &&
          values[fields.sourceHierarchies].map((e) => {
            const newSource = sourcesList.filter((f) => f.value === e);
            console.log(newSource);
            if (newSource) {
              return {
                label: newSource[0].label,
                id: newSource[0].value,
                hierarchyNumber: null,
              };
            }
            return null;
          });
        console.log(selectedSources, "selected sources");
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout
              layoutHeader={layoutHeader}
              buttons={buttons}
              pageFlow={newFlow || flow}
            >
              <Field
                label="Loan Type"
                name={fields.loanType}
                isRequired
                value={values[fields.loanDescription]}
                options={loanTypes}
                popupContent={
                  <LoanTypeDropdown
                    data={loanTypes}
                    onSelect={(value, name) => {
                      setFieldValue(fields.loanType, value);
                      setFieldValue(fields.loanDescription, name);
                    }}
                    value={values[fields.loanDescription]}
                    companyId={get(apiData, "companyId")}
                    setData={(newData) => setLoanTypes(newData)}
                  />
                }
                disabled={isEdit}
                validate={required}
                component={FieldDropSide}
              />

              <p className="font-weight-500 text-black">Loan Options</p>

              <Field
                size="sm"
                name={fields.numberOfLoansAllowed}
                autoComplete="off"
                type="number"
                label={"Number of Loans Allowed"}
                value={values[fields.numberOfLoansAllowed]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                isRequired
                min={1}
                max={9}
              />
              <Field
                size="sm"
                name={fields.loanPerPlanYear}
                autoComplete="off"
                type="number"
                label={"Loan Per Plan Year"}
                value={values[fields.loanPerPlanYear]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                isRequired
                min={1}
                max={9}
              />
              <Field
                name={fields.minimumAmount}
                autoComplete="off"
                type="number"
                label={"Minimum Amount"}
                value={values[fields.minimumAmount]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputDollar}
                max={9999.99}
                isRequired
              />
              <div className="d-flex">
                <Field
                  size="md"
                  isRequired
                  label="Maximum Amount"
                  name={fields.maximumAmount}
                  value={values[fields.maximumAmount]}
                  disabled={isEdit && !isSave}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.MAXIMUM_AMOUNT
                  )}
                  popupContent={
                    <SearchableList
                      label="Select a Amount"
                      isNotTypeAhead
                      isRadio
                      selectedValue={values[fields.maximumAmount]}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.MAXIMUM_AMOUNT
                      )}
                      onSelect={(value) =>
                        setFieldValue(fields.maximumAmount, value)
                      }
                    />
                  }
                  isRequired
                  component={FieldDropSide}
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  {values[fields.maximumAmount] === 2 ? (
                    <Field
                      name={fields.maximumAmountPercentageValue}
                      label="Percentage"
                      type="number"
                      size="xs"
                      value={values[fields.maximumAmountPercentageValue]}
                      onChange={handleChange}
                      disabled={isEdit && !isSave}
                      component={FieldInputPercentage}
                      max={100}
                      isRequired
                    />
                  ) : null}
                  {values[fields.maximumAmount] === 3 ? (
                    <Field
                      size="xs"
                      name={fields.maximumAmountOtherValue}
                      label="amount"
                      type="number"
                      autoComplete="off"
                      value={values[fields.maximumAmountOtherValue]}
                      onChange={handleChange}
                      disabled={isEdit && !isSave}
                      component={FieldInputDollar}
                      max={999999.99}
                      isRequired
                    />
                  ) : null}
                </div>
              </div>

              <Field
                isRequired
                size="lg"
                name={fields.minimumLength}
                label={"Minimum Length"}
                options={minimumLength}
                selectedValue={values[fields.minimumLength]}
                value={values[fields.minimumLength]}
                onChange={(value) => {
                  setFieldValue(fields.minimumLength, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />

              <div className="d-flex">
                <Field
                  size="xxs"
                  isRequired
                  name={fields.maximumLengthYears}
                  label={"Maximum Length"}
                  hasSuggestion
                  shouldDisplaySuggestion
                  suggestionDefaultText="Years"
                  type="number"
                  autoComplete="off"
                  value={values[fields.maximumLengthYears]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInputNumber}
                  min={0}
                  max={5}
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  <Field
                    size="xxs"
                    name={fields.maximumLengthMonths}
                    label={""}
                    hasSuggestion
                    shouldDisplaySuggestion
                    suggestionDefaultText="Months"
                    type="number"
                    autoComplete="off"
                    value={values[fields.maximumLengthMonths]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputNumber}
                    min={0}
                    max={11}
                  />
                </div>
              </div>

              <Field
                size="md"
                isRequired
                label="Sources available for determining loan amount"
                name={fields.sourceHierarchies}
                value={toMultiSelectValueById(
                  selectedsourceHierarchies,
                  sourcesList
                )}
                disabled={isEdit && !isSave}
                isMultiSelect
                options={sourcesList}
                popupContent={
                  <MultiSelectDropdown
                    label="Select Available Sources"
                    options={sourcesList}
                    onSelect={(value) =>
                      setFieldValue(fields.sourceHierarchies, value)
                    }
                    name={fields.sourceHierarchies}
                    value={values[fields.sourceHierarchies]}
                    disabled={isEdit && !isSave}
                  />
                }
                component={FieldDropSide}
              />

              <Field
                isRequired
                size="lg"
                name={fields.withdrawalBasis}
                label={"Withdrawal basis"}
                options={withdrawalBasis}
                selectedValue={values[fields.withdrawalBasis]}
                value={values[fields.withdrawalBasis]}
                onChange={(value) => {
                  setFieldValue(fields.withdrawalBasis, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />

              {values[fields.withdrawalBasis] === 2 &&
                isEmpty(selectedsourceHierarchies) && (
                  <SourceHierarchyList
                    sourceList={sourcesList}
                    selectedSources={selectedSources}
                    selectedsourceHierarchies={selectedsourceHierarchies}
                    state={state}
                    dispatch={dispatch}
                  />
                )}

              <Field
                size="md"
                isRequired
                label="Restricted Investments"
                name={fields.restrictedInvestments}
                value={toMultiSelectValueById(
                  selectedrestrictedInvestments,
                  investmentsList
                )}
                disabled={true}
                isMultiSelect
                options={investmentsList}
                popupContent={
                  <MultiSelectDropdown
                    label="Select Investments"
                    options={investmentsList}
                    name={fields.restrictedInvestments}
                    onSelect={(value) =>
                      setFieldValue(fields.restrictedInvestments, value)
                    }
                    value={values[fields.restrictedInvestments]}
                    disabled={true}
                  />
                }
                component={FieldDropSide}
              />

              <Field
                isRequired
                size="sm"
                name={fields.spousalConsentRequired}
                label={"Spousal Consent Required"}
                options={yesNoOptions}
                selectedValue={values[fields.spousalConsentRequired]}
                value={values[fields.spousalConsentRequired]}
                onChange={(value) => {
                  setFieldValue(fields.spousalConsentRequired, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.sponsorApprovalRequired}
                label={"Sponsor Approval Required"}
                options={yesNoOptions}
                selectedValue={values[fields.sponsorApprovalRequired]}
                value={values[fields.sponsorApprovalRequired]}
                onChange={(value) => {
                  setFieldValue(fields.sponsorApprovalRequired, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.refinancingAllowed}
                label={"Refinancing Allowed"}
                options={yesNoOptions}
                selectedValue={values[fields.refinancingAllowed]}
                value={values[fields.refinancingAllowed]}
                onChange={(value) => {
                  setFieldValue(fields.refinancingAllowed, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />

              <Field
                size="xxs"
                isRequired
                name={fields.processingTimeForLoan}
                label={"Processing Time for Loan"}
                hasSuggestion
                shouldDisplaySuggestion
                suggestionDefaultText="Days"
                type="number"
                autoComplete="off"
                value={values[fields.processingTimeForLoan]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={0}
                max={99}
              />

              <Field
                isRequired
                size="lg"
                name={fields.applicablePaymentMethodsLoan}
                label={"Applicable Payment Methods"}
                options={applicablePaymentMethodsLoan}
                selectedValue={values[fields.applicablePaymentMethodsLoan]}
                value={values[fields.applicablePaymentMethodsLoan]}
                onChange={(value) => {
                  setFieldValue(fields.applicablePaymentMethodsLoan, value);
                }}
                component={FieldMultiSelectButtonGroup}
                disabled={isEdit && !isSave}
              />

              <Field
                size="xxs"
                isRequired
                name={fields.waitingPeriodBetweenLoansPayoffAndLoanRequest}
                label={"Waiting period between loans payoff and loan request"}
                hasSuggestion
                shouldDisplaySuggestion
                suggestionDefaultText="Days"
                type="number"
                autoComplete="off"
                value={
                  values[fields.waitingPeriodBetweenLoansPayoffAndLoanRequest]
                }
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputNumber}
                min={0}
                max={9999}
              />

              <div className="d-flex">
                <Field
                  size="lg"
                  isRequired
                  label="Cure Period"
                  name={fields.curePeriod}
                  value={values[fields.curePeriod]}
                  disabled={isEdit && !isSave}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.CURE_PERIOD
                  )}
                  popupContent={
                    <SearchableList
                      label="Select Cure Period"
                      isNotTypeAhead
                      isRadio
                      selectedValue={values[fields.curePeriod]}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.CURE_PERIOD
                      )}
                      onSelect={(value) =>
                        setFieldValue(fields.curePeriod, value)
                      }
                    />
                  }
                  component={FieldDropSide}
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  {values[fields.curePeriod] === 2 ? (
                    <Field
                      size="xs"
                      isRequired
                      name={fields.curePeriodFixedNumberOfDays}
                      label={"Days"}
                      type="number"
                      autoComplete="off"
                      value={values[fields.curePeriodFixedNumberOfDays]}
                      onChange={handleChange}
                      disabled={isEdit && !isSave}
                      component={FieldInputNumber}
                      min={0}
                      max={999}
                    />
                  ) : null}
                </div>
              </div>
              <div className="d-flex">
                <Field
                  size="lg"
                  isRequired
                  label="Cure Period for Employee termination"
                  name={fields.curePeriodForEmployeeTermination}
                  value={values[fields.curePeriodForEmployeeTermination]}
                  disabled={isEdit && !isSave}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.CURE_PERIOD_EMPLOYEE_TERMINATION
                  )}
                  popupContent={
                    <SearchableList
                      label="Select Cure Period for employee Termination"
                      isNotTypeAhead
                      isRadio
                      selectedValue={
                        values[fields.curePeriodForEmployeeTermination]
                      }
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.CURE_PERIOD_EMPLOYEE_TERMINATION
                      )}
                      onSelect={(value) =>
                        setFieldValue(
                          fields.curePeriodForEmployeeTermination,
                          value
                        )
                      }
                    />
                  }
                  component={FieldDropSide}
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  {values[fields.curePeriodForEmployeeTermination] === 2 ? (
                    <Field
                      size="xs"
                      isRequired
                      name={
                        fields.curePeriodFixedNumberOfDaysForEmployeeTermination
                      }
                      label={"Days"}
                      type="number"
                      autoComplete="off"
                      value={
                        values[
                          fields
                            .curePeriodFixedNumberOfDaysForEmployeeTermination
                        ]
                      }
                      onChange={handleChange}
                      disabled={isEdit && !isSave}
                      component={FieldInputNumber}
                      min={0}
                      max={999}
                    />
                  ) : null}
                </div>
              </div>
              <Field
                isRequired
                size="lg"
                name={fields.defaultMethod}
                label={"Default Method"}
                options={defaultMethod}
                selectedValue={values[fields.defaultMethod]}
                onChange={(value) => {
                  setFieldValue(fields.defaultMethod, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                isRequired
                size="sm"
                name={fields.loanReAmortizationAllowed}
                label={"Loans re-amortization allowed?"}
                options={yesNoOptions}
                selectedValue={values[fields.loanReAmortizationAllowed]}
                value={values[fields.loanReAmortizationAllowed]}
                onChange={(value) => {
                  setFieldValue(fields.loanReAmortizationAllowed, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              {values[fields.loanReAmortizationAllowed] === true ? (
                <>
                  <Field
                    isRequired
                    name={fields.loanReAmortizationFee}
                    label={"Loan Re-Amortization Fee"}
                    type="number"
                    autoComplete="off"
                    value={values[fields.loanReAmortizationFee]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputDollar}
                    max={999.99}
                  />
                  <Field
                    size="sm"
                    isRequired
                    name={fields.numberOfLoanReAmotizationsAllowed}
                    label={"Number Of Re-amortization Allowed"}
                    type="number"
                    autoComplete="off"
                    value={values[fields.numberOfLoanReAmotizationsAllowed]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputNumber}
                    min={0}
                    max={9}
                  />
                </>
              ) : null}

              <Field
                isRequired
                name={fields.minimumLoanRepaymentAmount}
                label={"Minimum Loan Repayment Amount"}
                type="number"
                autoComplete="off"
                value={values[fields.minimumLoanRepaymentAmount]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputDollar}
                max={99999.99}
              />
              <Field
                isRequired
                size="lg"
                name={fields.loanApportioningMethod}
                label={"Loan apportioning method"}
                options={loanApportioningMethod}
                selectedValue={values[fields.loanApportioningMethod]}
                value={values[fields.loanApportioningMethod]}
                onChange={(value) => {
                  setFieldValue(fields.loanApportioningMethod, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              <Field
                size="sm"
                name={fields.isServiceRequirementApplicable}
                label={"Is Service Requirement applicable?"}
                options={yesNoOptions}
                selectedValue={values[fields.isServiceRequirementApplicable]}
                value={values[fields.isServiceRequirementApplicable]}
                onChange={(value) => {
                  setFieldValue(fields.isServiceRequirementApplicable, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
                isRequired
              />
              {values[fields.isServiceRequirementApplicable] === true ? (
                <div className="d-flex">
                  <Field
                    size="sm"
                    name={fields.serviceRequirementForLoanNumber}
                    label={"Service Requirement for Loan"}
                    type="number"
                    autoComplete="off"
                    value={values[fields.serviceRequirementForLoanNumber]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputNumber}
                    min={0}
                    max={99}
                    isRequired
                  />
                  &nbsp;&nbsp;&nbsp;
                  <div
                    style={{
                      marginLeft: "-3rem",
                    }}
                  >
                    <Field
                      size="xs"
                      label=""
                      name={fields.serviceRequirementForLoan}
                      value={values[fields.serviceRequirementForLoan]}
                      disabled={isEdit && !isSave}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.SERVICE_REQUIREMENT_FOR_LOAN
                      )}
                      popupContent={
                        <SearchableList
                          label="Select"
                          isNotTypeAhead
                          isRadio
                          selectedValue={
                            values[fields.serviceRequirementForLoan]
                          }
                          options={toOptionValuesFromMapper(
                            OPTIONS_DATA_MAPPER.SERVICE_REQUIREMENT_FOR_LOAN
                          )}
                          onSelect={(value) =>
                            setFieldValue(
                              fields.serviceRequirementForLoan,
                              value
                            )
                          }
                        />
                      }
                      component={FieldDropSide}
                    />
                    {/*<Field*/}
                    {/*    size="xs"*/}
                    {/*    label=""*/}
                    {/*    isRequired*/}
                    {/*    name={fields.serviceRequirementForLoanNumber}*/}
                    {/*    value={values[fields.serviceRequirementForLoanNumber]}*/}
                    {/*    disabled={isEdit && !isSave}*/}
                    {/*    placeholder="Month"*/}
                    {/*    popupContent={*/}
                    {/*        <SearchableList*/}
                    {/*            label="Select a month"*/}
                    {/*            isNotTypeAhead*/}
                    {/*            options={months.data}*/}
                    {/*            onSelect={(value) =>*/}
                    {/*                setFieldValue(*/}
                    {/*                    fields.serviceRequirementForLoanNumber,*/}
                    {/*                    value*/}
                    {/*                )*/}
                    {/*            }*/}
                    {/*            selectedValue={*/}
                    {/*                values[fields.serviceRequirementForLoanNumber]*/}
                    {/*            }*/}
                    {/*        />*/}
                    {/*    }*/}
                    {/*    component={FieldDropSide}*/}
                    {/*/>*/}
                  </div>
                </div>
              ) : null}
              <Field
                isRequired
                size="sm"
                name={fields.allowLoansIfAnotherLoanIsDelinquentDefaultDeemed}
                label={
                  "Allow Loans if another Loan is Delinquent / Default / Deemed"
                }
                options={yesNoOptions}
                selectedValue={
                  values[
                    fields.allowLoansIfAnotherLoanIsDelinquentDefaultDeemed
                  ]
                }
                value={
                  values[
                    fields.allowLoansIfAnotherLoanIsDelinquentDefaultDeemed
                  ]
                }
                onChange={(value) => {
                  setFieldValue(
                    fields.allowLoansIfAnotherLoanIsDelinquentDefaultDeemed,
                    value
                  );
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />

              <p className="font-weight-500 text-black">Interest</p>

              <div className="d-flex">
                <Field
                  size="md"
                  isRequired
                  label="Loan Interest Rate"
                  name={fields.loanInterestRate}
                  value={values[fields.loanInterestRate]}
                  disabled={isEdit && !isSave}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.LOAN_INTEREST_RATE
                  )}
                  popupContent={
                    <SearchableList
                      label="Select Loan Interest Rate"
                      isNotTypeAhead
                      isRadio
                      selectedValue={values[fields.loanInterestRate]}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.LOAN_INTEREST_RATE
                      )}
                      onSelect={(value) =>
                        setFieldValue(fields.loanInterestRate, value)
                      }
                    />
                  }
                  component={FieldDropSide}
                />
                &nbsp;&nbsp;&nbsp;
                <div
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  {values[fields.loanInterestRate] != 1 &&
                  values[fields.loanInterestRate] != null ? (
                    <Field
                      size="xxs"
                      name={fields.loanInterestRateValue}
                      label="Percentage"
                      type="number"
                      autoComplete="off"
                      value={values[fields.loanInterestRateValue]}
                      onChange={handleChange}
                      disabled={isEdit && !isSave}
                      component={FieldInputPercentage}
                      isRequired
                    />
                  ) : null}
                </div>
              </div>
              <Field
                size="sm"
                name={fields.allowParticipantsToChooseInterestRate}
                label={"Allow Participants to choose interest rate?"}
                options={yesNoOptions}
                selectedValue={
                  values[fields.allowParticipantsToChooseInterestRate]
                }
                value={values[fields.allowParticipantsToChooseInterestRate]}
                onChange={(value) => {
                  setFieldValue(
                    fields.allowParticipantsToChooseInterestRate,
                    value
                  );
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
                isRequired
              />
              {values[fields.allowParticipantsToChooseInterestRate] === true ? (
                <>
                  <Field
                    size="xxs"
                    name={fields.interestRateMinimum}
                    label="Interest Rate Minimum"
                    type="number"
                    autoComplete="off"
                    value={values[fields.interestRateMinimum]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputPercentage}
                    isRequired
                  />
                  <Field
                    size="xxs"
                    name={fields.interestRateMaximum}
                    label="Interest Rate Maximum"
                    type="number"
                    autoComplete="off"
                    value={values[fields.interestRateMaximum]}
                    onChange={handleChange}
                    disabled={isEdit && !isSave}
                    component={FieldInputPercentage}
                    isRequired
                  />
                </>
              ) : null}
              <Field
                size="xl"
                name={fields.interestRateUpdateFrequecy}
                label={"Interest rate update frequency"}
                options={interestRateUpdateFrequecy}
                selectedValue={values[fields.interestRateUpdateFrequecy]}
                value={values[fields.interestRateUpdateFrequecy]}
                onChange={(value) => {
                  setFieldValue(fields.interestRateUpdateFrequecy, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
                isRequired
              />

              <p className="font-weight-500 text-black">Exclusions</p>
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
                component={FieldDropSide}
              />
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
                      setFieldValue(fields.excludedEmploymentStatuses, value)
                    }
                    name={fields.excludedEmploymentStatuses}
                    value={values[fields.excludedEmploymentStatuses]}
                    disabled={isEdit && !isSave}
                  />
                }
                component={FieldDropSide}
              />

              <p className="font-weight-500 text-black">Fees</p>
              <Field
                size="sm"
                name={fields.allowParticipantsToChooseLoanFeeType}
                label={"Allow Participants to choose loan fee type?"}
                options={yesNoOptions}
                selectedValue={
                  values[fields.allowParticipantsToChooseLoanFeeType]
                }
                value={values[fields.allowParticipantsToChooseLoanFeeType]}
                onChange={(value) => {
                  setFieldValue(
                    fields.allowParticipantsToChooseLoanFeeType,
                    value
                  );
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
                isRequired
              />
              {values[fields.allowParticipantsToChooseLoanFeeType] ? (
                <Field
                  size="md"
                  name={fields.loanFeeTypeDeductedFrom}
                  label={"Loan Fee Type deducted from"}
                  options={loanFeeTypeDeductedFrom}
                  selectedValue={values[fields.loanFeeTypeDeductedFrom]}
                  value={values[fields.loanFeeTypeDeductedFrom]}
                  onChange={(value) => {
                    setFieldValue(fields.loanFeeTypeDeductedFrom, value);
                  }}
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                  isRequired
                />
              ) : null}
              <Field
                name={fields.feesPaymentMethodsApplicable}
                label={"Payment Methods Applicable"}
                options={feesPaymentMethodsApplicable}
                selectedValue={values[fields.feesPaymentMethodsApplicable]}
                value={values[fields.feesPaymentMethodsApplicable]}
                onChange={(value) => {
                  setFieldValue(fields.feesPaymentMethodsApplicable, value);
                }}
                component={FieldMultiSelectButtonGroup}
                disabled={isEdit && !isSave}
                isRequired
              />
              {showCheckFee && (
                <Field
                  isRequired
                  name={fields.checkFee}
                  label={"Check Fee"}
                  type="number"
                  autoComplete="off"
                  value={values[fields.checkFee]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInputDollar}
                  max={999.99}
                />
              )}
              {showEftFee && (
                <Field
                  isRequired
                  name={fields.eftFees}
                  label={"EFT Fee"}
                  type="number"
                  autoComplete="off"
                  value={values[fields.eftFees]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInputDollar}
                  max={999.99}
                />
              )}
              <Field
                name={fields.achFee}
                label="ACH Fee"
                type="number"
                autoComplete="off"
                value={values[fields.achFee]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputDollar}
                max={999.99}
              />
              <Field
                name={fields.overnightDeliveryFees}
                label="Overnight Delivery Fees"
                type="number"
                autoComplete="off"
                value={values[fields.overnightDeliveryFees]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputDollar}
                max={999.99}
              />
              <Field
                isRequired
                size="sm"
                name={fields.recurringLoanApplicable}
                label={"Is Recurring Loan Applicable?"}
                options={yesNoOptions}
                selectedValue={values[fields.recurringLoanApplicable]}
                value={values[fields.recurringLoanApplicable]}
                onChange={(value) => {
                  setFieldValue(fields.recurringLoanApplicable, value);
                }}
                component={FieldButtonGroup}
                disabled={isEdit && !isSave}
              />
              {values[fields.recurringLoanApplicable] === true ? (
                <Field
                  name={fields.recurringLoanFees}
                  label="Recurring Loan Fees"
                  type="number"
                  autoComplete="off"
                  value={values[fields.recurringLoanFees]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInputDollar}
                  max={999.99}
                  isRequired
                />
              ) : null}
              {values[fields.recurringLoanApplicable] === true ? (
                <Field
                  isRequired
                  size="lg"
                  name={fields.timingOfRecurringLoanFee}
                  label={"Timing of Recurring Loan Fee"}
                  options={timingOfRecurringLoanFee}
                  selectedValue={values[fields.timingOfRecurringLoanFee]}
                  value={values[fields.timingOfRecurringLoanFee]}
                  onChange={(value) => {
                    setFieldValue(fields.timingOfRecurringLoanFee, value);
                  }}
                  component={FieldButtonGroup}
                  disabled={isEdit && !isSave}
                />
              ) : null}
              <Field
                isRequired
                name={fields.loanFeeAmount}
                label="Loan Fee Amount"
                type="number"
                autoComplete="off"
                value={values[fields.loanFeeAmount]}
                onChange={handleChange}
                disabled={isEdit && !isSave}
                component={FieldInputDollar}
                max={999.99}
              />
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddLoanContainer;
