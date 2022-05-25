export const ROUTES = {
  HOME: "/home",
  DASHBOARD: "/dashboard",
  COMPANY: "/companys",
  MANAGE_COMPANY: "/manage-company",
  PLAN: "/plans",
  CREATE_PLAN: "/manage-plan/create-plan",
  SUCCESS_PLAN: "/success-plan",
  MANAGE_PLAN: "/manage-plan",
  MANAGE_ELIGIBILITY: "/eligibility",
  MAPPER: "/mapper",
  MANAGE_MAPPER: "/manage-mapper",
  MAPPER_HOME: "/mapper-profile-summary",
  MANAGE_EMPLOYEE: "/employees",
  MANAGE_CENSUS: "/manage-census/employee-information",
  PAYROLL: "/payroll",
  MANAGE_PAYROLL: "/manage-payroll",
  PAYROLL_FILE_STATUS: "/payroll/file-status",
  PAYROLL_REPORTS: "/payroll/reports",
  MANAGE_MAINTENANCE: "/manage-maintenance",
  MANAGE_REPORTS: "/reports",
  CALCULATORS: "/calculators",
  ENROLLMENT: "/enrollment",
  TEMPLATES: "/templates",
  DOCO_CENTER: "/doco-center",
  DOCO: "/doco",
  SPONSOR: "/sponsor",
  OUTPUT_FILES: "/output-files",
};

export const includeExcludeIgnoreOptions = [
  {
    label: "Include",
    value: 1,
  },
  {
    label: "Exclude",
    value: 2,
  },
  {
    label: "Ignore",
    value: 3,
  },
];

export const yesNoOptions = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

export const calendarFrequencyOptions = [
  {
    label: "Years",
    value: 1,
  },
  {
    label: "Months",
    value: 2,
  },
];

export const inverseYesNoOptions = [
  {
    label: "Yes",
    value: false,
  },
  {
    label: "No",
    value: true,
  },
];

export const Enrollment_applyADITo = [
  {
    label: "Suspension",
    value: 1,
  },
  {
    label: "Termination",
    value: 2,
  },
  {
    label: "Both",
    value: 3,
  },
];
export const Enrollment_autoDeferralIncreaseApplicableTo = [
  {
    label: "Auto",
    value: 1,
  },
  {
    label: "Manual",
    value: 2,
  },
  {
    label: "Both",
    value: 3,
  },
];

export const Enrollment_periodOfIncrease = [
  {
    label: "Calendar year",
    value: 1,
  },
  {
    label: "Date of participation",
    value: 2,
  },
  {
    label: "Plan year",
    value: 3,
  },
];

export const Enrollment_allocationPercentageForReHire = [
  {
    label: "Original allocation",
    value: 1,
  },
  {
    label: "Other",
    value: 2,
  },
];
export const PLAN_STATUSES = {
  UnderConstruction: 0,
  PENDING_APPROVAL: 1,
  PENDING_ACTIVATE: 2,
  ACTIVATED: 3,
  INACTIVE: 4,
  TERMINATED: 5,
};

export const FLOW_TYPES = {
  ADD: "add",
  EDIT: "edit",
  SAVE: "save",
  VIEW: "view",
};

