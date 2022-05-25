import { mapperFormFields } from "..";
import {
  companyFormFields,
  planFormFields,
  eligibilityFormFields,
  payrollFormFields,
  censusFormFields,
  maintenanceFormFields,
  reportsFormFields,
} from "./";

export * from "./common";
export * from "./company";
export * from "./plan";
export * from "./eligibility";
export * from "./employee";
export * from "./payroll";
export * from "./maintenance";
export * from "./reports";
export * from "./enrollment";
export * from "./mapper";
export * from "./docoCenter";
export * from "./doco";
export const formFields = {
  ...companyFormFields,
  ...planFormFields,
  ...eligibilityFormFields,
  ...censusFormFields,
  ...payrollFormFields,
  ...maintenanceFormFields,
  ...reportsFormFields,
  ...mapperFormFields,
};
