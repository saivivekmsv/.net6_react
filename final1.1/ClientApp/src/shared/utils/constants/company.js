import { ROUTES } from "./";

export const MANAGE_COMPANY_ROUTES = {
  // DEFINITIONS: `${ROUTES.MANAGE_COMPANY}/definitions`,
  INCORPORATION_DETAILS: `${ROUTES.MANAGE_COMPANY}/incorporation-details`,
  SETTINGS: `${ROUTES.MANAGE_COMPANY}/settings`,
  COMPENSATION: `${ROUTES.MANAGE_COMPANY}/compensation`,
  MANAGE_EMPLOYEE_CLASSIFICATIONS: `${ROUTES.MANAGE_COMPANY}/manage-employee-classifications`,
  EMPLOYMENT_STATUS: `${ROUTES.MANAGE_COMPANY}/employment-status`,
  PAYROLL_FREQUENCY: `${ROUTES.MANAGE_COMPANY}/payroll-frequency`,
  EMPLOYEE_CLASSIFICATIONS: `${ROUTES.MANAGE_COMPANY}/employee-classifications`,
  EMPLOYEE_CLASSIFICATIONS_TYPE: `${ROUTES.MANAGE_COMPANY}/employee-classification-type`,
  MANAGE_COMPENSATION: `${ROUTES.MANAGE_COMPANY}/manage-compensation`,
  MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE: `${ROUTES.MANAGE_COMPANY}/employee-attribute-classifications`,
  MANAGE_EMPLOYMENT_STATUS: `${ROUTES.MANAGE_COMPANY}/manage-employment-status`,
  MANAGE_PAYROLL_FREQUENCY: `${ROUTES.MANAGE_COMPANY}/manage-payroll-frequency`,
  MANAGE_PAYROLL_CALENDAR: `${ROUTES.MANAGE_COMPANY}/manage-payroll-calendar`,
  PAYROLL_CALENDAR_SETTINGS: `${ROUTES.MANAGE_COMPANY}/payroll-calendar-settings`,
  PAYROLL_CALENDAR_PAYDATES: `${ROUTES.MANAGE_COMPANY}/payroll-calendar-paydates`,
  PAYROLL_CALENDAR_MANAGE_PAYDATES: `${ROUTES.MANAGE_COMPANY}/payroll-calendar-manage-paydates`,
};

export const MANAGE_COMPANY_MENU = [
  // {
  //   label: "Definition",
  //   path: MANAGE_COMPANY_ROUTES.DEFINITIONS,
  //   contentHeader: "Definition",
  //   breadCrumbs: [],
  //   childRoutes: [],
  // },

  {
    label: "Incorporation Details",
    path: MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS,
    contentHeader: "Incorporation Details",
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Settings",
    path: MANAGE_COMPANY_ROUTES.SETTINGS,
    contentHeader: "Settings",
    breadCrumbs: [],
    childRoutes: [],
  },
  {
    label: "Employee Classification",
    path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
    contentHeader: "Manage Employee Classifications",
    breadCrumbs: [],
    childRoutes: [
      MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
      MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
      MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE,
    ],
  },
  {
    label: "Employment Status",
    path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS,
    contentHeader: "Manage Employment Status",
    breadCrumbs: [],
    childRoutes: [MANAGE_COMPANY_ROUTES.EMPLOYMENT_STATUS],
  },
  {
    label: "Payroll Frequency",
    path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY,
    contentHeader: "Manage Payroll Frequency",
    breadCrumbs: [],
    childRoutes: [MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY],
  },
  {
    label: "Payroll Calendar",
    path: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
    contentHeader: "Manage Payroll Calendar",
    breadCrumbs: [],
    childRoutes: [
      MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
      MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
      MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES,
    ],
  },
  {
    label: "Compensation",
    path: MANAGE_COMPANY_ROUTES.COMPENSATION,
    contentHeader: "Compensation",
    breadCrumbs: [],
    childRoutes: [],
  },
];

export const ALL_MANAGE_COMPANY_ROUTES = [
  ...MANAGE_COMPANY_MENU,
  {
    contentHeader: "Employee Classifications Type",
    path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
    breadCrumbs: [
      {
        label: "Manage Employee Classifications",
        link: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
      },
    ],
  },
  {
    contentHeader: "Add Employee Classification",
    path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
    breadCrumbs: [
      {
        label: "Manage Employee Classifications",
        link: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
      },
      {
        label: "Employee Classification Type",
        link: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
      },
    ],
  },
  {
    contentHeader: "Add Attribute",
    path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE,
    breadCrumbs: [
      {
        label: "Manage Employee Classifications",
        link: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
      },
      {
        label: "Employee Classification Type",
        link: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
      },
      {
        label: "Employee Classification",
        link: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
      },
    ],
  },
  {
    contentHeader: "Employment Status",
    path: MANAGE_COMPANY_ROUTES.EMPLOYMENT_STATUS,
    breadCrumbs: [
      {
        label: "Manage Employment Status",
        link: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS,
      },
    ],
  },
  {
    contentHeader: "Payroll Frequency",
    path: MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY,
    breadCrumbs: [
      {
        label: "Manage Payroll Frequency",
        link: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY,
      },
    ],
  },
  {
    contentHeader: "Payroll Calendar",
    path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS,
    breadCrumbs: [
      {
        label: "Manage Payroll Calendar",
        link: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
      },
    ],
  },
  {
    contentHeader: "Payroll Calendar",
    path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES,
    breadCrumbs: [
      {
        label: "Manage Payroll Calendar",
        link: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
      },
    ],
  },
  {
    contentHeader: "Add Pay Date (Adhoc)",
    path: MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES,
    breadCrumbs: [
      {
        label: "Manage Payroll Calendar",
        link: MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR,
      },
    ],
  },
];

