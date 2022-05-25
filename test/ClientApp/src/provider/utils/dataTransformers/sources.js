import { get } from "lodash";
import { SOURCE_CATEGORY_NAME_MAPPING } from "../constants";
import { getNumber, transformToMultiselectSave } from "../helpers";
function setSourceType(sourceType, values, fieldName, defaultValue) {
  switch (sourceType) {
    case 2: {
      return get(values, "employeeDeferralSource." + fieldName, defaultValue);
      break;
    }
    case 4: {
      return get(values, "employeeOtherSource." + fieldName, defaultValue);
      break;
    }
    case 5: {
      return get(
        values,
        "employerDiscretionarySource." + fieldName,
        defaultValue
      );
      break;
    }
    case 6: {
      return get(values, "employerMatchSource." + fieldName, defaultValue);
      break;
    }
    case 7: {
      return get(values, "employerOtherSource." + fieldName, defaultValue);
      break;
    }
    default: {
      return get(values, "employerOtherSource." + fieldName, defaultValue);
      break;
    }
  }
}

export const toFormValue = (values, fields) => {
  return {
    [fields.sourceName]: get(values, "sourceName"),
    [fields.sourceType]: get(values, "sourceType", 1),
    [fields.sourceCategory]: get(values, "sourceCategory"),
    [fields.sourceSubCategory]: get(values, "sourceSubCategory"),
    [fields.sourceSubSubCategory]: get(values, "sourceSubSubCategory"),
    [fields.effectiveStartDate]: get(values, "effectiveStartDate", null),
    [fields.effectiveEndDate]: get(values, "effectiveEndDate", null),
    [fields.recordKeepingNumber]: get(values, "recordKeepingNumber"),
    [fields.isNewContributionAllowed]: get(
      values,
      "isNewContributionAllowed",
      false
    ),
    [fields.isDisplayToParticipantWebsite]: get(
      values,
      "isDisplayToParticipantWebsite",
      false
    ),
    [fields.isContributionManatory]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "isContributionManatory",
      false
    ),
    [fields.contributionType]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "contributionType",
      0
    ),
    [fields.limitMinimum]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "limitMinimum",
      null
    ),
    [fields.limitMaximum]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "limitMaximum",
      null
    ),
    [fields.maximumDollarCompensation]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "maximumDollarCompensation",
      null
    ),
    [fields.rehireDeferralPercentage]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "rehireDeferralPercentage",
      null
    ),
    [fields.contributionMethod]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "contributionMethod",
      0
    ),
    [fields.responsibleMode]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "responsibleMode",
      1
    ),
    [fields.eligiblePaymentType]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "eligiblePaymentType",
      0
    ),

    [fields.employerContributionType]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "employerContributionType",
      1
    ),
    [fields.percentageOfCompensation]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "percentageOfCompensation",
      0
    ),

    [fields.periodForCalculation]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "periodForCalculation",
      0
    ),
    [fields.periodForMatchCalculation]: get(
      values,
      "employerMatchSource.periodForMatchCalculation"
    ),
    [fields.sourceOfMatch]: get(
      values,
      "employerMatchSource.sourceOfMatch",
      []
    )?.map((val) => val.sourceId),

    [fields.isSafeHarbourMatch]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "isSafeHarbourMatch",
      1
    ),
    [fields.safeHarbourType]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "safeHarbourType",
      0
    ),
    [fields.enhancedshMatchPercentage]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "enhancedshMatchPercentage",
      0
    ),
    [fields.uptoPercentageOfDeferral]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "uptoPercentageOfDeferral",
      0
    ),

    [fields.isCalculationSuspended]: setSourceType(
      get(values, "sourceCategory"),
      values,
      "isCalculationSuspended",
      1
    ),

    [fields.isCatchApplicable]: get(
      values,
      "employerMatchSource.isCatchApplicable",
      false
    ),
    /*[fields.isTrueUpApplicable]: get(
      values,
      "employerDiscretionarySource.isTrueUpApplicable",
      false
    ),*/
    [fields.isThresholdApplicable]:
      get(values, "employerDiscretionarySource") === null
        ? get(values, "employerMatchSource.isThresholdApplicable", true)
        : get(
            values,
            "employerDiscretionarySource.isThresholdApplicable",
            true
          ),
    [fields.isTrueUpApplicable]:
      get(values, "employerDiscretionarySource") === null
        ? get(values, "employerMatchSource.isTrueUpApplicable", false)
        : get(values, "employerDiscretionarySource.isTrueUpApplicable", false),
    [fields.safeHarbourType]: get(
      values,
      "employerMatchSource.safeHarbourType"
    ),
    [fields.isLastDayRuleApplicable]: get(
      values,
      "employerMatchSource.isLastDayRuleApplicable"
    ),
    [fields.employmentStatus]: get(
      values,
      "employerMatchSource.employmentStatus",
      []
    )?.map((val) => val.employmentStatusId),
    [fields.enhancedShMatchPercentage]: get(
      values,
      "enhancedShMatchPercentage"
    ),
    [fields.upToDeferralPercentage]: get(values, "upToDeferralPercentage"),
    [fields.percentageOfCalculation]: get(
      values,
      "employerMatchSource.percentageOfCalculation"
    ),
    [fields.percentageOfCompensationMatched]: get(
      values,
      "employerMatchSource.percentageOfCompensation",
      0
    ),
    [fields.firstTierMatchPercent]: get(
      values,
      "employerMatchSource.firstTierMatchPercent",
      0
    ),
    [fields.secondTierMatchPercent]: get(
      values,
      "employerMatchSource.secondTierMatchPercent",
      0
    ),
    [fields.thirdTierMatchPercent]: get(
      values,
      "employerMatchSource.thirdTierMatchPercent",
      0
    ),
    [fields.firstTierCompensationMatchPercent]: get(
      values,
      "employerMatchSource.firstTierCompensationMatchPercent",
      0
    ),
    [fields.secondTierCompensationMatchPercent]: get(
      values,
      "employerMatchSource.secondTierCompensationMatchPercent",
      0
    ),
    [fields.thirdTierCompensationMatchPercent]: get(
      values,
      "employerMatchSource.thirdTierCompensationMatchPercent",
      0
    ),
    [fields.employeeGroupsApplicable]: get(values, "employeeGroupsApplicable"),
    [fields.qmacType]: get(values, "qmacType"),
    [fields.qmacType]: get(values, "qmacType"),
    [fields.qmacBefore1989]: get(values, "qmacBefore1989"),
    [fields.qnecBefore1989]: get(values, "qnecBefore1989"),
  };
};

