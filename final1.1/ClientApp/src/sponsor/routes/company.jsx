// import React from "react";
// import { Switch, Redirect } from "react-router-dom";
// import {
//   CompanySettings,
//   // Definitions,
//   EmployeeClassifications,
//   EmployeeClassificationsTypes,
//   EmployeeStatus,
//   IncorporationDetails,
//   ManagePayrollCalendar,
//   ManagePayrollFrequency,
//   PayrollFrequency,
//   ManageCompanyClassification,
//   EmployeeClassificationsAttribute,
//   ManageEmploymentStatus,
//   PayrollCalendarManagePayDates,
//   PayrollCalendarSettings,
//   PayrollCalendarPayDates,
//   CompanyCompensation,
// } from "../layouts";

// import { ROUTES, MANAGE_COMPANY_ROUTES, ApplicationRoute } from "../utils";

// export const ManageCompanyRoutes = () => {
//   return (
//     <Switch>
//       {/* <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.DEFINITIONS}/:companyId?`,
//           `${MANAGE_COMPANY_ROUTES.DEFINITIONS}/:flow(add|edit|save)/:companyId?`,
//         ]}
//         component={Definitions}
//       /> */}
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.COMPENSATION}/:flow(add|edit|save)/:companyId`,
//         ]}
//         component={CompanyCompensation}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.SETTINGS}/:flow(add|edit|save)/:companyId?`,
//         ]}
//         component={CompanySettings}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE}/:flow(add|edit|save)/:companyId?/:classificationType?`,
//         ]}
//         component={EmployeeClassificationsTypes}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS}/:flow(add|edit|save)/:companyId?/:classificationType?/:classificationId?`,
//         ]}
//         component={EmployeeClassifications}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE}/:flow(add|edit|save)/:companyId?/:classificationType?/:classificationId?/:attributeId?`,
//         ]}
//         component={EmployeeClassificationsAttribute}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS}/:flow(add|edit|save)/:companyId?`,
//         ]}
//         component={ManageEmploymentStatus}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.EMPLOYMENT_STATUS}/:flow(add|edit|save)/:companyId?/:statusId?`,
//         ]}
//         component={EmployeeStatus}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/:flow(add|edit|save)/:companyId?`,
//         ]}
//         component={IncorporationDetails}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_CALENDAR}/:flow(add|edit|save)/:companyId?`,
//         ]}
//         component={ManagePayrollCalendar}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_SETTINGS}/:flow(add|edit|save)/:companyId?/:frequencyId?`,
//         ]}
//         component={PayrollCalendarSettings}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_PAYDATES}/:flow(add|edit|save)/:companyId?/:frequencyId?`,
//         ]}
//         component={PayrollCalendarPayDates}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.PAYROLL_CALENDAR_MANAGE_PAYDATES}/:flow(add|edit|save)/:companyId?/:frequencyId?/:payDateId?`,
//         ]}
//         component={PayrollCalendarManagePayDates}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.MANAGE_PAYROLL_FREQUENCY}/:flow(add|edit|save)/:companyId?`,
//         ]}
//         component={ManagePayrollFrequency}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.PAYROLL_FREQUENCY}/:flow(add|edit|save)/:companyId?/:frequencyId?`,
//         ]}
//         component={PayrollFrequency}
//       />
//       <ApplicationRoute
//         exact
//         path={[
//           `${MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS}/:flow(add|edit|save)/:companyId?`,
//         ]}
//         component={ManageCompanyClassification}
//       />
//       <Redirect
//         exact
//         from={ROUTES.MANAGE_COMPANY}
//         to={`${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/add`}
//       />
//     </Switch>
//   );
// };