export const manageCompanyFormNames = {
  DEFINITIONS_MANAGE_COMPANY: "definitions_managecompany",
  INCORPORATION_DETAILS_MANAGE_COMPANY: "incorporationdetails_managecompany",
  SETTINGS_MANAGE_COMPANY: "settings_managecompany",
  EMPLOYEE_CLASSIFICATIONS_TYPE_MANAGE_COMPANY:
    "employeeclassificationtype_managecompany",
  EMPLOYEE_CLASSIFICATIONS_MANAGE_COMPANY:
    "employeeclassification_managecompany",
  EMPLOYMENT_STATUS_MANAGE_COMPANY: "employeestatus_managecompany",
  PAYROLL_FREQUENCY_MANAGE_COMPANY: "payrollfrequency_managecompany",
  PAYROLL_CALENDAR_SETTINGS_MANAGE_COMPANY:
    "payrollcalendarsettings_managecompany",
  PAYROLL_CALENDAR_ADDPAYDATES_MANAGE_COMPANY:
    "payrollcalendaraddpaydates_managecompany",
  MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE_MANAGE_COMPANY:
    "employeeclassificationattribute_managecompany",
  MANAGE_EMPLOYEE_CLASSIFICATIONS_MANAGE_COMPANY:
    "manageemployeeclassification_managecompany",
  MANAGE_COMPANY_COMPENSATIONS: "manage_company_compensations",
};

export const companyFormFields = {
  [manageCompanyFormNames.DEFINITIONS_MANAGE_COMPANY]: {
    companyName: "companyName",
    companyType: "companyType",
    sponsoringOrganizationId: "sponsoringOrganizationId",
    sponsoringOrganizationIdName: "sponsoringOrganizationIdName",
  },
  [manageCompanyFormNames.INCORPORATION_DETAILS_MANAGE_COMPANY]: {
    companyName: "companyName",
    address1: "address1",
    address2: "address2",
    country: "country",
    state: "state",
    city: "city",
    postalCode: "postalCode",
    phoneNumber: "phoneNumber",
    email: "email",
    website: "website",
    businessType: "businessType",
    taxedAs: "taxedAs",
    fisicalYearMonth: "fisicalYearMonth",
    fisicalYearDay: "fisicalYearDay",
    stateOfIncorporation: "stateOfIncorporation",
    companyStartDate: "companyStartDate",
    taxEIN: "taxEIN",
  },
  [manageCompanyFormNames.SETTINGS_MANAGE_COMPANY]: {
    modeOfHours: "modeOfHours",
    modeOfCompensation: "modeOfCompensation",
    isPayrollCalenderRequire: "isPayrollCalenderRequire",
    isFileGenerationRequire: "isFileGenerationRequire",
    modeOfFunding: "modeOfFunding",
  },
  [manageCompanyFormNames.EMPLOYEE_CLASSIFICATIONS_TYPE_MANAGE_COMPANY]: {
    employeeClassificationType: "employeeClassificationType",
    clientEligibilityClassificationRequired:
      "clientEligibilityClassificationRequired",
    classificationName: "classificationName",
    classificationTypeRequired: "classificationTypeRequired",
    multipleSelectionsAllowed: "multipleSelectionsAllowed",
  },
  [manageCompanyFormNames.EMPLOYEE_CLASSIFICATIONS_MANAGE_COMPANY]: {
    classificationName: "value",
    classificationCode: "code",
    effectiveStartDate: "effectiveStartDate",
    effectiveEndDate: "effectiveEndDate",
    classifications: "classifications",
  },
  [manageCompanyFormNames.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE_MANAGE_COMPANY]: {
    attributeName: "name",
    attributeValue: "value",
  },
  [manageCompanyFormNames.EMPLOYMENT_STATUS_MANAGE_COMPANY]: {
    employmentStatus: "employmentStatus",
    employmentStatusName: "employmentStatusName",
    employmentStatusCode: "employmentStatusCode",
  },
  [manageCompanyFormNames.PAYROLL_FREQUENCY_MANAGE_COMPANY]: {
    frequencyType: "frequencyType",
    worksOnSaturday: "worksOnSaturday",
    worksOnSunday: "worksOnSunday",
    startDay: "startDay",
    biWeeklyStartDate: "biWeeklyStartDate",
    startDate: "startDate",
    firstBeginDay: "firstBeginDay",
    secondBeginDay: "secondBeginDay",
    startMonth: "startMonth",
    startMonthFirstQuarter: "startMonthFirstQuarter",
    startMonthFirstHalfYear: "startMonthFirstHalfYear",
    startDateMonth: "startDateMonth",
    startDateDay: "startDateDay",
    frequencyName: "frequencyName",
  },
  [manageCompanyFormNames.PAYROLL_CALENDAR_SETTINGS_MANAGE_COMPANY]: {
    id: "id",
    frequencyType: "frequencyType",
    frequencyName: "frequencyName",
    scheduleBeginDate: "scheduleBeginDate",
    scheduleEndDate: "scheduleEndDate",
    effectivePayDateCount: "effectivePayDateCount",
    isScheduleExtensionApplicable: "isScheduleExtensionApplicable",
    holiday: "holiday",
    saturday: "saturday",
    sunday: "sunday",
  },
  [manageCompanyFormNames.PAYROLL_CALENDAR_ADDPAYDATES_MANAGE_COMPANY]: {
    beginDate: "beginDate",
    endDate: "endDate",
    payDate: "payDate",
  },
  [manageCompanyFormNames.MANAGE_COMPANY_COMPENSATIONS]: {
    name: "name",
    isIncluded: "isIncluded",
  },
};
