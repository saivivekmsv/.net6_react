export const errors = {
  companyName: {
    required: "Required",
    alreadyExist: "Company Name already exist",
  },
  companyType: {
    required: "Required",
  },
  sponsoringOrganizationId: {
    required: "Required",
    alreadyExist: "PL016 : Sponsoring Organization Name already exists",
    lengthExceeded:
      "Sponsoring Organization Name should not exceed 50 characters",
    characters:
      "Sponsoring Organization Name should not contain special characters",
  },
  masterClassificationName: {
    required: "CM048 : Required",
    alreadyExist: "CM049 : Classification Type already exists",
    length:
      "CM050 : Classification Type length should not exceed 50 characters",
    characters:
      "CM051 : Classification Type length should not contain special characters",
  },
  masterEmploymentStatus: {
    required: "CM052 : Required",
    alreadyExist: "CM053 : Employment Status already exists",
    length: "CM054 : Employment status should not exceed 50 characters",
    characters:
      "CM055 : Employment status should not contain special characters",
  },
  masterLoanTypeExists: {
    required: "Required",
    alreadyExist: "Loan Type already exists",
    length: "Loan Type length should not exceed 50 characters",
    characters: "Loan Type should not contain special characters",
  },
  einNo: {
    required: "Required",
    alreadyExist: "Tax EIN already exist",
  },
  planName: {
    required: "Required",
    alreadyExist: "Plan Name already exist",
  },
  rkPlanNumber: {
    required: "Required",
    alreadyExist: "Record Keeping Plan number already exists",
  },
  payrollFilterDateOverlap: {
    overlapError: "File received from and to date should not get overlapped",
  },
};

export const apiErrors = {
  404: {
    heading: "Unable to retrieve your data",
    reason: "Something went wrong! please try again.",
  },
  400: {
    heading: "Invalid Input",
    reason: "Please verify and re enter your details.",
  },
  500: {
    heading: "OOPS!",
    reason: "Something went wrong! please try again.",
  },
};
