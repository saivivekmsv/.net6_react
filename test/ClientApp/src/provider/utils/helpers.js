import React from "react";
import { Route } from "react-router-dom";
import {
  manageCompanyFormNames,
  managePlanFormNames,
  managePayrollFormNames,
} from "./";
import {
  map,
  get,
  isArray,
  memoize,
  isEmpty,
  toLower,
  upperFirst,
} from "lodash";
import { FLOW_TYPES, OPTIONS_DATA_MAPPER, planFormFields } from "./constants";
import AuthorizeRoute from "../components/api-authorization/AuthorizeRoute";

export const getCommaSeparatedValuesFromArr = (arr = []) => arr.join(", ");
export const populateManagePayrollFilterForm = (data) => {
  return {
    [managePayrollFormNames.PAYROLL_FILTER]: {
      companyId: get(data, "companyId"),
      planId: get(data, "planId"),
      fileStatus: get(data, "fileStatus"),
      fromDate: get(data, "fromDate"),
      toDate: get(data, "toDate"),
    },
  };
};
export const populateManageCompanyForm = (data) => {
  return {
    [manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY]: {
      companyName: get(data, "name"),
      companyType: get(data, "employerType"),
      sponsoringOrganizationId: get(data, "sponsoringOrganizationId"),
    },
    [manageCompanyFormNames.INCORPORATION_DETAILS_MANAGE_COMPANY]: {
      companyName: get(data, "name"),
      address1: get(data, "address1"),
      address2: get(data, "address2"),
      country: get(data, "country", "USA"),
      state: get(data, "state"),
      city: get(data, "city"),
      postalCode: get(data, "postalCode"),
      phoneNumber: get(data, "phoneNumber"),
      email: get(data, "email"),
      website: get(data, "website"),
      businessType: get(data, "businessType"),
      taxedAs: get(data, "taxedAs"),
      fisicalYearMonth: get(data, "fisicalYearMonth"),
      fisicalYearDay: get(data, "fisicalYearDay"),
      stateOfIncorporation: get(data, "stateOfIncorporation"),
      companyStartDate: get(data, "companyStartDate"),
      taxEIN: get(data, "taxEIN"),
      rkPlanNumber: get(data, "rkPlanNumber"),
      companyImage: get(data, "companyImage"),
    },
    [manageCompanyFormNames.SETTINGS_MANAGE_COMPANY]: {
      modeOfHours: get(data, "modeOfHours"),
      modeOfCompensation: get(data, "modeOfCompensation"),
      isPayrollCalenderRequire: get(data, "isPayrollCalenderRequire"),
      isFileGenerationRequire: get(data, "isFileGenerationRequire"),
      modeOfFunding: get(data, "modeOfFunding"),
    },
  };
};