export const OPTIONS_DATA_MAPPER = {
  PERIOD_OF_CALCULATION: {
    0: "Per Payroll Period",
  },
  BUSINESS_TYPE: {
    1: "LLC",
    2: "PLC",
    3: "C-Corp",
    4: "S-Corp",
    5: "Partnership",
    6: "Sole Prop.",
    7: "Others",
  },
  COMPANY_TYPE: {
    0: "Regular",
    1: "MEP",
    2: "PEP",
  },
  TAXED_AS: {
    1: "Corp",
    2: "S-Corp",
    3: "Partner or Sole ",
  },
  MODE_OF_HRS_COMP: {
    1: "PayPeriod",
    2: "Year To Date",
  },
  MODE_OF_FUNDING: {
    1: "ACH Credit",
    2: "ACH Debit",
  },
  PAYROLLFREQUENCY_TYPE: {
    1: "Daily",
    2: "Weekly",
    3: "SemiMonthly",
    4: "Monthly",
    5: "Quarterly",
    6: "SemiAnnually",
    7: "Annually",
    8: "BiWeekly",
  },
  EMPLOYMENT_STATUS: {
    1: "Active",
    2: "Retired",
    3: "Terminated ",
    4: "Leave",
    5: "Military Leave",
    6: "Deceased",
    7: "Disabled",
    8: "Others",
  },
  EMPLOYEE_CLASSIFICATION_TYPE: {
    1: "Location",
    2: "Division",
    3: "Department",
    4: "Employee Type",
    5: "Excluded Class",
    6: "Union Indicator",
    7: "Client Eligibility",
    8: "Others",
  },
  PAY_DATE_BEHAVIOUR: {
    0: "No Change",
    1: "Move to Prior Business Date",
    2: "Move to Next Business Date",
  },
  SOURCES_STATUS_TYPE: {
    0: "Incomplete",
    1: "Complete",
  },
  SOURCES_ADDED_TOPLAN: {
    0: "",
    1: "Added To Plan",
  },
  SOURCE_CATEGORY_TYPES: {
    2: "Employee Deferral Sources",
    4: "Employee Other Sources",
    6: "Employer Match Sources",
    5: "Employer Discretionary Sources",
    7: "Employer Other Sources",
  },
  SOURCES_FORM_TYPES: {
    1: "Employee",
    2: "Employer",
  },
  SOURCES_FORM_EMPLOYEE_CATEGORIES: {
    2: "Deferral",
    4: "Other",
  },
  SOURCES_EMPLOYER_CATERGORIES: {
    5: "Discretionary",
    6: "Match",
    8: "Prevailing Wages",
    7: "Other",
  },
  SOURCES_FORM_DEFERRAL_SUB_CATEGORIES: {
    4: "Pre Tax",
    5: "Roth",
    6: "After Tax",
  },
  SOURCES_FORM_DEFERRAL_SUB_SUB_CATEGORIES: {
    1: "Regular",
    2: "Catch-Up",
  },
  SOURCES_FORM_OTHER_SUB_CATEGORIES: {
    7: "Pre Tax Rollover",
    8: "Roth Rollover",
    9: "After Tax Rollover",
  },
  SOURCES_FORM_EMPLOYER_OTHER_SUB_CATEGORIES: {
    1: "QMAC",
    2: "QNEC",
  },
  ALLOCATION_RULES_CONTRIBUTION_TYPE: {
    1: "Percentage",
    2: "Dollar",
  },
  ALLOCATION_RULES_PRCNT_REHIRES: {
    1: "Original Allocation Percentage",
    2: "Other",
  },
  SOURCES_CONTRIBUTION_METHOD: {
    1: "Check",
    2: "Wire",
    3: "Both",
  },
  SOURCES_EMPLOYER_RESPONSIBLE_FOR_CALC: {
    1: "Client",
    2: "Core",
    3: "Vaildate",
  },
  SOURCES_ELIGIBLE_PAY_DETERMINATION: {
    1: "Pay Date.",
    2: "Pay Period End Date",
  },
  SOURCE_SAFE_HARBOUR_TYPES: {
    1: "BASIC",
    2: "QACA",
    3: "Enhanced",
  },
  SOURCE_EMPLOYER_MATCH_CONTR_TYPE: {
    2: "Percentage Match on Deferral",
    3: "Tiered Match",
  },
  SOURCE_EMPLOYER_DISCRETIONARY_CONTR_TYPE: {
    1: "Percentage Of Compensation",
  },
  SOURCE_QMAC_QNEC_TYPE: {
    1: "Percentage",
    2: "Dollar",
  },
  ELIGIBILITY_TYPE: {
    1: "Plan",
    2: "Source",
  },
  ELIGIBILITY_STATUS: {
    0: "Eligible",
    1: "Ineligible",
  },
  EXCUSION_TYPE: {
    1: "Date of hire",
    2: "Employee classification",
    3: "Both",
  },
  DATE_OFHIRE: {
    1: "Hired on or before",
    2: "Hired between",
  },
  VESTING_METHOD: {
    1: "Hours Of Serivce",
    //2: "Equivalency",
    2: "Elapsed Time",
    3: "Equivalency",
  },
  ACCOUNT_TYPE: {
    1: "Savings",
    2: "Checking",
  },
  ACCOUNT_STATUS: {
    1: "Active",
    2: "Inactive",
  },
  RETIREMENT_TYPE: {
    1: "Age Only",
    2: "Age and Years of Service",
  },
  RETIREMENT_DATE_OPTIONS: {
    1: "Date the participant reaches early retirement",
    2: "First day of the month the participant reaches early retirement",
  },
  NORMAL_RETIREMENT_DATE_OPTIONS: {
    1: "Date the participant reaches normal retirement",
    2: "First day of the month the participant reaches normal retirement",
  },
  ENROLLMENT_PLAN_ENTRYDATE: {
    1: "First day of the month",
    2: "First day of the payroll period",
    3: "First day of the quarter",
    4: "First day of the plan year or first day of seventh month plan year",
    5: "First day of the plan year",
    6: "Immediate",
    7: "Others",
  },
  ENROLLMENT_PROSPECTIVEORRETROSPECTIVE: {
    1: "Following",
    2: "Preceding",
    3: "Nearest",
  },
  PAYROLL_FILE_STATUS_DATA: {
    0: "All",
    1: "Creation in progress",
    2: "Upload in progress",
    3: "Error Correction Required",
    4: "Pending Submission",
    5: "Awaiting Funding",
    6: "Awaiting Trade",
    7: "Completed",
    8: "Cancelled",
    9: "Deleted",
    12: "Error in File Processor",
    13: "SystemFailure",
  },

  // ENROLLMENT_PLAN_ENTRYDATE: {
  //   1: "Immediate",
  //   2: "First day of the month coinciding with or next following the date an employee meets the eligibility requirements",
  //   3: "First day of the month following the date an employee meets the eligibility requirements",
  //   4: "First day of the payroll coinciding with or next following the date an employee meets the eligibility requirements",
  //   5: "First day of the payroll period following the date an employee meets the eligibility requirements",
  //   6: "First day of the quarter coinciding with or next following the date an employee meets the eligibility requirements",
  //   7: "First day of the quarter following the date an employee meets the eligibility requirements",
  //   8: "First day of the plan year coinciding with or next following the date an employee meets the eligibility requirements",
  //   9: "First day of the plan year following the date an employee meets the eligibility requirements",
  //   10: "First day of the plan year or first day of the seventh month of the plan year coinciding with or next following the date an employee meets the eligibility requirements",
  //   11: "First day of the plan year or first day of the seventh month of the plan year following the date an employee meets the eligibility requirements",
  // },
  COMPENSATION_DEFINITIONS: {
    1: "IRC Section 3401(a)-Compensation subject to withholding",
    2: "IRC Section 3401(a)-Compensation subject to withholding + pre-tax amounts",
    3: "IRC Section 6041/6051 W2",
    4: "IRC Section 6041/6051 W2 + pre-tax amounts",
    5: "IRC Section 415(C)-All income",
    6: "IRC Section 415(C)-All income + pre-tax amounts",
  },
  COMPENSATION_CALCULATIONS: {
    1: "Paid after becoming a participant",
    2: "Paid during Plan Year",
    3: "Paid during Calendar Year",
  },
  COMPENSATION_CATEGORY_CALCULATIONS: {
    1: "Include",
    2: "Exclude",
    3: "Ignore",
  },
  COMPENSATION_EXCLUDE_TYPES: {
    1: "Overtime",
    2: "Bonus",
    3: "Commissions",
    4: "Vacation Pay",
    5: "Other",
  },
  COMPENSATION_EMPLOYEE_TYPES: {
    1: "HCE",
    2: "ALL",
  },
  DISTRIBUTIONS_TYPE: {
    1: "In-Service",
    2: "Hardship",
    3: "Required Minimum Distribution",
    4: "Separation from Service",
  },
  DISTRIBUTIONS_SOURCE_CATEGORY: {
    0: "All",
    2: "Employee Deferral Sources",
    4: "Employee Other Sources",
    5: "Employer Discretionary Sources",
    6: "Employer Match Sources",
    7: "Employer Other Sources",
  },
  DISTRIBUTIONS_HARDSHIP_REASONS: {
    1: "Certain medical expenses",
    2: "Home buying expenses for a primary residence",
    3: "Upto 12 months worth of tution and fees",
    4: "Expenses to prevent being foreclosed on or evicted",
    5: "Burial or funeral expenses",
    6: "Repair expenses to a principal residue",
    7: "Other",
  },
  DISTRIBUTION_WITHDRAWAL_TYPE: {
    1: "Dollar",
    2: "Percentage",
  },
  DISTRIBUTION_DETECT_FEES_FROM: {
    1: "Account Balance",
    2: "Request Amount",
  },
  DISTRIBUTION_DETECT_FEES_FROM_RMD: {
    2: "Request Amount",
  },
  INVESTMENT_STATUS: {
    2: "Open",
    3: "Open to New Investors",
    1: "Close",
  },
  INVESTMENT_TYPES: {
    1: "Model Portfolio",
    2: "Annuity",
    3: "Bond",
    4: "Brokerage",
    5: "CCT Fund",
    6: "Index Fund",
    7: "Lifestyle",
    8: "Mutual Fund",
    9: "Stock Fund",
    10: "Self-Directed",
  },
  INVESTMENT_CATEGORY: {
    1: "Aggressive Allocation",
    2: "Annuity",
    3: "Bank Loan",
    4: "Bear Market",
    5: "Communications",
    6: "Equity Energy",
    7: "Financials",
    8: "Health",
    9: "India Equity",
    10: "Multicurrency",
  },
  TYPE_OF_EARNINGS: {
    1: "Captial Gain",
    2: "Interest",
    3: "Dividends",
  },
  DIVIDEND_TYPE: {
    1: "Accrual",
    2: "Equity",
  },
  DIVIDEND_PROCESSING_DATE: {
    1: "Annually",
    2: "Quarterly",
    3: "Monthly",
    4: "Semi Monthly",
  },
  TEMP_INVESTMENTS: {
    1: "investment 01",
    2: "investment 02",
    3: "investment 03",
    4: "investment 04",
    5: "investment 05",
    6: "investment 06",
    7: "investment 07",
    8: "investment 08",
    9: "investment 09",
    10: "investment 10",
    11: "investment 11",
    12: "investment 12",
    13: "investment 13",
    14: "investment 14",
    15: "investment 15",
  },
  PROSPECTUS_DELIVERY_METHOD: {
    1: "Online",
    2: "Mail",
  },
  FREQUENCY_OF_PROSPECTUS_DISCLAIMER: {
    1: "Do Not Show",
    2: "Every Transfer",
    3: "Transfers into New Investments only",
  },
  INVESTMENT_VOLATILITY: {
    1: "Low",
    2: "Low to Moderate",
    3: "Moderate",
    4: "Moderate to High",
    5: "High",
  },
  INVESTMENT_SHARE_CLASS: {
    1: "None",
    2: "Class A",
    3: "Class B",
    4: "Class C",
    5: "Class D",
    6: "Class I",
    7: "Class R",
  },
  INVESTMENT_OBJECTIVE: {
    1: "Interest income without risk of loss of principal",
    2: "Long term growth of capital",
    3: "Match the performance of russell 2000 index",
    4: "Maximum total return",
    5: "Match the performance of standard & poor's 500 (S& P 500) index",
  },
  LOAN_TYPE: {
    1: "General Purpose",
    2: "Residential",
    3: "Other",
  },
  MANAGE_LOAN_TYPE: {
    1: "General Purpose",
    2: "COVID-19",
    3: "Hurricane",
    4: "Residential 00",
  },
  MAXIMUM_AMOUNT: {
    1: "Allowed by Loan Regulators",
    2: "Percentage of Balance",
    3: "Other",
  },
  CURE_PERIOD: {
    1: "End of Calendar Quarter following default quarter",
    2: "Fixed Number of days",
  },
  CURE_PERIOD_EMPLOYEE_TERMINATION: {
    1: "End of Calendar Quarter following default quarter",
    2: "Fixed Number of days",
  },
  SERVICE_REQUIREMENT_FOR_LOAN: {
    1: "Months",
    2: "Years",
  },
  LOAN_INTEREST_RATE: {
    1: "Prime",
    2: "Prime + a%",
    3: "Other",
  },
  STATUS_FOR_PLAN: {
    1: "93",
  },
  STATUS_FOR_SOURCE: {
    1: "2058",
  },
  TEMP_APPLICABLE_TYPES: {
    1: "Allocation Reallocation",
    2: "Rebalance",
    3: "Insider",
    4: "Loans",
    5: "Transfer In",
    6: "Transfer Out Hardship",
    7: "Withdrawal In-Service",
    8: "Withdrawal",
  },
  MODEL_INV_RISK_TYPE: {
    1: "Aggressive",
    2: "Moderate",
    3: "Average",
  },
  SOURCE_NAME_STATUS: {
    1: "EMP-PT",
    2: "ER-DISC",
    3: "EMP-ROTH",
    4: "ER-MATCH",
    5: "EMP-PT",
  },
  LOAN_STATUS: {
    1: "Active",
    2: "Default",
    3: "Deferred",
    4: "Closed",
  },
  PLAN_CATERGORY: {
    0: "Regular",
    1: "MEP",
    2: "PEP",
    3: "Prototype",
    4: "Common Remitter",
  },
  ELIBILITY_STATUS: {
    0: "Not Eligible",
    1: "Eligible",
  },
  ANNUITY_PAYMENTS: {
    1: "Fixed Date",
    2: "Participant Selected",
  },
  PLAN_TYPES: {
    1: "401(k)",
    2: "403(b)",
    3: "457",
    4: "SEP",
    5: "Money Purchase",
    6: "Profit Sharing",
    7: "SIMPLE IRA",
    8: "IRA",
    9: "SIMPLE 401(k)",
    10: "DefinedBenefit",
    11: "401(a)",
  },
  PLAN_STATUS_LIST: {
    0: "UnderConstruction",
    1: "ReadyForApproval",
    2: "Approved",
    3: "Active",
    //4: "InActive",
    5: "Terminated",
  },
  PLAN_STATUS_LIST_0: {
    0: "UnderConstruction",
    1: "ReadyForApproval",
    2: "Approved",
    3: "Active",
    4: "InActive",
    5: "Terminated",
  },
  PLAN_LEVEL: {
    1: "Master",
    2: "Adopting Employer",
  },
  ALLOCATION_FORMULA_APPLIES_TO: {
    1: "EmployeeClassification",
  },
  ELIGIBILITY_RULES: {
    1: "Date of Hire",
    2: "Employee Classification",
    3: "Both Date of Hire and Employee Classification",
    0: "None",
  },
  ADDITIONAL_ELIGIBILITY_RULES: {
    //1: "Date of Hire",
    2: "Employee Classification",
    //3: "Both Date of Hire and Employee Classification",
  },
  SERVICE_DEFINITIONS: {
    1: "Actual Hours",
    2: "Elapsed Time",
    3: "Equivalency",
  },
  ELIGIBILITY_REQUIREMENT: {
    1: "Age",
    2: "Service",
    4: "Both Age and Service",
  },
  ELIGIBILITY_CALCULATION: {
    1: "Anniversary of Hire",
    2: "Plan year after Anniversary of Hire",
    3: "Other Computational Period",
  },
  SERVICE_REQUIREMENT: {
    1: "One year of service",
    2: "Two years of service",
  },
  ONE_YEAR_SERVICE_REQUIREMENT: {
    1: "One year of service",
  },
  CREDIT_PERIOD: {
    1: "At the end of eligibility calculation period",
    2: "Immediately after the hours condition satisfied",
  },
  BREAK_SERVICE_RULE: {
    1: "One Year Hold Out",
    2: "Rule of parity",
  },
  LENGTH_OF_SERVICE: {
    1: "Days",
    2: "Months",
    3: "Years",
  },
  DATE_OF_HIRE: {
    1: "Hired on or after",
    2: "Hired on or before",
    3: "Hired between (inclusive)",
  },
  WITHDRAWAL_LIMIT_PERIOD: {
    1: "Annually",
    2: "Monthly",
    3: "Quarterly",
    4: "SemiAnnually",
    5: "NotApplicable",
  },
  MINIMUM_WITHDRAWAL_LIMIT: {
    1: "EACA",
    2: "QACA",
    3: "None",
  },
  VESTED_AT: {
    1: "Death",
    2: "Disability",
    3: "NRA",
    4: "ERA",
  },
  VESTING_METHODS: {
    1: "Hours of Service",
    2: "Elapsed Time",
    3: "Equivalency",
  },
  VESTING_COMPUTATION_PERIODS: {
    1: "Anniversary of Hire",
    2: "Plan Year",
  },
  FORFEITURE_TREATMENTS: {
    1: "Allocate to Participants",
    2: "Plan Expenses",
    3: "Reduce ER Contributions",
  },
  BASIC_SERVER_RULES: {
    1: "One Year Holdout",
    2: "Rule Of Parity",
    3: "5 Years Break In Service Rule",
  },
  GENDER: {
    M: "Male",
    F: "Female",
    U: "Unknown",
  },
  MARITAL_STATUS: {
    S: "Single",
    M: "Married",
    D: "Divorced",
    W: "Widower",
  },
  RECORD_TYPES_OPTIONS: {
    0: "All records",
    1: "Error records",
  },
  OPTOUT_RESET_FREQUENCY: {
    1: "Plan year start Date",
    2: "Anniversary of optout",
  },

  ENROLLMENT_APPY_ADI: {
    1: "Suspension",
    2: "Termination",
    3: "Both",
  },
  ADDITIONAL_AUTO_ENROLLMENT_OPTIONS: {
    1: "Date Of Hire",
    2: "Employee Classification",
    3: "Both",
  },
  SCHEDULER_FREQUENCY: {
    1: "Minutes",
    2: "Hours",
    3: "Day",
  },
};

