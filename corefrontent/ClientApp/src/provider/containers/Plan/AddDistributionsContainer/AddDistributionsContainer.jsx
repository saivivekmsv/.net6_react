import React, { useContext, useState } from "react";
import { get, isEmpty, find } from "lodash";
import { Form } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  ManagePlanLayout,
  SearchableList,
  FieldDropSide,
  FieldInput,
} from "../../../components";
import {
  MANAGE_PLAN_ROUTES,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  required,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  clearFieldValues,
  getSaveMessage,
  transformToMultiselectSave,
  DISTRIBUTION_WITHDRAWAL_TYPE,
  getNumber,
} from "../../../utils";
import {
  clearLocalCacheByModel,
  createPlanStore,
  savePlanDetailsAction,
  setManagePageLevelData,
  setManagePlanFlow,
  setManagePlanToastInfo,
} from "../../../contexts";
import { useDeepEffect, useRouterParams } from "../../../abstracts";
import InServiceForm from "./InServiceForm";
import HardShipsForm from "./HardShipsForm";
import RMDForm from "./RMDForm";
import SeparationFromService from "./SeparationFromService";
import { faTrashAlt } from "@fortawesome/pro-regular-svg-icons";

const AddDistributionsContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(createPlanStore);
  const { planId, flow, distributionIndex } = useRouterParams();
  const distributionsData = get(state, "api.data.withdrawals", []);
  const intDistributionIndex = parseInt(distributionIndex, 10);
  const [newFlow, setNewFlow] = useState(
    !isNaN(distributionIndex) ? FLOW_TYPES.EDIT : ""
  );
  const formName = managePlanFormNames.ADD_DISTRIBUTIONS;
  const fields = formFields[formName];
  const formValues = get(distributionsData, intDistributionIndex, {});
  const withdrawalSources = get(formValues, fields.withdrawalSources, []);
  const sources = get(state, "api.data.sources", []).map((source) => {
    let withdrawalSource = find(withdrawalSources, { sourceId: source.id });
    return {
      ...source,
      withEarningType: get(withdrawalSource, "withEarningType", false),
      checked: isEmpty(withdrawalSource) ? false : true,
    };
  });

  const initialValuesForInService = {
    [fields.ageLimitApplicable]: true,
    [fields.years]: 59,
    [fields.months]: 6,
    [fields.waiveOffLimitApplicable]: false,
    [fields.processLesserAmountIfMaximumIsNotAvailable]: false,
    [fields.spouseConsentRequired]: false,
    [fields.sponsorApprovalRequired]: false,
    [fields.availableToBeneficiaries]: false,
    [fields.availableToAlternatePayees]: false,
    [fields.allowOptingOutOfFederlWithholdingTax]: false,
    [fields.allowOptingOutOfStateWithholdingTax]: false,
    [fields.allowChangingOfFederalWithholdingTax]: false,
    [fields.allowChangingOfStateWithholdingTax]: false,
    [fields.distributionAllocationMethodCommon]: [1],
    [fields.allowParticipantstoChooseFeesDeductedMethod]: false,
  };

  const initialValuesForHardship = {
    [fields.waiveOffLimitApplicable]: false,
    [fields.requiresInServiceWithdrawalPriorToHardshipRequest]: false,
    [fields.requiresLoanRequestPriorToHardshipRequest]: false,
    [fields.processLesserAmountIfMaximumIsNotAvailable]: false,
    [fields.spouseConsentRequired]: false,
    [fields.sponsorApprovalRequired]: false,
    [fields.availableToBeneficiaries]: false,
    [fields.availableToAlternatePayees]: false,
    [fields.allowOptingOutOfFederlWithholdingTax]: false,
    [fields.allowOptingOutOfStateWithholdingTax]: false,
    [fields.allowChangingOfFederalWithholdingTax]: false,
    [fields.allowChangingOfStateWithholdingTax]: false,
    [fields.lengthOfSuspensionApplicable]: false,
    [fields.restrictNumberOfHardshipsInDefinedPeriod]: false,
    [fields.allowParticipantstoChooseFeesDeductedMethod]: false,
    [fields.distributionAllocationMethodCommon]: [1],
  };

  const initialValuesForRMD = {
    [fields.waiveOffLimitApplicable]: false,
    [fields.processLesserAmountIfMaximumIsNotAvailable]: false,
    [fields.spouseConsentRequired]: false,
    [fields.sponsorApprovalRequired]: false,
    [fields.defaultPaymentFrequnecyForAutoRMD]: 1,
    [fields.calculationMethods]: [1],
    [fields.distributionAllocationMethodCommon]: [1],
    [fields.feesToBeDeductedFrom]: 2,
    [fields.paymentMethod]: [1],
  };

  const initialValuesForSFS = {
    [fields.waiveOffLimitApplicable]: false,
    [fields.processLesserAmountIfMaximumIsNotAvailable]: false,
    [fields.spouseConsentRequired]: false,
    [fields.sponsorApprovalRequired]: false,
    [fields.availableToBeneficiaries]: false,
    [fields.availableToAlternatePayees]: false,
    [fields.allowOptingOutOfFederlWithholdingTax]: false,
    [fields.allowOptingOutOfStateWithholdingTax]: false,
    [fields.allowChangingOfFederalWithholdingTax]: false,
    [fields.allowChangingOfStateWithholdingTax]: false,
    [fields.distributionAllocationMethodCommon]: [1],
    [fields.allowParticipantstoChooseFeesDeductedMethod]: false,
  };

  const onDeleteClick = () => {
    distributionsData.splice(intDistributionIndex, 1);
    savePlanDetailsAction(
      {
        withdrawals: distributionsData,
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        //const newPlanId = get(response, "plan.id");
        dispatch(clearLocalCacheByModel("withdrawalSources"));
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.DISTRIBUTIONS,
            pathParam: [FLOW_TYPES.EDIT, planId],
          })
        );
      }
    });
  };

  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.DISTRIBUTIONS,
        pathParam: [FLOW_TYPES.EDIT, planId],
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
      onClick: () => dispatch(clearLocalCacheByModel("withdrawalSources")),
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
      link: getPathWithParam({
        path: MANAGE_PLAN_ROUTES.DISTRIBUTIONS,
        pathParam: [FLOW_TYPES.EDIT, planId],
      }),
      onClick: () => dispatch(clearLocalCacheByModel("withdrawalSources")),
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
    const updatedValues = {
      ...formValues,
      ...values,
      [fields.checkFees]: getNumber(values[fields.checkFees]),
      [fields.eftFee]: getNumber(values[fields.eftFee]),
      [fields.recurringFee]: getNumber(values[fields.recurringFee]),
      [fields.overnightExpressDeliveryFee]: getNumber(
        values[fields.overnightExpressDeliveryFee]
      ),
      [fields.withdrawalOneTimeOriginateFee]: getNumber(
        values[fields.withdrawalOneTimeOriginateFee]
      ),
      [fields.rollOverFee]: getNumber(values[fields.rollOverFee]),
      [fields.minimumWithDrawalLimitAmount]: getNumber(
        values[fields.minimumWithDrawalLimitAmount]
      ),
      [fields.suspensionPeriodMonths]: getNumber(
        values[fields.suspensionPeriodMonths]
      ),
      [fields.suspensionPeriodYears]: getNumber(
        values[fields.suspensionPeriodYears]
      ),
      [fields.restrictedPeriodValue]: getNumber(
        values[fields.restrictedPeriodValue]
      ),
      [fields.maximumNoOfHardShips]: getNumber(
        values[fields.maximumNoOfHardShips]
      ),

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
        )?.filter((val) =>
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
        console.log(get(formValues, fields.excludedEmploymentStatuses, [])),
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

      [fields.withdrawalSources]: get(
        values,
        fields.withdrawalSources,
        []
      )?.map((source) => {
        return {
          sourceId: source.id,
          withEarningType: source.withEarningType,
          id:
            find(get(formValues, fields.withdrawalSources, []), {
              sourceId: source.id,
            })?.id || 0,
        };
      }),
      [fields.suspendedSources]: [
        ...transformToMultiselectSave(
          (values[fields.suspendedSources] || [])?.filter(
            (val) =>
              !get(formValues, fields.suspendedSources, [])
                .map((_) => _.sourceId)
                .includes(val)
          ),
          "sourceId"
        ),
        ...(get(formValues, fields.suspendedSources, []) || [])?.filter((val) =>
          (values[fields.suspendedSources] || []).includes(val.sourceId)
        ),
      ],

      //Conditional Field Clears
      [fields.waiveOffLimit]: values[fields.waiveOffLimitApplicable]
        ? getNumber(values[fields.waiveOffLimit])
        : null,
      [fields.maximumNumberOfDirectRolloverPayees]: getNumber(
        values[fields.maximumNumberOfDirectRolloverPayees]
      ),

      [fields.feesToBeDeductedFrom]: values[
        fields.allowParticipantstoChooseFeesDeductedMethod
      ]
        ? null
        : values[fields.feesToBeDeductedFrom] || null,
      [fields.numberOfWithdrawalAllowed]:
        values[fields.withdrawalLimitPerPeriod] &&
        values[fields.withdrawalLimitPerPeriod] !== 3
          ? values[fields.numberOfWithdrawalAllowed]
          : null,
      [fields.numberOfWithdrawalAllowed]: getNumber(
        values[fields.numberOfWithdrawalAllowed]
      ),
      [fields.years]: values[fields.ageLimitApplicable]
        ? values[fields.years]
        : null,
      [fields.months]: values[fields.ageLimitApplicable]
        ? values[fields.months]
        : null,
    };

    if (isEmpty(formValues)) {
      return [...distributionsData, updatedValues];
    }

    return distributionsData.map((distribution, index) => {
      if (index === intDistributionIndex) {
        return {
          ...distribution,
          ...updatedValues,
        };
      }
      return distribution;
    });
  };

  const onFormSubmit = (
    values,
    { setFieldError, setFieldTouched, setSubmitting }
  ) => {
    const { history } = props;
    console.log(getDataForSave(values));
    savePlanDetailsAction(
      {
        withdrawals: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (response.isSuccessful) {
        //const newPlanId = get(response,"plan.id");
        history.push(
          getPathWithParam({
            path: MANAGE_PLAN_ROUTES.DISTRIBUTIONS,
            pathParam: [flow, planId], // put the company id after crated
          })
        );

        dispatch(
          setManagePlanFlow({
            planId: planId,
          })
        );
        dispatch(
          setManagePageLevelData({
            formName: formName,
            fieldData: values,
          })
        );
        dispatch(
          setManagePlanToastInfo({
            showToast: true,
            toastMessage: getSaveMessage(
              distributionIndex,
              `Distribution ${
                OPTIONS_DATA_MAPPER.DISTRIBUTIONS_TYPE[
                  values[fields.withDrawalType]
                ]
              } created successfully`
            ),
          })
        );
        dispatch(clearLocalCacheByModel("withdrawalSources"));
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

  const isEdit = newFlow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;
  return (
    <Formik
      initialValues={{
        ...formValues,
        [fields.excludedEmploymentStatuses]: get(
          formValues,
          fields.excludedEmploymentStatuses,
          []
        )?.map((val) => val.employmentStatusId),
        [fields.excludedEmployeeClassifications]: get(
          formValues,
          fields.excludedEmployeeClassifications,
          []
        )?.map((val) => val.employeeClassificationId),
        [fields.withdrawalSources]: (sources || []).filter(
          (source) => source.checked
        ),
        [fields.suspendedSources]: get(
          formValues,
          fields.suspendedSources,
          []
        )?.map((val) => val.sourceId),
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
          setSubmitting,
          values,
          ...rest
        } = formProps;
        const onDistributionTypeChange = (value) => {
          const updatedValues = clearFieldValues({
            values,
            fieldsToExculde: [fields.withDrawalType],
          });
          switch (value) {
            case DISTRIBUTION_WITHDRAWAL_TYPE.In_Service:
              setValues({
                ...updatedValues,
                [fields.withDrawalType]: value,
                ...initialValuesForInService,
              });
              break;
            case DISTRIBUTION_WITHDRAWAL_TYPE.Hardship:
              setValues({
                ...updatedValues,
                [fields.withDrawalType]: value,
                ...initialValuesForHardship,
              });
              break;
            case DISTRIBUTION_WITHDRAWAL_TYPE.Required_Minimum_Distribution:
              setValues({
                ...updatedValues,
                [fields.withDrawalType]: value,
                ...initialValuesForRMD,
              });
              break;
            case DISTRIBUTION_WITHDRAWAL_TYPE.Separation_from_Service:
              setValues({
                ...updatedValues,
                [fields.withDrawalType]: value,
                ...initialValuesForSFS,
              });
              break;
            default:
              break;
          }
          setTouched({});
        };

        const onHardshipReasonChange = (value) => {
          const updatedValues = clearFieldValues({
            values,
            fieldsToClear: [fields.otherHardshipReason],
          });
          setValues({
            ...updatedValues,
            [fields.hardshipReason]: value,
          });
          setTouched({ [fields.otherHardshipReason]: false });
        };

        const isHardShips = [DISTRIBUTION_WITHDRAWAL_TYPE.Hardship].includes(
          values[fields.withDrawalType]
        );
        const isInService = [DISTRIBUTION_WITHDRAWAL_TYPE.In_Service].includes(
          values[fields.withDrawalType]
        );
        const isSfs = [
          DISTRIBUTION_WITHDRAWAL_TYPE.Separation_from_Service,
        ].includes(values[fields.withDrawalType]);
        const isRmd = [
          DISTRIBUTION_WITHDRAWAL_TYPE.Required_Minimum_Distribution,
        ].includes(values[fields.withDrawalType]);
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePlanLayout
              buttons={buttons}
              pageFlow={newFlow || flow}
              layoutHeader={distributionIndex && "Distribution"}
            >
              <Field
                size="md"
                isRequired
                label="Distribution Type"
                name={fields.withDrawalType}
                value={values[fields.withDrawalType]}
                disabled={isEdit || isSave}
                options={toOptionValuesFromMapper(
                  OPTIONS_DATA_MAPPER.DISTRIBUTIONS_TYPE
                )}
                popupContent={
                  <SearchableList
                    label="Select a Type"
                    isNotTypeAhead
                    isRadio
                    selectedValue={values[fields.withDrawalType]}
                    options={toOptionValuesFromMapper(
                      OPTIONS_DATA_MAPPER.DISTRIBUTIONS_TYPE
                    )}
                    onSelect={onDistributionTypeChange}
                  />
                }
                component={FieldDropSide}
              />
              {!isHardShips && (
                <Field
                  size="md"
                  isRequired
                  name={fields.withdrawalDescription}
                  label={"Withdrawal Description"}
                  type="text"
                  autoComplete="off"
                  value={values[fields.withdrawalDescription]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInput}
                />
              )}
              {isHardShips && (
                <Field
                  size="lg"
                  isRequired
                  label="Hardship Reason"
                  name={fields.hardshipReason}
                  value={values[fields.hardshipReason]}
                  disabled={isEdit && !isSave}
                  options={toOptionValuesFromMapper(
                    OPTIONS_DATA_MAPPER.DISTRIBUTIONS_HARDSHIP_REASONS
                  )}
                  popupContent={
                    <SearchableList
                      label="Select Hardship Reason"
                      isNotTypeAhead
                      isRadio
                      selectedValue={values[fields.hardshipReason]}
                      options={toOptionValuesFromMapper(
                        OPTIONS_DATA_MAPPER.DISTRIBUTIONS_HARDSHIP_REASONS
                      )}
                      onSelect={onHardshipReasonChange}
                    />
                  }
                  component={FieldDropSide}
                />
              )}
              {isHardShips && values[fields.hardshipReason] === 7 && (
                <Field
                  isRequired
                  name={fields.otherHardshipReason}
                  label={"Other Hardship Reason"}
                  type="text"
                  autoComplete="off"
                  value={values[fields.otherHardshipReason]}
                  onChange={handleChange}
                  disabled={isEdit && !isSave}
                  component={FieldInput}
                />
              )}
              <br />
              {isHardShips && (
                <HardShipsForm
                  {...formProps}
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                  isHardShips={isHardShips}
                  sources={sources}
                />
              )}
              {isInService && (
                <InServiceForm
                  {...formProps}
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                  isInService={isInService}
                  sources={sources}
                />
              )}
              {isSfs && (
                <SeparationFromService
                  {...formProps}
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                  isSfs={isSfs}
                  sources={sources}
                />
              )}
              {isRmd && (
                <RMDForm
                  {...formProps}
                  fields={fields}
                  isEdit={isEdit}
                  isSave={isSave}
                  isRmd={isRmd}
                />
              )}
            </ManagePlanLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddDistributionsContainer;