export const populateManagePlanForm = (data) => {
  // return data;
  return {
    [managePlanFormNames.CREATE_PLAN]: {
      category: get(data, "category"),
      planType: get(data, "planType"),
      prototype: get(data, "prototype"),
      company: get(data, "company"),
      planName: get(data, "name"),
      planID: get(data, "id"),
      planLevel: get(data, "level"),
      AECompany: get(data, "company"),
      masterPlan: get(data, "masterPlan"),
      sponsoringOrganisation: get(data, "sponsoringOrganisation.name"),
      sponsoringOrganizationId: get(data, "sponsoringOrganisation.id"),
    },
    [managePlanFormNames.BASIC_DETAILS_MANAGE_PLAN]: {
      planName: get(data, "planName"),
      yearStartMonth: get(data, "startDate.month"),
      yearStartDate: get(data, "startDate.day"),
      yearEndMonth: get(data, "endDate.month"),
      yearEndDate: get(data, "endDate.day"),
      effectiveDate: get(data, "effectiveDate"),
      planTerminationDate: get(data, "planTerminationDate"),
      shortYearIndicator: get(data, "shortYearIndicator"),
      shortYearStartDate: get(data, "shortYearStartDate"),
      shortYearEndDate: get(data, "shortYearEndDate"),
      irsPlanNumber: get(data, "irsPlanNumber") || "",
      trsContractId: get(data, "trsContractId") || "",
      name: get(data, "planAdministrator.name"),
      mobilePhoneNumber:
        get(data, "planAdministrator.contact.mobilePhoneNumber") ||
        get(data, "planAdministrator.contact.workPhoneNumber"),
      email: get(data, "planAdministrator.contact.email"),
    },
    [managePlanFormNames.ADD_SPONSOR_MANAGE_PLAN]: {
      firstName: get(data, "firstName"),
      lastName: get(data, "lastName"),
      ssn: get(data, "ssn"),
      email: get(data, "email"),
      phoneNumber: get(data, "phoneNumber"),
    },
    [managePlanFormNames.ADD_TRUSTEE_MANAGE_PLAN]: {
      trusteeCompanyName: get(data, "trusteeCompanyName"),
      email: get(data, "email"),
      mobilePhoneNumber: get(data, "mobilePhoneNumber"),
      workPhoneNumber: get(data, "workPhoneNumber"),
      website: get(data, "website"),
      level: get(data, "level"),
      addToMaster: get(data, "addToMaster"),
    },
    [managePlanFormNames.MANAGE_RETIREMENT]: {
      earlyRetirement: get(data, "earlyRetirement"),
      earlyAgeYears: get(data, "earlyAgeYears"),
      earlyAgeMonths: get(data, "earlyAgeMonths"),
      earlyServiceYears: get(data, "earlyServiceYears"),
      earlyRetirementDateRule: get(data, "earlyRetirementDateRule"),
      normalRetirement: get(data, "normalRetirement"),
      normalAgeYears: get(data, "normalAgeYears"),
      normalAgeMonths: get(data, "normalAgeMonths"),
      normalServiceYears: get(data, "normalServiceYears"),
      normalRetirementDateRule: get(data, "normalRetirementDateRule"),
    },
    [manageCompanyFormNames.BASIC_SOURCES]: {
      sourceType: get(data, "sourceType"),
      sourceCategory: get(data, "sourceCategory"),
      sourceSubCategory: get(data, "sourceSubCategory"),
      sourceName: get(data, "sourceName"),
      recordKeepingNumber: get(data, "recordKeepingNumber"),
      effectiveStartDate: get(data, "effectiveStartDate"),
      isNewContributionAllowed: get(data, "isNewContributionAllowed"),
      isDisplayToParticipantWebsite: get(data, "isDisplayToParticipantWebsite"),
      isContributionManatory: get(data, "isContributionManatory"),
      contributionType: get(data, "contributionType"),
      limitMinimum: get(data, "limitMinimum"),
      limitMaximum: get(data, "limitMaximum"),

      maximumDollarCompensation: get(data, "maximumDollarCompensation"),
      rehireDeferralPercentage: get(data, "rehireDeferralPercentage"),
      contributionMethod: get(data, "contributionMethod"),
      allocationPercForRehires: get(data, "allocationPercForRehires"),
      otherPercForRehires: get(data, "otherPercForRehires"),
      shouldEnrollInAdiProgramme: get(data, "shouldEnrollInAdiProgramme"),
      adiApplicableTo: get(data, "adiApplicableTo"),
      periodOfIncrease: get(data, "periodOfIncrease"),
      autoDeferralIncrease: get(data, "autoDeferralIncrease"),
      maximumADI: get(data, "maximumADI"),
      subjectToAutoEnrollment: get(data, "subjectToAutoEnrollment"),
      defaultContributionForAutoEnrollment: get(
        data,
        "defaultContributionForAutoEnrollment"
      ),
      enrollmentType: "enrollmentType",
      responsibleMode: "responsibleMode",
      eligiblePaymentType: "eligiblePaymentType",
      employerContributionType: "employerContributionType",
      percentageOfCompensation: "percentageOfCompensation",
      periodForCalculation: "periodForCalculation",
      periodForMatchCalculation: "periodForMatchCalculation",
      sourceOfMatch: "sourceOfMatch",
      isSafeHarbourMatch: "isSafeHarbourMatch",
      isCalculationSuspended: "isCalculationSuspended",
      isCatchApplicable: "isCatchApplicable",
      isTrueUpApplicable: "isTrueUpApplicable",
      safeHarbourType: "safeHarbourType",
      enhancedshMatchPercentage: "enhancedshMatchPercentage",
      uptoPercentageOfDeferral: "uptoPercentageOfDeferral",
      percentageOfCalculation: "percentageOfCalculation",
      percentageOfCompensationMatched: "percentageOfCompensationMatched",
      firstTierMatchPercent: "firstTierMatchPercent",
      secondTierMatchPercent: "secondTierMatchPercent",
      thirdTierMatchPercent: "thirdTierMatchPercent",
      firstTierCompensationMatchPercent: "firstTierCompensationMatchPercent",
      secondTierCompensationMatchPercent: "secondTierCompensationMatchPercent",
      thirdTierCompensationMatchPercent: "thirdTierCompensationMatchPercent",
      employeeGroupsApplicable: "employeeGroupsApplicable",
      qmacType: "qmacType",
      qmacBefore1989: "qmacBefore1989",
      qnecBefore1989: "qnecBefore1989",
    },
    [managePlanFormNames.ADD_ELIGIBILITY]: {
      eligibilityRule: get(data, "eligibilityRuleFor"),
      eligibilityName: get(data, "name"),
      eligibilityDescription: get(data, "description"),
      exclusionType: get(data, "exclusionFromRule.exclusionType"),
      hire: get(data, "exclusionFromRule.dateOfHireType"),
      immediateEligibility: get(data, "immediateEligibility"),
      employeePopulation: get(data, "isRevaluationRequired"),
      isBreakInService: get(data, "isBreakInService"),
      applicableEligibilityRequirement: get(data, "eligibilityType"),
      yearsOfServiceDefinition: get(data, "yearsOfServiceDefinition"),
      eligibilityOption: get(data, "eligibilityOption"),
      age: get(data, "age"),
      yearsOfServiceHours: get(data, "elapsedTime.yearsOfServiceHours"),
      activeEmployee: get(data, "activeEmployee"),
      disabledEmployee: get(data, "disabledEmployee"),
      deceasedEmployee: get(data, "deceasedEmployee"),
      retiredEmployee: get(data, "retiredEmployee"),
      daily: get(data, "daily"),
      weekly: get(data, "weekly"),
      biweekly: get(data, "biweekly"),
      semiMonthly: get(data, "semiMonthly"),
      monthly: get(data, "monthly"),
      quarterly: get(data, "quarterly"),
      semiAnnually: get(data, "semiAnnually"),
      annually: get(data, "annually"),
      eligibilittyCalculationPeriod: get(
        data,
        "defaultEligibilityRule.eligibilittyCalculationPeriod"
      ),
      yearsOfServiceRequirement: get(
        data,
        "actualHours.yearsOfServiceRequirement"
      ),
      serviceCreditPeriod: get(data, "actualHours.serviceCreditPeriod"),
      consecutiveBreaksInService: get(data, "consecutiveBreaksInService"),
      breakInServiceDefinition: get(data, "breakInServiceDefinition"),
      sourceEligibilities: get(data, "sourceEligibilities"),
      hiredOnOrAfterDate: get(data, "exclusionFromRule.hiredOnOrAfterDate"),
      hiredOnOrBeforeDate: get(data, "exclusionFromRule.hiredOnOrBeforeDate"),
      // lengthOfServiceRequirement: get(
      //   data,
      //   "elapsedTime.lengthOfServiceRequirement"
      // ),
      monthsYearDropdown: get(data, "monthsYearDropdown"),
      // lengthOfService: get(data, "elapsedTime.lengthOfService"),
      otherComputationalMonths: get(data, "otherComputationalMonths"),
      hours: get(data, "hours"),
      lengthOfService: get(data, "lengthOfService"),
      period: get(data, "period"),
      eligibilityBreakInServices: get(
        data,
        "eligibilityBreakInServices",
        []
      ).map(({ breakInServiceRuleId }) => breakInServiceRuleId),
    },
  };
};