export const DEFAULT_PROMPT_MESSAGE =
  "Your changes may be lost; Do you want to Continue?";

export const screenContext = {
  plan: "plan",
  company: "company",
};

export const contextIds = {
  planDetails: "planDetails",
  companyDetails: "companyDetails",
};

export const SOURCE_CATEGORY_NAME_MAPPING = {
  Deferral: 2,
  EmployeeOther: 4,
  Discretionary: 5,
  Match: 6,
  EmployerOther: 7,
};

export const SOURCE_SUB_CATEGORY_NAME_MAPPING = {
  Pre_Tax: 5,
  Catch_Up: 10,
  After_Tax: 4,
  Roth: 6,
  After_Tax_Rollover: 7,
  Pre_Tax_Rollover: 8,
  Roth_Rollover: 9,
  QMAC: 1,
  QNEC: 2,
};

export const ELIGIBILITY_RULE_MAPPING = {
  Plan: 1,
  Source: 2,
};

export const DISTRIBUTION_WITHDRAWAL_TYPE = {
  In_Service: 1,
  Hardship: 2,
  Required_Minimum_Distribution: 3,
  Separation_from_Service: 4,
};

export const FORM_PLACEHOLDERS = {
  ssn: "XXX-XX-XXXX",
  phone: "___-___-____",
  zip: "_____-____",
};