export const toApiValue = (values, fields, formValues) => {
  const {
    isContributionManatory,
    contributionType,
    limitMaximum,
    limitMinimum,
    maximumDollarCompensation,
    rehireDeferralPercentage,
    contributionMethod,
    responsibleMode,
    eligiblePaymentType,
    employerContributionType,
    isSafeHarbourMatch,
    isCalculationSuspended,
    safeHarbourType,
    enhancedshMatchPercentage,
    uptoPercentageOfDeferral,
    isCatchApplicable,
    isThresholdApplicable,
    qmacType,
    percentageOfCompensation,
    percentageOfCalculation,
    isTrueUpApplicable,
    firstTierMatchPercent,
    secondTierMatchPercent,
    thirdTierMatchPercent,
    firstTierCompensationMatchPercent,
    secondTierCompensationMatchPercent,
    thirdTierCompensationMatchPercent,
    sourceOfMatch,
    sourceSubCategory,
    additionalDeferralSource,
    isLastDayRuleApplicable,
    employmentStatus,
    additionalMatchSources,
    additionalDiscretionarySources,
    periodForCalculation,
    ...rest
  } = values;
  const intSourceCategory = parseInt(values[fields.sourceCategory], 10);
  const isDeferral =
    intSourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Deferral;
  const isEmployeeOther =
    intSourceCategory === SOURCE_CATEGORY_NAME_MAPPING.EmployeeOther;
  const isEmployerDiscretionary =
    intSourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Discretionary;
  const isEmployerMatch =
    intSourceCategory === SOURCE_CATEGORY_NAME_MAPPING.Match;
  const isEmployerOther =
    intSourceCategory === SOURCE_CATEGORY_NAME_MAPPING.EmployerOther;
  const isClientMode = values[fields.responsibleMode] == 1;
  const isValidateMode = values[fields.responsibleMode] == 3;
  return {
    ...rest,
    sourceSubCategory: sourceSubCategory || undefined,
    ...(isDeferral && {
      employeeDeferralSource: {
        isContributionManatory,
        contributionType,
        limitMinimum,
        limitMaximum,
        maximumDollarCompensation,
        rehireDeferralPercentage,
        additionalDeferralSource,
      },
    }),
    ...(isEmployeeOther && {
      employeeOtherSource: {
        contributionType,
        limitMinimum,
        limitMaximum,
        maximumDollarCompensation,
        contributionMethod,
        rehireDeferralPercentage,
      },
    }),
    ...(isEmployerDiscretionary &&
      !isClientMode && {
        employerDiscretionarySource: {
          responsibleMode,
          eligiblePaymentType,
          employerContributionType,
          percentageOfCompensation,
          isSafeHarbourMatch,
          isCalculationSuspended,
          isThresholdApplicable,
          isTrueUpApplicable,
          additionalDiscretionarySources,
          periodForCalculation,
        },
      }),

    ...(isEmployerMatch &&
      isClientMode && {
        employerMatchSource: {
          responsibleMode,
        },
      }),
    ...(isEmployerDiscretionary &&
      isClientMode && {
        employerDiscretionarySource: {
          responsibleMode,
        },
      }),
    ...(isEmployerMatch &&
      !isClientMode && {
        employerMatchSource: {
          responsibleMode,
          eligiblePaymentType,
          employerContributionType,
          periodForCalculation,
          sourceOfMatch: [
            ...transformToMultiselectSave(
              (values[fields.sourceOfMatch] || [])?.filter(
                (val) =>
                  !get(formValues, "employerMatchSource.sourceOfMatch", [])
                    .map((_) => _.sourceId)
                    .includes(val)
              ),
              "sourceId"
            ),
            ...(
              get(formValues, "employerMatchSource.sourceOfMatch", []) || []
            )?.filter((val) =>
              (values[fields.sourceOfMatch] || []).includes(val.sourceId)
            ),
          ],
          employmentStatus: [
            ...transformToMultiselectSave(
              (values[fields.employmentStatus] || [])?.filter(
                (val) =>
                  !get(
                    formValues.employerMatchSource,
                    fields.employmentStatus,
                    []
                  )
                    .map((_) => _.employmentStatusId)
                    .includes(val)
              ),
              "employmentStatusId"
            ),

            ...get(
              formValues.employerMatchSource,
              fields.employmentStatus,
              []
            ).filter((val) =>
              (values[fields.employmentStatus] || []).includes(
                val.employmentStatusId
              )
            ),
          ].filter((x) => x != null),
          isSafeHarbourMatch,
          isCalculationSuspended,
          isThresholdApplicable,

          safeHarbourType: getNumber(get(values, fields.safeHarbourType, 0)),
          isCatchApplicable,
          enhancedshMatchPercentage,
          uptoPercentageOfDeferral,
          employerContributionType,
          percentageOfCompensation,
          percentageOfCalculation,
          isLastDayRuleApplicable,
          firstTierMatchPercent:
            isSafeHarbourMatch && safeHarbourType !== 3
              ? 100
              : parseInt(firstTierMatchPercent, 10),
          firstTierCompensationMatchPercent:
            isSafeHarbourMatch && safeHarbourType !== 3
              ? safeHarbourType === 1
                ? 3
                : 1
              : parseInt(firstTierCompensationMatchPercent, 10),
          secondTierMatchPercent:
            isSafeHarbourMatch && safeHarbourType !== 3
              ? 50
              : parseInt(secondTierMatchPercent, 10),
          secondTierCompensationMatchPercent:
            isSafeHarbourMatch && safeHarbourType !== 3
              ? safeHarbourType === 1
                ? 2
                : 5
              : parseInt(secondTierCompensationMatchPercent, 10),
          thirdTierMatchPercent: isSafeHarbourMatch
            ? 0
            : parseInt(thirdTierMatchPercent, 10),
          thirdTierCompensationMatchPercent: isSafeHarbourMatch
            ? 0
            : parseInt(thirdTierCompensationMatchPercent, 10),
          isTrueUpApplicable,
          additionalMatchSources,
        },
      }),
    ...(isEmployerOther && {
      employerOtherSource: {
        qmacType: qmacType || qmacType,
        qmacAfterTaxDoller: get(values, "qmacAfterTaxDoller"),
        qmacDeferralDoller: get(values, "qmacDeferralDoller"),
        qmacAfterTaxPercentage: get(values, "qmacAfterTaxPercentage"),
        qmacDeferrlPercentage: get(values, "qmacDeferrlPercentage"),
      },
    }),
    id: get(rest, "id", undefined),
    effectiveStartDate: get(rest, "effectiveStartDate", null),
    effectiveEndDate: get(rest, "effectiveEndDate", null),
  };
};