export const getPathWithParam = ({ path, pathParam, queryParam }) => {
  const isPathParamString =
    pathParam !== "" && ["number", "string"].includes(typeof pathParam);
  if (isPathParamString || pathParam) {
    const params = isArray(pathParam)
      ? pathParam.join("/").replace(`${FLOW_TYPES.ADD}/`, "")
      : pathParam;
    return `${path}/${params}${queryParam || ""}`;
  }
  return `${path}${queryParam || ""}`;
};

export const getAdvancedPathWithParam = ({ path, pathParam, queryParam }) => {
  const isPathParamString =
    pathParam !== "" && ["number", "string"].includes(typeof pathParam);
  if (isPathParamString || pathParam) {
    const params = isArray(pathParam) ? pathParam.join("/") : pathParam;
    return `${path}/${params}${queryParam || ""}`;
  }
  return `${path}${queryParam || ""}`;
};

export const getFlowBasedFormValues = (formValues, flow) => {
  if (flow === FLOW_TYPES.ADD) {
    return {};
  }
  return formValues;
};

export const tranformListToDropdownValues = (list = [], labelKey, valueKey) => {
  return map(list, (item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));
};

export const usDateFormat = (date) => {
  if (!date) {
    return null;
  }
  const jsDate = typeof date === "string" ? new Date(date) : date;
  // const dayAsStr = jsDate.toLocaleDateString();
  const dayAsStr =
    (jsDate.getMonth() > 8
      ? jsDate.getMonth() + 1
      : "0" + (jsDate.getMonth() + 1)) +
    "/" +
    (jsDate.getDate() > 9 ? jsDate.getDate() : "0" + jsDate.getDate()) +
    "/" +
    jsDate.getFullYear();
  return dayAsStr;
};