export const ENROLLMENT_DROPDOWN_OPTIONS = {
  EXCLUDED_EMPLOYEE_CLASSIFICATION: {
    1: "Classification 1",
    2: "Classification 2",
    3: "Classification 3",
    4: "Classification 4",
    5: "Classification 5",
  },
  EXCLUDED_EMPLOYEMENT_STATUS: {
    1: "Employment status 1",
    2: "Employment status 2",
    3: "Employment status 3",
    4: "Employment status 4",
    5: "Employment status 5",
  },
  WINDOW_PERIOD: {
    1: "After eligibility requirement date",
    2: "Before entry date",
    3: "After date of hire",
    4: "After eligibility run date",
  },
  WINDOW_PERIOD_FOR_REENROLLMENT: {
    1: "After optout reset",
  },
};

// export const INVESTMENTS_BASED_ON = {
//     Age : 1,
//     Birthdate : 2,
//     RetirementDate : 3,
// };
export const INVESTMENTS_BASED_ON = [
  {
    label: "Age",
    value: 1,
  },
  {
    label: "Birthdate",
    value: 2,
  },
  {
    label: "RetirementDate",
    value: 3,
  },
];
export const IRSCategory = {
  1: "Limit415",
  2: "Catch Up",
  3: "Compensation Limit",
  4: "HCE Definition",
  5: "Compensation For Key Employee",
  6: "Taxable Wage base",
  7: "Limit 402g",
  8: "Limit 408p",
  9: "Limit 219p",
  10: "Limit 457b2",
  11: "Minimum Compensation Amount 408k2",
  12: "Limit 457e18",
};