export const DateFormat = (date, symbol) => {
  if (!date) {
    return null;
  }
  const jsDate = typeof date === "string" ? new Date(date) : date;
  // const dayAsStr = jsDate.toLocaleDateString();
  const dayAsStr =
    (jsDate.getMonth() > 8
      ? jsDate.getMonth() + 1
      : "0" + (jsDate.getMonth() + 1)) +
    symbol +
    (jsDate.getDate() > 9 ? jsDate.getDate() : "0" + jsDate.getDate()) +
    symbol +
    jsDate.getFullYear();
  return dayAsStr;
};

export const getNullTableItem = (data) => {
  return !["", null, undefined].includes(data) ? (
    data
  ) : (
    <span className="null-data">NA</span>
  );
};

export const returnOnlyIfBoolean = (value) => {
  const isBoolean = typeof value === "boolean";
  if (isBoolean) {
    return value;
  }
  return undefined;
};

export const toOptionValuesFromMapper = memoize((obj) => {
  return Object.keys(obj).map((key) => ({
    label: obj[key],
    value: !isNaN(key) ? parseInt(key, 10) : key,
  }));
});

export const clearFieldValues = ({
  values = {},
  fieldsToExculde = [],
  fieldsToClear = [],
}) => {
  const fieldValues = {};
  Object.keys(values).forEach((key) => {
    if (
      (!isEmpty(fieldsToExculde) && !fieldsToExculde.includes(key)) ||
      (!isEmpty(fieldsToClear) && fieldsToClear.includes(key))
    ) {
      fieldValues[key] = null;
    } else {
      fieldValues[key] = values[key];
    }
  });
  return fieldValues;
};

export const getRandomThreeDigitValue = () => {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
};

export const normaliseClassificationValues = (classifications = []) => {
  const normalisedClassification = classifications.map((item) => {
    return {
      ...item,
      id: item.id < 0 ? undefined : item.id,
      employeeClassificationType: parseInt(item.employeeClassificationType, 10),
      isNew: undefined,
      employeeClassificationCodes: get(
        item,
        "employeeClassificationCodes",
        []
      ).map((codeItem) => ({
        ...codeItem,
        id: codeItem.id < 0 ? undefined : codeItem.id,
        isNew: undefined,
        attributes: get(codeItem, "attributes", []).map((attrItem) => ({
          ...attrItem,
          id: attrItem.id < 0 ? undefined : attrItem.id,
          isNew: undefined,
        })),
      })),
    };
  });
  return normalisedClassification;
};

export const getFieldsToBeTouched = (fields = {}) => {
  const temp = {};
  Object.keys(fields).forEach((field) => {
    temp[field] = true;
  });
  return temp;
};

export const getSingleCharDayName = (dayNumber) => {
  const dayMapper = {
    0: "S",
    1: "M",
    2: "T",
    3: "W",
    4: "T",
    5: "F",
    6: "S",
  };
  return dayMapper[dayNumber];
};

export const ApplicationRoute =
  process.env.NODE_ENV === "development" ? Route : AuthorizeRoute;

export const getSaveMessage = (isEdit, createMessage) => {
  return isEdit || !createMessage ? "Data saved successfully" : createMessage;
};

export const getFilteredInvestments = ({
  list,
  selectedInvestmentSearch,
  selectedInvestmentType,
  selectedInvestmentStatus,
}) => {
  return list.filter((item) => {
    const isInvestmentNameMatching =
      toLower(item.name).indexOf(toLower(selectedInvestmentSearch)) !== -1;

    const isInvestmentTypeMatching = selectedInvestmentType === item.type;

    const isInvestmentStatusMatching = selectedInvestmentStatus === item.status;

    if (
      !selectedInvestmentSearch &&
      !selectedInvestmentType &&
      (isNaN(selectedInvestmentStatus) || selectedInvestmentStatus === "")
    ) {
      return true;
    }

    if (
      isInvestmentNameMatching &&
      isInvestmentTypeMatching &&
      isInvestmentStatusMatching
    ) {
      return true;
    }

    if (
      (isNaN(selectedInvestmentStatus) || selectedInvestmentStatus === "") &&
      isInvestmentNameMatching &&
      isInvestmentTypeMatching
    ) {
      return true;
    }

    if (
      !selectedInvestmentType &&
      isInvestmentNameMatching &&
      isInvestmentStatusMatching
    ) {
      return true;
    }

    if (
      !selectedInvestmentSearch &&
      isInvestmentTypeMatching &&
      isInvestmentStatusMatching
    ) {
      return true;
    }

    if (
      !selectedInvestmentType &&
      (isNaN(selectedInvestmentStatus) || selectedInvestmentStatus === "") &&
      isInvestmentNameMatching
    ) {
      return true;
    }

    if (
      !selectedInvestmentSearch &&
      (isNaN(selectedInvestmentStatus) || selectedInvestmentStatus === "") &&
      isInvestmentTypeMatching
    ) {
      return true;
    }

    if (
      !selectedInvestmentSearch &&
      !selectedInvestmentType &&
      isInvestmentStatusMatching
    ) {
      return true;
    }
    return false;
  });
};

export const getScrollParent = (node, selector) => {
  if (node == null) {
    if (selector) {
      return document.querySelector(selector);
    }
    return null;
  }

  if (node.scrollHeight > node.clientHeight + 3) {
    return node;
  } else {
    return getScrollParent(node.parentNode, selector);
  }
};

export const getPlanBasicDetailsHeader = (values) => {
  const dataArr = [];
  const fields = planFormFields[managePlanFormNames.CREATE_PLAN];
  const category = OPTIONS_DATA_MAPPER.PLAN_CATERGORY[values[fields.category]];
  const planLevel = OPTIONS_DATA_MAPPER.PLAN_LEVEL[values.level];
  const planType = OPTIONS_DATA_MAPPER.PLAN_TYPES[values[fields.planType]];
  const isMepOrPep = ["MEP", "PEP"].includes(category);
  if (category) {
    dataArr.push({
      label: "Category",
      value: category,
    });
  }

  if (["Regular"].includes(category)) {
    dataArr.push({ label: "Type", value: planType });
    dataArr.push({
      label: "Prototype",
      value: values[fields.prototype] === 0 ? null : values[fields.prototype],
    });
    dataArr.push({ label: "Company", value: values[fields.companyName] });
  }
  if (isMepOrPep && planLevel === "Master") {
    dataArr.push({ label: "Level", value: planLevel });
    dataArr.push({ label: "Type", value: planType });
    dataArr.push({
      label: "Sponsoring Org.",
      value: get(values, "sponsoringOrganisation.name", ""),
    });
  }
  if (isMepOrPep && planLevel !== "Master") {
    dataArr.push({ label: "Level", value: planLevel });
    dataArr.push({ label: "Master Plan", value: values[fields.mepPlanId] });
    dataArr.push({ label: "Company", value: values[fields.companyId] });
  }
  if (["Prototype"].includes(category)) {
    dataArr.push({ label: "Type", value: planType });
  }
  return dataArr;
};

export const getFormattedSsn = (value) => {
  let val = (value || "").replace(/\D/g, "");
  val = val.replace(/^(\d{3})(\d{1})/, "$1-$2");
  val = val.replace(/(\d)-(\d{2})(\d{1})/, "$1-$2-$3");
  val = val.replace(/(\d)-(\d)-(\d{4}).*/, "$1-$2-$3");
  return val;
};
export const getNumber = (value) => {
  return value === 0 ? value : value || undefined;
};
export const getFormattedPhone = (value) => {
  let val = (value || "").replace(/\D/g, "");
  val = val.replace(/^(\d{3})(\d{1})/, "$1-$2");
  val = val.replace(/(\d)-(\d{3})(\d{1})/, "$1-$2-$3");
  val = val.replace(/(\d)-(\d)-(\d{4}).*/, "$1-$2-$3");
  return val;
};

export const getFormattedZip = (value) => {
  let val = (value || "").replace(/\D/g, "");
  val = val.replace(/^(\d{5})(\d{1})/, "$1-$2");
  val = val.replace(/(\d)-(\d{4}).*/, "$1-$2");
  return val;
};

export const getFormattedTaxEIN = (value) => {
  let val = (value || "").replace(/\D/g, "");
  val = val.replace(/^(\d{2})(\d{1})/, "$1-$2");
  val = val.replace(/(\d)-(\d{7}).*/, "$1-$2");
  return val;
};

export const transformMasterDataInfo = (list = []) => {
  return list.map((item) => ({
    ...item,
    email: get(item, "contactDetails.email"),
    phoneNumber:
      get(item, "contactDetails.mobilePhoneNumber") ||
      get(item, "contactDetails.workPhoneNumber"),
  }));
};

export const contextSharing = {
  setContext: (contextId, context = {}) => {
    sessionStorage.setItem(contextId, JSON.stringify(context));
  },
  getContext: (contextId) => {
    return JSON.parse(sessionStorage.getItem(contextId));
  },
  clearContext: (contextId) => {
    sessionStorage.removeItem(contextId);
  },
};

export const transformToMultiselectSave = (list, key) => {
  return (list || []).map((value) => ({
    id: 0,
    [key]: value,
  }));
};

export const replaceSpaceAndParseInt = (str = "") => {
  return parseInt(str.replace(/\s/g, ""), 10);
};

export const toFlowLayoutHeader = (header, flow) => {
  if (FLOW_TYPES.EDIT === flow) {
    return (header || "").replace(/add/gi, "");
  }
  return header;
};

export const toCurrency = (num = 0) => {
  return num.toLocaleString();
};

export const scrollToErrorControl = (name) => {
  const elem = document.querySelector(`[name="${name}"]`);
  if (elem) {
    elem.scrollIntoView({ block: "center", behavior: "smooth" });
  }
};

export const ssnMasking = (ssn = "") => {
  return ssn.length == 0
    ? null
    : ssn.replaceAll("-", "").length < 9
    ? ssn
    : `XXX-XX-${ssn.slice(-4)} `;
};

export const getParamsFromQueryString = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return (urlParams && urlParams.get(param)) || "";
};

export const stripHyphenForApi = (str = "") => {
  if (!str) {
    return "";
  }
  return str.replace(/-/g, "");
};

export function numberWithCommas(x) {
  return x.toLocaleString("en");
}

export const toMultiSelectValue = (selectedValues = [], options) => {
  if (isEmpty(selectedValues)) {
    return "";
  } else if (selectedValues.length > 1) {
    return `${selectedValues.length} Selected`;
  } else if (selectedValues.length === 1) {
    const result = options.filter((option) => option.id === selectedValues[0]);
    return result.length > 0 ? result[0].name : "";
  }
};

export const toMultiSelectValueById = (selectedValues = [], options) => {
  if (isEmpty(selectedValues)) {
    return "";
  } else if (selectedValues.length > 1) {
    return `${selectedValues.length} Selected`;
  } else if (selectedValues.length === 1) {
    const result = options.filter(
      (option) => option.value === selectedValues[0]
    );
    console.log("result", options);
    return result.length > 0 ? result[0].label : "";
  }
};

export const toSentenceCase = (str) => upperFirst(toLower(str));

export const formatDateForApiRequest = (date) => {
  let date_array = date.replaceAll("/", "-").split("-").reverse();
  return `${date_array[0]}-${date_array[2]}-${date_array[1]}`;
};

export const getMultiSelectListFromValue = (val, lastIndex) => {
  let result = [];
  for (let i = 1; i <= lastIndex; i++) {
    if ((i & val) === i) {
      result.push(i);
    }
  }
  return result;
};

export const getKeyUsingValue = (object, value) => {
  for (var key in Object.keys(object)) {
    if (object[key] === value) {
      return key;
    }
  }
  return undefined;
};
